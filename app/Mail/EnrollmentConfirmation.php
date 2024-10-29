<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class EnrollmentConfirmation extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $user;
    public $course;

    public function __construct($user, $course)
    {
        $this->user = $user;
        $this->course = $course;
    }

    public function build()
    {
        return $this->markdown('emails.enrollment-confirmation')
            ->subject('Xác nhận đăng ký khóa học ' . $this->course->name)
            ->with([
                'user' => $this->user,
                'course' => $this->course,
            ]);
    }
}
