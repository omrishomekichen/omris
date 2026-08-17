import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import nodemailer from "nodemailer";

dotenv.config();

const hasMailCredentials = Boolean(
  process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD,
);

if (!hasMailCredentials) {
  console.warn("GMAIL_USER and GMAIL_APP_PASSWORD are not set.");
}

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  connectionTimeout: 10_000,
  greetingTimeout: 10_000,
  socketTimeout: 20_000,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export const sendMail = async (
  to: string,
  subject: string,
  text: string,
  html?: string,
) => {
  try {
    const info = await transporter.sendMail({
      from: `"Aira Pickles" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log("📧 Mail sent:", info.messageId);

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("❌ Mail error:", error);
    throw error;
  }
};

export const app = express();

app.use(express.json());

const handleSendMail = async (req: Request, res: Response) => {
  const { to, subject, text, html } = req.body || {};

  if (!to || !subject) {
    return res.status(400).json({
      success: false,
      error: "Missing required fields: to, subject",
    });
  }

  if (!hasMailCredentials) {
    return res.status(503).json({
      success: false,
      error: "Mail service is not configured",
    });
  }

  try {
    const result = await sendMail(to, subject, text || subject, html);

    return res.status(200).json(result);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unable to send mail";

    console.error("Mail delivery failed:", error);

    return res.status(502).json({
      success: false,
      error: message,
    });
  }
};

app.post("/api/mail/send", handleSendMail);

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const bodyError = error as { type?: string };

  if (
    error instanceof SyntaxError ||
    bodyError.type === "entity.parse.failed" ||
    bodyError.type === "request.size.invalid"
  ) {
    return res.status(400).json({
      success: false,
      error: "Request body is invalid or incomplete",
    });
  }

  console.error("Unhandled mail API error:", error);

  return res.status(500).json({
    success: false,
    error: "Internal server error",
  });
});

export default app;
