"use client";

import { WhatsAppGlyph } from "@/components/ui/DoorsBlock";

export function WhatsAppDock({ href }: { href?: string | null }) {
  const targetUrl =
    href ||
    "https://wa.me/917043765580?text=Namaste,%20I%20want%20to%20learn%20more%20about%20ShilaTeq.";

  return (
    <a
      href={targetUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with ShilaTeq on WhatsApp"
      className="group fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-full border border-emerald-500/40 bg-slate-950/90 px-4 py-3 text-xs font-bold text-white shadow-2xl shadow-emerald-500/25 backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:border-emerald-400 hover:bg-slate-900"
    >
      <span className="relative flex h-3 w-3">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500"></span>
      </span>
      <WhatsAppGlyph className="h-5 w-5 text-emerald-400 group-hover:scale-110 transition-transform" />
      <span className="hidden sm:inline">WhatsApp Help</span>
    </a>
  );
}
