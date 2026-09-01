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
import { useState, Suspense } from "react";
import { useAuth } from "../AuthContext";
import toast from "react-hot-toast";

function ForgotPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const auth = useAuth();

  const isUpdateView = searchParams.get("view") === "update";

  const [email, setEmail] = useState("");
  const [sentSuccess, setSentSuccess] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }

    setLoading(true);
    try {
      if (auth?.forgotPassword) {
        const res = await auth.forgotPassword(email);
        if (res.status === "success") {
          toast.success(res.message || "Reset link sent!");
          setSentSuccess(true);
        } else {
          toast.error(res.message || "Unable to send reset link. Please try again.");
        }
      }
    } catch (err: any) {
      toast.error(err?.message || "An error occurred while sending the reset link.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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
        const res = await auth.resetPassword(email, newPassword);
        if (res.status === "success") {
          toast.success("Password updated successfully!");
          router.push("/login");
        } else {
          toast.error(res.message || "Unable to reset password. Please try again.");
        }
      }
    } catch (err: any) {
      toast.error(err?.message || "An error occurred while updating your password.");
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

            <h1>
              Your kitchen favourites are waiting for you.
            </h1>

            <p>
              Enter your email and we'll send a secure password reset link directly to your inbox via Supabase.
            </p>
          </div>

          <div className={styles.storyNote}>
            <span className={styles.noteIcon}>
              <ShieldCheck size={19} />
            </span>

            <span>
              Secure reset links expire automatically for your protection.
            </span>
          </div>
        </aside>

        {!isUpdateView ? (
          !sentSuccess ? (
            <div className={styles.formPanel}>
              <span className={styles.pill}>
                <KeyRound size={14} /> Account recovery
              </span>

              <h2>Forgot your password?</h2>

              <p className={styles.intro}>
                No worries. We’ll email you a secure link to choose a new one.
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
                      Sending reset link...
                    </span>
                  ) : (
                    <span className={styles.btnContent}>
                      <span>Send reset link</span>
                      <ArrowRight size={18} className={styles.btnArrow} />
                    </span>
                  )}
                </button>
              </form>

              <div className={styles.helpCard}>
                <Mail size={18} />
                <div>
                  <strong>Check your inbox</strong>
                  <p style={{ margin: 0, marginTop: '4px', fontSize: '13px', color: '#666' }}>
                    We’ll send a password recovery link to your email address.
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
                <CheckCircle2 size={14} color="#16a34a" /> Email Sent
              </span>

              <h2>Check your inbox</h2>

              <p className={styles.intro}>
                We’ve sent a password reset link to <strong>{email}</strong>.
              </p>

              <div className={styles.helpCard}>
                <Mail size={18} />
                <div>
                  <strong>Click the link in the email</strong>
                  <p style={{ margin: 0, marginTop: '4px', fontSize: '13px', color: '#666' }}>
                    Follow the link in your email to choose your new password.
                  </p>
                </div>
              </div>

              <Link href="/login" className={styles.backLink} style={{ marginTop: '24px' }}>
                <ArrowLeft size={16} />
                Back to sign in
              </Link>
            </div>
          )
        ) : (
          <div className={styles.formPanel}>
            <span className={styles.pill}>
              <KeyRound size={14} /> Reset password
            </span>

            <h2>Create a new password</h2>

            <p className={styles.intro}>
              Enter your new password below.
            </p>

            <form className={styles.form} onSubmit={handleResetPasswordSubmit}>
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

            <Link href="/login" className={styles.backLink}>
              <ArrowLeft size={16} />
              Back to sign in
            </Link>
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
