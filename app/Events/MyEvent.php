<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MyEvent implements ShouldBroadcast
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
        return new PrivateChannel('user.' . $this->userId);
    }

    public function broadcastAs()
    {
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