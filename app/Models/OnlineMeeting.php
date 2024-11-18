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
}
