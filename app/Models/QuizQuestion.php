<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuizQuestion extends Model
{
    use HasFactory;

    protected $table = 'quizzes_questions';
    protected $primaryKey = 'question_id';
    protected $fillable = ['quiz_id', 'question','question_type', 'created_at', 'updated_at'];

    public function quiz()
    {
        return $this->belongsTo(Quiz::class);
    }
    public function answers()
    {
        return $this->hasMany(QuizOption::class, 'question_id');
    }

    
}
