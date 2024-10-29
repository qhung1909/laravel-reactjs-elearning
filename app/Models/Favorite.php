<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Favorite extends Model
{
    use HasFactory;
    protected $table = 'favorites';
    protected $primaryKey = 'favorite_id'; 
    protected $fillable = [
        'course_id',
        'user_id',
        'created_at',
        'updated_at',
    ];
}
