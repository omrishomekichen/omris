'use client';

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ChefHat,
  KeyRound,
  Mail,
  ShieldCheck,
} from "lucide-react";
import styles from "../auth-pages.module.css";
import { useState } from "react";
import Api from "../../__apis/api";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const [verificationCode, setVerificationCode] = useState("");

  const [sentotp, setSentOtp] = useState(false);

  const [passopen, setPassOpen] = useState(false);

  const [newPassword, setNewPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);


  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);

      const req = await Api.forgotPassword(email);

      if (req.status === "success") {
        setSentOtp(true);
      } else {
        toast.error(
          req.message ||
            "Unable to send OTP. Please try again."
        );
      }
    } catch {
      toast.error(
        "An error occurred while sending the OTP."
      );
    } finally {
      setLoading(false);
    }
  };





  const handleContinue = () => {
    setPassOpen(true);
  };





  const handlePasswordSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!verificationCode || !/^[0-9]{6}$/.test(verificationCode.trim())) {
      toast.error("Please enter the six-digit reset code sent to your email.");
      return;
    }

    if (!newPassword) {
      toast.error("Please enter a new password.");
      return;
    }

    if (newPassword.length < 8) {
      toast.error(
        "Password must be at least 8 characters long."
      );
      return;
    }

    if (!confirmPassword) {
      toast.error("Please confirm your password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
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
        toast.error(
          req.message ||
            "Unable to reset password. Please try again."
        );
      }
    } catch {
      toast.error(
        "An error occurred while resetting your password."
      );
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
              <span className={styles.brandName}>
                Aira
              </span>

              <span className={styles.brandSub}>
                Pickles
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
              and we’ll send a 6-digit verification code to
              reset your password securely.
            </p>
          </div>

          <div className={styles.storyNote}>
            <span className={styles.noteIcon}>
              <ShieldCheck size={19} />
            </span>

            <span>
              Reset codes are private and expire for
              your protection.
            </span>
          </div>
        </aside>




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
              No worries. We’ll email you a 6-digit code to
              choose a new one.
            </p>

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
                className={`${styles.button} ${loading ? styles.loading : ""}`}
                disabled={loading}
              >
                {loading ? (
                  <span className={styles.btnLoadingState}>
                    <span className={styles.spinner} />
                    Sending code...
                  </span>
                ) : (
                  <span className={styles.btnContent}>
                    <span>Send verification code</span>
                    <ArrowRight size={18} className={styles.btnArrow} />
                  </span>
                )}
              </button>
            </form>

            <div className={styles.helpCard}>
              <Mail size={18} />

              <div>
                <strong>
                  Check your inbox
                </strong>

                We’ll send a 6-digit reset code to
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
              We’ve sent a 6-digit password reset code to:
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

                Enter the 6-digit verification code in the next step to set your new password.
              </div>
            </div>

            <button
              type="button"
              className={styles.button}
              onClick={handleContinue}
            >
              <span className={styles.btnContent}>
                <span>Enter Code to Reset Password</span>
                <ArrowRight size={18} className={styles.btnArrow} />
              </span>
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
                className={`${styles.button} ${loading ? styles.loading : ""}`}
                disabled={loading}
              >
                {loading ? (
                  <span className={styles.btnLoadingState}>
                    <span className={styles.spinner} />
                    Resetting password...
                  </span>
                ) : (
                  <span className={styles.btnContent}>
                    <span>Reset password</span>
                    <ArrowRight size={18} className={styles.btnArrow} />
                  </span>
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
