"use client";

import { useState } from "react";

interface StoneData {
  id: string;
  name: string;
  origin: string;
  gradient: string;
  dimensions: string;
  volume: string;
  weight: string;
  costBasis: string;
  expectedSlabs: number;
  recoveryRate: string;
  remnantValue: string;
  agingDays: number;
  agingStatus: "Fresh" | "Aging" | "Dead Capital Risk";
  location: string;
  marketRate: string;
}

const STONES: StoneData[] = [
  {
    id: "MKR-092-WHT",
    name: "Makrana Pure White Marble",
    origin: "Makrana, Rajasthan",
    gradient: "from-stone-200 via-slate-100 to-stone-300 text-stone-900",
    dimensions: "10' 6\" × 5' 8\" × 4' 6\"",
    volume: "268 Cu.Ft",
    weight: "21.4 Metric Tons",
    costBasis: "₹1,85,000",
    expectedSlabs: 136,
    recoveryRate: "91.2%",
    remnantValue: "₹18,500 (Salvaged)",
    agingDays: 12,
    agingStatus: "Fresh",
    location: "Bay 2 · Row 4 · Slot 08",
    marketRate: "₹380 / Sq.Ft",
  },
  {
    id: "GLX-408-BLK",
    name: "Black Galaxy Granite (Gold Star)",
    origin: "Chimakurthy, Andhra Pradesh",
    gradient: "from-zinc-900 via-stone-900 to-black text-amber-200",
    dimensions: "11' 2\" × 6' 4\" × 5' 0\"",
    volume: "353 Cu.Ft",
    weight: "28.8 Metric Tons",
    costBasis: "₹2,60,000",
    expectedSlabs: 168,
    recoveryRate: "88.6%",
    remnantValue: "₹24,800 (Salvaged)",
    agingDays: 34,
    agingStatus: "Aging",
    location: "Bay 1 · Row 2 · Slot 15",
    marketRate: "₹450 / Sq.Ft",
  },
  {
    id: "TEK-105-SND",
    name: "Dholpur Teakwood Sandstone",
    origin: "Dholpur, Rajasthan",
    gradient: "from-amber-200 via-orange-100 to-amber-300 text-stone-900",
    dimensions: "9' 8\" × 4' 10\" × 4' 0\"",
    volume: "186 Cu.Ft",
    weight: "14.2 Metric Tons",
    costBasis: "₹92,000",
    expectedSlabs: 92,
    recoveryRate: "85.4%",
    remnantValue: "₹9,200 (Salvaged)",
    agingDays: 8,
    agingStatus: "Fresh",
    location: "Bay 4 · Row 1 · Slot 03",
    marketRate: "₹180 / Sq.Ft",
  },
];

