<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use App\Models\Course;
use Illuminate\Support\Facades\DB;
use App\Models\Enroll;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Aws\S3\S3Client;
use App\Models\Category;
use App\Models\Coupon;

class AdminController extends Controller
{
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

        $courses = Cache::remember($cacheKey, 120, function () {
            return $this->course
                ->with(['user:user_id,name', 'comments:course_id,rating'])
                ->get();
        });

        return response()->json($courses);
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
            'course_category_id' => 'required|integer|exists:course_categories,course_category_id',
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
}
