'use client';

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ChefHat,
  KeyRound,
  Mail,
  ShieldCheck,
  CheckCircle2,
  LockKeyhole,
} from "lucide-react";
import styles from "../auth-pages.module.css";
import { useEffect, useState, Suspense } from "react";
import { useAuth } from "../AuthContext";
import toast from "react-hot-toast";

function ForgotPasswordContent() {
  const router = useRouter();
  const auth = useAuth();

  const [step, setStep] = useState<"email" | "reset">("email");
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // Countdown timer for Resend OTP
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const handleForgotSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }

    setLoading(true);
    try {
      if (auth?.forgotPassword) {
        const res = await auth.forgotPassword(email.trim());
        if (res.status === "success") {
          toast.success(res.message || "Password reset code sent to your email!");
          setStep("reset");
          setResendTimer(30);
        } else {
          toast.error(res.message || "Unable to send reset code. Please try again.");
        }
      }
    } catch (err: any) {
      toast.error(err?.message || "An error occurred while sending the reset code.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!otpCode.trim()) {
      toast.error("Please enter the 6-digit verification code.");
      return;
    }

    if (!newPassword) {
      toast.error("Please enter a new password.");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      if (auth?.resetPassword) {
        const res = await auth.resetPassword(email.trim(), newPassword, otpCode.trim());
        if (res.status === "success") {
          toast.success("Password updated successfully! Please sign in.");
          router.push("/login");
        } else {
          toast.error(res.message || "Unable to reset password. Please check your OTP code.");
        }
      }
    } catch (err: any) {
      toast.error(err?.message || "An error occurred while updating your password.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    setLoading(true);
    try {
      if (auth?.forgotPassword) {
        const res = await auth.forgotPassword(email.trim());
        if (res.status === "success") {
          toast.success("New reset code sent to your email!");
          setResendTimer(30);
        } else {
          toast.error(res.message || "Unable to resend reset code.");
        }
      }
    } catch (err: any) {
      toast.error("Failed to resend reset code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <aside className={styles.story}>
          <Link href="/" className={styles.brand}>
            <img
              src="/aira-pickles-logo.png"
              alt="Aira Pickles"
              className={styles.logo}
            />
            <span>
              <span className={styles.brandName}>Aira</span>
              <span className={styles.brandSub}>Pickles</span>
            </span>
          </Link>

          <div className={styles.storyCopy}>
            <span className={styles.kicker}>
              <ChefHat size={15} /> We’ll help you get back in
            </span>

            <h1>Your kitchen favourites are waiting for you.</h1>

            <p>
              Enter your email and we'll send a secure one-time passcode to reset your password.
            </p>
          </div>

          <div className={styles.storyNote}>
            <span className={styles.noteIcon}>
              <ShieldCheck size={19} />
            </span>

            <span>Secure OTP codes expire automatically for your protection.</span>
          </div>
        </aside>

        {step === "email" ? (
          <div className={styles.formPanel}>
            <span className={styles.pill}>
              <KeyRound size={14} /> Account recovery
            </span>

            <h2>Forgot your password?</h2>

            <p className={styles.intro}>
              No worries. Enter your registered email to receive a reset code.
            </p>

            <form className={styles.form} onSubmit={handleForgotSubmit}>
              <label className={styles.field}>
                Email address
                <div className={styles.inputWrap}>
                  <input
                    className={styles.input}
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Mail className={styles.inputIcon} size={17} />
                </div>
              </label>

              <button
                type="submit"
                className={`${styles.button} ${loading ? styles.loading : ""}`}
                disabled={loading}
              >
                {loading ? (
                  <span className={styles.btnLoadingState}>
                    <span className={styles.spinner} />
                    Sending reset code...
                  </span>
                ) : (
                  <span className={styles.btnContent}>
                    <span>Send Reset Code</span>
                    <ArrowRight size={18} className={styles.btnArrow} />
                  </span>
                )}
              </button>
            </form>

            <div className={styles.helpCard}>
              <Mail size={18} />
              <div>
                <strong>Check your inbox</strong>
                <p style={{ margin: 0, marginTop: "4px", fontSize: "13px", color: "#666" }}>
                  We’ll send a 6-digit reset code to your email address.
                </p>
              </div>
            </div>

            <Link href="/login" className={styles.backLink}>
              <ArrowLeft size={16} />
              Back to sign in
            </Link>
          </div>
        ) : (
          <div className={styles.formPanel}>
            <span className={styles.pill}>
              <KeyRound size={14} /> Reset password
            </span>

            <h2>Create a new password</h2>

            <p className={styles.intro}>
              Enter the 6-digit code sent to <strong>{email}</strong> and your new password.
            </p>

            <form className={styles.form} onSubmit={handleResetPasswordSubmit}>
              <label className={styles.field}>
                6-Digit Reset Code
                <div className={styles.inputWrap}>
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                    className={`${styles.input} ${styles.otpInput}`}
                    placeholder="123456"
                    autoFocus
                    required
                  />
                </div>
              </label>

              <div className={styles.otpRow}>
                {resendTimer > 0 ? (
                  <span className={styles.timerBadge}>
                    Resend code in {resendTimer}s
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={loading}
                    className={styles.resendBtn}
                  >
                    Resend Code
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setStep("email")}
                  className={styles.textLink}
                  style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.85rem" }}
                >
                  Change email
                </button>
              </div>

              <label className={styles.field}>
                New password
                <div className={styles.inputWrap}>
                  <input
                    className={styles.input}
                    type="password"
                    placeholder="Enter new password (min 6 characters)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <LockKeyhole className={styles.inputIcon} size={17} />
                </div>
              </label>

              <label className={styles.field}>
                Confirm password
                <div className={styles.inputWrap}>
                  <input
                    className={styles.input}
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <ShieldCheck className={styles.inputIcon} size={17} />
                </div>
              </label>

              <button
                type="submit"
                className={`${styles.button} ${loading ? styles.loading : ""}`}
                disabled={loading}
              >
                {loading ? (
                  <span className={styles.btnLoadingState}>
                    <span className={styles.spinner} />
                    Updating password...
                  </span>
                ) : (
                  <span className={styles.btnContent}>
                    <span>Save new password</span>
                    <ArrowRight size={18} className={styles.btnArrow} />
                  </span>
                )}
              </button>
            </form>

            <button
              type="button"
              onClick={() => setStep("email")}
              className={styles.backLink}
            >
              <ArrowLeft size={16} />
              Back to email
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '80vh' }} />}>
      <ForgotPasswordContent />
    </Suspense>
  );
}
