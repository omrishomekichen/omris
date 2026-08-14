import dotenv from "dotenv";
import express, { Request, Response } from "express";
import nodemailer from "nodemailer";
import serverless from "serverless-http";

dotenv.config();

if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
  console.warn(
    "GMAIL_USER and GMAIL_APP_PASSWORD are not set. Mail sending will fail until they are provided in .env.",
  );
}

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export const sendMail = async (to: string, subject: string, text: string) => {
  try {
    const info = await transporter.sendMail({
      from: `"Omri's Home Kitchen" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      text,
      html: `
        <!DOCTYPE html>
        <html>
          <body>
            <h2>${subject}</h2>
            <p>${text}</p>
          </body>
        </html>
      `,
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
  const { to, subject, text } = req.body || {};

  if (!to || !subject || !text) {
    return res
      .status(400)
      .json({ error: "Missing required fields: to, subject, text" });
  }

  try {
    const result = await sendMail(to, subject, text);
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(500).json({ success: false, error: String(error) });
  }
};

app.post("/api/mail/send", handleSendMail);
app.post("/mail/send", handleSendMail);

export default serverless(app as any);
