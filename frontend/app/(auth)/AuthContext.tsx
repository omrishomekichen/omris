"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Api from "../__apis/api";

export interface User {
  id: string;
  _id?: string;
  email?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  verified?: boolean;
  avatar_url?: string;
  [key: string]: any;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (
    email: string,
    password: string,
  ) => Promise<{ status: "success" | "error"; message?: string; user?: User }>;
  register: (
    name: string,
    email: string,
    password: string,
  ) => Promise<{ status: "success" | "error"; message?: string; user?: User }>;
  verifyEmail: (
    email: string,
    verificationCode: string,
  ) => Promise<{ status: "success" | "error"; message?: string; user?: User }>;
  sendLoginOtp: (
    email: string,
  ) => Promise<{ status: "success" | "error"; message?: string }>;
  loginWithOtp: (
    email: string,
    verificationCode: string,
  ) => Promise<{ status: "success" | "error"; message?: string; user?: User }>;
  forgotPassword: (
    email: string,
  ) => Promise<{ status: "success" | "error"; message?: string }>;
  resetPassword: (
    email: string,
    newPassword: string,
    verificationCode?: string,
  ) => Promise<{ status: "success" | "error"; message?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        try {
          if (savedUser.startsWith("{")) {
            setUser(JSON.parse(savedUser));
          } else {
            setUser({ id: "1", email: savedUser, name: savedUser });
          }
        } catch {}
      }

      try {
        const res = await Api.me();
        if (res?.status === "success" && res?.user) {
          setUser(res.user);
          localStorage.setItem("user", JSON.stringify(res.user));
        } else if (res?.status === "error") {
          localStorage.removeItem("user");
          setUser(null);
        }
      } catch {
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await Api.login(email, password);
      if (response.status === "success") {
        if (response.user) {
          localStorage.setItem("user", JSON.stringify(response.user));
          setUser(response.user);
        }
        router.push("/dashboard");
        return {
          status: "success" as const,
          user: response.user,
          message: response.message,
        };
      }
      return {
        status: "error" as const,
        message: response.message || "Invalid email or password.",
      };
    } catch (err: any) {
      return {
        status: "error" as const,
        message: err?.message || "An error occurred while logging in.",
      };
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await Api.register(name, email, password);
      if (response.status === "success") {
        if (response.user) {
          localStorage.setItem("user", JSON.stringify(response.user));
          setUser(response.user);
        }
        return {
          status: "success" as const,
          user: response.user,
          message: response.message || "Account created successfully.",
        };
      }
      return {
        status: "error" as const,
        message: response.message || "Registration failed. Please try again.",
      };
    } catch (err: any) {
      return {
        status: "error" as const,
        message: err?.message || "An error occurred while registering.",
      };
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const response = await Api.forgotPassword(email);
      if (response.status === "success") {
        return {
          status: "success" as const,
          message: response.message || "Password reset code sent to your email.",
        };
      }
      return {
        status: "error" as const,
        message: response.message || "Failed to process forgot password request.",
      };
    } catch (err: any) {
      return {
        status: "error" as const,
        message: err?.message || "Network error requesting password reset.",
      };
    }
  };

  const resetPassword = async (
    email: string,
    newPassword: string,
    verificationCode: string = "",
  ) => {
    try {
      const response = await Api.resetPassword(email, verificationCode, newPassword);
      if (response.status === "success") {
        return {
          status: "success" as const,
          message: response.message || "Password reset successfully.",
        };
      }
      return {
        status: "error" as const,
        message: response.message || "Failed to reset password.",
      };
    } catch (err: any) {
      return {
        status: "error" as const,
        message: err?.message || "Network error resetting password.",
      };
    }
  };


  const verifyEmail = async (email: string, verificationCode: string) => {
    try {
      const response = await Api.verifyEmail(email, verificationCode);
      if (response.status === "success") {
        if (response.user) {
          localStorage.setItem("user", JSON.stringify(response.user));
          setUser(response.user);
        }
        return {
          status: "success" as const,
          user: response.user,
          message: response.message || "Email verified successfully.",
        };
      }
      return {
        status: "error" as const,
        message: response.message || "Invalid or expired verification code.",
      };
    } catch (err: any) {
      return {
        status: "error" as const,
        message: err?.message || "An error occurred while verifying email.",
      };
    }
  };

  const sendLoginOtp = async (email: string) => {
    try {
      const response = await Api.sendLoginOtp(email);
      if (response.status === "success") {
        return {
          status: "success" as const,
          message: response.message || "OTP sent successfully to your email.",
        };
      }
      return {
        status: "error" as const,
        message: response.message || "Failed to send OTP.",
      };
    } catch (err: any) {
      return {
        status: "error" as const,
        message: err?.message || "Network error while sending OTP.",
      };
    }
  };

  const loginWithOtp = async (email: string, verificationCode: string) => {
    try {
      const response = await Api.verifyLogin(email, verificationCode);
      if (response.status === "success") {
        if (response.user) {
          localStorage.setItem("user", JSON.stringify(response.user));
          setUser(response.user);
        }
        router.push("/dashboard");
        return {
          status: "success" as const,
          user: response.user,
          message: response.message || "Logged in successfully.",
        };
      }
      return {
        status: "error" as const,
        message: response.message || "Invalid or expired OTP.",
      };
    } catch (err: any) {
      return {
        status: "error" as const,
        message: err?.message || "An error occurred while verifying OTP.",
      };
    }
  };

  const logout = async () => {
    try {
      await Api.logout();
    } catch (err) {
      console.error("Logout API error:", err);
    } finally {
      localStorage.removeItem("user");
      setUser(null);
      router.push("/login");
    }
  };

  const contextValue: AuthContextType = {
    user,
    loading,
    login,
    register,
    verifyEmail,
    sendLoginOtp,
    loginWithOtp,
    forgotPassword,
    resetPassword,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}
