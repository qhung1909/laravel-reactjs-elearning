<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Validator;

class CourseController extends Controller
{
    protected $course;


    public function __construct(Course $course)
    {
        $this->course = $course;
    }


    public function topInstructorsWithCourses()
    {
        $instructors = User::select(
            'users.*',
            DB::raw('MAX(courses.is_buy) as max_is_buy'),
            DB::raw('AVG(comments.rating) as average_rating')
        )
            ->join('courses', 'users.user_id', '=', 'courses.user_id')
            ->leftJoin('comments', 'courses.course_id', '=', 'comments.course_id') 
            ->where('users.role', 'teacher')
            ->groupBy('users.user_id')
            ->orderBy('max_is_buy', 'desc')
            ->get();


        if ($instructors->isEmpty()) {
            return response()->json(['message' => 'Không tìm thấy giảng viên nổi tiếng nào.'], 404);
        }

        return response()->json($instructors, 200);
    }


    public function search(Request $request)
    {
        $rules = [
            'query' => 'required|string|max:255',
        ];

        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $query = $request->input('query');

        $searchResults = Cache::remember("search_courses_{$query}", 180, function () use ($query) {
            return $this->course->where('title', 'like', "%{$query}%")
                ->orWhere('description', 'like', "%{$query}%")
                ->get();
        });

        if ($searchResults->isEmpty()) {
            return response()->json(['message' => 'Không tìm thấy khóa học nào.'], 404);
        }

        return response()->json($searchResults, 200);
    }

    public function index()
    {
        // Ghi log trước khi truy vấn
        Log::info('Fetching courses from cache or database.');

        $courses = Cache::remember('courses', 120, function () {
            Log::info('Querying courses from database.');
            return $this->course->with(['user:user_id,name', 'comments:course_id,rating'])->get();
        });

        // Ghi log kết quả
        Log::info('Courses fetched successfully:', ['courses' => $courses]);

        return response()->json($courses);
    }


    public function relatedCourses($slug)
    {
        $course = Course::where('slug', $slug)->first();

        if (!$course) {
            return response()->json(['message' => 'Khóa học không tìm thấy'], 404);
        }

        $relatedCourses = Course::where('course_category_id', $course->course_category_id)
            ->where('user_id', $course->user_id)
            ->where('slug', '!=', $slug)
            ->get();

        if ($relatedCourses->isEmpty()) {
            return response()->json(['message' => 'Không tìm thấy khóa học liên quan.'], 404);
        }

        return response()->json($relatedCourses, 200);
    }

    public function relatedCoursesByCategory($categoryId, $slug)
    {
        $course = Course::where('slug', $slug)->first();

        if (!$course) {
            return response()->json(['message' => 'Khóa học không tìm thấy.'], 404);
        }

        $relatedCourses = Course::where('course_category_id', $categoryId)
            ->where('slug', '!=', $slug)
            ->get();

        if ($relatedCourses->isEmpty()) {
            return response()->json(['message' => 'Không tìm thấy khóa học liên quan.'], 404);
        }

        return response()->json($relatedCourses, 200);
    }

    public function topPurchasedCourses()
    {
        $topCourses = Cache::remember('top_purchased_courses', 180, function () {
            return Course::orderBy('is_buy', 'desc')
                ->limit(4)
                ->get();
        });

        if ($topCourses->isEmpty()) {
            return response()->json(['message' => 'Không tìm thấy khóa học'], 404);
        }

        return response()->json($topCourses, 200);
    }

    public function topViewedCourses()
    {
        $topCourses = Cache::remember('top_viewed_courses', 180, function () {
            return Course::orderBy('views', 'desc')
                ->limit(4)
                ->get();
        });

        if ($topCourses->isEmpty()) {
            return response()->json(['message' => 'Không tìm thấy khóa học'], 404);
        }

        return response()->json($topCourses, 200);
    }

    public function show(Request $request, $slug)
    {
        $course = Cache::remember("course_{$slug}", 90, function () use ($slug) {
            return $this->course->where('slug', $slug)->first();
        });

        if (!$course) {
            return response()->json(['error' => 'Khóa học không tìm thấy'], 404);
        }

        $ipAddress = $request->ip();
        $cacheKey = "course_view_{$slug}_{$ipAddress}";

        if (Cache::has($cacheKey)) {
            return response()->json($course);
        }

        $course->increment('views');

        Cache::put($cacheKey, true, 86400);

        return response()->json($course);
    }

