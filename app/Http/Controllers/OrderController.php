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
                $orders = Order::query()
                    ->where('user_id', $user_id)
                    ->with(['user:user_id,name,email', 'coupon:coupon_id,name_coupon,discount_price'])
                    ->select('orders.*')
                    ->paginate(10);

                // Lấy thêm thông tin từ order_detail và courses
                $orders->getCollection()->transform(function ($order) {
                    $orderDetails = DB::table('order_detail')
                        ->join('courses', 'order_detail.course_id', '=', 'courses.course_id')  // Chỉnh sửa tên bảng ở đây
                        ->where('order_detail.order_id', $order->order_id)
                        ->select('order_detail.course_id', 'courses.title')  // Cũng thay đổi ở đây
                        ->get();

                    // Thêm vào thông tin chi tiết khóa học vào đơn hàng
                    $order->course_details = $orderDetails;

                    return $order;
                });

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