export function InteractiveYardScanner() {
  const [selectedStone, setSelectedStone] = useState<StoneData>(STONES[0]);
  const [isScanning, setIsScanning] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const selectStone = (stone: StoneData) => {
    setIsScanning(true);
    setSelectedStone(stone);
    setTimeout(() => {
      setIsScanning(false);
    }, 600);
  };

  const handleShareQuote = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <section id="yard-scanner" className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/60 px-3.5 py-1 text-xs font-semibold text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Hands-On Interactive Simulator
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Point Your Phone at Any Block. <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-amber-300 bg-clip-text text-transparent">
              It Instantly Tells You Everything.
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-400 sm:text-lg">
            No searching rows for hours. No guesswork margins. Tap a block below to simulate the instant QR camera scan on the shop floor.
          </p>
        </div>

        {/* Stone Selector Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {STONES.map((stone) => {
            const isActive = selectedStone.id === stone.id;
            return (
              <button
                key={stone.id}
                onClick={() => selectStone(stone)}
                className={`group flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all ${
                  isActive
                    ? "border-emerald-500 bg-slate-900 shadow-lg shadow-emerald-500/10 ring-2 ring-emerald-500/30"
                    : "border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-900"
                }`}
              >
                <div
                  className={`h-7 w-7 rounded-lg border border-white/20 bg-gradient-to-br ${stone.gradient} flex items-center justify-center text-xs font-bold shadow`}
                >
                  🪨
                </div>
                <div>
                  <div className="text-xs font-semibold text-white group-hover:text-emerald-300">
                    {stone.name}
                  </div>
                  <div className="font-mono text-[11px] text-slate-400">
                    {stone.id} · {stone.weight}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Simulator Core Stage */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/80 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
            {/* Visual 3D Block & HUD Scanner Viewport */}
            <div className="relative flex flex-col items-center justify-center rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 lg:col-span-5">
              <div className="relative aspect-square w-full max-w-xs overflow-hidden rounded-xl border-2 border-slate-700/80 bg-gradient-to-br from-slate-950 to-slate-900 p-4 shadow-2xl">
                {/* 3D Simulated Physical Block */}
                <div
                  className={`relative flex h-full w-full flex-col items-center justify-center rounded-lg bg-gradient-to-br ${selectedStone.gradient} shadow-2xl transition-all duration-500`}
                >
                  <div className="pointer-events-none absolute inset-0 opacity-20 bg-[radial-gradient(#000_2px,transparent_2px)] [background-size:14px_14px]" />

                  {/* QR Label Stamp */}
                  <div className="relative flex flex-col items-center rounded-md border border-black/30 bg-black/75 p-2.5 text-white shadow-xl backdrop-blur-sm">
                    <div className="h-16 w-16 bg-white p-1 rounded shadow">
                      <svg viewBox="0 0 33 33" className="h-full w-full text-black" fill="currentColor">
                        <path d="M0 0h9v9H0zM2 2h5v5H2zM3 3h3v3H3zM24 0h9v9h-9zM26 2h5v5h-5zM27 3h3v3h-3zM0 24h9v9H0zM2 26h5v5H2zM3 27h3v3H3zM11 2h2v5h-2zM15 0h3v3h-3zM15 5h3v2h-3zM20 2h2v3h-2zM13 7h4v2h-4zM20 7h2v2h-2zM0 11h3v2H0zM5 11h2v4H5zM9 11h2v2H9zM13 11h4v4h-4zM20 11h4v2h-4zM26 11h4v2h-4zM3 15h2v2H3zM9 15h2v2H9zM22 15h2v4h-2zM28 15h2v4h-2zM0 19h2v4H0zM4 19h4v2H4zM11 19h2v2h-2zM15 17h3v4h-3zM20 19h2v2h-2zM24 19h4v2h-4zM2 22h5v2H2zM11 23h4v2h-4zM17 23h3v4h-3zM22 23h3v2h-3zM27 23h4v2h-4zM11 27h2v4h-2zM15 29h4v2h-4zM22 27h2v2h-2zM26 27h2v4h-2zM30 27h3v4h-3z" />
                      </svg>
                    </div>
                    <span className="mt-1 font-mono text-[9px] font-bold tracking-widest text-emerald-300">
                      {selectedStone.id}
                    </span>
                  </div>

                  {/* Corner Targets */}
                  <div className="absolute top-2 left-2 h-4 w-4 border-t-2 border-l-2 border-emerald-400" />
                  <div className="absolute top-2 right-2 h-4 w-4 border-t-2 border-r-2 border-emerald-400" />
                  <div className="absolute bottom-2 left-2 h-4 w-4 border-b-2 border-l-2 border-emerald-400" />
                  <div className="absolute bottom-2 right-2 h-4 w-4 border-b-2 border-r-2 border-emerald-400" />

                  {/* Active Laser Sweep */}
                  {isScanning && (
                    <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_16px_#10b981] animate-bounce" />
                  )}
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 font-mono text-xs text-emerald-400">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                </span>
                <span>Active Block Tag: {selectedStone.id}</span>
              </div>
            </div>

            {/* Instant Intelligence Output */}
            <div className="space-y-6 lg:col-span-7">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-white sm:text-2xl">
                    {selectedStone.name}
                  </h3>
                  <p className="text-xs text-slate-400">Origin: {selectedStone.origin}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      selectedStone.agingStatus === "Fresh"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                    }`}
                  >
                    ● {selectedStone.agingDays} Days in Yard ({selectedStone.agingStatus})
                  </span>
                </div>
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider">Dimensions</span>
                  <p className="mt-1 font-mono text-sm font-semibold text-white">
                    {selectedStone.dimensions}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider">Total Weight</span>
                  <p className="mt-1 font-mono text-sm font-semibold text-white">
                    {selectedStone.weight}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider">Cost Basis</span>
                  <p className="mt-1 font-mono text-sm font-semibold text-amber-400">
                    {selectedStone.costBasis}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider">Est. Slabs</span>
                  <p className="mt-1 font-mono text-sm font-semibold text-emerald-400">
                    {selectedStone.expectedSlabs} Slabs
                  </p>
                </div>
              </div>

              {/* Gangsaw Yield & Wastage Safeguard Bar */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">Gangsaw Recovery & Cutting Yield</span>
                  <span className="font-mono font-bold text-emerald-400">{selectedStone.recoveryRate} Yield</span>
                </div>
                <div className="mt-2 h-2.5 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-700"
                    style={{ width: selectedStone.recoveryRate }}
                  />
                </div>
                <div className="mt-2.5 flex items-center justify-between text-xs text-slate-400">
                  <span>Side Cut Salvage Remnant: <strong className="text-amber-400">{selectedStone.remnantValue}</strong></span>
                  <span className="text-emerald-400">✓ Auto-indexed as sellable stone</span>
                </div>
              </div>

              {/* Exact Yard Location GPS */}
              <div className="flex flex-wrap items-center justify-between rounded-xl border border-slate-800 bg-slate-900/40 p-3.5 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400">
                    📍
                  </span>
                  <span>Physical Slot: <strong className="text-white">{selectedStone.location}</strong></span>
                </div>
                <div>
                  Suggested Retail: <strong className="font-mono text-white">{selectedStone.marketRate}</strong>
                </div>
              </div>

              {/* High-Sales Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href={`https://wa.me/917043765580?text=Namaste,%20I%20am%20interested%20in%20Block%20${selectedStone.id}%20(${encodeURIComponent(selectedStone.name)}).`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-xs font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-400 active:scale-95"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
                  </svg>
                  Generate Instant WhatsApp Quote
                </a>

                <button
                  onClick={handleShareQuote}
                  className="rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-3 text-xs font-semibold text-slate-200 transition-colors hover:bg-slate-700"
                >
                  {copiedLink ? "✓ Showroom Link Copied!" : "🔗 Share Public 3D Showroom Link"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
