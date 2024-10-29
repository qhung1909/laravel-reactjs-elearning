<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\User;

class CartReminderMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public $user;
    public $order;

    public function __construct(User $user, $order)
    {
        $this->user = $user;
        $this->order = $order;
    }

    /**
     * Get the message envelope.
     */
    public function build()
    {
        $data = [
            'user' => $this->user,
            'order_id' => $this->order->order_id
        ];

        return $this->subject('Nhắc nhở thanh toán đơn hàng')
                    ->view('emails.cart_reminder', $data); 
    }
}
