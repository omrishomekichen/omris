'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Heart, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  ArrowUp,
  Sparkles,
  MessageCircle,
  Globe
} from 'lucide-react';
import './css/footer.css';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer-root">
      {/* Top Banner Accent */}
      <div className="footer-top-accent" />

      <div className="footer-container">
        {/* Main 4-Column Grid */}
        <div className="footer-grid">
          
          {/* Col 1: Brand Info */}
          <div className="footer-col footer-col-brand">
            <Link href="/" className="footer-brand-link">
              <div className="footer-logo-wrapper">
                <img
                  src="/logo.jpeg"
                  alt="Omri's Home Kitchen Logo"
                  className="footer-logo-img"
                />
              </div>
              <div className="footer-brand-text">
                <span className="footer-brand-title">Omri’s</span>
                <span className="footer-brand-sub">Home Kitchen</span>
              </div>
            </Link>

            <p className="footer-brand-desc">
              Authentic, home-made pickles slow-crafted in fresh, small quantities 
              using sun-dried ingredients, cold-pressed sesame oil, and secret family recipes.
            </p>

            <div className="footer-trust-pills">
              <span className="footer-trust-pill">
                <Sparkles size={13} /> 100% Natural
              </span>
              <span className="footer-trust-pill">
                <ShieldCheck size={13} /> No Preservatives
              </span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="footer-col">
            <h4 className="footer-col-heading">Explore Menu</h4>
            <ul className="footer-nav-list">
              <li><Link href="/">Home Page</Link></li>
              <li><Link href="/menu">Full Pickle Menu</Link></li>
              <li><Link href="/#story">Our Family Story</Link></li>
              <li><Link href="/#pickles">Best Sellers</Link></li>
              <li><Link href="/orders">Track My Order</Link></li>
            </ul>
          </div>

          {/* Col 3: Customer Care & Policies */}
          <div className="footer-col">
            <h4 className="footer-col-heading">Customer Care</h4>
            <ul className="footer-nav-list">
              <li><Link href="/faq">Frequently Asked Questions</Link></li>
              <li><Link href="/shipping">Doorstep Shipping Info</Link></li>
              <li><Link href="/privacy">Privacy Policy</Link></li>
              <li><Link href="/terms">Terms of Service</Link></li>
              <li><Link href="/contact">Bulk / Catering Inquiry</Link></li>
            </ul>
          </div>

          {/* Col 4: Kitchen Contact & Social */}
          <div className="footer-col">
            <h4 className="footer-col-heading">Kitchen Contact</h4>
            <div className="footer-contact-info">
              <a href="tel:+919876543210" className="contact-item">
                <Phone size={16} className="contact-icon" />
                <span>+91 98765 43210</span>
              </a>

              <a href="mailto:orders@omrishomekitchen.com" className="contact-item">
                <Mail size={16} className="contact-icon" />
                <span>orders@omrishomekitchen.com</span>
              </a>

              <div className="contact-item">
                <MapPin size={16} className="contact-icon" />
                <span>Hyderabad, Telangana, India</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="footer-social-row">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="social-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="social-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" aria-label="WhatsApp" className="social-btn">
                <MessageCircle size={18} />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Divider Bar */}
        <div className="footer-bottom-bar">
          <p className="footer-copyright">
            © {new Date().getFullYear()} Omri's Home Kitchen. All rights reserved. Handcrafted with <Heart size={14} className="inline-heart" /> in India.
          </p>

          <button onClick={scrollToTop} className="scroll-top-btn" aria-label="Scroll back to top">
            <span>Back to top</span>
            <ArrowUp size={15} />
          </button>
        </div>

      </div>
    </footer>
  );
}