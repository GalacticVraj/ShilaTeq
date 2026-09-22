"use client";

import { useState } from "react";

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(true);

  const tiers = [
    {
      name: "Starter",
      badge: "Small Yards",
      desc: "For yards digitizing raw blocks, gangsaw yields, and QR tags for the first time.",
      monthlyPrice: 1499,
      annualMonthlyEquiv: 1199,
      annualTotal: "₹14,388 / year",
      features: [
        "Up to 500 active blocks & slabs",
        "Camera AI QR tag scanning",
        "Gangsaw cut & wastage tracking",
        "Offline worker logging",
        "Excel & CSV data exports",
        "Standard email & WhatsApp support",
      ],
      popular: false,
      ctaText: "Start Starter Plan",
      ctaHref: "/demo?plan=starter",
    },
    {
      name: "Growth",
      badge: "⭐ Most Popular",
      desc: "For yards ready to run quotes, WhatsApp billing, and eliminate double-selling.",
      monthlyPrice: 2999,
      annualMonthlyEquiv: 2399,
      annualTotal: "₹28,788 / year",
      features: [
        "Up to 2,500 active blocks & slabs",
        "Instant WhatsApp GST tax invoices",
        "Zero double-selling atomic locking",
        "Hindi + English offline worker app",
        "Real-time dead capital & aging alerts",
        "Assisted onboarding & initial 50 block tagging",
      ],
      popular: true,
      ctaText: "⚡ Start 14-Day Free Trial",
      ctaHref: "/demo?plan=growth",
    },
    {
      name: "Professional",
      badge: "High Growth",
      desc: "For full-cycle processors wanting public 3D showroom and procurement tracking.",
      monthlyPrice: 4499,
      annualMonthlyEquiv: 3599,
      annualTotal: "₹43,188 / year",
      features: [
        "Unlimited blocks, slabs & remnants",
        "Branded Public 3D Showroom link",
        "Gate passes & driver dispatch proof",
        "Automated customer balance ledgers",
        "Quarry procurement cost tracking",
        "Dedicated onboarding manager",
      ],
      popular: false,
      ctaText: "Start Professional",
      ctaHref: "/demo?plan=pro",
    },
    {
      name: "Enterprise",
      badge: "Multi-Yard Hubs",
      desc: "For large processors wanting full payroll, multi-yard consolidation & BI reports.",
      monthlyPrice: 5499,
      annualMonthlyEquiv: 4499,
      annualTotal: "₹53,988 / year",
      features: [
        "Everything in Professional",
        "Workforce attendance & payroll ledger",
        "Multi-yard rollup management",
        "Custom ERP & accounting exports",
        "24/7 Priority telephone hotline",
        "On-site team training in Rajasthan/South India",
      ],
      popular: false,
      ctaText: "Talk to Founders",
      ctaHref: "https://wa.me/917043765580?text=Namaste,%20I%20am%20interested%20in%20ShilaTeq%20Enterprise%20Plan.",
    },
  ];

  return (
    <section id="pricing" className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/60 px-3.5 py-1 text-xs font-semibold text-emerald-400">
            Simple, Transparent Pricing
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Choose the Plan That Pays for Itself <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-amber-300 bg-clip-text text-transparent">
              In Your First 30 Days.
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-400 sm:text-lg">
            No expensive handheld scanners to purchase. No gateway commission on your stone sales. Cancel anytime.
          </p>

          {/* Monthly / Annual Toggle */}
          <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-slate-800 bg-slate-900/80 p-1.5 backdrop-blur-md">
            <button
              onClick={() => setIsAnnual(false)}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                !isAnnual
                  ? "bg-slate-800 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Billed Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                isAnnual
                  ? "bg-emerald-600 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span>Billed Annually</span>
              <span className="rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-extrabold text-slate-950">
                SAVE 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {tiers.map((tier) => {
            const price = isAnnual ? tier.annualMonthlyEquiv : tier.monthlyPrice;
            return (
              <div
                key={tier.name}
                className={`relative flex flex-col justify-between rounded-2xl border p-6 transition-all duration-300 ${
                  tier.popular
                    ? "border-emerald-500 bg-slate-900/90 shadow-2xl shadow-emerald-500/10 ring-2 ring-emerald-500/40"
                    : "border-slate-800 bg-slate-950/70 hover:border-slate-700"
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 px-3 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-950 shadow">
                    Most Popular Choice
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">{tier.name}</h3>
                    <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-[10px] text-slate-300">
                      {tier.badge}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-slate-400 leading-relaxed">{tier.desc}</p>

                  <div className="mt-5 border-t border-slate-800/80 pt-5">
                    <div className="flex items-baseline gap-1">
                      <span className="font-mono text-3xl font-extrabold text-white">
                        ₹{price.toLocaleString()}
                      </span>
                      <span className="text-xs text-slate-400">/ month</span>
                    </div>
                    {isAnnual && (
                      <p className="mt-1 font-mono text-[11px] text-emerald-400">
                        {tier.annualTotal} (billed annually)
                      </p>
                    )}
                  </div>

                  <ul className="mt-6 space-y-2.5 text-xs text-slate-300">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <span className="text-emerald-400 font-bold shrink-0">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 border-t border-slate-800/80 pt-5">
                  <a
                    href={tier.ctaHref}
                    className={`block w-full rounded-xl py-3 text-center text-xs font-bold transition-all ${
                      tier.popular
                        ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 active:scale-95"
                        : "border border-slate-700 bg-slate-800 text-white hover:bg-slate-700"
                    }`}
                  >
                    {tier.ctaText}
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Reassurance Guarantee Footer */}
        <div className="mt-12 rounded-2xl border border-slate-800 bg-slate-950/40 p-6 text-center text-xs text-slate-400 sm:flex sm:items-center sm:justify-between sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <span className="font-semibold text-slate-200">
              🛡️ The ShilaTeq Transparency Guarantee:
            </span>
            <span>Zero Payment Gateway Cut</span>
            <span>•</span>
            <span>Zero Messaging Fees</span>
            <span>•</span>
            <span>Full Data Export to Excel Anytime</span>
          </div>
          <a
            href="https://wa.me/917043765580?text=Namaste,%20I%20have%20questions%20about%20ShilaTeq%20pricing."
            target="_blank"
            rel="noreferrer"
            className="mt-3 sm:mt-0 font-semibold text-emerald-400 hover:text-emerald-300"
          >
            Have questions? Chat on WhatsApp &rarr;
          </a>
        </div>
      </div>
    </section>
  );
}
