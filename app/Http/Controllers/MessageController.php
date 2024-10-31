<?php

namespace App\Http\Controllers;

use App\Events\MyEvent;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

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

            Log::info('Attempting to send message', ['user_id' => $userId, 'message' => $message]);

            if ($userId) {
                $notification = Notification::create([
                    'user_id' => $userId,
                    'message' => $message,
                    'is_read' => false
                ]);

                // Thêm log trước khi phát sự kiện
                Log::info('Preparing to broadcast event', [
                    'user_id' => $userId,
                    'message' => $message,
                ]);

                broadcast(new MyEvent($message, $userId, $notification->id))->toOthers();

                // Thêm log sau khi phát sự kiện
                Log::info('Broadcast event sent successfully', [
                    'user_id' => $userId,
                    'notification_id' => $notification->id,
                ]);

            } else {
                $users = User::all();
                foreach ($users as $user) {
                    $notification = Notification::create([
                        'user_id' => $user->user_id,
                        'message' => $message,
                        'is_read' => false
                    ]);

                    // Thêm log trước khi phát sự kiện
                    Log::info('Preparing to broadcast event', [
                        'user_id' => $user->user_id,
                        'message' => $message,
                    ]);

                    broadcast(new MyEvent($message, $user->user_id, $notification->id))->toOthers();

                    // Thêm log sau khi phát sự kiện
                    Log::info('Broadcast event sent successfully', [
                        'user_id' => $user->user_id,
                        'notification_id' => $notification->id,
                    ]);
                }
            }

            return response()->json([
                'status' => 'Tin nhắn đã được gửi!',
                'user_id' => $userId,
                'message' => $message
            ]);

        } catch (\Exception $e) {
            Log::error('Error sending message: ' . $e->getMessage(), [
                'exception' => $e,
                'user_id' => $userId ?? null
            ]);
            return response()->json(['status' => 'Có lỗi xảy ra khi gửi tin nhắn.'], 500);
        }
    }
}
