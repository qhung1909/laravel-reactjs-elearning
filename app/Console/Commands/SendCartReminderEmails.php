<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Mail\CartReminderMail;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Mail;

class SendCartReminderEmails extends Command
{
    protected $signature = 'email:cart_reminder';
    protected $description = 'Gửi email nhắc nhở người dùng về đơn hàng chưa thanh toán sau 2 ngày';

    public function __construct()
    {
        parent::__construct();
    }

    public function handle()
    {
        $orders = DB::table('orders')
            ->join('order_detail', 'orders.order_id', '=', 'order_detail.order_id')
            ->join('courses', 'order_detail.course_id', '=', 'courses.course_id')
            ->where('orders.status', 'pending')
            ->where('orders.created_at', '<=', Carbon::now()->subMinutes(3))
            ->select('orders.*', 
                    DB::raw('GROUP_CONCAT(courses.title) as course_names'),
                    DB::raw('GROUP_CONCAT(order_detail.price) as course_prices'),
                    DB::raw('GROUP_CONCAT(courses.course_id) as course_ids'),
                    DB::raw('GROUP_CONCAT(courses.img) as course_images'))
            ->groupBy('orders.order_id')
            ->get();

        foreach ($orders as $order) {
            $user = User::find($order->user_id);

            if ($user) {
                $courseNames = explode(',', $order->course_names);
                $coursePrices = explode(',', $order->course_prices);
                $courseIds = explode(',', $order->course_ids);
                $courseImages = explode(',', $order->course_images);
                
                $courses = [];
                for ($i = 0; $i < count($courseNames); $i++) {
                    $courses[] = [
                        'id' => $courseIds[$i] ?? '',
                        'name' => $courseNames[$i] ?? '',
                        'price' => $coursePrices[$i] ?? 0,
                        'image' => $courseImages[$i] ?? '',
                    ];
                }

                Mail::to($user->email)->send(new CartReminderMail($user, $order, $courses));

                $this->info('Email đã gửi đến ' . $user->email . ' về đơn hàng #' . $order->order_id);
            }
        }
    }
}