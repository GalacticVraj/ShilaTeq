"use client";

import { useEffect } from "react";

/**
 * Opens the deep-linked FAQ item on arrival and on hashchange (Phase-3 11
 * #159). Progressive: without JS the link still scrolls to the (collapsed)
 * item — honest degradation. One tiny island for the FAQ page.
 */
export function FaqDeepLink() {
  useEffect(() => {
    const openTarget = () => {
      const id = decodeURIComponent(location.hash.slice(1));
      if (!id) return;
      const el = document.getElementById(id);
      if (el instanceof HTMLDetailsElement) {
        el.open = true;
        el.scrollIntoView({ block: "start", behavior: "auto" });
      }
    };
    openTarget();
    window.addEventListener("hashchange", openTarget);
    return () => window.removeEventListener("hashchange", openTarget);
  }, []);
  return null;
}
