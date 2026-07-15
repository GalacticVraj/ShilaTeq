"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import { visitStep } from "@/lib/demoProgress";

/**
 * Step navigation + honest progress indicator (phase-4/04 §3; M5 requirements:
 * keyboard, history, session persistence, deep-linkable, reduced-motion). The
 * bar derives from `current` (no hydration mismatch); localStorage records the
 * visit for cross-session resume. Prev/Next are real links (work with no JS);
 * Arrow keys enhance. On mount, focus moves to the step heading for SR context.
 */
export function DemoStepNav({ current, total }: { current: number; total: number }) {
  const router = useRouter();
  const marked = useRef(false);

  const prevHref = current <= 1 ? "/demo" : `/demo?step=${current - 1}`;
  const nextHref = current >= total ? "/demo?step=done" : `/demo?step=${current + 1}`;

  // External-system sync only (localStorage + DOM focus) — no React setState.
  useEffect(() => {
    if (!marked.current) {
      visitStep(current);
      marked.current = true;
    }
    document.getElementById("demo-step-heading")?.focus({ preventScroll: false });
  }, [current]);

  // Arrow-key navigation, guarded against form fields and modifiers.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
      if (e.key === "ArrowRight") router.push(nextHref);
      if (e.key === "ArrowLeft") router.push(prevHref);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router, nextHref, prevHref]);

  return (
    <div>
      {/* Honest progress indicator */}
      <div className="flex items-center gap-3">
        <p className="text-label text-ink-500 font-mono">
          Step {current} of {total}
        </p>
        <ol className="flex flex-1 gap-1.5" aria-hidden="true">
          {Array.from({ length: total }, (_, i) => i + 1).map((i) => (
            <li
              key={i}
              className={cn(
                "h-1 flex-1 rounded-full",
                i < current ? "bg-ink-700" : i === current ? "bg-accent-600" : "bg-line-100",
              )}
            />
          ))}
        </ol>
      </div>
      {/* Content changes each step (component re-mounts on nav) → announced. */}
      <p role="status" aria-live="polite" className="sr-only">
        Step {current} of {total}
      </p>

      {/* Prev / Next */}
      <div className="mt-6 flex items-center justify-between gap-4">
        <Link
          href={prevHref}
          className="rounded-paper text-body text-ink-700 hover:text-ink-900 inline-flex min-h-11 items-center gap-1 px-3 py-2"
        >
          ← {current <= 1 ? "Overview" : "Back"}
        </Link>
        <Link
          href={nextHref}
          className="rounded-paper bg-ink-900 text-body text-paper-2 ease-standard inline-flex min-h-11 items-center gap-2 px-5 py-2.5 font-bold transition-colors duration-180 hover:bg-black active:scale-[0.98] motion-reduce:active:scale-100"
        >
          {current >= total ? "Finish →" : "Next step →"}
        </Link>
      </div>
    </div>
  );
}
