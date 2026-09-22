import type { Metadata } from "next";
import { Suspense } from "react";
import { Fraunces, Mukta, JetBrains_Mono } from "next/font/google";
import { Header } from "@/components/chrome/Header";
import { Footer } from "@/components/chrome/Footer";
import { WhatsAppDock } from "@/components/chrome/WhatsAppDock";
import { AnalyticsProvider } from "@/components/analytics/AnalyticsProvider";
import { site, waLink, waDefaultPrefill } from "@/config/site";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal"],
  display: "swap",
  preload: false,
});

const muktaLatin = Mukta({
  variable: "--font-mukta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: true,
});

const muktaDevanagari = Mukta({
  variable: "--font-mukta-dev",
  subsets: ["devanagari"],
  weight: ["400", "700"],
  display: "swap",
  preload: false,
  adjustFontFallback: false,
});

const jbMono = JetBrains_Mono({
  variable: "--font-jbmono",
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
  preload: false,
});

export const viewport = {
  colorScheme: "dark" as const,
};

export const metadata: Metadata = {
  title: {
    default: "ShilaTeq — The Modern SaaS Operating System for Stone Yards",
    template: "%s — ShilaTeq",
  },
  description:
    "Run your entire stone yard on one phone. Instant QR block identity, gangsaw yield recovery, offline Hindi worker app, and 1-tap WhatsApp GST invoicing.",
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
      className={`${fraunces.variable} ${muktaLatin.variable} ${muktaDevanagari.variable} ${jbMono.variable} dark scroll-smooth h-full`}
    >
      <body className="bg-[#070b12] text-slate-100 flex min-h-full flex-col font-sans selection:bg-emerald-500 selection:text-slate-950 antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-emerald-500 focus:px-4 focus:py-2 focus:text-slate-950 focus:font-bold"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <WhatsAppDock href={wa} />
        <Suspense fallback={null}>
          <AnalyticsProvider />
        </Suspense>
      </body>
    </html>
  );
}
