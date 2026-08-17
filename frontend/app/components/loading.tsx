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
    <div className="splash-overlay" role="dialog" aria-modal="true" aria-label="Loading Aira Pickles">
      <div className="splash-card">


        <div className="splash-badge">
          <Sparkles size={14} className="sparkle-icon" />
          <span>Aira Pickles</span>
        </div>


        <div className="splash-logo-wrapper">
          <div className="splash-logo-glow" />
          <img
            src="/aira-pickles-logo.png"
            alt="Aira Pickles"
            className="splash-logo-img"
          />
        </div>


        <h1 className="splash-title">
          Aira <span className="splash-title-sub">Pickles</span>
        </h1>
        <p className="splash-subtitle">Artisanal Handcrafted Heritage Pickles</p>


        <div className="splash-spinner-box">
          <div className="splash-dual-ring" />
        </div>


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


        <div className="splash-trust">
          <Heart size={14} className="heart-icon" />
          <span>100% Natural • Zero Chemical Preservatives</span>
        </div>

      </div>
    </div>
  );
}
