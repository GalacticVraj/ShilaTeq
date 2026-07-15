import Link from "next/link";
import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

/**
 * Stamp buttons (Phase-3 09 §2): primary = ink stamp; secondary = quiet hairline door.
 * Press physics are CSS-only (active scale 0.98, no overshoot). Labels are verbs in
 * the plain register. Exactly one primary per view (enforced by page specs, not code).
 */
type ButtonProps = {
  href: string;
  variant?: "primary" | "secondary";
  children: ReactNode;
  /** Small mono line under the label (e.g. "no signup · nothing to install"). */
  microline?: string;
  external?: boolean;
  className?: string;
};

const base =
  "inline-flex flex-col items-center justify-center gap-0.5 rounded-paper px-6 font-sans font-bold " +
  "text-body min-h-12 py-3 select-none transition-[background-color,border-color,transform] duration-180 ease-standard " +
  "active:scale-[0.98] motion-reduce:active:scale-100";

const variants = {
  primary: "bg-ink-900 text-paper-2 hover:bg-black",
  secondary: "border border-line-300 bg-paper-2 text-ink-900 hover:border-ink-700 shadow-desk",
} as const;

export function Button({
  href,
  variant = "primary",
  children,
  microline,
  external,
  className,
}: ButtonProps) {
  const cls = cn(base, variants[variant], className);
  const content = (
    <>
      <span className="inline-flex items-center gap-2">{children}</span>
      {microline ? (
        <span className="text-label font-mono font-normal tracking-wide normal-case opacity-70">
          {microline}
        </span>
      ) : null}
    </>
  );
  if (external) {
    return (
      <a href={href} className={cls} target="_blank" rel="noopener noreferrer">
        {content}
        <span className="sr-only">(opens in new tab)</span>
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {content}
    </Link>
  );
}
