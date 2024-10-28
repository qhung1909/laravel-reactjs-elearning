<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;
    public $timestamps = true;

    protected $table = 'categories';
    protected $primaryKey = 'course_category_id';
    protected $fillable = [
        'course_category_id',
        'description',
        'name',
        'title',
        'slug',
        'image'
    ];

    public function courses()
    {
        return $this->hasMany(Course::class, 'course_category_id');
    }
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
