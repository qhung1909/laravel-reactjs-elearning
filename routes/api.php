<?php

use App\Models\QuizAnsw;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
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
use App\Http\Controllers\BlogController;
use App\Http\Controllers\ContentController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\TitleContentController;
use App\Http\Controllers\AdminController;
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
    Route::get('/enrolls/{id}', [EnrollController::class, 'show']);
    Route::get('/enrolls', [EnrollController::class, 'index']);
    Route::get('/enrollment/check', [EnrollController::class, 'checkEnrollment']);
    Route::post('user/profile', [UserController::class, 'updateProf']);
    Route::post('/user/updatePassword', [UserController::class, 'updatePassword']);
    Route::get('orders/history', [UserController::class, 'getOrderHistory']);
    Route::get('/orders/searchHistory', [UserController::class, 'searchOrderHistory']);
});
Route::post('/s3-buckets', [UserController::class, 'upload']);


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
    Route::get('/courses', [CourseController::class, 'index'])->name('courses.index');
    Route::get('/top-purchased-courses', [CourseController::class, 'topPurchasedCourses']);
    Route::get('/top-viewed-courses', [CourseController::class, 'topViewedCourses']);
    Route::get('course/{slug}', [CourseController::class, 'show'])->name('courses.show');
    Route::post('course', [CourseController::class, 'store'])->name('courses.store');
    Route::put('course/{slug}', [CourseController::class, 'update'])->name('courses.update');
    Route::delete('course/{slug}', [CourseController::class, 'delete'])->name('courses.delete');
    Route::get('courses/featured', [CourseController::class, 'featureCouse']);
    Route::get('/userCourses/{userId}', [UserCourseController::class, 'show']);
    Route::get('/courses/related/{categoryId}/{slug}', [CourseController::class, 'relatedCoursesByCategory']);
    Route::get('/courses/user/{userId}', [CourseController::class, 'coursesByUserId']);

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
    Route::get('/quiz/score', [QuizOptionController::class, 'getScore']);

    Route::get('questions/{questionId}/options', [QuizOptionController::class, 'index']);
    Route::post('questions/{questionId}/options', [QuizOptionController::class, 'store']);
    Route::put('questions/{questionId}/options/{id}', [QuizOptionController::class, 'update']);
    Route::delete('questions/{questionId}/options/{id}', [QuizOptionController::class, 'destroy']);

    Route::get('/users', [UserController::class, 'getAllUsers']);

    Route::get('blogs', [BlogController::class, 'index']);
    Route::post('blogs', [BlogController::class, 'store']);
    Route::get('blogs/{slug}', [BlogController::class, 'show']);
    Route::put('blogs/{slug}', [BlogController::class, 'update']);
    Route::delete('blogs/{slug}', [BlogController::class, 'destroy']);



    Route::post('/contents', [ContentController::class, 'store']);
    Route::put('/contents/{content_id}', [ContentController::class, 'update']);
    Route::delete('/contents/{content_id}', [ContentController::class, 'destroy']);
    Route::get('/contents', [ContentController::class, 'index']);
    Route::get('/contents/{lesson_id}', [ContentController::class, 'show']);
    Route::get('/title-contents', [TitleContentController::class, 'index']); // Lấy danh sách title_contents
    Route::get('/title-contents/{content_id}', [TitleContentController::class, 'show']); // Xem chi tiết title_content
    // Route để lấy danh sách tất cả các đơn hàng
    Route::get('/orders', [OrderController::class, 'index']);

    // Route để lấy tất cả đơn hàng của một user cụ thể
    Route::get('/orders/user/{user_id}', [OrderController::class, 'getAllOrdersByUserId']);

    // Route để lấy chi tiết một đơn hàng dựa vào user_id và order_id
    Route::get('/orders/{user_id}/{order_id}', [OrderController::class, 'show']);



    Route::post('/title-contents', [TitleContentController::class, 'store']); // Tạo mới title_content
    Route::put('/title-contents/{title_content_id}', [TitleContentController::class, 'update']); // Cập nhật title_content
    Route::delete('/title-contents/{title_content_id}', [TitleContentController::class, 'destroy']); // Xóa title_content

});


Route::prefix('admin')->middleware('admin')->group(function () {
    //Dashboard
    Route::get('/courses', [AdminController::class, 'getAllCourses']);
    Route::get('/courses/{slug}', [AdminController::class, 'showCourses']);
    Route::get('/summary', [AdminController::class, 'getSummary']);
    Route::get('/revenue-chart', [AdminController::class, 'getMonthlyRevenue']);

    //Quản lí courses
    Route::get('/stats', [AdminController::class, 'statsCourses']);
    Route::patch('/courses/{course_id}/status', [AdminController::class, 'patchCourseStatus']);
    //Quản lí Category
    Route::get('/categories/{categoryId}/courses/count', [AdminController::class, 'countCoursesInCategory']);
    Route::post('/categories/{course_category_id}', [AdminController::class, 'updateCategoryImage']);
    //Quản lí Coupons
    Route::get('/coupons', [AdminController::class, 'allCoupons']);
    Route::get('/coupons/{coupon_id}', [AdminController::class, 'detailCoupon']);
    Route::post('/coupons', [AdminController::class, 'storeCoupon']);
    Route::put('/coupons/{coupon_id}', [AdminController::class, 'updateCoupon']);
    Route::delete('/coupons/{coupon_id}', [AdminController::class, 'destroyCoupon']);
});
