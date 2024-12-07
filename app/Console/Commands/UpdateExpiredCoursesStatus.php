<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Course;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class UpdateExpiredCoursesStatus extends Command
{
    protected $signature = 'courses:update-expired-status';
    protected $description = 'Update status of courses with backup launch date in the past';

    public function handle()
    {
        $now = Carbon::now();

        $expiredCourses = Course::where('backup_launch_date', '<=', $now)
            ->where('status', '!=', 'hide')
            ->get();

        foreach ($expiredCourses as $course) {
            $course->status = 'hide';
            $course->save();

            Log::info("Course {$course->course_id} status updated to hide due to expired backup launch date.");
        }

        $this->info(count($expiredCourses) . " courses have been hidden.");

        return 0;
    }
}