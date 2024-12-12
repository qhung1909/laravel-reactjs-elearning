<?php

namespace App\Http\Controllers;

use App\Models\User;
use Aws\S3\S3Client;
use App\Models\Course;
use App\Models\UserCourse;
use Illuminate\Support\Str;
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

    public function index(Request $request)
    {
        Log::info('Fetching courses from database directly.');
    
        $userId = auth()->id(); // Lấy ID của người dùng hiện tại (nếu có)
    
        // Truy vấn trực tiếp từ cơ sở dữ liệu
        $courses = $this->course->where(function ($query) use ($userId) {
            // Điều kiện 1: Khóa học phải là "published" (công khai)
            $query->where('status', 'published');
    
            // Điều kiện 2: Nếu là trạng thái "need_schedule", phải thỏa điều kiện user đăng ký
            if ($userId) {
                $query->orWhere(function ($q) use ($userId) {
                    $q->where('status', 'need_schedule')
                      ->whereExists(function ($subquery) use ($userId) {
                          // Kiểm tra trong bảng user_courses
                          $subquery->select('user_courses.course_id')
                                   ->from('user_courses')
                                   ->whereColumn('user_courses.course_id', 'courses.course_id')
                                   ->where('user_courses.user_id', $userId)
                                   ->whereNotNull('user_courses.order_id'); // Đảm bảo đã có thanh toán
                      });
                });
            }
        })
        ->with(['user:user_id,name', 'comments:course_id,rating'])
        ->get();
    
        Log::info('Courses fetched successfully:', ['count' => $courses->count()]);
    
        // Trả về dữ liệu JSON
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
        $userId = auth()->id(); // Lấy ID của người dùng hiện tại (nếu có)
    
        $course = Cache::remember("course_{$slug}_user_{$userId}", 90, function () use ($slug, $userId) {
            return $this->course->where('slug', $slug)
                ->where(function ($query) use ($userId) {
                    // Điều kiện 1: Khóa học phải là "published" (công khai)
                    $query->where('status', 'published');
    
                    // Điều kiện 2: Nếu là "need_schedule", kiểm tra người dùng đã mua
                    if ($userId) {
                        $query->orWhere(function ($q) use ($userId) {
                            $q->where('status', 'need_schedule')
                              ->whereExists(function ($subquery) use ($userId) {
                                  $subquery->select('user_courses.course_id')
                                           ->from('user_courses')
                                           ->whereColumn('user_courses.course_id', 'courses.course_id')
                                           ->where('user_courses.user_id', $userId)
                                           ->whereNotNull('user_courses.order_id'); // Đảm bảo đã có thanh toán
                              });
                        });
                    }
                })
                ->first();
        });
    
        if (!$course) {
            return response()->json(['error' => 'Khóa học không tìm thấy hoặc chưa được xuất bản'], 404);
        }
    
        // Xử lý tăng lượt xem
        $ipAddress = $request->ip();
        $cacheKey = "course_view_{$slug}_{$ipAddress}";
    
        if (!Cache::has($cacheKey)) {
            $course->increment('views');
            Cache::put($cacheKey, true, 86400); // Lưu trong 1 ngày
        }
    
        // Lấy danh sách comments và định dạng lại
        $comments = $course->comments()
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($comment) {
                return [
                    "comment_id" => $comment->comment_id,
                    "user_id" => $comment->user_id,
                    "course_id" => $comment->course_id,
                    "content" => $comment->content,
                    "rating" => $comment->rating,
                    "is_update" => $comment->is_update,
                    "created_at" => $comment->created_at->toIso8601String(),
                    "updated_at" => $comment->updated_at->toIso8601String()
                ];
            });
    
        // Chuẩn bị response
        $response = [
            "course_id" => $course->course_id,
            "course_category_id" => $course->course_category_id,
            "user_id" => $course->user_id,
            "title" => $course->title,
            "price_discount" => $course->price_discount,
            "slug" => $course->slug,
            "price" => $course->price,
            "description" => $course->description,
            "status" => $course->status,
            "created_at" => $course->created_at->toIso8601String(),
            "updated_at" => $course->updated_at->toIso8601String(),
            "img" => $course->img,
            "is_buy" => $course->is_buy,
            "views" => $course->views,
            "reject_reason" => $course->reject_reason,
            "revision_reason" => $course->revision_reason,
            "is_online_meeting" => $course->is_online_meeting,
            "backup_launch_date" => $course->backup_launch_date,
            "launch_date" => $course->launch_date,
            "comments" => $comments
        ];
    
        return response()->json($response);
    }
    

    public function store(Request $request)
    {
        $rules = [
            'course_category_id' => 'nullable|numeric',
            'price' => 'nullable|numeric',
            'price_discount' => 'nullable|numeric',
            'description' => 'nullable|string',
            'img' => 'nullable|mimes:jpeg,png,jpg,gif,webp,svg|max:2048',
            'title' => 'nullable|string',
            'status' => 'nullable|string|in:draft,published,hide,pending,failed',
            'launch_date' => 'nullable|date',
            'backup_launch_date' => 'nullable|date|after_or_equal:launch_date'
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
    
                $title = $request->title ?: 'Chưa có tên khóa học';
    
                $baseSlug = Str::slug($title);
                $slug = $baseSlug;
                $counter = 1;
    
                while (Course::where('slug', $slug)->exists()) {
                    $slug = $baseSlug . '-' . $counter;
                    $counter++;
                }
    
                $imageUrl = null;
                if ($request->hasFile('img')) {
                    $tempCourse = new Course();
                    $tempCourse->content_id = time();
                    $tempCourse->title_content_id = time();
    
                    $imageUrl = $this->handleImageUpload($request->file('img'), $tempCourse);
                }
    
                $course = Course::create([
                    'user_id' => $userId,
                    'course_category_id' => $request->course_category_id,
                    'price' => $request->price,
                    'price_discount' => $request->price_discount,
                    'description' => $request->description,
                    'title' => $title,
                    'slug' => $slug,
                    'img' => $imageUrl,
                    'status' => $request->status ?? 'draft',
                    'launch_date' => $request->launch_date,
                    'backup_launch_date' => $request->backup_launch_date
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
            'img' => 'nullable|mimes:jpeg,png,jpg,gif,webp,svg|max:2048',
            'title' => 'required|string',
            'status' => 'nullable|string|in:draft,published,hide,pending,failed',
            'launch_date' => 'nullable|date',
            'backup_launch_date' => 'nullable|date|after_or_equal:launch_date'
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

                $imageUrl = $course->img;
                if ($request->hasFile('img')) {
                    $imageUrl = $this->handleImageUpload($request->file('img'), $course);
                }

                $course->update([
                    'course_category_id' => $request->input('course_category_id', $course->course_category_id),
                    'price' => $request->input('price', $course->price),
                    'price_discount' => $request->input('price_discount', $course->price_discount),
                    'description' => $request->input('description', $course->description),
                    'title' => $request->input('title', $course->title),
                    'img' => $imageUrl,
                    'slug' => $newSlug,
                    'status' => $request->input('status', $course->status),
                    'launch_date' => $request->input('launch_date', $course->launch_date),
                    'backup_launch_date' => $request->input('backup_launch_date', $course->backup_launch_date)
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

                        $imageKey = str_replace(env('AWS_URL'), '', $course->img);

                        $s3->deleteObject([
                            'Bucket' => env('AWS_BUCKET'),
                            'Key'    => $imageKey,
                        ]);
                    } catch (\Exception $e) {
                        Log::error('Error deleting image from S3: ' . $e->getMessage());
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

    private function handleImageUpload($file, $titleContent)
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
