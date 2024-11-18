<?php

namespace App\Http\Controllers;

use App\Models\Participant;
use Illuminate\Http\Request;
use App\Models\OnlineMeeting;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class ParticipantController extends Controller
{
    public function attendance(Request $request)
    {
        try {
            $request->validate([
                'meeting_url' => 'required|string',
                'participants' => 'required|array',
                'participants.*.participant_id' => 'required|integer',
                'participants.*.is_present' => 'required|boolean',
            ]);

            $meeting = OnlineMeeting::where('meeting_url', $request->meeting_url)->first();

            if (!$meeting) {
                return response()->json(['error' => 'Meeting not found.'], 404);
            }

            $user = Auth::user();
            if (!$user || $user->role !== 'teacher') {
                return response()->json(['error' => 'Unauthorized, only teachers can mark attendance.'], 403);
            }

            $participants = [];
            foreach ($request->participants as $participantData) {
                $participant = Participant::where('meeting_id', $meeting->meeting_id)
                    ->where('user_id', $participantData['participant_id'])
                    ->first();

                if ($participant) {
                    $participant->is_present = $participantData['is_present'];
                    $participant->attendance_date = Carbon::now()->toDateString();
                    $participant->save();

                    $participants[] = $participant;
                } else {
                    Log::warning('Participant not found for attendance', [
                        'meeting_id' => $meeting->meeting_id,
                        'participant_id' => $participantData['participant_id'],
                    ]);
                }
            }

            return response()->json([
                'participants' => $participants,
                'meeting_id' => $meeting->meeting_id,
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error during attendance update:', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Unable to update attendance.'], 500);
        }
    }


    public function store(Request $request)
    {
        try {
            $request->validate([
                'meeting_url' => 'required|string',
                'user_id' => 'required|integer',
                'attendance_date' => 'nullable|date',
                'joined_at' => 'nullable|date',
                'left_at' => 'nullable|date',
            ]);


            $meeting = OnlineMeeting::where('meeting_url', $request->meeting_url)->first();

            if (!$meeting) {
                return response()->json(['error' => 'Meeting not found.'], 404);
            }

            $meeting_id = $meeting->meeting_id;

            $existingParticipant = Participant::where('meeting_id', $meeting_id)
                ->where('user_id', $request->user_id)
                ->first();

            if ($existingParticipant) {
                $leftAt = $request->left_at ? Carbon::parse($request->left_at)->format('Y-m-d H:i:s') : null;
                $joinedAt = $request->joined_at ? Carbon::parse($request->joined_at)->format('Y-m-d H:i:s') : null;

                $existingParticipant->update([
                    'joined_at' => $joinedAt,
                    'left_at' => $leftAt,
                ]);

                return response()->json(['message' => 'Participant updated successfully.'], 200);
            }

            $joinedAt = $request->joined_at ? Carbon::parse($request->joined_at)->format('Y-m-d H:i:s') : null;
            $leftAt = $request->left_at ? Carbon::parse($request->left_at)->format('Y-m-d H:i:s') : null;

            $participant = Participant::create([
                'meeting_id' => $meeting_id,
                'user_id' => $request->user_id,
                'is_present' => 0,
                'joined_at' => $joinedAt,
                'left_at' => $leftAt,
            ]);

            return response()->json([
                'participant' => $participant,
                'meeting_id' => $meeting_id,
            ], 201);
        } catch (\Exception $e) {
            Log::error('Error saving participant:', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Unable to save participant.'], 500);
        }
    }

    public function getMeetingId(Request $request)
    {
        $meetingUrl = $request->input('meeting_url');

        if (!$meetingUrl) {
            return response()->json(['error' => 'Meeting URL is required'], 400);
        }

        $meeting = OnlineMeeting::where('meeting_url', $meetingUrl)->first();

        if (!$meeting) {
            return response()->json(['error' => 'Meeting not found'], 404);
        }

        return response()->json(['meeting_id' => $meeting->meeting_id]);
    }

    public function checkMeetingAccess(Request $request)
    {
        try {
            $meetingUrl = $request->input('meeting_url');
            if (!$meetingUrl) {
                return response()->json(['error' => 'Meeting URL is required'], 400);
            }

            // Kiểm tra xem meeting_id đã tồn tại chưa
            $meeting = OnlineMeeting::where('meeting_url', $meetingUrl)->first();

            if (!$meeting) {
                // Nếu meeting không tồn tại, không cho phép tham gia
                return response()->json(['error' => 'Meeting does not exist.'], 404);
            }

            // Nếu meeting đã tồn tại, kiểm tra vai trò của người dùng
            $user = Auth::user();
            if (!$user) {
                return response()->json(['error' => 'Unauthorized, user not found.'], 401);
            }

            // Nếu là teacher, cho phép tham gia
            if ($user->role === 'teacher') {
                return response()->json(['message' => 'Teacher can join the meeting.', 'meeting_id' => $meeting->meeting_id], 200);
            }

            // Nếu là user, cho phép tham gia nếu meeting đã tồn tại
            if ($user->role === 'user') {
                return response()->json(['message' => 'User can join the meeting.', 'meeting_id' => $meeting->meeting_id], 200);
            }

            // Nếu người dùng có vai trò khác
            return response()->json(['error' => 'Unauthorized, only teachers or users can join this meeting.'], 403);
        } catch (\Exception $e) {
            Log::error('Error checking meeting access:', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Unable to check meeting access.'], 500);
        }
    }
}
