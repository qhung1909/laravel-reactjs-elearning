<!DOCTYPE html>
<html lang="vi">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nhắc nhở thanh toán</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
        }

        .container {
            max-width: 600px;
            margin: 20px auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }

        .header {
            background: #2563eb;
            color: white;
            padding: 20px;
            text-align: center;
        }

        .header h2 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
        }

        .content {
            padding: 30px;
        }

        .content h1 {
            color: #1e40af;
            font-size: 20px;
            margin-top: 0;
        }

        .course-list {
            margin: 20px 0;
        }

        .course-item {
            display: flex;
            align-items: center;
            padding: 15px;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            margin-bottom: 15px;
            background: #fff;
        }

        .course-image {
            width: 120px;
            height: 80px;
            border-radius: 4px;
            overflow: hidden;
            margin-right: 15px;
            flex-shrink: 0;
        }

        .course-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .course-info {
            flex-grow: 1;
        }

        .course-name {
            font-weight: 600;
            color: #1e40af;
            margin-bottom: 5px;
            font-size: 16px;
        }

        .course-price {
            font-weight: bold;
            color: #dc2626;
        }

        .total-price {
            text-align: right;
            font-weight: bold;
            font-size: 18px;
            color: #1e40af;
            margin: 20px 0;
            padding: 15px;
            background: #f8fafc;
            border-radius: 6px;
        }

        .cta-button {
            display: inline-block;
            background: #2563eb;
            color: #ffffff;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
            font-weight: 600;
            font-size: 16px;
        }

        .support-info {
            background: #f8fafc;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
        }

        .footer {
            background: #f8fafc;
            padding: 20px;
            text-align: center;
            color: #64748b;
            font-size: 14px;
        }

        @media only screen and (max-width: 600px) {
            .container {
                margin: 10px;
                width: auto;
            }

            .course-item {
                flex-direction: column;
            }

            .course-image {
                width: 100%;
                height: 160px;
                margin-right: 0;
                margin-bottom: 10px;
            }
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <h2>Nhắc nhở thanh toán đơn hàng #{{ $order->order_id }}</h2>
        </div>

        <div class="content">
            <h1>Xin chào, {{ $user->name }}!</h1>
            <p>Chúng tôi nhận thấy bạn có đơn hàng trong giỏ hàng chưa thanh toán. Để không bỏ lỡ cơ hội học tập, hãy xem lại thông tin đơn hàng của bạn dưới đây:</p>

            <div class="course-list">
                @foreach($courses as $course)
                <div class="course-item">
                    <div class="course-image">
                        <img src="{{ asset('storage/' . $course['image']) }}" alt="{{ $course['name'] }}">
                    </div>
                    <div class="course-info">
                        <div class="course-name">{{ $course['name'] }}</div>
                        <div class="course-price">{{ number_format($course['price'], 0, ',', '.') }}đ</div>
                    </div>
                </div>
                @endforeach
            </div>

            <div class="total-price">
                Tổng tiền: {{ number_format($order->total_price, 0, ',', '.') }}đ
            </div>

            <div style="text-align: center;">
                <a href="{{ url('/checkout/' . $order->order_id) }}" class="cta-button">
                    Hoàn tất thanh toán ngay
                </a>
            </div>

            <div class="support-info">
                <p>Nếu bạn có bất kỳ câu hỏi hoặc cần hỗ trợ, đừng ngần ngại liên hệ với chúng tôi qua:</p>
                <ul>
                    <li>Email: lmsantlearn@gmail.com</li>
                </ul>
            </div>
        </div>

        <div class="footer">
            <p>Cảm ơn bạn đã lựa chọn AntLearn!</p>
            <p>&copy; {{ date('Y') }} AntLearn. Tất cả các quyền được bảo lưu.</p>
        </div>
    </div>
</body>

</html>