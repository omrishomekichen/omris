import Link from "next/link";
import { ArrowLeft, ArrowRight, ChefHat, KeyRound, Mail, ShieldCheck } from "lucide-react";
import styles from "../auth-pages.module.css";

export default function ForgotPasswordPage() {
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

        <div className={styles.formPanel}>
          <span className={styles.pill}><KeyRound size={14} /> Account recovery</span>
          <h2>Forgot your password?</h2>
          <p className={styles.intro}>No worries. We’ll email you a link to choose a new one.</p>
          <form className={styles.form}>
            <label className={styles.field}>Email address<div className={styles.inputWrap}><input className={styles.input} type="email" placeholder="name@example.com" /><Mail className={styles.inputIcon} size={17} /></div></label>
            <button type="button" className={styles.button}>Send reset link <ArrowRight size={18} /></button>
          </form>
          <div className={styles.helpCard}><Mail size={18} /><div><strong>Check your inbox</strong>We’ll send the reset instructions to the email address you enter.</div></div>
          <Link href="/login" className={styles.backLink}><ArrowLeft size={16} /> Back to sign in</Link>
        </div>
      </section>
    </main>
  );
}
