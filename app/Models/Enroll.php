<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Enroll extends Model
{
    use HasFactory;
    protected $table = 'enrolls';
    protected $primaryKey = 'enroll_id'; 
    protected $fillable = [
        'course_id',
        'user_id',
        'created_at',
        'updated_at',
    ];
}
