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

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function course()
    {
        return $this->belongsTo(Course::class, 'course_id', 'course_id');
    }
    public function order()
    {
        return $this->belongsTo(Order::class, 'order_id', 'order_id');
    }
}
