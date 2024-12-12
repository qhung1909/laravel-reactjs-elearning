<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Faker\Factory as Faker;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class UserSeeder extends Seeder
{
    public function run()
    {
        $faker = Faker::create();

        // Chạy vòng lặp để tạo 200 users
        for ($i = 1; $i <= 200; $i++) {
            // Tạo role teacher và user chia đều
            $role = $i <= 100 ? 'teacher' : 'user';

            // Tạo email với đuôi @gmail.com
            $email = $faker->unique()->userName . '@gmail.com';

            // Tạo password hash
            $password = Hash::make('password');  // Hoặc bất kỳ password nào bạn muốn hash

            // Chọn thời gian email_verified_at trước ngày 12/12/2024
            $emailVerifiedAt = $faker->dateTimeBetween('-1 years', '2024-12-11')->format('Y-m-d H:i:s');

            // Tạo user
            DB::table('users')->insert([
                'email' => $email,
                'name' => $faker->name,
                'password' => $password,
                'google_id' => null,
                'role' => $role,
                'avatar' => 'https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/icons/New+folder/avatar-default-svgrepo-com.svg',
                'status' => '1',  // Hoặc trạng thái khác nếu cần
                'locked_until' => null,
                'failed_attempts' => 0,
                'verification_token' => null,
                'email_verified_at' => $emailVerifiedAt,
            ]);
        }
    }
}