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


            $sender = User::select(['user_id', 'name', 'email'])
                ->find(Auth::id());

            if ($userId) {

                $receiver = User::select(['user_id', 'name', 'email'])
                    ->find($userId);

                if (!$receiver) {
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
                        Mail::to($receiver->email)
                            ->queue(new NotificationMail($message, $content ?? '', $type));
                    } catch (\Exception $e) {
                        Log::warning("Failed to send email to {$receiver->email}: {$e->getMessage()}");
                    }
                }

                $notificationIds[] = $notification->id;

                return response()->json([
                    'status' => 'success',
                    'message' => 'Tin nhắn đã được gửi thành công!',
                    'data' => [
                        'notification_ids' => $notificationIds,
                        'sent_at' => now()->toISOString(),
                        'sender' => [
                            'user_id' => $sender->user_id,
                            'name' => $sender->name
                        ],
                        'receiver' => [
                            'user_id' => $receiver->user_id,
                            'name' => $receiver->name
                        ]
                    ]
                ]);
            } else {

                $receivers = User::select(['user_id', 'name', 'email'])->get();
                $receiversList = [];

                foreach ($receivers as $receiver) {
                    $notification = Notification::create([
                        'user_id' => $receiver->user_id,
                        'message' => $message,
                        'content' => $content,
                        'type' => $type,
                        'is_read' => false,
                        'created_by' => Auth::id()
                    ]);

                    broadcast(new MyEvent($message, $receiver->user_id, $notification->id))->toOthers();

                    if ($type === 'High') {
                        try {
                            Mail::to($receiver->email)
                                ->queue(new NotificationMail($message, $content ?? '', $type));
                        } catch (\Exception $e) {
                            Log::warning("Failed to send email to {$receiver->email}: {$e->getMessage()}");
                        }
                    }

                    $notificationIds[] = $notification->id;
                    $receiversList[] = [
                        'user_id' => $receiver->user_id,
                        'name' => $receiver->name
                    ];
                }

                return response()->json([
                    'status' => 'success',
                    'message' => 'Tin nhắn đã được gửi đến tất cả người dùng!',
                    'data' => [
                        'notification_ids' => $notificationIds,
                        'sent_at' => now()->toISOString(),
                        'sender' => [
                            'user_id' => $sender->user_id,
                            'name' => $sender->name
                        ],
                        'receivers' => $receiversList
                    ]
                ]);
            }
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
                return response()->json([
                    'status' => 'error',
                    'message' => 'Đăng nhập để xem thông báo.',
                    'data' => null
                ], 401);
            }

            $userId = Auth::id();
            $perPage = $request->input('per_page', 8);
            $page = $request->input('page', 1);


            $notifications = Notification::where('notifications.user_id', $userId)
                ->join('users', 'notifications.created_by', '=', 'users.user_id')
                ->select(
                    'notifications.*',
                    'users.name as sender_name'
                )
                ->orderBy('notifications.created_at', 'desc')
                ->paginate($perPage, ['*'], 'page', $page);

            $formattedNotifications = collect($notifications->items())->map(function ($notification) {
                return [
                    'id' => $notification->id,
                    'message' => $notification->message,
                    'content' => $notification->content,
                    'type' => $notification->type,
                    'is_read' => $notification->is_read,
                    'created_at' => $notification->created_at,
                    'created_by' => $notification->created_by,
                    'sender_name' => $notification->sender_name
                ];
            });

            return response()->json([
                'status' => 'success',
                'message' => 'Thành công',
                'data' => [
                    'notifications' => $formattedNotifications,
                    'pagination' => [
                        'current_page' => $notifications->currentPage(),
                        'last_page' => $notifications->lastPage(),
                        'total' => $notifications->total(),
                        'per_page' => $notifications->perPage()
                    ]
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Có lỗi xảy ra khi lấy thông báo.',
                'debug' => config('app.debug') ? $e->getMessage() : null,
                'data' => null
            ], 500);
        }
    }

    public function getNotificationDetails($id)
    {
        try {
            if (!Auth::check()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Đăng nhập để xem thông báo.',
                    'data' => null
                ], 401);
            }

            $notification = Notification::with(['sender' => function ($query) {
                $query->select('user_id', 'name');
            }])->find($id);

            if (!$notification || $notification->user_id !== Auth::id()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Không tìm thấy thông báo hoặc bạn không có quyền truy cập.',
                    'data' => null
                ], 404);
            }

            $responseData = [
                'id' => $notification->id,
                'message' => $notification->message,
                'content' => $notification->content,
                'type' => $notification->type,
                'is_read' => $notification->is_read,
                'created_at' => $notification->created_at,
                'sender' => $notification->sender ? [
                    'user_id' => $notification->sender->user_id,
                    'name' => $notification->sender->name
                ] : null
            ];

            return response()->json([
                'status' => 'success',
                'message' => 'Thành công',
                'data' => $responseData
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Có lỗi xảy ra khi lấy chi tiết thông báo.',
                'debug' => config('app.debug') ? $e->getMessage() : null,
                'data' => null
            ], 500);
        }
    }

    public function deleteNotification($id)
    {
        try {
            if (!Auth::check()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Vui lòng đăng nhập để xóa thông báo.',
                    'data' => null
                ], 401);
            }

            $notification = Notification::find($id);

            if (!$notification) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Không tìm thấy thông báo.',
                    'data' => null
                ], 404);
            }

            if ($notification->user_id !== Auth::id()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Bạn không có quyền xóa thông báo này.',
                    'data' => null
                ], 403);
            }

            $notification->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Thông báo đã được xóa thành công.',
                'data' => null
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Có lỗi xảy ra khi xóa thông báo.',
                'debug' => config('app.debug') ? $e->getMessage() : null,
                'data' => null
            ], 500);
        }
    }
}
