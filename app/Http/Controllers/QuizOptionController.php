<?php

namespace App\Http\Controllers;

use App\Models\QuizOption;
use App\Models\UserAnswer;
use App\Models\QuizQuestion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class QuizOptionController extends Controller
{
    public function submitAnswers(Request $request)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Người dùng chưa đăng nhập.'], 401);
        }

        $answers = $request->input('answers');
        $response = [];

        foreach ($answers as $answer) {
            $questionId = $answer['question_id'];

            $existingAnswer = UserAnswer::where('user_id', Auth::id())
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
            
            $userAnswer = UserAnswer::create([
                'user_id' => Auth::id(),
                'question_id' => $questionId,
                'option_id' => $option->option_id,
                'is_correct' => $option->is_correct,
            ]);

            $response[] = [
                'question_id' => $questionId,
                'message' => $option->is_correct ? 'Correct answer' : 'Incorrect answer',
                'is_correct' => $option->is_correct,
                'user_answer' => $userAnswer,
                'status' => 200,
            ];
        }

        return response()->json($response);
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
