import dotenv from "dotenv";
import { renderTemplate } from "./templates";

dotenv.config();

const MAIL_API_URL =
  process.env.MAIL_SERVICE_URL ||
  "https://aira-mail-server.vercel.app/api/mail/send";

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
    const payload: MailPayload = {
      to,
      subject,
      text,
    };




    if (html) {
      payload.html = html;
    }





    if (templateName) {
      payload.templateName = templateName;
      payload.templateData = templateData;

      try {
        const renderedHtml = renderTemplate(templateName, templateData || {});

        if (renderedHtml) {
          payload.html = renderedHtml;
        }
      } catch (renderError) {
        console.error("[Mail API] Template rendering failed:", renderError);

        throw new Error(`Failed to render email template: ${templateName}`);
      }
    }

    const response = await fetch(MAIL_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });




    const responseText = await response.text();

    let data: any;

    try {
      data = JSON.parse(responseText);
    } catch {
      console.error(
        "[Mail API] Invalid response from mail server:",
        responseText,
      );

      throw new Error(
        `Mail service returned an invalid response (${response.status})`,
      );
    }




    if (!response.ok || data?.success === false) {
      console.error("[Mail API] Failure response from mail service:", data);

      throw new Error(
        data?.error ||
          data?.message ||
          `Mail service error (${response.status})`,
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
      {
        otp,
      },
    );
  }




  async sendWelcomeEmail(email: string, name: string) {
    return sendMail(
      email,
      "Welcome to Aira Pickles",
      `Welcome to Aira Pickles, ${name}!`,
      undefined,
      "welcome",
      {
        name,
      },
    );
  }




  async sendForgotPasswordEmail(email: string, resetLink: string) {
    return sendMail(
      email,
      "Reset your password",
      `Reset your password using this link: ${resetLink}`,
      undefined,
      "forgot_password",
      {
        resetLink,
      },
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
    items?: any[],
    shippingAddress?: string,
    paymentMethod?: string,
  ) {
    return sendMail(
      email,
      `Order Confirmed #${orderId}`,
      `Thank you for your order #${orderId} of ₹${totalAmount}.`,
      undefined,
      "order_confirmation",
      {
        orderId,
        customerName,
        totalAmount,
        grandTotal: totalAmount,
        items,
        shippingAddress,
        paymentMethod,
      },
    );
  }




  async sendAdminOrderNotificationEmail(
    adminEmail: string,
    orderId: string,
    customerName: string,
    customerEmail: string,
    totalPrice: number,
    paymentMethod: string,
    utrNumber: string,
    shippingAddress: string,
    orderItems: any[],
    status?: string,
    createdAt?: string,
    hasScreenshot?: boolean,
    customerPhone?: string,
    screenshotBase64?: string,
  ) {
    return sendMail(
      adminEmail,
      `🚨 New Order Placed #${orderId}`,
      `New order #${orderId} of ₹${totalPrice} received from ${
        customerName || customerEmail
      }.`,
      undefined,
      "admin_order_alert",
      {
        orderId,
        customerName,
        customerEmail,
        customerPhone,
        totalPrice,
        paymentMethod,
        utrNumber,
        shippingAddress,
        orderItems,
        status,
        createdAt,
        hasScreenshot,
        screenshotBase64,
      },
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
      {
        device,
        location,
        time,
      },
    );
  }




  async sendPasswordChangeAlertEmail(email: string, time: string) {
    return sendMail(
      email,
      "Password Change Alert",
      `Your password was changed at ${time}.`,
      undefined,
      "password_change_alert",
      {
        time,
      },
    );
  }
}

export { MailService, MailService as MailSender };

export default MailService;
