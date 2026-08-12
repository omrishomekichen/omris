'use client';

import { useEffect } from 'react';

export default function ScrollReveal() {
  useEffect(() => {
    // Select all elements configured for scroll reveal
    const selectors = [
      '.reveal',
      '.reveal-scale',
      '.reveal-left',
      '.reveal-right',
      '.promise-card',
      '.simple-product-card',
      '.story-image',
      '.story-content',
      '.banner-box',
      '.footer-grid > div'
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            // Unobserve after animating once
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    const observeElements = () => {
      const elements = document.querySelectorAll(selectors.join(', '));
      elements.forEach((el) => {
        if (!el.classList.contains('is-visible')) {
          observer.observe(el);
        }
      });
    };

    // Run initial observation
    observeElements();

    // Re-observe if DOM updates dynamically
    const mutationObserver = new MutationObserver(() => {
      observeElements();
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return null;
}
