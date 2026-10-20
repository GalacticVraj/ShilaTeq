import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Archivo, Archivo_Narrow, IBM_Plex_Mono, Kalam } from "next/font/google";
import { AnalyticsProvider } from "@/components/analytics/AnalyticsProvider";
import { KerfFooter, KerfHeader } from "@/components/kerf/Chrome";
import { site } from "@/config/site";
import "./kerf.css";

/**
 * Root layout for redesigned (KERF) routes. Legacy routes live under (site)
 * with their own root layout, so the two systems never share CSS or fonts.
 * Navigating between them is a full page load (Next.js multiple root layouts).
 */

// Text voice: static Archivo (OFL), two weights. Display voice: the family's
// own narrow cut, Archivo Narrow 700 (OFL) — static files instead of the 90 KB
// variable font with a width axis. `optional` never swaps, so no metric-matched
// fallback is needed; role-specific fallbacks live in kerf.css.
const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-archivo",
  display: "optional",
  adjustFontFallback: false,
});
const archivoNarrow = Archivo_Narrow({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-archivo-narrow",
  display: "optional",
  adjustFontFallback: false,
});

// Codes, quantities, labels.
const plex = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-plex",
  display: "swap",
  preload: false,
});

// The register's handwriting (in the first viewport, so it preloads).
const kalam = Kalam({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-kalam",
  display: "swap",
});

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#f4f1ea",
};

export const metadata: Metadata = {
  title: {
    default: "StoneX ERP by ShilaTeq — every block in your yard, known",
    template: "%s — ShilaTeq",
  },
  description:
    "StoneX gives every block in your stone yard its own QR identity, then runs cutting, quotes, GST invoices, payment records and dispatch from it, on the phones you already have.",
  ...(site.url ? { metadataBase: new URL(site.url) } : {}),
};

export default function KerfLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      // The inline script strips `no-js` before hydration (progressive enhancement).
      suppressHydrationWarning
      className={`${archivo.variable} ${archivoNarrow.variable} ${plex.variable} ${kalam.variable} no-js`}
    >
      <body className="flex min-h-svh flex-col">
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.remove('no-js')",
          }}
        />
        <a
          href="#main"
          className="bg-charcoal-950 text-ivory-50 sr-only z-50 px-4 py-3 font-semibold focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        <KerfHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <KerfFooter />
        <Suspense fallback={null}>
          <AnalyticsProvider />
        </Suspense>
      </body>
    </html>
  );
}
