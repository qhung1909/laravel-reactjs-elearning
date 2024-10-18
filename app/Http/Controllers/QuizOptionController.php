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
    public function submitAnswer(Request $request, $questionId)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Người dùng chưa đăng nhập.'], 401);
        }
    
        $existingAnswer = UserAnswer::where('user_id', Auth::id())
            ->where('question_id', $questionId)
            ->first();
    
        if ($existingAnswer) {
            return response()->json(['message' => 'Người dùng đã trả lời câu hỏi này rồi.'], 403);
        }
    
        $validator = Validator::make($request->all(), [
            'option_id' => 'required|exists:quiz_options,option_id',
        ]);
    
        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }
    
        $option = QuizOption::find($request->option_id);
    
        $userAnswer = UserAnswer::create([
            'user_id' => Auth::id(),
            'question_id' => $questionId,
            'option_id' => $option->option_id,
            'is_correct' => $option->is_correct,
        ]);
    
        return response()->json([
            'message' => $option->is_correct ? 'Correct answer' : 'Incorrect answer',
            'is_correct' => $option->is_correct,
            'user_answer' => $userAnswer,
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
