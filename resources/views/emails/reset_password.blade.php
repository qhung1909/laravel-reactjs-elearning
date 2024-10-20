<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Password</title>
</head>
<body>
    <h1>Reset Password</h1>
    <p>Click vào liên kết bên dưới để reset mật khẩu:</p>
    <a href="{{ url('reset-password/'.$token) }}">Reset Password</a>
</body>
</html>
