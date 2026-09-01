'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../AuthContext";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Check,
  Sparkles,
  ShieldCheck,
  Star,
  ArrowRight,
  ChefHat,
  Truck,
  Leaf,
  KeyRound,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import "./login.css";

export default function Login() {
  const router = useRouter();
  const auth = useAuth();
  const [loginMode, setLoginMode] = useState<"password" | "otp">("password");
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);

  // Countdown timer for Resend OTP
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setUnverifiedEmail(null);
  };

  // Password Login
  const handlePasswordSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }

    if (!formData.password) {
      toast.error("Please enter your password.");
      return;
    }

    setLoading(true);
    try {
      if (auth?.login) {
        const res = await auth.login(formData.email.trim(), formData.password);
        if (res.status === "success") {
          toast.success("Welcome back to Aira Pickles!");
          router.push("/dashboard");
        } else {
          if (res.message?.toLowerCase().includes("verify your email")) {
            setUnverifiedEmail(formData.email.trim());
          }
          toast.error(res.message || "Invalid email or password. Please try again.");
        }
      }
    } catch (error: any) {
      toast.error(error?.message || "Unable to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Send Login OTP
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!formData.email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }

    setLoading(true);
    try {
      if (auth?.sendLoginOtp) {
        const res = await auth.sendLoginOtp(formData.email.trim());
        if (res.status === "success") {
          toast.success("Login OTP sent to your email!");
          setOtpSent(true);
          setResendTimer(30);
        } else {
          toast.error(res.message || "Failed to send OTP. Please try again.");
        }
      }
    } catch (error: any) {
      toast.error(error?.message || "Unable to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  // Verify Login OTP
  const handleVerifyOtpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const cleanOtp = otpCode.trim();
    if (!cleanOtp) {
      toast.error("Please enter the 6-digit OTP.");
      return;
    }

    setLoading(true);
    try {
      if (auth?.loginWithOtp) {
        const res = await auth.loginWithOtp(formData.email.trim(), cleanOtp);
        if (res.status === "success") {
          toast.success("Signed in successfully!");
          router.push("/dashboard");
        } else {
          toast.error(res.message || "Invalid or expired OTP.");
        }
      }
    } catch (error: any) {
      toast.error(error?.message || "Unable to verify OTP.");
    } finally {
      setLoading(false);
    }
  };

  // Switch to OTP verification directly for unverified user
  const handleStartOtpVerification = async () => {
    setLoginMode("otp");
    setUnverifiedEmail(null);
    await handleSendOtp();
  };

  const handleGoogleSignIn = () => {
    toast("Google Sign-In is configured on the mobile application.");
  };

  return (
    <div className="auth-page">
      <div className="auth-bg-glow glow-top-left" />
      <div className="auth-bg-glow glow-bottom-right" />

      <div className="auth-card">
        <aside className="auth-panel">
          <div className="auth-panel-header">
            <Link href="/" className="auth-brand-link">
              <div className="auth-brand-logo-wrapper">
                <img src="/aira-pickles-logo.png" alt="Aira Pickles logo" className="auth-brand-logo" />
              </div>
              <div className="auth-brand-text">
                <span className="brand-name">Aira</span>
                <span className="brand-sub">Pickles</span>
              </div>
            </Link>
            <div className="auth-badge">
              <Sparkles className="badge-icon" size={14} />
              <span>Handcrafted Batch #408</span>
            </div>
          </div>

          <div className="auth-panel-copy">
            <span className="editorial-kicker">Artisanal Heritage</span>
            <h1>Taste the authentic warmth of home-made recipes</h1>
            <p>
              Sign in to manage your artisanal pickle subscriptions, unlock secret kitchen rewards, and enjoy express doorstep delivery.
            </p>
          </div>

          <div className="auth-panel-features">
            <div className="feature-item">
              <div className="feature-icon">
                <Leaf size={18} />
              </div>
              <div className="feature-content">
                <h3>100% Handcrafted Freshness</h3>
                <p>Pure ingredients, sun-cured spices & traditional home recipes.</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">
                <Truck size={18} />
              </div>
              <div className="feature-content">
                <h3>Express Doorstep Delivery</h3>
                <p>Track your freshly sealed jars from our kitchen straight to your door.</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">
                <ShieldCheck size={18} />
              </div>
              <div className="feature-content">
                <h3>Encrypted & Private</h3>
                <p>Bank-grade account protection for hassle-free reordering.</p>
              </div>
            </div>
          </div>

          <div className="auth-hero-showcase">
            <div className="showcase-frame">
              <img src="/artisanal-hero.jpg" alt="Artisanal Pickle Jars Showcase" />
              <div className="showcase-overlay">
                <div className="showcase-rating">
                  <div className="stars">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className="star-filled" />
                    ))}
                  </div>
                  <span>4.9 / 5 (1,200+ Reviews)</span>
                </div>
                <p className="showcase-caption">Spicy Mango & Lime Achar • Signature Collection</p>
              </div>
            </div>
          </div>
        </aside>

        <main className="auth-form-panel">
          <div className="auth-form-head">
            <div className="auth-welcome-pill">
              <ChefHat size={15} />
              <span>Welcome Back</span>
            </div>
            <h2>Sign In to your Account</h2>
            <p>Select your preferred sign in method below.</p>
          </div>

          {/* Mode Switcher */}
          <div className="auth-mode-switcher">
            <button
              type="button"
              className={`auth-mode-tab ${loginMode === "password" ? "auth-mode-tab-active" : ""}`}
              onClick={() => {
                setLoginMode("password");
                setUnverifiedEmail(null);
              }}
            >
              <Lock size={15} />
              <span>Password</span>
            </button>
            <button
              type="button"
              className={`auth-mode-tab ${loginMode === "otp" ? "auth-mode-tab-active" : ""}`}
              onClick={() => setLoginMode("otp")}
            >
              <KeyRound size={15} />
              <span>Email OTP</span>
            </button>
          </div>

          {/* Unverified Email Prompt */}
          {unverifiedEmail && (
            <div className="unverified-alert">
              <div>
                <strong>Email not verified</strong>
                <p style={{ margin: 0, fontSize: "0.8rem" }}>
                  Verify your account using a one-time passcode.
                </p>
              </div>
              <button
                type="button"
                className="unverified-btn"
                onClick={handleStartOtpVerification}
              >
                Verify with OTP
              </button>
            </div>
          )}

          {/* PASSWORD MODE FORM */}
          {loginMode === "password" && (
            <form className="auth-form" onSubmit={handlePasswordSubmit} autoComplete="off">
              <label className="auth-field">
                <span className="field-label">Email Address</span>
                <div className="input-input-wrapper">
                  <Mail className="input-icon" size={18} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="name@example.com"
                    autoComplete="email"
                    required
                  />
                </div>
              </label>

              <label className="auth-field">
                <div className="auth-label-row">
                  <span className="field-label">Password</span>
                  <Link href="/forgot-password" className="auth-link-btn">
                    Forgot password?
                  </Link>
                </div>
                <div className="input-input-wrapper">
                  <Lock className="input-icon" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••••••"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </label>

              <div className="auth-options-row">
                <label className="auth-checkbox">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span className="checkbox-custom">
                    {rememberMe && <Check size={12} />}
                  </span>
                  <span className="checkbox-label">Keep me signed in</span>
                </label>
              </div>

              <button className="auth-btn" type="submit" disabled={loading}>
                {loading ? (
                  <span className="btn-loading-state">
                    <span className="spinner" />
                    Signing in...
                  </span>
                ) : (
                  <span className="btn-content">
                    <span>Sign In</span>
                    <ArrowRight size={18} className="btn-arrow" />
                  </span>
                )}
              </button>
            </form>
          )}

          {/* EMAIL OTP MODE */}
          {loginMode === "otp" && (
            <div className="auth-form">
              <label className="auth-field">
                <span className="field-label">Email Address</span>
                <div className="input-input-wrapper">
                  <Mail className="input-icon" size={18} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="name@example.com"
                    autoComplete="email"
                    disabled={otpSent}
                    required
                  />
                </div>
              </label>

              {otpSent ? (
                <form onSubmit={handleVerifyOtpSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <label className="auth-field">
                    <span className="field-label">Enter 6-Digit OTP</span>
                    <div className="input-input-wrapper">
                      <input
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={6}
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                        className="otp-digit-input"
                        placeholder="123456"
                        autoFocus
                        required
                      />
                    </div>
                  </label>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.85rem" }}>
                    {resendTimer > 0 ? (
                      <span style={{ color: "#78716c", fontWeight: "600" }}>
                        Resend OTP in {resendTimer}s
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSendOtp()}
                        disabled={loading}
                        style={{ background: "none", border: "none", color: "#650700", fontWeight: "700", cursor: "pointer", textDecoration: "underline" }}
                      >
                        Resend OTP
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setOtpSent(false);
                        setOtpCode("");
                      }}
                      style={{ background: "none", border: "none", color: "#78716c", cursor: "pointer", textDecoration: "underline" }}
                    >
                      Change email
                    </button>
                  </div>

                  <button className="auth-btn" type="submit" disabled={loading}>
                    {loading ? (
                      <span className="btn-loading-state">
                        <span className="spinner" />
                        Verifying OTP...
                      </span>
                    ) : (
                      <span className="btn-content">
                        <span>Verify & Sign In</span>
                        <ArrowRight size={18} className="btn-arrow" />
                      </span>
                    )}
                  </button>
                </form>
              ) : (
                <button
                  className="auth-btn"
                  type="button"
                  onClick={() => handleSendOtp()}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="btn-loading-state">
                      <span className="spinner" />
                      Sending OTP...
                    </span>
                  ) : (
                    <span className="btn-content">
                      <span>Send Login OTP</span>
                      <ArrowRight size={18} className="btn-arrow" />
                    </span>
                  )}
                </button>
              )}
            </div>
          )}

          <div className="auth-divider">
            <span>or continue with</span>
          </div>

          <button
            className="auth-google-btn"
            type="button"
            onClick={handleGoogleSignIn}
          >
            <svg className="google-icon" viewBox="0 0 24 24" width="20" height="20">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Sign in with Google</span>
          </button>

          <p className="auth-register">
            Don’t have an account?{" "}
            <Link href="/register" className="register-link">
              Create an account
            </Link>
          </p>
        </main>
      </div>
    </div>
  );
}

