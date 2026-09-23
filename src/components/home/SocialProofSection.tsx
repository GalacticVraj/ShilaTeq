"use client";

import { useEffect, useRef, useState } from "react";

function CountUp({
  target,
  prefix = "",
  suffix = "",
  duration = 2000,
}: {
  target: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !animated.current) {
          animated.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return (
    <div ref={ref} className="overflow-hidden">
      {prefix}{count.toLocaleString("en-IN")}{suffix}
    </div>
  );
}

export function SocialProofSection() {
  const reviews = [
    {
      quote:
        "We cut 20,000+ sq.ft of marble monthly. ShilaTeq's yield engine recovered ₹3.8 Lakhs in sellable stone remnants in our first 45 days. My cutters in the shed learned it in 15 minutes.",
      author: "Rajendra Sharma",
      title: "Managing Director",
      yard: "Sharma Marbles (Kishangarh)",
      metric: "+₹3.8L Salvaged",
      metricColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
      avatarBg: "from-amber-500 to-amber-700",
      stars: 5,
    },
    {
      quote:
        "Double-booking was our nightmare. Two salesmen would take advance tokens for the same block. ShilaTeq locks the stone atomically the moment a quote is generated. Zero disputes since.",
      author: "Vikram Patel",
      title: "Founder",
      yard: "Patel Quartz (Morbi)",
      metric: "0% Double-Selling",
      metricColor: "text-teal-700 bg-teal-50 border-teal-200",
      avatarBg: "from-teal-500 to-cyan-700",
      stars: 5,
    },
    {
      quote:
        "Sending GST invoices with payment QR codes directly to WhatsApp cut our payment collection cycle from 28 days down to 4 days. Drivers get gate passes on their phones.",
      author: "K. Suresh Reddy",
      title: "Operations Head",
      yard: "Reddy Black Galaxy (Ongole)",
      metric: "4x Faster Collections",
      metricColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
      avatarBg: "from-emerald-500 to-teal-700",
      stars: 5,
    },
  ];

  const metrics = [
    { prefix: "₹", value: 450, suffix: "+ Cr", label: "Stone Inventory Tracked", color: "text-emerald-700" },
    { prefix: "", value: 120, suffix: "+", label: "Active Stone Yards", color: "text-teal-700" },
    { prefix: "", value: 99, suffix: ".8%", label: "GST Billing Accuracy", color: "text-amber-600" },
    { prefix: "", value: 100, suffix: "%", label: "Offline Capable", color: "text-slate-800" },
  ];

  return (
    <section id="testimonials" className="relative py-20 px-4 sm:px-6 lg:px-8">
      {/* Soft background accent */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-emerald-50/30 to-transparent" />

      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1 text-xs font-bold text-emerald-800">
            ⭐ Trusted by the Trade
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Built for Indian Stone Yards.
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-base text-slate-500">
            Trusted by marble, granite, and sandstone processors across Rajasthan, Gujarat, and South India.
          </p>
        </div>

        {/* Animated Metrics Ribbon */}
        <div className="mt-10 grid grid-cols-2 gap-4 overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 sm:grid-cols-4 sm:p-8">
          {metrics.map((m) => (
            <div key={m.label} className="text-center group">
              <div className={`font-mono text-3xl font-extrabold sm:text-4xl ${m.color} group-hover:scale-110 transition-transform duration-300`}>
                <CountUp target={m.value} prefix={m.prefix} suffix={m.suffix} />
              </div>
              <div className="mt-1 text-xs font-bold text-slate-500">
                {m.label}
              </div>
            </div>
          ))}
        </div>

        {/* Review Cards */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3 text-left">
          {reviews.map((r, i) => (
            <div
              key={r.author}
              className="card-lift flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-md shadow-slate-100"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400 text-sm">
                    {Array.from({ length: r.stars }).map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                  <span className={`rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-bold ${r.metricColor}`}>
                    {r.metric}
                  </span>
                </div>

                {/* Quote marks */}
                <div className="mt-3 text-4xl font-serif text-emerald-200 leading-none">&ldquo;</div>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">
                  {r.quote}
                </p>
              </div>

              <div className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr ${r.avatarBg} font-bold text-white text-xs shadow-xs`}
                >
                  {r.author
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">{r.author}</div>
                  <div className="text-[11px] text-slate-500">
                    {r.title} · {r.yard}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA strip */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="https://wa.me/917043765580?text=Namaste,%20I%20want%20to%20see%20ShilaTeq%20for%20my%20stone%20yard."
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3 text-xs font-bold text-white shadow-md shadow-emerald-600/25 transition-all hover:bg-emerald-500 hover:scale-105 active:scale-95"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
            </svg>
            Talk to a Real Yard Owner Who Uses ShilaTeq
          </a>
          <span className="text-xs text-slate-400">
            We&apos;ll connect you for a peer reference call.
          </span>
        </div>
      </div>
    </section>
  );
}
