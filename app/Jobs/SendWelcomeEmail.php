<?php

namespace App\Jobs;

use App\Mail\WelcomeMail;
use Illuminate\Bus\Queueable;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Mail;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

class SendWelcomeEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;


    protected $user;

    /**
     * Create a new job instance.
     */
    public function __construct($user)
    {
        $this->user = $user;
    }

    public function handle()
    {
        $verificationUrl = URL::temporarySignedRoute(
            'verify.email',
            now()->addMinutes(30),
            ['token' => $this->user->verification_token]
        );

        Mail::to($this->user->email)->send(new WelcomeMail($this->user, $verificationUrl));
    }
}
