<?php

namespace App\Http\Controllers;


use App\Models\QuizQuestion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class QuizQuestionController extends Controller
{
    public function index($quizId)
    {
        $questions = QuizQuestion::where('quiz_id', $quizId)->get();
        return response()->json($questions);
    }

    public function store(Request $request, $quizId)
    {
        if (!Auth::check()) {
            return response()->json([
                'message' => 'Người dùng chưa đăng nhập.',
            ], 401);
        }

        $validator = Validator::make($request->all(), [
            'question' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $question = QuizQuestion::create([
            'quiz_id' => $quizId,
            'question' => $request->question,
        ]);

        return response()->json($question, 201);
    }

    public function update(Request $request, $quizId, $id)
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

        $validator = Validator::make($request->all(), [
            'question' => 'sometimes|required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $question->update($request->all());
        return response()->json($question);
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
