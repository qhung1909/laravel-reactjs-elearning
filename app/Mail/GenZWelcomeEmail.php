<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\User; // Đảm bảo rằng model User được import

class GenZWelcomeEmail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * @var User  Đảm bảo chú thích kiểu dữ liệu ở đây
     */
    public $user;

    /**
     * Create a new message instance.
     */
    public function __construct(User $user) 
    {
        $this->user = $user;
    }

    public function build()
    {
        return $this->subject('Chào mừng đến với team Antlearn của chúng tôi 🌈✨')
                    ->view('emails.welcomee');
    }
}
