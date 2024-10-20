<?php

namespace App\Http\Controllers;

use App\Models\QuizOption;
use App\Models\UserAnswer;
use App\Models\QuizSession;
use Illuminate\Support\Str;
use App\Models\QuizQuestion;
use Illuminate\Http\Request;
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
            $existingSession = QuizSession::where('user_id', Auth::id())
                ->where('quiz_id', $quizId)
                ->first();

            if ($existingSession) {
                return response()->json(['message' => 'Bạn đã bắt đầu quiz này rồi.'], 409);
            }

            $token = Str::random(60);

            $quizSession = QuizSession::create([
                'user_id' => Auth::id(),
                'quiz_id' => $quizId,
                'token' => $token,
            ]);

            return response()->json(['token' => $token]);
        } catch (\Exception $e) {
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

        $correctAnswersCount = 0;

        foreach ($answers as $answer) {
            $questionId = $answer['question_id'];

            $question = QuizQuestion::find($questionId);
            if (!$question) {
                $response[] = [
                    'question_id' => $questionId,
                    'message' => 'Câu hỏi không tồn tại.',
                    'status' => 404,
                ];
                continue;
            }

            $existingAnswer = UserAnswer::where('user_id', $userId)
                ->where('question_id', $questionId)
                ->first();

            if ($existingAnswer) {
                $response[] = [
                    'question_id' => $questionId,
                    'message' => 'Người dùng đã trả lời câu hỏi này rồi.',
                    'status' => 403,
                ];
                continue;
            }

            switch ($question->question_type) {
                case 'single_choice':
                    $this->handleSingleChoice($answer, $question, $response, $correctAnswersCount);
                    break;
                case 'mutiple_choice':
                    $this->handleMultipleChoice($answer, $question, $response, $correctAnswersCount);
                    break;
                case 'true_false':
                    $this->handleTrueFalse($answer, $question, $response, $correctAnswersCount);
                    break;
                case 'fill_blank':
                    $this->handleFillBlank($answer, $question, $response, $correctAnswersCount);
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

        $totalQuestions = QuizQuestion::where('quiz_id', $quizSession->quiz_id)->count();
        $questionIds = QuizQuestion::where('quiz_id', $quizSession->quiz_id)->pluck('question_id');
        $answeredQuestions = UserAnswer::where('user_id', $userId)
            ->whereIn('question_id', $questionIds)
            ->distinct() 
            ->count('question_id');


        if ($answeredQuestions === $totalQuestions) {
            try {
                $quizSession->update([
                    'status' => 'completed',
                    'token' => null,
                ]);
                Log::info('Quiz session updated to completed.');
            } catch (\Exception $e) {
                Log::error('Error updating quiz session: ' . $e->getMessage());
            }
        } else {
            Log::info('Not all questions answered yet.');
        }

        return response()->json($response);
    }

    protected function handleSingleChoice($answer, $question, &$response, &$correctAnswersCount)
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

    protected function handleMultipleChoice($answer, $question, &$response, &$correctAnswersCount)
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

        $allCorrectSelected = !array_diff($correctOptionIds, $selectedOptions);
        $anyIncorrectSelected = array_diff($selectedOptions, $correctOptionIds);

        if ($allCorrectSelected && empty($anyIncorrectSelected)) {
            foreach ($selectedOptions as $optionId) {
                UserAnswer::create([
                    'user_id' => Auth::id(),
                    'question_id' => $question->question_id,
                    'option_id' => $optionId,
                    'is_correct' => true,
                ]);
            }
            $correctAnswersCount++;
            $response[] = [
                'question_id' => $question->question_id,
                'message' => 'Câu trả lời đúng',
                'is_correct' => true,
                'status' => 200,
            ];
        } else {
            foreach ($selectedOptions as $optionId) {
                UserAnswer::create([
                    'user_id' => Auth::id(),
                    'question_id' => $question->question_id,
                    'option_id' => $optionId,
                ]);
            }
            $response[] = [
                'question_id' => $question->question_id,
                'message' => 'Câu trả lời sai',
                'is_correct' => false,
                'status' => 200,
            ];
        }
    }

    protected function handleTrueFalse($answer, $question, &$response, &$correctAnswersCount)
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

    protected function handleFillBlank($answer, $question, &$response, &$correctAnswersCount)
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
        ]);

        if ($isCorrect) {
            $correctAnswersCount++;
        }

        $response[] = [
            'question_id' => $question->question_id,
            'message' => $isCorrect ? 'Câu trả lời đúng' : 'Câu trả lời sai',
            'is_correct' => $isCorrect,
            'status' => 200,
        ];
    }


    public function continueQuiz(Request $request)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Người dùng chưa đăng nhập.'], 401);
        }

        $userId = Auth::id();
        $quizSession = QuizSession::where('user_id', $userId)->latest()->first();

        if (!$quizSession) {
            return response()->json(['message' => 'Không tìm thấy phiên quiz.'], 404);
        }

        $quizId = $quizSession->quiz_id;

        $questions = QuizQuestion::where('quiz_id', $quizId)->get();

        $answeredQuestions = UserAnswer::where('user_id', $userId)
            ->whereIn('question_id', $questions->pluck('question_id'))
            ->pluck('question_id')
            ->toArray();

        $unansweredQuestions = $questions->whereNotIn('question_id', $answeredQuestions);

        if ($unansweredQuestions->isEmpty()) {
            return response()->json([
                'message' => 'Tất cả câu hỏi đã được trả lời.',
                'status' => 'completed'
            ], 200);
        }

        return response()->json([
            'questions' => $unansweredQuestions,
            'status' => $quizSession->status
        ]);
    }

    public function index($questionId)
    {
        $options = QuizOption::where('question_id', $questionId)->get();
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
            'answer' => 'required|string|max:255',
            'is_correct' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $option = QuizOption::create([
            'question_id' => $questionId,
            'answer' => $request->answer,
            'is_correct' => $request->is_correct,
        ]);

        return response()->json($option, 201);
    }

    public function update(Request $request, $questionId, $id)
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

        $validator = Validator::make($request->all(), [
            'answer' => 'sometimes|required|string|max:255',
            'is_correct' => 'sometimes|required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $option->update($request->all());
        return response()->json($option);
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
