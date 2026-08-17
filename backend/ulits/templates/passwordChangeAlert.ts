import { emailLayout } from "./layout";

export const passwordChangeAlertTemplate = (time: string, name?: string): string => {
  const greeting = name ? `Hello ${name},` : "Hello,";
  return emailLayout({
    title: "Security Alert: Password Changed - Aira Pickles",
    preheader: `Your account password was modified at ${time}.`,
    content: `
      <h2 style="color: #0f172a; margin-top: 0; font-size: 20px;">Password Changed Alert 🔑</h2>
      <p style="color: #475569;">${greeting}</p>
      <p style="color: #475569;">The password for your Aira Pickles account was changed at <strong>${time}</strong>.</p>

      <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 16px; border-radius: 0 10px 10px 0; margin: 24px 0;">
        <p style="margin: 0; color: #991b1b; font-weight: 600; font-size: 14px;">Time of Change: ${time}</p>
      </div>

      <p style="color: #64748b; font-size: 14px;">If you initiated this change, you can safely ignore this email.</p>
      <p style="color: #ef4444; font-size: 14px; font-weight: 500;">If you did NOT change your password, your account may be compromised. Please reset your password immediately or contact our support team at <strong>+91 63014 53780</strong>.</p>
    `,
  });
};
