<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class CourseStatusNotification extends Mailable
{
    use Queueable, SerializesModels;

    public $course;
    public $reason;
    public $type; 

    public function __construct($course, $reason, $type)
    {
        $this->course = $course;
        $this->reason = $reason;
        $this->type = $type;
    }

    public function build()
    {
        $subject = $this->type === 'rejected' 
            ? 'Khóa học của bạn đã bị từ chối' 
            : 'Yêu cầu chỉnh sửa khóa học';

        return $this->subject($subject)
                   ->view('emails.course-status')
                   ->with([
                       'course' => $this->course,
                       'reason' => $this->reason,
                       'type' => $this->type
                   ]);
    }
}