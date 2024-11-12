<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;

class BlogController extends Controller
{
    public function index()
    {
        try {
            $blogs = Blog::where('status', 'success')
                ->orderBy('created_at', 'desc')
                ->paginate(6);

            return response()->json([
                'status' => true,
                'message' => 'Lấy danh sách blog thành công',
                'data' => $blogs
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Có lỗi xảy ra',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        if (!auth()->check()) {
            return response()->json([
                'status' => false,
                'message' => 'Bạn phải đăng nhập để tạo blog'
            ], 401);
        }

        try {
            $validator = Validator::make($request->all(), [
                'title' => 'required|max:255',
                'content' => 'required',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'status' => 'required|in:draft,success,hide',
                'slug' => 'nullable|max:255|unique:blogs,slug',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Dữ liệu không hợp lệ',
                    'errors' => $validator->errors()
                ], 422);
            }

            $data = $request->all();
            $data['slug'] = Str::slug($request->title);
            $data['user_id'] = auth()->id();

            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $filename = time() . '.' . $image->getClientOriginalExtension();
                $path = $image->storeAs('public/blogs', $filename);
                $data['image'] = $filename;
            }

            $blog = Blog::create($data);

            return response()->json([
                'status' => true,
                'message' => 'Blog đã được tạo thành công',
                'data' => $blog
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Có lỗi xảy ra',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $slug)
    {
        if (!auth()->check()) {
            return response()->json([
                'status' => false,
                'message' => 'Bạn phải đăng nhập để cập nhật blog'
            ], 401);
        }
    
        try {
            $validator = Validator::make($request->all(), [
                'title' => 'nullable|max:255',
                'content' => 'nullable',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'status' => 'nullable|in:draft,success,hide',
                'slug' => 'nullable|max:255|unique:blogs,slug',
            ]);
    
            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Dữ liệu không hợp lệ',
                    'errors' => $validator->errors()
                ], 422);
            }
    
            $blog = Blog::where('slug', $slug)->firstOrFail();
            $data = $request->all();
            $data['slug'] = Str::slug($request->title);
    
            $data['status'] = $data['status'] ?? 'success';
    
            if ($request->hasFile('image')) {
                if ($blog->image) {
                    Storage::delete('public/blogs/' . $blog->image);
                }
    
                $image = $request->file('image');
                $filename = time() . '.' . $image->getClientOriginalExtension();
                $path = $image->storeAs('public/blogs', $filename);
                $data['image'] = $filename;
            }
    
            $blog->update($data);
    
            return response()->json([
                'status' => true,
                'message' => 'Cập nhật blog thành công',
                'data' => $blog
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Có lỗi xảy ra',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    

    public function show($slug)
    {
        try {
            $blog = Blog::where('slug', $slug)
                ->where('status', 'success')
                ->with('user:user_id,name')
                ->firstOrFail();

            return response()->json([
                'status' => true,
                'message' => 'Lấy thông tin blog thành công',
                'data' => [
                    'blog' => $blog
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy blog',
                'error' => $e->getMessage()
            ], 404);
        }
    }




    public function destroy($slug)
    {
        if (!auth()->check()) {
            return response()->json([
                'status' => false,
                'message' => 'Bạn phải đăng nhập để xóa blog'
            ], 401);
        }

        try {
            $blog = Blog::where('slug', $slug)->firstOrFail();

            if ($blog->user_id !== auth()->id()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Bạn không có quyền xóa blog này'
                ], 403);
            }

            if ($blog->image) {
                Storage::delete('public/blogs/' . $blog->image);
            }

            $blog->delete();

            return response()->json([
                'status' => true,
                'message' => 'Xóa blog thành công'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Có lỗi xảy ra',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
