'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './css/nav.css';
import { ShoppingCart, CircleUserRound, Menu, X, Sparkles } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Brand Logo & Name */}
        <Link href="/" className="navbar-brand">
          <div className="navbar-logo-frame">
            <img
              src="/logo.jpeg"
              alt="Omri's Home Kitchen Logo"
              className="navbar-logo-img"
            />
          </div>
          <div className="navbar-brand-text">
            <span className="brand-title">Omri’s</span>
            <span className="brand-subtitle">Home Kitchen</span>
          </div>
        </Link>
        <div className="navbar-spacer" >

        {/* Desktop Navigation Links */}
        <nav className="navbar-links">
          <Link href="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
            Home
          </Link>
          <Link href="/menu" className={`nav-link ${isActive('/menu') ? 'active' : ''}`}>
            Menu
          </Link>
          <Link href="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`}>
            About Us
          </Link>
          <Link href="/orders" className={`nav-link ${isActive('/orders') ? 'active' : ''}`}>
            Orders
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="navbar-actions">
          <Link href="/cart" className="nav-icon-button" aria-label="Shopping cart">
            <ShoppingCart size={19} strokeWidth={2} />
            <span className="cart-badge">1</span>
          </Link>

          <Link
            href="/login"
            className={`nav-icon-button ${isActive('/login') ? 'active-icon' : ''}`}
            aria-label="Account"
          >
            <CircleUserRound size={20} strokeWidth={2} />
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          <nav className="mobile-nav-links">
            <Link
              href="/"
              className={`mobile-nav-link ${isActive('/') ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/menu"
              className={`mobile-nav-link ${isActive('/menu') ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Menu
            </Link>
            <Link
              href="/about"
              className={`mobile-nav-link ${isActive('/about') ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              About Us
            </Link>
            <Link
              href="/orders"
              className={`mobile-nav-link ${isActive('/orders') ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Orders
            </Link>
            <Link
              href="/login"
              className="mobile-nav-cta"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Sparkles size={16} />
              <span>Sign In / Register</span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
