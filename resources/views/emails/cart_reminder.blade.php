<!DOCTYPE html>
<html>
<head>
    <title>Nhắc nhở thanh toán đơn hàng</title>
    <style>
        /* Định dạng chung */
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333;
            margin: 0;
            padding: 0;
            line-height: 1.6;
        }

        .container {
            width: 100%;
            max-width: 600px;
            margin: 20px auto;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }

        .header {
            background-color: #4CAF50;
            color: #fff;
            padding: 20px;
            text-align: center;
        }

        .content {
            padding: 20px;
        }

        .content h1 {
            color: #4CAF50;
            font-size: 24px;
        }

        .content p {
            font-size: 16px;
            margin-bottom: 15px;
        }

        .button-container {
            text-align: center;
            margin: 20px 0;
        }

        .button {
            background-color: #4CAF50;
            color: #fff;
            padding: 10px 20px;
            text-decoration: none;
            font-weight: bold;
            border-radius: 5px;
        }

        .button:hover {
            background-color: #45a049;
        }

        .footer {
            background-color: #f1f1f1;
            text-align: center;
            padding: 15px;
            font-size: 14px;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Nhắc nhở thanh toán đơn hàng số:{{ $order_id }}</h2>
        </div>

        <div class="content">
            <h1>Xin chào, {{ $user->name }}</h1>
            <p>Bạn có đơn hàng trong giỏ hàng chưa thanh toán từ hơn 2 ngày trước. Chúng tôi muốn nhắc bạn xem xét lại đơn hàng này để hoàn tất thanh toán.</p>
            <p>Nếu có bất kỳ vấn đề hoặc thắc mắc nào, vui lòng liên hệ với chúng tôi. Chúng tôi luôn sẵn sàng hỗ trợ!</p>
            
        </div>

        <div class="footer">
            <p>Cảm ơn bạn đã tin tưởng chúng tôi.</p>
            <p>&copy; {{ date('Y') }} AntLearn. Tất cả các quyền được bảo lưu.</p>
        </div>
    </div>
</body>
</html>
