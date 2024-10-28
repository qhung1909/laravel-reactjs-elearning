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

    public function updateCategoryImage(Request $request, $course_id)
    {
        $rules = [
            'name' => 'sometimes|required|string',
            'description' => 'sometimes|nullable|string',
            'image' => 'sometimes|nullable|image|max:2048',
        ];
    
        $validator = Validator::make($request->all(), $rules);
    
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
    
        try {
            $category = DB::transaction(function () use ($request, $course_id) {
                $category = $this->category->where('course_id', $course_id)->firstOrFail();
    
                if ($request->has('name') && $request->name !== $category->name) {
                    $baseSlug = Str::slug($request->name);
                    $newSlug = $baseSlug;
                    $counter = 1;
    
                    while (Category::where('slug', $newSlug)
                        ->where('id', '!=', $category->id)
                        ->exists()
                    ) {
                        $newSlug = $baseSlug . '-' . $counter;
                        $counter++;
                    }
    
                    $category->slug = $newSlug;
                }
    
                $category->name = $request->input('name', $category->name);
                $category->description = $request->input('description', $category->description);
    
                if ($request->hasFile('image')) {
                    $imageUrl = $this->handleImageUpload($request->file('image'));
                    $category->image_url = $imageUrl; 
                }
    
                $category->save();
    
                return $category;
            });
    
            Cache::forget('categories');
            Cache::forget("category_{$category->slug}"); 
    
            return response()->json([
                'success' => true,
                'message' => 'Danh mục được cập nhật thành công.',
                'category' => $category
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error updating category: ' . $e->getMessage());
            return response()->json([
                'error' => 'Có lỗi xảy ra khi cập nhật danh mục'
            ], 500);
        }
    }
}
