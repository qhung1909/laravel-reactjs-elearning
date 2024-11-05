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
        Log::info('1. Request Data Input:', $request->all());
    
        if (!Auth::check()) {
            Log::error('2. Authentication Failed: User not logged in');
            return response()->json([
                'message' => 'Người dùng chưa đăng nhập.',
            ], 401);
        }
        Log::info('2. Authentication Success: User logged in', ['user_id' => Auth::id()]);
    
        $validator = Validator::make($request->all(), [
            'course_id' => 'required|integer',
            'content_id' => 'required|integer',
            'title' => 'nullable|string|max:255',
            'status' => 'sometimes|in:' . implode(',', self::QUIZ_STATUSES)
        ]);
    
        Log::info('3. Validation Rules:', [
            'rules' => [
                'course_id' => 'required|integer',
                'content_id' => 'required|integer',
                'title' => 'nullable|string|max:255',
                'status' => 'sometimes|in:' . implode(',', self::QUIZ_STATUSES)
            ]
        ]);
    
        if ($validator->fails()) {
            Log::error('4. Validation Failed:', $validator->errors()->toArray());
            return response()->json($validator->errors(), 400);
        }
        Log::info('4. Validation Success');
    
        $data = $request->all();
        if (!isset($data['status'])) {
            $data['status'] = 'draft';
        }
        Log::info('5. Processed Data before create:', $data);
    
        DB::enableQueryLog();
        
        $quiz = Quiz::create($data);
        
        $queries = DB::getQueryLog();
        Log::info('6. SQL Query:', end($queries));
        
        Log::info('7. Created Quiz Model:', $quiz->toArray());
    
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
}
