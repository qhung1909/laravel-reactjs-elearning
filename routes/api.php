<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\CourseController;
// Authentication
Route::group([
    'middleware' => 'api',
    'prefix' => 'auth'
], function ($router) {
    Route::post('login', [AuthController::class, 'login']);
    Route::post('logout', [AuthController::class, 'logout']);
    Route::post('refresh', [AuthController::class, 'refresh']);
    Route::get('me', [AuthController::class,'me']);
});

Route::post('register', [UserController::class, 'register']);

// Courses
Route::get('courses', [CourseController::class, 'index']);
Route::get('course/{course_id}', [CourseController::class, 'show']);
Route::post('course', [CourseController::class, 'store']);
Route::put('course/{course_id}', [CourseController::class, 'update']);
Route::delete('course/{course_id}', [CourseController::class, 'delete']);