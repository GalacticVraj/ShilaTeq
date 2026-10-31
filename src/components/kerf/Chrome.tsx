import Link from "next/link";
import {
  footerColumns,
  linkedInUrl,
  nav,
  salesContacts,
  site,
  waDefaultPrefill,
  waLink,
} from "@/config/site";

/** The brand mark: one block, one kerf. */
export function KerfMark({ className = "size-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <rect x="2.5" y="5" width="8.75" height="14" fill="var(--color-forest-800)" />
      <rect x="12.75" y="5" width="8.75" height="14" fill="var(--color-forest-800)" />
    </svg>
  );
}

const linkCls =
  "text-charcoal-700 hover:text-charcoal-950 inline-flex min-h-11 items-center text-[0.9375rem] font-medium transition-colors";

export function KerfHeader() {
  // WhatsApp is the only header CTA, and only when its number is configured.
  const wa = waLink(waDefaultPrefill);
  return (
    <header className="border-ivory-200 border-b">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-6 px-4 sm:px-8 lg:px-12">
        <Link href="/" className="flex min-h-11 items-center gap-2.5" aria-label="ShilaTeq home">
          <KerfMark />
          <span className="display-cut text-charcoal-950 text-[1.55rem] leading-none">
            ShilaTeq
          </span>
        </Link>
        <nav aria-label="Primary" className="hidden items-center gap-7 md:flex">
          {/* Plain anchors: these routes use the other root layout, so navigation is
              a full page load and next/link's prefetch would only waste bytes. */}
          {nav.map((item) => (
            <a key={item.href} href={item.href} className={linkCls}>
              {item.label}
            </a>
          ))}
          {wa ? (
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-forest-800 text-ivory-50 hover:bg-forest-700 inline-flex min-h-11 items-center px-4 text-[0.9375rem] font-semibold"
            >
              Talk on WhatsApp
            </a>
          ) : null}
        </nav>
        <details className="group relative md:hidden">
          <summary className="text-charcoal-950 flex min-h-11 cursor-pointer list-none items-center gap-2 font-mono text-[0.8125rem] tracking-[0.1em] uppercase [&::-webkit-details-marker]:hidden">
            <span className="group-open:hidden">Menu</span>
            <span className="hidden group-open:inline">Close</span>
          </summary>
          <nav
            aria-label="Primary mobile"
            className="border-ivory-200 bg-ivory-50 absolute top-full right-0 z-40 mt-2 w-60 border p-2 shadow-[0_20px_40px_-20px_rgb(0_0_0/0.3)]"
          >
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-charcoal-900 hover:bg-ivory-100 flex min-h-12 items-center px-3 font-medium"
              >
                {item.label}
              </a>
            ))}
            {wa ? (
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-forest-800 text-ivory-50 mt-1 flex min-h-12 items-center px-3 font-semibold"
              >
                Talk on WhatsApp
              </a>
            ) : null}
          </nav>
        </details>
      </div>
    </header>
  );
}

const footLink = "text-charcoal-700 hover:text-charcoal-950 text-[0.9375rem] hover:underline";

export function KerfFooter() {
  return (
    <footer className="cv-auto-sm border-ivory-200 bg-ivory-100 border-t">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-4 py-14 sm:grid-cols-2 sm:px-8 lg:grid-cols-[1.4fr_repeat(4,1fr)] lg:px-12">
        <div>
          <Link href="/" className="flex items-center gap-2.5" aria-label="ShilaTeq home">
            <KerfMark />
            <span className="display-cut text-charcoal-950 text-[1.55rem] leading-none">
              ShilaTeq
            </span>
          </Link>
          <p className="text-charcoal-700 mt-4 max-w-xs text-[0.9375rem]">
            StoneX ERP: {site.categoryLine.toLowerCase()}.
          </p>
        </div>
        {footerColumns.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h2 className="eyebrow">{col.title}</h2>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className={footLink}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
        <div>
          <h2 className="eyebrow">Contact sales</h2>
          <ul className="mt-4 space-y-2.5">
            {salesContacts.map((c) => (
              <li key={c.href} className="text-[0.9375rem]">
                <span className="text-charcoal-500">{c.label}: </span>
                <a href={c.href} className={footLink}>
                  {c.display}
                </a>
              </li>
            ))}
            <li>
              <a href={linkedInUrl} target="_blank" rel="noopener noreferrer" className={footLink}>
                LinkedIn ↗<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-ivory-200 border-t">
        <div className="text-charcoal-500 mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-4 px-4 py-5 text-[0.875rem] sm:px-8 lg:px-12">
          <p>© {new Date().getFullYear()} ShilaTeq</p>
          <ul className="flex gap-6">
            {[
              ["Privacy", "/legal/privacy"],
              ["Terms", "/legal/terms"],
              ["Cookies", "/legal/cookies"],
              ["Refunds", "/legal/refund"],
            ].map(([label, href]) => (
              <li key={href}>
                <a href={href} className="hover:text-charcoal-950 hover:underline">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
