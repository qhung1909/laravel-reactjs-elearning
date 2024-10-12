<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use App\Models\UserCourse;

class CartController extends Controller
{
    public function vnpay_payment(Request $request)
    {
        $user = auth()->user();

        if (!$user) {
            return response()->json(['code' => '99', 'message' => 'Bạn cần đăng nhập để thực hiện thanh toán.'], 401);
        }

        $vnp_Url = config('vnpay.vnp_Url');
        $vnp_Returnurl = config('vnpay.vnp_ReturnUrl');
        $vnp_TmnCode = config('vnpay.vnp_TmnCode');
        $vnp_HashSecret = config('vnpay.vnp_HashSecret');
        $vnp_TxnRef = $request->input('vnp_Txnref');
        $vnp_OrderInfo = $request->input('vnp_OrderInfo');
        $vnp_OrderType = $request->input('vnp_OrderType');
        $vnp_Amount = $request->input('vnp_Amount') * 100;
        $vnp_Locale = 'vn';
        $vnp_IpAddr = $_SERVER['REMOTE_ADDR'];
        $inputData = array(
            "vnp_Version" => "2.1.0",
            "vnp_TmnCode" => $vnp_TmnCode,
            "vnp_Amount" => $vnp_Amount,
            "vnp_Command" => "pay",
            "vnp_CreateDate" => date('YmdHis'),
            "vnp_CurrCode" => "VND",
            "vnp_IpAddr" => $vnp_IpAddr,
            "vnp_Locale" => $vnp_Locale,
            "vnp_OrderInfo" => $vnp_OrderInfo,
            "vnp_OrderType" => $vnp_OrderType,
            "vnp_ReturnUrl" => $vnp_Returnurl,
            "vnp_TxnRef" => $vnp_TxnRef,
        );

        if (isset($vnp_BankCode) && $vnp_BankCode != "") {
            $inputData['vnp_BankCode'] = $vnp_BankCode;
        }
        if (isset($vnp_Bill_State) && $vnp_Bill_State != "") {
            $inputData['vnp_Bill_State'] = $vnp_Bill_State;
        }

        ksort($inputData);
        $query = "";
        $i = 0;
        $hashdata = "";
        foreach ($inputData as $key => $value) {
            if ($i == 1) {
                $hashdata .= '&' . urlencode($key) . "=" . urlencode($value);
            } else {
                $hashdata .= urlencode($key) . "=" . urlencode($value);
                $i = 1;
            }
            $query .= urlencode($key) . "=" . urlencode($value) . '&';
        }

        $vnp_Url = $vnp_Url . "?" . $query;
        if (isset($vnp_HashSecret)) {
            Log::info('Giá trị hashdata: ', ['hashdata' => $hashdata]);
            Log::info('Giá trị vnp_HashSecret: ', ['vnp_HashSecret' => $vnp_HashSecret]);

            $vnpSecureHash = hash_hmac('sha512', $hashdata, $vnp_HashSecret);

            Log::info('Giá trị vnp_SecureHash: ', ['vnpSecureHash' => $vnpSecureHash]);

            $vnp_Url .= 'vnp_SecureHash=' . $vnpSecureHash;
        }
        $returnData = array(
            'code' => '00',
            'message' => 'success',
            'data' => $vnp_Url
        );
        if (isset($_POST['redirect'])) {
            header('Location: ' . $vnp_Url);
            die();
        } else {
            echo json_encode($returnData);
        }
    }

