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

class AdminController extends Controller
{
    protected $course;


    public function __construct(Course $course)
    {
        $this->course = $course;
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
}
