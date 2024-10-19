<?php

namespace App\Http\Controllers;

use App\Models\Enroll;
use App\Models\UserCourse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class EnrollController extends Controller
{
    public function enroll(Request $request)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $validator = Validator::make($request->all(), [
            'course_id' => 'required|exists:courses,course_id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $userCourse = UserCourse::where('user_id', Auth::id())
            ->where('course_id', $request->course_id)
            ->first();


        if (!$userCourse) {
            return response()->json(['message' => 'Bạn phải mua khóa học trước.'], 409);
        }

        $existingEnroll = Enroll::where('user_id', Auth::id())
            ->where('course_id', $request->course_id)
            ->first();

        if ($existingEnroll) {
            return response()->json(['message' => 'You are already enrolled in this course.'], 409);
        }

        $enroll = Enroll::create([
            'user_id' => Auth::id(),
            'course_id' => $request->course_id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json($enroll, 201);
    }


    public function checkEnrollment(Request $request)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $validator = Validator::make($request->all(), [
            'course_id' => 'required|exists:courses,course_id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $isEnrolled = Enroll::where('user_id', Auth::id())
            ->where('course_id', $request->course_id)
            ->exists();

        return response()->json(['enrolled' => $isEnrolled], 200);
    }

    public function index(Request $request)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $perPage = $request->input('per_page', 10);

        $query = Enroll::where('user_id', Auth::id());

        if ($request->filled('course_id')) {
            $query->where('course_id', $request->course_id);
        }

        if ($request->filled('start_date')) {
            $query->where('created_at', '>=', $request->start_date);
        }

        if ($request->filled('end_date')) {
            $query->where('created_at', '<=', $request->end_date);
        }

        $enrolls = $query->paginate($perPage);

        return response()->json($enrolls, 200);
    }


    public function show($id)
    {
        $enroll = Enroll::find($id);
        if (!$enroll) {
            return response()->json(['message' => 'Enroll not found'], 404);
        }
        return response()->json($enroll, 200);
    }

    public function destroy($id)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $enroll = Enroll::find($id);
        if (!$enroll) {
            return response()->json(['message' => 'Enroll not found'], 404);
        }

        $enroll->delete();
        return response()->json(['message' => 'Enroll deleted successfully'], 200);
    }
}
