import nodemailer, { Transporter } from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const config = {
  env: process.env.NODE_ENV || "development",
  mail: {
    host: process.env.MAIL_HOST || process.env.GMAIL_HOST || "smtp.gmail.com",
    port: Number(process.env.MAIL_PORT || process.env.GMAIL_PORT || 465),
    secure: process.env.MAIL_SECURE === "false" ? false : true,
    hostUser: process.env.MAIL_HOST_USER || process.env.GMAIL_USER || "",
    hostPass:
      process.env.MAIL_HOST_PASS || process.env.GMAIL_APP_PASSWORD || "",
  },
};

import {
  otpTemplate,
  welcomeTemplate,
  forgotPasswordTemplate,
  passwordResetSuccessTemplate,
  loginAlertTemplate,
  passwordChangeAlertTemplate,
} from "./templates";

interface MailPayload {
  to: string;
  subject: string;
  text?: string;
  html: string;
}

class MailService {
  private transporter: Transporter;
  private number: number = 0;

  constructor() {
    if (!config.mail.host || !config.mail.hostUser) {
      console.warn(
        "[mailService] Mail credentials host or hostUser missing in environment config.",
      );
    }

    this.transporter = nodemailer.createTransport({
      host: config.mail.host,
      port: Number(config.mail.port),
      secure: config.mail.secure,
      auth: {
        user: config.mail.hostUser,
        pass: config.mail.hostPass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  private async send({ to, subject, text, html }: MailPayload) {
    const sender = `"Omri's Home Kitchen" <${config.mail.hostUser || "noreply@omris.com"}>`;

    try {
      const info = await this.transporter.sendMail({
        from: sender,
        to,
        subject,
        text,
        html,
      });
      this.number++;
      console.log(
        `[Email service -- Nodemailer]:[${new Date().toISOString()}] Email sent via Nodemailer (${this.number})`,
      );
      return info;
    } catch (error) {
      console.error("Error sending email via Nodemailer:", error);
      throw error;
    }
  }

  async sendOTPEmail(
    email: string,
    otp: string,
    subject: string = "Your verification code",
  ) {
    return this.send({
      to: email,
      subject: subject,
      text: `Your OTP is ${otp}`,
      html: otpTemplate(otp),
    });
  }

  async sendWelcomeEmail(email: string, name: string) {
    return this.send({
      to: email,
      subject: "Welcome to Omri's Home Kitchen",
      text: `Welcome to Omri's Home Kitchen ${name}`,
      html: welcomeTemplate(name),
    });
  }

  async sendForgotPasswordEmail(email: string, resetLink: string) {
    return this.send({
      to: email,
      subject: "Reset your password",
      text: `Reset your password using this link: ${resetLink}`,
      html: forgotPasswordTemplate(resetLink),
    });
  }

  async sendPasswordResetSuccessEmail(email: string) {
    return this.send({
      to: email,
      subject: "Password updated",
      text: "Your password has been updated successfully",
      html: passwordResetSuccessTemplate(),
    });
  }

  async sendLoginAlertEmail(
    email: string,
    device: string,
    location: string,
    time: string,
  ) {
    return this.send({
      to: email,
      subject: "New login detected",
      text: `We noticed a new login to your account from ${device} in ${location} at ${time}.`,
      html: loginAlertTemplate(device, location, time),
    });
  }

  async sendPasswordChangeAlertEmail(email: string, time: string) {
    return this.send({
      to: email,
      subject: "Password Change Alert",
      text: `Your password was changed at ${time}.`,
      html: passwordChangeAlertTemplate(time),
    });
  }
}

export { MailService, MailService as MailSender };

const mailServiceInstance = new MailService();

export const sendMail = async (to: string, subject: string, text: string) => {
  const otpMatch = text.match(/\b\d{6}\b/);
  const otp = otpMatch ? otpMatch[0] : text;
  return mailServiceInstance.sendOTPEmail(to, otp, subject);
};

export default MailService;
