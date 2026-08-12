'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Api from "../../__apis/api";
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
  AlertCircle,
  X,
  Truck,
  Leaf
} from "lucide-react";
import "./login.css";
import styles from "../auth-pages.module.css";

export default function Login() {
  const router = useRouter();
  const [FormData, setFormData] = useState({ email: "", password: "" , verificationCode: ""});
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sentotp,setsentotp] = useState(false);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  }



  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try{
       const res = await Api.login(
        FormData.email,
        FormData.password,
      );
     if (res.status === 'pending') {
        setsentotp(true);
      } else {
        setError(res.message || 'Unable to login to your account. Please try again.');
      }
    } catch (error) {
      setError('Unable to login to your account. Please try again.');
    } finally {
      setLoading(false);
    }
   

  };
  const handleverifySubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const verificationCode = FormData.verificationCode.trim();
    if (!/^\d{6}$/.test(verificationCode)) {
      setError("Enter the six-digit verification code sent to your email.");
      return;
    }

    setLoading(true);
    try{
       const res = await Api.verifyLogin(
        FormData.email,
        verificationCode,   
      );
     if (res.status === 'success') {
        router.push('/dashboard');
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', res.user);

      } else {
        setError(res.message || 'Unable to verify your login. Please try again.');
      }
    } catch (error) {
      setError('Unable to verify your login. Please try again.');
    } finally {
      setLoading(false);
    }
  }

 

  return (
    <div className="auth-page">
      {/* Background ambient lighting effects */}
      <div className="auth-bg-glow glow-top-left" />
      <div className="auth-bg-glow glow-bottom-right" />

      <div className="auth-card">
        {/* Left Editorial Panel */}
        <aside className="auth-panel">
          <div className="auth-panel-header">
            <Link href="/" className="auth-brand-link">
              <div className="auth-brand-logo-wrapper">
                <img src="/logo.jpeg" alt="Omri's Home Kitchen Logo" className="auth-brand-logo" />
              </div>
              <div className="auth-brand-text">
                <span className="brand-name">Omri’s</span>
                <span className="brand-sub">Home Kitchen</span>
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

        {!sentotp ? (
        <main className="auth-form-panel">
          <div className="auth-form-head">
            <div className="auth-welcome-pill">
              <ChefHat size={15} />
              <span>Welcome Back</span>
            </div>
            <h2>Sign In to your Account</h2>
            <p>Enter your email and password to access your Omri’s account.</p>
          </div>

          {error && (
            <div className="auth-error" role="alert">
              <AlertCircle size={18} className="error-icon" />
              <div className="error-text">{error}</div>
              <button
                type="button"
                className="error-close"
                onClick={() => setError("")}
                aria-label="Dismiss error"
              >
                <X size={16} />
              </button>
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit} autoComplete="off">
            <label className="auth-field">
              <span className="field-label">Email Address</span>
              <div className="input-input-wrapper">
                <Mail className="input-icon" size={18} />
                <input
                  type="email"
                  name="email"
                  value={FormData.email}
                  onChange={handleInputChange}
                  placeholder="name@example.com"
                  autoComplete="off"
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
                  value={FormData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••••••"
                  autoComplete="new-password"
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
                  Authenticating...
                </span>
              ) : (
                <span className="btn-content">
                  <span>Sign In</span>
                  <ArrowRight size={18} className="btn-arrow" />
                </span>
              )}
            </button>
          </form>

          <div className="auth-divider">
            <span>or continue with</span>
          </div>

          <button className="auth-google-btn" type="button">
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
        ) : (
          <main className="auth-form-panel">
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

          <form className={styles.form} onSubmit={handleverifySubmit}>
            <label className={styles.field}>
              Verification Code
              <div className={styles.inputWrap}>
                <input
                  name="verificationCode"
                  value={FormData.verificationCode}
                  className={styles.input}
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  placeholder="Enter code"
                  onChange={handleInputChange}
                  required
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
                  Verifying Email...
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
          </main>
        )}

      </div>
    </div>
  );
}
