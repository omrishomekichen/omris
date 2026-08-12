'use client';
import Link from "next/link";
import { ArrowRight, ChefHat, LockKeyhole, Mail, ShieldCheck, UserRound,AlertCircle ,X} from "lucide-react";
import styles from "../auth-pages.module.css";
import { useState } from "react";
import Api from "../../__apis/api";

export default function RegisterPage() {
  const [Error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);


  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    verificationCode: "",
  });
  const [sentotp, setsentotp] = useState(false);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  const validateRegistration = () => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError('Please enter both first and last name.');
      return false;
    }

    if (!formData.email.trim()) {
      setError('Please enter your email address.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address.');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return false;
    }

    if (!formData.agreeToTerms) {
      setError('You must agree to the terms.');
      return false;
    }

    return true;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!validateRegistration()) {
      setLoading(false);
      return;
    }

    try {
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      const res = await Api.register(
        fullName,
        formData.email,
        formData.password,
      );

      if (res.status === 'success') {
        setsentotp(true);
      } else {
        setError(res.message || 'Unable to create your account. Please try again.');
      }
    } catch (error) {
      setError('Error during registration.');
      setError('Unable to create your account. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const validateVerification = () => {
    if (!formData.email.trim()) {
      setError('Please enter the email address used to register.');
      return false;
    }

    const otpRegex = /^\d{6}$/;
    if (!otpRegex.test(formData.verificationCode.trim())) {
      setError('Please enter the 6-digit verification code.');
      return false;
    }

    return true;
  }

  const verifyemail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!validateVerification()) {
      return;
    }

    setVerifyLoading(true);

    try {
      const res = await Api.verifyEmail(
        formData.email,
        formData.verificationCode,
      );

      if (res.status === 'success') {
        window.location.href = '/login';
      } else {
        setError(res.message || 'Unable to verify your email. Please try again.');
      }
    }
    catch (error) {
      setError('Unable to verify your email. Please try again.');
    } finally {
      setVerifyLoading(false);
    }
  }





  return (

    <main className={styles.page}>
      <section className={styles.card}>
        <aside className={styles.story}>
          <Link href="/" className={styles.brand}>
            <img
              src="/logo.jpeg"
              alt="Omri's Home Kitchen"
              className={styles.logo}
            />
            <span>
              <span className={styles.brandName}>Omri’s</span>
              <span className={styles.brandSub}>Home Kitchen</span>
            </span>
          </Link>

          <div className={styles.storyCopy}>
            <span className={styles.kicker}>
              <ChefHat size={15} /> From our kitchen to your table
            </span>

            <h1>
              Make every meal feel a little more like home.
            </h1>

            <p>
              Create an account to save your favourites, reorder in a moment,
              and receive fresh updates from Omri’s kitchen.
            </p>
          </div>

          <div className={styles.storyNote}>
            <span className={styles.noteIcon}>
              <ShieldCheck size={19} />
            </span>

            <span>
              Your details are kept private and secure.
            </span>
          </div>
        </aside>
        {(!sentotp) ? (
        <div className={styles.formPanel}>
          <span className={styles.pill}>
            <ChefHat size={14} /> Join the family
          </span>

          <h2>
            Create your account
          </h2>

          <p className={styles.intro}>
            A few details and you’ll be ready for your next home-style order.
          </p>
            {Error && (
            <div className={styles.errorBanner} role="alert">
              <AlertCircle size={18} className={styles.errorIcon} />
              <div className={styles.errorText}>{Error}</div>
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

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.fieldsRow}>
              <label className={styles.field}>
                First name
                <div className={styles.inputWrap}>
                  <input
                    name="firstName"
                    value={formData.firstName}
                    className={styles.input}
                    placeholder="Omri"
                    onChange={handleInputChange}
                  />
                  <UserRound
                    className={styles.inputIcon}
                    size={17}
                  />
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
                  <UserRound
                    className={styles.inputIcon}
                    size={17}
                  />
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
                />
                <Mail
                  className={styles.inputIcon}
                  size={17}
                />
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
                  placeholder="At least 8 characters"
                  onChange={handleInputChange}
                />
                <LockKeyhole
                  className={styles.inputIcon}
                  size={17}
                />
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
                />
                <LockKeyhole
                  className={styles.inputIcon}
                  size={17}
                />
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
                  Creating account...
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
            <Link
              href="/login"
              className={styles.textLink}
            >
              Sign in
            </Link>
          </p>
        </div>
        ) : (
        <div className={styles.formPanel}>
          <span className={styles.pill}>
            <ChefHat size={14} /> Join the family
          </span>

          <h2>
            Verify your email
          </h2>

          <p className={styles.intro}>
            We’ve sent a verification code to your email. Please enter it below to complete your registration.
          </p>

          <form className={styles.form} onSubmit={verifyemail}>
            <label className={styles.field}>
              Verification Code
              <div className={styles.inputWrap}>
                <input
                  name="verificationCode"
                  value={formData.verificationCode}
                  className={styles.input}
                  placeholder="Enter code"
                  onChange={handleInputChange}
                />
              </div>
            </label>

            <button
              type="submit"
              className={`${styles.button} ${verifyLoading ? styles.loading : ""}`}
              disabled={verifyLoading}
            >
              {verifyLoading ? (
                <span className={styles.btnLoadingState}>
                  <span className={styles.spinner} />
                  Verifying email...
                </span>
              ) : (
                <span className={styles.btnContent}>
                  <span>Verify Email</span>
                  <ArrowRight size={18} className={styles.btnArrow} />
                </span>
              )}
            </button>
          </form>

          <p className={styles.footer}>
            Didn't receive the code?{" "}
            <Link
              href="/resend-code"
              className={styles.textLink}
            >
              Resend Code
            </Link>
          </p>
        </div>
        )}
      </section>
    </main>


  );
}
