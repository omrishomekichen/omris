'use client';

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ChefHat,
  KeyRound,
  Mail,
  ShieldCheck,
  AlertCircle,
  X,
} from "lucide-react";
import styles from "../auth-pages.module.css";
import { useState } from "react";
import Api from "../../__apis/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const [verificationCode, setVerificationCode] = useState("");

  const [error, setError] = useState("");

  const [sentotp, setSentOtp] = useState(false);

  const [passopen, setPassOpen] = useState(false);

  const [newPassword, setNewPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);


  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);

      const req = await Api.forgotPassword(email);

      if (req.status === "success") {
        setSentOtp(true);
      } else {
        setError(
          req.message ||
            "Unable to send OTP. Please try again."
        );
      }
    } catch (err) {
      console.error(err);

      setError(
        "An error occurred while sending the OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  
  
  

  const handleContinue = () => {
    setError("");
    setPassOpen(true);
  };

  
  
  

  const handlePasswordSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");

    if (!verificationCode || !/^[0-9]{6}$/.test(verificationCode.trim())) {
      setError("Please enter the six-digit reset code sent to your email.");
      return;
    }

    if (!newPassword) {
      setError("Please enter a new password.");
      return;
    }

    if (newPassword.length < 8) {
      setError(
        "Password must be at least 8 characters long."
      );
      return;
    }

    if (!confirmPassword) {
      setError("Please confirm your password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const req = await Api.resetPassword(
        email,
        verificationCode,
        newPassword
      );

      if (req.status === "success") {
        window.location.href = "/login";
      } else {
        setError(
          req.message ||
            "Unable to reset password. Please try again."
        );
      }
    } catch (err) {
      console.error(err);

      setError(
        "An error occurred while resetting your password."
      );
    } finally {
      setLoading(false);
    }
  };

  
  
  

  return (
    <main className={styles.page}>
      <section className={styles.card}>

        {/* LEFT SIDE */}
        <aside className={styles.story}>
          <Link href="/" className={styles.brand}>
            <img
              src="/logo.jpeg"
              alt="Omri's Home Kitchen"
              className={styles.logo}
            />

            <span>
              <span className={styles.brandName}>
                Omri’s
              </span>

              <span className={styles.brandSub}>
                Home Kitchen
              </span>
            </span>
          </Link>

          <div className={styles.storyCopy}>
            <span className={styles.kicker}>
              <ChefHat size={15} />
              We’ll help you get back in
            </span>

            <h1>
              Your kitchen favourites are waiting
              for you.
            </h1>

            <p>
              Enter the email connected to your account
              and we’ll help you reset your password
              securely.
            </p>
          </div>

          <div className={styles.storyNote}>
            <span className={styles.noteIcon}>
              <ShieldCheck size={19} />
            </span>

            <span>
              Reset links are private and expire for
              your protection.
            </span>
          </div>
        </aside>

        {/* RIGHT SIDE */}

        {/* STEP 1 — EMAIL */}
        {!sentotp && !passopen && (
          <div className={styles.formPanel}>

            <span className={styles.pill}>
              <KeyRound size={14} />
              Account recovery
            </span>

            <h2>
              Forgot your password?
            </h2>

            <p className={styles.intro}>
              No worries. We’ll email you a link to
              choose a new one.
            </p>

            {/* ERROR */}
            {error && (
              <div
                className={styles.errorBanner}
                role="alert"
              >
                <AlertCircle
                  size={18}
                  className={styles.errorIcon}
                />

                <div className={styles.errorText}>
                  {error}
                </div>

                <button
                  type="button"
                  className={styles.errorClose}
                  onClick={() => setError("")}
                  aria-label="Dismiss error"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            <form
              className={styles.form}
              onSubmit={handleSubmit}
            >
              <label className={styles.field}>
                Email address

                <div className={styles.inputWrap}>
                  <input
                    className={styles.input}
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    required
                  />

                  <Mail
                    className={styles.inputIcon}
                    size={17}
                  />
                </div>
              </label>

              <button
                type="submit"
                className={styles.button}
                disabled={loading}
              >
                {loading
                  ? "Sending..."
                  : "Send reset link"}

                {!loading && (
                  <ArrowRight size={18} />
                )}
              </button>
            </form>

            <div className={styles.helpCard}>
              <Mail size={18} />

              <div>
                <strong>
                  Check your inbox
                </strong>

                We’ll send the reset instructions to
                the email address you enter.
              </div>
            </div>

            <Link
              href="/login"
              className={styles.backLink}
            >
              <ArrowLeft size={16} />
              Back to sign in
            </Link>
          </div>
        )}

        {/* STEP 2 — EMAIL SENT */}
        {sentotp && !passopen && (
          <div className={styles.formPanel}>

            <span className={styles.pill}>
              <KeyRound size={14} />
              Account recovery
            </span>

            <h2>
              Check your email
            </h2>

            <p className={styles.intro}>
              We’ve sent a password reset link to:
            </p>

            <p>
              <strong>{email}</strong>
            </p>

            <div className={styles.helpCard}>
              <Mail size={18} />

              <div>
                <strong>
                  Check your inbox
                </strong>

                We’ve sent the reset instructions to
                the email address you entered.
              </div>
            </div>

            <button
              type="button"
              className={styles.button}
              onClick={handleContinue}
            >
            Enter  Continue
              <ArrowRight size={18} />
            </button>

            <Link
              href="/login"
              className={styles.backLink}
            >
              <ArrowLeft size={16} />
              Back to sign in
            </Link>
          </div>
        )}

        {/* STEP 3 — PASSWORD */}
        {passopen && (
          <div className={styles.formPanel}>

            <span className={styles.pill}>
              <KeyRound size={14} />
              Reset password
            </span>

            <h2>
              Create a new password
            </h2>

            <p className={styles.intro}>
              Enter your new password below.
              Make sure both passwords match.
            </p>

            {/* ERROR */}
            {error && (
              <div
                className={styles.errorBanner}
                role="alert"
              >
                <AlertCircle
                  size={18}
                  className={styles.errorIcon}
                />

                <div className={styles.errorText}>
                  {error}
                </div>

                <button
                  type="button"
                  className={styles.errorClose}
                  onClick={() => setError("")}
                  aria-label="Dismiss error"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            <form
              className={styles.form}
              onSubmit={handlePasswordSubmit}
            >

              <label className={styles.field}>
                Reset code

                <div className={styles.inputWrap}>
                  <input
                    className={styles.input}
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="Enter 6-digit code"
                    value={verificationCode}
                    onChange={(e) =>
                      setVerificationCode(e.target.value)
                    }
                    required
                  />

                  <Mail
                    className={styles.inputIcon}
                    size={17}
                  />
                </div>
              </label>

              {/* NEW PASSWORD */}
              <label className={styles.field}>
                New password

                <div className={styles.inputWrap}>
                  <input
                    className={styles.input}
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) =>
                      setNewPassword(
                        e.target.value
                      )
                    }
                    required
                  />

                  <KeyRound
                    className={styles.inputIcon}
                    size={17}
                  />
                </div>
              </label>

              {/* CONFIRM PASSWORD */}
              <label className={styles.field}>
                Confirm password

                <div className={styles.inputWrap}>
                  <input
                    className={styles.input}
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(
                        e.target.value
                      )
                    }
                    required
                  />

                  <ShieldCheck
                    className={styles.inputIcon}
                    size={17}
                  />
                </div>
              </label>

              <button
                type="submit"
                className={styles.button}
                disabled={loading}
              >
                {loading
                  ? "Resetting..."
                  : "Reset password"}

                {!loading && (
                  <ArrowRight size={18} />
                )}
              </button>
            </form>

            <div className={styles.helpCard}>
              <ShieldCheck size={18} />

              <div>
                <strong>
                  Password requirements
                </strong>

                Your password must contain at least
                8 characters.
              </div>
            </div>

            <button
              type="button"
              className={styles.backLink}
              onClick={() => {
                setPassOpen(false);
                setError("");
              }}
            >
              <ArrowLeft size={16} />
              Back
            </button>
          </div>
        )}

      </section>
    </main>
  );
}