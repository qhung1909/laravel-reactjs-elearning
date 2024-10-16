<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuizAnsw extends Model
{
    use HasFactory;
    protected $fillable = ['user_id', 'question_id', 'answer', 'is_correct', 'created_at', 'updated_at'];

    public function question()
    {
        return $this->belongsTo(QuizQuestion::class, 'question_id');
    }
}
