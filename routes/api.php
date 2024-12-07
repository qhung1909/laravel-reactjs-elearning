<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\QuizController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\OrderController;
use App\Http\Middleware\CheckAuthMessage;
use App\Http\Controllers\CouponController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\EnrollController;
use App\Http\Controllers\LessonController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\ContentController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\ProgressController;
use App\Http\Controllers\QuizOptionController;
use App\Http\Controllers\UserCourseController;
use App\Http\Controllers\CertificateController;
use App\Http\Controllers\ParticipantController;
use App\Http\Controllers\QuizQuestionController;
use App\Http\Controllers\TitleContentController;
use App\Http\Controllers\OnlineMeetingController;
use App\Http\Controllers\TeachingScheduleController;

// Authentication
Route::group([
    'middleware' => 'api',
    'prefix' => 'auth'
], function ($router) {
    Route::post('login', [AuthController::class, 'login'])->name('login');
    Route::any('/google/url', [AuthController::class, 'redirectToAuth']);
    Route::any('/google/callback', [AuthController::class, 'handleGoogleCallback']);
    Route::post('logout', [AuthController::class, 'logout']);
    Route::post('refresh', [AuthController::class, 'refresh']);
    Route::get('me', [AuthController::class, 'me']);
    Route::post('/send-message', [MessageController::class, 'sendMessage'])->middleware(CheckAuthMessage::class);
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
    Route::post('/notifications/read/{notification_id}', [MessageController::class, 'markAsRead']);
    Route::post('/notifications/read-all', [MessageController::class, 'markAllAsRead']);
    Route::get('/notifications', [MessageController::class, 'getNotifications']);
    Route::get('/notifications/{id}', [MessageController::class, 'getNotificationDetails']);
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
Route::post('/validate-coupon', [CouponController::class, 'validateCoupon']);
Route::post('/reset-price', [CouponController::class, 'resetPrice']);



//Reset Password
Route::post('reset-password', [UserController::class, 'sendResetLink']);
Route::post('reset-password/{token}', [UserController::class, 'resetPassword']);
Route::patch('/update-role', [UserController::class, 'updateRole']);

Route::middleware(['admin'])->group(function () {

    // Courses
    Route::get('/instructors/top', [CourseController::class, 'topInstructorsWithCourses']);
    Route::get('/courses', [CourseController::class, 'index'])->name('courses.index');
    Route::get('/top-purchased-courses', [CourseController::class, 'topPurchasedCourses']);
    Route::get('/top-viewed-courses', [CourseController::class, 'topViewedCourses']);
    Route::get('course/{slug}', [CourseController::class, 'show'])->name('courses.show');
    Route::post('/course', [CourseController::class, 'store'])->name('courses.store');
    Route::put('/course/{slug}', [CourseController::class, 'update'])->name('courses.update');
    Route::delete('/course/{slug}', [CourseController::class, 'delete'])->name('courses.delete');
    Route::get('courses/featured', [CourseController::class, 'featureCouse']);
    Route::get('/userCourses/{userId}', [UserCourseController::class, 'show']);
    Route::get('/courses/related/{categoryId}/{slug}', [CourseController::class, 'relatedCoursesByCategory']);
    Route::get('/courses/user/{userId}', [CourseController::class, 'coursesByUserId']);
    Route::get('/instructor/{instructorId}/students', [CourseController::class, 'getStudentsForInstructor']);

    //Comment
    Route::get('/comments/{course_id}', [CommentController::class, 'index']);
    Route::get('/comment', [CommentController::class, 'showAllComment']);
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
    Route::post('quiz/check-content', [QuizController::class, 'checkContentQuiz']);
    Route::post('quizzes/check-quiz', [QuizController::class, 'checkQuizExists']);



    Route::get('/quizzes/{quizId}/questions', [QuizQuestionController::class, 'index']);
    Route::post('/quizzes/{quizId}/questions', [QuizQuestionController::class, 'store']);
    Route::get('/quizzes/{quizId}/questions/{id}', [QuizQuestionController::class, 'show']);
    Route::put('/quizzes/{quizId}/questions', [QuizQuestionController::class, 'update']);
    Route::delete('/quizzes/{quizId}/questions/{id}', [QuizQuestionController::class, 'destroy']);

    Route::get('quiz-questions/export', [QuizQuestionController::class, 'exportQuizQuestions']);


    Route::post('/quizzes/start/{quizId}', [QuizOptionController::class, 'startQuiz']);
    Route::post('/quizzes/submit', [QuizOptionController::class, 'submitAnswers']);
    Route::get('/quiz/score', [QuizOptionController::class, 'getScore']);

    Route::get('questions/{questionId}/options', [QuizOptionController::class, 'index']);
    Route::post('questions/{questionId}/options', [QuizOptionController::class, 'store']);
    Route::put('questions/{questionId}/options', [QuizOptionController::class, 'update']);
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
    Route::get('/contents/{course_id}', [ContentController::class, 'show']);
    Route::get('/title-contents', [TitleContentController::class, 'index']); // Lấy danh sách title_contents
    Route::get('/title-contents/{content_id}', [TitleContentController::class, 'show']); // Xem chi tiết title_content
    // Route để lấy danh sách tất cả các đơn hàng
    Route::get('/orders', [OrderController::class, 'index']);

    // Route để lấy tất cả đơn hàng của một user cụ thể
    Route::get('/orders/user/{user_id}', [OrderController::class, 'getAllOrdersByUserId']);

    // Route để lấy chi tiết một đơn hàng dựa vào user_id và order_id
    Route::get('/orders/{user_id}/{order_id}', [OrderController::class, 'show']);

    //
    Route::post('/favorites', [FavoriteController::class, 'addToFavorites']);
    Route::get('/favorites', [FavoriteController::class, 'getFavorites']);
    Route::delete('/favorites', [FavoriteController::class, 'removeFromFavorites']);

    Route::post('/title-contents', [TitleContentController::class, 'store']); // Tạo mới title_content
    Route::put('/title-contents/{title_content_id}', [TitleContentController::class, 'update']); // Cập nhật title_content
    Route::delete('/title-contents/{title_content_id}', [TitleContentController::class, 'destroy']); // Xóa title_content

    //Progress
    Route::get('/progress', [ProgressController::class, 'index']);
    Route::post('/progress/complete-content', [ProgressController::class, 'completeContent']);
    Route::get('/progress/check-completion', [QuizController::class, 'checkQuizCompletion']);

    Route::get('/certificate/details/{certificateId}', [CertificateController::class, 'getCertificateDetails']);
    Route::get('/certificates', [CertificateController::class, 'index']);

    Route::get('/meetings/{meetingId}/participants', [ParticipantController::class, 'getParticipantsByMeeting']);
    Route::get('/attendance/history', [ParticipantController::class, 'getUserAttendanceHistory']);


});

Route::prefix('admin')->middleware('admin')->group(function () {
    Route::get('/users', [UserController::class, 'getUsers']);
    Route::get('/teachers', [UserController::class, 'getTeacher']);

    //Dashboard
    Route::get('/courses', [AdminController::class, 'getAllCourses']);
    Route::put('/courses/{courseId}/category', [AdminController::class, 'updateCourseCategory']);

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

    Route::get('/pending-contents', [AdminController::class, 'getPendingContents']);
    Route::get('/pending-title-contents', [AdminController::class, 'getPendingTitleContents']);
    Route::get('/pending-quizzes', [AdminController::class, 'getPendingQuizzes']);
    Route::get('/pending-courses', [AdminController::class, 'getPendingCourses']);
    Route::get('/pending-courses/{id}', [AdminController::class, 'getPendingCourses']);

    Route::post('/approve', [AdminController::class, 'approveAll'])->name('admin.courses.approve');
    Route::post('/reject', [AdminController::class, 'rejectAll'])->name('admin.courses.reject');
    Route::post('/revision', [AdminController::class, 'requestRevision'])->name('admin.courses.revision');

    Route::get('/overview', [AdminController::class, 'getAdminOverview']);

    Route::get('/revenue/teachers', [AdminController::class, 'getTeacherRevenues']);
    Route::put('/user/{userId}/role', [AdminController::class, 'updateRole']);

    Route::get('/settings', [SettingController::class, 'index']);
    Route::post('/settings', [SettingController::class, 'update']); 
    
    Route::put('/courses/{courseId}/toggle-status', [AdminController::class, 'toggleCourseStatus']);

});


Route::prefix('teacher')->middleware('admin')->group(function () {
    Route::get('/courses/{courseId}', [AdminController::class, 'showCoursesTeacher']);
    Route::post('/courses/{courseId}', [AdminController::class, 'updateCoursesTeacher']);

    Route::get('/course', [TeacherController::class, 'getCoursesByTeacher']);
    Route::get('/content/{courseId}', [TeacherController::class, 'showContent']);
    Route::post('/content/', [TeacherController::class, 'storeContent']);
    Route::put('/courses/{courseId}/contents', [TeacherController::class, 'updateContents']);
    Route::delete('/courses/{courseId}/contents', [TeacherController::class, 'deleteContents']);
    Route::delete('/contents/{content_id}', [ContentController::class, 'destroyContentId']);

    Route::get('/title-content/{contentId}', [TeacherController::class, 'showTitleContent']);

    Route::post('/title-content', [TeacherController::class, 'storeTitleContent']);
    //
    Route::post('/title-content/update/{contentId}', [TeacherController::class, 'updateTitleContent']);

    Route::delete('/title-content/delete/{titleContentId}', [TeacherController::class, 'deleteTitleContent']);

    Route::post('/update-pending/{course_id}', [TeacherController::class, 'updateToPending']);

    Route::get('/revenue', [AdminController::class, 'getTeacherRevenue']);
    Route::get('/rank', [TeacherController::class, 'getSalesRank']);
    Route::put('/courses/{courseId}/toggle-status', [TeacherController::class, 'toggleCourseStatus']);

    Route::get('/courses/completion-stats', [TeacherController::class, 'getCompletedCoursesStats']);

    Route::get('/{teacherId}/courses/completion-stats', [TeacherController::class, 'getTeacherCompletionStats']);

    Route::get('/{teacherId}/orders', [TeacherController::class, 'getTeacherOrderHistory']);

    Route::get('/course/{courseId}/orders', [TeacherController::class, 'getCourseOrderHistory']);

    Route::get('/teaching-schedule', [TeachingScheduleController::class, 'index']);
    Route::post('/teaching-schedule', [TeachingScheduleController::class, 'store']);
    Route::get('/teaching-schedule/{meeting_id}', [TeachingScheduleController::class, 'show']);
    Route::put('/teaching-schedule/{id}', [TeachingScheduleController::class, 'update']);
    Route::delete('/teaching-schedule/{id}', [TeachingScheduleController::class, 'destroy']);
    Route::get('/teaching/courses/online-teacher', [TeacherController::class, 'getCourseOnlineTeacher']);
    Route::get('/teaching/courses/meeting-online', [TeacherController::class, 'getMeetingOnline']);

    Route::patch('/changedate/courses/{courseId}', [TeacherController::class, 'updateCourseDates']);


});


Route::post('/create-meeting/{content_id}', [OnlineMeetingController::class, 'createMeeting']);
Route::get('/meeting/{uuid}', [OnlineMeetingController::class, 'getMeetingByUuid']);
Route::post('/meetings/attendance', [ParticipantController::class, 'attendance']);
Route::post('/meetings/participants', [ParticipantController::class, 'store']);
Route::get('/meetings/getMeetingId', [ParticipantController::class, 'getMeetingId']);
Route::get('/meetings/checkMeetingAccess', [ParticipantController::class, 'checkMeetingAccess']);
Route::post('/meetings/check-teacher-presence', [ParticipantController::class, 'checkTeacherPresence']);
Route::post('/meetings/get-user-ids-by-meeting-id', [ParticipantController::class, 'getUserIdsByMeetingId']);
Route::post('/meetings/users-courses', [ParticipantController::class, 'getUsersList']);
Route::post('/meetings/check-meeting-access', [ParticipantController::class, 'checkAccess']);
Route::get('/meetings/course', [ParticipantController::class, 'getCourseIdByMeetingUrl']);
Route::post('/meetings/users', [ParticipantController::class, 'getUserIdsByMeetingUrl']);
Route::post('/meetings/mark-attendance ', [ParticipantController::class, 'markAttendance']);
Route::post('/meetings/mark-absent ', [ParticipantController::class, 'markAbsent']);
Route::post('/upcoming-meetings', [TeachingScheduleController::class, 'getUpcomingMeetings']);
Route::get('/meetings/student/upcoming-meeting', [OnlineMeetingController::class, 'getUpcomingMeeting']);
