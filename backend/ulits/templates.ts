const emailLayout = (title: string, content: string): string => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #f4f6f8;
      margin: 0;
      padding: 0;
      color: #333333;
    }
    .email-container {
      max-width: 600px;
      margin: 30px auto;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
    }
    .email-header {
      background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
      padding: 30px 20px;
      text-align: center;
    }
    .email-header h1 {
      color: #ffffff;
      margin: 0;
      font-size: 24px;
      font-weight: 700;
      letter-spacing: -0.5px;
    }
    .email-body {
      padding: 30px 25px;
      line-height: 1.6;
    }
    .otp-box {
      background-color: #fffbeb;
      border: 2px dashed #f59e0b;
      border-radius: 8px;
      padding: 15px;
      text-align: center;
      margin: 20px 0;
    }
    .otp-code {
      font-size: 32px;
      font-weight: 800;
      letter-spacing: 6px;
      color: #b45309;
      margin: 0;
    }
    .btn {
      display: inline-block;
      background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
      color: #ffffff !important;
      text-decoration: none;
      padding: 12px 28px;
      border-radius: 8px;
      font-weight: 600;
      margin: 20px 0;
    }
    .info-card {
      background-color: #f8fafc;
      border-left: 4px solid #d97706;
      padding: 15px;
      border-radius: 0 8px 8px 0;
      margin: 20px 0;
    }
    .info-card p {
      margin: 5px 0;
    }
    .email-footer {
      background-color: #f9fafb;
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #6b7280;
      border-top: 1px solid #e5e7eb;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <h1>Omri's Home Kitchen</h1>
    </div>
    <div class="email-body">
      ${content}
    </div>
    <div class="email-footer">
      <p>&copy; ${new Date().getFullYear()} Omri's Home Kitchen. All rights reserved.</p>
      <p>If you did not initiate this request, please ignore this email or contact support.</p>
    </div>
  </div>
</body>
</html>
`;

export const otpTemplate = (otp: string): string => {
    return emailLayout(
        'Your Verification Code',
        `
        <h2 style="color: #111827; margin-top: 0;">Verification Code</h2>
        <p style="color: #4b5563;">Use the code below to verify your account or complete your sign-in process. This code will expire shortly.</p>
        <div class="otp-box">
            <p class="otp-code">${otp}</p>
        </div>
        <p style="color: #6b7280; font-size: 14px;">If you didn't request this code, you can safely ignore this email.</p>
        `
    );
};

export const welcomeTemplate = (name: string): string => {
    return emailLayout(
        "Welcome to Omri's Home Kitchen",
        `
        <h2 style="color: #111827; margin-top: 0;">Welcome, ${name}! 🎉</h2>
        <p style="color: #4b5563;">We are thrilled to have you join Omri's Home Kitchen. Enjoy authentic handcrafted pickles, sun-cured spices, and traditional recipes delivered straight to your doorstep.</p>
        <p style="color: #4b5563;">Get started by exploring our store or checking out your personal dashboard.</p>
        <div style="text-align: center;">
            <a href="#" class="btn">Go to Dashboard</a>
        </div>
        <p style="color: #6b7280; font-size: 14px;">If you have any questions, feel free to reply to this email.</p>
        `
    );
};

export const forgotPasswordTemplate = (resetLink: string): string => {
    return emailLayout(
        'Reset Your Password',
        `
        <h2 style="color: #111827; margin-top: 0;">Reset Password Request</h2>
        <p style="color: #4b5563;">We received a request to reset your password. Click the button below to choose a new password:</p>
        <div style="text-align: center;">
            <a href="${resetLink}" class="btn">Reset Password</a>
        </div>
        <p style="color: #6b7280; font-size: 14px; word-break: break-all;">Or copy and paste this link into your browser:<br><a href="${resetLink}" style="color: #d97706;">${resetLink}</a></p>
        <p style="color: #9ca3af; font-size: 13px;">If you did not request a password reset, no further action is required.</p>
        `
    );
};

export const passwordResetSuccessTemplate = (): string => {
    return emailLayout(
        'Password Updated',
        `
        <h2 style="color: #111827; margin-top: 0;">Password Successfully Updated ✅</h2>
        <p style="color: #4b5563;">Your password has been changed successfully. You can now use your new password to sign in.</p>
        <div class="info-card" style="border-left-color: #22c55e;">
            <p style="color: #166534;"><strong>Status:</strong> Security credentials updated</p>
        </div>
        <p style="color: #6b7280; font-size: 14px;">If you did not make this change, please contact our support team immediately.</p>
        `
    );
};

export const loginAlertTemplate = (device: string, location: string, time: string): string => {
    return emailLayout(
        'New Login Detected',
        `
        <h2 style="color: #111827; margin-top: 0;">Security Alert: New Login 🔒</h2>
        <p style="color: #4b5563;">We detected a new sign-in to your Omri's Home Kitchen account.</p>
        <div class="info-card" style="border-left-color: #eab308;">
            <p><strong>Device:</strong> ${device}</p>
            <p><strong>Location:</strong> ${location}</p>
            <p><strong>Time:</strong> ${time}</p>
        </div>
        <p style="color: #6b7280; font-size: 14px;">If this was you, you can ignore this alert. If you don't recognize this activity, please secure your account immediately.</p>
        `
    );
};

export const passwordChangeAlertTemplate = (time: string): string => {
    return emailLayout(
        'Password Change Alert',
        `
        <h2 style="color: #111827; margin-top: 0;">Password Change Alert 🔑</h2>
        <p style="color: #4b5563;">The password for your account was changed at <strong>${time}</strong>.</p>
        <div class="info-card" style="border-left-color: #ef4444;">
            <p style="color: #991b1b;"><strong>Time of Change:</strong> ${time}</p>
        </div>
        <p style="color: #6b7280; font-size: 14px;">If you did not make this change, your account may be compromised. Please reset your password immediately or contact support.</p>
        `
    );
};
