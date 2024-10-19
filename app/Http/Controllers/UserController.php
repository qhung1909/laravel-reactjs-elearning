<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Order;
use App\Mail\WelcomeMail;
use Illuminate\Http\Request;
use App\Jobs\SendWelcomeEmail;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Validator;
use App\Models\Coupon;

class UserController extends Controller
{
    public function getAllUsers(Request $request)
    {
        $perPage = $request->input('per_page', 10);

        $users = Cache::remember('users_list', 180, function () use ($perPage) {
            return User::select('user_id','email', 'name', 'role', 'avatar')->paginate($perPage);
        });

        return response()->json($users, 200);
    }


    public function register(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'name' => 'required|max:255|string|min:1',
            'email' =>  'required|max:255|email|string|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Đăng kí không thành công.',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'verification_token' => sha1(time()),
        ]);

        SendWelcomeEmail::dispatch($user);

        return response()->json([
            'message' => 'Đăng kí thành công. Vui lòng kiểm tra email để xác nhận tài khoản.',
            'status' => 200
        ], 200);
    }

    public function verifyEmail($token)
    {
        $user = User::where('verification_token', $token)->first();

        if (!$user) {
            return redirect('http://localhost:5173/verification-error');
        }

        $user->email_verified_at = now();
        $user->verification_token = null;
        $user->save();

        return redirect('http://localhost:5173/verification-success?token=' . $token);
    }

    public function sendResetLink(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Email không hợp lệ.',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return response()->json([
                'message' => 'Email không tồn tại trong hệ thống.',
            ], 404);
        }

        $status = Password::sendResetLink($request->only('email'));

        return $status === Password::RESET_LINK_SENT
            ? response()->json(['message' => 'Email reset password đã được gửi!'], 200)
            : response()->json(['message' => 'Có lỗi xảy ra, vui lòng thử lại.'], 500);
    }

    public function resetPassword(Request $request, $token)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Cập nhật mật khẩu không thành công.',
                'errors' => $validator->errors()
            ], 422);
        }

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation') + ['token' => $token],
            function ($user, $password) {
                $user->password = bcrypt($password);
                $user->save();
            }
        );

        return $status === Password::PASSWORD_RESET
            ? response()->json(['message' => 'Mật khẩu đã được cập nhật thành công!'], 200)
            : response()->json(['message' => 'Có lỗi xảy ra, vui lòng thử lại.'], 500);
    }

    public function updateProfile(Request $request)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Bạn cần đăng nhập để thực hiện hành động này.'], 401);
        }

        $user = Auth::user();

        $validator = Validator::make($request->all(), [
            'name' => 'nullable|string|max:255',
            'email' => 'nullable|email|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:6|confirmed',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Cập nhật không thành công.',
                'errors' => $validator->errors()
            ], 422);
        }

        if ($request->has('name')) {
            $user->name = $request->name;
        }

        if ($request->has('email')) {
            $user->email = $request->email;
        }

        if ($request->has('password')) {
            $user->password = Hash::make($request->password);
        }

        if ($request->hasFile('avatar')) {
            if ($user->avatar) {
                Storage::delete($user->avatar);
            }

            $path = $request->file('avatar')->store('avatars', 'public');
            $user->avatar = $path;
        }

        $user->save();

        return response()->json(['message' => 'Cập nhật thông tin tài khoản thành công!'], 200);
    }

    public function getOrderHistory()
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Bạn cần đăng nhập để thực hiện hành động này.'], 401);
        }

        $userId = Auth::id();

        $orders = Order::where('user_id', $userId)
            ->with(['coupon', 'userCourses.course'])
            ->select('order_id', 'total_price', 'coupon_id', 'status', 'payment_method', 'created_at')
            ->orderBy('created_at', 'desc')
            ->get();

        $orders = $orders->map(function ($order) {
            return [
                'order_id' => $order->order_id,
                'name_coupon' => $order->coupon ? $order->coupon->name_coupon : null,
                'total_price' => $order->total_price,
                'status' => $order->status,
                'payment_method' => $order->payment_method,
                'created_at' => $order->created_at->format('d-m-Y H:i:s'),
                'courses' => $order->userCourses->map(function ($userCourse) {
                    return [
                        'course_title' => $userCourse->course ? $userCourse->course->title : null,
                    ];
                }),
            ];
        });

        return response()->json($orders, 200);
    }


    public function searchOrderHistory(Request $request)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Bạn cần đăng nhập để thực hiện hành động này.'], 401);
        }

        $userId = Auth::id();
        $keyword = $request->input('keyword');

        $query = Order::where('user_id', $userId)
            ->with(['coupon', 'userCourses.course']) 
            ->select('order_id', 'total_price', 'coupon_id', 'status', 'payment_method', 'created_at');

        if ($keyword) {
            $query->where(function ($q) use ($keyword) {
                $q->where('order_id', 'like', "%$keyword%")
                    ->orWhereHas('userCourses.course', function ($query) use ($keyword) {
                        $query->where('title', 'like', "%$keyword%"); 
                    });
            });
        }

        $orders = $query->orderBy('created_at', 'desc')->get();

        $orders = $orders->map(function ($order) {
            return [
                'order_id' => $order->order_id,
                'name_coupon' => $order->coupon ? $order->coupon->name_coupon : null,
                'total_price' => $order->total_price,
                'status' => $order->status,
                'payment_method' => $order->payment_method,
                'created_at' => $order->created_at->format('d-m-Y H:i:s'),
                'courses' => $order->userCourses->map(function ($userCourse) {
                    return [
                        'course_id' => $userCourse->course_id,
                        'course_title' => $userCourse->course ? $userCourse->course->title : null, 
                    ];
                }),
            ];
        });

        return response()->json($orders, 200);
    }
}
