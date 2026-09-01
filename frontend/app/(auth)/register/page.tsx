'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ChefHat, LockKeyhole, Mail, ShieldCheck, UserRound, CheckCircle2 } from "lucide-react";
import styles from "../auth-pages.module.css";
import { useState } from "react";
import { useAuth } from "../AuthContext";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const auth = useAuth();
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateRegistration = () => {
    if (!formData.firstName.trim()) {
      toast.error('Please enter your first name.');
      return false;
    }

    if (!formData.email.trim()) {
      toast.error('Please enter your email address.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      toast.error('Please enter a valid email address.');
      return false;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match.');
      return false;
    }

    if (!formData.agreeToTerms) {
      toast.error('You must agree to the terms of service.');
      return false;
    }

    return true;
  };

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
          formData.email,
          formData.password,
        );

        if (res.status === 'success') {
          toast.success(res.message || "Account created successfully!");
          setSuccessMsg(
            res.message ||
              "Registration successful! If required, please check your inbox for a confirmation email."
          );
          setIsSuccess(true);
        } else {
          toast.error(res.message || 'Unable to create account. Please try again.');
        }
      }
    } catch (error: any) {
      toast.error(error?.message || 'Unable to create account. Please try again.');
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
              <ChefHat size={15} /> From our kitchen to your table
            </span>

            <h1>
              Make every meal feel a little more like home.
            </h1>

            <p>
              Create an account to save your favourites, reorder in a moment,
              and receive fresh updates from Aira Pickles.
            </p>
          </div>

          <div className={styles.storyNote}>
            <span className={styles.noteIcon}>
              <ShieldCheck size={19} />
            </span>

            <span>
              Protected with enterprise-grade Supabase security.
            </span>
          </div>
        </aside>

        {!isSuccess ? (
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
                    required
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
                    placeholder="At least 6 characters"
                    onChange={handleInputChange}
                    required
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
                    required
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
              <CheckCircle2 size={14} color="#16a34a" /> Account Status
            </span>

            <h2>
              Welcome to Aira Pickles!
            </h2>

            <p className={styles.intro}>
              {successMsg}
            </p>

            <div style={{ marginTop: '24px' }}>
              <Link
                href="/login"
                className={styles.button}
                style={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}
              >
                <span>Proceed to Sign In</span>
                <ArrowRight size={18} style={{ marginLeft: '8px' }} />
              </Link>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
