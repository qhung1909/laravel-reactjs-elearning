<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\CategoryController;
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





Route::middleware(['admin'])->group(function () {
// Courses
    Route::get('courses', [CourseController::class, 'index']);
    Route::get('course/{course_id}', [CourseController::class, 'show']);
    Route::post('course', [CourseController::class, 'store']);
    Route::put('course/{course_id}', [CourseController::class, 'update']);
    Route::delete('course/{course_id}', [CourseController::class, 'delete']);
// Categories
    Route::get('/category', [CategoryController::class, 'index']); 
    Route::get('/category/{slug}', [CategoryController::class, 'show']); 
    Route::post('/category', [CategoryController::class, 'store']);
    Route::put('/category/{slug}', [CategoryController::class, 'update']);
    Route::delete('/category/{slug}', [CategoryController::class, 'delete']);
});
