import type { Metadata } from "next";

/**
 * Unmatched URLs. With two root layouts ((site) and (kerf)) there is no single
 * layout to compose a 404 from (Next.js `global-not-found`, see next.config.ts).
 *
 * Deliberately self-contained, like global-error.tsx: Next adds this module to
 * EVERY route's tree, so anything it imports (fonts, global CSS, chrome) would
 * ship on every page of both designs. Inline styles only; no imports.
 * Segment-level 404s inside (site) still use (site)/not-found with full chrome.
 */
export const metadata: Metadata = {
  title: "Page not found — ShilaTeq",
  robots: { index: false, follow: true },
};

const links = [
  ["Home", "/"],
  ["Product", "/product"],
  ["Demo", "/demo"],
  ["Pricing", "/pricing"],
  ["Contact", "/contact"],
] as const;

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f4f1ea",
          color: "#1b1c1a",
          fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
          padding: "2rem",
        }}
      >
        <main style={{ maxWidth: "34rem" }}>
          <p
            style={{
              fontFamily: "ui-monospace, Menlo, monospace",
              fontSize: "0.8125rem",
              letterSpacing: "0.1em",
              color: "#5f605a",
              margin: 0,
            }}
          >
            404
          </p>
          <h1 style={{ fontSize: "2.25rem", lineHeight: 1.1, margin: "0.75rem 0 1rem" }}>
            This block isn&rsquo;t in the yard.
          </h1>
          <p style={{ fontSize: "1.0625rem", lineHeight: 1.6, color: "#393a36", margin: 0 }}>
            The page you&rsquo;re looking for doesn&rsquo;t exist here. These do:
          </p>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: "1.25rem 0 0",
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem 1.5rem",
            }}
          >
            {links.map(([label, href]) => (
              <li key={href}>
                <a
                  href={href}
                  style={{
                    color: "#264b3a",
                    fontWeight: 600,
                    textUnderlineOffset: "4px",
                    display: "inline-block",
                    padding: "0.6rem 0",
                  }}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </main>
      </body>
    </html>
  );
}
