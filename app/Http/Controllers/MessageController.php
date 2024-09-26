<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Events\MyEvent;
use Illuminate\Support\Facades\Auth;
use App\Jobs\ProcessMessageJob;

class MessageController extends Controller
{
    public function sendMessage(Request $request)
    {
        if (!Auth::check()) {
            return response()->json(['status' => 'Đăng nhập để gửi tin nhắn.'], 401);
        }

        $message = $request->input('message'); 

        $userId = Auth::id();

        dispatch(new ProcessMessageJob($message, $userId));
        event(new MyEvent($message, $userId));

        return response()->json([
            'status' => 'Tin nhắn đã được gửi!',
            'user_id' => $userId,
            'message' => $message
        ]);
    }
}
