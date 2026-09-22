import type { Metadata } from "next";
import { PricingSection } from "@/components/home/PricingSection";
import { RoiCalculator } from "@/components/home/RoiCalculator";

export const metadata: Metadata = {
  title: "Pricing — Transparent Plans for Indian Stone Yards",
  description:
    "ShilaTeq pricing plans for marble, granite and stone yards. Starter, Growth, Professional, and Enterprise tiers with zero hidden fees.",
};

const costShape = [
  {
    item: "Zero Hardware to Buy",
    why: "Runs directly in mobile browsers. Any basic smartphone camera acts as the high-speed QR scanner.",
  },
  {
    item: "Zero Servers to Maintain",
    why: "Your data is protected in high-security cloud storage. Auto-backed up every hour.",
  },
  {
    item: "Zero WhatsApp Messaging Charges",
    why: "Tax invoices and quotes dispatch over direct WhatsApp click-to-chat links with zero messaging surcharges.",
  },
  {
    item: "Zero Payment Commission",
    why: "ShilaTeq records payments and generates UPI QR codes without taking any percentage cut from your turnover.",
  },
  {
    item: "Full Data Ownership & Excel Export",
    why: "One-click CSV/Excel export anytime. Your inventory and accounts remain 100% your property.",
  },
] as const;

export default function PricingPage() {
  return (
    <div className="relative py-12 px-4 sm:px-6 lg:px-8">
      {/* Interactive Modern Pricing Section */}
      <PricingSection />

      {/* ROI Calculator for financial proof */}
      <RoiCalculator />

      {/* What You'll Never Pay For */}
      <section className="mx-auto mt-16 max-w-4xl px-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6 sm:p-10">
          <h2 className="text-xl font-bold text-white sm:text-2xl">
            The ShilaTeq Fair-Pricing Promise
          </h2>
          <p className="mt-2 text-xs text-slate-400">
            Things you will never see on your bill, ever:
          </p>

          <div className="mt-6 space-y-4">
            {costShape.map((row) => (
              <div
                key={row.item}
                className="flex items-start gap-3 rounded-xl border border-slate-800/70 bg-slate-900/50 p-4"
              >
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">
                  ✓
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{row.item}</h3>
                  <p className="mt-1 text-xs text-slate-400">{row.why}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-6 sm:flex-row">
            <div>
              <h3 className="text-sm font-bold text-white">Need a Multi-Yard Enterprise Quote?</h3>
              <p className="text-xs text-slate-300">
                Custom billing and dedicated on-site staff training for processors handling &gt;5,000 tons/mo.
              </p>
            </div>
            <a
              href="https://wa.me/917043765580?text=Namaste,%20I%20need%20an%20enterprise%20quote%20for%20multiple%20stone%20yards."
              target="_blank"
              rel="noreferrer"
              className="shrink-0 rounded-xl bg-emerald-500 px-6 py-3 text-xs font-bold text-slate-950 shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition-colors"
            >
              💬 Talk to Founders
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
