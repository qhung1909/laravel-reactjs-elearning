<?php

namespace App\Http\Controllers;

use App\Models\Participant;
use Illuminate\Http\Request;
use App\Models\OnlineMeeting;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

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
                'participant_id' => 'required|integer',
                'name' => 'required|string|max:255',
                'joined_at' => 'required|date',
                'meeting_url' => 'required|string',
                'left_at' => 'nullable|date',
            ]);
    
            Log::info('Participant request data:', $request->all());
    
            $meeting = OnlineMeeting::where('meeting_url', $request->meeting_url)->first();
    
            if (!$meeting) {
                return response()->json(['error' => 'Meeting not found.'], 404);
            }
    
            $existingParticipant = Participant::where('meeting_id', $meeting->meeting_id)
                ->where('user_id', $request->participant_id)
                ->first();
    
            if ($existingParticipant) {
                if ($existingParticipant && !$existingParticipant->left_at) {
                    $leftAt = Carbon::parse($request->left_at)->format('Y-m-d H:i:s');
                    $existingParticipant->update([
                        'left_at' => $leftAt,
                    ]);
                    return response()->json(['message' => 'Participant left updated successfully.'], 200);
                }
                
            }
    
            $joinedAt = Carbon::parse($request->joined_at)->format('Y-m-d H:i:s');
            $leftAt = $request->left_at ? Carbon::parse($request->left_at)->format('Y-m-d H:i:s') : null;
    
            $participant = Participant::create([
                'meeting_id' => $meeting->meeting_id,
                'user_id' => $request->participant_id,
                'name' => $request->name,
                'joined_at' => $joinedAt,
                'left_at' => $leftAt,
            ]);
    
            return response()->json([
                'participant' => $participant,
                'meeting_id' => $meeting->meeting_id,
            ], 201);
        } catch (\Exception $e) {
            Log::error('Error saving participant:', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Unable to save participant.'], 500);
        }
    }
    
}
