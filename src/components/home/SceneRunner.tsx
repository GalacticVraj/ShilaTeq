"use client";

import { useEffect } from "react";

/**
 * The single choreography island (A-007): all homepage scene logic in one
 * tiny client component operating on server-rendered DOM via data-attributes.
 * Replaces ~10 per-scene React islands — one hydration cost, one place to
 * audit against the motion law (phase-4/05). CSS owns every visual state;
 * this file only toggles classes and timers.
 *
 * Reduced-motion note: CSS renders resolved end-states on its own; the class
 * toggles here are harmless no-ops visually under reduced-motion, and the
 * S4/S5 informational states are additionally forced by CSS @media rules.
 */
export function SceneRunner() {
  useEffect(() => {
    const cleanups: Array<() => void> = [];

    // ---- Generic reveals: once, at 20% visibility (phase-4/05 universal law).
    const revealEls = document.querySelectorAll<HTMLElement>("[data-reveal]");
    if (revealEls.length) {
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
      revealEls.forEach((el) => io.observe(el));
      cleanups.push(() => io.disconnect());
    }

    // ---- S3: play-once identity sequence; any tap completes instantly (#183).
    const s3 = document.querySelector<HTMLElement>("[data-s3]");
    if (s3) {
      let doneTimer: ReturnType<typeof setTimeout> | null = null;
      const finish = () => {
        s3.classList.add("is-done");
        s3.removeEventListener("click", finish);
      };
      const io = new IntersectionObserver(
        (entries, obs) => {
          if (entries.some((e) => e.isIntersecting)) {
            s3.classList.add("is-live");
            doneTimer = setTimeout(finish, 2000);
            obs.disconnect();
          }
        },
        { threshold: 0.2 },
      );
      io.observe(s3);
      s3.addEventListener("click", finish);
      cleanups.push(() => {
        io.disconnect();
        s3.removeEventListener("click", finish);
        if (doneTimer) clearTimeout(doneTimer);
      });
    }

    // ---- S4: the gate enactment — one honest tap records the payment.
    const s4 = document.querySelector<HTMLElement>("[data-s4]");
    const gateBtn = s4?.querySelector<HTMLButtonElement>("[data-gate-btn]");
    if (s4 && gateBtn) {
      const pay = () => {
        s4.classList.add("is-paid");
        // Move focus to the recorded-state line so keyboard/AT users land on the outcome.
        s4.querySelector<HTMLElement>("[data-gate-paid]")?.focus();
      };
      gateBtn.addEventListener("click", pay);
      cleanups.push(() => gateBtn.removeEventListener("click", pay));
    }

    // ---- S5: night shed — pulse pauses offscreen; resolves at 60% or 3s dwell;
    //      header adapts while the scene dominates the viewport.
    const s5 = document.querySelector<HTMLElement>("[data-s5]");
    if (s5) {
      let dwell: ReturnType<typeof setTimeout> | null = null;
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            s5.classList.toggle("chip-paused", !e.isIntersecting);
            if (e.isIntersecting && !dwell) {
              dwell = setTimeout(() => s5.classList.add("is-synced"), 3000);
            }
            if (e.isIntersecting && e.intersectionRatio >= 0.6) {
              s5.classList.add("is-synced");
            }
          }
        },
        { threshold: [0, 0.6] },
      );
      io.observe(s5);
      const section = s5.closest("section");
      let nightIO: IntersectionObserver | null = null;
      if (section) {
        nightIO = new IntersectionObserver(
          (entries) => {
            for (const e of entries) {
              document.documentElement.classList.toggle("at-night", e.intersectionRatio >= 0.5);
            }
          },
          { threshold: [0.5] },
        );
        nightIO.observe(section);
      }
      cleanups.push(() => {
        io.disconnect();
        nightIO?.disconnect();
        if (dwell) clearTimeout(dwell);
        document.documentElement.classList.remove("at-night");
      });
    }

    // ---- S8: copy the mandi line (#194/#306).
    const copyBtn = document.querySelector<HTMLElement>("[data-copy-line]");
    if (copyBtn) {
      const status = document.querySelector<HTMLElement>("[data-copy-status]");
      const line = copyBtn.getAttribute("data-copy-line") ?? "";
      const onCopy = async () => {
        try {
          await navigator.clipboard.writeText(`${line} — ShilaTeq`);
          if (status) {
            status.textContent = "Copied.";
            setTimeout(() => {
              status.textContent = "";
            }, 2500);
          }
        } catch {
          /* clipboard unavailable: select-and-copy remains possible */
        }
      };
      copyBtn.addEventListener("click", onCopy);
      cleanups.push(() => copyBtn.removeEventListener("click", onCopy));
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}
