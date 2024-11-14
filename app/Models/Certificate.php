<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Certificate extends Model
{
    use HasFactory;
    protected $table = 'certificates';
    protected $primaryKey = 'certificate_id';
    protected $fillable = [
        'user_id',
        'course_id',
        'issue_at',
        'created_at',
        'updated_at',
    ];

}
