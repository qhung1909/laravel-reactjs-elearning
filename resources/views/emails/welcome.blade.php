<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chào mừng bạn đến với Antlearn</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #ffffff;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #fff;
            border: 1px solid #f1f1f1;
            border-radius: 10px;
            box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.1);
            text-align: center; 
        }

        h1 {
            color: #FFD700; 
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 10px;
        }

        p {
            color: #333;
            line-height: 1.6;
            font-size: 16px;
            margin: 8px 0;
        }

        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #FFD700; 
            color: white;
            text-decoration: none;
            border-radius: 30px;
            font-weight: bold;
            margin-top: 20px;
            transition: background-color 0.3s ease;
        }

        .button:hover {
            background-color: #e6c200; 
        }

        .footer {
            margin-top: 20px;
            padding-top: 10px;
            border-top: 1px solid #f1f1f1;
            font-size: 14px;
            color: #999;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Chào mừng, {{ $user->name }}! 🎉</h1>
        <p>Chúc mừng bạn đã gia nhập team Gen Z của tụi mình! 🌈✨</p>
        <p>Cảm ơn bạn đã đăng ký tài khoản tại ứng dụng của chúng tôi. Đây sẽ là một hành trình đầy thú vị và bất ngờ!</p>
        <p>Vui lòng xác nhận email của bạn để hoàn tất quá trình đăng ký bằng cách nhấp vào nút bên dưới:</p>
        
        <a href="{{ url('api/verify-email/'.$user->verification_token) }}" class="button">
            Xác Nhận Email
        </a>

        <div class="footer">
            <p>💌 Nếu bạn có bất kỳ câu hỏi nào, đừng ngại nhắn cho tụi mình nhé!</p>
            <p>&copy; {{ date('Y') }} AntLearn. Tất cả các quyền được bảo lưu.</p>
        </div>
    </div>
</body>
</html>