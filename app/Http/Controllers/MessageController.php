<?php

namespace App\Http\Controllers;

use App\Events\MyEvent;
use App\Jobs\ProcessMessageJob;
use App\Models\Notification; 
use App\Models\User; 
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log; 
use Exception; 

class MessageController extends Controller
{
    public function sendMessage(Request $request)
    {
        try {
            if (!Auth::check()) {
                return response()->json(['status' => 'Đăng nhập để gửi tin nhắn.'], 401);
            }

            $message = $request->input('message');
            $userId = $request->input('user_id'); 

            Log::info('Sending message', ['user_id' => $userId, 'message' => $message]);

            if ($userId) {
                Notification::create([
                    'user_id' => $userId,
                    'message' => $message,
                    'is_read' => false 
                ]);
                dispatch(new ProcessMessageJob($message, $userId));
                event(new MyEvent($message, $userId)); 
            } else {
                $users = User::all();
                foreach ($users as $user) {
                    Notification::create([
                        'user_id' => $user->user_id,
                        'message' => $message,
                        'is_read' => false 
                    ]);
                    event(new MyEvent($message, $user->id)); 
                }
            }

            return response()->json([
                'status' => 'Tin nhắn đã được gửi!',
                'user_id' => $userId,
                'message' => $message
            ]);
        } catch (Exception $e) {
            Log::error('Error sending message: ' . $e->getMessage());
            return response()->json(['status' => 'Có lỗi xảy ra khi gửi tin nhắn.'], 500);
        }
    }
}
