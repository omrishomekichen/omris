import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../model/user";
import { Otp } from "../model/otp";
import { sendMail } from "../ulits/mail";
import {
  AUTH_COOKIE_NAME,
  authCookieOptions,
  JWT_SECRET,
  getAuthToken,
} from "../config/security";

const authRouter: express.Router = express.Router();

const buildUserResponse = (user: any) => ({
  id: user._id?.toString() || user.id,
  _id: user._id?.toString() || user.id,
  firstName: user.firstName,
  lastName: user.lastName,
  name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Customer",
  email: user.email,
  verified: user.verified ?? false,
});

/* ==========================================================================
   REGISTER
   ========================================================================== */
authRouter.post("/register", async (req: Request, res: Response) => {
  const { fullName, email, password, agreeToTerms } = req.body || {};

  if (!fullName || !email || !password) {
    return res.status(400).json({
      status: "error",
      message: "Missing required registration fields",
    });
  }

  const cleanEmail = email.toLowerCase().trim();

  try {
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(409).json({
        status: "error",
        message: "Email already registered",
      });
    }

    const [firstName, ...rest] = fullName.trim().split(" ");
    const lastName = rest.join(" ");
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();
    const verificationExpires = new Date(Date.now() + 15 * 60 * 1000);

    const user = new User({
      firstName,
      lastName,
      email: cleanEmail,
      password: hashedPassword,
      agreeToTerms: typeof agreeToTerms === "boolean" ? agreeToTerms : true,
      verified: false,
    });

    await user.save();

    await Otp.deleteMany({ email: user.email });
    await Otp.create({
      email: user.email,
      code: verificationCode,
      expiresAt: verificationExpires,
    });

    try {
      await sendMail(
        user.email,
        "Your verification code",
        `Your OTP is ${verificationCode}. It expires in 15 minutes.`,
        undefined,
        "otp",
        { otp: verificationCode, name: fullName.trim() },
      );
    } catch (mailError) {
      console.error("Verification email error:", mailError);
      await User.deleteOne({ _id: user._id });
      await Otp.deleteMany({ email: user.email });
      return res.status(500).json({
        status: "error",
        message:
          "Unable to send verification email. Please check your email address and try again.",
      });
    }

    return res.status(201).json({
      status: "success",
      message:
        "User registered successfully. Check your email for the verification code.",
      email: user.email,
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    return res.status(500).json({
      status: "error",
      message: error?.message || "Internal server error",
    });
  }
});

/* ==========================================================================
   VERIFY OTP & ACTIVATE ACCOUNT
   ========================================================================== */
authRouter.post("/verify", async (req: Request, res: Response) => {
  const { email, verificationCode } = req.body || {};

  if (!email || !verificationCode) {
    return res.status(400).json({
      status: "error",
      message: "Email and verification code are required",
    });
  }

  const cleanEmail = email.toLowerCase().trim();

  try {
    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    const otp = await Otp.findOne({
      email: cleanEmail,
      code: verificationCode.trim(),
    });

    if (!otp) {
      return res.status(400).json({
        status: "error",
        message: "Invalid verification code",
      });
    }

    if (new Date() > otp.expiresAt) {
      return res.status(400).json({
        status: "error",
        message: "Verification code expired",
      });
    }

    user.verified = true;
    await user.save();
    await Otp.deleteMany({ email: cleanEmail });

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`.trim(),
      },
      JWT_SECRET,
      { expiresIn: "7d" },
    );
    res.cookie(AUTH_COOKIE_NAME, token, authCookieOptions);

    try {
      await sendMail(
        user.email,
        `Welcome to Aira Pickles, ${user.firstName}!`,
        `Welcome to Aira Pickles, ${user.firstName}!`,
        undefined,
        "welcome",
        { name: `${user.firstName} ${user.lastName}`.trim() },
      );
    } catch (e) {
      console.error("Failed to send welcome email:", e);
    }

    return res.status(200).json({
      status: "success",
      message: "Email verified successfully",
      user: buildUserResponse(user),
      token,
    });
  } catch (error: any) {
    console.error("Verification error:", error);
    return res.status(500).json({
      status: "error",
      message: error?.message || "Internal server error",
    });
  }
});

/* ==========================================================================
   LOGIN
   ========================================================================== */
authRouter.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({
      status: "error",
      message: "Missing email or password",
    });
  }

  const cleanEmail = email.toLowerCase().trim();

  try {
    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Invalid email or password",
      });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({
        status: "error",
        message: "Invalid email or password",
      });
    }

    if (!user.verified) {
      return res.status(403).json({
        status: "error",
        message: "Please verify your email address before logging in.",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`.trim(),
      },
      JWT_SECRET,
      { expiresIn: "7d" },
    );
    res.cookie(AUTH_COOKIE_NAME, token, authCookieOptions);

    try {
      const userAgent = req.headers["user-agent"] || "Web Browser";
      const deviceType = userAgent.includes("Mobile")
        ? "Mobile Device"
        : "Desktop Browser";
      const loginTime = new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
      });
      await sendMail(
        user.email,
        "Security Alert: New Sign-In",
        `We noticed a new login to your Aira Pickles account at ${loginTime}.`,
        undefined,
        "login_alert",
        {
          device: deviceType,
          location: "India",
          time: loginTime,
          name: `${user.firstName} ${user.lastName}`.trim(),
        },
      );
    } catch (e) {
      console.error("Failed to send login alert email:", e);
    }

    return res.status(200).json({
      status: "success",
      user: buildUserResponse(user),
      token,
    });
  } catch (error: any) {
    console.error("Login error:", error);
    return res.status(500).json({
      status: "error",
      message: error?.message || "Internal server error",
    });
  }
});

