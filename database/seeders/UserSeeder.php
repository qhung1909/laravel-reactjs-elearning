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
        $User = new User();
        $User->name = 'User 1';
        $User->email = 'User@gmail.com';
        $User->password = hash::make('123456');
        $User->save();
    }
}
