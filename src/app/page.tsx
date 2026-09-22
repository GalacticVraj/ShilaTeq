import Link from "next/link";
import { HeroDashboardMockup } from "@/components/home/HeroDashboardMockup";
import { InteractiveYardScanner } from "@/components/home/InteractiveYardScanner";
import { RoiCalculator } from "@/components/home/RoiCalculator";
import { ProductDeviceTabs } from "@/components/home/ProductDeviceTabs";
import { SocialProofSection } from "@/components/home/SocialProofSection";
import { PricingSection } from "@/components/home/PricingSection";
import { FaqAndCtaSection } from "@/components/home/FaqAndCtaSection";

export default function Home() {
  return (
    <div className="relative overflow-hidden bg-[#070b12] text-slate-100">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute top-0 left-1/2 -z-10 h-[600px] w-full max-w-7xl -translate-x-1/2 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(16,185,129,0.18),rgba(6,182,212,0.12),transparent)]" />
      <div className="pointer-events-none absolute top-[1400px] right-0 -z-10 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[140px]" />
      <div className="pointer-events-none absolute top-[2800px] left-0 -z-10 h-[600px] w-[600px] rounded-full bg-emerald-500/10 blur-[160px]" />

      {/* ================= HERO SECTION ================= */}
      <section className="relative px-4 pt-16 pb-12 sm:px-6 sm:pt-24 sm:pb-16 lg:px-8">
        <div className="mx-auto max-w-6xl text-center">
          {/* Glowing Announcement Chip */}
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/60 px-4 py-1.5 text-xs font-semibold text-emerald-400 backdrop-blur-md shadow-lg shadow-emerald-500/10 animate-fade-in">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span>The #1 Mobile-First Operating System for Indian Stone Yards</span>
          </div>

          {/* Punchy Hero Headline */}
          <h1 className="mt-8 text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
            Run Your Entire Stone Yard <br />
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-amber-300 bg-clip-text text-transparent">
              On a Single Phone.
            </span>
          </h1>

          {/* Crisp Subhead */}
          <p className="mx-auto mt-6 max-w-2xl text-base text-slate-300 sm:text-xl leading-relaxed">
            From raw quarry block arrival to instant WhatsApp GST invoices. Eliminate dead stock, cut cutting wastage by 22%, and double your sales collection speed.
          </p>

          {/* High-Converting CTA Actions */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/demo"
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-8 py-4 text-sm font-extrabold text-slate-950 shadow-xl shadow-emerald-500/25 transition-all hover:bg-emerald-400 hover:shadow-emerald-500/40 active:scale-95 sm:w-auto"
            >
              ⚡ Book a 10-Minute Live Demo
            </Link>

            <a
              href="#yard-scanner"
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/80 px-7 py-4 text-sm font-bold text-slate-200 backdrop-blur-md transition-all hover:border-slate-600 hover:bg-slate-800 active:scale-95 sm:w-auto"
            >
              📱 Try Interactive Yard Simulator ↓
            </a>

            <a
              href="https://wa.me/917043765580?text=Namaste,%20I%20want%20to%20learn%20how%20ShilaTeq%20runs%20stone%20yards."
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors py-2"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
              </svg>
              Chat on WhatsApp (Hindi / EN)
            </a>
          </div>

          {/* Social Proof Strip */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs font-medium text-slate-400">
            <span className="flex items-center gap-1.5">
              <strong className="text-white">₹450+ Cr</strong> Inventory Managed
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <strong className="text-white">120+</strong> Stone Yards in India
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <strong className="text-white">99.8%</strong> Billing Accuracy
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <strong className="text-white">100%</strong> Offline Ready
            </span>
          </div>

          {/* Interactive Hero Command Center Mockup */}
          <div className="mt-12">
            <HeroDashboardMockup />
          </div>
        </div>
      </section>

      {/* ================= INTERACTIVE YARD & QR SCANNER ================= */}
      <InteractiveYardScanner />

      {/* ================= ROI & WASTAGE CALCULATOR ================= */}
      <RoiCalculator />

      {/* ================= PRODUCT DEVICE TABS ================= */}
      <ProductDeviceTabs />

      {/* ================= CUSTOMER STORIES & SOCIAL PROOF ================= */}
      <SocialProofSection />

      {/* ================= TRANSPARENT PRICING ================= */}
      <PricingSection />

      {/* ================= FAQ & CLOSING SALES BANNER ================= */}
      <FaqAndCtaSection />
    </div>
  );
}
