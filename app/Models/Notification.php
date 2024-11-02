<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;
    protected $table = 'notifications';
    protected $primaryKey = 'id'; 
    protected $fillable = [
        'user_id',
        'message',
        'is_read',
        'content',
        'created_by',
        'type',
        'created_at',
        'updated_at',
    ];
    public function sender()
    {
        return $this->belongsTo(User::class, 'created_by', 'user_id');
    }
}
