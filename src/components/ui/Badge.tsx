import { cn } from "@/lib/cn";

/**
 * Badges state facts, never promotions (Phase-3 09 §7). ≤1 per object.
 * Variants are the closed set from phase-4/09 §3.
 */
type BadgeProps = {
  variant: "demo-data" | "roadmap" | "in-progress" | "ok" | "warn" | "danger";
  children: React.ReactNode;
  className?: string;
};

const variants = {
  "demo-data": "border border-line-300 text-ink-700 bg-paper-1",
  roadmap: "border border-line-300 text-ink-700 bg-paper-2",
  "in-progress": "bg-warn-100 text-warn-700",
  ok: "bg-ok-100 text-ok-600",
  warn: "bg-warn-100 text-warn-700",
  danger: "bg-danger-100 text-danger-600",
} as const;

export function Badge({ variant, children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "rounded-paper-sm text-label inline-block px-2 py-0.5 font-mono font-medium tracking-wider uppercase",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
