"use client";

import { useEffect, useRef, useState } from "react";
import { WhatsAppGlyph } from "@/components/ui/DoorsBlock";
import { cn } from "@/lib/cn";

/**
 * The ambient WhatsApp affordance (Phase-3 09 §13): a quiet, persistent door.
 * Shrinks to glyph-only while scrolling down, restores on scroll-up (11 #76).
 * Never bounces, pulses, or expands uninvited. Renders only when the number
 * is configured (AMENDMENTS A-004) — `href` is prebuilt server-side.
 */
export function WhatsAppDock({ href }: { href: string }) {
  const [compact, setCompact] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - lastY.current) > 12) {
        setCompact(y > lastY.current && y > 120);
        lastY.current = y;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "rounded-paper border-line-300 bg-paper-2 text-body text-ink-900 shadow-desk-2 ease-standard fixed right-4 z-30 flex min-h-12 items-center gap-2 border px-4 py-3 font-bold transition-[padding] duration-240",
        "bottom-[max(1rem,env(safe-area-inset-bottom))]",
        compact && "px-3",
      )}
    >
      <WhatsAppGlyph className="text-ok-600 size-5" />
      <span className={cn(compact && "sr-only")}>WhatsApp us</span>
    </a>
  );
}
