<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = new User();
        $user->name = 'User 2';
        $user->email = 'user2@gmail.com'; 
        $user->password = Hash::make('123456'); 
        $user->google_id = null; 
        $user->avatar = null; 
        $user->status = 1; 
        $user->save();
    }
}
