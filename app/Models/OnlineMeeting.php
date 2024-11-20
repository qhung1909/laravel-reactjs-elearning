<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OnlineMeeting extends Model
{
    use HasFactory;
    protected $table = 'online_meetings';
    protected $primaryKey = 'meeting_id';
    protected $fillable = [
        'content_id',
        'course_id',
        'meeting_url',
        'start_time',
        'end_time',
    ];

    public function userCourses()
    {
        return $this->hasMany(UserCourse::class, 'course_id', 'course_id');
    }

    public function course()
    {
        return $this->belongsTo(Course::class, 'course_id');
    }

    public function content()
    {
        return $this->belongsTo(Content::class, 'content_id');
    }

}
