<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Cache;
use App\Models\Lesson;
use Illuminate\Http\Request;

class LessonController extends Controller
{
    public function index()
    {
        $lessons = Cache::remember('lessons', 120, function () {
            return Lesson::all();
        });

        return response()->json($lessons);
    }

    public function show($slug)
    {
        $lesson = Cache::remember("lesson_{$slug}", 90, function () use ($slug) {
            return Lesson::where('slug', $slug)->first();
        });

        if (!$lesson) {
            return response()->json(['error' => 'Bài học không tìm thấy'], 404);
        }

        return response()->json($lesson);
    }

    public function store(Request $request)
    {
        $rules = [
            'course_id' => 'required|integer|exists:courses,course_id',
            'name' => 'required|string',
            'slug' => 'required|string|unique:lessons,slug',
            'content' => 'required|string',
            'description' => 'nullable|string'
        ];

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $lesson = Lesson::create([
            'course_id' => $request->course_id,
            'name' => $request->name,
            'slug' => $request->slug,
            'content' => $request->content,
            'description' => $request->description,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Bài học được thêm thành công.',
            'lesson' => $lesson
        ], 201);
    }

    public function update(Request $request, $slug)
    {
        $rules = [
            'course_id' => 'sometimes|required|integer|exists:courses,course_id',
            'name' => 'sometimes|required|string',
            'slug' => 'sometimes|required|string|unique:lessons,slug,' . $slug . ',slug',
            'content' => 'sometimes|required|string',
            'description' => 'sometimes|nullable|string'
        ];

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $lesson = Lesson::where('slug', $slug)->first();
        if (!$lesson) {
            return response()->json(['error' => 'Bài học không tìm thấy'], 404);
        }

        $lesson->update([
            'course_id' => $request->input('course_id', $lesson->course_id),
            'name' => $request->input('name', $lesson->name),
            'slug' => $request->input('slug', $lesson->slug),
            'content' => $request->input('content', $lesson->content),
            'description' => $request->input('description', $lesson->description),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Bài học được cập nhật thành công.',
            'lesson' => $lesson
        ], 200);
    }

    public function delete($slug)
    {
        $lesson = Lesson::where('slug', $slug)->first();
        if (!$lesson) {
            return response()->json(['error' => 'Bài học không tìm thấy'], 404);
        }

        $lesson->delete();

        return response()->json([
            'success' => true,
            'message' => 'Bài học đã được xóa thành công.'
        ], 200);
    }
}
