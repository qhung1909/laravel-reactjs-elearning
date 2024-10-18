<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuizSession extends Model
{
    use HasFactory;

    protected $table = 'quiz_sessions';
    protected $primaryKey = 'quiz_session_id';
    protected $fillable = ['user_id', 'quiz_id', 'token', 'score', 'status', 'created_at', 'updated_at'];

    public function quiz()
    {
        return $this->belongsTo(Quiz::class, 'quiz_id');
    }

    public function questions()
    {
        return $this->quiz()->with('questions');
    }

}
