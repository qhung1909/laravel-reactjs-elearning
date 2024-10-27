<?php

namespace App\Http\Controllers;

use GuzzleHttp\Client;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Aws\S3\S3Client;

class CategoryController extends Controller
{
    protected $category;

    public function __construct(Category $category)
    {
        $this->category = $category;
    }

    public function index()
    {
        $categories = Cache::remember('categories', 180, function () {
            return $this->category::all();
        });

        if ($categories->isEmpty()) {
            Log::info('No categories found in the database.');
        }

        return response()->json($categories);
    }

    public function show($slug)
    {
        $category = Cache::remember("category_{$slug}", 90, function () use ($slug) {
            return $this->category->where('slug', $slug)
                ->with(['courses' => function ($query) {
                    $query->where('status', 'published')
                          ->with('user:user_id,name');
                }])
                ->first();
        });
    
        if (!$category) {
            return response()->json(['error' => 'Danh mục không tìm thấy'], 404);
        }
    
        return response()->json([
            'category' => $category,
            'courses' => $category->courses,
        ]);
    }

    public function store(Request $request)
    {
        $rules = [
            'name' => 'required|string|unique:categories,name',
            'description' => 'nullable|string',
            'image' => 'required|image|mimes:jpg,jpeg,png,gif,svg|max:2048',
        ];

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $category = DB::transaction(function () use ($request) {
                $baseSlug = Str::slug($request->name);
                $slug = $baseSlug;
                $counter = 1;

                while (Category::where('slug', $slug)->exists()) {
                    $slug = $baseSlug . '-' . $counter;
                    $counter++;
                }

                $imageUrl = $this->handleImageUpload($request->file('image'));

                return Category::create([
                    'name' => $request->name,
                    'description' => $request->description,
                    'slug' => $slug,
                    'image' => $imageUrl,
                ]);
            });

            Cache::forget('categories');

            return response()->json([
                'success' => true,
                'message' => 'Danh mục được thêm thành công.',
                'category' => $category
            ], 201);
        } catch (\Exception $e) {
            Log::error('Error creating category: ' . $e->getMessage() . ' Trace: ' . $e->getTraceAsString());
            return response()->json([
                'error' => 'Có lỗi xảy ra khi tạo danh mục'
            ], 500);
        }
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


    public function update(Request $request, $slug)
    {
        $rules = [
            'name' => 'sometimes|required|string',
            'description' => 'sometimes|nullable|string',
        ];

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $category = DB::transaction(function () use ($request, $slug) {
                $category = $this->category->where('slug', $slug)->firstOrFail();

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
                $category->save();

                return $category;
            });

            Cache::forget('categories');
            Cache::forget("category_{$slug}");

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

    public function delete($slug)
    {
        try {
            DB::transaction(function () use ($slug) {
                $category = $this->category->where('slug', $slug)->firstOrFail();
                $category->delete();
            });

            Cache::forget('categories');
            Cache::forget("category_{$slug}");

            return response()->json([
                'success' => true,
                'message' => 'Danh mục đã được xóa thành công.'
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error deleting category: ' . $e->getMessage());
            return response()->json([
                'error' => 'Có lỗi xảy ra khi xóa danh mục'
            ], 500);
        }
    }
}
