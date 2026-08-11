'use client';

import Link from "next/link";
import { ArrowLeft, ArrowRight, ChefHat, KeyRound, Mail, ShieldCheck,AlertCircle,X } from "lucide-react";
import styles from "../auth-pages.module.css";
import { useState } from "react";
import Api from "../../__apis/api";

export default function ForgotPasswordPage() {
const [email , setEmail] = useState("");
const [error, setError] = useState("");
const [sentotp, setSentOtp] = useState(false);




const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  try {
    const req =await Api.forgotPassword(email);
    if (req.status === "success") {
      setSentOtp(true);
    } else {
      setError(req.message || "Unable to send reset link. Please try again.");
    }
  } catch (err) {
    setError("An error occurred. Please try again.");
  } 
   
}

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <aside className={styles.story}>
          <Link href="/" className={styles.brand}>
            <img src="/logo.jpeg" alt="Omri's Home Kitchen" className={styles.logo} />
            <span><span className={styles.brandName}>Omri’s</span><span className={styles.brandSub}>Home Kitchen</span></span>
          </Link>
          <div className={styles.storyCopy}>
            <span className={styles.kicker}><ChefHat size={15} /> We’ll help you get back in</span>
            <h1>Your kitchen favourites are waiting for you.</h1>
            <p>Enter the email connected to your account and we’ll send a secure link to reset your password.</p>
          </div>
          <div className={styles.storyNote}>
            <span className={styles.noteIcon}><ShieldCheck size={19} /></span>
            <span>Reset links are private and expire for your protection.</span>
          </div>
        </aside>
  {!sentotp ? (
        <div className={styles.formPanel}>
          <span className={styles.pill}><KeyRound size={14} /> Account recovery</span>
          <h2>Forgot your password?</h2>
          <p className={styles.intro}>No worries. We’ll email you a link to choose a new one.</p>
          {error && (
            <div className={styles.errorBanner} role="alert">
              <AlertCircle size={18} className={styles.errorIcon} />
              <div className={styles.errorText}>{error}</div>
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
          <form className={styles.form}  onSubmit={handleSubmit}>
            <label className={styles.field}>Email address<div className={styles.inputWrap}><input className={styles.input} type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} /><Mail className={styles.inputIcon} size={17} /></div></label>
            <button type="submit" className={styles.button}>Send reset link <ArrowRight size={18} /></button>
          </form>
          <div className={styles.helpCard}><Mail size={18} /><div><strong>Check your inbox</strong>We’ll send the reset instructions to the email address you enter.</div></div>
          <Link href="/login" className={styles.backLink}><ArrowLeft size={16} /> Back to sign in</Link>
        </div>):(
        <div className={styles.formPanel}>
          <span className={styles.pill}><KeyRound size={14} /> Account recovery</span>
          <h2>Check your email</h2>
          <p className={styles.intro}>We’ve sent a password reset link to your email. Please check your inbox and follow the instructions to reset your password.</p>
          <div className={styles.helpCard}><Mail size={18} /><div><strong>Check your inbox</strong>We’ve sent the reset instructions to the email address you entered.</div></div>
          <Link href="/login" className={styles.backLink}><ArrowLeft size={16} /> Back to sign in</Link>
        </div>
  )}
      </section>
    </main>
  );
}
