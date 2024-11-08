<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuizOption extends Model
{
    use HasFactory;
    protected $table = 'quiz_options';
    protected $primaryKey = 'option_id';

    protected $fillable = ['question_id', 'answer', 'is_correct', 'created_at', 'updated_at'];

    public function question()
    {
        return $this->belongsTo(QuizQuestion::class, 'question_id');
    }

    
}
