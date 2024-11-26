<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Comment;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use App\Models\Course;

class CommentController extends Controller
{
    public function index($course_id)
    {
        $course = Course::find($course_id);

        if (!$course) {
            return response()->json(['error' => 'Khóa học không tồn tại.'], 404);
        }

        $comments = Comment::where('course_id', $course_id)
            ->with('user:user_id,name,avatar')
            ->get();

        if ($comments->isEmpty()) {
            return response()->json(['message' => 'Không có bình luận nào cho khóa học này.'], 200);
        }

        $comments = $comments->map(function ($comment) {
            return [
                'comment_id' => $comment->comment_id, 
                'content' => $comment->content,
                'created_at' => $comment->created_at,
                'user' => [
                    'name' => $comment->user->name,
                    'avatar' => $comment->user->avatar
                ]
            ];
        });

        return response()->json([
            'success' => true,
            'comments' => $comments
        ], 200);
    }

    public function showAllComment()
    {
        // Load comments with both course and user relationships
        $comments = Comment::with(['course', 'user'])->get();

        if ($comments->isEmpty()) {
            return response()->json(['message' => 'Không có bình luận nào.'], 200);
        }

        $formattedComments = $comments->map(function ($comment) {
            return [
                'comment_id' => $comment->comment_id,
                'content' => $comment->content,
                'rating' => $comment->rating,
                'user_id' => $comment->user_id,
                'created_at' => $comment->created_at,
                'updated_at' => $comment->updated_at,
                'has_updated' => $comment->has_updated,
                'user' => [
                    'name' => $comment->user->name,
                    'avatar' => $comment->user->avatar,
                ],
                'course' => [
                    'course_id' => $comment->course->course_id,
                    'title' => $comment->course->title,
                    'img' => $comment->course->img,
                ]
            ];
        });

        return response()->json([
            'success' => true,
            'comments' => $formattedComments
        ], 200);
    }

    public function store(Request $request, $slug)
    {
        if (!Auth::check()) {
            return response()->json(['error' => 'Bạn cần đăng nhập để đánh giá.'], 401);
        }

        $rules = [
            'content' => 'required|string|max:500',
            'rating' => 'required|integer|min:1|max:5',
        ];

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $course = Course::where('slug', $slug)->first();

        if (!$course) {
            return response()->json(['error' => 'Khóa học không tìm thấy.'], 404);
        }

        $existingComment = Comment::where('user_id', Auth::id())->where('course_id', $course->course_id)->first();

        if ($existingComment) {
            return response()->json(['error' => 'Bạn chỉ được đánh giá một lần.'], 403);
        }

        $comment = Comment::create([
            'user_id' => Auth::id(),
            'course_id' => $course->course_id,
            'content' => $request->content,
            'rating' => $request->rating,
            'has_updated' => false,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Bình luận đã được thêm thành công.',
            'comment' => $comment
        ], 201);
    }

    public function update(Request $request, $commentId)
    {
        if (!Auth::check()) {
            return response()->json(['error' => 'Bạn cần đăng nhập để sửa bình luận.'], 401);
        }

        $rules = [
            'content' => 'required|string|max:500',
            'rating' => 'required|integer|min:1|max:5',
        ];

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $comment = Comment::find($commentId);

        if (!$comment) {
            return response()->json(['error' => 'Bình luận không tìm thấy.'], 404);
        }

        if ($comment->user_id !== Auth::id()) {
            return response()->json(['error' => 'Bạn không có quyền sửa bình luận này.'], 403);
        }

        if ($comment->is_update) {
            return response()->json(['error' => 'Bạn chỉ có thể sửa bình luận này một lần.'], 403);
        }

        $comment->update([
            'content' => $request->content,
            'rating' => $request->rating,
            'is_update' => true,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Bình luận đã được cập nhật.',
            'comment' => $comment
        ], 200);
    }

    public function destroy($commentId)
    {
        if (!Auth::check()) {
            return response()->json(['error' => 'Bạn cần đăng nhập để xóa bình luận.'], 401);
        }

        $comment = Comment::find($commentId);

        if (!$comment) {
            return response()->json(['error' => 'Bình luận không tìm thấy.'], 404);
        }

        if ($comment->user_id !== Auth::id()) {
            return response()->json(['error' => 'Bạn không có quyền xóa bình luận này.'], 403);
        }

        $comment->delete();

        return response()->json([
            'success' => true,
            'message' => 'Bình luận đã được xóa thành công.'
        ], 200);
    }
}
