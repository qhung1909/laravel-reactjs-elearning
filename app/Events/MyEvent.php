<?php

namespace App\Events;

use Illuminate\Support\Facades\Log;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;

class MyEvent implements ShouldBroadcastNow  
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $message;
    public $userId;
    public $notificationId;

    public function __construct($message, $userId, $notificationId)
    {
        $this->message = $message;
        $this->userId = $userId;
        $this->notificationId = $notificationId;
    }

    public function broadcastOn()
    {
        Log::info('Broadcasting to channel', [
            'channel' => 'private-user.' . $this->userId,
            'data' => [
                'message' => $this->message,
                'userId' => $this->userId,
                'notificationId' => $this->notificationId
            ]
        ]);
        return new PrivateChannel('user.' . $this->userId);
    }
    public function broadcastAs()
    {
        Log::info('broadcastAs called', ['name' => 'notification']);
        return 'notification';
    }

    public function broadcastWith()
    {
        return [
            'message' => $this->message,
            'userId' => $this->userId,
            'notificationId' => $this->notificationId,
            'timestamp' => now()->toIso8601String()
        ];
    }
}
