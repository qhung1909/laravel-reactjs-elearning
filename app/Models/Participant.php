<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Participant extends Model
{
    use HasFactory;
    protected $table = 'meeting_participants';
    protected $primaryKey = 'participant_id'; 
    protected $fillable = [
        'meeting_id',
        'user_id',
        'is_present',
        'attendance_date',
    ];

}