    public function vnpay_callback(Request $request)
    {
        Log::info('VNPay Callback Triggered');

        $vnp_TmnCode = config('vnpay.vnp_TmnCode');
        $vnp_HashSecret = config('vnpay.vnp_HashSecret');

        $inputData = [];
        $returnData = [];
        foreach ($request->query() as $key => $value) {
            if (substr($key, 0, 4) == "vnp_") {
                $inputData[$key] = $value;
            }
        }

        $vnp_SecureHash = $inputData['vnp_SecureHash'] ?? null;
        unset($inputData['vnp_SecureHash']);
        Log::info('Input Data: ' . json_encode($inputData));

        ksort($inputData);
        $hashData = http_build_query($inputData);
        $secureHash = hash_hmac('sha512', $hashData, $vnp_HashSecret);

        Log::info('Secure Hash: ' . $secureHash);
        Log::info('VNP Secure Hash: ' . $vnp_SecureHash);

        $vnpTranId = $inputData['vnp_TransactionNo'] ?? null;
        $vnp_BankCode = $inputData['vnp_BankCode'] ?? null;
        $vnp_Amount = $inputData['vnp_Amount'] / 100;

        Log::info('Transaction ID: ' . $vnpTranId);
        Log::info('Bank Code: ' . $vnp_BankCode);
        Log::info('Amount: ' . $vnp_Amount);

        $orderId = $inputData['vnp_TxnRef'];
        $order = Order::where('order_id', $orderId)->first();
        Log::info('Order ID: ' . $orderId);

        if ($secureHash === $vnp_SecureHash && $order) {
            Log::info('Signature matched and Order found: ' . json_encode($order));

            if ($order->total_price == $vnp_Amount) {
                if ($inputData['vnp_ResponseCode'] == '00' && $inputData['vnp_TransactionStatus'] == '00') {
                    Log::info('Transaction Success');

                    $orderDetails = OrderDetail::where('order_id', $order->order_id)->get();
                    if ($orderDetails->isNotEmpty()) {
                        foreach ($orderDetails as $detail) {
                            UserCourse::firstOrCreate([
                                'user_id' => $order->user_id,
                                'course_id' => $detail->course_id,
                                'order_id' => $orderId,
                            ], [
                                'created_at' => now(),
                            ]);
                            Log::info('UserCourse created or found with Course ID: ' . $detail->course_id);
                        }

                        $order->status = 'success';
                        $order->save();
                        OrderDetail::where('order_id', $order->order_id)->delete();
                        Log::info('Order status updated to success');
                    }
                } else {
                    Log::info('Transaction failed');
                    $order->status = 'failed';
                    $order->save();
                    Log::info('Order status updated to failed');
                }
                $returnData = ['RspCode' => '00', 'Message' => 'Confirm Success'];
            } else {
                Log::info('Invalid amount: Expected ' . $order->total_price . ', Got ' . $vnp_Amount);
                $returnData = ['RspCode' => '97', 'Message' => 'Invalid amount'];
            }
        } else {
            Log::info('Signature mismatch or Order not found');
            $returnData = ['RspCode' => '97', 'Message' => 'Invalid signature or order not found'];
        }

        Log::info('Return Data: ' . json_encode($returnData));
        return response()->json($returnData);
    }


    public function getCart()
    {
        if (!Auth::check()) {
            return response()->json([
                'message' => 'Người dùng chưa đăng nhập.',
            ], 401);
        }

        $user_id = Auth::id();
        $orders = Order::with('orderDetails')->where('user_id', $user_id)->get();

        if ($orders->isEmpty()) {
            return response()->json([
                'message' => 'Không có đơn hàng nào.',
            ], 404);
        }


        return response()->json($orders, 200);
    }


    public function addToCart(Request $request)
    {
        if (!Auth::check()) {
            return response()->json([
                'message' => 'Người dùng chưa đăng nhập.',
            ], 401);
        }

        $user_id = Auth::id();

        try {
            $request->validate([
                'coupon_id' => 'nullable|exists:coupons,id',
                'items' => 'required|array',
                'items.*.course_id' => 'required|exists:courses,course_id',
                'items.*.price' => 'required|numeric'
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['message' => 'Dữ liệu không hợp lệ.', 'errors' => $e->errors()], 422);
        }

        $order = Order::create([
            'user_id' => $user_id,
            'coupon_id' => $request->coupon_id,
            'total_price' => 0,
            'status' => 'pending', 
            'created_at' => now(), 
            'updated_at' => now(), 
        ]);

        foreach ($request->items as $item) {
            $existingItem = OrderDetail::where('order_id', $order->order_id)
                ->where('course_id', $item['course_id'])
                ->first();

            if ($existingItem) {
                return response()->json([
                    'message' => 'Khóa học này đã có trong giỏ hàng.',
                ], 409);
            }

            OrderDetail::create([
                'order_id' => $order->order_id,
                'course_id' => $item['course_id'],
                'price' => $item['price'],
            ]);

            $order->total_price += $item['price'];
        }

        $order->update(['total_price' => $order->total_price]);

        return response()->json([
            'message' => 'Đơn hàng đã được thêm vào giỏ hàng thành công!',
            'order' => $order,
        ], 201);
    }




    public function removeItem(Request $request)
    {
        if (!Auth::check()) {
            return response()->json([
                'message' => 'Người dùng chưa đăng nhập.',
            ], 401);
        }

        $user_id = Auth::id();

        try {
            $request->validate([
                'order_id' => 'required|exists:orders,order_id,user_id,' . $user_id,
                'course_id' => 'required|exists:courses,course_id',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['message' => 'Dữ liệu không hợp lệ.', 'errors' => $e->errors()], 422);
        }

        $order = Order::find($request->order_id);

        if (!$order) {
            return response()->json(['message' => 'Đơn hàng không tồn tại.'], 404);
        }

        $orderDetail = OrderDetail::where('order_id', $order->order_id)
            ->where('course_id', $request->course_id)
            ->first();

        if (!$orderDetail) {
            return response()->json(['message' => 'Món hàng không tồn tại trong đơn hàng.'], 404);
        }

        $orderDetail->delete();

        $order->total_price -= $orderDetail->price;
        $order->save();

        if (OrderDetail::where('order_id', $order->order_id)->count() === 0) {
            $order->delete();
        }

        return response()->json([
            'message' => 'Món hàng đã được xóa khỏi giỏ hàng thành công!',
            'order' => $order,
        ], 200);
    }
}
