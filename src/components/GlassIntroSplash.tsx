"use client";

import { useEffect } from "react";

export function GlassIntroSplash() {
  useEffect(() => {
    const ensureImageAlts = () => {
      const images = document.querySelectorAll("img");
      for (const img of images) {
        const currentAlt = img.getAttribute("alt");
        if (!currentAlt || currentAlt.trim().length === 0) {
          img.setAttribute("alt", "Catálogo OSSIL Envases y Home Córdoba");
        }
      }
    };

    ensureImageAlts();
    const observer = new MutationObserver(() => {
      ensureImageAlts();
    });
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["alt", "src"],
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
