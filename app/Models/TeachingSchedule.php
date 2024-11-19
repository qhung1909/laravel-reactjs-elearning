<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TeachingSchedule extends Model
{
    use HasFactory;
    protected $table = 'teaching_schedule';
    protected $primaryKey = 'id';
    protected $fillable = [
        'meeting_id',
        'user_id',
        'proposed_start',
        'notes',
    ];
}
