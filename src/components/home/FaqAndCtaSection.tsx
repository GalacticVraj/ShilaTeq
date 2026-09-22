"use client";

import { useState } from "react";

export function FaqAndCtaSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Do I need to buy expensive handheld barcode scanners or computers?",
      a: "Not at all. ShilaTeq runs directly in the browser on any phone your yard already owns — from a ₹6,000 Android smartphone to an iPhone or shop PC. The phone's camera acts as the high-speed QR scanner with zero hardware to buy.",
    },
    {
      q: "What if there is zero mobile signal in the gangsaw shed or back rows?",
      a: "ShilaTeq is engineered offline-first. Your machine operators and loaders can log cutting shifts, block movements, and slab numbers without any signal. Everything is saved securely on the device and automatically syncs the moment signal is restored.",
    },
    {
      q: "Can my shop-floor workers use this if they don't know English or computers?",
      a: "Yes. The worker app was specifically created for rough Indian stone yard environments. It works in full Hindi (हिंदी) or English with huge touch buttons, visual stone icons, and numbers. Most workers master it within 15 minutes of testing.",
    },
    {
      q: "How long does setup take, and do we get help tagging our yard?",
      a: "Your yard is provisioned and ready to log in within 24 hours. Our team helps configure your GSTIN, HSN codes, and block numbering formats. For Growth and Pro plans, we provide assisted onboarding to help tag your first 50 blocks.",
    },
    {
      q: "Can competitors or buyers see what I paid the quarry or my profit margins?",
      a: "Never. Your procurement costs, supplier identities, and margins are strictly private to your admin login. In your public 3D Showroom, you have complete control over whether to display retail rates or simply mark items 'Price on Request'.",
    },
  ];

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* FAQ Header */}
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-900/80 px-3.5 py-1 text-xs font-semibold text-slate-300">
            Common Questions
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Everything You Need to Know Before Trying ShilaTeq.
          </h2>
        </div>

        {/* Accordion */}
        <div className="mt-10 space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.q}
                className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950/70 transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between p-5 text-left text-sm font-bold text-white transition-colors hover:text-emerald-400"
                >
                  <span>{faq.q}</span>
                  <span className="ml-4 font-mono text-lg text-emerald-400">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                {isOpen && (
                  <div className="border-t border-slate-800/80 px-5 pb-5 pt-2 text-xs leading-relaxed text-slate-400">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Final High-Impact Sales Closing Banner */}
        <div className="mt-20 overflow-hidden rounded-3xl border border-emerald-500/40 bg-gradient-to-br from-emerald-950/60 via-slate-950 to-cyan-950/40 p-8 text-center shadow-2xl backdrop-blur-2xl sm:p-12 lg:p-16">
          <div className="mx-auto max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/20 px-4 py-1 text-xs font-extrabold text-emerald-300 uppercase tracking-widest">
              Ready to Modernize Your Yard?
            </span>
            <h3 className="mt-6 text-3xl font-extrabold text-white sm:text-5xl tracking-tight">
              Stop Bleeding Crores into Paper Registers. <br />
              <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-amber-300 bg-clip-text text-transparent">
                Run Your Whole Yard on ShilaTeq.
              </span>
            </h3>
            <p className="mx-auto mt-5 max-w-2xl text-sm text-slate-300 sm:text-base leading-relaxed">
              Explore the full live demo alone with zero signup, or book a 10-minute walkthrough with our founding team. We will show you exactly how your yard eliminates wastage from day one.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="/demo"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-8 py-4 text-sm font-extrabold text-slate-950 shadow-xl shadow-emerald-500/25 transition-all hover:bg-emerald-400 active:scale-95 sm:w-auto"
              >
                ⚡ Try Full Free Interactive Demo
              </a>
              <a
                href="https://wa.me/917043765580?text=Namaste,%20I%20want%20to%20schedule%20a%2010-minute%20live%20demo%20of%20ShilaTeq."
                target="_blank"
                rel="noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-500/50 bg-slate-900/90 px-8 py-4 text-sm font-bold text-white shadow transition-all hover:bg-slate-800 sm:w-auto"
              >
                <svg className="h-5 w-5 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
                </svg>
                Book a 10-Minute WhatsApp Demo
              </a>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="text-emerald-400 font-bold">✓</span> No credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-emerald-400 font-bold">✓</span> Nothing to install
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-emerald-400 font-bold">✓</span> 48-Hour Yard Setup
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
