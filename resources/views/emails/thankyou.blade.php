<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cảm ơn bạn!</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f9f9f9;
            padding: 20px;
            margin: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
        .logo {
            display: block;
            margin: 0 auto 20px; 
            width: 150px; 
            height: auto;
        }
        h1 {
            color: #FFD700; 
            text-align: center;
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        p {
            color: #333;
            font-size: 1.1em;
            line-height: 1.5;
            text-align: center;
        }
        .product {
            border-top: 1px solid #ddd;
            padding-top: 15px;
            margin-top: 15px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .product img {
            width: 80px;
            height: auto;
            border-radius: 8px;
            margin-right: 15px;
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 0.9em;
            color: #666;
        }
        .cta {
            display: inline-block;
            margin-top: 15px;
            padding: 12px 25px;
            background-color: #FFD700;
            color: #000;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            transition: background-color 0.3s;
        }
        .cta:hover {
            background-color: #ffcc00; 
        }
    </style>
</head>
<body>
    <div class="container">
        <img src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/uploads/antlearn.jpg" alt="Logo" class="logo">
        <h1>Cảm ơn bạn, {{ $order->user->name }}!</h1>
        <p>🎉 Chúng mình rất vui vì bạn đã chọn AntLearn để bắt đầu hành trình học tập của mình!</p>
        <p>🔥 Đơn hàng của bạn (ID: {{ $order->order_id }}) đã được xác nhận và thanh toán thành công!</p>
        <p>Nhìn này, dưới đây là những sản phẩm siêu chất mà bạn đã mua:</p>

        @foreach ($products as $product)
            <div class="product">
                <img src="{{ $product->course->img }}" alt="{{ $product->course->title }}">
                <div>
                    <strong style="color: #FFD700;">{{ $product->course->title }}</strong><br>
                    <span>Giá: {{ $product->price }} VND</span>
                </div>
            </div>
        @endforeach

        <p>Nếu bạn có bất kỳ câu hỏi nào, hãy nhắn cho tụi mình nhé!</p>
        <a href="mailto:support@example.com" class="cta">Liên Hệ Ngay</a>
        
        <div class="footer">
            <p>Cảm ơn bạn đã lựa chọn AntLearn! 💖</p>
            <p>&copy; {{ date('Y') }} AntLearn. Tất cả các quyền được bảo lưu.</p>
        </div>
    </div>
</body>
</html>
