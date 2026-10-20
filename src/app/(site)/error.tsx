"use client";

import { useEffect } from "react";
import Link from "next/link";

/**
 * Route-level error boundary (M7 monitoring). Brand-consistent, honest, and
 * always offers a way forward. Logs to the console (and to analytics if wired)
 * without exposing internals to the visitor.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surfaced for monitoring; PostHog captures this if configured.
    console.error("Route error:", error);
  }, [error]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      <div className="max-w-2xl">
        <p className="eyebrow">Something went wrong</p>
        <h1 className="font-display text-display-2 text-ink-900 mt-3 font-medium tracking-tight">
          That didn&rsquo;t load as it should.
        </h1>
        <p className="text-body-lg text-ink-700 mt-4">
          A rare hiccup on our side, not yours. Try again, or head back to steady ground.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="rounded-paper bg-ink-900 text-body text-paper-2 ease-standard inline-flex min-h-12 items-center justify-center px-6 py-3 font-bold transition-colors duration-180 hover:bg-black active:scale-[0.98] motion-reduce:active:scale-100"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-paper border-line-300 bg-paper-2 text-body text-ink-900 hover:border-ink-700 inline-flex min-h-12 items-center justify-center border px-6 py-3 font-bold"
          >
            Go to the homepage
          </Link>
        </div>
        {error.digest ? (
          <p className="text-label text-ink-500 mt-8 font-mono">Reference: {error.digest}</p>
        ) : null}
      </div>
    </div>
  );
}
