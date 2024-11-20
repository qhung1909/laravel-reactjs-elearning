<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\Quiz;
use App\Models\User;
use Aws\S3\S3Client;
use App\Models\Coupon;
use App\Models\Course;
use App\Models\Enroll;
use App\Models\Content;
use App\Models\Category;
use App\Models\OrderDetail;
use Illuminate\Support\Str;
use App\Models\TitleContent;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Cache;
use App\Mail\CourseStatusNotification;
use Illuminate\Support\Facades\Validator;

class AdminController extends Controller
{
    const ADMIN_SHARE = 10;
    const TEACHER_SHARE = 90;

    protected $course;
    protected $category;

    public function __construct(Course $course, Category $category)
    {
        $this->course = $course;
        $this->category = $category;
    }



    public function getAllCourses()
    {
        $cacheKey = 'admin_courses_all';

        $courses = Cache::remember($cacheKey, 1, function () {
            return $this->course
                ->with(['user:user_id,name', 'comments:course_id,rating'])
                ->whereIn('status', ['published', 'hide'])
                ->get();
        });

        return $courses;
    }

    public function getPendingCourses()
    {
        $cacheKey = 'admin_courses_all_2';

        $courses = Cache::remember($cacheKey, 1, function () {
            return $this->course
                ->with(['user:user_id,name', 'comments:course_id,rating'])
                ->whereIn('status', ['pending'])
                ->get();
        });

        return $courses;
    }

    public function getPendingCourseDetail($courseId)
    {
        $cacheKey = 'admin_pending_course_detail_' . $courseId;

        $courseDetail = Cache::remember($cacheKey, 1, function () use ($courseId) {
            return $this->course
                ->with(['user:user_id,name', 'comments:course_id,rating'])
                ->where('course_id', $courseId)
                ->where('status', 'pending')
                ->first();
        });

        return $courseDetail;
    }


    public function showCourses($slug)
    {
        $course = Cache::remember("admin_course_{$slug}", 120, function () use ($slug) {
            return $this->course->where('slug', $slug)
                ->with([
                    'user:user_id,name',
                    'comments:course_id,rating',
                    'category:id,name,slug',
                    'lessons'
                ])
                ->first();
        });

        if (!$course) {
            return response()->json([
                'message' => 'Không tìm thấy khóa học',
                'status' => 404
            ], 404);
        }

        return response()->json([
            'status' => 200,
            'message' => 'Lấy thông tin khóa học thành công',
            'data' => $course
        ]);
    }

    public function updateCourseCategory(Request $request, $courseId)
    {
        $request->validate([
            'course_category_id' => 'required|integer|exists:courses,course_category_id',
        ]);

        $course = $this->course->find($courseId);

        if (!$course) {
            return response()->json(['message' => 'Course not found'], 404);
        }

        $course->course_category_id = $request->course_category_id;
        $course->save();

        Cache::forget('admin_courses_all');

        return response()->json(['message' => 'Course category updated successfully', 'course' => $course]);
    }


    public function getSummary()
    {
        $totalRevenue = DB::table('orders')
            ->where('status', 'success')
            ->sum('total_price');

        $totalCoursesSold = DB::table('user_courses')
            ->count('course_id');

        $totalLessons = DB::table('lessons')
            ->count();

        return response()->json([
            'total_revenue' => $totalRevenue,
            'total_courses_sold' => $totalCoursesSold,
            'total_lessons' => $totalLessons,
        ]);
    }

    public function getMonthlyRevenue()
    {
        $monthlyRevenue = [];

        for ($month = 1; $month <= 12; $month++) {
            $revenue = DB::table('orders')
                ->where('status', 'success')
                ->whereYear('created_at', 2024)
                ->whereMonth('created_at', $month)
                ->sum('total_price');

            $monthlyRevenue[$month] = $revenue;
        }

        return response()->json($monthlyRevenue);
    }

    public function statsCourses(): JsonResponse
    {
        $totalCourses = Course::count();

        $totalEnrolls = Enroll::count();

        $ongoingCourses = Course::where('status', 'published')->count();

        return response()->json([
            'total_courses' => $totalCourses,
            'total_enrolls' => $totalEnrolls,
            'ongoing_courses' => $ongoingCourses,
        ]);
    }

    public function countCoursesInCategory($categoryId): JsonResponse
    {
        $courseCount = $this->course->where('course_category_id', $categoryId)->count();

        return response()->json([
            'status' => 200,
            'category_id' => $categoryId,
            'course_count' => $courseCount,
        ]);
    }

