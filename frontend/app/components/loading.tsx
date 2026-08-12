'use client';

import React from 'react';
import { Sparkles, Heart } from 'lucide-react';

type LoadingProps = {
  showSlowNote?: boolean;
  seconds?: number;
  message?: string;
};

export default function Loading({
  showSlowNote = false,
  seconds = 0,
  message = "Crafting authentic home-style pickles...",
}: LoadingProps) {
  return (
    <div className="splash-overlay" role="dialog" aria-modal="true" aria-label="Loading Omri's Home Kitchen">
      <div className="splash-card">
        
        {/* Top Badge */}
        <div className="splash-badge">
          <Sparkles size={14} className="sparkle-icon" />
          <span>Omri's Home Kitchen</span>
        </div>

        {/* Logo Container with Animated Glow */}
        <div className="splash-logo-wrapper">
          <div className="splash-logo-glow" />
          <img
            src="/logo.jpeg"
            alt="Omri's Home Kitchen"
            className="splash-logo-img"
          />
        </div>

        {/* Title & Subtitle */}
        <h1 className="splash-title">
          Omri’s <span className="splash-title-sub">Home Kitchen</span>
        </h1>
        <p className="splash-subtitle">Artisanal Handcrafted Heritage Pickles</p>

        {/* Spinner Indicator */}
        <div className="splash-spinner-box">
          <div className="splash-dual-ring" />
        </div>

        {/* Status Message */}
        <p className="splash-status">
          {showSlowNote && seconds > 0
            ? `Waking up kitchen server… (${seconds}s)`
            : message}
        </p>

        {showSlowNote && (
          <p className="splash-note">
            First visits take a few extra moments while our fresh batch loads. Thank you for your patience!
          </p>
        )}

        {/* Trust Footer Note */}
        <div className="splash-trust">
          <Heart size={14} className="heart-icon" />
          <span>100% Natural • Zero Chemical Preservatives</span>
        </div>

      </div>
    </div>
  );
}
