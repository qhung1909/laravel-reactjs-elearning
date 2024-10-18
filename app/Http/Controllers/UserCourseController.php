<?php

namespace App\Http\Controllers;

use App\Models\UserCourse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserCourseController extends Controller
{
    public function show($userId)
    {
        $userCourses = UserCourse::with('course')->where('user_id', $userId)->get();

        if ($userCourses->isEmpty()) {
            return response()->json(['message' => 'Không tìm thấy thông tin về khóa học đã mua.'], 404);
        }
    
        return response()->json($userCourses);
    }
    
}
