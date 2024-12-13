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

        // Tính toán progress percent mới
        $progressPercent = $this->calculateProgressPercent($userId, $courseId);

        $progress->update([
            'is_complete' => 1,
            'complete_at' => Carbon::now(),
            'progress_percent' => $progressPercent
        ]);
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
        // Đếm tổng số content không phải online meeting
        $totalContents = Content::where('course_id', $courseId)
            ->where('is_online_meeting', 0)
            ->count();

        if ($totalContents === 0) {
            return 0;
        }

        // Đếm số content đã hoàn thành không phải online meeting
        $completedContents = Progress::where('user_id', $userId)
            ->where('course_id', $courseId)
            ->where('is_complete', 1)
            ->whereExists(function ($query) {
                $query->from('contents')
                    ->whereColumn('contents.content_id', 'progress.content_id')
                    ->where('contents.is_online_meeting', 0);
            })
            ->count();

        // Tính progress của regular content
        $regularProgress = ($completedContents / $totalContents) * 100;

        // Kiểm tra online meetings
        $hasOnlineMeetings = Content::where('course_id', $courseId)
            ->where('is_online_meeting', 1)
            ->exists();

        // Nếu có online meetings và chưa hoàn thành hết
        // thì không cho phép progress đạt 100%
        if ($hasOnlineMeetings) {
            $totalOnlineMeetings = Content::where('course_id', $courseId)
                ->where('is_online_meeting', 1)
                ->count();

            $completedOnlineMeetings = Progress::where('user_id', $userId)
                ->where('course_id', $courseId)
                ->where('is_complete', 1)
                ->whereExists(function ($query) {
                    $query->from('contents')
                        ->whereColumn('contents.content_id', 'progress.content_id')
                        ->where('contents.is_online_meeting', 1);
                })
                ->count();

            // Nếu chưa hoàn thành hết online meetings
            // thì giới hạn progress tối đa là 99%
            if ($totalOnlineMeetings !== $completedOnlineMeetings) {
                return min($regularProgress, 99);
            }
        }

        return $regularProgress;
    }

    private function getProgressPercent($userId, $courseId)
    {
        // Lấy progress mới nhất từ DB
        $latestProgress = Progress::where('user_id', $userId)
            ->where('course_id', $courseId)
            ->orderBy('complete_update', 'desc')
            ->value('progress_percent');

        if ($latestProgress === null) {
            // Nếu chưa có progress nào, tính toán mới
            return $this->calculateProgressPercent($userId, $courseId);
        }

        return $latestProgress;
    }

    private function checkCourseCompletion($userId, $courseId)
    {
        // Lấy progress tổng từ DB
        $progressPercent = $this->getProgressPercent($userId, $courseId);

        // Chỉ cấp certificate và gửi mail khi progress = 100%
        if ($progressPercent >= 100) {
            $existingCertificate = Certificate::where([
                'user_id' => $userId,
                'course_id' => $courseId
            ])->first();

            if (!$existingCertificate) {
                DB::transaction(function () use ($userId, $courseId) {
                    Certificate::create([
                        'user_id' => $userId,
                        'course_id' => $courseId,
                        'issue_at' => Carbon::now()
                    ]);

                    $user = User::find($userId);
                    $course = Course::where('course_id', $courseId)->first();

                    try {
                        Mail::to($user->email)->send(new CourseCompletedMail($user, $course));
                    } catch (\Exception $e) {
                        Log::error('Error sending course completion email: ' . $e->getMessage());
                    }
                });
            }
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
