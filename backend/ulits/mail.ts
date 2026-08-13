import dotenv from "dotenv";
import express, { Request, Response } from "express";
import nodemailer from "nodemailer";

dotenv.config();

const mailrouter: express.Router = express.Router();

mailrouter.use(express.json());

// ===============================
// Check Gmail Configuration
// ===============================

if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
  console.warn(
    "GMAIL_USER and GMAIL_APP_PASSWORD are not set. Mail sending will fail until they are provided in backend/.env.",
  );
}

// ===============================
// Gmail Transporter
// ===============================

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,

  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// ===============================
// Send Mail Function
// ===============================

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

export default mailrouter;
