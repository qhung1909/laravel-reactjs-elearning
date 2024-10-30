<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\InteractsWithSockets;

class MyEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $message;
    public $userId;

    public function __construct($message, $userId = null)
    {
        $this->message = $message;
        $this->userId = $userId; 
    }

    public function broadcastOn()
    {
        $channels = [];

        if ($this->userId) {
            $channels[] = new PrivateChannel('user-' . $this->userId);
        }

        $channels[] = new Channel('my-channel');

        return $channels;
    }

    public function broadcastAs()
    {
        return 'notification'; 
    }
}