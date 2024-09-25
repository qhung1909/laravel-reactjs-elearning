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


    public function show($id)
    {
        $course = Cache::remember("course_{$id}", 90 , function () use ($id) {
            return $this->course->find($id);
        });
    
        if (!$course) {
            return response()->json(['error' => 'Khóa học không tìm thấy'], 404);
        }
        
        return response()->json($course);
    }

    public function store(Request $request)
    {
        $rules = [
            'courses_categories_id' => 'required|numeric',
            'price' => 'required|numeric',
            'price_discount' => 'required|numeric',
            'description' => 'required|string',
            'img' => 'nullable|image|max:2048', 
        ];

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $course = Course::create([
            'courses_categories_id' => $request->courses_categories_id,
            'price' => $request->price,
            'price_discount' => $request->price_discount,
            'description' => $request->description,
            'img' => $this->handleImageUpload($request)
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Khóa học được thêm thành công.',
            'course' => $course
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $rules = [
            'courses_categories_id' => 'sometimes|numeric',
            'price' => 'sometimes|numeric',
            'price_discount' => 'sometimes|numeric',
            'description' => 'sometimes|string',
            'img' => 'nullable|image|max:2048',
        ];

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $course = $this->course->find($id);
        if (!$course) {
            return response()->json(['error' => 'Khóa học không tìm thấy'], 404);
        }

        $course->update([
            'courses_categories_id' => $request->input('courses_categories_id', $course->courses_categories_id),
            'price' => $request->input('price', $course->price),
            'price_discount' => $request->input('price_discount', $course->price_discount),
            'description' => $request->input('description', $course->description),
            'img' => $this->handleImageUpload($request, $course->img)
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
}
