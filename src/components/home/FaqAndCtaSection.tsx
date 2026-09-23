"use client";

import { useState } from "react";

export function FaqAndCtaSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Do I need to buy expensive barcode or laser scanners?",
      a: "No. ShilaTeq runs directly in the browser on any phone your yard already owns — from a ₹6,000 Android smartphone to an iPhone. The camera acts as the high-speed scanner.",
    },
    {
      q: "What if there is zero mobile signal in the gangsaw shed or yard back rows?",
      a: "ShilaTeq is engineered 100% offline-first. Workers log cutting shifts and block movements without signal. Everything syncs automatically the moment connectivity returns.",
    },
    {
      q: "Can my shop-floor workers use this if they don't know English or computers?",
      a: "Yes. The worker app works in full Hindi (हिंदी) or English with huge touch buttons, visual stone icons, and numbers. Workers master it in 15 minutes.",
    },
    {
      q: "How long does setup take, and do we get help tagging our yard?",
      a: "Your yard is ready within 24 hours. Our team helps configure your GST rules, block numbering, and assists in tagging your first 50 blocks.",
    },
    {
      q: "Can competitors or buyers see what I paid the quarry or my margins?",
      a: "Never. Your quarry costs and margins are strictly confidential to your admin login. In your public 3D Showroom, you control what buyers see.",
    },
  ];

  return (
    <section id="faq" className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* FAQ Header */}
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-3.5 py-1 text-xs font-bold text-slate-700">
            Quick Answers
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Frequently Asked Questions
          </h2>
        </div>

        {/* Accordion */}
        <div className="mt-10 space-y-3 text-left">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.q}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between p-5 text-left text-sm font-bold text-slate-900 transition-colors hover:text-emerald-700"
                >
                  <span>{faq.q}</span>
                  <span className="ml-4 font-mono text-lg font-bold text-emerald-600">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                {isOpen && (
                  <div className="border-t border-slate-100 px-5 pb-5 pt-3 text-xs leading-relaxed text-slate-600">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Final High-Impact Sales Closing Banner */}
        <div id="demo" className="mt-20 overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 p-8 text-center text-white shadow-2xl shadow-emerald-700/25 sm:p-12 lg:p-16">
          <div className="mx-auto max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1 text-xs font-extrabold text-white uppercase tracking-widest backdrop-blur-md">
              Start Free Today
            </span>
            <h3 className="mt-6 text-3xl font-extrabold text-white sm:text-5xl tracking-tight">
              Stop Bleeding Crores into Paper Registers. <br />
              <span className="text-emerald-200">
                Run Your Whole Yard on ShilaTeq.
              </span>
            </h3>
            <p className="mx-auto mt-4 max-w-xl text-sm text-emerald-100 sm:text-base leading-relaxed">
              Explore the live demo alone with zero signup, or book a 10-minute walkthrough with our founding team.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="/demo"
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 text-sm font-extrabold text-emerald-900 shadow-xl transition-all hover:bg-emerald-50 active:scale-95 sm:w-auto"
              >
                ⚡ Try Free Interactive Demo
              </a>
              <a
                href="https://wa.me/917043765580?text=Namaste,%20I%20want%20to%20schedule%20a%2010-minute%20live%20demo%20of%20ShilaTeq."
                target="_blank"
                rel="noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/40 bg-white/10 px-8 py-4 text-sm font-bold text-white shadow backdrop-blur-md transition-all hover:bg-white/20 sm:w-auto"
              >
                <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
                </svg>
                Book WhatsApp Demo
              </a>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-emerald-100 font-medium">
              <span>✓ No credit card required</span>
              <span>•</span>
              <span>✓ Nothing to install</span>
              <span>•</span>
              <span>✓ 48-Hour Yard Setup</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
