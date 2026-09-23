"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { HeroDashboardMockup } from "@/components/home/HeroDashboardMockup";
import { InteractiveYardScanner } from "@/components/home/InteractiveYardScanner";
import { RoiCalculator } from "@/components/home/RoiCalculator";
import { ProductDeviceTabs } from "@/components/home/ProductDeviceTabs";
import { SocialProofSection } from "@/components/home/SocialProofSection";
import { PricingSection } from "@/components/home/PricingSection";
import { FaqAndCtaSection } from "@/components/home/FaqAndCtaSection";

/* ──────── Scroll-reveal hook ──────── */
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(
      ".reveal, .reveal-left, .reveal-right"
    );
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("revealed");
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -48px 0px" }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

/* ──────── Animated floating orb ──────── */
function FloatingOrb({
  color,
  size,
  top,
  left,
  delay,
}: {
  color: string;
  size: string;
  top: string;
  left: string;
  delay: string;
}) {
  return (
    <div
      className="pointer-events-none absolute rounded-full blur-3xl opacity-60 animate-blob"
      style={{
        background: color,
        width: size,
        height: size,
        top,
        left,
        animationDelay: delay,
      }}
    />
  );
}

/* ──────── Animated ticker strip ──────── */
function TickerStrip() {
  const items = [
    "₹450+ Cr Inventory Tracked",
    "120+ Stone Yards Live",
    "99.8% GST Accuracy",
    "100% Offline Capable",
    "22% Wastage Reduction",
    "4× Faster Collections",
    "Zero Double-Selling",
    "1-Tap WhatsApp Invoices",
  ];
  const doubled = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-y border-slate-200/80 bg-white/70 backdrop-blur-sm py-3.5">
      <div className="flex animate-ticker gap-16 whitespace-nowrap">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-2.5 font-mono text-xs font-bold text-slate-600"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ──────── Feature quick-win card ──────── */
function FeatureCard({
  icon,
  title,
  sub,
  color,
}: {
  icon: string;
  title: string;
  sub: string;
  color: string;
}) {
  return (
    <div
      className={`card-lift group flex flex-col gap-3 rounded-3xl border bg-white p-6 shadow-sm ${color}`}
    >
      <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-sm font-extrabold text-slate-900 leading-snug">
        {title}
      </h3>
      <p className="text-xs text-slate-500 leading-relaxed">{sub}</p>
    </div>
  );
}

export default function Home() {
  useScrollReveal();

  return (
    <div className="relative overflow-x-hidden bg-[#f8fafc]">
      {/* ─── Ambient background mesh orbs ─── */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <FloatingOrb
          color="radial-gradient(circle, rgba(16,185,129,0.18) 0%, transparent 70%)"
          size="600px"
          top="-200px"
          left="-100px"
          delay="0s"
        />
        <FloatingOrb
          color="radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)"
          size="500px"
          top="30%"
          left="70%"
          delay="3s"
        />
        <FloatingOrb
          color="radial-gradient(circle, rgba(245,158,11,0.10) 0%, transparent 70%)"
          size="450px"
          top="65%"
          left="10%"
          delay="6s"
        />
      </div>

      {/* ═══════════════════ HERO ═══════════════════ */}
      <section className="relative px-4 pt-20 pb-8 sm:px-6 sm:pt-28 sm:pb-12 lg:px-8">
        <div className="mx-auto max-w-6xl text-center">

          {/* Glowing Live Chip */}
          <div className="animate-hero-reveal hero-d0 inline-flex items-center gap-2.5 rounded-full border border-emerald-300/70 bg-emerald-50 px-5 py-2 shadow-md shadow-emerald-500/10">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-600" />
            </span>
            <span className="font-mono text-xs font-bold tracking-wider text-emerald-800 uppercase">
              India&apos;s #1 Stone Yard Operating System
            </span>
          </div>

          {/* Hero Headline */}
          <h1 className="animate-hero-reveal hero-d1 mt-8 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl xl:text-8xl">
            Run Your Entire{" "}
            <span className="block sm:inline">Stone Yard</span>
            <br className="hidden sm:block" />
            <span className="shimmer-text">On a Single Phone.</span>
          </h1>

          {/* Punchy Sub-headline */}
          <p className="animate-hero-reveal hero-d2 mx-auto mt-6 max-w-2xl text-base text-slate-500 sm:text-xl leading-relaxed">
            From quarry block arrival to instant WhatsApp GST invoices.
            Cut wastage by 22%. Double collection speed.
          </p>

          {/* CTA Buttons */}
          <div className="animate-hero-reveal hero-d3 mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/demo"
              className="btn-glow group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-8 py-4 text-sm font-extrabold text-white shadow-xl shadow-emerald-500/30 transition-all hover:shadow-emerald-500/50 hover:scale-105 active:scale-95 sm:w-auto"
            >
              <span className="relative z-10 flex items-center gap-2">
                ⚡ Book a 10-Minute Live Demo
              </span>
            </Link>

            <a
              href="#yard-scanner"
              className="group flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-slate-200 bg-white/90 px-7 py-4 text-sm font-bold text-slate-700 shadow-sm backdrop-blur-md transition-all hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700 hover:shadow-md hover:scale-105 active:scale-95 sm:w-auto"
            >
              📱 Try Interactive Yard Simulator ↓
            </a>

            <a
              href="https://wa.me/917043765580?text=Namaste,%20I%20want%20to%20learn%20how%20ShilaTeq%20runs%20stone%20yards."
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-xs font-semibold text-emerald-700 hover:text-emerald-600 transition-colors py-2 hover:scale-105"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
              </svg>
              Chat on WhatsApp (Hindi / EN)
            </a>
          </div>

          {/* Trust Badges */}
          <div className="animate-hero-reveal hero-d4 mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {[
              { num: "₹450+ Cr", label: "Inventory Managed" },
              { num: "120+", label: "Stone Yards" },
              { num: "99.8%", label: "Billing Accuracy" },
              { num: "100%", label: "Offline Ready" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/80 px-4 py-1.5 text-xs font-medium shadow-xs backdrop-blur-md"
              >
                <strong className="font-extrabold text-slate-900">
                  {item.num}
                </strong>
                <span className="text-slate-500">{item.label}</span>
              </div>
            ))}
          </div>

          {/* Hero Dashboard */}
          <div className="animate-hero-reveal hero-d5 mt-14 relative">
            {/* Soft glow under the dashboard */}
            <div className="pointer-events-none absolute -inset-4 -z-10 rounded-[48px] bg-gradient-to-b from-emerald-100/60 via-cyan-50/40 to-transparent blur-2xl" />
            <HeroDashboardMockup />
          </div>
        </div>
      </section>

      {/* ─── Ticker Strip ─── */}
      <TickerStrip />

      {/* ─── Section Divider ─── */}
      <div className="section-divider" />

      {/* ═══════════════════ QUICK WIN FEATURES ═══════════════════ */}
      <section className="relative px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Section Header */}
          <div className="reveal text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-bold text-emerald-800 shadow-xs">
              ✦ What ShilaTeq Does
            </span>
            <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              Everything Your Yard Needs.{" "}
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                Nothing You Don&apos;t.
              </span>
            </h2>
          </div>

          {/* Feature Cards Grid */}
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: "📷",
                title: "1-Second QR Block Scan",
                sub: "Any phone camera. GPS-tagged blocks. Full history in 1 tap.",
                color: "border-emerald-100 hover:border-emerald-300",
                delay: "reveal-delay-1",
              },
              {
                icon: "🧾",
                title: "WhatsApp GST Invoices",
                sub: "Auto-generated. UPI QR attached. Collections in 4 days, not 28.",
                color: "border-teal-100 hover:border-teal-300",
                delay: "reveal-delay-2",
              },
              {
                icon: "⚡",
                title: "Zero Double-Selling",
                sub: "Atomic stock locks the second a quote is generated. No disputes.",
                color: "border-cyan-100 hover:border-cyan-300",
                delay: "reveal-delay-3",
              },
              {
                icon: "🏛️",
                title: "Branded 3D Showroom",
                sub: "Share a link. Architects browse your stock in 3D. No app needed.",
                color: "border-amber-100 hover:border-amber-300",
                delay: "reveal-delay-4",
              },
            ].map((f) => (
              <div key={f.title} className={`reveal ${f.delay}`}>
                <FeatureCard
                  icon={f.icon}
                  title={f.title}
                  sub={f.sub}
                  color={f.color}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Section Divider ─── */}
      <div className="section-divider" />

      {/* ═══════════════════ INTERACTIVE YARD & QR SCANNER ═══════════════════ */}
      <div className="reveal">
        <InteractiveYardScanner />
      </div>

      {/* ─── Section Divider ─── */}
      <div className="section-divider" />

      {/* ═══════════════════ ROI CALCULATOR ═══════════════════ */}
      <div className="reveal">
        <RoiCalculator />
      </div>

      {/* ─── Section Divider ─── */}
      <div className="section-divider" />

      {/* ═══════════════════ PRODUCT DEVICE TABS ═══════════════════ */}
      <div className="reveal">
        <ProductDeviceTabs />
      </div>

      {/* ─── Section Divider ─── */}
      <div className="section-divider" />

      {/* ═══════════════════ SOCIAL PROOF ═══════════════════ */}
      <div className="reveal">
        <SocialProofSection />
      </div>

      {/* ─── Section Divider ─── */}
      <div className="section-divider" />

      {/* ═══════════════════ PRICING ═══════════════════ */}
      <div className="reveal">
        <PricingSection />
      </div>

      {/* ─── Section Divider ─── */}
      <div className="section-divider" />

      {/* ═══════════════════ FAQ & CTA ═══════════════════ */}
      <div className="reveal">
        <FaqAndCtaSection />
      </div>
    </div>
  );
}
