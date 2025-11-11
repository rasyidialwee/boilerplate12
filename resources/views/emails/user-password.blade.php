<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to {{ $appName }}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }

        .email-container {
            background-color: #ffffff;
            border-radius: 8px;
            padding: 40px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #e0e0e0;
        }

        .header h1 {
            color: #2563eb;
            margin: 0;
            font-size: 28px;
            font-weight: 600;
        }

        .content {
            margin-bottom: 30px;
        }

        .content h2 {
            color: #1f2937;
            font-size: 20px;
            margin-top: 0;
            margin-bottom: 15px;
        }

        .content p {
            color: #4b5563;
            margin-bottom: 15px;
            font-size: 16px;
        }

        .credentials-box {
            background-color: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            padding: 20px;
            margin: 25px 0;
        }

        .credential-item {
            margin-bottom: 15px;
        }

        .credential-item:last-child {
            margin-bottom: 0;
        }

        .credential-label {
            font-weight: 600;
            color: #374151;
            font-size: 14px;
            margin-bottom: 5px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .credential-value {
            font-family: 'Courier New', monospace;
            font-size: 16px;
            color: #111827;
            background-color: #ffffff;
            padding: 10px 15px;
            border-radius: 4px;
            border: 1px solid #d1d5db;
            word-break: break-all;
        }

        .password-value {
            font-weight: 600;
            color: #dc2626;
        }

        .button-container {
            text-align: center;
            margin: 30px 0;
        }

        .button {
            display: inline-block;
            padding: 12px 30px;
            background-color: #2563eb;
            color: #ffffff;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            font-size: 16px;
            transition: background-color 0.3s;
        }

        .button:hover {
            background-color: #1d4ed8;
        }

        .instructions {
            background-color: #eff6ff;
            border-left: 4px solid #2563eb;
            padding: 15px;
            margin: 25px 0;
            border-radius: 4px;
        }

        .instructions h3 {
            color: #1e40af;
            margin-top: 0;
            margin-bottom: 10px;
            font-size: 16px;
        }

        .instructions ul {
            margin: 10px 0;
            padding-left: 20px;
            color: #1e3a8a;
        }

        .instructions li {
            margin-bottom: 8px;
        }

        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
        }

        .security-notice {
            background-color: #fef2f2;
            border: 1px solid #fecaca;
            border-radius: 6px;
            padding: 15px;
            margin: 25px 0;
        }

        .security-notice p {
            color: #991b1b;
            margin: 0;
            font-size: 14px;
        }
    </style>
</head>

<body>
    <div class="email-container">
        <div class="header">
            <h1>{{ $appName }}</h1>
        </div>

        <div class="content">
            <h2>Welcome, {{ $userName }}!</h2>
            <p>Your account has been successfully created. We're excited to have you on board!</p>
            <p>Below are your login credentials. Please keep this information secure and change your password after your
                first login.</p>

            <div class="credentials-box">
                <div class="credential-item">
                    <div class="credential-label">Email Address</div>
                    <div class="credential-value">{{ $userEmail }}</div>
                </div>
                <div class="credential-item">
                    <div class="credential-label">Password</div>
                    <div class="credential-value password-value">{{ $password }}</div>
                </div>
            </div>

            <div class="button-container">
                <a href="{{ $loginUrl }}" class="button">Login to Your Account</a>
            </div>

            <div class="instructions">
                <h3>Getting Started:</h3>
                <ul>
                    <li>Use the email address and password provided above to log in</li>
                    <li>We strongly recommend changing your password after your first login</li>
                    <li>If you have any questions or need assistance, please contact our support team</li>
                </ul>
            </div>

            <div class="security-notice">
                <p><strong>Security Notice:</strong> This email contains sensitive information. Please do not share your
                    password with anyone. If you did not request this account, please contact us immediately.</p>
            </div>
        </div>

        <div class="footer">
            <p>This is an automated message from {{ $appName }}. Please do not reply to this email.</p>
            <p>&copy; {{ date('Y') }} {{ $appName }}. All rights reserved.</p>
        </div>
    </div>
</body>

</html>
