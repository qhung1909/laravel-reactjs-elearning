<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Favorite;
use Illuminate\Support\Facades\Auth;

class FavoriteController extends Controller
{
    /**
     * Add a course to the user's favorites.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function addToFavorites(Request $request)
    {
        if (!Auth::check()) {
            return response()->json([
                'message' => 'Người dùng chưa đăng nhập.',
            ], 401);
        }

        $request->validate([
            'course_id' => 'required|exists:courses,course_id',
        ]);

        $user = Auth::user();

        $favorite = Favorite::firstOrCreate([
            'user_id' => $user->user_id,
            'course_id' => $request->course_id,
        ]);

        if ($favorite->wasRecentlyCreated) {
            return response()->json([
                'message' => 'Khóa học đã được thêm vào danh sách yêu thích.',
                'favorite' => $favorite,
            ], 201);
        } else {
            return response()->json([
                'message' => 'Khóa học này đã có trong danh sách yêu thích.',
            ], 409);
        }
    }

    /**
     * Get all the user's favorite courses.
     *
     * @return \Illuminate\Http\Response
     */
    public function getFavorites()
    {
        if (!Auth::check()) {
            return response()->json([
                'message' => 'Người dùng chưa đăng nhập.',
            ], 401);
        }

        $user = Auth::user();

        $favorites = Favorite::with('course')
            ->where('user_id', $user->user_id)
            ->get();

        return response()->json($favorites, 200);
    }

    /**
     * Remove a course from the user's favorites.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function removeFromFavorites(Request $request)
    {
        if (!Auth::check()) {
            return response()->json([
                'message' => 'Người dùng chưa đăng nhập.',
            ], 401);
        }

        $request->validate([
            'course_id' => 'required|exists:courses,course_id',
        ]);

        $user = Auth::user();

        $favorite = Favorite::where('user_id', $user->user_id)
            ->where('course_id', $request->course_id)
            ->first();

        if ($favorite) {
            $favorite->delete();
            return response()->json([
                'message' => 'Khóa học đã được xóa khỏi danh sách yêu thích.',
            ], 200);
        } else {
            return response()->json([
                'message' => 'Khóa học không tồn tại trong danh sách yêu thích.',
            ], 404);
        }
    }
}
