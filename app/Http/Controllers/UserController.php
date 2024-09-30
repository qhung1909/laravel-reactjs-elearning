<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\User;
use App\Mail\WelcomeMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
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
                'message' => 'Thông tin đã tồn tại.',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::create([
            'name'=> $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'verification_token' => sha1(time()),
        ]);

        Mail::to($user->email)->send(new WelcomeMail($user));

        return response()->json([
            'message' => 'Đăng kí thành công. Vui lòng kiểm tra email để xác nhận tài khoản.',
            'status' => 200
        ], 200);
    }

    public function verifyEmail($token)
    {
        $user = User::where('verification_token', $token)->first();
    
        if (!$user) {
            return response()->json(['message' => 'Token không hợp lệ.'], 400);
        }
    
        $user->email_verified_at = now();
        $user->verification_token = null; 
        $user->save();
        
        return response()->json(['message' => 'Email đã được xác nhận thành công!'], 200);
    }
    
}
