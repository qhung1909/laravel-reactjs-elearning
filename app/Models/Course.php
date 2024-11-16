<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;

    protected $table = 'courses';
    protected $primaryKey = 'course_id';
    protected $fillable = [
        'course_category_id',
        'price',
        'status',
        'user_id',
        'price_discount',
        'description',
        'img',
        'title',
        'slug',
        'backup_launch_date',
        'launch_date',
        'reject_reason',
        'revision_reason'
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function enrolls()
    {
        return $this->hasMany(Enroll::class, 'course_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }
    public function userCourses()
    {
        return $this->hasMany(UserCourse::class, 'course_id', 'course_id'); 
    }
    public function comments()
    {
        return $this->hasMany(Comment::class, 'course_id'); 
    }

    public function averageRating()
    {
        return $this->comments()->avg('rating');
    }
    public function contents()
    {
        return $this->hasMany(Content::class, 'course_id', 'course_id');
    }
    
}
