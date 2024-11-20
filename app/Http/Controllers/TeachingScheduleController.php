<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\User;
use App\Models\Course;
use App\Models\Content;
use App\Models\UserCourse;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\OnlineMeeting;
use App\Models\TeachingSchedule;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use App\Mail\StudentScheduleNotification;
use App\Mail\TeacherScheduleNotification;
use Illuminate\Support\Facades\Validator;

class TeachingScheduleController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = TeachingSchedule::with(['onlineMeeting' => function ($query) {
                $query->with(['course', 'content']);
            }]);

            if ($request->has('user_id')) {
                $query->where('user_id', $request->user_id);
            }

            if ($request->has('start_date') && $request->has('end_date')) {
                $query->whereBetween('proposed_start', [
                    $request->start_date,
                    $request->end_date
                ]);
            }

            $schedules = $query->orderBy('proposed_start', 'desc')->get();

            return response()->json([
                'success' => true,
                'message' => 'Lấy danh sách lịch dạy thành công',
                'data' => $schedules
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        if ($request->user()->user_id !== $request->user_id) {
            return response()->json([
                'success' => false,
                'message' => 'Bạn không có quyền tạo lịch dạy cho user khác'
            ], 403);
        }

        $validated = $request->validate([
            'user_id' => 'required|exists:users,user_id',
            'course_id' => 'required|exists:courses,course_id',
            'content_id' => 'required|exists:contents,content_id',
            'proposed_start' => 'required|date|after:now',
            'notes' => 'nullable|string|max:255',
        ]);

        try {
            $proposedStartTime = Carbon::parse($request->proposed_start);
            $currentTime = Carbon::now();

            if ($proposedStartTime->isPast()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không thể tạo lịch dạy trong quá khứ'
                ], 422);
            }

            if ($proposedStartTime->diffInHours($currentTime) < 1) {
                return response()->json([
                    'success' => false,
                    'message' => 'Thời gian bắt đầu phải cách hiện tại ít nhất 1 giờ'
                ], 422);
            }

            $teacher = User::findOrFail($request->user_id);
            $course = Course::where('course_id', $request->course_id)
                ->where('user_id', $request->user_id)
                ->first();

            if (!$course) {
                return response()->json([
                    'success' => false,
                    'message' => 'Khóa học không tồn tại hoặc không thuộc về giảng viên này'
                ], 403);
            }

            $content = Content::where('content_id', $request->content_id)
                ->where('course_id', $request->course_id)
                ->where('is_online_meeting', true)
                ->first();

            if (!$content) {
                return response()->json([
                    'success' => false,
                    'message' => 'Nội dung không tồn tại hoặc không cho phép tạo meeting'
                ], 404);
            }

            $existingMeeting = OnlineMeeting::where('course_id', $request->course_id)
                ->where('content_id', $request->content_id)
                ->first();

            if ($existingMeeting) {
                return response()->json([
                    'success' => false,
                    'message' => 'Khóa học và nội dung này đã có meeting'
                ], 422);
            }

            $proposedEndTime = $proposedStartTime->copy()->addHours(2);
            $existingSchedule = TeachingSchedule::where('user_id', $request->user_id)
                ->where(function ($query) use ($proposedStartTime, $proposedEndTime) {
                    $query->whereBetween('proposed_start', [$proposedStartTime, $proposedEndTime])
                        ->orWhereBetween(
                            DB::raw('DATE_ADD(proposed_start, INTERVAL 2 HOUR)'),
                            [$proposedStartTime, $proposedEndTime]
                        );
                })
                ->first();

            if ($existingSchedule) {
                return response()->json([
                    'success' => false,
                    'message' => 'Đã có lịch dạy trong khoảng thời gian này'
                ], 422);
            }

            $result = DB::transaction(function () use ($request, $proposedStartTime, $teacher, $course, $content) {
                $schedule = TeachingSchedule::create([
                    'user_id' => $request->user_id,
                    'proposed_start' => $proposedStartTime,
                    'notes' => $request->notes,
                ]);

                $meeting = OnlineMeeting::create([
                    'content_id' => $request->content_id,
                    'course_id' => $request->course_id,
                    'meeting_url' => 'http://localhost:5173/lesson/meeting/' . Str::uuid(),
                    'start_time' => $proposedStartTime,
                    'end_time' => $proposedStartTime->copy()->addHours(2),
                ]);

                $schedule->update(['meeting_id' => $meeting->meeting_id]);

                $this->sendTeacherScheduleNotification($teacher, $course, $content, $proposedStartTime, $meeting, $request->notes);
                $this->sendStudentScheduleNotifications($course, $content, $teacher, $proposedStartTime, $meeting, $schedule);

                $schedule->load([
                    'user',
                    'onlineMeeting' => function ($query) {
                        $query->with(['course', 'content']);
                    }
                ]);

                return $schedule;
            });

            return response()->json([
                'success' => true,
                'message' => 'Tạo lịch dạy thành công',
                'data' => $result
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage()
            ], 500);
        }
    }

    private function sendTeacherScheduleNotification($teacher, $course, $content, $proposedStartTime, $meeting, $notes)
    {
        try {
            Mail::to($teacher->email)->queue(new TeacherScheduleNotification([
                'teacher_name' => $teacher->name,
                'course_name' => $course->title,
                'content_name' => $content->name_content,
                'start_time' => $proposedStartTime->format('H:i d/m/Y'),
                'meeting_url' => $meeting->meeting_url,
                'notes' => $notes
            ]));
        } catch (\Exception $e) {
            Log::error('Lỗi gửi mail cho giảng viên: ' . $e->getMessage(), [
                'teacher_id' => $teacher->user_id,
                'course_id' => $course->course_id
            ]);
        }
    }


    private function sendStudentScheduleNotifications($course, $content, $teacher, $proposedStartTime, $meeting, $schedule)
    {
        try {
            $students = DB::table('user_courses')
                ->join('users', 'user_courses.user_id', '=', 'users.user_id')
                ->where('user_courses.course_id', $course->course_id)
                ->select('users.email', 'users.name')
                ->get();

            if ($students->isEmpty()) {
                Log::warning('Không có học viên nào có email trong khóa học này', [
                    'course_id' => $course->course_id
                ]);
                return;
            }

            foreach ($students as $student) {
                Mail::to($student->email)->queue(new StudentScheduleNotification([
                    'student_name' => $student->name ?? 'Học viên',
                    'course_name' => $course->title,
                    'content_name' => $content->name_content,
                    'teacher_name' => $teacher->name,
                    'start_time' => $proposedStartTime->format('H:i d/m/Y'),
                    'meeting_url' => $meeting->meeting_url
                ]));
            }
        } catch (\Exception $e) {
            Log::error('Lỗi gửi mail cho học viên: ' . $e->getMessage(), [
                'meeting_id' => $meeting->meeting_id,
                'course_id' => $course->course_id
            ]);
        }
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'proposed_start' => 'required|date|after:now',
            'notes' => 'nullable|string',
        ]);

        try {
            $schedule = TeachingSchedule::with('onlineMeeting')->findOrFail($id);

            if ($schedule->user_id != $request->user_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không có quyền chỉnh sửa lịch dạy này'
                ], 403);
            }

            $existingSchedule = TeachingSchedule::where('user_id', $schedule->user_id)
                ->where('proposed_start', $request->proposed_start)
                ->where('id', '!=', $id)
                ->first();

            if ($existingSchedule) {
                return response()->json([
                    'success' => false,
                    'message' => 'Đã có lịch dạy trong thời gian này'
                ], 422);
            }

            $result = DB::transaction(function () use ($request, $schedule) {
                $schedule->update([
                    'proposed_start' => $request->proposed_start,
                    'notes' => $request->notes,
                ]);

                if ($schedule->onlineMeeting) {
                    $schedule->onlineMeeting->update([
                        'start_time' => $request->proposed_start,
                        'end_time' => Carbon::parse($request->proposed_start)->addHours(2),
                    ]);
                }

                $schedule->refresh();
                $schedule->load(['onlineMeeting' => function ($query) {
                    $query->with(['course', 'content']);
                }]);

                return $schedule;
            });

            return response()->json([
                'success' => true,
                'message' => 'Cập nhật lịch dạy thành công',
                'data' => $result
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy(Request $request, $id)
    {
        try {
            $schedule = TeachingSchedule::with('onlineMeeting')->findOrFail($id);

            if ($schedule->user_id != $request->user_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không có quyền xóa lịch dạy này'
                ], 403);
            }

            DB::transaction(function () use ($schedule) {
                if ($schedule->onlineMeeting) {
                    $schedule->onlineMeeting->delete();
                }

                $schedule->delete();
            });

            return response()->json([
                'success' => true,
                'message' => 'Xóa lịch dạy thành công'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show($meeting_id)
    {
        if (!Auth::check()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized access. Please log in.',
                'data' => null
            ], 401);
        }

        $schedule = TeachingSchedule::where('meeting_id', $meeting_id)->first();

        if (!$schedule) {
            return response()->json([
                'status' => 'error',
                'message' => 'Teaching schedule not found',
                'data' => null
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Teaching schedule retrieved successfully',
            'data' => $schedule
        ], 200);
    }

    public function getUpcomingMeetings()
    {
        $user_id = Auth::id();

        $meetings = OnlineMeeting::select(
            'online_meetings.meeting_url',
            'online_meetings.start_time',
            'online_meetings.end_time',
            'courses.title as course_title',
            'contents.name_content as content_name'
        )
            ->join('user_courses', 'online_meetings.course_id', '=', 'user_courses.course_id')
            ->join('courses', 'online_meetings.course_id', '=', 'courses.course_id')
            ->join('contents', 'online_meetings.content_id', '=', 'contents.content_id')
            ->where('user_courses.user_id', $user_id)
            ->where('online_meetings.start_time', '>', now())
            ->orderBy('online_meetings.start_time', 'asc')
            ->get();

        if ($meetings->isEmpty()) {
            return response()->json([
                'status' => 'success',
                'message' => 'Không có lịch học nào sắp tới',
                'data' => []
            ]);
        }

        return response()->json([
            'status' => 'success',
            'data' => $meetings
        ]);
    }
}
