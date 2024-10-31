<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class NotificationMail extends Mailable
{
    use Queueable, SerializesModels;

    public $messageTitle;
    public $messageContent;
    public $type;

    public function __construct(string $message, string $content, string $type)
    {

        Log::info('Creating NotificationMail', [
            'messageTitle' => $message,
            'messageContent' => $content,
            'type' => $type,
            'messageTitleType' => gettype($message),
            'messageContentType' => gettype($content),
            'typeType' => gettype($type),
        ]);

        $this->messageTitle = $message;
        $this->messageContent = $content;
        $this->type = $type;
    }

    public function build()
    {
        return $this->subject($this->messageTitle)
            ->view('emails.notification')
            ->with([
                'messageTitle' => $this->messageTitle,
                'content' => $this->messageContent,
                'type' => $this->type,
            ]);
    }
    
}
