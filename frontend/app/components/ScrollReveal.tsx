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
      ".scroll-reveal",
      ".feature-pill",
      ".hero-text",
      ".hero-card",
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
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" },
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

    // Initial check after mount
    const timer = setTimeout(observeElements, 100);

    // Watch for dynamic DOM changes (e.g. API fetches on menu & dashboard)
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
