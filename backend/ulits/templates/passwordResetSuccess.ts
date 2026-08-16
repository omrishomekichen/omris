import { emailLayout } from "./layout";

export const passwordResetSuccessTemplate = (name?: string): string => {
  const greeting = name ? `Hello ${name},` : "Hello,";
  return emailLayout({
    title: "Password Updated Successfully - Omri's Home Kichen",
    preheader: "Your account password has been updated successfully.",
    content: `
      <h2 style="color: #0f172a; margin-top: 0; font-size: 20px;">Password Changed Successfully ✅</h2>
      <p style="color: #475569;">${greeting}</p>
      <p style="color: #475569;">This is confirmation that the password for your Omri's Home Kichen account has been changed.</p>

      <div style="background-color: #f0fdf4; border-left: 4px solid #22c55e; padding: 16px; border-radius: 0 10px 10px 0; margin: 24px 0;">
        <p style="margin: 0; color: #166534; font-weight: 600; font-size: 14px;">Status: Security Credentials Updated</p>
      </div>

      <p style="color: #64748b; font-size: 14px;">If you performed this action, you can safely ignore this message.</p>
      <p style="color: #ef4444; font-size: 14px; font-weight: 500;">If you did NOT make this change, please contact our support team immediately or reset your password.</p>
    `,
  });
};
