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
use Illuminate\Support\Facades\DB;
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

    private function validateCourseAccess($userId, $courseId)
    {
        return Course::where('course_id', $courseId)
            ->whereExists(function ($query) use ($userId) {
                $query->from('user_courses')
                    ->where('user_id', $userId)
                    ->whereColumn('course_id', 'courses.course_id');
            })
            ->exists();
    }

    private function tryMarkComplete($progress, $userId, $courseId)
    {
        try {
            DB::beginTransaction();
            $progress->refresh();

            if ($this->checkContentCompletion($userId, $progress->content_id)) {
                $this->markContentComplete($progress);
                $this->checkCourseCompletion($userId, $courseId);
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error marking content complete: ' . $e->getMessage());
        }
    }

    private function checkContentCompletion($userId, $contentId)
    {
        $progress = Progress::where('user_id', $userId)
            ->where('content_id', $contentId)
            ->first();

        if (!$progress) {
            return false;
        }

        $requiredComponents = 0;
        $completedComponents = 0;

        $hasVideo = TitleContent::where('content_id', $contentId)
            ->whereNotNull('video_link')
            ->exists();
        if ($hasVideo) {
            $requiredComponents++;
            if ($progress->video_completed) {
                $completedComponents++;
            }
        }

        $hasDocument = TitleContent::where('content_id', $contentId)
            ->whereNotNull('document_link')
            ->exists();
        if ($hasDocument) {
            $requiredComponents++;
            if ($progress->document_completed) {
                $completedComponents++;
            }
        }

        $quiz = Quiz::where('content_id', $contentId)->first();
        if ($quiz) {
            $requiredComponents++;
            $hasSession = QuizSession::where('user_id', $userId)
                ->where('quiz_id', $quiz->quiz_id)
                ->exists();
            if ($hasSession) {
                $completedComponents++;
            }
        }

        return $requiredComponents === $completedComponents;
    }

    public function completeVideo(Request $request)
    {
        $userId = auth()->id();
        $contentId = $request->input('content_id');
        $courseId = $request->input('course_id');

        if (!$this->validateCourseAccess($userId, $courseId)) {
            return response()->json([
                'message' => 'Course access denied',
            ], 403);
        }

        $contentVideos = TitleContent::where('content_id', $contentId)
            ->whereNotNull('video_link')
            ->count();

        $progress = Progress::where('user_id', $userId)
            ->where('content_id', $contentId)
            ->first();

        if (!$progress) {
            $progress = Progress::create([
                'user_id' => $userId,
                'course_id' => $courseId,
                'content_id' => $contentId,
                'video_completed' => 0,
                'progress_percent' => $this->calculateProgressPercent($userId, $courseId),
                'complete_update' => Carbon::now()
            ]);
        }

        if ($contentVideos > 0) {
            $progress->update([
                'video_completed' => 1,
                'progress_percent' => $this->calculateProgressPercent($userId, $courseId),
                'complete_update' => Carbon::now()
            ]);
        }

        $this->tryMarkComplete($progress, $userId, $courseId);

        return response()->json([
            'message' => 'Video completion updated',
            'progress_percent' => $this->getProgressPercent($userId, $courseId)
        ]);
    }

    public function completeDocument(Request $request)
    {
        $userId = auth()->id();
        $contentId = $request->input('content_id');
        $courseId = $request->input('course_id');

        if (!$this->validateCourseAccess($userId, $courseId)) {
            return response()->json([
                'message' => 'Course access denied',
            ], 403);
        }

        $hasDocument = TitleContent::where('content_id', $contentId)
            ->whereNotNull('document_link')
            ->exists();

        if (!$hasDocument) {
            return response()->json([
                'message' => 'No document content found',
                'progress_percent' => $this->getProgressPercent($userId, $courseId)
            ], 400);
        }

        $progress = Progress::where('user_id', $userId)
            ->where('content_id', $contentId)
            ->first();

        if (!$progress) {
            $progress = Progress::create([
                'user_id' => $userId,
                'course_id' => $courseId,
                'content_id' => $contentId,
                'document_completed' => true,
                'progress_percent' => $this->calculateProgressPercent($userId, $courseId),
                'complete_update' => Carbon::now()
            ]);
        } else {
            $progress->update([
                'document_completed' => true,
                'progress_percent' => $this->calculateProgressPercent($userId, $courseId),
                'complete_update' => Carbon::now()
            ]);
        }

        $this->tryMarkComplete($progress, $userId, $courseId);

        return response()->json([
            'message' => 'Document completion updated',
            'progress_percent' => $this->getProgressPercent($userId, $courseId)
        ]);
    }

    private function markContentComplete($progress)
    {
        $userId = $progress->user_id;
        $courseId = $progress->course_id;

        $progress->update([
            'is_complete' => 1,
            'complete_at' => Carbon::now(),
        ]);

        $this->calculateProgressPercent($userId, $courseId);

        $this->checkCourseCompletion($userId, $courseId);
    }

    public function completeContent(Request $request)
    {
        $userId = auth()->id();
        $contentId = $request->input('content_id');
        $courseId = $request->input('course_id');

        if (!$this->validateCourseAccess($userId, $courseId)) {
            return response()->json([
                'message' => 'Course access denied',
            ], 403);
        }

        $hasVideo = TitleContent::where('content_id', $contentId)
            ->whereNotNull('video_link')
            ->exists();

        $hasDocument = TitleContent::where('content_id', $contentId)
            ->whereNotNull('document_link')
            ->exists();

        $progress = Progress::where('user_id', $userId)
            ->where('content_id', $contentId)
            ->first();

        if ($hasVideo && (!$progress || !$progress->video_completed)) {
            return response()->json([
                'message' => 'Video not completed',
                'progress_percent' => $this->getProgressPercent($userId, $courseId)
            ]);
        }

        if ($hasDocument && (!$progress || !$progress->document_completed)) {
            return response()->json([
                'message' => 'Document not completed',
                'progress_percent' => $this->getProgressPercent($userId, $courseId)
            ]);
        }

        $quiz = Quiz::where('content_id', $contentId)->first();
        if ($quiz) {
            $hasQuizSession = QuizSession::where('user_id', $userId)
                ->where('quiz_id', $quiz->quiz_id)
                ->exists();

            if (!$hasQuizSession) {
                return response()->json([
                    'message' => 'Quiz not completed',
                    'progress_percent' => $this->getProgressPercent($userId, $courseId)
                ]);
            }

            if (!$progress) {
                $progress = Progress::create([
                    'user_id' => $userId,
                    'course_id' => $courseId,
                    'content_id' => $contentId,
                    'video_completed' => $hasVideo ? true : false,
                    'document_completed' => $hasDocument ? true : false,
                    'is_complete' => true,
                    'progress_percent' => $this->calculateProgressPercent($userId, $courseId),
                    'complete_at' => Carbon::now(),
                    'complete_update' => Carbon::now()
                ]);
            } else {
                $progress->update([
                    'is_complete' => true,
                    'progress_percent' => $this->calculateProgressPercent($userId, $courseId),
                    'complete_at' => Carbon::now(),
                    'complete_update' => Carbon::now()
                ]);
            }
        } else {
            if (!$progress) {
                $progress = Progress::create([
                    'user_id' => $userId,
                    'course_id' => $courseId,
                    'content_id' => $contentId,
                    'video_completed' => $hasVideo ? true : false,
                    'document_completed' => $hasDocument ? true : false,
                    'is_complete' => true,
                    'progress_percent' => $this->calculateProgressPercent($userId, $courseId),
                    'complete_at' => Carbon::now(),
                    'complete_update' => Carbon::now()
                ]);
            } else {
                $progress->update([
                    'is_complete' => true,
                    'progress_percent' => $this->calculateProgressPercent($userId, $courseId),
                    'complete_at' => Carbon::now(),
                    'complete_update' => Carbon::now()
                ]);
            }
        }

        $this->checkCourseCompletion($userId, $courseId);

        return response()->json([
            'message' => 'Progress updated successfully',
            'progress_percent' => $this->getProgressPercent($userId, $courseId)
        ]);
    }

    private function calculateProgressPercent($userId, $courseId)
    {
        try {
            DB::beginTransaction();

            $totalContents = Content::where('course_id', $courseId)->count();

            if ($totalContents === 0) {
                DB::commit();
                return 0;
            }

            $courseContents = Content::where('course_id', $courseId)
                ->select('content_id', 'is_online_meeting')
                ->get();

            $progressRecords = Progress::where('user_id', $userId)
                ->where('course_id', $courseId)
                ->where('is_complete', 1)
                ->get();

            $completedContents = 0;
            foreach ($courseContents as $content) {
                $progress = $progressRecords->firstWhere('content_id', $content->content_id);
                if ($progress && $progress->is_complete) {
                    $completedContents++;
                }
            }

            $progressPercent = ($completedContents / $totalContents) * 100;
            $progressPercent = round($progressPercent, 2);

            Progress::where('user_id', $userId)
                ->where('course_id', $courseId)
                ->update([
                    'progress_percent' => $progressPercent
                ]);

            DB::commit();
            return $progressPercent;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error calculating progress: ' . $e->getMessage());
            throw $e;
        }
    }


    private function getProgressPercent($userId, $courseId)
    {
        $latestProgress = Progress::where('user_id', $userId)
            ->where('course_id', $courseId)
            ->orderBy('complete_update', 'desc')
            ->value('progress_percent');

        if ($latestProgress === null) {
            return $this->calculateProgressPercent($userId, $courseId);
        }

        return $latestProgress;
    }

    private function checkCourseCompletion($userId, $courseId)
    {
        try {
            DB::beginTransaction();

            $progressPercent = $this->getProgressPercent($userId, $courseId);

            Log::info('Checking course completion', [
                'user_id' => $userId,
                'course_id' => $courseId,
                'progress_percent' => $progressPercent
            ]);

            if ($progressPercent >= 100) {
                Log::info('Progress is 100%, checking certificate');

                $existingCertificate = Certificate::where([
                    'user_id' => $userId,
                    'course_id' => $courseId
                ])->first();

                if (!$existingCertificate) {
                    Log::info('No certificate found, creating new one');

                    $certificate = Certificate::create([
                        'user_id' => $userId,
                        'course_id' => $courseId,
                        'issue_at' => Carbon::now()
                    ]);

                    Log::info('Certificate created', ['certificate_id' => $certificate->id]);

                    $user = User::find($userId);
                    $course = Course::find($courseId);

                    if (!$user || !$course) {
                        Log::error('User or Course not found', [
                            'user' => $user ? 'found' : 'not found',
                            'course' => $course ? 'found' : 'not found'
                        ]);
                        DB::rollBack();
                        return;
                    }

                    try {
                        Mail::to($user->email)->send(new CourseCompletedMail($user, $course));
                        Log::info('Course completion email sent', [
                            'user_email' => $user->email,
                            'course_name' => $course->name
                        ]);
                    } catch (\Exception $e) {
                        Log::error('Error sending email', [
                            'error' => $e->getMessage(),
                            'user_id' => $userId,
                            'course_id' => $courseId
                        ]);
                    }
                } else {
                    Log::info('Certificate already exists', [
                        'certificate_id' => $existingCertificate->id
                    ]);
                }
            } else {
                Log::info('Progress not 100% yet', ['progress' => $progressPercent]);
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error in checkCourseCompletion', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'user_id' => $userId,
                'course_id' => $courseId
            ]);
        }
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
            ->latest()
            ->first();

        return response()->json([
            'quiz_completed' => $quizSession ? true : false,
            'has_quiz' => true,
            'quiz_id' => $quiz->quiz_id,
            'session_id' => $quizSession ? $quizSession->quiz_session_id : null
        ]);
    }
}
