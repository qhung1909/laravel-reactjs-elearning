<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Coupon extends Model
{
    use HasFactory;
    protected $table = 'coupons';
    protected $primaryKey = 'coupons_id'; 
    protected $fillable = [
        'name_coupon', 
        'discount_price',
        'percent_discount',
        'max_discount',
        'start_discount',
        'end_discount',
    ];

}
