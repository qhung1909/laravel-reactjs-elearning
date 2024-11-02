<?php

namespace App\Http\Controllers;

use App\Models\Quiz;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class QuizController extends Controller
{
    const QUIZ_STATUSES = ['draft', 'published', 'hide', 'pending', 'failed'];
    
    public function index()
    {
        $quizzes = Quiz::where('status', 'published')->get();
        return response()->json($quizzes);
    }

    public function store(Request $request)
    {
        if (!Auth::check()) {
            return response()->json([
                'message' => 'Người dùng chưa đăng nhập.',
            ], 401);
        }

        $validator = Validator::make($request->all(), [
            'course_id' => 'required|integer',
            'title' => 'required|string|max:255',
            'status' => 'sometimes|in:' . implode(',', self::QUIZ_STATUSES)
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $data = $request->all();
        if (!isset($data['status'])) {
            $data['status'] = 'draft';
        }

        $quiz = Quiz::create($data);
        return response()->json($quiz, 201);
    }

    public function show($id)
    {
        $quiz = Quiz::where('id', $id)
                    ->where('status', 'published')
                    ->first();
                    
        if (!$quiz) {
            return response()->json(['message' => 'Quiz not found'], 404);
        }
        return response()->json($quiz);
    }

    public function update(Request $request, $id)
    {
        if (!Auth::check()) {
            return response()->json([
                'message' => 'Người dùng chưa đăng nhập.',
            ], 401);
        }

        $quiz = Quiz::find($id);
        if (!$quiz) {
            return response()->json(['message' => 'Quiz not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'course_id' => 'sometimes|required|integer',
            'title' => 'sometimes|required|string|max:255',
            'status' => 'sometimes|required|in:' . implode(',', self::QUIZ_STATUSES)
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $quiz->update($request->all());
        return response()->json($quiz);
    }

    public function destroy($id)
    {
        if (!Auth::check()) {
            return response()->json([
                'message' => 'Người dùng chưa đăng nhập.',
            ], 401);
        }

        $quiz = Quiz::find($id);
        if (!$quiz) {
            return response()->json(['message' => 'Quiz not found'], 404);
        }

        $quiz->delete();
        return response()->json(['message' => 'Quiz deleted successfully']);
    }
}