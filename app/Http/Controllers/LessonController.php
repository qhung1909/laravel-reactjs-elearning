<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Cache;
use App\Models\Lesson;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

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
            'content' => 'required|string',
            'description' => 'nullable|string'
        ];

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $lesson = DB::transaction(function () use ($request) {
                $baseSlug = Str::slug($request->name);
                $slug = $baseSlug;
                $counter = 1;

                while (Lesson::where('slug', $slug)->exists()) {
                    $slug = $baseSlug . '-' . $counter;
                    $counter++;
                }

                $lesson = Lesson::create([
                    'course_id' => $request->course_id,
                    'name' => $request->name,
                    'slug' => $slug,
                    'content' => $request->content,
                    'description' => $request->description,
                ]);

                Cache::forget('lessons');
                Cache::tags(['lessons', 'courses'])->flush();

                return $lesson;
            });

            return response()->json([
                'success' => true,
                'message' => 'Bài học được thêm thành công.',
                'lesson' => $lesson
            ], 201);

        } catch (\Exception $e) {
            Log::error('Error creating lesson: ' . $e->getMessage());
            return response()->json([
                'error' => 'Có lỗi xảy ra khi tạo bài học'
            ], 500);
        }
    }

    public function update(Request $request, $slug)
    {
        $rules = [
            'course_id' => 'sometimes|required|integer|exists:courses,course_id',
            'name' => 'sometimes|required|string',
            'content' => 'sometimes|required|string',
            'description' => 'sometimes|nullable|string'
        ];

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $lesson = DB::transaction(function () use ($request, $slug) {
                $lesson = Lesson::where('slug', $slug)->firstOrFail();

                if ($request->has('name') && $request->name !== $lesson->name) {
                    $baseSlug = Str::slug($request->name);
                    $newSlug = $baseSlug;
                    $counter = 1;

                    while (Lesson::where('slug', $newSlug)
                            ->where('lesson_id', '!=', $lesson->lesson_id)
                            ->exists()) {
                        $newSlug = $baseSlug . '-' . $counter;
                        $counter++;
                    }
                    $lesson->slug = $newSlug;
                }

                $lesson->update([
                    'course_id' => $request->input('course_id', $lesson->course_id),
                    'name' => $request->input('name', $lesson->name),
                    'content' => $request->input('content', $lesson->content),
                    'description' => $request->input('description', $lesson->description),
                ]);

                Cache::forget('lessons');
                Cache::forget("lesson_{$slug}");
                Cache::tags(['lessons', 'courses'])->flush();

                return $lesson;
            });

            return response()->json([
                'success' => true,
                'message' => 'Bài học được cập nhật thành công.',
                'lesson' => $lesson
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error updating lesson: ' . $e->getMessage());
            return response()->json([
                'error' => 'Có lỗi xảy ra khi cập nhật bài học'
            ], 500);
        }
    }

    public function delete($slug)
    {
        try {
            DB::transaction(function () use ($slug) {
                $lesson = Lesson::where('slug', $slug)->firstOrFail();
                $lesson->delete();

                Cache::forget('lessons');
                Cache::forget("lesson_{$slug}");
                Cache::tags(['lessons', 'courses'])->flush();
            });

            return response()->json([
                'success' => true,
                'message' => 'Bài học đã được xóa thành công.'
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error deleting lesson: ' . $e->getMessage());
            return response()->json([
                'error' => 'Có lỗi xảy ra khi xóa bài học'
            ], 500);
        }
    }
}