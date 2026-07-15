"use client";

import Link from "next/link";
import { useDemoProgress } from "@/lib/demoProgress";
import { TOTAL_STEPS } from "@/content/demoSteps";

/**
 * Resume affordance (phase-4/02 F10): on the overview, if a previous session
 * got partway, offer to continue. Reads reactively via useSyncExternalStore —
 * server snapshot is empty, so first-time/no-JS visitors simply start fresh.
 */
export function DemoResume() {
  const { furthest } = useDemoProgress();
  if (furthest < 1 || furthest > TOTAL_STEPS) return null;

  return (
    <div className="rounded-paper border-line-300 bg-paper-2 shadow-desk mt-6 border p-4">
      <p className="text-body text-ink-900">
        You were partway through — pick up where you left off.
      </p>
      <Link
        href={`/demo?step=${furthest}`}
        className="rounded-paper border-line-300 bg-paper-2 text-body text-ink-900 hover:border-ink-700 mt-3 inline-flex min-h-11 items-center gap-2 border px-4 py-2 font-bold"
      >
        Continue at step {furthest} →
      </Link>
    </div>
  );
}
