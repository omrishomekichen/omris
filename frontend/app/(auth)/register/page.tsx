'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ArrowLeft,
  ChefHat,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
  CheckCircle2,
  KeyRound,
} from "lucide-react";
import styles from "../auth-pages.module.css";
import { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const auth = useAuth();
  const [step, setStep] = useState<"form" | "otp" | "success">("form");
  const [loading, setLoading] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [resending, setResending] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  // Countdown timer for Resend OTP
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateRegistration = () => {
    if (!formData.firstName.trim()) {
      toast.error("Please enter your first name.");
      return false;
    }

    if (!formData.email.trim()) {
      toast.error("Please enter your email address.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      toast.error("Please enter a valid email address.");
      return false;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return false;
    }

    if (!formData.agreeToTerms) {
      toast.error("You must agree to the terms of service.");
      return false;
    }

    return true;
  };

  // Step 1: Submit details & send OTP
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateRegistration()) {
      return;
    }

    setLoading(true);
    try {
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      if (auth?.register) {
        const res = await auth.register(
          fullName,
          formData.email.trim(),
          formData.password,
        );

        if (res.status === "success") {
          toast.success("Verification code sent to your email!");
          setStep("otp");
          setResendTimer(30);
        } else {
          toast.error(res.message || "Unable to create account. Please try again.");
        }
      }
    } catch (error: any) {
      toast.error(error?.message || "Unable to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const cleanOtp = otpCode.trim();
    if (!cleanOtp) {
      toast.error("Please enter the 6-digit verification code.");
      return;
    }

    if (cleanOtp.length < 4) {
      toast.error("Please enter the complete verification code.");
      return;
    }

    setLoading(true);
    try {
      if (auth?.verifyEmail) {
        const res = await auth.verifyEmail(formData.email.trim(), cleanOtp);

        if (res.status === "success") {
          toast.success("Email verified successfully! Welcome to Aira Pickles.");
          setStep("success");
          setTimeout(() => {
            router.push("/dashboard");
          }, 1200);
        } else {
          toast.error(res.message || "Invalid or expired verification code.");
        }
      }
    } catch (error: any) {
      toast.error(error?.message || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (resendTimer > 0 || resending) return;

    setResending(true);
    try {
      if (auth?.sendLoginOtp) {
        const res = await auth.sendLoginOtp(formData.email.trim());
        if (res.status === "success") {
          toast.success("New verification code sent to your email!");
          setResendTimer(30);
        } else {
          toast.error(res.message || "Unable to resend OTP. Please try again.");
        }
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to resend code.");
    } finally {
      setResending(false);
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
              <ChefHat size={15} /> From our kitchen to your table
            </span>

            <h1>Make every meal feel a little more like home.</h1>

            <p>
              Create an account to save your favourites, reorder in a moment,
              and receive fresh updates from Aira Pickles.
            </p>
          </div>

          <div className={styles.storyNote}>
            <span className={styles.noteIcon}>
              <ShieldCheck size={19} />
            </span>

            <span>Protected with enterprise-grade security.</span>
          </div>
        </aside>

        {/* STEP 1: REGISTRATION FORM */}
        {step === "form" && (
          <div className={styles.formPanel}>
            <span className={styles.pill}>
              <ChefHat size={14} /> Join the family
            </span>

            <h2>Create your account</h2>

            <p className={styles.intro}>
              A few details and you’ll be ready for your next home-style order.
            </p>
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.fieldsRow}>
                <label className={styles.field}>
                  First name
                  <div className={styles.inputWrap}>
                    <input
                      name="firstName"
                      value={formData.firstName}
                      className={styles.input}
                      placeholder="Aira"
                      onChange={handleInputChange}
                      required
                    />
                    <UserRound className={styles.inputIcon} size={17} />
                  </div>
                </label>

                <label className={styles.field}>
                  Last name
                  <div className={styles.inputWrap}>
                    <input
                      name="lastName"
                      value={formData.lastName}
                      className={styles.input}
                      placeholder="Kumar"
                      onChange={handleInputChange}
                    />
                    <UserRound className={styles.inputIcon} size={17} />
                  </div>
                </label>
              </div>

              <label className={styles.field}>
                Email address
                <div className={styles.inputWrap}>
                  <input
                    name="email"
                    value={formData.email}
                    className={styles.input}
                    type="email"
                    placeholder="name@example.com"
                    onChange={handleInputChange}
                    required
                  />
                  <Mail className={styles.inputIcon} size={17} />
                </div>
              </label>

              <label className={styles.field}>
                Create a password
                <div className={styles.inputWrap}>
                  <input
                    name="password"
                    value={formData.password}
                    className={styles.input}
                    type="password"
                    placeholder="At least 6 characters"
                    onChange={handleInputChange}
                    required
                  />
                  <LockKeyhole className={styles.inputIcon} size={17} />
                </div>
              </label>

              <label className={styles.field}>
                Confirm password
                <div className={styles.inputWrap}>
                  <input
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    className={styles.input}
                    type="password"
                    placeholder="Re-enter your password"
                    onChange={handleInputChange}
                    required
                  />
                  <LockKeyhole className={styles.inputIcon} size={17} />
                </div>
              </label>

              <label className={styles.agreement}>
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                />
                <span>
                  I agree to the{" "}
                  <a href="#" className={styles.textLink}>
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className={styles.textLink}>
                    Privacy Policy
                  </a>
                  .
                </span>
              </label>

              <button
                type="submit"
                className={`${styles.button} ${loading ? styles.loading : ""}`}
                disabled={loading}
              >
                {loading ? (
                  <span className={styles.btnLoadingState}>
                    <span className={styles.spinner} />
                    Sending verification code...
                  </span>
                ) : (
                  <span className={styles.btnContent}>
                    <span>Create Account</span>
                    <ArrowRight size={18} className={styles.btnArrow} />
                  </span>
                )}
              </button>
            </form>

            <p className={styles.footer}>
              Already have an account?{" "}
              <Link href="/login" className={styles.textLink}>
                Sign in
              </Link>
            </p>
          </div>
        )}

        {/* STEP 2: OTP VERIFICATION */}
        {step === "otp" && (
          <div className={styles.formPanel}>
            <span className={styles.pill}>
              <KeyRound size={14} /> Verification Required
            </span>

            <h2>Verify your email</h2>

            <p className={styles.intro}>
              We sent a 6-digit verification code to{" "}
              <strong>{formData.email}</strong>. Enter it below to activate your account.
            </p>

            <form className={styles.form} onSubmit={handleVerifyOtp}>
              <label className={styles.field}>
                Enter 6-digit code
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
                    disabled={resending}
                    className={styles.resendBtn}
                  >
                    {resending ? "Sending..." : "Resend OTP Code"}
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setStep("form")}
                  className={styles.textLink}
                  style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.85rem" }}
                >
                  Edit details
                </button>
              </div>

              <button
                type="submit"
                className={`${styles.button} ${loading ? styles.loading : ""}`}
                disabled={loading}
              >
                {loading ? (
                  <span className={styles.btnLoadingState}>
                    <span className={styles.spinner} />
                    Verifying OTP...
                  </span>
                ) : (
                  <span className={styles.btnContent}>
                    <span>Verify & Continue</span>
                    <ArrowRight size={18} className={styles.btnArrow} />
                  </span>
                )}
              </button>
            </form>

            <button
              type="button"
              onClick={() => setStep("form")}
              className={styles.backLink}
            >
              <ArrowLeft size={16} />
              Back to form
            </button>
          </div>
        )}

        {/* STEP 3: SUCCESS */}
        {step === "success" && (
          <div className={styles.formPanel}>
            <span className={styles.pill}>
              <CheckCircle2 size={14} color="#16a34a" /> Account Activated
            </span>

            <h2>Welcome to Aira Pickles!</h2>

            <p className={styles.intro}>
              Your account has been verified successfully. Redirecting you to your dashboard...
            </p>

            <div style={{ marginTop: "24px" }}>
              <Link
                href="/dashboard"
                className={styles.button}
                style={{
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textDecoration: "none",
                }}
              >
                <span>Go to Dashboard</span>
                <ArrowRight size={18} style={{ marginLeft: "8px" }} />
              </Link>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
