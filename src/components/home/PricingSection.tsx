"use client";

import { useState } from "react";

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(true);

  const tiers = [
    {
      name: "Starter",
      badge: "Small Yards",
      desc: "For yards digitizing raw blocks, gangsaw yields, and QR tags.",
      monthlyPrice: 1499,
      annualMonthlyEquiv: 1199,
      annualTotal: "₹14,388 / year",
      features: [
        "Up to 500 active blocks & slabs",
        "Camera AI QR tag scanning",
        "Gangsaw cut & wastage tracking",
        "Offline worker logging",
        "Excel & CSV data exports",
        "WhatsApp & email support",
      ],
      popular: false,
      ctaText: "Start Starter Plan",
      ctaHref: "#demo",
    },
    {
      name: "Growth",
      badge: "⭐ Most Popular",
      desc: "For yards ready to run quotes, WhatsApp billing, and stop double-selling.",
      monthlyPrice: 2999,
      annualMonthlyEquiv: 2399,
      annualTotal: "₹28,788 / year",
      features: [
        "Up to 2,500 active blocks & slabs",
        "Instant WhatsApp GST tax invoices",
        "Zero double-selling atomic locking",
        "Hindi + English offline worker app",
        "Dead capital & aging alerts",
        "Assisted setup & first 50 block tags",
      ],
      popular: true,
      ctaText: "⚡ Start 14-Day Free Trial",
      ctaHref: "#demo",
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
      ctaHref: "#demo",
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
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1 text-xs font-bold text-emerald-800">
            Simple Pricing
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Plans That Pay for Themselves.
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-base text-slate-600">
            No expensive scanners to buy. No gateway cuts from your stone sales. Cancel anytime.
          </p>

          {/* Monthly / Annual Toggle */}
          <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white p-1.5 shadow-xs">
            <button
              onClick={() => setIsAnnual(false)}
              className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
                !isAnnual
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Billed Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all ${
                isAnnual
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
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
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 text-left">
          {tiers.map((tier) => {
            const price = isAnnual ? tier.annualMonthlyEquiv : tier.monthlyPrice;
            return (
              <div
                key={tier.name}
                className={`relative flex flex-col justify-between rounded-3xl border p-6 transition-all duration-300 ${
                  tier.popular
                    ? "border-emerald-600 bg-white shadow-xl shadow-emerald-600/10 ring-2 ring-emerald-500/30"
                    : "border-slate-200 bg-white shadow-md shadow-slate-100 hover:border-slate-300"
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-emerald-600 px-3.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-sm">
                    Most Popular
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-900">{tier.name}</h3>
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-bold text-slate-600">
                      {tier.badge}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-slate-500 leading-relaxed">{tier.desc}</p>

                  <div className="mt-5 border-t border-slate-100 pt-5">
                    <div className="flex items-baseline gap-1">
                      <span className="font-mono text-3xl font-extrabold text-slate-900">
                        ₹{price.toLocaleString()}
                      </span>
                      <span className="text-xs text-slate-500">/ mo</span>
                    </div>
                    {isAnnual && (
                      <p className="mt-1 font-mono text-[11px] text-emerald-700 font-bold">
                        {tier.annualTotal} (billed annually)
                      </p>
                    )}
                  </div>

                  <ul className="mt-6 space-y-2.5 text-xs text-slate-700">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold shrink-0">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 border-t border-slate-100 pt-5">
                  <a
                    href={tier.ctaHref}
                    className={`block w-full rounded-2xl py-3 text-center text-xs font-bold transition-all ${
                      tier.popular
                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/25 hover:bg-emerald-500 active:scale-95"
                        : "border border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100"
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
        <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-5 text-center text-xs text-slate-600 sm:flex sm:items-center sm:justify-between sm:text-left shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <span className="font-bold text-slate-900">
              🛡️ The ShilaTeq Transparency Guarantee:
            </span>
            <span>Zero Payment Gateway Cut</span>
            <span>•</span>
            <span>Zero Messaging Fees</span>
            <span>•</span>
            <span>Export to Excel Anytime</span>
          </div>
          <a
            href="https://wa.me/917043765580?text=Namaste,%20I%20have%20questions%20about%20ShilaTeq%20pricing."
            target="_blank"
            rel="noreferrer"
            className="mt-2 sm:mt-0 font-bold text-emerald-700 hover:text-emerald-800"
          >
            Questions? Chat on WhatsApp &rarr;
          </a>
        </div>
      </div>
    </section>
  );
}
