import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../model/user";
import { Otp } from "../model/otp";
import { sendMail } from "../ulits/mail";
import { supabase } from "../config/supabase";
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
  verified: user.verified ?? true,
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
  const [firstName, ...rest] = fullName.trim().split(" ");
  const lastName = rest.join(" ");

  try {
    let supabaseUserId: string | undefined;

    // 1. Attempt Sign up on Supabase Auth
    try {
      const { data: sbData, error: sbError } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            first_name: firstName,
            lastName: lastName,
          },
        },
      });

      if (sbError) {
        console.warn("[Register] Supabase sign up warning:", sbError.message);
        if (sbError.message.toLowerCase().includes("already registered")) {
          const existingUser = await User.findOne({ email: cleanEmail });
          if (existingUser) {
            return res.status(400).json({
              status: "error",
              message: "An account with this email already exists. Please sign in.",
            });
          }
        }
      } else {
        supabaseUserId = sbData.user?.id;
      }
    } catch (sbErr: any) {
      console.warn("[Register] Supabase connection error:", sbErr?.message);
    }

    // 2. Sync to MongoDB database
    let user = await User.findOne({ email: cleanEmail });
    if (user) {
      return res.status(400).json({
        status: "error",
        message: "An account with this email already exists. Please sign in.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({
      firstName,
      lastName,
      email: cleanEmail,
      password: hashedPassword,
      agreeToTerms: typeof agreeToTerms === "boolean" ? agreeToTerms : true,
      verified: true,
    });
    await user.save();

    // 3. Send welcome email asynchronously via mail service
    try {
      sendMail(
        cleanEmail,
        "Welcome to Aira Pickles!",
        `Hello ${firstName || "there"}, welcome to Aira Pickles!`,
        undefined,
        "welcome",
        { name: fullName.trim() },
      ).catch((err) => console.error("[Mail Error]", err));
    } catch {}

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`.trim(),
        supabaseId: supabaseUserId,
      },
      JWT_SECRET,
      { expiresIn: "7d" },
    );
    res.cookie(AUTH_COOKIE_NAME, token, authCookieOptions);

    return res.status(201).json({
      status: "success",
      message: "User registered successfully.",
      user: buildUserResponse(user),
      token,
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
    // 1. Authenticate with Supabase Auth
    const { data: sbData, error: sbError } =
      await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

    if (sbError) {
      // Fallback: check legacy local database if user hasn't migrated yet
      const legacyUser = await User.findOne({ email: cleanEmail });
      if (legacyUser && (await bcrypt.compare(password, legacyUser.password))) {
        // Create Supabase account on the fly for legacy user
        await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: {
              full_name: `${legacyUser.firstName} ${legacyUser.lastName}`.trim(),
              first_name: legacyUser.firstName,
              last_name: legacyUser.lastName,
            },
          },
        });

        const token = jwt.sign(
          {
            userId: legacyUser._id,
            email: legacyUser.email,
            name: `${legacyUser.firstName} ${legacyUser.lastName}`.trim(),
          },
          JWT_SECRET,
          { expiresIn: "7d" },
        );
        res.cookie(AUTH_COOKIE_NAME, token, authCookieOptions);

        return res.status(200).json({
          status: "success",
          user: buildUserResponse(legacyUser),
          token,
        });
      }

      return res.status(401).json({
        status: "error",
        message: sbError.message || "Invalid email or password",
      });
    }

    // 2. Sync / Find Mongo User record
    let user = await User.findOne({ email: cleanEmail });
    if (!user) {
      const nameParts = (
        sbData.user?.user_metadata?.full_name ||
        cleanEmail.split("@")[0]
      ).split(" ");
      const firstName = nameParts[0] || "User";
      const lastName = nameParts.slice(1).join(" ") || "";
      const hashedPassword = await bcrypt.hash(password, 10);

      user = new User({
        firstName,
        lastName,
        email: cleanEmail,
        password: hashedPassword,
        agreeToTerms: true,
        verified: true,
      });
      await user.save();
    }

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`.trim(),
        supabaseId: sbData.user?.id,
      },
      JWT_SECRET,
      { expiresIn: "7d" },
    );
    res.cookie(AUTH_COOKIE_NAME, token, authCookieOptions);

    return res.status(200).json({
      status: "success",
      user: buildUserResponse(user),
      token: sbData.session?.access_token || token,
      session: sbData.session,
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
authRouter.post("/logout", async (_req: Request, res: Response) => {
  try {
    await supabase.auth.signOut();
  } catch (e) {
    console.error("Supabase signOut error:", e);
  }

  const { maxAge, ...clearCookieOptions } = authCookieOptions;
  res.clearCookie(AUTH_COOKIE_NAME, clearCookieOptions);
  return res.status(200).json({ status: "success", message: "Logged out successfully" });
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
    const { error: sbError } = await supabase.auth.resetPasswordForEmail(
      cleanEmail,
      {
        redirectTo: "http://localhost:3000/forgot-password?view=update",
      },
    );

    if (sbError) {
      return res.status(400).json({
        status: "error",
        message: sbError.message,
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Password reset link sent to your email via Supabase.",
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
  const { email, newPassword } = req.body || {};

  if (!newPassword) {
    return res.status(400).json({
      status: "error",
      message: "New password is required",
    });
  }

  try {
    if (email) {
      const user = await User.findOne({ email: email.toLowerCase().trim() });
      if (user) {
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
      }
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
    const token = getAuthToken(req.headers.cookie);
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
