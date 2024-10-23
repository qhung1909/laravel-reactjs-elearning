<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Quiz extends Model
{
    use HasFactory;
    protected $table = 'quizzes';
    protected $primaryKey = 'quiz_id';
    protected $fillable = [
        'course_id',
        'lesson_id',
        'title',
    ];
    public function questions()
    {
        return $this->hasMany(QuizQuestion::class);
    }
    public function course()
    {
        return $this->belongsTo(Course::class, 'course_id');    
    }

}
