<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Đặt lại mật khẩu</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <style>
        .btn {
            @apply inline-block px-6 py-3 mt-4 text-white bg-blue-500 rounded-lg shadow hover:bg-blue-600;
        }
    </style>
</head>
<body class="bg-gray-100">
    <div class="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 class="text-2xl font-bold text-gray-800">Xin chào!</h1>
        <p class="text-gray-600 mt-4">Để đặt lại mật khẩu của bạn, hãy nhấn vào liên kết dưới đây:</p>
        <a href="{{ $link }}" class="btn">Đặt lại mật khẩu</a>
        <p class="text-gray-600 mt-4">Nếu bạn không yêu cầu đặt lại mật khẩu, bạn có thể bỏ qua email này.</p>
        <footer class="mt-8 text-gray-500 text-sm">
            <p>Cảm ơn bạn,</p>
            <p>Đội ngũ hỗ trợ của chúng tôi</p>
        </footer>
    </div>
</body>
</html>
