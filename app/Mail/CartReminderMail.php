<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class CartReminderMail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $order;
    public $courses;

    public function __construct($user, $order, $courses)
    {
        $this->user = $user;
        $this->order = $order;
        $this->courses = $courses;
    }

    public function build()
    {
        return $this->subject('Nhắc nhở: Đơn hàng chưa thanh toán #' . $this->order->order_id)
                    ->view('emails.cart-reminder');
    }
}