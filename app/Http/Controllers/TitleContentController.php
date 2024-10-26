<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TitleContent;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class TitleContentController extends Controller
{
    public function index(Request $request)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        try {
            $perPage = $request->input('per_page', 10);
            $cacheKey = 'title_contents_page_' . $request->input('page', 1) . '_' . $perPage;

            $titleContents = Cache::remember($cacheKey, 3600, function () use ($perPage) {
                return TitleContent::with('content')
                    ->select('title_content_id', 'content_id', 'body_content', 'video_link', 'document_link', 'description', 'created_at', 'updated_at')
                    ->latest()
                    ->paginate($perPage);
            });

            return response()->json([
                'success' => true,
                'data' => $titleContents,
                'meta' => [
                    'total' => $titleContents->total(),
                    'per_page' => $titleContents->perPage(),
                    'current_page' => $titleContents->currentPage(),
                    'last_page' => $titleContents->lastPage(),
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
     * Xem chi tiết title_content kèm thông tin content liên quan
     */
    public function show($content_id)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
    
        try {
            $cacheKey = 'title_content_by_content_' . $content_id;
    
            $titleContent = Cache::remember($cacheKey, 3600, function () use ($content_id) {
                return TitleContent::with('content')
                    ->select('title_content_id', 'content_id', 'body_content', 'video_link', 'document_link', 'description', 'created_at', 'updated_at')
                    ->where('content_id', $content_id)
                    ->first();
            });
    
            if (!$titleContent) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy title_content với content_id này.',
                ], 404);
            }
    
            return response()->json([
                'success' => true,
                'data' => $titleContent,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage(),
            ], 500);
        }
    }
    

    public function store(Request $request)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $validator = Validator::make($request->all(), [
            'content_id' => 'required|exists:contents,content_id',
            'body_content' => 'required|string',
            'video_link' => 'nullable|string|url',
            'document_link' => 'nullable|string|url',
            'description' => 'nullable|string|max:500',
        ], [
            'content_id.required' => 'Content ID là bắt buộc',
            'content_id.exists' => 'Content không tồn tại',
            'body_content.required' => 'Nội dung là bắt buộc',
            'video_link.url' => 'Link video không hợp lệ',
            'document_link.url' => 'Link tài liệu không hợp lệ',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        DB::beginTransaction();
        try {
            $titleContent = TitleContent::create($validator->validated());

            Cache::tags(['title_contents'])->flush();

            DB::commit();
            return response()->json(['success' => true, 'data' => $titleContent, 'message' => 'Tạo title_content thành công'], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => 'Có lỗi xảy ra: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Cập nhật title_content
     */
    public function update(Request $request, $title_content_id)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $validator = Validator::make($request->all(), [
            'content_id' => 'required|exists:contents,content_id',
            'body_content' => 'required|string',
            'video_link' => 'nullable|string|url',
            'document_link' => 'nullable|string|url',
            'description' => 'nullable|string|max:500',
        ], [
            'content_id.required' => 'Content ID là bắt buộc',
            'content_id.exists' => 'Content không tồn tại',
            'body_content.required' => 'Nội dung là bắt buộc',
            'video_link.url' => 'Link video không hợp lệ',
            'document_link.url' => 'Link tài liệu không hợp lệ',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        DB::beginTransaction();
        try {
            $titleContent = TitleContent::findOrFail($title_content_id);
            $titleContent->update($validator->validated());

            Cache::forget('title_content_' . $title_content_id);
            Cache::tags(['title_contents'])->flush();

            DB::commit();
            return response()->json(['success' => true, 'data' => $titleContent, 'message' => 'Cập nhật title_content thành công']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => 'Có lỗi xảy ra: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Xóa title_content
     */
    public function destroy($title_content_id)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        DB::beginTransaction();
        try {
            $titleContent = TitleContent::findOrFail($title_content_id);
            $titleContent->delete();

            Cache::forget('title_content_' . $title_content_id);
            Cache::tags(['title_contents'])->flush();

            DB::commit();
            return response()->json(['success' => true, 'message' => 'Xóa title_content thành công']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => 'Có lỗi xảy ra: ' . $e->getMessage()], 500);
        }
    }
}
