<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Content;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class ContentController extends Controller
{
    const CONTENT_STATUSES = ['draft', 'published', 'hide', 'pending', 'failed'];

    /**
     * Lấy danh sách contents với pagination và cache
     */
    public function index(Request $request)
    {
        try {
            $perPage = $request->input('per_page', 10);
            $cacheKey = 'contents_page_' . $request->input('page', 1) . '_' . $perPage;

            $contents = Cache::remember($cacheKey, 3600, function () use ($perPage) {
                return Content::with('course')
                    ->select('content_id', 'course_id', 'quiz_id', 'name_content', 'status', 'created_at', 'updated_at')
                    ->where('status', 'published')
                    ->latest()
                    ->paginate($perPage);
            });

            return response()->json([
                'success' => true,
                'data' => $contents->map(function ($content) {
                    return [
                        'content_id' => $content->content_id,
                        'course_id' => $content->course_id,
                        'quiz_id' => $content->quiz_id,
                        'course' => $content->course,
                        'name_content' => $content->name_content,
                        'status' => $content->status,
                        'created_at' => $content->created_at,
                        'updated_at' => $content->updated_at,
                    ];
                }),
                'meta' => [
                    'total' => $contents->total(),
                    'per_page' => $contents->perPage(),
                    'current_page' => $contents->currentPage(),
                    'last_page' => $contents->lastPage(),
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Xem chi tiết content
     */
    public function show($course_id)
    {
        try {
            $cacheKey = 'content_by_course_' . $course_id;

            $contents = Cache::remember($cacheKey, 3600, function () use ($course_id) {
                return Content::with('course')
                    ->select('content_id', 'course_id', 'quiz_id', 'name_content', 'status', 'created_at', 'updated_at')
                    ->where('course_id', $course_id)
                    ->where('status', 'published')
                    ->orderBy('created_at', 'desc')
                    ->get();
            });

            if ($contents->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy nội dung cho course_id này.',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $contents->map(function ($content) {
                    return [
                        'content_id' => $content->content_id,
                        'course_id' => $content->course_id,
                        'quiz_id' => $content->quiz_id,
                        'course' => $content->course,
                        'name_content' => $content->name_content,
                        'status' => $content->status,
                        'created_at' => $content->created_at,
                        'updated_at' => $content->updated_at,
                    ];
                }),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Tạo mới content
     */
    public function store(Request $request)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $validator = Validator::make($request->all(), [
            'course_id' => 'required|exists:courses,course_id',
            'name_content' => 'required|string|max:255',
            'status' => 'sometimes|string|in:' . implode(',', self::CONTENT_STATUSES),
        ], [
            'course_id.required' => 'Course ID là bắt buộc',
            'course_id.exists' => 'Course không tồn tại',
            'name_content.required' => 'Nội dung là bắt buộc',
            'name_content.max' => 'Nội dung không được vượt quá 255 ký tự',
            'status.in' => 'Trạng thái không hợp lệ',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        DB::beginTransaction();
        try {
            $data = $validator->validated();
            if (!isset($data['status'])) {
                $data['status'] = 'draft';
            }

            $content = Content::create($data);

            DB::commit();
            return response()->json([
                'success' => true,
                'data' => $content,
                'message' => 'Tạo content thành công'
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Cập nhật content
     */
    public function update(Request $request, $content_id)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $validator = Validator::make($request->all(), [
            'course_id' => 'required|exists:courses,course_id',
            'name_content' => 'required|string|max:255',
            'status' => 'sometimes|required|string|in:' . implode(',', self::CONTENT_STATUSES),
        ], [
            'course_id.required' => 'Course ID là bắt buộc',
            'course_id.exists' => 'Course không tồn tại',
            'name_content.required' => 'Nội dung là bắt buộc',
            'name_content.max' => 'Nội dung không được vượt quá 255 ký tự',
            'status.in' => 'Trạng thái không hợp lệ',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        DB::beginTransaction();
        try {
            $content = Content::findOrFail($content_id);
            $content->update($validator->validated());
            DB::commit();
            return response()->json([
                'success' => true,
                'data' => $content,
                'message' => 'Cập nhật content thành công'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Xóa content
     */
    public function destroy($content_id)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        DB::beginTransaction();
        try {
            $content = Content::findOrFail($content_id);
            $content->delete();

            Cache::forget('content_' . $content_id);
            Cache::tags(['contents'])->flush();

            DB::commit();
            return response()->json([
                'success' => true,
                'message' => 'Xóa content thành công'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage()
            ], 500);
        }
    }
}