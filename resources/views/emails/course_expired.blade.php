<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thông báo về trạng thái khóa học</title>
</head>

<body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f4f4;">
        <tr>
            <td style="padding: 20px 0;">
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                    <tr>
                        <td style="text-align: center; padding: 30px 40px; background: linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%);">
                            <img src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/uploads/antlearn.jpg" alt="Logo" style="width: 150px; height: auto; margin: 0 auto;">
                        </td>
                    </tr>

                    <tr>
                        <td style="padding: 40px;">
                            <h1 style="margin: 0 0 20px; color: #111827; font-size: 24px; font-weight: 700; text-align: center;">
                                Thông báo về trạng thái khóa học
                            </h1>

                            <p style="margin: 0 0 25px; color: #374151; font-size: 16px; line-height: 24px;">
                                Xin chào <strong style="color: #111827;">{{ $course->user->name }}</strong>,
                            </p>

                            @if($hasStudents)
                            <p style="margin: 0 0 25px; color: #374151; font-size: 16px; line-height: 24px;">
                                Khóa học "<strong style="color: #111827;">{{ $course->title }}</strong>" của bạn đã hết thời gian đăng ký và hiện có học viên đã đăng ký tham gia. 
                                Để đảm bảo chất lượng học tập cho các học viên, vui lòng cập nhật lịch học mới cho khóa học.
                            </p>
                            @else
                            <p style="margin: 0 0 25px; color: #374151; font-size: 16px; line-height: 24px;">
                                Khóa học "<strong style="color: #111827;">{{ $course->title }}</strong>" của bạn đã hết thời gian đăng ký và chưa có học viên nào tham gia. 
                                Vui lòng xem xét và cập nhật lại nội dung khóa học để thu hút học viên hơn.
                            </p>
                            @endif

                            <div style="background-color: #f8fafc; border-radius: 8px; padding: 25px; margin: 30px 0;">
                                <h2 style="margin: 0 0 20px; color: #111827; font-size: 18px; font-weight: 600;">
                                    Các nội dung cần cập nhật
                                </h2>

                                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                                    @if($hasStudents)
                                    <tr>
                                        <td style="padding: 8px 0; color: #374151; font-size: 15px;">
                                            • Lịch học mới cho khóa học
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; color: #374151; font-size: 15px;">
                                            • Thời gian học phù hợp với học viên
                                        </td>
                                    </tr>
                                    @else
                                    <tr>
                                        <td style="padding: 8px 0; color: #374151; font-size: 15px;">
                                            • Lịch học và thời gian khai giảng tiếp theo
                                        </td>
                                    </tr>
                                    @endif
                                </table>
                            </div>

                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td style="text-align: center; padding: 30px 0;">
                                        <a href="http://localhost:5173/instructor/lesson"
                                            style="display: inline-block; padding: 14px 30px; background-color: #0ea5e9; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 16px; border-radius: 6px; transition: background-color 0.2s;">
                                            Cập nhật khóa học
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin: 30px 0 0; color: #374151; font-size: 16px; line-height: 24px;">
                                Nếu bạn cần hỗ trợ hoặc có bất kỳ thắc mắc nào, đừng ngần ngại liên hệ với chúng tôi qua email hoặc hotline.
                            </p>

                            <p style="margin: 20px 0 0; color: #374151; font-size: 16px; line-height: 24px;">
                                Trân trọng,<br>
                                Đội ngũ {{ config('app.name') }}
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <td style="background-color: #f8fafc; padding: 30px 40px; text-align: center;">
                            <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px;">
                                © {{ date('Y') }} {{ config('app.name') }}. All rights reserved.
                            </p>
                            <div style="margin-top: 20px;">
                                <a href="#" style="display: inline-block; margin: 0 10px; color: #6b7280; text-decoration: none;">
                                    <img src="{{ asset('images/facebook-icon.png') }}" alt="Facebook" style="width: 24px; height: 24px;">
                                </a>
                                <a href="#" style="display: inline-block; margin: 0 10px; color: #6b7280; text-decoration: none;">
                                    <img src="{{ asset('images/youtube-icon.png') }}" alt="YouTube" style="width: 24px; height: 24px;">
                                </a>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>

</html>