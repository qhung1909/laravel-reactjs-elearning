<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;
    protected $table = 'categories';
    protected $primaryKey = 'course_category_id'; 
    protected $fillable = [
        'course_category_id', 
        'description',
        'name',
        'title',
        'slug',
    ];
}
