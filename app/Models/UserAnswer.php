<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserAnswer extends Model
{
    use HasFactory;
    
    protected $table = 'user_answers';
    protected $primaryKey = 'user_answer_id';
    protected $fillable = ['user_id', 'question_id','quiz_session_id' ,'option_id','is_correct', 'updated_at'];


}
