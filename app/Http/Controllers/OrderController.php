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

                $orders = Order::with([
                    'user:user_id,name,email',
                    'coupon:coupon_id,name_coupon,discount_price',
                    'orderDetails.course'
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

    public function getOrderHistory(Request $request)
    {
        try {
            $query = Order::with([
                'user:user_id,email',
                'orderDetails.course:course_id,title,user_id',
                'orderDetails.course.user:user_id,name'
            ]);

            $orders = $query->get();

            $formattedOrders = $orders->map(function ($order) {
                $orderDetail = $order->orderDetails->first();

                if (!$orderDetail) {
                    return null;
                }

                $course = $orderDetail->course;

                if (!$course) {
                    return null;
                }

                return [
                    'email' => $order->user ? $order->user->email : 'N/A',
                    'course_name' => $course->title ?? 'N/A',
                    'teacher_name' => $course->user ? $course->user->name : 'N/A',
                    'purchase_date' => date('d/m/Y', strtotime($order->created_at)),
                    'payment_method' => $order->payment_method ?? 'N/A',
                    'status' => $order->status ?? 'N/A',
                    'total_price' => number_format($order->total_price) . ' đ'
                ];
            })
                ->filter(function ($order) {
                    return $order['status'] === 'success';
                })
                ->values();

            return response()->json([
                'status' => true,
                'message' => 'Order history retrieved successfully',
                'data' => $formattedOrders
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Error retrieving order history',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
