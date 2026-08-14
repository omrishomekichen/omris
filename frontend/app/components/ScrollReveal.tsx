"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const selectors = [
      ".promise-card",
      ".simple-heading",
      ".simple-product-card",
      ".menu-product-card",
      ".menu-header-block",
      ".menu-controls-bar",
      ".category-title-row",
      ".menu-section",
      ".story-image",
      ".story-content",
      ".banner-box",
      ".footer-grid > div",
      ".footer-column",
      ".scroll-reveal",
      ".reveal",
      ".reveal-scale",
      ".reveal-left",
      ".reveal-right",
      ".feature-pill",
      ".hero-text",
      ".hero-card",
      ".auth-card",
      ".booking-card",
      ".orders-card",
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px -30px 0px" },
    );

    const observeElements = () => {
      document.querySelectorAll(selectors.join(", ")).forEach((el) => {
        if (!el.classList.contains("is-visible")) {
          const rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            el.classList.add("is-visible");
          } else {
            observer.observe(el);
          }
        }
      });
    };

    const timer = setTimeout(observeElements, 100);

    const mutationObserver = new MutationObserver(() => {
      observeElements();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      clearTimeout(timer);
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [pathname]);

  return null;
}
