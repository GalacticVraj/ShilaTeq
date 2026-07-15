import Link from "next/link";
import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

/**
 * A Document (Phase-3 09 §1): a discrete piece of paper laid on the desk.
 * Hover = border strengthens; never lifts, never scales. When the whole card
 * links, the whole card is the target.
 */
type DocumentCardProps = {
  href?: string;
  eyebrow?: string;
  title: string;
  children?: ReactNode;
  className?: string;
};

export function DocumentCard({ href, eyebrow, title, children, className }: DocumentCardProps) {
  const inner = (
    <>
      {eyebrow ? <p className="eyebrow mb-2">{eyebrow}</p> : null}
      <h3 className="text-heading-2 text-ink-900 font-sans font-bold">{title}</h3>
      {children ? <div className="text-body text-ink-700 mt-2">{children}</div> : null}
    </>
  );
  const surface = cn(
    "block rounded-paper border border-line-100 bg-paper-2 p-6 shadow-desk",
    href &&
      "transition-[border-color,box-shadow] duration-180 ease-standard hover:border-line-300 hover:shadow-desk-2",
    className,
  );
  if (href) {
    return (
      <Link href={href} className={surface}>
        {inner}
      </Link>
    );
  }
  return <div className={surface}>{inner}</div>;
}
