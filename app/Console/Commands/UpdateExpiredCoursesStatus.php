<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Course;
use App\Models\UserCourse;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class UpdateExpiredCoursesStatus extends Command
{
    protected $signature = 'courses:update-expired-status';
    protected $description = 'Update status of courses with backup launch date in the past and notify teachers';

    public function handle()
    {
        $now = Carbon::now();

        $expiredCourses = Course::where('backup_launch_date', '<=', $now)
            ->whereNotIn('status', ['expired', 'need_schedule'])
            ->with(['user' => function($query) {
                $query->where('role', 'teacher');
            }])
            ->get();

        foreach ($expiredCourses as $course) {
            $hasStudents = UserCourse::where('course_id', $course->course_id)
                ->whereNotNull('order_id')
                ->exists();

            if ($hasStudents) {
                $course->status = 'need_schedule';
                $course->save();

                if ($course->user) {
                    Mail::send('emails.course_expired', [
                        'course' => $course,
                        'hasStudents' => true
                    ], function($message) use ($course) {
                        $message->to($course->user->email)
                            ->subject('Cập nhật lịch học khóa học - ' . $course->title);
                    });
                }

                Log::info("Course {$course->course_id} status updated to need_schedule due to expired backup launch date with enrolled students.");
            } else {
                $course->status = 'expired';
                $course->save();

                if ($course->user) {
                    Mail::send('emails.course_expired', [
                        'course' => $course,
                        'hasStudents' => false
                    ], function($message) use ($course) {
                        $message->to($course->user->email)
                            ->subject('Yêu cầu cập nhật khóa học - ' . $course->title);
                    });
                }

                Log::info("Course {$course->course_id} status updated to expired due to no enrollments.");
            }
        }

        $this->info(count($expiredCourses) . " courses have been processed.");

        return 0;
    }
}