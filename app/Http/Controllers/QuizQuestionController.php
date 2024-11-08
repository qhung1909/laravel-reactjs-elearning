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
            // Xử lý cho các loại câu hỏi true_false và fill_blank
            if (in_array($questionData['question_type'], ['true_false', 'fill_blank'])) {
                // Tạo 4 question_id cho các câu hỏi này
                for ($i = 1; $i <= 4; $i++) {
                    $question = QuizQuestion::where('quiz_id', $quizId)
                        ->where('question_id', $questionData['id'])
                        ->first();
    
                    if ($question) {
                        // Tạo bản sao của question cho mỗi question_id
                        $newQuestionData = $questionData;
                        $newQuestionData['id'] = $questionData['id'] . '_' . $i; // Giả định tạo ID mới bằng cách thêm suffix
                        $newQuestionData['question'] .= ' ' . $i; // Có thể thêm thông tin để phân biệt các câu hỏi
                        $newQuestionData['quiz_id'] = $quizId; // Thêm giá trị cho quiz_id
    
                        $newQuestion = new QuizQuestion($newQuestionData);
                        $newQuestion->save();
                        $updatedQuestions[] = $newQuestion;
                    }
                }
            } else {
                // Cập nhật cho các loại câu hỏi khác
                $question = QuizQuestion::where('quiz_id', $quizId)
                    ->where('question_id', $questionData['id'])
                    ->first();
    
                if ($question) {
                    $question->update($questionData);
                    $updatedQuestions[] = $question;
                }
            }
        }
    
        return response()->json([
            'message' => 'Questions updated successfully',
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