/* ==========================================================================
   LOGOUT
   ========================================================================== */
authRouter.post("/logout", (_req: Request, res: Response) => {
  const { maxAge, ...clearCookieOptions } = authCookieOptions;
  res.clearCookie(AUTH_COOKIE_NAME, clearCookieOptions);
  return res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
});

/* ==========================================================================
   FORGOT PASSWORD
   ========================================================================== */
authRouter.post("/forgot-password", async (req: Request, res: Response) => {
  const { email } = req.body || {};

  if (!email) {
    return res.status(400).json({
      status: "error",
      message: "Email is required",
    });
  }

  const cleanEmail = email.toLowerCase().trim();

  try {
    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await Otp.deleteMany({ email: user.email });
    await Otp.create({ email: user.email, code: resetCode, expiresAt });

    try {
      await sendMail(
        user.email,
        "Your password reset code",
        `Your password reset OTP is ${resetCode}. It expires in 15 minutes.`,
        undefined,
        "otp",
        { otp: resetCode, name: `${user.firstName} ${user.lastName}`.trim() },
      );
    } catch (mailError) {
      console.error("Password reset email error:", mailError);
      await Otp.deleteMany({ email: user.email });
      return res.status(500).json({
        status: "error",
        message: "Unable to send password reset email. Please try again later.",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Password reset code sent to your email.",
      email: user.email,
    });
  } catch (error: any) {
    console.error("Forgot password error:", error);
    return res.status(500).json({
      status: "error",
      message: error?.message || "Internal server error",
    });
  }
});

/* ==========================================================================
   RESET PASSWORD
   ========================================================================== */
authRouter.post("/reset-password", async (req: Request, res: Response) => {
  const { email, verificationCode, newPassword } = req.body || {};

  if (!email || !verificationCode || !newPassword) {
    return res.status(400).json({
      status: "error",
      message: "Email, reset code, and new password are required",
    });
  }

  const cleanEmail = email.toLowerCase().trim();

  try {
    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    const otp = await Otp.findOne({
      email: user.email,
      code: String(verificationCode).trim(),
    });
    if (!otp) {
      return res.status(400).json({
        status: "error",
        message: "Invalid reset code",
      });
    }

    if (new Date() > otp.expiresAt) {
      return res.status(400).json({
        status: "error",
        message: "Reset code expired",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    await Otp.deleteMany({ email: user.email });

    try {
      await sendMail(
        user.email,
        "Password Updated Successfully",
        "Your password has been changed successfully.",
        undefined,
        "password_reset_success",
        { name: `${user.firstName} ${user.lastName}`.trim() },
      );
    } catch (e) {
      console.error("Failed to send password reset confirmation email:", e);
    }

    return res.status(200).json({
      status: "success",
      message: "Password reset successfully",
    });
  } catch (error: any) {
    console.error("Reset password error:", error);
    return res.status(500).json({
      status: "error",
      message: error?.message || "Internal server error",
    });
  }
});

/* ==========================================================================
   ME / SESSION CHECK
   ========================================================================== */
const handleGetMe = async (req: Request, res: Response) => {
  try {
    const token = getAuthToken(
      req.headers.cookie,
      req.headers.authorization,
    );
    if (!token) {
      return res.status(401).json({
        status: "error",
        success: false,
        message: "Authentication token missing",
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId?: string;
      id?: string;
    };

    const userId = decoded.userId || decoded.id;
    if (!userId) {
      return res.status(401).json({
        status: "error",
        success: false,
        message: "Invalid token payload",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: "error",
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      status: "success",
      success: true,
      user: buildUserResponse(user),
    });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        status: "error",
        success: false,
        message: "Invalid or expired token",
      });
    }

    return res.status(500).json({
      status: "error",
      success: false,
      message: "Internal server error",
    });
  }
};

authRouter.get("/auth/me", handleGetMe);
authRouter.post("/auth/me", handleGetMe);
authRouter.get("/me", handleGetMe);
authRouter.post("/me", handleGetMe);

export default authRouter;
