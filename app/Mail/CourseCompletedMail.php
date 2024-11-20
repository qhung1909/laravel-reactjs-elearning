<?php

namespace App\Mail;

use App\Models\User;
use App\Models\Course;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class CourseCompletedMail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $course;

    public function __construct(User $user, Course $course)
    {
        $this->user = $user;
        $this->course = $course;
    }

    public function build()
    {
        return $this->view('emails.course-completed')
                    ->subject('Chúc mừng hoàn thành khóa học!')
                    ->with([
                        'user' => $this->user,
                        'course' => $this->course
                    ]);
    }
}