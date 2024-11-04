<?php

namespace App\Http\Controllers;

use App\Models\Content;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use App\Models\Course;
use Illuminate\Support\Facades\DB;
class TeacherController extends Controller
{
    public function showContent($courseId)
    {
        try {
            if (!Auth::check()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Người dùng chưa đăng nhập'
                ], 401);
            }

            $course = Course::where('course_id', $courseId)
                          ->where('user_id', Auth::id())
                          ->first();

            if (!$course) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy khóa học hoặc bạn không có quyền truy cập'
                ], 404);
            }

            // Lấy tất cả content draft của course
            $contents = Content::where('course_id', $courseId)
                             ->where('status', 'draft')
                             ->orderBy('created_at', 'desc')
                             ->get();

            if ($contents->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy nội dung draft cho khóa học này'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'Lấy danh sách nội dung draft thành công',
                'data' => [
                    'course' => $course,
                    'contents' => $contents
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi: ' . $e->getMessage()
            ], 500);
        }
    }

    public function storeContent(Request $request)
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

    public function updateContents(Request $request, $courseId)
    {
        try {
            if (!Auth::check()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Người dùng chưa đăng nhập'
                ], 401);
            }

            $course = Course::where('course_id', $courseId)
                          ->where('user_id', Auth::id())
                          ->first();

            if (!$course) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy khóa học hoặc bạn không có quyền truy cập'
                ], 404);
            }

            $validator = Validator::make($request->all(), [
                'contents' => 'required|array',
                'contents.*.content_id' => 'required|exists:contents,content_id',
                'contents.*.name_content' => 'required|string|max:255'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Dữ liệu không hợp lệ',
                    'errors' => $validator->errors()
                ], 422);
            }

            DB::beginTransaction();
            
            try {
                foreach ($request->contents as $contentData) {
                    $content = Content::where('content_id', $contentData['content_id'])
                                    ->where('course_id', $courseId)
                                    ->first();
                    
                    if (!$content) {
                        throw new \Exception("Content ID {$contentData['content_id']} không thuộc về khóa học này");
                    }

                    $content->update([
                        'name_content' => $contentData['name_content']
                    ]);
                }

                DB::commit();

                $updatedContents = Content::where('course_id', $courseId)
                                        ->orderBy('created_at', 'desc')
                                        ->get();

                return response()->json([
                    'success' => true,
                    'message' => 'Cập nhật nội dung thành công',
                    'data' => [
                        'course' => $course,
                        'contents' => $updatedContents
                    ]
                ]);

            } catch (\Exception $e) {
                DB::rollBack();
                throw $e;
            }

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroyContent($contentId)
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
