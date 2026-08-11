'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './css/nav.css';
import { ShoppingCart, CircleUserRound } from 'lucide-react';

export default function BottomNavBar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link href="/" className="navbar-brand">
        <div className="navbar-logo" >
          <img
            src="/logo.jpeg"
            alt="Omri's Home Kitchen"
          />
          </div>
        </Link>

        <div className="navbar-title">Omri's Home Kitchen</div>

        {/* Navigation */}
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

        {/* Actions */}
        <div className="navbar-actions">
          <button
            type="button"
            className="nav-icon-button"
            aria-label="Shopping cart"
          >
            <ShoppingCart size={15} strokeWidth={1.8} />
          </button>

          <button
            type="button"
            className="nav-icon-button"
            aria-label="Account"
          >
            <CircleUserRound size={15} strokeWidth={1.8} />
          </button>
        </div>

      </div>
      </header>
    
    );
}