    public function patchCourseStatus(Request $request, $course_id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:published,unpublished,draft,pending'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors(),
            ], 422);
        }

        $course = $this->course->find($course_id);

        if (!$course) {
            return response()->json([
                'status' => 404,
                'message' => 'Không tìm thấy khóa học',
            ], 404);
        }

        $course->status = $request->status;
        $course->save();

        return response()->json([
            'status' => 200,
            'message' => 'Cập nhật trạng thái khóa học thành công',
            'data' => $course,
        ]);
    }

    private function handleImageUpload($file)
    {
        $s3 = new S3Client([
            'region'  => env('AWS_DEFAULT_REGION'),
            'version' => 'latest',
            'credentials' => [
                'key'    => env('AWS_ACCESS_KEY_ID'),
                'secret' => env('AWS_SECRET_ACCESS_KEY'),
            ],
            'http' => [
                'verify' => env('VERIFY_URL')
            ]
        ]);

        $filePath = $file->getRealPath();
        $originalFileName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $extension = $file->getClientOriginalExtension();
        $newFileName = uniqid() . ".{$originalFileName}.{$extension}";
        $key = 'icons/new_folder/' . $newFileName;

        $contentType = match ($extension) {
            'jpg', 'jpeg' => 'image/jpeg',
            'png' => 'image/png',
            'gif' => 'image/gif',
            'svg' => 'image/svg+xml',
            default => 'application/octet-stream',
        };

        try {
            $result = $s3->putObject([
                'Bucket' => env('AWS_BUCKET'),
                'Key'    => $key,
                'SourceFile' => $filePath,
                'ContentType' => $contentType,
                'ACL' => 'public-read',
            ]);
            return $result['ObjectURL'];
        } catch (\Exception $e) {
            throw new \Exception('Could not upload new image to S3: ' . $e->getMessage());
        }
    }

    public function updateCategoryImage(Request $request, $course_category_id)
    {
        $rules = [
            'name' => 'nullable|string',
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
        ];

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            Log::error('Validation failed:', $validator->errors()->toArray());
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $category = Category::where('course_category_id', $course_category_id)->firstOrFail();
            Log::info('Original category data:', $category->toArray());

            $changes = [];

            if ($request->filled('name')) {
                Log::info('Processing name update:', [
                    'current' => $category->name,
                    'new' => $request->name
                ]);

                if ($request->name !== $category->name) {
                    $oldName = $category->name;
                    $category->name = $request->name;

                    $baseSlug = Str::slug($request->name);
                    $newSlug = $baseSlug;
                    $counter = 1;

                    while (Category::where('slug', $newSlug)
                        ->where('course_category_id', '!=', $category->course_category_id)
                        ->exists()
                    ) {
                        $newSlug = $baseSlug . '-' . $counter;
                        $counter++;
                    }

                    $category->slug = $newSlug;
                    $changes['name'] = ['old' => $oldName, 'new' => $request->name];
                    $changes['slug'] = ['old' => $category->getOriginal('slug'), 'new' => $newSlug];
                }
            }

            if ($request->filled('description')) {
                Log::info('Processing description update:', [
                    'current' => $category->description,
                    'new' => $request->description
                ]);

                if ($request->description !== $category->description) {
                    $changes['description'] = [
                        'old' => $category->description,
                        'new' => $request->description
                    ];
                    $category->description = $request->description;
                }
            }

            if ($request->hasFile('image')) {
                Log::info('Processing image upload');
                try {
                    $imageUrl = $this->handleImageUpload($request->file('image'));
                    $changes['image'] = [
                        'old' => $category->image,
                        'new' => $imageUrl
                    ];
                    $category->image = $imageUrl;
                } catch (\Exception $e) {
                    Log::error('Image upload failed:', ['error' => $e->getMessage()]);
                    throw $e;
                }
            }

            if (!empty($changes)) {
                Log::info('Changes detected:', $changes);
                $category->updated_at = now();
                $category->save();
                Log::info('Category saved with changes');
            } else {
                Log::info('No changes detected');
            }

            $category->refresh();
            Log::info('Final category data:', $category->toArray());

            return response()->json([
                'success' => true,
                'message' => !empty($changes)
                    ? 'Danh mục được cập nhật thành công.'
                    : 'Không có thay đổi nào được thực hiện.',
                'category' => $category
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error updating category:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'error' => 'Có lỗi xảy ra khi cập nhật danh mục: ' . $e->getMessage()
            ], 500);
        }
    }

    public function allCoupons()
    {
        $coupons = Coupon::all();

        return response()->json($coupons);
    }

    public function detailCoupon($coupon_id)
    {
        $coupon = Coupon::findOrFail($coupon_id);

        return response()->json($coupon);
    }

    public function storeCoupon(Request $request)
    {
        $request->validate([
            'name_coupon' => 'required|string|max:255',
            'discount_price' => 'required|numeric|min:0',
            'start_discount' => 'required|date',
            'end_discount' => 'required|date|after:start_discount',
        ]);

        $coupon = Coupon::create([
            'name_coupon' => $request->name_coupon,
            'discount_price' => $request->discount_price,
            'start_discount' => $request->start_discount,
            'end_discount' => $request->end_discount,
        ]);

        return response()->json($coupon, 201);
    }

    public function updateCoupon(Request $request, $coupon_id)
    {
        $coupon = Coupon::findOrFail($coupon_id);

        $request->validate([
            'name_coupon' => 'sometimes|required|string|max:255',
            'discount_price' => 'sometimes|required|numeric|min:0',
            'start_discount' => 'sometimes|required|date',
            'end_discount' => 'sometimes|required|date|after:start_discount',
        ]);

        $coupon->update($request->only([
            'name_coupon',
            'discount_price',
            'start_discount',
            'end_discount',
        ]));

        return response()->json($coupon);
    }

    public function destroyCoupon($coupon_id)
    {
        $coupon = Coupon::findOrFail($coupon_id);
        $coupon->delete();

        return response()->json(['message' => 'Coupon deleted successfully']);
    }

    public function showCoursesTeacher($courseId)
    {
        try {
            $course = Course::where('course_id', $courseId)
                ->where('user_id', Auth::id())
                ->first();

            if (!$course) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy khóa học hoặc bạn không có quyền truy cập'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $course
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi: ' . $e->getMessage()
            ], 500);
        }
    }

    public function updateCoursesTeacher(Request $request, $courseId)
    {
        try {
            $validator = Validator::make($request->all(), [
                'title' => 'sometimes|required|string|max:255',
                'course_category_id' => 'sometimes|required|exists:categories,course_category_id',
                'price' => 'sometimes|required|numeric|min:0',
                'description' => 'sometimes|required|string',
                'img' => 'sometimes|nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
                'launch_date' => 'sometimes|required|date',           // Thêm validate launch_date
                'backup_launch_date' => 'sometimes|nullable|date'     // Thêm validate backup_launch_date
            ]);
    
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => $validator->errors()
                ], 422);
            }
    
            $course = Course::find($courseId);
    
            if (!$course) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy khóa học'
                ], 404);
            }
    
            $updateData = $request->only([
                'title',
                'course_category_id',
                'price',
                'price_discount',
                'description',
                'status',
                'launch_date',            
                'backup_launch_date'         
            ]);
    
            if (isset($updateData['launch_date'])) {
                $updateData['launch_date'] = Carbon::parse($updateData['launch_date'])->format('Y-m-d H:i:s');
            }
    
            if (isset($updateData['backup_launch_date'])) {
                $updateData['backup_launch_date'] = Carbon::parse($updateData['backup_launch_date'])->format('Y-m-d H:i:s');
            }
    
            if ($request->hasFile('img')) {
                try {
                    $s3 = new S3Client([
                        'region'  => env('AWS_DEFAULT_REGION'),
                        'version' => 'latest',
                        'credentials' => [
                            'key'    => env('AWS_ACCESS_KEY_ID'),
                            'secret' => env('AWS_SECRET_ACCESS_KEY'),
                        ],
                        'http' => [
                            'verify' => env('VERIFY_URL'),
                        ],
                    ]);
    
                    if ($course->img) {
                        try {
                            $oldKey = str_replace(env('AWS_URL'), '', $course->img);
                            $s3->deleteObject([
                                'Bucket' => env('AWS_BUCKET'),
                                'Key'    => $oldKey,
                            ]);
                        } catch (\Exception $e) {
                            Log::error('Error deleting old image: ' . $e->getMessage());
                        }
                    }
    
                    $file = $request->file('img');
                    $filePath = $file->getRealPath();
                    $originalFileName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
                    $extension = $file->getClientOriginalExtension();
                    $newFileName = "course_{$courseId}_{$originalFileName}." . $extension;
                    $key = 'images/courses/' . $newFileName;
    
                    $contentType = match ($extension) {
                        'jpg', 'jpeg' => 'image/jpeg',
                        'png' => 'image/png',
                        'gif' => 'image/gif',
                        'webp' => 'image/webp',
                        'svg' => 'image/svg+xml',
                        default => 'image/jpeg',
                    };
    
                    $result = $s3->putObject([
                        'Bucket' => env('AWS_BUCKET'),
                        'Key'    => $key,
                        'SourceFile' => $filePath,
                        'ContentType' => $contentType,
                        'ACL' => 'public-read',
                    ]);
    
                    $updateData['img'] = $result['ObjectURL'];
    
                } catch (\Exception $e) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Lỗi khi upload ảnh: ' . $e->getMessage()
                    ], 500);
                }
            }
    
            if (isset($updateData['title'])) {
                $updateData['slug'] = Str::slug($updateData['title']);
            }
    
            $course->update($updateData);
    
            return response()->json([
                'success' => true,
                'message' => 'Cập nhật khóa học thành công',
                'data' => $course
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getPendingContents()
    {
        try {
            $contents = Content::where('status', 'pending')->get();

            return response()->json([
                'success' => true,
                'contents' => $contents
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching pending contents',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getPendingTitleContents(Request $request)
    {
        try {
            $content_id = $request->input('content_id');

            $titleContents = TitleContent::where('status', 'pending')
                ->where('content_id', $content_id)
                ->get();

            return response()->json([
                'success' => true,
                'titleContents' => $titleContents
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching pending title contents',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getPendingQuizzes(Request $request)
    {
        try {
            $content_id = $request->input('content_id');

            $quizzes = Quiz::with(['questions.options'])
                ->where('status', 'pending')
                ->where('content_id', $content_id)
                ->get();

            return response()->json([
                'success' => true,
                'quizzes' => $quizzes
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching pending quizzes',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function approveAll(Request $request) 
    { 
        try { 
            DB::beginTransaction(); 
    
            $courseId = $request->course_id; 
    
            $course = Course::findOrFail($courseId); 
            $instructor = User::where('user_id', $course->user_id)
                             ->where('role', 'teacher')
                             ->firstOrFail();
                             
            $course->update(['status' => 'published']); 
    
            $contents = Content::where('course_id', $courseId)->get(); 
            foreach ($contents as $content) { 
                $content->update(['status' => 'published']); 
    
                TitleContent::where('content_id', $content->content_id) 
                    ->update(['status' => 'published']); 
            } 
    
            Quiz::where('course_id', $courseId) 
                ->update(['status' => 'published']); 
    
            Mail::to($instructor->email)
                ->queue(new CourseStatusNotification($course, null, 'approved'));
    
            DB::commit(); 
    
            return response()->json([ 
                'success' => true, 
                'message' => 'Đã duyệt, xuất bản tất cả nội dung và gửi thông báo cho giảng viên' 
            ]); 
        } catch (\Exception $e) { 
            DB::rollback(); 
            return response()->json([ 
                'success' => false, 
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage() 
            ], 500); 
        } 
    }

    public function rejectAll(Request $request)
    {
        try {
            DB::beginTransaction();

            $courseId = $request->course_id;
            $reason = $request->reason;

            $course = Course::find($courseId);
            if (!$course) {
                return response()->json([
                    'success' => false,
                    'message' => 'Khóa học không tồn tại'
                ], 404);
            }

            $instructor = User::where('user_id', $course->user_id)->where('role', 'teacher')->first();
            if (!$instructor) {
                return response()->json([
                    'success' => false,
                    'message' => 'Giảng viên không tồn tại hoặc không có vai trò hợp lệ'
                ], 404);
            }

            $course->update([
                'status' => 'failed',
                'reject_reason' => $reason
            ]);

            $contents = Content::where('course_id', $courseId)->get();
            foreach ($contents as $content) {
                $content->update([
                    'status' => 'failed',
                    'reject_reason' => $reason
                ]);

                TitleContent::where('content_id', $content->content_id)
                    ->update([
                        'status' => 'failed',
                        'reject_reason' => $reason
                    ]);
            }

            Quiz::where('course_id', $courseId)
                ->update([
                    'status' => 'failed',
                    'reject_reason' => $reason
                ]);

            Mail::to($instructor->email)
                ->queue(new CourseStatusNotification($course, $reason, 'rejected'));

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Đã từ chối và gửi thông báo cho giảng viên'
            ]);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage()
            ], 500);
        }
    }

    public function requestRevision(Request $request)
    {
        try {
            DB::beginTransaction();

            $courseId = $request->course_id;
            $reason = $request->reason;

            $course = Course::find($courseId);
            if (!$course) {
                return response()->json([
                    'success' => false,
                    'message' => 'Khóa học không tồn tại'
                ], 404);
            }

            $instructor = User::where('user_id', $course->user_id)->where('role', 'teacher')->first();
            if (!$instructor) {
                return response()->json([
                    'success' => false,
                    'message' => 'Giảng viên không tồn tại hoặc không có vai trò hợp lệ'
                ], 404);
            }

            $course->update([
                'status' => 'revision_requested',
                'revision_reason' => $reason
            ]);

            $contents = Content::where('course_id', $courseId)->get();
            foreach ($contents as $content) {
                $content->update([
                    'status' => 'revision_requested',
                    'revision_reason' => $reason
                ]);

                TitleContent::where('content_id', $content->content_id)
                    ->update([
                        'status' => 'revision_requested',
                        'revision_reason' => $reason
                    ]);
            }

            Quiz::where('course_id', $courseId)
                ->update([
                    'status' => 'revision_requested',
                    'revision_reason' => $reason
                ]);

            Mail::to($instructor->email)
                ->queue(new CourseStatusNotification($course, $reason, 'revision'));

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Đã yêu cầu chỉnh sửa và gửi thông báo cho giảng viên'
            ]);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage()
            ], 500);
        }
    }



    public function getAdminOverview(Request $request)
    {
        try {
            $startDate = $request->input('start_date');
            $endDate = $request->input('end_date', now());

            $revenue = OrderDetail::join('orders', 'order_detail.order_id', '=', 'orders.order_id')
                ->join('courses', 'order_detail.course_id', '=', 'courses.course_id')
                ->join('users', 'courses.user_id', '=', 'users.user_id')
                ->where('orders.status', 'success')
                ->where('users.role', 'teacher')
                ->when($startDate, function ($query) use ($startDate, $endDate) {
                    return $query->whereBetween('orders.created_at', [$startDate, $endDate]);
                })
                ->select([
                    DB::raw('SUM(order_detail.price) as total_revenue'),
                    DB::raw('SUM(order_detail.price * ' . self::ADMIN_SHARE . ' / 100) as admin_revenue'),
                    DB::raw('COUNT(DISTINCT orders.order_id) as total_orders'),
                    DB::raw('COUNT(DISTINCT courses.course_id) as total_courses_sold')
                ])
                ->first();

            return response()->json([
                'success' => true,
                'data' => [
                    'total_revenue' => round($revenue->total_revenue, 2),
                    'admin_revenue' => round($revenue->admin_revenue, 2),
                    'total_orders' => $revenue->total_orders,
                    'total_courses_sold' => $revenue->total_courses_sold
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching admin overview',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getTeacherRevenues(Request $request)
    {
        try {
            $startDate = $request->input('start_date');
            $endDate = $request->input('end_date', now());

            $revenues = OrderDetail::join('orders', 'order_detail.order_id', '=', 'orders.order_id')
                ->join('courses', 'order_detail.course_id', '=', 'courses.course_id')
                ->join('users', 'courses.user_id', '=', 'users.user_id')
                ->where('orders.status', 'success')
                ->where('users.role', 'teacher')
                ->when($startDate, function ($query) use ($startDate, $endDate) {
                    return $query->whereBetween('orders.created_at', [$startDate, $endDate]);
                })
                ->select([
                    'users.user_id as teacher_id',
                    'users.name as teacher_name',
                    DB::raw('SUM(order_detail.price) as total_revenue'),
                    DB::raw('SUM(order_detail.price * ' . self::TEACHER_SHARE . ' / 100) as teacher_revenue'),
                    DB::raw('SUM(order_detail.price * ' . self::ADMIN_SHARE . ' / 100) as admin_revenue'),
                    DB::raw('COUNT(DISTINCT orders.order_id) as total_orders'),
                    DB::raw('COUNT(DISTINCT order_detail.course_id) as total_courses')
                ])
                ->groupBy('users.user_id', 'users.name')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $revenues
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching teacher revenues',
                'error' => $e->getMessage()
            ], 500);
        }
    }





    public function getTeacherRevenue(Request $request)
    {
        try {
            $teacherId = auth()->id();
            $startDate = $request->input('start_date');
            $endDate = $request->input('end_date', now());

            if (auth()->user()->role !== 'teacher') {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access'
                ], 403);
            }

            $revenue = OrderDetail::join('orders', 'order_detail.order_id', '=', 'orders.order_id')
                ->join('courses', 'order_detail.course_id', '=', 'courses.course_id')
                ->where('orders.status', 'success')
                ->where('courses.user_id', $teacherId)
                ->when($startDate, function ($query) use ($startDate, $endDate) {
                    return $query->whereBetween('orders.created_at', [$startDate, $endDate]);
                })
                ->select([
                    DB::raw('SUM(order_detail.price) as total_revenue'),
                    DB::raw('SUM(order_detail.price * ' . self::TEACHER_SHARE . ' / 100) as teacher_revenue'),
                    DB::raw('COUNT(DISTINCT orders.order_id) as total_orders'),
                    DB::raw('COUNT(DISTINCT order_detail.course_id) as total_courses')
                ])
                ->first();

            $courseRevenues = OrderDetail::join('orders', 'order_detail.order_id', '=', 'orders.order_id')
                ->join('courses', 'order_detail.course_id', '=', 'courses.course_id')
                ->where('orders.status', 'success')
                ->where('courses.user_id', $teacherId)
                ->when($startDate, function ($query) use ($startDate, $endDate) {
                    return $query->whereBetween('orders.created_at', [$startDate, $endDate]);
                })
                ->select([
                    'courses.course_id as course_id',
                    'courses.title as course_name',
                    DB::raw('SUM(order_detail.price) as course_revenue'),
                    DB::raw('SUM(order_detail.price * ' . self::TEACHER_SHARE . ' / 100) as teacher_share'),
                    DB::raw('COUNT(*) as sales_count')
                ])
                ->groupBy('courses.course_id', 'courses.title')
                ->get();

            return response()->json([
                'success' => true,
                'data' => [
                    'summary' => $revenue,
                    'courses' => $courseRevenues
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching teacher revenue',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function updateRole(Request $request, $userId)
    {
        try {
            $request->validate([
                'role' => ['required', Rule::in(['user', 'teacher', 'admin'])]
            ]);

            $user = User::find($userId);
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not found'
                ], 404);
            }

            $user->role = $request->role;
            $user->save();

            return response()->json([
                'success' => true,
                'message' => 'User role updated successfully',
                'data' => [
                    'user_id' => $user->user_id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update user role',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    private function handleImageUploadImage($file, $titleContent)
    {
        $s3 = new S3Client([
            'region'  => env('AWS_DEFAULT_REGION'),
            'version' => 'latest',
            'credentials' => [
                'key'    => env('AWS_ACCESS_KEY_ID'),
                'secret' => env('AWS_SECRET_ACCESS_KEY'),
            ],
            'http' => [
                'verify' => env('VERIFY_URL'),
            ],
        ]);

        if ($titleContent->image_link) {
            try {
                $oldKey = str_replace(env('AWS_URL'), '', $titleContent->image_link);
                $s3->deleteObject([
                    'Bucket' => env('AWS_BUCKET'),
                    'Key'    => $oldKey,
                ]);
            } catch (\Exception $e) {
                Log::error('Error deleting old image: ' . $e->getMessage());
            }
        }

        $filePath = $file->getRealPath();
        $contentId = $titleContent->content_id;
        $titleContentId = $titleContent->title_content_id;
        $originalFileName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $extension = $file->getClientOriginalExtension();
        $newFileName = "content_{$contentId}_title_{$titleContentId}_{$originalFileName}.{$extension}";
        $key = 'images/' . $newFileName;

        $contentType = match ($extension) {
            'jpg', 'jpeg' => 'image/jpeg',
            'png' => 'image/png',
            'gif' => 'image/gif',
            'webp' => 'image/webp',
            'svg' => 'image/svg+xml',
            default => 'image/jpeg',
        };

        try {
            $result = $s3->putObject([
                'Bucket' => env('AWS_BUCKET'),
                'Key'    => $key,
                'SourceFile' => $filePath,
                'ContentType' => $contentType,
                'ACL' => 'public-read',
            ]);

            return $result['ObjectURL'];
        } catch (\Exception $e) {
            throw new \Exception('Không thể upload ảnh lên S3: ' . $e->getMessage());
        }
    }
}
