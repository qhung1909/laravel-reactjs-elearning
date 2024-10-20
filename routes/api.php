<?php

use App\Models\QuizAnsw;
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
use App\Http\Controllers\EnrollController;
use App\Http\Controllers\LessonController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\CategoryController;
use Symfony\Component\Mime\MessageConverter;
use App\Http\Controllers\QuizOptionController;
use App\Http\Controllers\UserCourseController;
use App\Http\Controllers\QuizQuestionController;

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
    Route::post('/enroll', [EnrollController::class, 'enroll']);
    Route::get('/enrollment/check', [EnrollController::class, 'checkEnrollment']);
    Route::put('user/profile', [UserController::class, 'updateProfile']);
    Route::post('/user/updatePassword', [UserController::class, 'updatePassword']);
    Route::get('orders/history', [UserController::class, 'getOrderHistory']);
    Route::get('/orders/searchHistory', [UserController::class, 'searchOrderHistory']);
});

//Register
Route::get('/courses/{slug}/related', [CourseController::class, 'relatedCourses']);
Route::get('/courses/search', [CourseController::class, 'search']);
Route::post('register', [UserController::class, 'register']);
Route::get('/verify-email/{token}', [UserController::class, 'verifyEmail'])->name('verify.email');
//Payment VNPay
Route::post('/vnpay-payment', [CartController::class, 'vnpay_payment']);
Route::get('/vnpay-callback', [CartController::class, 'vnpay_callback']);
//Coupons check
Route::post('/check-discount', [CouponController::class, 'checkDiscount']);

//Reset Password
Route::post('reset-password', [UserController::class, 'sendResetLink']);
Route::post('reset-password/{token}', [UserController::class, 'resetPassword']);

Route::middleware(['admin'])->group(function () {

    // Courses
    Route::get('/instructors/top', [CourseController::class, 'topInstructorsWithCourses']);
    Route::get('courses', [CourseController::class, 'index'])->name('courses.index');
    Route::get('/top-purchased-courses', [CourseController::class, 'topPurchasedCourses']);
    Route::get('/top-viewed-courses', [CourseController::class, 'topViewedCourses']);
    Route::get('course/{slug}', [CourseController::class, 'show'])->name('courses.show');
    Route::post('course', [CourseController::class, 'store'])->name('courses.store');
    Route::put('course/{slug}', [CourseController::class, 'update'])->name('courses.update');
    Route::delete('course/{slug}', [CourseController::class, 'delete'])->name('courses.delete');
    Route::get('courses/featured', [CourseController::class, 'featureCouse']);
    Route::get('/userCourses/{userId}', [UserCourseController::class, 'show']);
    Route::get('/courses/related/{categoryId}/{slug}', [CourseController::class, 'relatedCoursesByCategory']);

    //Comment
    Route::get('/comments/{course_id}', [CommentController::class, 'index']);
    Route::post('/courses/{slug}/comments', [CommentController::class, 'store'])->middleware(CheckAuthMessage::class);
    Route::put('/comments/{commentId}', [CommentController::class, 'update'])->middleware(CheckAuthMessage::class);
    Route::delete('/comments/{commentId}', [CommentController::class, 'destroy'])->middleware(CheckAuthMessage::class);

    //Categories
    Route::prefix('categories')->group(function () {
        Route::get('/', [CategoryController::class, 'index']);
        Route::get('{slug}', [CategoryController::class, 'show']);
        Route::post('/', [CategoryController::class, 'store']);
        Route::put('{slug}', [CategoryController::class, 'update']);
        Route::delete('{slug}', [CategoryController::class, 'delete']);
    });
    //Lessons
    Route::get('/lessons', [LessonController::class, 'index']);
    Route::get('/lessons/{slug}', [LessonController::class, 'show']);
    Route::post('/lessons', [LessonController::class, 'store']);
    Route::put('/lessons/{slug}', [LessonController::class, 'update']);
    Route::delete('/lessons/{slug}', [LessonController::class, 'delete']);
    //Coupons
    Route::apiResource('coupons', CouponController::class);
    //Quiz
    Route::get('quizzes', [QuizController::class, 'index']);
    Route::post('quizzes', [QuizController::class, 'store']);
    Route::get('quizzes/{id}', [QuizController::class, 'show']);
    Route::put('quizzes/{id}', [QuizController::class, 'update']);
    Route::delete('quizzes/{id}', [QuizController::class, 'destroy']);



    Route::get('/quizzes/{quizId}/questions', [QuizQuestionController::class, 'index']);
    Route::post('/quizzes/{quizId}/questions', [QuizQuestionController::class, 'store']);
    Route::get('/quizzes/{quizId}/questions/{id}', [QuizQuestionController::class, 'show']);
    Route::put('/quizzes/{quizId}/questions/{id}', [QuizQuestionController::class, 'update']);
    Route::delete('/quizzes/{quizId}/questions/{id}', [QuizQuestionController::class, 'destroy']);

    Route::get('quiz-questions/export', [QuizQuestionController::class, 'exportQuizQuestions']);

    
    Route::post('/quizzes/start/{quizId}', [QuizOptionController::class, 'startQuiz']);
    Route::post('/quizzes/submit', [QuizOptionController::class, 'submitAnswers']);
    Route::post('/quizzes/continue', [QuizOptionController::class, 'continueQuiz']);
    
    
    Route::get('questions/{questionId}/options', [QuizOptionController::class, 'index']);
    Route::post('questions/{questionId}/options', [QuizOptionController::class, 'store']);
    Route::put('questions/{questionId}/options/{id}', [QuizOptionController::class, 'update']);
    Route::delete('questions/{questionId}/options/{id}', [QuizOptionController::class, 'destroy']);

    Route::get('/users', [UserController::class, 'getAllUsers']);
    
});


