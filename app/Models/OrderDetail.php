<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderDetail extends Model
{
    use HasFactory;
    protected $table = 'order_detail';
    protected $primaryKey = 'order_detail_id';
    protected $fillable = [
        'order_id',
        'course_id',
        'status',
        'price',
    ];


    public function order()
    {
        return $this->belongsTo(Order::class, 'order_id', 'id');
    }
    public function course()
    {
        return $this->belongsTo(Course::class, 'course_id', 'course_id');
    }
}
