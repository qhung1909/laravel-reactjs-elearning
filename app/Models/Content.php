<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Content extends Model
{
    use HasFactory;
    protected $table = 'contents';
    protected $primaryKey = 'content_id';
    protected $fillable = [
        'course_id',
        'name_content',
        'created_at',
        'updated_at'
    ];
    public function courses()
    {
        return $this->belongsTo(Course::class, 'course_id');
    }
}
