<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Validator;

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
            return $this->category->where('slug', $slug)->first();
        });

        if (!$category) {
            return response()->json(['error' => 'Danh mục không tìm thấy'], 404);
        }
        $courses = $category->courses;

        return response()->json([
            'category' => $category,
        ]);
    }

    public function store(Request $request)
    {
        $rules = [
            'name' => 'required|string',
            'description' => 'nullable|string',
            'slug' => 'required|string|unique:categories,slug'
        ];

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $category = Category::create([
            'name' => $request->name,
            'description' => $request->description,
            'slug' => $request->slug,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Danh mục được thêm thành công.',
            'category' => $category
        ], 201);
    }

    public function update(Request $request, $slug)
    {
        $rules = [
            'name' => 'sometimes|required|string',
            'description' => 'sometimes|nullable|string',
            'slug' => 'sometimes|required|string|unique:categories,slug,' . $slug . ',slug'
        ];

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $category = $this->category->where('slug', $slug)->first();
        if (!$category) {
            return response()->json(['error' => 'Danh mục không tìm thấy'], 404);
        }

        $category->update([
            'name' => $request->input('name', $category->name),
            'description' => $request->input('description', $category->description),
            'slug' => $request->input('slug', $category->slug),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Danh mục được cập nhật thành công.',
            'category' => $category
        ], 200);
    }

    public function delete($slug)
    {
        $category = $this->category->where('slug', $slug)->first();

        if (!$category) {
            return response()->json(['error' => 'Danh mục không tìm thấy'], 404);
        }

        $category->delete();

        return response()->json([
            'success' => true,
            'message' => 'Danh mục đã được xóa thành công.'
        ], 200);
    }
}
