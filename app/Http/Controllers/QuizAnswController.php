<?php

namespace App\Http\Controllers;

use App\Models\QuizAnsw;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class QuizAnswController extends Controller
{
    public function index($questionId)
    {
        $answers = QuizAnsw::where('question_id', $questionId)->get();
        return response()->json($answers);
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

        $answer = QuizAnsw::create([
            'question_id' => $questionId,
            'answer' => $request->answer,
            'is_correct' => $request->is_correct,
        ]);

        return response()->json($answer, 201);
    }

    public function update(Request $request, $questionId, $id)
    {   

        if (!Auth::check()) {
            return response()->json([
                'message' => 'Người dùng chưa đăng nhập.',
            ], 401);
        }


        $answer = QuizAnsw::where('question_id', $questionId)->find($id);
        if (!$answer) {
            return response()->json(['message' => 'Answer not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'answer' => 'sometimes|required|string|max:255',
            'is_correct' => 'sometimes|required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $answer->update($request->all());
        return response()->json($answer);
    }

    public function destroy($questionId, $id)
    {   
        if (!Auth::check()) {
            return response()->json([
                'message' => 'Người dùng chưa đăng nhập.',
            ], 401);
        }

        $answer = QuizAnsw::where('question_id', $questionId)->find($id);
        if (!$answer) {
            return response()->json(['message' => 'Answer not found'], 404);
        }

        $answer->delete();
        return response()->json(['message' => 'Answer deleted successfully']);
    }
}
