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
use Illuminate\Support\Str;
use App\Models\UserCourse;
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
            ->where('courses.status', 'published') 
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
            return $this->course->where('status', 'published')
                ->where(function ($q) use ($query) {
                    $q->where('title', 'like', "%{$query}%")
                        ->orWhere('description', 'like', "%{$query}%");
                })
                ->get();
        });

        if ($searchResults->isEmpty()) {
            return response()->json(['message' => 'Không tìm thấy khóa học nào.'], 404);
        }

        return response()->json($searchResults, 200);
    }

    public function index()
    {
        Log::info('Fetching courses from cache or database.');

        $courses = Cache::remember('courses', 120, function () {
            Log::info('Querying courses from database.');
            return $this->course->where('status', 'published')
                ->with(['user:user_id,name', 'comments:course_id,rating'])
                ->get();
        });

        Log::info('Courses fetched successfully:', ['courses' => $courses]);

        return response()->json($courses);
    }


    public function relatedCourses($slug)
    {
        $course = Course::where('slug', $slug)
            ->where('status', 'published')
            ->first();

        if (!$course) {
            return response()->json(['message' => 'Khóa học không tìm thấy'], 404);
        }

        $relatedCourses = Course::where('course_category_id', $course->course_category_id)
            ->where('user_id', $course->user_id)
            ->where('slug', '!=', $slug)
            ->where('status', 'published')
            ->get();

        if ($relatedCourses->isEmpty()) {
            return response()->json(['message' => 'Không tìm thấy khóa học liên quan.'], 404);
        }

        return response()->json($relatedCourses, 200);
    }

    public function relatedCoursesByCategory($categoryId, $slug)
    {
        $course = Course::where('slug', $slug)
            ->where('status', 'published')
            ->first();

        if (!$course) {
            return response()->json(['message' => 'Khóa học không tìm thấy.'], 404);
        }

        $relatedCourses = Course::where('course_category_id', $categoryId)
            ->where('slug', '!=', $slug)
            ->where('status', 'published')
            ->get();

        if ($relatedCourses->isEmpty()) {
            return response()->json(['message' => 'Không tìm thấy khóa học liên quan.'], 404);
        }

        return response()->json($relatedCourses, 200);
    }

    public function topPurchasedCourses()
    {
        $topCourses = Cache::remember('top_purchased_courses', 180, function () {
            return Course::where('status', 'published')
                ->with('user:user_id,name')
                ->orderBy('is_buy', 'desc')
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
            return Course::where('status', 'published')
                ->with('user:user_id,name')
                ->orderBy('views', 'desc')
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
            return $this->course->where('slug', $slug)
                               ->where('status', 'published') 
                               ->first();
        });
    
        if (!$course) {
            return response()->json(['error' => 'Khóa học không tìm thấy hoặc chưa được xuất bản'], 404);
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
            'course_category_id' => 'nullable|numeric',
            'price' => 'nullable|numeric',
            'price_discount' => 'nullable|numeric',
            'description' => 'nullable|string',
            'img' => 'nullable|max:2048',
            'title' => 'nullable|string',
            'status' => 'nullable|string|in:draft,published,hide,pending,failed'
        ];
    
        $validator = Validator::make($request->all(), $rules);
    
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
    
        if ($request->price < $request->price_discount) {
            return response()->json(['error' => 'Giá không được nhỏ hơn giá giảm giá.'], 422);
        }
    
        try {
            $course = DB::transaction(function () use ($request) {
                $userId = auth()->id();
    
                // Tạo slug từ title
                $baseSlug = Str::slug($request->title);
                $slug = $baseSlug;
                $counter = 1;
    
                // Kiểm tra slug tồn tại
                while (Course::where('slug', $slug)->exists()) {
                    $slug = $baseSlug . '-' . $counter;
                    $counter++;
                }
    
                // Upload hình ảnh trong transaction
                $imageName = null;
                if ($request->hasFile('img')) {
                    $img = $request->file('img');
                    $imageName = time() . '.' . $img->getClientOriginalExtension();
                    $img->move(public_path('upload/products'), $imageName);
                }
    
                $course = Course::create([
                    'user_id' => $userId,
                    'course_category_id' => $request->course_category_id,
                    'price' => $request->price,
                    'price_discount' => $request->price_discount,
                    'description' => $request->description,
                    'title' => $request->title,
                    'slug' => $slug,
                    'img' => $imageName,
                    'status' => $request->status ?? 'draft'
                ]);
    
                return $course;
            });
    
            return response()->json([
                'success' => true,
                'message' => 'Khóa học được thêm thành công.',
                'course' => $course
            ], 201);
        } catch (\Exception $e) {
            Log::error('Error creating course: ' . $e->getMessage());
            return response()->json([
                'error' => 'Có lỗi xảy ra khi tạo khóa học'
            ], 500);
        }
    }
    
    public function update(Request $request, $slug)
    {
        $rules = [
            'course_category_id' => 'required|numeric',
            'price' => 'required|numeric',
            'price_discount' => 'required|numeric',
            'description' => 'required|string',
            'img' => 'nullable|max:2048',
            'title' => 'required|required|string',
            'status' => 'nullable|string|in:draft,published,hide,pending,failed'
        ];
    
        $validator = Validator::make($request->all(), $rules);
    
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
    
        if ($request->has(['price', 'price_discount']) && $request->price < $request->price_discount) {
            return response()->json(['error' => 'Giá không được nhỏ hơn giá giảm giá.'], 422);
        }
    
        try {
            $course = DB::transaction(function () use ($request, $slug) {
                $course = $this->course->where('slug', $slug)->firstOrFail();
    
                if ($course->user_id !== auth()->id()) {
                    throw new \Exception('Bạn không có quyền cập nhật khóa học này.');
                }
    
                $newSlug = $slug;
                if ($request->has('title') && $request->title !== $course->title) {
                    $baseSlug = Str::slug($request->title);
                    $newSlug = $baseSlug;
                    $counter = 1;
    
                    while (Course::where('slug', $newSlug)
                        ->where('course_id', '!=', $course->course_id)
                        ->exists()
                    ) {
                        $newSlug = $baseSlug . '-' . $counter;
                        $counter++;
                    }
                }
    
                $imageName = $course->img;
                if ($request->hasFile('img')) {
                    if ($course->img) {
                        $oldImagePath = public_path('upload/products/' . $course->img);
                        if (file_exists($oldImagePath)) {
                            unlink($oldImagePath);
                        }
                    }
    
                    $img = $request->file('img');
                    $imageName = time() . '.' . $img->getClientOriginalExtension();
                    $img->move(public_path('upload/products'), $imageName);
                }
    
                $course->update([
                    'course_category_id' => $request->input('course_category_id', $course->course_category_id),
                    'price' => $request->input('price', $course->price),
                    'price_discount' => $request->input('price_discount', $course->price_discount),
                    'description' => $request->input('description', $course->description),
                    'title' => $request->input('title', $course->title),
                    'img' => $imageName,
                    'slug' => $newSlug,
                    'status' => $request->input('status', $course->status)
                ]);
    
                return $course;
            });
    
            return response()->json([
                'success' => true,
                'message' => 'Khóa học được cập nhật thành công.',
                'course' => $course
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error updating course: ' . $e->getMessage());
            return response()->json([
                'error' => $e->getMessage()
            ], $e->getMessage() === 'Bạn không có quyền cập nhật khóa học này.' ? 403 : 500);
        }
    }

    public function delete($slug)
    {
        try {
            DB::transaction(function () use ($slug) {
                $course = $this->course->where('slug', $slug)->firstOrFail();

                if ($course->user_id !== auth()->id()) {
                    throw new \Exception('Bạn không có quyền xóa khóa học này.');
                }

                if ($course->img) {
                    $imagePath = public_path('upload/products/' . $course->img);
                    if (file_exists($imagePath)) {
                        unlink($imagePath);
                    }
                }

                $course->delete();

            });

            return response()->json([
                'success' => true,
                'message' => 'Khóa học đã được xóa thành công.'
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error deleting course: ' . $e->getMessage());
            return response()->json([
                'error' => $e->getMessage()
            ], $e->getMessage() === 'Bạn không có quyền xóa khóa học này.' ? 403 : 500);
        }
    }

    public function featureCouse()
    {
        if (Cache::has('featured_course')) {
            return response()->json(Cache::get('featured_course'), 200);
        }

        $featuredCourse = Cache::remember('featured_course', 180, function () {
            return Course::where('status', 'published')
                ->orderBy('is_buy', 'desc')
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

    public function coursesByUserId($userId)
    {
        $courses = $this->course->where('status', 'published')
            ->with('user:user_id,name')
            ->where('user_id', $userId)
            ->get();

        if ($courses->isEmpty()) {
            return response()->json(['message' => 'Không tìm thấy khóa học nào cho giảng viên này.'], 404);
        }

        return response()->json($courses, 200);
    }

    public function getStudentsForInstructor($instructorId)
    {
        $courses = Course::where('user_id', $instructorId)->pluck('course_id');

        $students = UserCourse::whereIn('course_id', $courses)
            ->join('users', 'user_courses.user_id', '=', 'users.user_id')
            ->select('users.user_id', 'users.name', 'users.email') 
            ->get();

        return response()->json([
            'success' => true,
            'data' => $students
        ]);
    }
}
