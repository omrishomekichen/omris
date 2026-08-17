import { emailLayout } from "./layout";

export const otpTemplate = (otp: string, name?: string): string => {
  const greeting = name ? `Hello ${name},` : "Hello,";
  return emailLayout({
    title: "Your Verification Code - Aira Pickles",
    preheader: `Your verification code is ${otp}. Valid for 15 minutes.`,
    content: `
      <h2 style="color: #0f172a; margin-top: 0; font-size: 20px;">Verification Code</h2>
      <p style="color: #475569;">${greeting}</p>
      <p style="color: #475569;">Use the 6-digit verification code below to complete your authentication with <strong>Aira Pickles</strong>. This code is valid for <strong>15 minutes</strong>.</p>
      
      <div style="background-color: #fffbeb; border: 2px dashed #f59e0b; border-radius: 12px; padding: 20px; text-align: center; margin: 28px 0;">
        <span style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #b45309; font-family: monospace;">${otp}</span>
      </div>

      <p style="color: #64748b; font-size: 14px;">If you didn't request this verification code, please ignore this email. Someone may have entered your email address by mistake.</p>
    `,
  });
};
