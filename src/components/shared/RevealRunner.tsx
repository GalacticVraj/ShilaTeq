"use client";

import { useEffect } from "react";

/**
 * Subpage reveal orchestrator: the [data-reveal] subset of the homepage's
 * SceneRunner (phase-4/05 site-wide rule 1 — subpages get narrative-grade
 * reveals only, once, no scrubbing, no scenes). One tiny island per page.
 */
export function RevealRunner() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]");
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries, obs) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-revealed");
            obs.unobserve(e.target);
          }
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -5% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
