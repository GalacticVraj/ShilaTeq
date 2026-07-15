import type { Metadata } from "next";
import { Suspense } from "react";
import { Fraunces, Mukta, JetBrains_Mono } from "next/font/google";
import { Header } from "@/components/chrome/Header";
import { Footer } from "@/components/chrome/Footer";
import { WhatsAppDock } from "@/components/chrome/WhatsAppDock";
import { AnalyticsProvider } from "@/components/analytics/AnalyticsProvider";
import { site, waLink, waDefaultPrefill } from "@/config/site";
import "./globals.css";

/**
 * Type system (Phase-3 04): Fraunces = the editorial voice (axes locked stern —
 * SOFT/WONK stay at their 0 defaults by omission); Mukta = the working voice,
 * Latin + Devanagari as equal citizens; JetBrains Mono = the ledger voice.
 */
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  // Static instances instead of the variable file (A-007 follow-up): the
  // variable+opsz woff2 was 66KB and dominated LCP under simulated 4G.
  // Display voice uses exactly two weights (Phase-3 04 §3 discipline).
  weight: ["500", "600"],
  style: ["normal"],
  display: "optional",
  // The hero headline is LCP text — Fraunces earns a forced preload.
  preload: true,
});

// Split Mukta instances (A-007): Latin is body/LCP text and must be ready at
// first paint (a late swap re-registers LCP), so it preloads (~28KB). The
// Devanagari face stays lazy — its unicode-range means only Hindi-rendering
// pages download it (Phase-3 04 §13).
const muktaLatin = Mukta({
  variable: "--font-mukta",
  subsets: ["latin"],
  // Two weights only (Phase-3 04 §3 discipline): 400 body, 700 emphasis.
  weight: ["400", "700"],
  display: "optional",
  preload: true,
});

const muktaDevanagari = Mukta({
  variable: "--font-mukta-dev",
  subsets: ["devanagari"],
  weight: ["400", "700"],
  display: "optional",
  preload: false,
  // No synthesized full-range fallback: it would intercept glyphs before the
  // Latin instance in the font stack. Range-gated face only.
  adjustFontFallback: false,
});

const jbMono = JetBrains_Mono({
  variable: "--font-jbmono",
  subsets: ["latin"],
  weight: ["400"],
  display: "optional",
  preload: false,
});

export const viewport = {
  // Light theme always; UA must not force-darken (Phase-3 03 §8).
  colorScheme: "light" as const,
};

export const metadata: Metadata = {
  title: {
    default: "ShilaTeq — Run your whole stone yard from one phone",
    template: "%s — ShilaTeq",
  },
  description:
    "Every block gets a QR identity. Cutting, quotes, orders, GST invoices, dispatch, payments, payroll and a public 3D showroom — in English or Hindi, even without signal.",
  ...(site.url ? { metadataBase: new URL(site.url) } : {}),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const wa = waLink(waDefaultPrefill);
  return (
    <html
      lang="en"
      // The inline script strips `no-js` BEFORE hydration; without this,
      // React 19 sees the attribute mismatch and silently re-renders the
      // whole tree client-side — repainting everything post-hydration and
      // dragging LCP to ~3.5s (A-007 diagnosis).
      suppressHydrationWarning
      className={`${fraunces.variable} ${muktaLatin.variable} ${muktaDevanagari.variable} ${jbMono.variable} no-js h-full`}
    >
      <body className="bg-paper-0 text-ink-900 flex min-h-full flex-col">
        <script
          // Progressive enhancement flag: choreography only runs when JS is live.
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.remove('no-js')",
          }}
        />
        <a
          href="#main"
          className="focus:rounded-paper focus:border-line-300 focus:bg-paper-2 focus:text-body focus:text-ink-900 focus:shadow-desk-2 sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:border focus:px-4 focus:py-2"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        {wa ? <WhatsAppDock href={wa} /> : null}
        <Suspense fallback={null}>
          <AnalyticsProvider />
        </Suspense>
      </body>
    </html>
  );
}
