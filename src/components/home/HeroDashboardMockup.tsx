"use client";

import { useState } from "react";

export function HeroDashboardMockup() {
  const [activeTab, setActiveTab] = useState<"scan" | "billing" | "radar">("scan");
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState({
    id: "MKR-2024-W08",
    stone: "Makrana Pure White (Grade A)",
    size: "11'4\" × 6'2\" × 4'8\"",
    weight: "24.6 Metric Tons",
    slabsYield: 148,
    recovery: "89.4%",
    status: "Verified & GPS Tagged",
    slot: "Bay 3 · Row 12 · Slot B",
    estimatedVal: "₹3,45,000",
  });

  const handleTriggerScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 1200);
  };

  return (
    <div className="relative mx-auto w-full max-w-5xl">
      {/* Background ambient glow */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-96 w-3/4 -translate-x-1/2 rounded-full bg-gradient-to-tr from-emerald-500/20 via-cyan-500/20 to-amber-500/15 blur-3xl" />

      {/* Main Glassmorphic Container */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-900/80 p-4 shadow-2xl backdrop-blur-xl sm:p-6 lg:p-8">
        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500"></span>
            </span>
            <div className="flex flex-col">
              <span className="text-xs font-semibold tracking-wider text-emerald-400 uppercase">
                Live Yard Telemetry · Active
              </span>
              <span className="text-sm font-medium text-slate-200">
                Kishangarh North Terminal (Yard #04)
              </span>
            </div>
          </div>

          {/* Quick interactive tabs */}
          <div className="flex items-center rounded-lg border border-slate-800 bg-slate-950/70 p-1 text-xs">
            <button
              onClick={() => setActiveTab("scan")}
              className={`rounded-md px-3 py-1.5 font-medium transition-all ${
                activeTab === "scan"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              📷 1-Sec QR Scan
            </button>
            <button
              onClick={() => setActiveTab("billing")}
              className={`rounded-md px-3 py-1.5 font-medium transition-all ${
                activeTab === "billing"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              🧾 WhatsApp GST Bill
            </button>
            <button
              onClick={() => setActiveTab("radar")}
              className={`rounded-md px-3 py-1.5 font-medium transition-all ${
                activeTab === "radar"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              🗺️ GPS Yard Map
            </button>
          </div>
        </div>

        {/* Dynamic Display Area */}
        <div className="mt-6">
          {activeTab === "scan" && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              {/* Camera Scanner Simulation */}
              <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-xl border border-slate-800 bg-slate-950/90 p-6 lg:col-span-7">
                <div className="relative aspect-[16/10] w-full max-w-md overflow-hidden rounded-lg border-2 border-dashed border-emerald-500/40 bg-gradient-to-br from-slate-900 to-slate-950 p-4 shadow-inner">
                  {/* Granite Block Visual with Realistic Texture Pattern */}
                  <div className="relative flex h-full w-full items-center justify-center rounded bg-gradient-to-tr from-stone-800 via-stone-700 to-stone-900 shadow-2xl">
                    {/* Block mineral veins */}
                    <div className="pointer-events-none absolute inset-0 opacity-30 mix-blend-overlay bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px]" />

                    {/* QR Code Physical Stamp */}
                    <div className="relative flex flex-col items-center rounded-lg border border-amber-400/50 bg-amber-950/80 p-3 shadow-lg backdrop-blur-md">
                      <div className="flex h-20 w-20 items-center justify-center rounded bg-white p-1">
                        {/* Realistic High-Res QR SVG */}
                        <svg viewBox="0 0 33 33" className="h-full w-full text-black" fill="currentColor">
                          <path d="M0 0h9v9H0zM2 2h5v5H2zM3 3h3v3H3zM24 0h9v9h-9zM26 2h5v5h-5zM27 3h3v3h-3zM0 24h9v9H0zM2 26h5v5H2zM3 27h3v3H3zM11 2h2v5h-2zM15 0h3v3h-3zM15 5h3v2h-3zM20 2h2v3h-2zM13 7h4v2h-4zM20 7h2v2h-2zM0 11h3v2H0zM5 11h2v4H5zM9 11h2v2H9zM13 11h4v4h-4zM20 11h4v2h-4zM26 11h4v2h-4zM3 15h2v2H3zM9 15h2v2H9zM22 15h2v4h-2zM28 15h2v4h-2zM0 19h2v4H0zM4 19h4v2H4zM11 19h2v2h-2zM15 17h3v4h-3zM20 19h2v2h-2zM24 19h4v2h-4zM2 22h5v2H2zM11 23h4v2h-4zM17 23h3v4h-3zM22 23h3v2h-3zM27 23h4v2h-4zM11 27h2v4h-2zM15 29h4v2h-4zM22 27h2v2h-2zM26 27h2v4h-2zM30 27h3v4h-3z" />
                        </svg>
                      </div>
                      <span className="mt-1 font-mono text-[10px] font-bold tracking-widest text-amber-300">
                        {scanResult.id}
                      </span>
                    </div>

                    {/* HUD Target Overlays */}
                    <div className="absolute top-2 left-2 h-4 w-4 border-t-2 border-l-2 border-emerald-400" />
                    <div className="absolute top-2 right-2 h-4 w-4 border-t-2 border-r-2 border-emerald-400" />
                    <div className="absolute bottom-2 left-2 h-4 w-4 border-b-2 border-l-2 border-emerald-400" />
                    <div className="absolute bottom-2 right-2 h-4 w-4 border-b-2 border-r-2 border-emerald-400" />

                    {/* Animated Scanline Laser */}
                    {isScanning ? (
                      <div className="pointer-events-none absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981] animate-bounce" />
                    ) : (
                      <div className="pointer-events-none absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 bg-emerald-500/50" />
                    )}
                  </div>
                </div>

                {/* Scan Trigger Button */}
                <div className="mt-4 flex w-full items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    Camera AI Scanner (Works on ₹6,000 Android Phone)
                  </div>
                  <button
                    onClick={handleTriggerScan}
                    disabled={isScanning}
                    className="flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950 shadow-md shadow-emerald-500/20 transition-all hover:bg-emerald-400 active:scale-95 disabled:opacity-50"
                  >
                    {isScanning ? "Decoding Block..." : "⚡ Simulate Camera Scan"}
                  </button>
                </div>
              </div>

              {/* Instant Decoded Block Intelligence */}
              <div className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-950/60 p-5 lg:col-span-5">
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="rounded bg-emerald-950/80 px-2 py-0.5 font-mono text-[11px] font-semibold text-emerald-400 border border-emerald-500/30">
                        {scanResult.id}
                      </span>
                      <h4 className="mt-2 text-base font-bold text-white">
                        {scanResult.stone}
                      </h4>
                    </div>
                    <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400">
                      In Stock
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                    <div className="rounded-lg border border-slate-800/80 bg-slate-900/60 p-2.5">
                      <span className="text-slate-400">Dimensions</span>
                      <p className="mt-0.5 font-mono font-semibold text-slate-200">{scanResult.size}</p>
                    </div>
                    <div className="rounded-lg border border-slate-800/80 bg-slate-900/60 p-2.5">
                      <span className="text-slate-400">Raw Weight</span>
                      <p className="mt-0.5 font-mono font-semibold text-slate-200">{scanResult.weight}</p>
                    </div>
                    <div className="rounded-lg border border-slate-800/80 bg-slate-900/60 p-2.5">
                      <span className="text-slate-400">Estimated Slabs</span>
                      <p className="mt-0.5 font-mono font-semibold text-amber-400">{scanResult.slabsYield} Slabs</p>
                    </div>
                    <div className="rounded-lg border border-slate-800/80 bg-slate-900/60 p-2.5">
                      <span className="text-slate-400">Cutting Yield</span>
                      <p className="mt-0.5 font-mono font-semibold text-emerald-400">{scanResult.recovery}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/40 p-3 text-xs">
                    <div className="flex items-center gap-2 text-slate-300">
                      <svg className="h-4 w-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>Location: <strong className="text-white">{scanResult.slot}</strong></span>
                    </div>
                    <span className="font-mono font-bold text-amber-400">{scanResult.estimatedVal}</span>
                  </div>
                </div>

                <div className="mt-5 flex gap-2">
                  <a
                    href="#yard-scanner"
                    className="flex-1 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-2 text-center text-xs font-semibold text-slate-200 transition-colors hover:bg-slate-700"
                  >
                    View Gangsaw Cut Plan
                  </a>
                  <a
                    href="https://wa.me/917043765580?text=Namaste,%20I%20want%20to%20quote%20Makrana%20Block%20MKR-2024-W08"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white shadow transition-colors hover:bg-emerald-500"
                  >
                    <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
                    </svg>
                    Send WhatsApp Quote
                  </a>
                </div>
              </div>
            </div>
          )}

          {activeTab === "billing" && (
            <div className="flex flex-col items-center justify-center rounded-xl border border-slate-800 bg-slate-950/80 p-6">
              <div className="w-full max-w-lg rounded-xl border border-emerald-500/30 bg-[#0c131d] p-5 shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                      ✓
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Instant WhatsApp Invoice Dispatch</h4>
                      <p className="text-xs text-slate-400">Sent to: R.K. Builders & Architects (Jaipur)</p>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-semibold text-emerald-400">GST 18% Compliant</span>
                </div>

                {/* WhatsApp Chat Simulated Bubble */}
                <div className="mt-4 rounded-xl border border-emerald-900/40 bg-[#0f2119] p-4 text-xs text-slate-200">
                  <div className="flex items-center justify-between font-mono text-[11px] text-emerald-300">
                    <span>Tax Invoice #STQ-2024-9102</span>
                    <span>11:42 AM</span>
                  </div>
                  <p className="mt-2 text-slate-300">
                    Namaste Rajesh ji! Thank you for choosing <strong>ShilaTeq Yard #04</strong>. Your order for 42 Slabs Makrana Grade A is confirmed.
                  </p>
                  <div className="mt-3 rounded-lg border border-emerald-700/30 bg-black/40 p-2.5 font-mono">
                    <div className="flex justify-between text-slate-400">
                      <span>Total Slabs: 42 (840 Sq.Ft)</span>
                      <span>₹2,10,000</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>CGST (9%) + SGST (9%)</span>
                      <span>₹37,800</span>
                    </div>
                    <div className="mt-1 flex justify-between border-t border-slate-700/60 pt-1 text-sm font-bold text-emerald-400">
                      <span>Total Due (₹ in words):</span>
                      <span>₹2,47,800</span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="flex items-center gap-1 font-semibold text-emerald-400">
                      ✓✓ UPI QR Code Attached · Gate Pass #GP-402 Ready
                    </span>
                    <span className="text-[10px] text-slate-400">Zero Gateway Fees</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                  <span>⚡ 1-Tap E-Way Bill Generated</span>
                  <span className="text-emerald-400 font-medium">Automatic Balance Ledger Updated</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "radar" && (
            <div className="flex flex-col rounded-xl border border-slate-800 bg-slate-950/80 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Interactive Yard Grid & Storage Radar</h4>
                  <p className="text-xs text-slate-400">Hover over any block slot to see age, cost, and sales status</p>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-emerald-500"></span> In Stock (Ready)</span>
                  <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-amber-500"></span> Reserved / Sold</span>
                  <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-cyan-500"></span> On Gangsaw Cut</span>
                </div>
              </div>

              {/* Grid slots */}
              <div className="mt-5 grid grid-cols-4 gap-2.5 sm:grid-cols-6 md:grid-cols-8">
                {Array.from({ length: 24 }).map((_, i) => {
                  const isReserved = i === 3 || i === 7 || i === 14 || i === 21;
                  const isGangsaw = i === 5 || i === 12;
                  const isTarget = i === 10;
                  return (
                    <div
                      key={i}
                      className={`group relative flex flex-col items-center justify-center rounded-lg border p-3 text-center transition-all ${
                        isTarget
                          ? "border-emerald-400 bg-emerald-950/60 ring-2 ring-emerald-500/50"
                          : isReserved
                          ? "border-amber-500/30 bg-amber-950/20 hover:border-amber-500"
                          : isGangsaw
                          ? "border-cyan-500/30 bg-cyan-950/20 hover:border-cyan-500"
                          : "border-slate-800 bg-slate-900/50 hover:border-emerald-500/50"
                      }`}
                    >
                      <span className="font-mono text-[10px] text-slate-400">Slot {i + 1}</span>
                      <span className="mt-0.5 font-mono text-xs font-bold text-slate-200">
                        {isTarget ? "MKR-W08" : isReserved ? "BLK-GLX" : isGangsaw ? "CUT-88" : "AVL"}
                      </span>
                      <div className="mt-1 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className={`h-full ${
                            isReserved ? "bg-amber-400" : isGangsaw ? "bg-cyan-400" : "bg-emerald-400"
                          }`}
                          style={{ width: `${60 + (i * 7) % 40}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                <span>📍 Yard GPS Precision: ±0.5m across 4 Acres</span>
                <span className="text-cyan-400">Zero Lost Blocks Guaranteed</span>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Fast Stats Ribbon */}
        <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-800 pt-5 sm:grid-cols-4">
          <div>
            <div className="text-lg font-bold text-white sm:text-2xl font-mono">1.2 Sec</div>
            <div className="text-xs text-slate-400">Camera Scan to Tag</div>
          </div>
          <div>
            <div className="text-lg font-bold text-emerald-400 sm:text-2xl font-mono">₹2.4L / mo</div>
            <div className="text-xs text-slate-400">Avg Wastage Salvaged</div>
          </div>
          <div>
            <div className="text-lg font-bold text-cyan-400 sm:text-2xl font-mono">100% Offline</div>
            <div className="text-xs text-slate-400">Works in Shed Dead-Zones</div>
          </div>
          <div>
            <div className="text-lg font-bold text-amber-400 sm:text-2xl font-mono">0% Double-Sell</div>
            <div className="text-xs text-slate-400">Atomic Stock Lock</div>
          </div>
        </div>
      </div>
    </div>
  );
}
