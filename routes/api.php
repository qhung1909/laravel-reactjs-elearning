<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\QuizController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\AdminMiddleware;
use App\Http\Middleware\CheckAuthMessage;
use App\Http\Controllers\CouponController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\LessonController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\CategoryController;
use Symfony\Component\Mime\MessageConverter;
use App\Http\Controllers\QuizQuestionController;
use App\Http\Controllers\QuizAnswController;
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
    Route::post('cart/addToCart', [CartController::class, 'addToCart']);
    Route::delete('/cart/remove-item', [CartController::class, 'removeItem']);
    Route::get('/cart', [CartController::class, 'getCart']);

});

Route::post('register', [UserController::class, 'register']);
Route::get('/verify-email/{token}', [UserController::class, 'verifyEmail'])->name('verify.email');

Route::post('/vnpay-payment', [CartController::class, 'vnpay_payment']);
Route::get('/vnpay-callback', [CartController::class, 'vnpay_callback']);

Route::post('/check-discount', [CouponController::class, 'checkDiscount']);

Route::middleware(['admin'])->group(function () {

    // Courses
    Route::get('courses', [CourseController::class, 'index'])->name('courses.index');
    Route::get('/top-purchased-courses', [CourseController::class, 'topPurchasedCourses']);
    Route::get('/top-viewed-courses', [CourseController::class, 'topViewedCourses']);
    Route::get('course/{slug}', [CourseController::class, 'show'])->name('courses.show');
    Route::post('course', [CourseController::class, 'store'])->name('courses.store');
    Route::put('course/{slug}', [CourseController::class, 'update'])->name('courses.update');
    Route::delete('course/{slug}', [CourseController::class, 'delete'])->name('courses.delete');
    Route::get('courses/featured', [CourseController::class, 'featureCouse']);


    Route::get('/comments/{course_id}', [CommentController::class, 'index']);
    Route::post('/courses/{slug}/comments', [CommentController::class, 'store'])->middleware(CheckAuthMessage::class);
    Route::put('/comments/{commentId}', [CommentController::class, 'update'])->middleware(CheckAuthMessage::class);
    Route::delete('/comments/{commentId}', [CommentController::class, 'destroy'])->middleware(CheckAuthMessage::class);


    Route::prefix('categories')->group(function () {
        Route::get('/', [CategoryController::class, 'index']);
        Route::get('{slug}', [CategoryController::class, 'show']);
        Route::post('/', [CategoryController::class, 'store']);
        Route::put('{slug}', [CategoryController::class, 'update']);
        Route::delete('{slug}', [CategoryController::class, 'delete']);
    });

    Route::get('/lessons', [LessonController::class, 'index']);
    Route::get('/lessons/{slug}', [LessonController::class, 'show']);
    Route::post('/lessons', [LessonController::class, 'store']);
    Route::put('/lessons/{slug}', [LessonController::class, 'update']);
    Route::delete('/lessons/{slug}', [LessonController::class, 'delete']);
    Route::apiResource('coupons', CouponController::class);

    Route::apiResource('quizzes', QuizController::class);
    Route::apiResource('quizzes/{quiz}/questions', QuizQuestionController::class);
    Route::apiResource('questions/{question}/answers', QuizAnswController::class);
});


