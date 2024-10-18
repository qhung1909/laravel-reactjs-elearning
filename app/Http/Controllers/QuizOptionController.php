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
        $totalAnswersCount = count($answers); 
    
        foreach ($answers as $answer) {
            $questionId = $answer['question_id'];
    
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
    
            $validator = Validator::make($answer, [
                'option_id' => 'required|exists:quiz_options,option_id',
                'question_id' => 'required|exists:quizzes_questions,question_id',
            ]);
    
            if ($validator->fails()) {
                $response[] = [
                    'question_id' => $questionId,
                    'message' => $validator->errors(),
                    'status' => 400,
                ];
                continue;
            }
    
            $option = QuizOption::where('option_id', $answer['option_id'])
                ->where('question_id', $questionId)
                ->first();
    
            if (!$option) {
                $response[] = [
                    'question_id' => $questionId,
                    'message' => 'Lựa chọn không hợp lệ cho câu hỏi này.',
                    'status' => 400,
                ];
                continue;
            }
    
            try {
                $userAnswer = UserAnswer::create([
                    'user_id' => $userId,
                    'question_id' => $questionId,
                    'option_id' => $option->option_id,
                    'is_correct' => $option->is_correct,
                ]);
    
                if ($option->is_correct == 1) { 
                    $correctAnswersCount++;
                } else {
                    Log::info("Câu trả lời sai cho câu hỏi: $questionId"); 
                }
    
                $response[] = [
                    'question_id' => $questionId,
                    'message' => $option->is_correct ? 'Câu trả lời đúng' : 'Câu trả lời sai',
                    'is_correct' => $option->is_correct,
                    'user_answer' => $userAnswer,
                    'status' => 200,
                ];
            } catch (\Exception $e) {
                return response()->json(['message' => 'Không thể lưu câu trả lời. Vui lòng thử lại.'], 500);
            }
        }
    
        Log::info("Số câu trả lời đúng: $correctAnswersCount");
    
        $totalQuestions = QuizQuestion::where('quiz_id', $quizSession->quiz_id)->count(); 
        $score = ($correctAnswersCount / $totalQuestions) * 100; 
    
        $quizSession->update(['score' => $score]); 
        Log::info("Điểm số sau khi cập nhật: " . $quizSession->score);
    
        $this->endQuiz();
    
        return response()->json($response);
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


    protected function endQuiz()
    {
        $userId = Auth::id();
        $quizSession = QuizSession::where('user_id', $userId)->latest()->first();
    
        if ($quizSession) {
            $totalQuestions = QuizQuestion::where('quiz_id', $quizSession->quiz_id)->count();
            Log::info('Tổng số câu hỏi: ' . $totalQuestions);
    
            if ($totalQuestions === 0) {
                return response()->json(['message' => 'Không có câu hỏi nào trong phiên quiz.'], 404);
            }
    
            $answeredQuestions = UserAnswer::where('user_id', $userId)
                ->whereIn('question_id', QuizQuestion::where('quiz_id', $quizSession->quiz_id)->pluck('question_id'))
                ->count();
            Log::info('Số câu hỏi đã trả lời: ' . $answeredQuestions);
    
            try {
                if ($answeredQuestions === $totalQuestions) {
                    $quizSession->update(['status' => 'completed']);
                    Log::info('Đã cập nhật trạng thái thành công: completed');
    
                    $quizSession->token = null;
                    $quizSession->save();
                    Log::info('Token đã được xóa cho phiên quiz:', ['user_id' => $userId, 'quiz_session' => $quizSession]);
                }
            } catch (\Exception $e) {
                Log::error('Lỗi khi cập nhật phiên quiz:', ['error' => $e->getMessage()]);
                return response()->json(['message' => 'Không thể cập nhật điểm số. Vui lòng thử lại.'], 500);
            }
        } else {
            Log::warning('Không tìm thấy phiên quiz cho người dùng:', ['user_id' => $userId]);
        }
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
