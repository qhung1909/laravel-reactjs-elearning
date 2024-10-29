<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Mail\CartReminderMail; // Lớp email sẽ định nghĩa ở bước sau
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Mail;

class SendCartReminderEmails extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'email:cart-reminder';
    protected $description = 'Gửi email nhắc nhở người dùng về đơn hàng chưa thanh toán sau 2 ngày';

    /**
     * The console command description.
     *
     * @var string
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $orders = DB::table('orders')
            ->where('status', 'pending')
            ->where('created_at', '<=', Carbon::now()->subMinutes(3))
            ->get();

        foreach ($orders as $order) {
            $user = User::find($order->user_id);

            if ($user) {
                Mail::to($user->email)->send(new CartReminderMail($user, $order));

                $this->info('Email đã gửi đến ' . $user->email . ' về đơn hàng #' . $order->order_id);
            }
        }
    }
}
