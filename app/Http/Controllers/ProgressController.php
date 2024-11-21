<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\User;
use App\Models\Course;
use App\Models\Content;
use App\Models\Progress;
use App\Models\Certificate;
use Illuminate\Http\Request;
use App\Mail\CourseCompletedMail;
use Illuminate\Support\Facades\Mail;

class ProgressController extends Controller
{
    public function index(Request $request)
    {
        $progresses = Progress::query();
        if ($request->has('user_id')) {
            $progresses->where('user_id', $request->user_id);
        }
        return response()->json($progresses->get());
    }

    public function completeContent(Request $request)
    {
        $userId = auth()->id(); 
        $contentId = $request->input('content_id');
        $courseId = $request->input('course_id');

        $existingProgress = Progress::where('user_id', $userId)
            ->where('content_id', $contentId)
            ->first();

        if (!$existingProgress) {
            Progress::create([
                'user_id' => $userId,
                'course_id' => $courseId,
                'content_id' => $contentId,
                'is_complete' => 1,
                'complete_at' => Carbon::now(),
                'complete_update' => Carbon::now(),
            ]);
        }

        $totalContents = Content::where('course_id', $courseId)->count();
        $completedContents = Progress::where('user_id', $userId)
            ->where('course_id', $courseId)
            ->count();

        $progressPercent = ($completedContents / $totalContents) * 100;

        Progress::where('user_id', $userId)
            ->where('course_id', $courseId)
            ->update(['progress_percent' => $progressPercent]);

        if ($completedContents >= $totalContents) {
            $existingCertificate = Certificate::where([
                'user_id' => $userId,
                'course_id' => $courseId
            ])->first();

            if (!$existingCertificate) {
                Certificate::create([
                    'user_id' => $userId,
                    'course_id' => $courseId,
                    'issue_at' => Carbon::now(),
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now()
                ]);

                $user = User::find($userId);
                $course = Course::find($courseId);
                
                Mail::to($user->email)->send(new CourseCompletedMail($user, $course));
                
                return response()->json([
                    'message' => 'Course completed, certificate generated and email sent',
                    'progress_percent' => $progressPercent
                ]);
            }
        }

        return response()->json([
            'message' => 'Progress updated',
            'progress_percent' => $progressPercent
        ]);
    }
}