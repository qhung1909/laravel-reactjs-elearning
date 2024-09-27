<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\CategoryController;
use App\Http\Middleware\CheckAuthMessage;
use App\Http\Middleware\AdminMiddleware;
use Symfony\Component\Mime\MessageConverter;

// Authentication
Route::group([
    'middleware' => 'api',
    'prefix' => 'auth'
], function ($router) {
    Route::post('login', [AuthController::class, 'login'])->name('login');
    Route::post('logout', [AuthController::class, 'logout']);
    Route::post('refresh', [AuthController::class, 'refresh']);
    Route::get('me', [AuthController::class, 'me']);
    Route::post('send-message', [MessageController::class, 'sendMessage'])->middleware(CheckAuthMessage::class);
});

Route::post('register', [UserController::class, 'register']);

Route::middleware(['admin'])->group(function () {
    // Courses
    Route::get('courses', [CourseController::class, 'index']);
    Route::get('course/{slug}', [CourseController::class, 'show']);
    Route::post('course', [CourseController::class, 'store']);
    Route::put('course/{slug}', [CourseController::class, 'update']);
    Route::delete('course/{slug}', [CourseController::class, 'delete']);    
    // Categories
    Route::get('course/category', [CategoryController::class, 'index']);
    Route::get('course/category/{slug}', [CategoryController::class, 'show']);
    Route::post('course/category', [CategoryController::class, 'store']);
    Route::put('course/category/{slug}', [CategoryController::class, 'update']);
    Route::delete('course/category/{slug}', [CategoryController::class, 'delete']);
});