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
use App\Mail\ResetPasswordMail;
use App\Models\PasswordResetToken;
use Illuminate\Support\Facades\DB;
use App\Jobs\SendPasswordResetLink;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\URL;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Validator;
use App\Mail\GenZWelcomeEmail;

class UserController extends Controller
{
    public function getAllUsers(Request $request)
    {
        $perPage = $request->input('per_page', 10);

        $users = Cache::remember('users_list', 180, function () use ($perPage) {
            return User::select('user_id', 'email', 'name', 'role', 'avatar', 'status')->paginate($perPage);
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
            'verification_token' => bin2hex(random_bytes(120)),
            'avatar' => 'https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/avatar-default-svgrepo-com.svg',
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

        Mail::to($user->email)->send(new GenZWelcomeEmail($user));


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

        $lastRequest = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->orderBy('created_at', 'desc')
            ->first();

        if ($lastRequest && $lastRequest->created_at > now()->subMinutes(5)) {
            return response()->json(['message' => 'Bạn đã yêu cầu gửi link reset trong vòng 5 phút qua.'], 429);
        }

        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        $token = Str::random(70) . '-' . uniqid() . '-' . Str::random(70);
        $expiresAt = now()->addSeconds(300);

        DB::table('password_reset_tokens')->insert([
            'email' => $request->email,
            'token' => $token,
            'expires_at' => $expiresAt,
            'created_at' => now(),
        ]);

        $link = URL::to('http://localhost:5173/new-password?token=' . $token);

        SendPasswordResetLink::dispatch($request->email, $link);

        return response()->json(['message' => 'Email reset password đã được gửi!'], 200);
    }

    public function resetPassword(Request $request, $token)
    {
        $validator = Validator::make($request->all(), [
            'password' => 'required|string|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Cập nhật mật khẩu không thành công.',
                'errors' => $validator->errors()
            ], 422);
        }

        $passwordReset = DB::table('password_reset_tokens')->where('token', $token)->first();

        if (!$passwordReset) {
            return response()->json([
                'message' => 'Token không hợp lệ hoặc đã hết hạn.',
                'error' => 'passwords.token'
            ], 400);
        }

        $user = User::where('email', $passwordReset->email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'Người dùng không tồn tại.',
                'error' => 'user.not_found'
            ], 404);
        }

