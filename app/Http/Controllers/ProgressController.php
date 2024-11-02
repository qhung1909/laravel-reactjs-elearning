<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Progress;
use App\Models\Content;
use Carbon\Carbon;
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

        return response()->json([
            'message' => 'Tiến trình đã được cập nhật.',
            'progress_percent' => $progressPercent
        ]);
    }
}
