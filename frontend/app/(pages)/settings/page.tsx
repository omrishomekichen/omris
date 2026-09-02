"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./settings.css";
import {
  ArrowLeft,
  User,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  Moon,
  Sun,
  Lock,
  Mail,
  Phone,
} from "lucide-react";
import { useAuth } from "../../(auth)/AuthContext";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const router = useRouter();
  const auth = useAuth();
  const user = auth?.user;
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "profile" | "preferences" | "security" | "help"
  >("profile");

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode) {
      setIsDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  const handleThemeToggle = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("darkMode", JSON.stringify(newMode));
    if (newMode) {
      document.documentElement.style.filter = "invert(1) hue-rotate(180deg)";
    } else {
      document.documentElement.style.filter = "none";
    }
    toast.success(`${newMode ? "Dark" : "Light"} mode enabled`);
  };

  const handleNotificationToggle = () => {
    setNotificationsEnabled(!notificationsEnabled);
    localStorage.setItem("notificationsEnabled", JSON.stringify(!notificationsEnabled));
    toast.success(`Notifications ${!notificationsEnabled ? "enabled" : "disabled"}`);
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      if (auth?.logout) {
        await auth.logout();
      }
      localStorage.removeItem("user");
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (error) {
      toast.error("Logout failed");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = () => {
    router.push("/forgot-password");
  };

  return (
    <div className="settings-container">
      {/* Header */}
      <div className="settings-header">
        <button
          onClick={() => router.back()}
          className="settings-back-btn"
          aria-label="Go back"
        >
          <ArrowLeft size={24} />
        </button>
        <h1>Settings</h1>
        <div style={{ width: 24 }} />
      </div>

      {/* Tabs */}
      <div className="settings-tabs">
        <button
          className={`settings-tab ${activeTab === "profile" ? "active" : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          <User size={18} />
          <span>Profile</span>
        </button>
        <button
          className={`settings-tab ${activeTab === "preferences" ? "active" : ""}`}
          onClick={() => setActiveTab("preferences")}
        >
          <Bell size={18} />
          <span>Preferences</span>
        </button>
        <button
          className={`settings-tab ${activeTab === "security" ? "active" : ""}`}
          onClick={() => setActiveTab("security")}
        >
          <Shield size={18} />
          <span>Security</span>
        </button>
        <button
          className={`settings-tab ${activeTab === "help" ? "active" : ""}`}
          onClick={() => setActiveTab("help")}
        >
          <HelpCircle size={18} />
          <span>Help</span>
        </button>
      </div>

      {/* Content */}
      <div className="settings-content">
        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="settings-section">
            <h2 className="section-title">Account Information</h2>

            <div className="settings-group">
              <div className="settings-item">
                <div className="settings-icon">
                  <User size={20} />
                </div>
                <div className="settings-info">
                  <p className="settings-label">Full Name</p>
                  <p className="settings-value">
                    {user?.name || user?.firstName || "Guest User"}
                  </p>
                </div>
              </div>

              <div className="settings-item">
                <div className="settings-icon">
                  <Mail size={20} />
                </div>
                <div className="settings-info">
                  <p className="settings-label">Email Address</p>
                  <p className="settings-value">
                    {user?.email || "Not provided"}
                  </p>
                </div>
              </div>

              <div className="settings-item">
                <div className="settings-icon">
                  <Phone size={20} />
                </div>
                <div className="settings-info">
                  <p className="settings-label">Phone Number</p>
                  <p className="settings-value">Not set</p>
                </div>
                <button className="settings-action-btn">Edit</button>
              </div>
            </div>
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === "preferences" && (
          <div className="settings-section">
            <h2 className="section-title">Preferences</h2>

            <div className="settings-group">
              <div className="settings-item">
                <div className="settings-icon">
                  {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
                </div>
                <div className="settings-info">
                  <p className="settings-label">Dark Mode</p>
                  <p className="settings-value">
                    {isDarkMode ? "Enabled" : "Disabled"}
                  </p>
                </div>
                <button
                  className="settings-toggle"
                  onClick={handleThemeToggle}
                  aria-label="Toggle dark mode"
                >
                  <input type="checkbox" checked={isDarkMode} readOnly />
                  <span className="toggle-slider"></span>
                </button>
              </div>

              <div className="settings-item">
                <div className="settings-icon">
                  <Bell size={20} />
                </div>
                <div className="settings-info">
                  <p className="settings-label">Push Notifications</p>
                  <p className="settings-value">
                    {notificationsEnabled ? "Enabled" : "Disabled"}
                  </p>
                </div>
                <button
                  className="settings-toggle"
                  onClick={handleNotificationToggle}
                  aria-label="Toggle notifications"
                >
                  <input type="checkbox" checked={notificationsEnabled} readOnly />
                  <span className="toggle-slider"></span>
                </button>
              </div>

              <div className="settings-item">
                <div className="settings-info">
                  <p className="settings-label">Newsletter Subscription</p>
                  <p className="settings-value">
                    Receive weekly deals & updates
                  </p>
                </div>
                <button className="settings-toggle">
                  <input type="checkbox" defaultChecked />
                  <span className="toggle-slider"></span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <div className="settings-section">
            <h2 className="section-title">Security</h2>

            <div className="settings-group">
              <div className="settings-item">
                <div className="settings-icon">
                  <Lock size={20} />
                </div>
                <div className="settings-info">
                  <p className="settings-label">Change Password</p>
                  <p className="settings-value">
                    Last changed 90 days ago
                  </p>
                </div>
                <button
                  className="settings-action-btn"
                  onClick={handleChangePassword}
                >
                  Update
                </button>
              </div>

              <div className="settings-item">
                <div className="settings-icon">
                  <Shield size={20} />
                </div>
                <div className="settings-info">
                  <p className="settings-label">Two-Factor Authentication</p>
                  <p className="settings-value">Not enabled</p>
                </div>
                <button className="settings-action-btn">Enable</button>
              </div>

              <div className="settings-item">
                <div className="settings-info">
                  <p className="settings-label">Active Sessions</p>
                  <p className="settings-value">1 device signed in</p>
                </div>
                <button className="settings-action-btn">View All</button>
              </div>
            </div>
          </div>
        )}

        {/* Help Tab */}
        {activeTab === "help" && (
          <div className="settings-section">
            <h2 className="section-title">Help & Support</h2>

            <div className="settings-group">
              <button className="help-link">
                <HelpCircle size={20} />
                <span>Frequently Asked Questions</span>
              </button>

              <button className="help-link">
                <HelpCircle size={20} />
                <span>Contact Support</span>
              </button>

              <button className="help-link">
                <HelpCircle size={20} />
                <span>Privacy Policy</span>
              </button>

              <button className="help-link">
                <HelpCircle size={20} />
                <span>Terms of Service</span>
              </button>

              <div className="app-version">
                <p>App Version: 1.0.0</p>
                <p>Last Updated: September 2024</p>
              </div>
            </div>
          </div>
        )}

        {/* Logout Button */}
        <div className="settings-logout">
          <button
            className="logout-btn"
            onClick={handleLogout}
            disabled={loading}
          >
            <LogOut size={20} />
            <span>{loading ? "Logging out..." : "Logout"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
