<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Progress extends Model
{
    use HasFactory;
    protected $table = 'progress';
    protected $primaryKey = 'progress_id';
    protected $fillable = [
        'user_id',
        'course_id',
        'content_id',
        'is_complete',
        'title_content_id',
        'complete_at',
        'progress_percent',
        'complete_update',
        'reject_reason',
        'revision_reason',
        'is_video_complete',
    ];
}
