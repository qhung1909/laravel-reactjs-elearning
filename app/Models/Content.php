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
        'status',
        'created_at',
        'updated_at',
        'is_online_meeting'
        
    ];
    public function course()
    {
        return $this->belongsTo(Course::class, 'course_id');
    }

    public function titleContents()
    {
        return $this->hasMany(TitleContent::class, 'content_id', 'content_id');
    }
    
}
