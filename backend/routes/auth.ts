import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { User } from "../model/user";
import { Otp } from "../model/otp";
import { sendMail } from "../ulits/mail";

const authRouter: express.Router = express.Router();

const buildUserResponse = (user: any) => ({
  id: user._id,
  name: `${user.firstName} ${user.lastName}`.trim(),
  email: user.email,
  verified: user.verified,
});

authRouter.post("/register", async (req: Request, res: Response) => {
  const { fullName, email, password, agreeToTerms } = req.body || {};

  if (!fullName || !email || !password) {
    return res.status(400).json({
      status: "error",
      message: "Missing required registration fields",
    });
  }

  try {
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        status: "error",
        message: "Email already registered",
      });
    }

    const [firstName, ...rest] = fullName.trim().split(" ");
    const lastName = rest.join(" ");
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationExpires = new Date(Date.now() + 15 * 60 * 1000);

    const user = new User({
      firstName,
      lastName,
      email: email.toLowerCase(),
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
        { otp: verificationCode, name: fullName },
      );
    } catch (mailError) {
      console.error("Verification email error:", mailError);
      await User.deleteOne({ _id: user._id });
      await Otp.deleteMany({ email: user.email });
      return res.status(500).json({
        status: "error",
        message: "Unable to send verification email. Please check your email address and try again.",
      });
    }

    return res.status(201).json({
      status: "success",
      message: "User registered successfully. Check your email for the verification code.",
      email: user.email,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

authRouter.post("/verify", async (req: Request, res: Response) => {
  const { email, verificationCode } = req.body || {};

  if (!email || !verificationCode) {
    return res.status(400).json({
      status: "error",
      message: "Email and verification code are required",
    });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    if (user.verified) {
      return res.status(400).json({
        status: "error",
        message: "Email already verified",
      });
    }

    const otp = await Otp.findOne({ email: user.email, code: verificationCode });
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
    await Otp.deleteMany({ email: user.email });

    // Send Welcome Email
    try {
      await sendMail(
        user.email,
        "Welcome to Omri's Home Kitchen",
        `Welcome to Omri's Home Kitchen, ${user.firstName}!`,
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
    });
  } catch (error) {
    console.error("Verification error:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

authRouter.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({
      status: "error",
      message: "Missing email or password",
    });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
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

    const token = randomUUID();
    const updatedUser = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { $set: { token } },
      { returnDocument: 'after' },
    );

    return res.status(200).json({
      status: "success",
      token,
      updatedUser,
      user: buildUserResponse(user),
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});


authRouter.post("/forgot-password", async (req: Request, res: Response) => {
  const { email } = req.body || {};

  if (!email) {
    return res.status(400).json({
      status: "error",
      message: "Email is required",
    });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
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
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

authRouter.post("/reset-password", async (req: Request, res: Response) => {
  const { email, verificationCode, newPassword } = req.body || {};

  if (!email || !verificationCode || !newPassword) {
    return res.status(400).json({
      status: "error",
      message: "Email, reset code, and new password are required",
    });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    const otp = await Otp.findOne({ email: user.email, code: verificationCode });
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

    // Send Password Reset Success Notification
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
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

export default authRouter;


