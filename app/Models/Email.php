<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Email extends Model
{
    use HasFactory;
    protected $table = 'emails';
    protected $primaryKey = 'email_id';
    protected $fillable = [
        'subject',
        'name_email',
        'body',
        'is_sent',
        'sent_at',
        'sent_count',
        'failed_count',
        'last_sent_at',
        'scheduled_time',
        'created_at	',
        'updated_at',
    ];
}
