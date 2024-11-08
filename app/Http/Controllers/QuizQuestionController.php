<?php

namespace App\Http\Controllers;


use App\Models\QuizQuestion;
use Illuminate\Http\Request;
use App\Exports\QuizQuestionsExport;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class QuizQuestionController extends Controller
{
    public function index($quizId)
    {
        $questions = QuizQuestion::where('quiz_id', $quizId)->get();
        return response()->json($questions);
    }

    public function show($quizId, $questionId)
    {
        $question = QuizQuestion::where('quiz_id', $quizId)->find($questionId);

        if (!$question) {
            return response()->json([
                'message' => 'Câu hỏi không tồn tại.'
            ], 404); 
        }

        return response()->json($question, 200); 
    }

    public function store(Request $request, $quizId)
    {
        if (!Auth::check()) {
            return response()->json([
                'message' => 'Người dùng chưa đăng nhập.',
            ], 401);
        }
    
        $validator = Validator::make($request->all(), [
            'questions' => 'array',
            'questions.*.question' => 'nullable|string|max:255',
            'questions.*.question_type' => 'nullable|string',
            'question' => 'nullable|string|max:255',
            'question_type' => 'nullable|string|in:single_choice,true_false,mutiple_choice,fill_blank'
        ]);
    
        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }
    
        $questions = [];
    
        $checkExistingQuestion = function ($questionText) use ($quizId) {
            return QuizQuestion::where('quiz_id', $quizId)
                ->whereRaw('LOWER(question) = ?', [strtolower($questionText)])
                ->exists();
        };
    
        if ($request->has('question')) {
            if ($checkExistingQuestion($request->question)) {
                return response()->json([
                    'message' => 'Câu hỏi đã tồn tại.',
                ], 409);
            }
    
            $questions[] = QuizQuestion::create([
                'quiz_id' => $quizId,
                'question' => $request->question,
                'question_type' => $request->question_type
            ]);
        }
    
        if ($request->has('questions')) {
            foreach ($request->questions as $questionData) {
                if ($checkExistingQuestion($questionData['question'])) {
                    return response()->json([
                        'message' => 'Câu hỏi "' . $questionData['question'] . '" đã tồn tại.',
                    ], 409);
                }
    
                $questions[] = QuizQuestion::create([
                    'quiz_id' => $quizId,
                    'question' => $questionData['question'],
                    'question_type' => $questionData['question_type']
                ]);
            }
        }
    
        return response()->json($questions, 201);
    }
    
    public function update(Request $request, $quizId)
    {
        if (!Auth::check()) {
            return response()->json([
                'message' => 'Người dùng chưa đăng nhập.',
            ], 401);
        }
    
        $validator = Validator::make($request->all(), [
            'questions' => 'required|array',
            'questions.*.id' => 'required|integer|exists:quizzes_questions,question_id',
            'questions.*.question' => 'sometimes|required|string|max:255',
            'questions.*.question_type' => 'sometimes|required|string|in:single_choice,true_false,multiple_choice,fill_blank'
        ]);
    
        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }
    
        $updatedQuestions = [];
        foreach ($request->questions as $questionData) {
            $question = QuizQuestion::where('quiz_id', $quizId)
                ->where('question_id', $questionData['id'])
                ->first();
    
            if ($question) {
                // Kiểm tra xem loại câu hỏi có thay đổi không
                if ($question->question_type !== $questionData['question_type']) {
                    // Lưu ID của câu hỏi cũ
                    $oldQuestionId = $question->question_id;
    
                    // Xóa câu hỏi cũ
                    $question->delete();
    
                    // Tạo mới câu hỏi với dữ liệu mới
                    $newQuestion = new QuizQuestion($questionData);
                    $newQuestion->quiz_id = $quizId; // Gán quiz_id cho câu hỏi mới
                    $newQuestion->save();
    
                    $updatedQuestions[] = $newQuestion;
                } else {
                    // Nếu loại câu hỏi không thay đổi, chỉ cần cập nhật
                    $question->update($questionData);
                    $updatedQuestions[] = $question;
                }
            } else {
                return response()->json([
                    'message' => "Không tìm thấy câu hỏi với ID {$questionData['id']}.",
                ], 404);
            }
        }
    
        return response()->json([
            'message' => 'Cập nhật câu hỏi thành công',
            'questions' => $updatedQuestions
        ]);
    }
    

    public function destroy($quizId, $id)
    {
        if (!Auth::check()) {
            return response()->json([
                'message' => 'Người dùng chưa đăng nhập.',
            ], 401);
        }

        $question = QuizQuestion::where('quiz_id', $quizId)->find($id);
        if (!$question) {
            return response()->json(['message' => 'Question not found'], 404);
        }

        $question->delete();
        return response()->json(['message' => 'Question deleted successfully']);
    }
}