        if (Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Mật khẩu mới không được giống mật khẩu cũ.',
                'error' => 'passwords.same'
            ], 422);
        }

        $user->password = bcrypt($request->password);
        $user->save();

        DB::table('password_reset_tokens')->where('token', $token)->delete();

        return response()->json(['message' => 'Mật khẩu đã được cập nhật thành công!'], 200);
    }



    public function updateProf(Request $request)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Bạn cần đăng nhập để thực hiện hành động này.'], 401);
        }

        $user = Auth::user();

        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'file' => 'nullable|file|mimes:jpg,jpeg,png|max:2048',
        ]);

        $user->name = $validatedData['name'];

        if ($request->hasFile('file')) {
            $this->handleFileUpload($request->file('file'), $user);
        } else {
            Log::info('No file uploaded.');
        }

        $user->save();

        return response()->json(['message' => 'Cập nhật thông tin thành công.', 'user' => $user], 200);
    }

    /**
     * Xử lý upload file lên S3
     */
    private function handleFileUpload($file, $user)
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

        if ($user->avatar) {
            $user->avatar = null;
        }

        $filePath = $file->getRealPath();
        $userId = $user->user_id;
        $originalFileName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $extension = $file->getClientOriginalExtension();
        $newFileName = "{$userId}.{$originalFileName}.{$extension}";
        $key = 'uploads/' . $newFileName;

        $contentType = match ($extension) {
            'jpg', 'jpeg' => 'image/jpeg',
            'png' => 'image/png',
            'gif' => 'image/gif',
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
            $user->avatar = $result['ObjectURL'];
        } catch (\Exception $e) {
            throw new \Exception('Could not upload new avatar to S3: ' . $e->getMessage());
        }
    }

    public function updatePassword(Request $request)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Bạn cần đăng nhập để thực hiện hành động này.'], 401);
        }

        $user = Auth::user();

        if ($user->locked_until && \Carbon\Carbon::parse($user->locked_until)->isFuture()) {
            $remainingTime = \Carbon\Carbon::now()->diffInMinutes(\Carbon\Carbon::parse($user->locked_until));
            return response()->json([
                'message' => "Tài khoản của bạn đã bị khóa. Vui lòng thử lại sau {$remainingTime} phút."
            ], 403);
        }

        if ($user->locked_until && \Carbon\Carbon::parse($user->locked_until)->isPast()) {
            $user->status = 1;
            $user->locked_until = null;
            $user->save();
        }

        $validator = Validator::make($request->all(), [
            'current_password' => 'required|string',
            'password' => 'required|string|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Cập nhật mật khẩu không thành công.',
                'errors' => $validator->errors()
            ], 422);
        }

        if (!Hash::check($request->current_password, $user->password)) {
            $user->failed_attempts = $user->failed_attempts + 1;

            if ($user->failed_attempts >= 5) {
                $lockoutMinutes = 2;
                if ($user->lockout_count > 0) {
                    $lockoutMinutes = 2 * pow(2, $user->lockout_count);
                }

                $user->locked_until = \Carbon\Carbon::now()->addMinutes($lockoutMinutes);
                $user->status = 0;
                $user->failed_attempts = 0;
                $user->lockout_count = ($user->lockout_count ?? 0) + 1;

                $user->save();

                return response()->json([
                    'message' => "Tài khoản của bạn đã bị khóa trong {$lockoutMinutes} phút do nhập sai mật khẩu nhiều lần."
                ], 400);
            }

            $user->save();
            return response()->json([
                'message' => 'Mật khẩu cũ không đúng. Bạn còn ' . (5 - $user->failed_attempts) . ' lần thử.'
            ], 400);
        }

        if (Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Mật khẩu mới không được trùng với mật khẩu hiện tại.'
            ], 400);
        }

        $user->password = Hash::make($request->password);
        $user->failed_attempts = 0;
        $user->locked_until = null;
        $user->status = 1;
        $user->lockout_count = 0;
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
            ->whereHas('orderDetails', function ($query) {
                $query->where('status', 'success');
            })
            ->with(['coupon', 'userCourses.course', 'orderDetails.course'])
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
                'courses' => $order->orderDetails->filter(function ($orderDetail) {
                    return $orderDetail->status === 'success';
                })->map(function ($orderDetail) {
                    return [
                        'course_id' => $orderDetail->course_id,
                        'price' => $orderDetail->price,
                        'course_title' => $orderDetail->course ? $orderDetail->course->title : null,
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

    public function getUsers()
    {
        $users = User::where('role', 'user')->select('user_id', 'name', 'email', 'avatar', 'created_at', 'role', 'status')->get();
        return response()->json($users);
    }
    public function getTeacher()
    {
        $teachers = User::where('role', 'teacher')->select('user_id', 'name', 'email', 'avatar', 'created_at', 'role', 'status')->get();
        return response()->json($teachers);
    }

    public function updateRole(Request $request)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $user = User::where('user_id', $request->user_id)->firstOrFail();

        if (Auth::id() !== $user->user_id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        if ($user->role !== 'user') {
            return response()->json(['message' => 'User is not a regular user'], 400);
        }

        $user->update(['role' => 'teacher']);

        return response()->json([
            'message' => 'Role updated successfully',
            'user' => $user
        ]);
    }

    public function toggleRole(Request $request, $userId)
    {
        $currentUser = Auth::user();

        if ($currentUser->role !== 'admin') {
            return response()->json(['error' => 'Bạn không có quyền thay đổi vai trò.'], 403);
        }

        $user = User::find($userId);

        if (!$user) {
            return response()->json(['error' => 'Không tìm thấy người dùng.'], 404);
        }

        if ($currentUser->user_id === $user->user_id) {
            return response()->json(['error' => 'Bạn không thể thay đổi vai trò của chính mình.'], 400);
        }

        $newRole = $user->role === 'user' ? 'admin' : 'user';
        $user->role = $newRole;
        $user->save();

        return response()->json([
            'message' => 'Vai trò đã được cập nhật thành công.',
            'user_id' => $user->user_id,
            'new_role' => $user->role,
        ]);
    }
}
