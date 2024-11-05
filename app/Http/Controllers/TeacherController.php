<?php

namespace App\Http\Controllers;

use App\Models\Content;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use App\Models\Course;
use Illuminate\Support\Facades\DB;
use App\Models\TitleContent;
use Illuminate\Support\Facades\Log;
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
                'name_content' => 'nullable|string|max:255',
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

    public function deleteContents(Request $request, $courseId)
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
                'content_ids' => 'required|array',
                'content_ids.*' => 'required|exists:contents,content_id'
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
                foreach ($request->content_ids as $contentId) {
                    $content = Content::where('content_id', $contentId)
                        ->where('course_id', $courseId)
                        ->where('status', 'draft')
                        ->first();

                    if (!$content) {
                        throw new \Exception("Content ID {$contentId} không thuộc về khóa học này");
                    }

                    $content->delete();
                }

                DB::commit();

                $remainingContents = Content::where('course_id', $courseId)
                    ->orderBy('created_at', 'desc')
                    ->get();

                return response()->json([
                    'success' => true,
                    'message' => 'Xóa nội dung thành công',
                    'data' => [
                        'course' => $course,
                        'contents' => $remainingContents
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

    public function showTitleContent($contentId)
    {
        try {
            if (!Auth::check()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Người dùng chưa đăng nhập'
                ], 401);
            }

            $content = Content::where('content_id', $contentId)
                ->where('status', 'draft')
                ->first();

            if (!$content) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy nội dung'
                ], 404);
            }

            $titleContent = TitleContent::where('content_id', $contentId)
                ->get();

            if ($titleContent->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy tiêu đề nội dung'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'Lấy tiêu đề nội dung thành công',
                'data' => $titleContent
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi: ' . $e->getMessage()
            ], 500);
        }
    }

    public function storeTitleContent(Request $request)
    {
        try {
            if (!Auth::check()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Người dùng chưa đăng nhập'
                ], 401);
            }

            $validator = Validator::make($request->all(), [
                'content_id' => 'required|exists:contents,content_id',
                'title_contents' => 'required|array',
                'title_contents.*.body_content' => 'nullable|string',
                'title_contents.*.video_link' => 'nullable|string',
                'title_contents.*.document_link' => 'nullable|string',
                'title_contents.*.description' => 'nullable|string'
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
                $createdTitleContents = [];

                foreach ($request->title_contents as $titleContentData) {
                    $titleContent = TitleContent::create([
                        'content_id' => $request->content_id,
                        'body_content' => $titleContentData['body_content'],
                        'video_link' => $titleContentData['video_link'],
                        'document_link' => $titleContentData['document_link'],
                        'description' => $titleContentData['description'],
                        'status' => 'draft'
                    ]);

                    $createdTitleContents[] = $titleContent;
                }

                DB::commit();

                return response()->json([
                    'success' => true,
                    'message' => 'Tạo tiêu đề nội dung thành công',
                    'data' => $createdTitleContents
                ], 201);
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


    public function updateTitleContent(Request $request, $contentId)
    {
        try {
            if (!Auth::check()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Người dùng chưa đăng nhập'
                ], 401);
            }
    
            $content = Content::where('content_id', $contentId)->first();
    
            if (!$content) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy nội dung'
                ], 404);
            }
    
            $validator = Validator::make($request->all(), [
                'title_contents' => 'nullable|array',
                'title_contents.*.title_content_id' => 'required|exists:title_content,title_content_id',
                'title_contents.*.body_content' => 'required|string',
                'title_contents.*.video_link' => 'nullable|string',
                'title_contents.*.document_link' => 'nullable|string',
                'title_contents.*.description' => 'nullable|string'
            ], [
                'title_contents.*.body_content.required' => 'Nội dung không được để trống'
            ]);
    
            if ($validator->fails()) {
                Log::error('Validation failed', [
                    'errors' => $validator->errors(),
                    'input' => request()->all()
                ]);
            
                return response()->json([
                    'success' => false,
                    'message' => 'Dữ liệu không hợp lệ',
                    'errors' => $validator->errors()
                ], 422);
            }
    
            DB::beginTransaction();
    
            try {
                foreach ($request->title_contents as $titleContentData) {
                    $titleContent = TitleContent::where('title_content_id', $titleContentData['title_content_id'])
                        ->where('content_id', $contentId)
                        ->first();
    
                    if (!$titleContent) {
                        throw new \Exception("TitleContent ID {$titleContentData['title_content_id']} không thuộc về nội dung này");
                    }
    
                    $updateData = [
                        'body_content' => $titleContentData['body_content'], 
                        'video_link' => array_key_exists('video_link', $titleContentData) ? $titleContentData['video_link'] : $titleContent->video_link,
                        'document_link' => array_key_exists('document_link', $titleContentData) ? $titleContentData['document_link'] : $titleContent->document_link,
                        'description' => array_key_exists('description', $titleContentData) ? $titleContentData['description'] : $titleContent->description,
                        'status' => 'draft'
                    ];
    
                    $titleContent->update($updateData);
                }
    
                DB::commit();
    
                return response()->json([
                    'success' => true,
                    'message' => 'Cập nhật tiêu đề nội dung thành công'
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


    public function deleteTitleContent($titleContentId)
    {
        try {
            if (!Auth::check()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Người dùng chưa đăng nhập'
                ], 401);
            }

            DB::beginTransaction();

            try {
                $titleContent = TitleContent::where('title_content_id', $titleContentId)->first();

                if (!$titleContent) {
                    throw new \Exception('Không tìm thấy tiêu đề nội dung');
                }

                $titleContent->delete();

                DB::commit();

                return response()->json([
                    'success' => true,
                    'message' => 'Xóa tiêu đề nội dung thành công'
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

    public function updateToPending(Request $request)
    {
        try {
            DB::beginTransaction();
            
            $courseId = $request->course_id;
            
            $course = Course::findOrFail($courseId);
            $course->update(['status' => 'pending']);
            
            $contents = Content::where('course_id', $courseId)->get();
            foreach ($contents as $content) {
                $content->update(['status' => 'pending']);
                
                TitleContent::where('content_id', $content->content_id)
                    ->update(['status' => 'pending']);
            }
            
            DB::commit();
            
            return response()->json([
                'success' => true,
                'message' => 'Đã cập nhật tất cả status thành pending'
            ]);
            
        } catch (\Exception $e) {
            DB::rollback();
            
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage()
            ], 500);
        }
    }

}
