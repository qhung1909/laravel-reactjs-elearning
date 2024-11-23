<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\Content;
use App\Models\UserCourse;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\OnlineMeeting;
use Illuminate\Support\Facades\Validator;

class OnlineMeetingController extends Controller
{
    public function createMeeting(Request $request, $content_id)
    {
        $validator = Validator::make($request->all(), [
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
        ], [
            'start_time.required' => 'Thời gian bắt đầu là bắt buộc.',
            'end_time.required' => 'Thời gian kết thúc là bắt buộc.',
            'end_time.after' => 'Thời gian kết thúc phải sau thời gian bắt đầu.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Dữ liệu không hợp lệ.',
                'errors' => $validator->errors()
            ], 422);
        }

        $content = Content::find($content_id);
        if (!$content) {
            return response()->json([
                'success' => false,
                'message' => 'Content ID không tồn tại.'
            ], 404);
        }

        $existingMeeting = OnlineMeeting::where('content_id', $content_id)->first();
        if ($existingMeeting) {
            return response()->json([
                'success' => false,
                'message' => 'Content ID này đã được sử dụng cho một cuộc họp.'
            ], 409);
        }

        try {
            $meetingUrl = 'http://localhost:5173/jitsitest/' . Str::uuid();

            $onlineMeeting = new OnlineMeeting([
                'content_id' => $content_id,
                'start_time' => $request->start_time,
                'end_time' => $request->end_time,
                'meeting_url' => $meetingUrl,
            ]);
            $onlineMeeting->save();

            return response()->json([
                'success' => true,
                'message' => 'Tạo cuộc họp trực tuyến thành công.',
                'data' => $onlineMeeting
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi: ' . $e->getMessage()
            ], 500);
        }
    }


    public function getMeetingByUuid($uuid)
    {
        $onlineMeeting = OnlineMeeting::where('meeting_url', 'like', "%$uuid")->first();

        if (!$onlineMeeting) {
            return response()->json([
                'success' => false,
                'message' => 'Cuộc họp không tồn tại.'
            ], 404);
        }

        $data = [
            'meeting_id' => $onlineMeeting->meeting_id,
            'content_id' => $onlineMeeting->content_id,
        ];

        return response()->json([
            'success' => true,
            'message' => 'Lấy thông tin cuộc họp thành công.',
            'data' => $data
        ], 200);
    }


    public function getUpcomingMeeting(Request $request)
    {
        try {
            $userId = auth()->id();
    
            // Lấy ra các khóa học của user
            $userCourses = UserCourse::where('user_id', $userId)
                ->pluck('course_id');
    
            // Lấy ra tất cả các buổi học của các khóa học đó
            $meetings = OnlineMeeting::whereIn('online_meetings.course_id', $userCourses)
                ->join('courses', 'online_meetings.course_id', '=', 'courses.course_id')
                ->join('users', 'courses.user_id', '=', 'users.user_id')
                ->leftJoin('contents', 'online_meetings.content_id', '=', 'contents.content_id') // Join thêm với bảng `contents`
                ->where('users.role', 'teacher')
                ->select([
                    'online_meetings.meeting_id',
                    'online_meetings.content_id',
                    'online_meetings.meeting_url',
                    'online_meetings.start_time',
                    'online_meetings.end_time',
                    'contents.name_content as content_name', // Lấy tên nội dung
                    'courses.course_id',
                    'courses.title as course_title',
                    'courses.user_id as teacher_id',
                    'users.name as teacher_name'
                ])
                ->get();
    
            // Định dạng dữ liệu trả về
            $responseData = $meetings->map(function ($meeting) {
                $startTime = Carbon::parse($meeting->start_time);
                $endTime = Carbon::parse($meeting->end_time);
    
                if ($startTime->isFuture()) {
                    $status = 'upcoming'; // Sắp diễn ra
                } elseif ($startTime->isPast() && $endTime->isFuture()) {
                    $status = 'ongoing'; // Đang diễn ra
                } elseif ($endTime->isPast()) {
                    $status = 'completed'; // Đã kết thúc
                }
    
                return [
                    'meeting_id' => $meeting->meeting_id,
                    'meeting_url' => $meeting->meeting_url,
                    'content_name' => $meeting->content_name ?? 'Không có nội dung', // Trả về tên hoặc giá trị mặc định
                    'start_time' => $startTime->format('Y-m-d H:i:s'),
                    'end_time' => $endTime->format('Y-m-d H:i:s'),
                    'status' => $status,
                    'course' => [
                        'course_id' => $meeting->course_id,
                        'title' => $meeting->course_title,
                        'teacher' => [
                            'id' => $meeting->teacher_id,
                            'name' => $meeting->teacher_name
                        ]
                    ]
                ];
            });
    
            return response()->json([
                'status' => 'success',
                'data' => $responseData
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage()
            ], 500);
        }
    }
    
}
