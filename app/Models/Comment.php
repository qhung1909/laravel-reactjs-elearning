<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    use HasFactory;
    protected $table = 'comments';
    protected $primaryKey = 'comment_id'; 
    protected $fillable = [
        'user_id', 
        'course_id',
        'content',
        'rating',
        'is_update',
    ];
}
