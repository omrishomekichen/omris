import dotenv from "dotenv";

dotenv.config();

const MAIL_API_URL =
  process.env.MAIL_SERVICE_URL ||
  "https://omris-mail-server.vercel.app/api/mail/send";

interface MailPayload {
  to: string;
  subject: string;
  text: string;
  html?: string;
  templateName?: string;
  templateData?: any;
}

export const sendMail = async (
  to: string,
  subject: string,
  text: string,
  html?: string,
  templateName?: string,
  templateData?: any,
) => {
  console.log(`[Mail API] Sending email to ${to} via ${MAIL_API_URL}...`);
  try {
    const payload: MailPayload = { to, subject, text };
    if (html) {
      payload.html = html;
    }
    if (templateName) {
      payload.templateName = templateName;
      payload.templateData = templateData;
    }

    const response = await fetch(MAIL_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data: any = await response.json();

    if (!response.ok || (data && data.success === false)) {
      console.error("[Mail API] Failure response from mail service:", data);
      throw new Error(
        data?.error || data?.message || `Mail service error (${response.status})`,
      );
    }

    console.log("[Mail API] Email sent successfully:", data);
    return data;
  } catch (error) {
    console.error("[Mail API] Error calling mail server API:", error);
    throw error;
  }
};

class MailService {
  async send(payload: MailPayload) {
    return sendMail(
      payload.to,
      payload.subject,
      payload.text,
      payload.html,
      payload.templateName,
      payload.templateData,
    );
  }

  async sendOTPEmail(
    email: string,
    otp: string,
    subject: string = "Your verification code",
  ) {
    return sendMail(
      email,
      subject,
      `Your OTP is ${otp}. It expires in 15 minutes.`,
      undefined,
      "otp",
      { otp },
    );
  }

  async sendWelcomeEmail(email: string, name: string) {
    return sendMail(
      email,
      "Welcome to Omri's Home Kitchen",
      `Welcome to Omri's Home Kitchen, ${name}!`,
      undefined,
      "welcome",
      { name },
    );
  }

  async sendForgotPasswordEmail(email: string, resetLink: string) {
    return sendMail(
      email,
      "Reset your password",
      `Reset your password using this link: ${resetLink}`,
      undefined,
      "forgot_password",
      { resetLink },
    );
  }

  async sendPasswordResetSuccessEmail(email: string) {
    return sendMail(
      email,
      "Password updated",
      "Your password has been updated successfully.",
      undefined,
      "password_reset_success",
      {},
    );
  }

  async sendOrderConfirmationEmail(
    email: string,
    orderId: string,
    customerName: string,
    totalAmount: number,
  ) {
    return sendMail(
      email,
      `Order Confirmed #${orderId}`,
      `Thank you for your order #${orderId} of ₹${totalAmount}.`,
      undefined,
      "order_confirmation",
      { orderId, customerName, totalAmount },
    );
  }

  async sendLoginAlertEmail(
    email: string,
    device: string,
    location: string,
    time: string,
  ) {
    return sendMail(
      email,
      "New login detected",
      `We noticed a new login to your account from ${device} in ${location} at ${time}.`,
      undefined,
      "login_alert",
      { device, location, time },
    );
  }

  async sendPasswordChangeAlertEmail(email: string, time: string) {
    return sendMail(
      email,
      "Password Change Alert",
      `Your password was changed at ${time}.`,
      undefined,
      "password_change_alert",
      { time },
    );
  }
}

export { MailService, MailService as MailSender };
export default MailService;
