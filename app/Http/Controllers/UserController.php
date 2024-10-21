<?php

namespace App\Http\Controllers;

use App\Models\User;

use Aws\S3\S3Client;
use App\Models\Order;
use App\Models\Coupon;
use App\Mail\WelcomeMail;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Jobs\SendWelcomeEmail;
use App\Jobs\SendPasswordResetLink;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    public function getAllUsers(Request $request)
    {
        $perPage = $request->input('per_page', 10);

        $users = Cache::remember('users_list', 180, function () use ($perPage) {
            return User::select('user_id', 'email', 'name', 'role', 'avatar')->paginate($perPage);
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

        SendPasswordResetLink::dispatch($request->email);

        return response()->json(['message' => 'Email reset password đã được gửi!'], 200);
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
        Log::info('Request data:', $request->all());

        if (!Auth::check()) {
            return response()->json(['message' => 'Bạn cần đăng nhập để thực hiện hành động này.'], 401);
        }

        $user = Auth::user();

        Log::info('Full Request:', [
            'files' => $request->files,
            'all' => $request->all(),
            'has_file' => $request->hasFile('avatar'),
        ]);

        $validator = Validator::make($request->all(), [
            'name' => 'nullable|string|max:255',
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

        if ($request->hasFile('avatar')) {
            Log::info('Avatar file received:', ['file' => $request->file('avatar')]);
            if ($user->avatar) {
                Storage::disk('r2')->delete($user->avatar);
            }

            $path = $request->file('avatar')->store('avatars', 'r2');
            $avatarUrl = Storage::disk('r2')->url($path); // Lấy URL công khai cho avatar
            $user->avatar = $avatarUrl; // Lưu URL vào thuộc tính người dùng
        } else {
            Log::info('No avatar file received.');
        }

        $user->save(); // Lưu người dùng vào cơ sở dữ liệu

        return response()->json([
            'message' => 'Cập nhật thông tin tài khoản thành công!',
            'avatar_url' => $user->avatar, // Gửi URL avatar về cho client
        ], 200);
    }





    public function updatePassword(Request $request)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Bạn cần đăng nhập để thực hiện hành động này.'], 401);
        }

        $user = Auth::user();

        $validator = Validator::make($request->all(), [
            'password' => 'required|string|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Cập nhật mật khẩu không thành công.',
                'errors' => $validator->errors()
            ], 422);
        }

        if (Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Mật khẩu mới không được trùng với mật khẩu hiện tại.'], 400);
        }

        $user->password = Hash::make($request->password);
        $user->save();

        return response()->json(['message' => 'Cập nhật mật khẩu thành công!'], 200);
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

    public function upload(Request $request)
    {
        if (!$request->hasFile('file')) {
            return response()->json(['error' => 'No file provided'], 400);
        }

        $s3 = new S3Client([
            'region'  => env('AWS_DEFAULT_REGION'),
            'version' => 'latest',
            'credentials' => [
                'key'    => env('AWS_ACCESS_KEY_ID'),
                'secret' => env('AWS_SECRET_ACCESS_KEY'),
            ],
            'http' => [
                'verify' => 'C:/laragon/etc/ssl/cacert.pem',
            ],
        ]);

        $file = $request->file('file');
        $filePath = $file->getRealPath();
        $fileName = Str::random(10) . '_' . $file->getClientOriginalName(); 

        try {
            $result = $s3->putObject([
                'Bucket' => env('AWS_BUCKET'), 
                'Key'    => $fileName,          
                'SourceFile' => $filePath,     
            ]);

            return response()->json(['url' => $result['ObjectURL']], 200);
        } catch (\Exception $e) {
            Log::error('Error uploading file to S3: ' . $e->getMessage());
            return response()->json(['error' => 'Could not upload file to S3.', 'details' => $e->getMessage()], 500);
        }
    }
}
