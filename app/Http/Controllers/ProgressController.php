<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\Quiz;
use App\Models\User;
use App\Models\Course;
use App\Models\Content;
use App\Models\Progress;
use App\Models\Certificate;
use App\Models\QuizSession;
use App\Models\TitleContent;
use Illuminate\Http\Request;
use App\Mail\CourseCompletedMail;
use Illuminate\Support\Facades\Log;
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
        $isAutoComplete = $request->input('is_auto_complete', false);

        $content = TitleContent::where('content_id', $contentId)->first();

        if ($content && $content->document_link && !$content->video_link && !$isAutoComplete) {
            return response()->json([
                'message' => 'Document viewed started',
                'progress_percent' => $this->getProgressPercent($userId, $courseId),
                'requires_timeout' => true
            ]);
        }

        $quiz = Quiz::where('content_id', $contentId)->first();

        if ($quiz) {
            $quizSession = QuizSession::where('user_id', $userId)
                ->where('quiz_id', $quiz->quiz_id)
                ->where('status', 'completed')
                ->first();

            if (!$quizSession) {
                return response()->json([
                    'message' => 'Quiz not completed',
                    'progress_percent' => $this->getProgressPercent($userId, $courseId)
                ]);
            }
        }

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

        $progressPercent = $this->getProgressPercent($userId, $courseId);

        if ($progressPercent >= 100) {
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

                try {
                    Mail::to($user->email)->send(new CourseCompletedMail($user, $course));
                } catch (\Exception $e) {
                    Log::error('Error sending course completion email: ' . $e->getMessage());
                }

                return response()->json([
                    'message' => 'Course completed, certificate generated',
                    'progress_percent' => $progressPercent
                ]);
            }
        }

        return response()->json([
            'message' => 'Progress updated',
            'progress_percent' => $progressPercent
        ]);
    }

    private function getProgressPercent($userId, $courseId)
    {
        $totalContents = Content::where('course_id', $courseId)->count();

        if ($totalContents === 0) {
            return 0;
        }

        $completedContents = Progress::where('user_id', $userId)
            ->where('course_id', $courseId)
            ->count();

        return ($completedContents / $totalContents) * 100;
    }

    public function checkQuizCompletion(Request $request)
    {
        $userId = auth()->id();

        $contentId = $request->input('content_id');

        $quiz = Quiz::where('content_id', $contentId)->first();

        if (!$quiz) {
            return response()->json([
                'quiz_completed' => true, 
                'has_quiz' => false
            ]);
        }

        $quizSession = QuizSession::where('user_id', $userId)
            ->where('quiz_id', $quiz->quiz_id)
            ->where('status', 'completed')
            ->first();

        return response()->json([
            'quiz_completed' => $quizSession ? true : false,
            'has_quiz' => true,
            'quiz_id' => $quiz->quiz_id
        ]);
    }
}
