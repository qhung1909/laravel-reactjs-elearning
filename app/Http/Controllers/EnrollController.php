<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\User;
use App\Models\Course;
use App\Models\Enroll;
use App\Models\Content;
use App\Models\UserCourse;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\OnlineMeeting;
use App\Models\TeachingSchedule;
use Illuminate\Support\Facades\DB;
use App\Mail\EnrollmentConfirmation;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use App\Mail\FirstLectureNotification;
use Illuminate\Support\Facades\Validator;

class EnrollController extends Controller
{
    public function enroll(Request $request)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
    
        $validator = Validator::make($request->all(), [
            'course_id' => 'required|exists:courses,course_id',
        ]);
    
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
    
        $userCourse = UserCourse::where('user_id', Auth::id())
            ->where('course_id', $request->course_id)
            ->first();
    
        if (!$userCourse) {
            return response()->json(['message' => 'Bạn phải mua khóa học trước.'], 409);
        }
    
        $existingEnroll = Enroll::where('user_id', Auth::id())
            ->where('course_id', $request->course_id)
            ->first();
    
        if ($existingEnroll) {
            return response()->json(['message' => 'You are already enrolled in this course.'], 409);
        }
    
        try {
            DB::beginTransaction();
    
            $enroll = Enroll::create([
                'user_id' => Auth::id(),
                'course_id' => $request->course_id,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
    
            $course = Course::find($request->course_id);
            $user = Auth::user();
    
            if ($course->is_online_meeting == 1) {
                $existingMeeting = OnlineMeeting::where('course_id', $request->course_id)->first();
    
                if (!$existingMeeting) {
                    $instructor = User::where('user_id', $course->user_id)
                        ->where('role', 'teacher')
                        ->first();
    
                    if (!$instructor || $instructor->status == 0) {
                        throw new \Exception('Không thể tạo lịch học vì tài khoản giảng viên đang bị khóa. Vui lòng liên hệ admin.');
                    }
    
                    $firstOnlineMeetingContent = Content::where('course_id', $request->course_id)
                        ->where('is_online_meeting', 1)
                        ->orderBy('content_id')
                        ->first();
    
                    if ($firstOnlineMeetingContent) {
                        $currentDate = Carbon::now()->startOfDay();
                        $courseLaunchDate = Carbon::parse($course->launch_date)->startOfDay();
    
                        if ($courseLaunchDate->lt($currentDate)) {
                            if (!$course->backup_launch_date) {
                                throw new \Exception('Không thể tạo lịch học vì ngày học chính đã qua và không có ngày học dự phòng.');
                            }
                            $startTime = $course->backup_launch_date;
                        } else {
                            $startTime = $course->launch_date;
                        }
    
                        $meetingUrl = 'http://localhost:5173/lesson/meeting/' . Str::uuid();
    
                        $onlineMeeting = OnlineMeeting::create([
                            'content_id' => $firstOnlineMeetingContent->content_id,
                            'course_id' => $request->course_id,
                            'start_time' => $startTime,
                            'end_time' => Carbon::parse($startTime)->addHours(2),
                            'meeting_url' => $meetingUrl,
                        ]);
    
                        TeachingSchedule::create([
                            'meeting_id' => $onlineMeeting->meeting_id,
                            'user_id' => $course->user_id,
                            'proposed_start' => $startTime,
                            'notes' => 'Buổi học đầu tiên của khóa học ' . $course->title
                        ]);
    
                        Mail::to($instructor->email)
                            ->queue(new FirstLectureNotification(
                                $instructor,
                                $course,
                                $onlineMeeting->start_time,
                                $onlineMeeting->end_time
                            ));
                    }
                }
            }
    
            Mail::to($user->email)->send(new EnrollmentConfirmation($user, $course));
    
            DB::commit();
    
            return response()->json([
                'data' => $enroll,
                'message' => 'Enrollment successful and confirmation email sent'
            ], 201);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'message' => 'Error occurred while enrolling: ' . $e->getMessage()
            ], 500);
        }
    }
    

    public function checkEnrollment(Request $request)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $validator = Validator::make($request->all(), [
            'course_id' => 'required|exists:courses,course_id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $isEnrolled = Enroll::where('user_id', Auth::id())
            ->where('course_id', $request->course_id)
            ->exists();

        return response()->json(['enrolled' => $isEnrolled], 200);
    }

    public function index()
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $userId = Auth::id();

        $enrolls = Enroll::where('user_id', $userId)->get();

        return response()->json($enrolls, 200);
    }



    public function show($id)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $enroll = Enroll::find($id);
        if (!$enroll) {
            return response()->json(['message' => 'Enroll not found'], 404);
        }

        if (Auth::id() !== $enroll->user_id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        return response()->json($enroll, 200);
    }


    public function destroy($id)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $enroll = Enroll::find($id);
        if (!$enroll) {
            return response()->json(['message' => 'Enroll not found'], 404);
        }

        $enroll->delete();
        return response()->json(['message' => 'Enroll deleted successfully'], 200);
    }
}
