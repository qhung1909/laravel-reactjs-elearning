<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ResetPasswordMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public $link;

    public function __construct($link)
    {
        $this->link = $link;
    }


    public function build()
    {
        return $this->subject('Đặt lại mật khẩu')
                    ->view('emails.reset_password')
                    ->with(['link' => $this->link]);
    }
}
