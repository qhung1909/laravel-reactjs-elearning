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

            if ($userId) {
                $notification = Notification::create([
                    'user_id' => $userId,
                    'message' => $message,
                    'is_read' => false
                ]);
                broadcast(new MyEvent($message, $userId, $notification->id))->toOthers();
            } else {
                $users = User::all();
                foreach ($users as $user) {
                    $notification = Notification::create([
                        'user_id' => $user->user_id,
                        'message' => $message,
                        'is_read' => false
                    ]);

                    broadcast(new MyEvent($message, $user->user_id, $notification->id))->toOthers();
                }
            }

            return response()->json([
                'status' => 'Tin nhắn đã được gửi!',
                'user_id' => $userId,
                'message' => $message
            ]);
        } catch (\Exception $e) {
            return response()->json(['status' => 'Có lỗi xảy ra khi gửi tin nhắn.'], 500);
        }
    }

    public function markAsRead($notification_id)
    {
        try {
            if (!Auth::check()) {
                return response()->json(['status' => 'Đăng nhập để xem tin nhắn.'], 401);
            }

            $notification = Notification::find($notification_id);
            if ($notification && $notification->user_id === Auth::id()) {
                $notification->is_read = true;
                $notification->save();

                return response()->json(['status' => 'Tin nhắn đã được đánh dấu là đã xem.']);
            }

            return response()->json(['status' => 'Không tìm thấy tin nhắn hoặc bạn không có quyền truy cập.'], 404);
        } catch (\Exception $e) {
            return response()->json(['status' => 'Có lỗi xảy ra khi đánh dấu tin nhắn.'], 500);
        }
    }

    public function markAllAsRead(Request $request)
    {
        try {
            if (!Auth::check()) {
                return response()->json(['status' => 'Đăng nhập để đánh dấu tất cả thông báo.'], 401);
            }

            $userId = Auth::id();

            Notification::where('user_id', $userId)
                ->where('is_read', false)
                ->update(['is_read' => true]);

            return response()->json(['status' => 'Tất cả thông báo đã được đánh dấu là đã xem.']);
        } catch (\Exception $e) {
            return response()->json(['status' => 'Có lỗi xảy ra khi đánh dấu tất cả thông báo.'], 500);
        }
    }

    public function getNotifications(Request $request)
    {
        try {
            if (!Auth::check()) {
                return response()->json(['status' => 'Đăng nhập để xem thông báo.'], 401);
            }

            $userId = Auth::id();
            $notifications = Notification::where('user_id', $userId)
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'status' => 'Thành công',
                'notifications' => $notifications
            ]);
        } catch (\Exception $e) {
            return response()->json(['status' => 'Có lỗi xảy ra khi lấy thông báo.'], 500);
        }
    }
}
