<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;

    protected $table = 'courses';
    protected $primaryKey = 'course_id';
    protected $fillable = [
        'course_category_id',
        'price',
        'price_discount',
        'description',
        'img',
        'title',
        'slug',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function enrolls()
    {
        return $this->hasMany(Enroll::class, 'course_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    
}
