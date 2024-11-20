<!-- Template cho học viên -->
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thông báo lịch học mới</title>
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
                                Thông báo lịch học mới
                            </h1>

                            <p style="margin: 0 0 25px; color: #374151; font-size: 16px; line-height: 24px;">
                                Xin chào <strong style="color: #111827;">{{ $data['student_name'] }}</strong>,
                            </p>

                            <div style="background-color: #f8fafc; border-radius: 8px; padding: 25px; margin: 30px 0;">
                                <h2 style="margin: 0 0 20px; color: #111827; font-size: 18px; font-weight: 600;">
                                    Thông tin buổi học
                                </h2>

                                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                                    <tr>
                                        <td style="padding: 8px 0; color: #374151; font-size: 15px;">
                                            <strong style="color: #111827;">Khóa học:</strong>
                                        </td>
                                        <td style="padding: 8px 0; color: #374151; font-size: 15px;">
                                            {{ $data['course_name'] }}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; color: #374151; font-size: 15px;">
                                            <strong style="color: #111827;">Nội dung:</strong>
                                        </td>
                                        <td style="padding: 8px 0; color: #374151; font-size: 15px;">
                                            {{ $data['content_name'] }}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; color: #374151; font-size: 15px;">
                                            <strong style="color: #111827;">Thời gian:</strong>
                                        </td>
                                        <td style="padding: 8px 0; color: #374151; font-size: 15px;">
                                            {{ $data['start_time'] }}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; color: #374151; font-size: 15px;">
                                            <strong style="color: #111827;">Giảng viên:</strong>
                                        </td>
                                        <td style="padding: 8px 0; color: #374151; font-size: 15px;">
                                            {{ $data['teacher_name'] }}
                                        </td>
                                    </tr>
                                </table>
                            </div>

                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td style="text-align: center; padding: 30px 0;">
                                        <a href="{{ $data['meeting_url'] }}"
                                            style="display: inline-block; padding: 14px 30px; background-color: #0ea5e9; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 16px; border-radius: 6px; transition: background-color 0.2s;">
                                            Tham gia lớp học
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin: 30px 0 0; color: #374151; font-size: 16px; line-height: 24px;">
                                Vui lòng truy cập link meeting trước 5 phút để chuẩn bị.
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <td style="background-color: #f8fafc; padding: 30px 40px; text-align: center;">
                            <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px;">
                                © {{ date('Y') }} {{ config('app.name') }}. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>

<!-- Template cho giảng viên -->
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thông báo lịch dạy mới</title>
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
                                Thông báo lịch dạy mới
                            </h1>

                            <p style="margin: 0 0 25px; color: #374151; font-size: 16px; line-height: 24px;">
                                Xin chào <strong style="color: #111827;">{{ $data['teacher_name'] }}</strong>,
                            </p>

                            <div style="background-color: #f8fafc; border-radius: 8px; padding: 25px; margin: 30px 0;">
                                <h2 style="margin: 0 0 20px; color: #111827; font-size: 18px; font-weight: 600;">
                                    Thông tin buổi dạy
                                </h2>

                                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                                    <tr>
                                        <td style="padding: 8px 0; color: #374151; font-size: 15px;">
                                            <strong style="color: #111827;">Khóa học:</strong>
                                        </td>
                                        <td style="padding: 8px 0; color: #374151; font-size: 15px;">
                                            {{ $data['course_name'] }}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; color: #374151; font-size: 15px;">
                                            <strong style="color: #111827;">Nội dung:</strong>
                                        </td>
                                        <td style="padding: 8px 0; color: #374151; font-size: 15px;">
                                            {{ $data['content_name'] }}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; color: #374151; font-size: 15px;">
                                            <strong style="color: #111827;">Thời gian:</strong>
                                        </td>
                                        <td style="padding: 8px 0; color: #374151; font-size: 15px;">
                                            {{ $data['start_time'] }}
                                        </td>
                                    </tr>
                                    @if($data['notes'])
                                    <tr>
                                        <td style="padding: 8px 0; color: #374151; font-size: 15px;">
                                            <strong style="color: #111827;">Ghi chú:</strong>
                                        </td>
                                        <td style="padding: 8px 0; color: #374151; font-size: 15px;">
                                            {{ $data['notes'] }}
                                        </td>
                                    </tr>
                                    @endif
                                </table>
                            </div>

                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td style="text-align: center; padding: 30px 0;">
                                        <a href="{{ $data['meeting_url'] }}"
                                            style="display: inline-block; padding: 14px 30px; background-color: #0ea5e9; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 16px; border-radius: 6px; transition: background-color 0.2s;">
                                            Bắt đầu buổi dạy
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin: 30px 0 0; color: #374151; font-size: 16px; line-height: 24px;">
                                Vui lòng truy cập link meeting trước 5 phút để chuẩn bị.
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <td style="background-color: #f8fafc; padding: 30px 40px; text-align: center;">
                            <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px;">
                                © {{ date('Y') }} {{ config('app.name') }}. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>