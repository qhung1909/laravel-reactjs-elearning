<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserCourse;
use App\Models\Participant;
use Illuminate\Http\Request;
use App\Models\OnlineMeeting;
use Illuminate\Support\Carbon;
use Illuminate\Http\JsonResponse;
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
                ->orderBy('created_at', 'desc')
                ->first();

            if ($request->left_at && $existingParticipant && !$existingParticipant->left_at) {
                $existingParticipant->update([
                    'left_at' => Carbon::parse($request->left_at)->format('Y-m-d H:i:s'),
                ]);
                return response()->json(['message' => 'Participant left successfully.'], 200);
            }

            if ($request->joined_at && $existingParticipant && $existingParticipant->left_at) {
                $existingParticipant->update([
                    'joined_at' => Carbon::parse($request->joined_at)->format('Y-m-d H:i:s'),
                    'left_at' => null,
                ]);
                return response()->json(['message' => 'Participant rejoined successfully.'], 200);
            }

            if ($existingParticipant && !$existingParticipant->left_at) {
                return response()->json(['message' => 'Participant already exists.'], 200);
            }

            if ($request->joined_at && !$existingParticipant) {
                $participant = Participant::create([
                    'meeting_id' => $meeting_id,
                    'user_id' => $request->user_id,
                    'is_present' => 0,
                    'joined_at' => Carbon::parse($request->joined_at)->format('Y-m-d H:i:s'),
                    'left_at' => null,
                ]);

                return response()->json([
                    'participant' => $participant,
                    'meeting_id' => $meeting_id,
                ], 201);
            }

            return response()->json(['error' => 'Invalid request.'], 400);
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

            $meeting = OnlineMeeting::where('meeting_url', $meetingUrl)->first();

            if (!$meeting) {
                return response()->json(['error' => 'Meeting does not exist.'], 404);
            }

            $user = Auth::user();
            if (!$user) {
                return response()->json(['error' => 'Unauthorized, user not found.'], 401);
            }

            if ($user->role === 'teacher') {
                return response()->json(['message' => 'Teacher can join the meeting.', 'meeting_id' => $meeting->meeting_id], 200);
            }

            if ($user->role === 'user') {
                return response()->json(['message' => 'User can join the meeting.', 'meeting_id' => $meeting->meeting_id], 200);
            }

            return response()->json(['error' => 'Unauthorized, only teachers or users can join this meeting.'], 403);
        } catch (\Exception $e) {
            Log::error('Error checking meeting access:', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Unable to check meeting access.'], 500);
        }
    }

    public function checkTeacherPresence(Request $request)
    {
        try {
            $request->validate([
                'meeting_url' => 'required|string',
            ]);

            $meeting = OnlineMeeting::where('meeting_url', $request->meeting_url)->first();

            if (!$meeting) {
                return response()->json(['error' => 'Meeting not found'], 404);
            }

            $teacherIds = User::where('role', 'teacher')->pluck('user_id');

            $teacherPresent = Participant::where('meeting_id', $meeting->meeting_id)
                ->whereIn('user_id', $teacherIds)
                ->where(function ($query) {
                    $query->whereNull('left_at')
                        ->orWhere('left_at', '>=', Carbon::now());
                })
                ->exists();

            return response()->json([
                'can_join' => $teacherPresent,
                'message' => $teacherPresent ?
                    'Teacher is present, you can join the meeting.' :
                    'Please wait for teacher to join the meeting.',
                'meeting_id' => $meeting->meeting_id
            ]);
        } catch (\Exception $e) {
            Log::error('Error checking teacher presence:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => 'Unable to check teacher presence'], 500);
        }
    }

    public function getUserIdsByMeetingId(Request $request)
    {
        try {
            $request->validate([
                'meeting_id' => 'required|integer',
            ]);

            $participants = DB::table('meeting_participants')
                ->join('users', 'meeting_participants.user_id', '=', 'users.user_id')
                ->where('meeting_participants.meeting_id', $request->meeting_id)
                ->where('users.role', 'user')
                ->select('users.user_id as id', 'users.name', 'meeting_participants.is_present')
                ->get();

            if ($participants->isEmpty()) {
                return response()->json(['message' => 'No participants found for this meeting.'], 404);
            }

            $participantData = $participants->map(function ($participant) {
                return [
                    'id' => $participant->id,
                    'name' => $participant->name,
                    'is_present' => $participant->is_present
                ];
            });

            return response()->json([
                'meeting_id' => $request->meeting_id,
                'users' => $participantData
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error retrieving user IDs by meeting ID:', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Unable to retrieve user IDs.'], 500);
        }
    }

    public function getUsersList(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'course_id' => 'required|integer'
            ]);

            $courseId = $request->input('course_id');

            $users = UserCourse::select('users.user_id', 'users.name')
                ->join('users', 'user_courses.user_id', '=', 'users.user_id')
                ->where('users.role', '=', 'user')
                ->where('user_courses.course_id', '=', $courseId)
                ->distinct()
                ->get();

            return response()->json([
                'status' => 'success',
                'data' => $users,
                'message' => 'Users list retrieved successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error retrieving users list: ' . $e->getMessage()
            ], 500);
        }
    }


    public function checkAccess(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'user_id' => 'required|integer',
                'course_id' => 'required|integer'
            ]);


            $userRole = User::where('user_id', $request->user_id)->value('role');


            if ($userRole !== 'user') {
                return response()->json([
                    'status' => 'success',
                    'message' => 'Access granted',
                    'has_access' => true
                ], 200);
            }


            $hasAccess = UserCourse::join('users', 'user_courses.user_id', '=', 'users.user_id')
                ->where('user_courses.user_id', $request->user_id)
                ->where('user_courses.course_id', $request->course_id)
                ->where('users.role', '=', 'user')
                ->exists();

            if (!$hasAccess) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'You do not have access to this course',
                    'has_access' => false
                ], 403);
            }


            $meeting = OnlineMeeting::where('course_id', $request->course_id)
                ->first();

            if (!$meeting) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Meeting not found',
                    'has_access' => false
                ], 404);
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Access granted',
                'has_access' => true,
                'data' => [
                    'meeting_url' => $meeting->meeting_url,
                    'start_time' => $meeting->start_time,
                    'end_time' => $meeting->end_time
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error checking access: ' . $e->getMessage(),
                'has_access' => false
            ], 500);
        }
    }



    public function getCourseIdByMeetingUrl(Request $request)
    {
        $meetingUrl = $request->query('meeting_url');

        if (!$meetingUrl) {
            return response()->json(['error' => 'Meeting URL is required'], 400);
        }

        $meeting = OnlineMeeting::where('meeting_url', $meetingUrl)->first();

        if (!$meeting) {
            return response()->json(['error' => 'Meeting not found'], 404);
        }

        return response()->json(['course_id' => $meeting->course_id]);
    }
    public function getUserIdsByMeetingUrl(Request $request)
    {
        $request->validate([
            'meeting_url' => 'required|string',
        ]);

        $meetingUrl = $request->input('meeting_url');

        $meeting = OnlineMeeting::where('meeting_url', $meetingUrl)->first();
        if (!$meeting) {
            return response()->json([
                'status' => 'error',
                'message' => 'Meeting URL không tồn tại',
            ], 404);
        }


        $attendanceData = DB::table('user_courses AS uc')
            ->select(
                'uc.user_id',
                'u.name',
                'mp.is_present',
                'mp.attendance_date'
            )
            ->join('online_meetings AS om', function ($join) use ($meetingUrl) {
                $join->on('uc.course_id', '=', 'om.course_id')
                    ->where('om.meeting_url', '=', $meetingUrl);
            })
            ->join('users AS u', 'uc.user_id', '=', 'u.user_id')
            ->leftJoin('meeting_participants AS mp', function ($join) use ($meeting) {
                $join->on('uc.user_id', '=', 'mp.user_id')
                    ->where('mp.meeting_id', '=', $meeting->meeting_id);
            })
            ->get();

        $data = $attendanceData->map(function ($row) {
            return [
                'user_id' => $row->user_id,
                'name' => $row->name,
                'is_present' => $row->is_present ?? 0,
                'attendance_date' => $row->attendance_date
            ];
        })->toArray();

        return response()->json([
            'status' => 'success',
            'data' => $data
        ]);
    }
    public function markAttendance(Request $request)
    {
        $request->validate([
            'meeting_url' => 'required|string',
            'user_ids' => 'required|array',
        ]);

        $meetingUrl = $request->input('meeting_url');
        $userIds = $request->input('user_ids');

        $meeting = OnlineMeeting::where('meeting_url', $meetingUrl)->first();
        if (!$meeting) {
            Log::warning('Meeting not found', ['meeting_url' => $meetingUrl]);
            return response()->json([
                'status' => 'error',
                'message' => 'Meeting URL không tồn tại',
            ], 404);
        }

        $now = now();
        $participants = [];

        foreach ($userIds as $userId) {

            $participant = Participant::firstOrNew([
                'meeting_id' => $meeting->meeting_id,
                'user_id' => $userId,
            ]);

            $participant->is_present = 1;
            $participant->attendance_date = $now;
            $participant->created_at = $now;
            $participant->updated_at = $now;
            $participant->save();

            $participants[] = $participant;
        }


        return response()->json([
            'status' => 'success',
            'message' => 'Điểm danh thành công',
        ]);
    }

    public function markAbsent(Request $request)
    {
        $request->validate([
            'meeting_url' => 'required|string',
            'user_ids' => 'required|array',
        ]);

        $meetingUrl = $request->input('meeting_url');
        $userIds = $request->input('user_ids');

        $meeting = OnlineMeeting::where('meeting_url', $meetingUrl)->first();
        if (!$meeting) {
            Log::warning('Meeting not found', ['meeting_url' => $meetingUrl]);
            return response()->json([
                'status' => 'error',
                'message' => 'Meeting URL không tồn tại',
            ], 404);
        }

        $now = now();

        foreach ($userIds as $userId) {
            $participant = Participant::firstOrNew([
                'meeting_id' => $meeting->meeting_id,
                'user_id' => $userId,
            ]);

            $participant->is_present = 0;
            $participant->attendance_date = $now;
            $participant->created_at = $now;
            $participant->updated_at = $now;
            $participant->save();
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Đã cập nhật trạng thái vắng mặt',
        ]);
    }

    public function getParticipantsByMeeting(Request $request, $meetingId): JsonResponse
    {
        try {
            $participants = Participant::select(
                'meeting_participants.*',
                'users.name as student_name',
                'users.email'
            )
                ->join('users', 'users.user_id', '=', 'meeting_participants.user_id')
                ->where('meeting_id', $meetingId)
                ->get()
                ->map(function ($participant) {
                    return [
                        'participant_id' => $participant->participant_id,
                        'student_name' => $participant->student_name,
                        'email' => $participant->email,
                        'attendance_status' => $this->checkAttendanceStatus($participant),
                        'attendance_date' => $participant->attendance_date,
                        'joined_at' => $participant->joined_at,
                        'left_at' => $participant->left_at
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $participants
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving participants: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Check attendance status based on date and time records
     * 
     * @param Participant $participant
     * @return string
     */
    private function checkAttendanceStatus($participant): string
    {
        if ($participant->attendance_date) {
            if ($participant->joined_at) {
                return "Có mặt";
            }
            if (!$participant->joined_at && !$participant->left_at) {
                return "Vắng mặt";
            }
        }
        return "Chưa điểm danh";
    }
}
