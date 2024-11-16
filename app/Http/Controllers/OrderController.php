<?php

namespace App\Http\Controllers;

use App\Models\Order;

use Illuminate\Http\Request;
use App\Http\Resources\OrderResource;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index()
    {
        try {
            return DB::transaction(function () {
                $orders = Order::query()
                    ->with(['user:user_id,name,email', 'coupon:coupon_id,name_coupon,discount_price'])
                    ->select('orders.*')
                    ->paginate(10);

                return OrderResource::collection($orders);
            });
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error fetching orders',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getAllOrdersByUserId($user_id)
    {
        try {
            return DB::transaction(function () use ($user_id) {
                // Eager load user, coupon và courses
                $orders = Order::with([
                    'user:user_id,name,email',
                    'coupon:coupon_id,name_coupon,discount_price',
                    'orderDetails.course'  // Đảm bảo eager load mối quan hệ với courses qua orderDetails
                ])
                    ->where('user_id', $user_id)
                    ->select('orders.*')
                    ->paginate(10);

                return OrderResource::collection($orders);
            });
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error fetching orders',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    public function show($user_id, $order_id)
    {
        try {
            return DB::transaction(function () use ($user_id, $order_id) {
                $order = Order::query()
                    ->where('user_id', $user_id)
                    ->where('order_id', $order_id)
                    ->with(['user:user_id,name,email', 'coupon:coupon_id,name_coupon,discount_price'])
                    ->first();

                if (!$order) {
                    return response()->json(['message' => 'Order not found'], 404);
                }

                return new OrderResource($order);
            });
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error fetching order',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
