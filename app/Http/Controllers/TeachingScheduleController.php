<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use App\Models\OnlineMeeting;
use App\Models\TeachingSchedule;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Carbon\Carbon;

class TeachingScheduleController extends Controller
{
    public function index()
    {
        if (!Auth::check()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized access. Please log in.',
                'data' => null
            ], 401);
        }

        $schedules = TeachingSchedule::all();
        return response()->json([
            'status' => 'success',
            'message' => 'Teaching schedules retrieved successfully',
            'data' => $schedules
        ], 200);
    }

    public function store(Request $request)
    {
        if (!Auth::check()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized access. Please log in.',
                'data' => null
            ], 401);
        }

        try {
            $validated = $request->validate([
                'meeting_id' => 'required|integer|exists:online_meetings,meeting_id',
                'user_id' => 'required|integer|exists:users,user_id',
                'proposed_start' => 'required|date',
                'notes' => 'nullable|string|max:500',
            ]);

            // Additional checks for meeting and user
            $meeting = OnlineMeeting::findOrFail($validated['meeting_id']);
            $user = User::findOrFail($validated['user_id']);

            // Check if a schedule already exists for this meeting
            $existingSchedule = TeachingSchedule::where('meeting_id', $validated['meeting_id'])->first();
            if ($existingSchedule) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'A teaching schedule for this meeting already exists.',
                    'data' => null
                ], 409);
            }

            // Validate proposed_start is within meeting time range
            $proposedStart = \Carbon\Carbon::parse($validated['proposed_start']);
            $meetingStartTime = \Carbon\Carbon::parse($meeting->start_time);
            $meetingEndTime = \Carbon\Carbon::parse($meeting->end_time);

            if (!$proposedStart->between($meetingStartTime, $meetingEndTime)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Proposed start time must be within the meeting time range.',
                    'data' => null
                ], 422);
            }

            $schedule = TeachingSchedule::create([
                'meeting_id' => $validated['meeting_id'],
                'user_id' => $validated['user_id'],
                'proposed_start' => $validated['proposed_start'],
                'notes' => $validated['notes'] ?? null,
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Teaching schedule created successfully',
                'data' => $schedule
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create teaching schedule: ' . $e->getMessage(),
                'data' => null
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        if (!Auth::check()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized access. Please log in.',
                'data' => null
            ], 401);
        }

        try {
            $schedule = TeachingSchedule::findOrFail($id);

            $validated = $request->validate([
                'meeting_id' => 'sometimes|integer|exists:online_meetings,meeting_id',
                'user_id' => 'sometimes|integer|exists:users,id',
                'proposed_start' => 'sometimes|date',
                'notes' => 'nullable|string|max:500',
            ]);

            // If meeting_id is being changed, check its existence and uniqueness
            if (isset($validated['meeting_id'])) {
                $existingSchedule = TeachingSchedule::where('meeting_id', $validated['meeting_id'])
                    ->where('id', '!=', $id)
                    ->first();

                if ($existingSchedule) {
                    return response()->json([
                        'status' => 'error',
                        'message' => 'A teaching schedule for this meeting already exists.',
                        'data' => null
                    ], 409);
                }

                // Validate meeting time range if meeting_id or proposed_start is updated
                $meeting = OnlineMeeting::findOrFail($validated['meeting_id']);
                $proposedStart = \Carbon\Carbon::parse($validated['proposed_start'] ?? $schedule->proposed_start);
                $meetingStartTime = \Carbon\Carbon::parse($meeting->start_time);
                $meetingEndTime = \Carbon\Carbon::parse($meeting->end_time);

                if (!$proposedStart->between($meetingStartTime, $meetingEndTime)) {
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Proposed start time must be within the meeting time range.',
                        'data' => null
                    ], 422);
                }
            }

            $schedule->update($validated);

            return response()->json([
                'status' => 'success',
                'message' => 'Teaching schedule updated successfully',
                'data' => $schedule
            ], 200);
        } catch (ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update teaching schedule: ' . $e->getMessage(),
                'data' => null
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

    public function destroy($id)
    {
        if (!Auth::check()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized access. Please log in.',
                'data' => null
            ], 401);
        }

        $schedule = TeachingSchedule::find($id);

        if (!$schedule) {
            return response()->json([
                'status' => 'error',
                'message' => 'Teaching schedule not found',
                'data' => null
            ], 404);
        }

        try {
            $schedule->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Teaching schedule deleted successfully',
                'data' => null
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete teaching schedule',
                'data' => null
            ], 500);
        }
    }
}
