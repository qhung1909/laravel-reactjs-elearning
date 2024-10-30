<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Models\Email;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Exception;

class SendMassEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $email;
    protected $users;
    public $tries = 3; 
    public $timeout = 120;

    public function __construct(Email $email, Collection $users)
    {
        $this->email = $email;
        $this->users = $users;
    }

    public function handle()
    {
        foreach ($this->users as $user) {
            try {
                Mail::send('emails.' . $this->email->name_email, 
                    ['email' => $this->email, 'user' => $user], 
                    function ($message) use ($user) {
                        $message->to($user->email)
                                ->subject($this->email->subject);
                    }
                );

                $this->email->increment('sent_count');
                $this->email->update(['last_sent_at' => now()]);

            } catch (Exception $e) {
                Log::error('Failed to send email to ' . $user->email . ': ' . $e->getMessage());
                $this->email->increment('failed_count');
                
                throw $e;
            }
        }
    }

    public function failed(Exception $exception)
    {
        Log::error('Mass email job failed: ' . $exception->getMessage());
    }
}