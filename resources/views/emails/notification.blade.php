
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $messageTitle }}</title>
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
                                {{ $messageTitle }}
                            </h1>

                            <div style="background-color: #f8fafc; border-radius: 8px; padding: 25px; margin: 30px 0;">
                                <div style="margin: 0 0 25px; color: #374151; font-size: 16px; line-height: 24px;">
                                    {!! $content !!}
                                </div>
                            </div>

                            <p style="margin: 30px 0 0; color: #374151; font-size: 16px; line-height: 24px;">
                                Nếu bạn cần hỗ trợ hoặc có bất kỳ thắc mắc nào, đừng ngần ngại liên hệ với chúng tôi qua email hoặc hotline.
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <td style="background-color: #f8fafc; padding: 30px 40px; text-align: center;">
                            <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px;">
                                © {{ date('Y') }} AntLearn. All rights reserved.
                            </p>
                            <div style="margin-top: 20px;">
                                <a href="#" style="display: inline-block; margin: 0 10px; color: #6b7280; text-decoration: none;">
                                    <img src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/uploads/facebook-icon.png" alt="Facebook" style="width: 24px; height: 24px;">
                                </a>
                                <a href="#" style="display: inline-block; margin: 0 10px; color: #6b7280; text-decoration: none;">
                                    <img src="https://lmsantlearn.s3.ap-southeast-2.amazonaws.com/uploads/youtube-icon.png" alt="YouTube" style="width: 24px; height: 24px;">
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