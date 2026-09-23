"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // SPA Navigation Links
  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "Live Scanner", href: "#yard-scanner" },
    { label: "ROI Calculator", href: "#roi-calculator" },
    { label: "Pricing", href: "#pricing" },
    { label: "Reviews", href: "#testimonials" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-slate-200/80 bg-white/90 shadow-sm backdrop-blur-xl py-3"
          : "border-b border-transparent bg-white/60 backdrop-blur-md py-4 sm:py-5"
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Brand Logo */}
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 p-0.5 shadow-md shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-all">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-white text-base">
              🪨
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-sans text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
              Shila<span className="text-emerald-600">Teq</span>
            </span>
            <span className="hidden font-mono text-[9px] font-semibold tracking-wider text-slate-500 uppercase sm:block">
              Stone Yard ERP
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links (SPA anchors) */}
        <nav aria-label="Primary" className="hidden items-center gap-1 rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 shadow-xs backdrop-blur-md md:flex">
          {navLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="rounded-full px-3.5 py-1 text-xs font-semibold text-slate-600 transition-all hover:bg-slate-100 hover:text-slate-900"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Action CTAs */}
        <div className="hidden items-center gap-3.5 md:flex">
          <a
            href="https://wa.me/917043765580?text=Namaste,%20I%20want%20to%20learn%20more%20about%20ShilaTeq."
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-emerald-600 transition-colors"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600"></span>
            </span>
            <span>WhatsApp (Hindi/EN)</span>
          </a>

          <a
            href="#demo"
            className="flex items-center gap-1.5 rounded-full bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-emerald-600/25 transition-all hover:bg-emerald-500 hover:shadow-emerald-600/35 active:scale-95"
          >
            <span>⚡ Book 10-Min Demo</span>
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-800 shadow-xs md:hidden"
          aria-expanded={open}
          aria-controls="mobile-drawer"
          onClick={() => setOpen(!open)}
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            {open ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div
          id="mobile-drawer"
          className="fixed inset-x-0 top-[65px] bottom-0 z-50 flex flex-col border-t border-slate-200 bg-white/98 p-6 backdrop-blur-2xl md:hidden"
        >
          <nav className="flex flex-col gap-2">
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-800 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="mt-auto space-y-3 pt-6">
            <a
              href="#demo"
              className="block w-full rounded-xl bg-emerald-600 py-3.5 text-center text-xs font-bold text-white shadow-lg shadow-emerald-600/20"
              onClick={() => setOpen(false)}
            >
              ⚡ Book Live Walkthrough
            </a>
            <a
              href="https://wa.me/917043765580?text=Namaste,%20I%20want%20to%20learn%20more%20about%20ShilaTeq."
              target="_blank"
              rel="noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 text-center text-xs font-semibold text-slate-700 shadow-xs"
            >
              💬 WhatsApp Us (Hindi / EN)
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
