<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class FirstLectureNotification extends Mailable
{
    use Queueable, SerializesModels;

    public $instructor;
    public $course;
    public $startTime;
    public $endTime;

    public function __construct($instructor, $course, $startTime, $endTime)
    {
        $this->instructor = $instructor;
        $this->course = $course;
        $this->startTime = $startTime;
        $this->endTime = $endTime;
    }

    public function build()
    {
        return $this->subject('Thông báo lịch dạy khóa học ' . $this->course->title)
                    ->view('emails.first-lecture-notification')
                    ->with([
                        'instructor' => $this->instructor,
                        'course' => $this->course,
                        'startTime' => $this->startTime,
                        'endTime' => $this->endTime
                    ]);
    }
}
