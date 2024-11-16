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
        'joined_at',
        'left_at'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function meeting()
    {
        return $this->belongsTo(OnlineMeeting::class, 'meeting_id');
    }
}
