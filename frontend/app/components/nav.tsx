"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "./css/nav.css";
import {
  ShoppingCart,
  CircleUserRound,
  Menu,
  X,
  User,
  Settings,
  Package,
  LogOut,
  Sparkles,
  LogIn,
} from "lucide-react";
import { useAuth } from "../(auth)/AuthContext";
import { useCart } from "./CartContext";
import CartDrawer from "./CartDrawer";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [localUser, setLocalUser] = useState<{
    name?: string;
    email?: string;
  } | null>(null);

  const auth = useAuth();
  const user = auth?.user;
  const logout = auth?.logout;
  const { itemCount } = useCart();

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) {
      try {
        if (saved.startsWith("{")) {
          setLocalUser(JSON.parse(saved));
        } else if (saved !== "[object Object]") {
          setLocalUser({ name: saved, email: saved });
        }
      } catch {}
    } else {
      setLocalUser(null);
    }
  }, [pathname, user]);

  const currentUser = user || localUser;

  const isActive = (path: string) => pathname === path;

  const handleLogout = async () => {
    setProfileMenuOpen(false);
    setLocalUser(null);
    if (logout) {
      await logout();
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
  };

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
        <div className="navbar-spacer">
          {/* Desktop Navigation Links */}
          <nav className="navbar-links">
            <Link
              href="/"
              className={`nav-link ${isActive("/") ? "active" : ""}`}
            >
              Home
            </Link>
            <Link
              href="/menu"
              className={`nav-link ${isActive("/menu") ? "active" : ""}`}
            >
              Menu
            </Link>

            <Link
              href="/orders"
              className={`nav-link ${isActive("/orders") ? "active" : ""}`}
            >
              Orders
            </Link>
          </nav>

          {/* Action Buttons */}
          <div className="navbar-actions">
            <button
              type="button"
              className="nav-icon-button"
              aria-label="Shopping cart"
              aria-expanded={cartOpen}
              onClick={() => setCartOpen(true)}
            >
              <ShoppingCart size={19} strokeWidth={2} />
              {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
            </button>

            <div className="profile-wrapper">
              <button
                type="button"
                className={`nav-icon-button ${profileMenuOpen || isActive("/login") ? "active-icon" : ""}`}
                aria-label="Account Menu"
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              >
                <CircleUserRound size={20} strokeWidth={2} />
              </button>

              {profileMenuOpen && (
                <div className="profile-dropdown">
                  {currentUser ? (
                    <>
                      <div className="profile-dropdown-header">
                        <div className="profile-avatar">
                          {currentUser.name ? (
                            currentUser.name.charAt(0).toUpperCase()
                          ) : (
                            <User size={16} />
                          )}
                        </div>
                        <div className="profile-info">
                          <span className="profile-user-name">
                            {currentUser.name || "Customer"}
                          </span>
                          {currentUser.email && (
                            <span className="profile-user-email">
                              {currentUser.email}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="profile-dropdown-divider" />

                      <Link
                        href="/cart"
                        className="profile-dropdown-item"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        <ShoppingCart size={16} />
                        <span>Cart</span>
                      </Link>

                      <Link
                        href="/orders"
                        className="profile-dropdown-item"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        <Package size={16} />
                        <span>Orders</span>
                      </Link>

                      <Link
                        href="/settings"
                        className="profile-dropdown-item"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        <Settings size={16} />
                        <span>Settings</span>
                      </Link>

                      <div className="profile-dropdown-divider" />

                      <button
                        type="button"
                        className="profile-dropdown-item logout-item"
                        onClick={handleLogout}
                      >
                        <LogOut size={16} />
                        <span>Logout</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="profile-dropdown-header">
                        <div className="profile-avatar guest-avatar">
                          <User size={16} />
                        </div>
                        <div className="profile-info">
                          <span className="profile-user-name">
                            Welcome Guest
                          </span>
                          <span className="profile-user-email">
                            Please sign in to continue
                          </span>
                        </div>
                      </div>

                      <div className="profile-dropdown-divider" />

                      <Link
                        href="/login"
                        className="profile-login-cta"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        <LogIn size={16} />
                        <span>Sign In / Register</span>
                      </Link>

                      <Link
                        href="/cart"
                        className="profile-dropdown-item"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        <ShoppingCart size={16} />
                        <span>Cart</span>
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

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
              className={`mobile-nav-link ${isActive("/") ? "active" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/menu"
              className={`mobile-nav-link ${isActive("/menu") ? "active" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Menu
            </Link>
            <Link
              href="/about"
              className={`mobile-nav-link ${isActive("/about") ? "active" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              About Us
            </Link>
            <Link
              href="/orders"
              className={`mobile-nav-link ${isActive("/orders") ? "active" : ""}`}
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
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </header>
  );
}
