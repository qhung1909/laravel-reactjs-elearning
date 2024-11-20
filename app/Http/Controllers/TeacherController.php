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
use App\Models\Quiz;
use App\Models\OrderDetail;
use Aws\S3\S3Client;
use Illuminate\Http\UploadedFile;
use Carbon\Carbon;
class TeacherController extends Controller
{
    public function getCoursesByTeacher()
    {
        if (!Auth::check()) {
            return response()->json([
                'message' => 'Người dùng chưa đăng nhập.',
            ], 401);
        }

        $user = Auth::user();

        if ($user->role !== 'teacher') {
            return response()->json([
                'message' => 'Người dùng không có quyền truy cập.',
            ], 403);
        }

        $courses = Course::where('user_id', $user->user_id)->get();

        return response()->json([
            'message' => 'Courses retrieved successfully',
            'courses' => $courses
        ]);
    }

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
                'is_online_meeting' => 'required|in:0,1' 
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
                'is_online_meeting' => $request->is_online_meeting,
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
                'contents.*.name_content' => 'required|string|max:255',
                'contents.*.is_online_meeting' => 'nullable|in:0,1'  
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
                        'name_content' => $contentData['name_content'],
                        'is_online_meeting' => $contentData['is_online_meeting']
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
                'title_contents.*.video_link' => 'nullable|file|mimes:mp4,mov,avi,wmv|max:102400', 
                'title_contents.*.document_link' => 'nullable|string',
                'title_contents.*.description' => 'nullable|string'
            ], [
                'title_contents.*.body_content.required' => 'Nội dung không được để trống',
                'title_contents.*.video_link.max' => 'File video không được vượt quá 100MB'
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
                
                $titleContents = $request->get('title_contents', []);
    
                
                if (!empty($titleContents) && is_array($titleContents)) {
                    foreach ($titleContents as $titleContentData) {
                        $titleContent = TitleContent::where('title_content_id', $titleContentData['title_content_id'])
                            ->where('content_id', $contentId)
                            ->first();
    
                        if (!$titleContent) {
                            throw new \Exception("TitleContent ID {$titleContentData['title_content_id']} không thuộc về nội dung này");
                        }
    
                        $updateData = [
                            'body_content' => $titleContentData['body_content'],
                            'document_link' => array_key_exists('document_link', $titleContentData) ? $titleContentData['document_link'] : $titleContent->document_link,
                            'description' => array_key_exists('description', $titleContentData) ? $titleContentData['description'] : $titleContent->description,
                            'status' => 'draft'
                        ];
    
                        
                        if (isset($titleContentData['video_link']) && $titleContentData['video_link'] instanceof UploadedFile) {
                            $updateData['video_link'] = $this->handleVideoUpload($titleContentData['video_link'], $titleContent);
                        } elseif (array_key_exists('video_link', $titleContentData)) {
                            $updateData['video_link'] = $titleContentData['video_link'];
                        }
    
                        $titleContent->update($updateData);
                    }
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

            Quiz::where('course_id', $courseId)
                ->update(['status' => 'pending']);

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

    public function getSalesRank()
    {
        $orderDetails = OrderDetail::where('status', 'success')
            ->with('course.user')
            ->get();

        $salesData = $orderDetails->groupBy('order_id')
            ->map(function ($group) {
                $totalRevenue = $group->sum('price');
                $courseId = $group->first()->course_id;
                $instructorName = $group->first()->course->user->name;

                return [
                    'order_id' => $group->first()->order_id,
                    'course_id' => $courseId,
                    'instructor_name' => $instructorName,
                    'total_revenue' => $totalRevenue,
                ];
            })
            ->sortByDesc('total_revenue')
            ->values()
            ->toArray();

        $rank = 1;
        foreach ($salesData as &$data) {
            $data['rank'] = $rank++;
        }

        return response()->json($salesData);
    }

    private function handleVideoUpload($file, $titleContent)
    {
        
        $s3 = new S3Client([
            'region'  => env('AWS_DEFAULT_REGION'),
            'version' => 'latest',
            'credentials' => [
                'key'    => env('AWS_ACCESS_KEY_ID'),
                'secret' => env('AWS_SECRET_ACCESS_KEY'),
            ],
            'http' => [
                'verify' => env('VERIFY_URL'),
            ],
        ]);

        
        if ($titleContent->video_link) {
            try {
                
                $oldKey = str_replace(env('AWS_URL'), '', $titleContent->video_link);
                $s3->deleteObject([
                    'Bucket' => env('AWS_BUCKET'),
                    'Key'    => $oldKey,
                ]);
            } catch (\Exception $e) {
                Log::error('Error deleting old video: ' . $e->getMessage());
            }
        }

        
        $filePath = $file->getRealPath();
        $contentId = $titleContent->content_id;
        $titleContentId = $titleContent->title_content_id;
        $originalFileName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $extension = $file->getClientOriginalExtension();
        $newFileName = "content_{$contentId}_title_{$titleContentId}_{$originalFileName}.{$extension}";
        $key = 'videos/' . $newFileName;

        
        $contentType = match ($extension) {
            'mp4' => 'video/mp4',
            'mov' => 'video/quicktime',
            'avi' => 'video/x-msvideo',
            'wmv' => 'video/x-ms-wmv',
            default => 'video/mp4',
        };

        try {
            
            $result = $s3->putObject([
                'Bucket' => env('AWS_BUCKET'),
                'Key'    => $key,
                'SourceFile' => $filePath,
                'ContentType' => $contentType,
                'ACL' => 'public-read',
            ]);

            return $result['ObjectURL'];
        } catch (\Exception $e) {
            throw new \Exception('Không thể upload video lên S3: ' . $e->getMessage());
        }
    }

    public function toggleCourseStatus(Request $request, $courseId)
    {
        try {
            $course = Course::where('course_id', $courseId)
                ->where('user_id', Auth::id())
                ->first();

            if (!$course) {
                return response()->json([
                    'status' => false,
                    'message' => 'Course not found or you do not have permission to modify this course'
                ], 404);
            }

            $newStatus = $course->status === 'published' ? 'draft' : 'published';

            if ($newStatus === 'published') {
                $isValid = true;

                if (!$isValid) {
                    return response()->json([
                        'status' => false,
                        'message' => 'Course cannot be published. Please ensure all required content is complete.'
                    ], 400);
                }
            }

            $course->status = $newStatus;
            $course->save();

            return response()->json([
                'status' => true,
                'message' => "Course status has been changed to {$newStatus}",
                'data' => $course
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error toggling course status: ' . $e->getMessage());

            return response()->json([
                'status' => false,
                'message' => 'An error occurred while updating the course status'
            ], 500);
        }
    }

    public function getCompletedCoursesStats()
    {
        try {
            $completedCoursesByTeacher = DB::table('certificates')
                ->join('courses', 'certificates.course_id', '=', 'courses.course_id')
                ->join('users', 'courses.user_id', '=', 'users.user_id')
                ->where('users.role', '=', 'teacher')
                ->select(
                    'users.user_id as teacher_id',
                    'users.name as teacher_name',
                    DB::raw('COUNT(DISTINCT certificates.course_id) as completed_courses_count'),
                    DB::raw('COUNT(DISTINCT certificates.user_id) as total_students')
                )
                ->groupBy('users.user_id', 'users.name')
                ->get();

            $detailedStats = [];
            foreach ($completedCoursesByTeacher as $teacherStats) {
                $courseDetails = DB::table('certificates')
                    ->join('courses', 'certificates.course_id', '=', 'courses.course_id')
                    ->join('users', 'courses.user_id', '=', 'users.user_id')
                    ->where('courses.user_id', $teacherStats->teacher_id)
                    ->where('users.role', '=', 'teacher')
                    ->select(
                        'courses.course_id',
                        'courses.title',
                        DB::raw('COUNT(DISTINCT certificates.user_id) as completion_count')
                    )
                    ->groupBy('courses.course_id', 'courses.title')
                    ->get();

                $detailedStats[$teacherStats->teacher_id] = [
                    'teacher_name' => $teacherStats->teacher_name,
                    'total_completed_courses' => $teacherStats->completed_courses_count,
                    'total_students' => $teacherStats->total_students,
                    'courses_breakdown' => $courseDetails
                ];
            }

            return response()->json([
                'status' => true,
                'data' => [
                    'summary' => $completedCoursesByTeacher,
                    'detailed' => $detailedStats
                ]
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error getting completed courses stats: ' . $e->getMessage());

            return response()->json([
                'status' => false,
                'message' => 'An error occurred while fetching completion statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getTeacherCompletionStats($teacherId)
    {
        try {
            $teacherExists = DB::table('users')
                ->where('user_id', $teacherId)
                ->where('role', '=', 'teacher')
                ->exists();

            if (!$teacherExists) {
                return response()->json([
                    'status' => false,
                    'message' => 'Teacher not found or user is not a teacher'
                ], 404);
            }

            $stats = DB::table('certificates')
                ->join('courses', 'certificates.course_id', '=', 'courses.course_id')
                ->join('users', 'courses.user_id', '=', 'users.user_id')
                ->where('courses.user_id', $teacherId)
                ->where('users.role', '=', 'teacher')
                ->select(
                    'courses.course_id',
                    'courses.title',
                    DB::raw('COUNT(DISTINCT certificates.user_id) as students_completed'),
                    DB::raw('MIN(certificates.created_at) as first_completion'),
                    DB::raw('MAX(certificates.created_at) as latest_completion')
                )
                ->groupBy('courses.course_id', 'courses.title')
                ->get();

            $totalUniqueStudents = DB::table('certificates')
                ->join('courses', 'certificates.course_id', '=', 'courses.course_id')
                ->join('users', 'courses.user_id', '=', 'users.user_id')
                ->where('courses.user_id', $teacherId)
                ->where('users.role', '=', 'teacher')
                ->distinct('certificates.user_id')
                ->count('certificates.user_id');

            $teacherInfo = DB::table('users')
                ->select('name', 'email')
                ->where('user_id', $teacherId)
                ->first();

            return response()->json([
                'status' => true,
                'data' => [
                    'teacher_info' => $teacherInfo,
                    'total_unique_students' => $totalUniqueStudents,
                    'courses_completion' => $stats
                ]
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error getting teacher completion stats: ' . $e->getMessage());

            return response()->json([
                'status' => false,
                'message' => 'An error occurred while fetching teacher statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getTeacherOrderHistory($teacherId)
    {
        try {
            $teacherExists = DB::table('users')
                ->where('user_id', $teacherId)
                ->where('role', 'teacher')
                ->exists();

            if (!$teacherExists) {
                return response()->json([
                    'status' => false,
                    'message' => 'Teacher not found or user is not a teacher'
                ], 404);
            }

            $orderHistory = DB::table('order_detail as od')
                ->join('courses as c', 'od.course_id', '=', 'c.course_id')
                ->join('orders as o', 'od.order_id', '=', 'o.order_id')
                ->join('users as u', 'o.user_id', '=', 'u.user_id')
                ->where('c.user_id', $teacherId)
                ->where('od.status', 'success')
                ->select(
                    'od.order_detail_id',
                    'od.order_id',
                    'od.course_id',
                    'c.title as course_title',
                    'od.price',
                    'od.status',
                    'o.created_at as order_date',
                    'u.user_id as student_id',
                    'u.name as student_name',
                    'u.email as student_email'
                )
                ->orderBy('o.created_at', 'desc')
                ->get();

            $statistics = [
                'total_orders' => $orderHistory->count(),
                'total_revenue' => $orderHistory->sum('price'),
                'course_stats' => $orderHistory->groupBy('course_id')
                    ->map(function ($orders) {
                        return [
                            'course_title' => $orders->first()->course_title,
                            'total_sales' => $orders->count(),
                            'total_revenue' => $orders->sum('price'),
                            'average_price' => round($orders->avg('price'), 2)
                        ];
                    })
            ];

            $ordersByStatus = $orderHistory->groupBy('status')->map->count();

            return response()->json([
                'status' => true,
                'data' => [
                    'orders' => $orderHistory,
                    'statistics' => [
                        'summary' => [
                            'total_orders' => $statistics['total_orders'],
                            'total_revenue' => $statistics['total_revenue'],
                            'orders_by_status' => $ordersByStatus
                        ],
                        'by_course' => $statistics['course_stats']
                    ]
                ]
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error getting teacher order history: ' . $e->getMessage());

            return response()->json([
                'status' => false,
                'message' => 'An error occurred while fetching order history',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getCourseOrderHistory($courseId)
    {
        try {
            $course = Course::where('course_id', $courseId)
                ->where('user_id', Auth::id())
                ->first();

            if (!$course) {
                return response()->json([
                    'status' => false,
                    'message' => 'Course not found or you do not have permission to view this course'
                ], 404);
            }

            $orderHistory = DB::table('order_detail as od')
                ->join('orders as o', 'od.order_id', '=', 'o.order_id')
                ->join('users as u', 'o.user_id', '=', 'u.user_id')
                ->where('od.course_id', $courseId)
                ->where('od.status', 'success')
                ->select(
                    'od.order_detail_id',
                    'od.order_id',
                    'od.price',
                    'od.status',
                    'o.created_at as order_date',
                    'u.user_id as student_id',
                    'u.name as student_name',
                    'u.email as student_email'
                )
                ->orderBy('o.created_at', 'desc')
                ->get();

            $statistics = [
                'total_orders' => $orderHistory->count(),
                'total_revenue' => $orderHistory->sum('price'),
                'average_price' => $orderHistory->avg('price'),
                'orders_by_status' => $orderHistory->groupBy('status')->map->count(),
                'monthly_stats' => $orderHistory
                    ->groupBy(function ($order) {
                        return Carbon::parse($order->order_date)->format('Y-m');
                    })
                    ->map(function ($orders) {
                        return [
                            'orders' => $orders->count(),
                            'revenue' => $orders->sum('price')
                        ];
                    })
            ];

            return response()->json([
                'status' => true,
                'data' => [
                    'course_info' => [
                        'course_id' => $course->course_id,
                        'title' => $course->title,
                        'price' => $course->price
                    ],
                    'orders' => $orderHistory,
                    'statistics' => $statistics
                ]
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error getting course order history: ' . $e->getMessage());

            return response()->json([
                'status' => false,
                'message' => 'An error occurred while fetching course order history',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
