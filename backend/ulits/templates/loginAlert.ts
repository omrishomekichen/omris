import { emailLayout } from "./layout";

export const loginAlertTemplate = (
  device: string,
  location: string,
  time: string,
  name?: string,
): string => {
  const greeting = name ? `Hello ${name},` : "Hello,";
  return emailLayout({
    title: "Security Alert: New Sign-In - Omri's Home Kichen",
    preheader: `New sign-in detected on ${device} at ${time}.`,
    content: `
      <h2 style="color: #0f172a; margin-top: 0; font-size: 20px;">Security Alert: New Login 🔒</h2>
      <p style="color: #475569;">${greeting}</p>
      <p style="color: #475569;">We detected a new sign-in to your Omri's Home Kichen account.</p>

      <div style="background-color: #fefce8; border-left: 4px solid #eab308; padding: 16px; border-radius: 0 10px 10px 0; margin: 24px 0;">
        <p style="margin: 4px 0; color: #713f12; font-size: 14px;"><strong>Device:</strong> ${device}</p>
        <p style="margin: 4px 0; color: #713f12; font-size: 14px;"><strong>Location:</strong> ${location}</p>
        <p style="margin: 4px 0; color: #713f12; font-size: 14px;"><strong>Time:</strong> ${time}</p>
      </div>

      <p style="color: #64748b; font-size: 14px;">If this was you, no action is required.</p>
      <p style="color: #ef4444; font-size: 14px; font-weight: 500;">If you do not recognize this login, please secure your account immediately by changing your password.</p>
    `,
  });
};
