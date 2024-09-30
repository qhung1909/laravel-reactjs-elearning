<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use App\Models\Course;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Cache;

class CourseController extends Controller
{
    protected $course;

    public function __construct(Course $course)
    {
        $this->course = $course;
    }

    public function index()
    {
        $courses = Cache::remember('courses', 120, function () {
            return $this->course::all();
        });

        return response()->json($courses);
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

        $course = Course::create([
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
