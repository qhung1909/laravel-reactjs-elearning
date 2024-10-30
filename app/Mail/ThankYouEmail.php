<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\OrderDetail;
use App\Models\Course;

class ThankYouEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $order;
    public $products;

    public function __construct($order)
    {
        $this->order = $order;

        $this->products = OrderDetail::where('order_id', $order->order_id)
            ->where('status', 'success')
            ->with('course')
            ->get();
    }

    public function build()
    {
        return $this
            ->subject('Cảm ơn bạn đã mua hàng! 🎉')
            ->view('emails.thankyou'); 
    }
}
