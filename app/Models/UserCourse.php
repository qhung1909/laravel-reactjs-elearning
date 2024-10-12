<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserCourse extends Model
{
    use HasFactory;
    protected $table = 'user_courses';
    protected $primaryKey = 'user_course_id'; 
    protected $fillable = [
        'user_id', 
        'course_id',
        'order_id',
    ];
}
