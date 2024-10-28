<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;
use Illuminate\Support\Facades\DB;

class OrdersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $faker = Faker::create();
        $startDate = \Carbon\Carbon::createFromDate(2023, 1, 1);
        $endDate = \Carbon\Carbon::createFromDate(2024, 10, 31);

        for ($i = 110; $i < 610; $i++) { 
            DB::table('orders')->insert([
                'order_id' => $i,
                'user_id' => 1,
                'coupon_id' => null, 
                'total_price' => $faker->randomFloat(2, 1000000, 5000000), 
                'status' => 'success',
                'payment_method' => 'vnpay',
                'created_at' => $faker->dateTimeBetween($startDate, $endDate),
                'updated_at' => now(),
            ]);
        }
    }
}
