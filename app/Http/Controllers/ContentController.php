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
    /**
     * Lấy danh sách contents với pagination và cache
     */
    public function index(Request $request)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        try {
            $perPage = $request->input('per_page', 10);
            $cacheKey = 'contents_page_' . $request->input('page', 1) . '_' . $perPage;

            $contents = Cache::remember($cacheKey, 3600, function () use ($perPage) {
                return Content::with('lesson')
                    ->select('content_id', 'lesson_id', 'title_content', 'body_content', 'video_content', 'document_link', 'created_at', 'updated_at')
                    ->latest()
                    ->paginate($perPage);
            });

            return response()->json([
                'success' => true,
                'data' => $contents->map(function ($content) {
                    return [
                        'content_id' => $content->content_id,
                        'lesson_id' => $content->lesson_id,
                        'lesson' => $content->lesson,
                        'title' => $content->title_content,
                        'body' => $content->body_content,
                        'video' => $content->video_content,
                        'document' => $content->document_link,
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
    public function show($content_id)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        try {
            $cacheKey = 'content_' . $content_id;

            $content = Cache::remember($cacheKey, 3600, function () use ($content_id) {
                return Content::with('lesson')
                    ->select('content_id', 'lesson_id', 'title_content', 'body_content', 'video_content', 'document_link')
                    ->orderBy('created_at', 'desc') 
                    ->findOrFail($content_id);
            });

            return response()->json([
                'success' => true,
                'data' => [
                    'content_id' => $content->content_id,
                    'lesson_id' => $content->lesson_id,
                    'lesson' => $content->lesson,
                    'title' => $content->title_content,
                    'body' => $content->body_content,
                    'video' => $content->video_content,
                    'document' => $content->document_link,
                    'created_at' => $content->created_at,
                    'updated_at' => $content->updated_at,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy content hoặc có lỗi xảy ra: ' . $e->getMessage()
            ], 404);
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
            'lesson_id' => 'required|exists:lessons,id',
            'title_content' => 'required|string|max:255',
            'body_content' => 'required|string',
            'video_content' => 'nullable|string|url',
            'document_link' => 'nullable|string|url',
        ], [
            'lesson_id.required' => 'Lesson ID là bắt buộc',
            'lesson_id.exists' => 'Lesson không tồn tại',
            'title_content.required' => 'Tiêu đề là bắt buộc',
            'title_content.max' => 'Tiêu đề không được vượt quá 255 ký tự',
            'body_content.required' => 'Nội dung là bắt buộc',
            'video_content.url' => 'Link video không hợp lệ',
            'document_link.url' => 'Link tài liệu không hợp lệ',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        DB::beginTransaction();
        try {
            $content = Content::create($validator->validated());

            Cache::tags(['contents'])->flush();

            DB::commit();
            return response()->json([
                'success' => true,
                'data' => [
                    'content_id' => $content->content_id,
                    'lesson_id' => $content->lesson_id,
                    'lesson' => $content->lesson,
                    'title' => $content->title_content,
                    'body' => $content->body_content,
                    'video' => $content->video_content,
                    'document' => $content->document_link,
                    'created_at' => $content->created_at,
                    'updated_at' => $content->updated_at,
                ],
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
            'lesson_id' => 'required|exists:lessons,id',
            'title_content' => 'required|string|max:255',
            'body_content' => 'required|string',
            'video_content' => 'nullable|string|url',
            'document_link' => 'nullable|string|url',
        ], [
            'lesson_id.required' => 'Lesson ID là bắt buộc',
            'lesson_id.exists' => 'Lesson không tồn tại',
            'title_content.required' => 'Tiêu đề là bắt buộc',
            'title_content.max' => 'Tiêu đề không được vượt quá 255 ký tự',
            'body_content.required' => 'Nội dung là bắt buộc',
            'video_content.url' => 'Link video không hợp lệ',
            'document_link.url' => 'Link tài liệu không hợp lệ',
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

            Cache::forget('content_' . $content_id);
            Cache::tags(['contents'])->flush();

            DB::commit();
            return response()->json([
                'success' => true,
                'data' => [
                    'content_id' => $content->content_id,
                    'lesson_id' => $content->lesson_id,
                    'lesson' => $content->lesson,
                    'title' => $content->title_content,
                    'body' => $content->body_content,
                    'video' => $content->video_content,
                    'document' => $content->document_link,
                    'created_at' => $content->created_at,
                    'updated_at' => $content->updated_at,
                ],
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
