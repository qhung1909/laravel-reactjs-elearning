<?php

namespace App\Http\Controllers;

use App\Models\Quiz;
use App\Models\Enroll;
use App\Models\QuizOption;
use App\Models\UserAnswer;
use App\Models\QuizSession;
use Illuminate\Support\Str;
use App\Models\QuizQuestion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class QuizOptionController extends Controller
{
    public function startQuiz($quizId)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Người dùng chưa đăng nhập.'], 401);
        }

        try {
            $quiz = Quiz::with('course')->find($quizId);
            if (!$quiz) {
                return response()->json(['message' => 'Quiz không tồn tại.'], 404);
            }

            $hasEnrolled = Enroll::where('user_id', Auth::id())
                ->where('course_id', $quiz->course_id)
                ->exists();

            if (!$hasEnrolled) {
                return response()->json(['message' => 'Bạn cần đăng ký khóa học để làm quiz này.'], 403);
            }

            $existingSession = QuizSession::where('user_id', Auth::id())
                ->where('quiz_id', $quizId)
                ->first();

            if ($existingSession) {
                $answeredQuestionsCount = UserAnswer::where('user_id', Auth::id())
                    ->whereIn('question_id', function ($query) use ($quizId) {
                        $query->select('question_id')
                            ->from('quizzes_questions')
                            ->where('quiz_id', $quizId);
                    })
                    ->count();

                if ($answeredQuestionsCount > 0) {
                    $existingSession->delete();
                }
            }

            $token = Str::random(60);
            $quizSession = QuizSession::create([
                'user_id' => Auth::id(),
                'quiz_id' => $quizId,
                'token' => $token,
                'status' => 'in_progress',
                'score' => 0,
                'started_at' => now()
            ]);

            return response()->json([
                'token' => $token,
                'message' => 'Bạn đã bắt đầu quiz mới.'
            ]);
        } catch (\Exception $e) {
            Log::error('Quiz start error: ' . $e->getMessage());
            return response()->json(['message' => 'Không thể tạo phiên quiz. Vui lòng thử lại.'], 500);
        }
    }


    public function submitAnswers(Request $request)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Người dùng chưa đăng nhập.'], 401);
        }

        $answers = $request->input('answers');
        $response = [];
        $userId = Auth::id();
        $quizSession = QuizSession::where('user_id', $userId)->latest()->first();

        if (!$quizSession) {
            return response()->json(['message' => 'Không tìm thấy phiên quiz.'], 404);
        }

        $questions = QuizQuestion::where('quiz_id', $quizSession->quiz_id)->get()->keyBy('question_id');

        $existingAnswers = UserAnswer::where('user_id', $userId)
            ->whereIn('question_id', $questions->keys())
            ->pluck('question_id', 'quiz_session_id')
            ->toArray();

        $correctAnswersCount = 0;

        foreach ($answers as $answer) {
            $questionId = $answer['question_id'];

            if (!isset($questions[$questionId])) {
                $response[] = [
                    'question_id' => $questionId,
                    'message' => 'Câu hỏi không tồn tại.',
                    'status' => 404,
                ];
                continue;
            }

            if (isset($existingAnswers[$quizSession->quiz_session_id]) && $existingAnswers[$quizSession->quiz_session_id] == $questionId) {
                $response[] = [
                    'question_id' => $questionId,
                    'message' => 'Người dùng đã trả lời câu hỏi này rồi.',
                    'status' => 403,
                ];
                continue;
            }

            $quizSessionId = $quizSession->quiz_session_id;

            switch ($questions[$questionId]->question_type) {
                case 'single_choice':
                    $this->handleSingleChoice($answer, $questions[$questionId], $response, $correctAnswersCount, $quizSessionId);
                    break;
                case 'mutiple_choice':
                    $this->handleMultipleChoice($answer, $questions[$questionId], $response, $correctAnswersCount, $quizSessionId);
                    break;
                case 'true_false':
                    $this->handleTrueFalse($answer, $questions[$questionId], $response, $correctAnswersCount, $quizSessionId);
                    break;
                case 'fill_blank':
                    $this->handleFillBlank($answer, $questions[$questionId], $response, $correctAnswersCount, $quizSessionId);
                    break;
                default:
                    $response[] = [
                        'question_id' => $questionId,
                        'message' => 'Loại câu hỏi không được hỗ trợ.',
                        'status' => 400,
                    ];
                    break;
            }
        }

        $quizSession->score += $correctAnswersCount;
        $quizSession->save();

        $answeredQuestions = DB::table('user_answers')
            ->where('user_id', $userId)
            ->where('quiz_session_id', $quizSession->quiz_session_id)
            ->distinct('question_id')
            ->count('question_id');

        $totalQuestions = $questions->count();

        if ($answeredQuestions == $totalQuestions) {
            try {
                $quizSession->update([
                    'status' => 'completed',
                    'token' => null,
                ]);
            } catch (\Exception $e) {
                Log::error('Error updating quiz session for user ' . $userId . ': ' . $e->getMessage());
            }
        } else {
            Log::info('Not all questions answered yet for user: ' . $userId);
        }

        return response()->json($response);
    }

    public function getScore(Request $request)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Người dùng chưa đăng nhập.'], 401);
        }

        $userId = Auth::id();

        $quizSession = QuizSession::where('user_id', $userId)
            ->where('status', 'completed')
            ->latest()
            ->first();

        if (!$quizSession) {
            return response()->json(['message' => 'Không tìm thấy phiên quiz đã hoàn thành.'], 404);
        }

        return response()->json([
            'quiz_session_id' => $quizSession->quiz_session_id,
            'score' => $quizSession->score,
            'message' => 'Điểm số được lấy ra thành công.'
        ]);
    }





    protected function handleSingleChoice($answer, $question, &$response, &$correctAnswersCount, $quizSessionId)
    {
        $validator = Validator::make($answer, [
            'option_id' => 'required|exists:quiz_options,option_id',
            'question_id' => 'required|exists:quizzes_questions,question_id',
        ]);

        if ($validator->fails()) {
            $response[] = [
                'question_id' => $question->question_id,
                'message' => $validator->errors(),
                'status' => 400,
            ];
            return;
        }

        $option = QuizOption::where('option_id', $answer['option_id'])
            ->where('question_id', $question->question_id)
            ->first();

        if (!$option) {
            $response[] = [
                'question_id' => $question->question_id,
                'message' => 'Lựa chọn không hợp lệ cho câu hỏi này.',
                'status' => 400,
            ];
            return;
        }

        UserAnswer::create([
            'user_id' => Auth::id(),
            'question_id' => $question->question_id,
            'option_id' => $option->option_id,
            'is_correct' => $option->is_correct,
            'quiz_session_id' => $quizSessionId,

        ]);

        if ($option->is_correct) {
            $correctAnswersCount++;
        }

        $response[] = [
            'question_id' => $question->question_id,
            'message' => $option->is_correct ? 'Câu trả lời đúng' : 'Câu trả lời sai',
            'is_correct' => $option->is_correct,
            'status' => 200,
        ];
    }

    protected function handleMultipleChoice($answer, $question, &$response, &$correctAnswersCount, $quizSessionId)
    {
        $validator = Validator::make($answer, [
            'option_ids' => 'required|array',
            'option_ids.*' => 'exists:quiz_options,option_id',
            'question_id' => 'required|exists:quizzes_questions,question_id',
        ]);

        if ($validator->fails()) {
            $response[] = [
                'question_id' => $question->question_id,
                'message' => $validator->errors(),
                'status' => 400,
            ];
            return;
        }

        $selectedOptions = $answer['option_ids'];
        $correctOptionIds = QuizOption::where('question_id', $question->question_id)
            ->where('is_correct', true)
            ->pluck('option_id')
            ->toArray();

        $allCorrectSelected = empty(array_diff($correctOptionIds, $selectedOptions));
        $anyIncorrectSelected = !empty(array_intersect($selectedOptions, QuizOption::where('question_id', $question->question_id)->where('is_correct', false)->pluck('option_id')->toArray())); // Có tùy chọn sai được chọn

        foreach ($selectedOptions as $optionId) {
            UserAnswer::create([
                'user_id' => Auth::id(),
                'question_id' => $question->question_id,
                'option_id' => $optionId,
                'is_correct' => $allCorrectSelected && !$anyIncorrectSelected,
                'quiz_session_id' => $quizSessionId,
            ]);
        }

        if ($allCorrectSelected && !$anyIncorrectSelected) {
            $correctAnswersCount++;
            $response[] = [
                'question_id' => $question->question_id,
                'message' => 'Câu trả lời đúng',
                'is_correct' => true,
                'status' => 200,
                'quiz_session_id' => $quizSessionId,
            ];
        } else {
            $response[] = [
                'question_id' => $question->question_id,
                'message' => 'Câu trả lời sai',
                'is_correct' => false,
                'status' => 200,
                'quiz_session_id' => $quizSessionId,
            ];
        }
    }


    protected function handleTrueFalse($answer, $question, &$response, &$correctAnswersCount, $quizSessionId)
    {
        $validator = Validator::make($answer, [
            'option_id' => 'required|exists:quiz_options,option_id',
        ]);

        if ($validator->fails()) {
            $response[] = [
                'question_id' => $question->question_id,
                'message' => $validator->errors(),
                'status' => 400,
            ];
            return;
        }

        $option = QuizOption::where('option_id', $answer['option_id'])
            ->where('question_id', $question->question_id)
            ->first();

        if (!$option) {
            $response[] = [
                'question_id' => $question->question_id,
                'message' => 'Lựa chọn không hợp lệ cho câu hỏi này.',
                'status' => 400,
            ];
            return;
        }

        UserAnswer::create([
            'user_id' => Auth::id(),
            'question_id' => $question->question_id,
            'option_id' => $option->option_id,
            'is_correct' => $option->is_correct,
            'quiz_session_id' => $quizSessionId,
        ]);

        if ($option->is_correct) {
            $correctAnswersCount++;
        }

        $response[] = [
            'question_id' => $question->question_id,
            'message' => $option->is_correct ? 'Câu trả lời đúng' : 'Câu trả lời sai',
            'is_correct' => $option->is_correct,
            'status' => 200,
            'quiz_session_id' => $quizSessionId,
        ];
    }

    protected function handleFillBlank($answer, $question, &$response, &$correctAnswersCount, $quizSessionId)
    {
        $validator = Validator::make($answer, [
            'text_answer' => 'required|string',
        ]);

        if ($validator->fails()) {
            $response[] = [
                'question_id' => $question->question_id,
                'message' => $validator->errors(),
                'status' => 400,
            ];
            return;
        }

        $correctAnswer = QuizOption::where('question_id', $question->question_id)
            ->where('is_correct', true)
            ->first();

        if (!$correctAnswer) {
            $response[] = [
                'question_id' => $question->question_id,
                'message' => 'Không tìm thấy đáp án đúng cho câu hỏi này.',
                'status' => 404,
            ];
            return;
        }

        $isCorrect = strtolower(trim($answer['text_answer'])) === strtolower(trim($correctAnswer->answer));

        UserAnswer::create([
            'user_id' => Auth::id(),
            'question_id' => $question->question_id,
            'text_answer' => $answer['text_answer'],
            'is_correct' => $isCorrect,
            'quiz_session_id' => $quizSessionId,
        ]);

        if ($isCorrect) {
            $correctAnswersCount++;
        }

        $response[] = [
            'question_id' => $question->question_id,
            'message' => $isCorrect ? 'Câu trả lời đúng' : 'Câu trả lời sai',
            'is_correct' => $isCorrect,
            'status' => 200,
            'quiz_session_id' => $quizSessionId
        ];
    }
    public function index($questionId)
    {
        $options = QuizOption::with('question')  
                             ->where('question_id', $questionId)
                             ->get();
    
        return response()->json($options);
    }
    
    

    public function store(Request $request, $questionId)
    {
        if (!Auth::check()) {
            return response()->json([
                'message' => 'Người dùng chưa đăng nhập.',
            ], 401);
        }

        $validator = Validator::make($request->all(), [
            'options' => 'required|array',
            'options.*.answer' => 'required|string|max:255',
            'options.*.is_correct' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $optionsData = array_map(function ($option) use ($questionId) {
            return [
                'question_id' => $questionId,
                'answer' => $option['answer'],
                'is_correct' => $option['is_correct'],
            ];
        }, $request->options);

        $options = QuizOption::insert($optionsData);

        return response()->json($options, 201);
    }

    public function update(Request $request, $questionId)
    {
        if (!Auth::check()) {
            return response()->json([
                'message' => 'Người dùng chưa đăng nhập.',
            ], 401);
        }

        $validator = Validator::make($request->all(), [
            'options' => 'required|array',
            'options.*.id' => 'required|exists:quiz_options,option_id', 
            'options.*.answer' => 'sometimes|required|string|max:255',
            'options.*.is_correct' => 'sometimes|required|boolean',
        ]);
        

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        foreach ($request->options as $optionData) {
            $option = QuizOption::where('question_id', $questionId)->find($optionData['id']);
            if ($option) {
                $option->update([
                    'answer' => $optionData['answer'] ?? $option->answer,
                    'is_correct' => $optionData['is_correct'] ?? $option->is_correct,
                ]);
            }
        }
        

        return response()->json(['message' => 'Options updated successfully']);
    }

    public function destroy($questionId, $id)
    {
        if (!Auth::check()) {
            return response()->json([
                'message' => 'Người dùng chưa đăng nhập.',
            ], 401);
        }

        $option = QuizOption::where('question_id', $questionId)->find($id);
        if (!$option) {
            return response()->json(['message' => 'Option not found'], 404);
        }

        $option->delete();
        return response()->json(['message' => 'Option deleted successfully']);
    }
}
