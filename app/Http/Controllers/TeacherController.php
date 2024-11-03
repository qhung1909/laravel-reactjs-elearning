<?php

namespace App\Http\Controllers;

use App\Models\Content;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use App\Models\Course;
class TeacherController extends Controller
{
    public function show($contentId)
    {
        try {
            if (!Auth::check()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Người dùng chưa đăng nhập'
                ], 401);
            }

            $content = Content::whereHas('course', function($query) {
                $query->where('user_id', Auth::id());
            })->find($contentId);
            
            if (!$content) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy nội dung hoặc bạn không có quyền truy cập'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $content
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi: ' . $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            if (!Auth::check()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Người dùng chưa đăng nhập'
                ], 401);
            }

            $validator = Validator::make($request->all(), [
                'course_id' => 'required|exists:courses,course_id',
                'name_content' => 'required|string|max:255',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => $validator->errors()
                ], 422);
            }

            $isCourseOwner = Course::where('course_id', $request->course_id)
                                 ->where('user_id', Auth::id())
                                 ->exists();
            
            if (!$isCourseOwner) {
                return response()->json([
                    'success' => false,
                    'message' => 'Bạn không có quyền thêm nội dung vào khóa học này'
                ], 403);
            }

            $content = Content::create([
                'course_id' => $request->course_id,
                'name_content' => $request->name_content,
                'status' => 'draft' 
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Tạo nội dung thành công',
                'data' => $content
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi: ' . $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $contentId)
    {
        try {
            if (!Auth::check()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Người dùng chưa đăng nhập'
                ], 401);
            }

            $validator = Validator::make($request->all(), [
                'name_content' => 'sometimes|required|string|max:255',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => $validator->errors()
                ], 422);
            }

            $content = Content::whereHas('course', function($query) {
                $query->where('user_id', Auth::id());
            })->find($contentId);

            if (!$content) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy nội dung hoặc bạn không có quyền cập nhật'
                ], 404);
            }

            $content->update($request->only(['name_content']));

            return response()->json([
                'success' => true,
                'message' => 'Cập nhật nội dung thành công',
                'data' => $content
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($contentId)
    {
        try {
            if (!Auth::check()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Người dùng chưa đăng nhập'
                ], 401);
            }

            $content = Content::whereHas('course', function($query) {
                $query->where('user_id', Auth::id());
            })->find($contentId);

            if (!$content) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy nội dung hoặc bạn không có quyền xóa'
                ], 404);
            }

            $content->delete();

            return response()->json([
                'success' => true,
                'message' => 'Xóa nội dung thành công'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi: ' . $e->getMessage()
            ], 500);
        }
    }
}
