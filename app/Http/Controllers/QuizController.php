<?php

namespace App\Http\Controllers;

use App\Models\Quiz;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

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
            'course_id' => 'required',
            'content_id' => 'required',
            'title' => 'nullable|string|max:255',
            'status' => 'sometimes|in:' . implode(',', self::QUIZ_STATUSES)
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $existingQuiz = Quiz::where('content_id', $request->content_id)->first();
        if ($existingQuiz) {
            return response()->json([
                'message' => 'Quiz cho content_id này đã tồn tại.',
                'data' => [
                    'quiz_id' => $existingQuiz->quiz_id,
                ]
            ], 400);
        }

        $data = $request->all();
        if (!isset($data['status'])) {
            $data['status'] = 'draft';
        }

        $quiz = Quiz::create($data);

        return response()->json([
            'message' => 'Tạo quiz thành công',
            'data' => [
                'quiz_id' => $quiz->quiz_id,
                'quiz' => $quiz
            ]
        ], 201);
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
            'content_id' => 'sometimes|required|integer',
            'title' => 'sometimes|nullable|string|max:255'
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
    public function checkContentQuiz(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'content_id' => 'required|integer'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 400);
        }

        $quiz = Quiz::where('content_id', $request->content_id)->first();

        if ($quiz) {
            return response()->json([
                'exists' => true,
                'data' => [
                    'quiz_id' => $quiz->quiz_id,
                    'status' => $quiz->status,
                    'title' => $quiz->title
                ]
            ]);
        }

        return response()->json([
            'exists' => false
        ]);
    }

    public function checkQuizExists(Request $request)
    {
        $request->validate([
            'content_id' => 'required|integer',
        ]);

        $contentId = $request->input('content_id');

        $quiz = Quiz::where('content_id', $contentId)->first();

        if (!$quiz) {
            return response()->json([
                'status' => 404,
                'exists' => false,
                'message' => 'No quiz found for this content_id.',
            ], 404);
        }

        return response()->json([
            'status' => 200,
            'exists' => true,
            'quiz_id' => $quiz->quiz_id,
            'message' => 'Quiz exists for this content_id.',
        ], 200);
    }
}
