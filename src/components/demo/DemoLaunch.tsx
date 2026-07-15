"use client";

import { useState } from "react";
import { WhatsAppGlyph } from "@/components/ui/DoorsBlock";

/**
 * The "do it" action + doorway hand-off (Phase-3 10 §6). When the demo app URL
 * exists, this is a real target=_blank link (reliable open, works with no JS),
 * with a brief in-page "opening your demo yard…" acknowledgement for the
 * doorway feel — it never gates or fakes the open. When the URL is unset
 * (Gate-zero), it renders an HONEST pending state, never a broken button
 * (A-004). A WhatsApp fallback is always offered.
 */
export function DemoLaunch({
  href,
  label,
  waHref,
}: {
  href: string | null;
  label: string;
  waHref: string | null;
}) {
  const [opening, setOpening] = useState(false);

  if (!href) {
    // Honest pending — not an error, a not-yet.
    return (
      <div className="rounded-paper border-line-300 bg-paper-1 border border-dashed p-5">
        <p className="text-body text-ink-900">The live demo opens here.</p>
        <p className="text-body-sm text-ink-700 mt-1">
          We&rsquo;re preparing the public demo link. The steps above are exactly what you&rsquo;ll
          do the moment it&rsquo;s ready — or we can walk you through it now.
        </p>
        {waHref ? (
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-paper border-line-300 bg-paper-2 text-body text-ink-900 hover:border-ink-700 mt-4 inline-flex min-h-11 items-center gap-2 border px-4 py-2 font-bold"
          >
            <WhatsAppGlyph className="text-ok-600 size-5" />
            Walk me through it on WhatsApp
          </a>
        ) : null}
      </div>
    );
  }

  return (
    <div>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => setOpening(true)}
        className="rounded-paper bg-ink-900 text-body text-paper-2 ease-standard inline-flex min-h-12 items-center gap-2 px-6 py-3 font-bold transition-colors duration-180 hover:bg-black active:scale-[0.98] motion-reduce:active:scale-100"
      >
        {label}
        <span aria-hidden="true">↗</span>
        <span className="sr-only">(opens the demo in a new tab)</span>
      </a>
      {opening ? (
        <p role="status" className="text-label text-ink-700 mt-3 flex items-center gap-2 font-mono">
          <QrDraw />
          Opening your demo yard in a new tab…
        </p>
      ) : null}
    </div>
  );
}

/** The doorway QR motif — draws once (Phase-3 10 §6). Reduced-motion: static. */
function QrDraw() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <g fill="none" stroke="var(--color-accent-600)" strokeWidth="2">
        <path className="qr-draw" d="M3 3h6v6H3z" />
        <path className="qr-draw" d="M15 3h6v6h-6z" style={{ animationDelay: "120ms" }} />
        <path className="qr-draw" d="M3 15h6v6H3z" style={{ animationDelay: "240ms" }} />
        <path className="qr-draw" d="M15 15h3v3h-3z" style={{ animationDelay: "360ms" }} />
      </g>
    </svg>
  );
}
