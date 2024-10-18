<?php

namespace App\Http\Controllers;

use App\Models\UserCourse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserCourseController extends Controller
{
    public function show($userCourseId)
    {
        $userCourse = UserCourse::find($userCourseId);
    
        if (!$userCourse || $userCourse->user_id !== Auth::id()) {
            return response()->json(['message' => 'No information about this purchased course found.'], 404);
        }
    
        return response()->json($userCourse); 
    }
    
}
