<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lesson extends Model
{

    use HasFactory;
    protected $table = 'lessons';
    protected $primaryKey = 'lesson_id';
    protected $fillable = [
        'course_id',
        'name',
        'slug',
        'description',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
}
