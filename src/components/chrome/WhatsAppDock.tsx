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
      className="group fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-full border border-slate-200 bg-white/95 px-4 py-3 text-xs font-bold text-slate-800 shadow-xl shadow-slate-300/50 backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:border-emerald-300 hover:shadow-emerald-500/20"
    >
      <span className="relative flex h-3 w-3">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500"></span>
      </span>
      <WhatsAppGlyph className="h-5 w-5 text-emerald-600 group-hover:scale-110 transition-transform" />
      <span className="hidden sm:inline font-bold">WhatsApp Help</span>
    </a>
  );
}
