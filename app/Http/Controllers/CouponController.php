<?php

namespace App\Http\Controllers;

use App\Models\Coupon;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

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
            'name_coupon' => 'required|string|max:255',
        ]);
    
        $coupon = Coupon::where('name_coupon', $validated['name_coupon'])->first();
    
        if (!$coupon) {
            return response()->json(['message' => 'Coupon not found'], 404);
        }
    
        $currentDate = now();
        if ($coupon->start_discount > $currentDate || $coupon->end_discount < $currentDate) {
            return response()->json(['message' => 'Coupon is not valid'], 400);
        }
    
        return response()->json($coupon);
    }
}
