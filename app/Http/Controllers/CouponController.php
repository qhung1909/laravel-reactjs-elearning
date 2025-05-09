<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Coupon;
use App\Models\Course;
use App\Models\OrderDetail;
use Illuminate\Http\Request;

class CouponController extends Controller
{
    public function index()
    {
        $coupons = Coupon::all();
        return response()->json($coupons);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name_coupon' => 'required|string|max:255|unique:coupons',
            'discount_price' => 'nullable|numeric',
            'percent_discount' => 'nullable|numeric',
            'max_discount' => 'nullable|numeric',
            'start_discount' => 'required|date',
            'end_discount' => 'required|date|after:start_discount',
        ]);

        $coupon = Coupon::create($validated);
        return response()->json($coupon, 201);
    }

    public function show($id)
    {
        $coupon = Coupon::findOrFail($id);
        return response()->json($coupon);
    }

    public function update(Request $request, $id)
    {
        $coupon = Coupon::findOrFail($id);

        $validated = $request->validate([
            'name_coupon' => 'sometimes|required|string|max:255|unique:coupons,name_coupon,' . $id,
            'discount_price' => 'nullable|numeric',
            'percent_discount' => 'nullable|numeric',
            'max_discount' => 'nullable|numeric',
            'start_discount' => 'required|date',
            'end_discount' => 'required|date|after:start_discount',
        ]);

        $coupon->update($validated);
        return response()->json($coupon);
    }

    public function destroy($id)
    {
        $coupon = Coupon::findOrFail($id);
        $coupon->delete();

        return response()->json(['message' => 'Coupon deleted successfully'], 204);
    }

    public function checkDiscount(Request $request)
    {
        $validated = $request->validate([
            'order_id' => 'required|integer|exists:orders,order_id',
            'name_coupon' => 'required|string|max:255',
        ]);

        $coupon = Coupon::where('name_coupon', $validated['name_coupon'])->first();

        if (!$coupon) {
            return response()->json(['message' => 'Coupon not found'], 404);
        }

        $currentDate = now();
        if ($coupon->end_discount < $currentDate) {
            return response()->json(['message' => 'Coupon has expired'], 400);
        }

        if ($coupon->start_discount > $currentDate) {
            return response()->json(['message' => 'Coupon is not valid yet'], 400);
        }

        $order = Order::find($validated['order_id']);

        $discountAmount = $coupon->discount_price;

        if ($discountAmount >= $order->total_price) {
            return response()->json(['message' => 'Discount exceeds total price'], 400);
        }

        $newTotalPrice = $order->total_price - $discountAmount;

        $order->total_price = $newTotalPrice;
        $order->coupon_id = $coupon->coupon_id;
        $order->updated_at = now();

        try {
            $order->save();
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error updating order: ' . $e->getMessage()], 500);
        }

        $orderDetails = OrderDetail::where('order_id', $order->order_id)->get();

        foreach ($orderDetails as $detail) {
            $originalPrice = $detail->price;
            $discountedPrice = $originalPrice - ($discountAmount / count($orderDetails));

            if ($discountedPrice < 0) {
                return response()->json(['message' => 'Discount exceeds detail price'], 400);
            }

            $detail->price = $discountedPrice;

            try {
                $detail->save();
            } catch (\Exception $e) {
                return response()->json(['message' => 'Error updating order detail: ' . $e->getMessage()], 500);
            }
        }

        return response()->json(['message' => 'Discount applied successfully', 'new_total_price' => $newTotalPrice]);
    }

    public function validateCoupon(Request $request)
    {
        $validated = $request->validate([
            'order_id' => 'required|integer|exists:orders,order_id',
            'name_coupon' => 'required|string|max:255',
        ]);
    
        $coupon = Coupon::whereRaw('BINARY name_coupon = ?', [$validated['name_coupon']])
            ->first();
    
        if (!$coupon) {
            return response()->json(['message' => 'Coupon not found'], 404);
        }
    
        $currentDate = now();
    
        if ($coupon->end_discount < $currentDate) {
            return response()->json(['message' => 'Coupon has expired'], 400);
        }
    
        if ($coupon->start_discount > $currentDate) {
            return response()->json(['message' => 'Coupon is not valid yet'], 400);
        }
    
        $order = Order::find($validated['order_id']);
    
        $discountAmount = $coupon->discount_price;
    
        if ($discountAmount >= $order->total_price) {
            return response()->json(['message' => 'Discount exceeds total price'], 400);
        }
    
        $newTotalPrice = $order->total_price - $discountAmount;
    
        return response()->json([
            'message' => 'Coupon is valid',
            'coupon_id' => $coupon->coupon_id,
            'discount_price' => $discountAmount,
            'new_total_price' => $newTotalPrice
        ]);
    }

    public function resetPrice(Request $request)
    {
        $validated = $request->validate([
            'order_id' => 'required|integer|exists:orders,order_id',
        ]);

        $order = Order::find($validated['order_id']);

        $orderDetails = OrderDetail::where('order_id', $order->order_id)->get();
        foreach ($orderDetails as $detail) {
            $course = Course::find($detail->course_id);
            $detail->price = $course->price;
            $detail->save();
        }

        $newTotalPrice = $orderDetails->sum('price');

        $order->total_price = $newTotalPrice;
        $order->coupon_id = null;
        $order->save();

        return response()->json(['message' => 'Reset price successfully']);
    }
}
