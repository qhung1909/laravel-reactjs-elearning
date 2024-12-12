<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Faker\Factory as Faker;
use Illuminate\Support\Facades\DB;

class CommentSeeder extends Seeder
{
    public function run()
    {
        $faker = Faker::create();

        // Lấy tất cả các course_id có trong bảng courses (trừ 25)
        $course_ids = DB::table('courses')
                        ->whereBetween('course_id', [20, 32])
                        ->where('course_id', '!=', 25)
                        ->pluck('course_id')
                        ->toArray();

        // Tạo 500 comment tiếp theo
        for ($i = 1; $i <= 500; $i++) {
            // Random user_id bắt đầu từ 52
            $user_id = $faker->numberBetween(52, 100);  // Giả sử user_id từ 52 đến 100

            // Chọn một course_id hợp lệ từ danh sách đã lấy
            $course_id = $faker->randomElement($course_ids);

            // Random rating từ 4 đến 5
            $rating = $faker->numberBetween(4, 5);
            // Tạo content có tối đa 6 chữ
            $content = implode(' ', $faker->words(6)); // Tối đa 6 từ

            // Tạo ngày ngẫu nhiên trước ngày 12/12/2024
            $created_at = $faker->dateTimeBetween('-1 year', '2024-12-12')->format('Y-m-d H:i:s');
            $updated_at = $created_at;  // Giả sử updated_at giống created_at, có thể thay đổi nếu cần

            // Insert vào bảng comments
            DB::table('comments')->insert([
                'user_id' => $user_id,
                'course_id' => $course_id,
                'content' => $content,
                'rating' => $rating,
                'is_update' => 1,  // Hoặc giá trị mặc định cho trường này
                'created_at' => $created_at,
                'updated_at' => $updated_at,
            ]);
        }
    }
}