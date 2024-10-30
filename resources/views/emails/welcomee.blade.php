<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome</title>
    <style>
        body {
            font-family: Arial, sans-serif;
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

        a {
            color: #FFD700;
            text-decoration: none;
            font-weight: bold;
        }

        .button {
            display: inline-block;
            background-color: #FFD700;
            color: #fff;
            padding: 10px 20px;
            margin-top: 20px;
            border-radius: 30px;
            text-decoration: none;
            font-weight: bold;
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

        .logo {
            width: 150px;
            height: auto;
            margin: 0 auto 20px; 
        }
    </style>
</head>
<body>
    <div class="container">
        <img src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/uploads/antlearn.jpg" alt="Logo" class="logo">

        <h1>Chào mừng đến với tụi mình, {{ $user->name }}! 🎉</h1>
        <p>🔥 Bạn đã chính thức nhập hội với tụi mình rồi nhé!</p>
        <p>Cảm ơn bạn đã chọn chúng mình, đây sẽ là hành trình cực cháy mà bạn sẽ không bao giờ hối hận đâu.</p>
        
        <p>Nếu gặp khó khăn hay muốn tám chuyện gì thì đừng ngại ngần <a href="mailto:support@example.com">nhắn chúng mình</a> nha!</p>
        
        <p>Happy Exploring 🌏✨,</p>
        <p>Team Antlearn của tụi mình 💌</p>

        <a href="http://yourwebsite.com" class="button">Bắt đầu khám phá ngay!</a>

        <div class="footer">
            <p>Cảm ơn bạn đã lựa chọn AntLearn!</p>
            <p>&copy; {{ date('Y') }} AntLearn. Tất cả các quyền được bảo lưu.</p>
        </div>
    </div>
</body>
</html>
