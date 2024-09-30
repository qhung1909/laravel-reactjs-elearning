<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chào Mừng</title>
</head>
<body>
    <h1>Chào mừng, {{ $user->name }}!</h1>
    <p>Cảm ơn bạn đã đăng ký tài khoản tại ứng dụng của chúng tôi.</p>
    <p>Vui lòng xác nhận email của bạn để hoàn tất quá trình đăng ký bằng cách nhấp vào liên kết dưới đây:</p>
    <a href="{{ url('api/verify-email/'.$user->verification_token) }}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
        Xác Nhận Email
    </a>
</body>
</html>