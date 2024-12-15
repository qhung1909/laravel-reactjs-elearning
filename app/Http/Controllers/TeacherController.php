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
    public function getMeetingOnline()
    {
        if (!Auth::check()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Vui lòng đăng nhập để xem lịch dạy online'
            ], 401);
        }

        try {
            $userId = Auth::id();

            $contents = DB::table('contents as c')
                ->join('online_meetings as om', 'c.content_id', '=', 'om.content_id')
                ->join('teaching_schedule as ts', 'om.meeting_id', '=', 'ts.meeting_id')
                ->join('courses as co', 'c.course_id', '=', 'co.course_id') 
                ->where('c.is_online_meeting', true)
                ->where('ts.user_id', $userId)
                ->select([
                    'c.content_id',
                    'c.name_content',
                    'c.course_id',
                    'co.title as course_title',  
                    'om.meeting_id',
                    'om.meeting_url',
                    'om.start_time',
                    'om.end_time',
                    'ts.proposed_start',
                    'ts.notes'
                ])
                ->orderBy('ts.proposed_start', 'asc')
                ->get();

            if ($contents->isEmpty()) {
                return response()->json([
                    'status' => 'success',
                    'message' => 'Hiện tại bạn chưa có lịch dạy online nào',
                    'data' => []
                ], 200);
            }

            $formattedContents = $contents->map(function ($content) {
                return [
                    'content_id' => $content->content_id,
                    'name_content' => $content->name_content,
                    'course' => [                     
                        'course_id' => $content->course_id,
                        'title' => $content->course_title
                    ],
                    'meeting' => [
                        'meeting_id' => $content->meeting_id,
                        'meeting_url' => $content->meeting_url,
                        'schedule' => [
                            'start_time' => Carbon::parse($content->start_time)->format('Y-m-d H:i:s'),
                            'end_time' => Carbon::parse($content->end_time)->format('Y-m-d H:i:s'),
                            'proposed_start' => Carbon::parse($content->proposed_start)->format('Y-m-d H:i:s')
                        ],
                        'notes' => $content->notes
                    ]
                ];
            });

            return response()->json([
                'status' => 'success',
                'data' => $formattedContents
            ]);
        } catch (\Exception $e) {
            Log::error('Error in getMeetingOnline: ' . $e->getMessage());

            return response()->json([
                'status' => 'error',
                'message' => 'Có lỗi xảy ra khi lấy thông tin nội dung học online',
                'error' => $e->getMessage()
            ], 500);
        }
    }

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
            ->where(function($query) {
                $query->where('status', 'draft')
                      ->orWhere('status', 'published')
                      ->orWhere('status', 'hide')
                      ->orWhere('status', 'revision_requested');
            })
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
            ->where(function($query) {
                $query->where('status', 'draft')
                      ->orWhere('status', 'published')
                      ->orWhere('status', 'hide')
                      ->orWhere('status', 'revision_requested');
            })
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
            Log::info('Request data:', $request->all());
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

            if (empty($request->title_contents)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Vui lòng cung cấp dữ liệu cần cập nhật'
                ], 422);
            }

            $validator = Validator::make($request->all(), [
                'title_contents.*.title_content_id' => 'required|exists:title_content,title_content_id',
                'title_contents.*.body_content' => 'required|string',
                'title_contents.*.video_link' => 'nullable',
                'title_contents.*.document_link' => 'nullable|string',
                'title_contents.*.description' => 'nullable|string'
            ], [
                'title_contents.*.body_content.required' => 'Nội dung không được để trống',
                'title_contents.*.title_content_id.required' => 'ID không được để trống',
                'title_contents.*.title_content_id.exists' => 'ID không tồn tại',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => $validator->errors()->first(),
                    'errors' => $validator->errors()
                ], 422);
            }

            DB::beginTransaction();
            try {
                foreach ($request->title_contents as $index => $titleContentData) {
                    $titleContent = TitleContent::where('title_content_id', $titleContentData['title_content_id'])
                        ->where('content_id', $contentId)
                        ->first();

                    if (!$titleContent) {
                        throw new \Exception("ID {$titleContentData['title_content_id']} không hợp lệ");
                    }

                    $updateData = [
                        'body_content' => $titleContentData['body_content'],
                        'document_link' => $titleContentData['document_link'] ?? $titleContent->document_link,
                        'description' => $titleContentData['description'] ?? $titleContent->description,
                        'status' => 'draft'
                    ];

                    if (isset($titleContentData['document_link']) && !empty($titleContentData['document_link'])) {
                        $updateData['document_link'] = $titleContentData['document_link'];
                    } else {
                        $updateData['document_link'] = null;
                    }

                    if ($request->hasFile("title_contents.{$index}.video_link")) {
                        $videoFile = $request->file("title_contents.{$index}.video_link");
                        $videoValidator = Validator::make(['video' => $videoFile], [
                            'video' => 'file|mimes:mp4,mov,avi,wmv|max:102400'
                        ], [
                            'video.max' => 'File video không được vượt quá 100MB'
                        ]);

                        if ($videoValidator->fails()) {
                            throw new \Exception($videoValidator->errors()->first('video'));
                        }

                        $updateData['video_link'] = $this->handleVideoUpload($videoFile, $titleContent);
                    } else {
                        $updateData['video_link'] = $titleContent->video_link;
                    }

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

    public function removeVideoLink($titleContentId)
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

                if ($titleContent->video_link) {
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

                    $oldKey = str_replace(env('AWS_URL'), '', $titleContent->video_link);

                    try {
                        $s3->deleteObject([
                            'Bucket' => env('AWS_BUCKET'),
                            'Key'    => $oldKey,
                        ]);
                    } catch (\Exception $e) {
                        Log::error('Lỗi xóa video cũ trên S3: ' . $e->getMessage());
                    }
                }

                $titleContent->update([
                    'video_link' => null,
                    'status' => 'draft'
                ]);

                DB::commit();

                return response()->json([
                    'success' => true,
                    'message' => 'Xóa video liên kết thành công'
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
        try {
            Log::info('Starting video upload process', [
                'file_info' => [
                    'original_name' => $file->getClientOriginalName(),
                    'size' => $file->getSize(),
                    'mime_type' => $file->getMimeType(),
                    'temp_path' => $file->getRealPath()
                ]
            ]);

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

            Log::info('S3 client initialized', [
                'region' => env('AWS_DEFAULT_REGION'),
                'bucket' => env('AWS_BUCKET')
            ]);

            if ($titleContent->video_link) {
                try {
                    $oldKey = str_replace(env('AWS_URL'), '', $titleContent->video_link);
                    Log::info('Attempting to delete old video', ['old_key' => $oldKey]);

                    $s3->deleteObject([
                        'Bucket' => env('AWS_BUCKET'),
                        'Key'    => $oldKey,
                    ]);

                    Log::info('Old video deleted successfully');
                } catch (\Exception $e) {
                    Log::error('Error deleting old video', [
                        'error' => $e->getMessage()
                    ]);
                }
            }

            $filePath = $file->getRealPath();
            $contentId = $titleContent->content_id;
            $titleContentId = $titleContent->title_content_id;
            $originalFileName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
            $extension = $file->getClientOriginalExtension();
            $newFileName = "content_{$contentId}_title_{$titleContentId}_{$originalFileName}.{$extension}";
            $key = 'videos/' . $newFileName;

            Log::info('Preparing to upload new video', [
                'new_file_name' => $newFileName,
                's3_key' => $key
            ]);

            $contentType = match ($extension) {
                'mp4' => 'video/mp4',
                'mov' => 'video/quicktime',
                'avi' => 'video/x-msvideo',
                'wmv' => 'video/x-ms-wmv',
                default => 'video/mp4',
            };

            try {
                Log::info('Uploading to S3', [
                    'bucket' => env('AWS_BUCKET'),
                    'key' => $key
                ]);

                $result = $s3->putObject([
                    'Bucket' => env('AWS_BUCKET'),
                    'Key'    => $key,
                    'SourceFile' => $filePath,
                    'ContentType' => $contentType,
                    'ACL' => 'public-read',
                ]);

                Log::info('Video upload successful', [
                    'url' => $result['ObjectURL']
                ]);

                return $result['ObjectURL'];
            } catch (\Exception $e) {
                Log::error('Failed to upload video to S3', [
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ]);
                throw new \Exception('Không thể upload video lên S3: ' . $e->getMessage());
            }
        } catch (\Exception $e) {
            Log::error('Video upload process failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
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

            $newStatus = $course->status === 'published' ? 'hide' : 'published';

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

    public function getCourseOnlineTeacher(Request $request)
    {
        try {
            if (!auth()->check()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Vui lòng đăng nhập để sử dụng chức năng này',
                    'data' => []
                ], 401);
            }

            $user = auth()->user();
            if (!$user) {
                return response()->json([
                    'status' => false,
                    'message' => 'Không thể lấy thông tin người dùng',
                    'data' => []
                ], 401);
            }

            if ($user->role !== 'teacher') {
                return response()->json([
                    'status' => false,
                    'message' => 'Bạn không có quyền truy cập chức năng này',
                    'data' => []
                ], 403);
            }

            $teacherId = $user->user_id;

            $courses = DB::table('courses as c')
                ->select([
                    'c.course_id',
                    'c.course_category_id',
                    'c.user_id',
                    'c.title as course_title',
                    'cnt.content_id',
                    'cnt.name_content',
                    'cnt.status as content_status',
                    'cnt.created_at as content_created_at',
                    'cnt.is_online_meeting',
                    'u.name as teacher_name'
                ])
                ->join('users as u', function ($join) use ($teacherId) {
                    $join->on('c.user_id', '=', 'u.user_id')
                        ->where('u.role', 'teacher')
                        ->where('u.user_id', $teacherId);
                })
                ->leftJoin('contents as cnt', function ($join) {
                    $join->on('c.course_id', '=', 'cnt.course_id')
                        ->where('cnt.is_online_meeting', '=', true);
                })
                ->whereExists(function ($query) {
                    $query->select(DB::raw(1))
                        ->from('contents')
                        ->whereColumn('contents.course_id', 'c.course_id')
                        ->where('contents.is_online_meeting', '=', true);
                })
                ->orderBy('c.course_id', 'desc')
                ->get();

            if ($courses->isEmpty()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Không tìm thấy khóa học online của bạn',
                    'data' => []
                ], 404);
            }

            $formattedCourses = collect($courses)
                ->groupBy('course_id')
                ->map(function ($coursesGroup) {
                    $course = $coursesGroup->first();

                    return [
                        'course_id' => $course->course_id,
                        'course_category_id' => $course->course_category_id,
                        'user_id' => $course->user_id,
                        'teacher_name' => $course->teacher_name,
                        'course_title' => $course->course_title,
                        'contents' => $coursesGroup
                            ->map(function ($content) {
                                if ($content->content_id && $content->is_online_meeting) {
                                    return [
                                        'content_id' => $content->content_id,
                                        'name_content' => $content->name_content,
                                        'status' => $content->content_status,
                                        'created_at' => $content->content_created_at,
                                        'is_online_meeting' => $content->is_online_meeting
                                    ];
                                }
                                return null;
                            })
                            ->filter()
                            ->values()
                    ];
                })
                ->values();

            return response()->json([
                'status' => true,
                'message' => 'Lấy danh sách khóa học online của bạn thành công',
                'data' => $formattedCourses
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage(),
                'data' => []
            ], 500);
        }
    }

    public function updateCourseDates(Request $request, $courseId)
    {
        try {
            $validator = Validator::make($request->all(), [
                'launch_date' => 'required|date|after:today',
                'backup_launch_date' => 'required|date|after:launch_date',
            ], [
                'launch_date.required' => 'Vui lòng chọn ngày bắt đầu khóa học',
                'launch_date.date' => 'Ngày bắt đầu không hợp lệ',
                'launch_date.after' => 'Ngày bắt đầu phải sau ngày hiện tại',
                'backup_launch_date.required' => 'Vui lòng chọn ngày kết thúc đăng ký',
                'backup_launch_date.date' => 'Ngày kết thúc đăng ký không hợp lệ',
                'backup_launch_date.after' => 'Ngày kết thúc đăng ký phải sau ngày bắt đầu khóa học',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            $course = Course::findOrFail($courseId);

            if (auth()->user()->role === 'teacher' && auth()->id() !== $course->user_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Bạn không có quyền cập nhật khóa học này'
                ], 403);
            }

            $course->launch_date = Carbon::parse($request->launch_date);
            $course->backup_launch_date = Carbon::parse($request->backup_launch_date);

            if ($course->status === 'expired' || $course->status === 'need_schedule') {
                $course->status = 'published';
            }

            $course->save();

            return response()->json([
                'success' => true,
                'data' => [
                    'course_id' => $course->course_id,
                    'launch_date' => $course->launch_date,
                    'backup_launch_date' => $course->backup_launch_date,
                    'status' => $course->status
                ]
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy khóa học'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra khi cập nhật khóa học',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function updatePriceDiscount(Request $request)
    {
        $validated = $request->validate([
            'course_id' => 'required|exists:courses,course_id',
            'price_discount' => 'required|numeric|min:0',
        ]);

        $course = Course::find($validated['course_id']);

        $course->price_discount = $validated['price_discount'];
        $course->save();

        return response()->json([
            'message' => 'Price discount updated successfully.',
            'course' => $course
        ]);
    }

    public function deletePriceDiscount(Request $request)
    {
        $validated = $request->validate([
            'course_id' => 'required|exists:courses,course_id',
        ]);

        $course = Course::find($validated['course_id']);

        if (!$course) {
            return response()->json([
                'message' => 'Course not found.'
            ], 404);
        }

        $course->price_discount = null;
        $course->save();

        return response()->json([
            'message' => 'Price discount deleted successfully.',
            'course' => $course
        ]);
    }
}
