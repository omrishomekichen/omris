import { emailLayout } from "./layout";

export const forgotPasswordTemplate = (resetLink: string, name?: string): string => {
  const greeting = name ? `Hello ${name},` : "Hello,";
  return emailLayout({
    title: "Reset Your Password - Omri's Home Kitchen",
    preheader: "Click the link inside to safely reset your account password.",
    content: `
      <h2 style="color: #0f172a; margin-top: 0; font-size: 20px;">Reset Password Request</h2>
      <p style="color: #475569;">${greeting}</p>
      <p style="color: #475569;">We received a request to reset the password associated with your account. Click the button below to choose a new password:</p>

      <div style="text-align: center; margin: 32px 0;">
        <a href="${resetLink}" class="btn">Reset My Password</a>
      </div>

      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; margin: 24px 0; word-break: break-all;">
        <p style="margin: 0 0 6px 0; font-size: 13px; color: #64748b;">Or copy & paste this URL into your web browser:</p>
        <a href="${resetLink}" style="color: #d97706; font-size: 13px;">${resetLink}</a>
      </div>

      <p style="color: #94a3b8; font-size: 13px;">If you did not request a password reset, no action is needed. Your current password will remain active and secure.</p>
    `,
  });
};
