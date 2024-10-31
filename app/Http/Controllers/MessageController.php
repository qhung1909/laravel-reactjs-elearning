<?php

namespace App\Http\Controllers;

use App\Events\MyEvent;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Mail\NotificationMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
class MessageController extends Controller
{
    public function sendMessage(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'message' => 'required|string|max:255',
            'user_id' => 'nullable|exists:users,user_id',
            'type' => 'required|string|in:High,Normal,Low',
            'content' => 'nullable|string'
        ]);
    
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dữ liệu không hợp lệ.',
                'errors' => $validator->errors(),
                'data' => null 
            ], 422);
        }
    
        if (!Auth::check()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Vui lòng đăng nhập để gửi tin nhắn.',
                'data' => null
            ], 401);
        }
    
        try {
            $message = $request->input('message');
            $userId = $request->input('user_id');
            $type = $request->input('type');
            $content = $request->input('content');
            $notificationIds = [];
    
            if ($userId) {
                $user = User::find($userId);
                if (!$user) {
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Không tìm thấy người dùng.',
                        'data' => null 
                    ], 404);
                }
    
                $notification = Notification::create([
                    'user_id' => $userId,
                    'message' => $message,
                    'content' => $content,
                    'type' => $type,
                    'is_read' => false,
                    'created_by' => Auth::id()
                ]);
    
                broadcast(new MyEvent($message, $userId, $notification->id))->toOthers();
    
                if ($type === 'High') {
                    try {
                        Mail::to($user->email)
                            ->queue(new NotificationMail($message, $content ?? '', $type));
                    } catch (\Exception $e) {
                        Log::warning("Failed to send email to {$user->email}: {$e->getMessage()}");
                    }
                }
    
                $notificationIds[] = $notification->id;
    
            } else {
                $users = User::select(['user_id', 'email'])->get();
    
                foreach ($users as $user) {
                    $notification = Notification::create([
                        'user_id' => $user->user_id,
                        'message' => $message,
                        'content' => $content,
                        'type' => $type,
                        'is_read' => false,
                        'created_by' => Auth::id()
                    ]);
    
                    broadcast(new MyEvent($message, $user->user_id, $notification->id))->toOthers();
    
                    if ($type === 'High') {
                        try {
                            Mail::to($user->email)
                                ->queue(new NotificationMail($message, $content ?? '', $type));
                        } catch (\Exception $e) {
                            Log::warning("Failed to send email to {$user->email}: {$e->getMessage()}");
                        }
                    }
    
                    $notificationIds[] = $notification->id;
                }
            }
    
            return response()->json([
                'status' => 'success',
                'message' => $userId ? 'Tin nhắn đã được gửi thành công!' : 'Tin nhắn đã được gửi đến tất cả người dùng!',
                'data' => [
                    'user_id' => $userId ?? null,
                    'notification_ids' => $notificationIds,
                    'sent_at' => now()->toISOString(),
                ]
            ]);
    
        } catch (\Exception $e) {
            Log::error('Notification Error: ' . $e->getMessage());
    
            return response()->json([
                'status' => 'error',
                'message' => 'Có lỗi xảy ra khi gửi tin nhắn.',
                'debug' => config('app.debug') ? $e->getMessage() : null,
                'data' => null 
            ], 500);
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
            $perPage = $request->input('per_page', 8); 
            $page = $request->input('page', 1);
    
            $notifications = Notification::where('user_id', $userId)
                ->orderBy('created_at', 'desc')
                ->paginate($perPage, ['*'], 'page', $page);
    
            return response()->json([
                'status' => 'Thành công',
                'notifications' => $notifications->items(), 
                'current_page' => $notifications->currentPage(),
                'last_page' => $notifications->lastPage(),
                'total' => $notifications->total(),
            ]);
        } catch (\Exception $e) {
            return response()->json(['status' => 'Có lỗi xảy ra khi lấy thông báo.'], 500);
        }
    }
    
    public function getNotificationDetails($id)
    {
        try {
            if (!Auth::check()) {
                return response()->json(['status' => 'Đăng nhập để xem thông báo.'], 401);
            }

            $notification = Notification::find($id);

            if (!$notification || $notification->user_id !== Auth::id()) {
                return response()->json(['status' => 'Không tìm thấy thông báo hoặc bạn không có quyền truy cập.'], 404);
            }

            return response()->json([
                'status' => 'Thành công',
                'notification' => $notification
            ]);
        } catch (\Exception $e) {
            return response()->json(['status' => 'Có lỗi xảy ra khi lấy chi tiết thông báo.'], 500);
        }
    }
}
