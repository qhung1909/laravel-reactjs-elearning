<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Mail\WelcomeMail;
use Illuminate\Http\Request;
use App\Jobs\SendWelcomeEmail;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{

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
}
