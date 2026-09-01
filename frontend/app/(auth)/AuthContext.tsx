"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Session, User as SupabaseUser } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase";

export interface User {
  id: string;
  email?: string;
  name?: string;
  role?: string;
  avatar_url?: string;
  [key: string]: any;
}

export interface AuthContextType {
  user: User | null;
  session: Session | null;
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
  signInWithGoogle: () => Promise<{ status: "success" | "error"; message?: string }>;
  forgotPassword: (
    email: string,
  ) => Promise<{ status: "success" | "error"; message?: string }>;
  resetPassword: (
    newPassword: string,
  ) => Promise<{ status: "success" | "error"; message?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapSupabaseUser(sbUser: SupabaseUser | null): User | null {
  if (!sbUser) return null;

  const metadata = sbUser.user_metadata || {};
  const name =
    metadata.full_name ||
    metadata.name ||
    metadata.first_name
      ? `${metadata.first_name || ""} ${metadata.last_name || ""}`.trim()
      : sbUser.email?.split("@")[0] || "User";

  return {
    id: sbUser.id,
    email: sbUser.email,
    name: name,
    avatar_url: metadata.avatar_url || metadata.picture,
    role: metadata.role || "customer",
    ...metadata,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // 1. Initial Session Load
    const initializeAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Error fetching session:", error.message);
        }

        if (data?.session) {
          setSession(data.session);
          const mapped = mapSupabaseUser(data.session.user);
          setUser(mapped);
          if (mapped) {
            localStorage.setItem("user", JSON.stringify(mapped));
          }
        } else {
          // Check localStorage fallback
          const savedUser = localStorage.getItem("user");
          if (savedUser) {
            try {
              if (savedUser.startsWith("{")) {
                setUser(JSON.parse(savedUser));
              }
            } catch {}
          }
        }
      } catch (err) {
        console.error("Supabase init error:", err);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // 2. Auth State Change Listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      setSession(newSession);
      if (newSession?.user) {
        const mapped = mapSupabaseUser(newSession.user);
        setUser(mapped);
        if (mapped) {
          localStorage.setItem("user", JSON.stringify(mapped));
        }
      } else {
        setUser(null);
        localStorage.removeItem("user");
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        return {
          status: "error" as const,
          message: error.message,
        };
      }

      if (data.user) {
        const mapped = mapSupabaseUser(data.user);
        setUser(mapped);
        if (mapped) {
          localStorage.setItem("user", JSON.stringify(mapped));
        }
        router.push("/dashboard");
        return {
          status: "success" as const,
          user: mapped || undefined,
        };
      }

      return {
        status: "error" as const,
        message: "Unable to sign in. Please check your credentials.",
      };
    } catch (err: any) {
      return {
        status: "error" as const,
        message: err?.message || "An unexpected error occurred while logging in.",
      };
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const nameParts = name.trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: name.trim(),
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (error) {
        return {
          status: "error" as const,
          message: error.message,
        };
      }

      if (data.user) {
        const mapped = mapSupabaseUser(data.user);
        setUser(mapped);
        if (mapped) {
          localStorage.setItem("user", JSON.stringify(mapped));
        }

        // If session was returned immediately (email confirmation disabled)
        if (data.session) {
          router.push("/dashboard");
        }

        return {
          status: "success" as const,
          message: data.session
            ? "Account created successfully!"
            : "Confirmation link sent to your email. Please verify your account.",
          user: mapped || undefined,
        };
      }

      return {
        status: "error" as const,
        message: "Registration failed. Please try again.",
      };
    } catch (err: any) {
      return {
        status: "error" as const,
        message: err?.message || "An unexpected error occurred while registering.",
      };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const redirectTo =
        typeof window !== "undefined"
          ? `${window.location.origin}/dashboard`
          : undefined;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
        },
      });

      if (error) {
        return {
          status: "error" as const,
          message: error.message,
        };
      }

      return { status: "success" as const };
    } catch (err: any) {
      return {
        status: "error" as const,
        message: err?.message || "Failed to initialize Google login.",
      };
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const redirectTo =
        typeof window !== "undefined"
          ? `${window.location.origin}/forgot-password?view=update`
          : undefined;

      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo,
      });

      if (error) {
        return {
          status: "error" as const,
          message: error.message,
        };
      }

      return {
        status: "success" as const,
        message: "Password reset link sent to your email.",
      };
    } catch (err: any) {
      return {
        status: "error" as const,
        message: err?.message || "Failed to send reset link.",
      };
    }
  };

  const resetPassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        return {
          status: "error" as const,
          message: error.message,
        };
      }

      return {
        status: "success" as const,
        message: "Password updated successfully!",
      };
    } catch (err: any) {
      return {
        status: "error" as const,
        message: err?.message || "Failed to reset password.",
      };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Error signing out:", err);
    } finally {
      localStorage.removeItem("user");
      setUser(null);
      setSession(null);
      router.push("/login");
    }
  };

  const contextValue: AuthContextType = {
    user,
    session,
    loading,
    login,
    register,
    signInWithGoogle,
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
