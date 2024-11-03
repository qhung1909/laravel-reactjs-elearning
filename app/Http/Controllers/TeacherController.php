<?php

namespace App\Http\Controllers;

use App\Models\Content;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TeacherController extends Controller
{
    public function show($contentId)
    {
        try {
            $content = Content::find($contentId);
            
            if (!$content) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy nội dung'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $content
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi: ' . $e->getMessage()
            ], 500);
        }
    }

    // Tạo content mới
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'course_id' => 'required|exists:courses,course_id',
                'name_content' => 'required|string|max:255',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => $validator->errors()
                ], 422);
            }

            $content = Content::create([
                'course_id' => $request->course_id,
                'name_content' => $request->name_content,
                'status' => 'draft' 
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Tạo nội dung thành công',
                'data' => $content
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi: ' . $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $contentId)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name_content' => 'sometimes|required|string|max:255',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => $validator->errors()
                ], 422);
            }

            $content = Content::find($contentId);

            if (!$content) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy nội dung'
                ], 404);
            }

            $content->update($request->only(['name_content']));

            return response()->json([
                'success' => true,
                'message' => 'Cập nhật nội dung thành công',
                'data' => $content
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi: ' . $e->getMessage()
            ], 500);
        }
    }

    // Xóa content
    public function destroy($contentId)
    {
        try {
            $content = Content::find($contentId);

            if (!$content) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy nội dung'
                ], 404);
            }

            $content->delete();

            return response()->json([
                'success' => true,
                'message' => 'Xóa nội dung thành công'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi: ' . $e->getMessage()
            ], 500);
        }
    }
}
