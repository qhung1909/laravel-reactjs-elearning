<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use App\Models\Course;

class AdminController extends Controller
{
    protected $course;


    public function __construct(Course $course)
    {
        $this->course = $course;
    }

    public function getAllCourses()
    {
        $courses = Cache::remember('courses', 120, function () {
            return $this->course->where('status', 'published')
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
}