    public function store(Request $request)
    {
        $rules = [
            'course_category_id' => 'required|numeric',
            'price' => 'required|numeric',
            'price_discount' => 'required|numeric',
            'description' => 'required|string',
            'img' => 'nullable|max:2048',
            'title' => 'required|string',
            'slug' => 'required|string|unique:courses,slug'
        ];

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        if ($request->price < $request->price_discount) {
            return response()->json(['error' => 'Giá không được nhỏ hơn giá giảm giá.'], 422);
        }

        $userId = auth()->id();


        $course = Course::create([
            'user_id' => $userId,
            'course_category_id' => $request->course_category_id,
            'price' => $request->price,
            'price_discount' => $request->price_discount,
            'description' => $request->description,
            'title' => $request->title,
            'slug' => $request->slug,
            'img' => $this->handleImageUpload($request)
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Khóa học được thêm thành công.',
            'course' => $course
        ], 201);
    }

    public function update(Request $request, $slug)
    {
        $rules = [
            'course_category_id' => 'sometimes|numeric',
            'price' => 'sometimes|numeric',
            'price_discount' => 'sometimes|numeric',
            'description' => 'sometimes|string',
            'img' => 'nullable|max:2048',
            'title' => 'required|string',
            'slug' => 'required|string'
        ];

        $validator = Validator::make($request->all(), $rules);

        if ($request->price < $request->price_discount) {
            return response()->json(['error' => 'Giá không được nhỏ hơn giá giảm giá.'], 422);
        }

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $course = $this->course->where('slug', $slug)->first();
        if (!$course) {
            return response()->json(['error' => 'Khóa học không tìm thấy'], 404);
        }

        if ($course->user_id !== auth()->id()) {
            return response()->json(['error' => 'Bạn không có quyền cập nhật khóa học này.'], 403);
        }

        $newSlug = $request->input('slug', $course->slug);
        if ($newSlug !== $course->slug && $this->course->where('slug', $newSlug)->exists()) {
            return response()->json(['error' => 'Slug đã tồn tại'], 422);
        }

        $course->update([
            'course_category_id' => $request->input('course_category_id', $course->course_category_id),
            'price' => $request->input('price', $course->price),
            'price_discount' => $request->input('price_discount', $course->price_discount),
            'description' => $request->input('description', $course->description),
            'title' => $request->input('title', $course->title),
            'img' => $this->handleImageUpload($request, $course->img),
            'slug' => $newSlug,
            'user_id' => auth()->id()
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Khóa học được cập nhật thành công.',
            'course' => $course
        ], 200);
    }

    private function handleImageUpload(Request $request, $currentImage = null)
    {
        if ($request->hasFile('img')) {
            if ($currentImage) {
                $oldImagePath = public_path('upload/products/' . $currentImage);
                if (file_exists($oldImagePath)) {
                    unlink($oldImagePath);
                }
            }
            $img = $request->file('img');
            $imagename = time() . '.' . $img->getClientOriginalExtension();

            $img->move(public_path('upload/products'), $imagename);
            return $imagename;
        }
        return $currentImage;
    }

    public function delete($slug)
    {
        $course = $this->course->where('slug', $slug)->first();

        if (!$course) {
            return response()->json(['error' => 'Khóa học không tìm thấy'], 404);
        }

        $course->delete();

        return response()->json([
            'success' => true,
            'message' => 'Khóa học đã được xóa thành công.'
        ], 200);
    }

    public function featureCouse()
    {

        if (Cache::has('featured_course')) {
            return response()->json(Cache::get('featured_course'), 200);
        }

        $featuredCourse = Cache::remember('featured_course', 180, function () {
            return Course::orderBy('is_buy', 'desc')
                ->first();
        });

        if (!$featuredCourse) {
            return response()->json(
                ['message' => 'Không tìm thấy khóa học', 'status' => '404'],
                404
            );
        }
        return response()->json($featuredCourse, 200);
    }
}
