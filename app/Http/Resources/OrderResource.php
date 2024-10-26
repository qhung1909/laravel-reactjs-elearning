<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray($request)
    {
        return [
            'order_id' => $this->order_id,
            'total_price' => $this->total_price,
            'status' => $this->status,
            'user' => [
                'user_id' => $this->user->user_id,
                'name' => $this->user->name,
                'email' => $this->user->email,
            ],
            'coupon' => $this->when($this->coupon, [
                'coupon_id' => $this->coupon->coupon_id,
                'name' => $this->coupon->name_coupon,
                'discount_price' => $this->coupon->discount_price,
            ]),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
