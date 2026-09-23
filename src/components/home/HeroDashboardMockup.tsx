"use client";

import { useState } from "react";

export function HeroDashboardMockup() {
  const [activeTab, setActiveTab] = useState<"scan" | "billing" | "radar">("scan");
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult] = useState({
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
    }, 1100);
  };

  return (
    <div className="relative mx-auto w-full max-w-5xl">
      {/* Ambient background soft glow */}
      <div className="pointer-events-none absolute -top-20 left-1/2 -z-10 h-80 w-3/4 -translate-x-1/2 rounded-full bg-gradient-to-tr from-emerald-200/40 via-teal-100/40 to-amber-100/30 blur-3xl" />

      {/* Main Luminous Container */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 p-4 shadow-2xl shadow-slate-200/60 backdrop-blur-xl sm:p-6 lg:p-8">
        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500"></span>
            </span>
            <div className="flex flex-col text-left">
              <span className="text-[11px] font-bold tracking-wider text-emerald-700 uppercase font-mono">
                Live Yard Telemetry · Connected
              </span>
              <span className="text-sm font-bold text-slate-800">
                Kishangarh North Terminal (Yard #04)
              </span>
            </div>
          </div>

          {/* Quick interactive tabs */}
          <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1 text-xs">
            <button
              onClick={() => setActiveTab("scan")}
              className={`rounded-lg px-3 py-1.5 font-bold transition-all ${
                activeTab === "scan"
                  ? "bg-white text-emerald-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              📷 1-Sec QR Scan
            </button>
            <button
              onClick={() => setActiveTab("billing")}
              className={`rounded-lg px-3 py-1.5 font-bold transition-all ${
                activeTab === "billing"
                  ? "bg-white text-emerald-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              🧾 WhatsApp GST Bill
            </button>
            <button
              onClick={() => setActiveTab("radar")}
              className={`rounded-lg px-3 py-1.5 font-bold transition-all ${
                activeTab === "radar"
                  ? "bg-white text-emerald-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              🗺️ GPS Yard Map
            </button>
          </div>
        </div>

        {/* Dynamic Display Area */}
        <div className="mt-6">
          {/* TAB 1: SCAN */}
          {activeTab === "scan" && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 text-left">
              {/* Camera Scanner Simulation */}
              <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/70 p-6 lg:col-span-7">
                <div className="relative aspect-[16/10] w-full max-w-md overflow-hidden rounded-xl border-2 border-dashed border-emerald-400/80 bg-white p-4 shadow-sm">
                  {/* Marble Texture Block */}
                  <div className="relative flex h-full w-full items-center justify-center rounded-lg bg-gradient-to-tr from-stone-100 via-white to-stone-200 shadow-md">
                    {/* Marble natural veins */}
                    <div className="pointer-events-none absolute inset-0 opacity-40 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:16px_16px]" />

                    {/* QR Code Physical Stamp */}
                    <div className="relative flex flex-col items-center rounded-xl border border-slate-300 bg-white/95 p-3 shadow-lg">
                      <div className="flex h-20 w-20 items-center justify-center rounded bg-white p-1">
                        <svg viewBox="0 0 33 33" className="h-full w-full text-slate-900" fill="currentColor">
                          <path d="M0 0h9v9H0zM2 2h5v5H2zM3 3h3v3H3zM24 0h9v9h-9zM26 2h5v5h-5zM27 3h3v3h-3zM0 24h9v9H0zM2 26h5v5H2zM3 27h3v3H3zM11 2h2v5h-2zM15 0h3v3h-3zM15 5h3v2h-3zM20 2h2v3h-2zM13 7h4v2h-4zM20 7h2v2h-2zM0 11h3v2H0zM5 11h2v4H5zM9 11h2v2H9zM13 11h4v4h-4zM20 11h4v2h-4zM26 11h4v2h-4zM3 15h2v2H3zM9 15h2v2H9zM22 15h2v4h-2zM28 15h2v4h-2zM0 19h2v4H0zM4 19h4v2H4zM11 19h2v2h-2zM15 17h3v4h-3zM20 19h2v2h-2zM24 19h4v2h-4zM2 22h5v2H2zM11 23h4v2h-4zM17 23h3v4h-3zM22 23h3v2h-3zM27 23h4v2h-4zM11 27h2v4h-2zM15 29h4v2h-4zM22 27h2v2h-2zM26 27h2v4h-2zM30 27h3v4h-3z" />
                        </svg>
                      </div>
                      <span className="mt-1 font-mono text-[10px] font-extrabold tracking-widest text-emerald-700">
                        {scanResult.id}
                      </span>
                    </div>

                    {/* HUD Target Overlays */}
                    <div className="absolute top-2 left-2 h-4 w-4 border-t-2 border-l-2 border-emerald-600" />
                    <div className="absolute top-2 right-2 h-4 w-4 border-t-2 border-r-2 border-emerald-600" />
                    <div className="absolute bottom-2 left-2 h-4 w-4 border-b-2 border-l-2 border-emerald-600" />
                    <div className="absolute bottom-2 right-2 h-4 w-4 border-b-2 border-r-2 border-emerald-600" />

                    {/* Laser Scanline */}
                    {isScanning ? (
                      <div className="pointer-events-none absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent shadow-[0_0_12px_#10b981] animate-bounce" />
                    ) : (
                      <div className="pointer-events-none absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 bg-emerald-500/40" />
                    )}
                  </div>
                </div>

                <div className="mt-4 flex w-full items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Any Phone Camera Scanner
                  </div>
                  <button
                    onClick={handleTriggerScan}
                    disabled={isScanning}
                    className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-emerald-600/20 transition-all hover:bg-emerald-500 active:scale-95 disabled:opacity-50"
                  >
                    {isScanning ? "Decoding Block..." : "⚡ Simulate Camera Scan"}
                  </button>
                </div>
              </div>

              {/* Instant Decoded Block Intelligence */}
              <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-5">
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="rounded-md bg-emerald-50 px-2 py-0.5 font-mono text-[11px] font-bold text-emerald-700 border border-emerald-200">
                        {scanResult.id}
                      </span>
                      <h4 className="mt-2 text-base font-extrabold text-slate-900">
                        {scanResult.stone}
                      </h4>
                    </div>
                    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800">
                      In Stock
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2.5 text-xs">
                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                      <span className="text-slate-500 text-[11px]">Dimensions</span>
                      <p className="mt-0.5 font-mono font-bold text-slate-800">{scanResult.size}</p>
                    </div>
                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                      <span className="text-slate-500 text-[11px]">Weight</span>
                      <p className="mt-0.5 font-mono font-bold text-slate-800">{scanResult.weight}</p>
                    </div>
                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                      <span className="text-slate-500 text-[11px]">Est. Slabs</span>
                      <p className="mt-0.5 font-mono font-bold text-amber-600">{scanResult.slabsYield} Slabs</p>
                    </div>
                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                      <span className="text-slate-500 text-[11px]">Cutting Yield</span>
                      <p className="mt-0.5 font-mono font-bold text-emerald-600">{scanResult.recovery}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs">
                    <span className="text-slate-600">
                      📍 Slot: <strong className="text-slate-900">{scanResult.slot}</strong>
                    </span>
                    <span className="font-mono font-extrabold text-emerald-700 text-sm">{scanResult.estimatedVal}</span>
                  </div>
                </div>

                <div className="mt-5 flex gap-2">
                  <a
                    href="#yard-scanner"
                    className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-center text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100"
                  >
                    View Cut Plan
                  </a>
                  <a
                    href="https://wa.me/917043765580?text=Namaste,%20I%20want%20to%20quote%20Makrana%20Block%20MKR-2024-W08"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20 transition-colors hover:bg-emerald-500"
                  >
                    Send WhatsApp Quote
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BILLING */}
          {activeTab === "billing" && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-slate-50/60 p-6 text-left">
              <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-5 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-bold">
                      ✓
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900">Instant WhatsApp Invoice Dispatch</h4>
                      <p className="text-xs text-slate-500">Sent to: R.K. Builders & Architects (Jaipur)</p>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-emerald-700">GST 18% Compliant</span>
                </div>

                {/* WhatsApp Chat Light Bubble */}
                <div className="mt-4 rounded-2xl border border-emerald-100 bg-[#e7f7ed] p-4 text-xs text-slate-800">
                  <div className="flex items-center justify-between font-mono text-[11px] text-emerald-800">
                    <span className="font-bold">Tax Invoice #STQ-2024-9102</span>
                    <span>11:42 AM</span>
                  </div>
                  <p className="mt-2 text-slate-700">
                    Namaste Rajesh ji! Your order for 42 Slabs Makrana Grade A is confirmed.
                  </p>
                  <div className="mt-3 rounded-xl border border-emerald-200/80 bg-white p-3 font-mono shadow-xs">
                    <div className="flex justify-between text-slate-500">
                      <span>42 Slabs (840 Sq.Ft)</span>
                      <span>₹2,10,000</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>CGST (9%) + SGST (9%)</span>
                      <span>₹37,800</span>
                    </div>
                    <div className="mt-1 flex justify-between border-t border-slate-100 pt-1 text-sm font-extrabold text-emerald-700">
                      <span>Total Due:</span>
                      <span>₹2,47,800</span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-[11px]">
                    <span className="font-bold text-emerald-700">
                      ✓✓ UPI QR Code Attached · Gate Pass #GP-402 Ready
                    </span>
                    <span className="text-slate-500">Zero Gateway Fees</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                  <span>⚡ 1-Tap E-Way Bill</span>
                  <span className="text-emerald-600 font-bold">Automatic Balance Ledger Updated</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: RADAR */}
          {activeTab === "radar" && (
            <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 text-left">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900">Interactive Yard Grid & Storage Radar</h4>
                  <p className="text-xs text-slate-500">Hover over any block slot to see age, cost, and sales status</p>
                </div>
                <div className="flex items-center gap-4 text-xs font-medium">
                  <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-emerald-500"></span> In Stock</span>
                  <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-amber-500"></span> Reserved</span>
                  <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-cyan-500"></span> Cutting</span>
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
                      className={`group relative flex flex-col items-center justify-center rounded-xl border p-2.5 text-center transition-all ${
                        isTarget
                          ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500/30"
                          : isReserved
                          ? "border-amber-200 bg-amber-50/70"
                          : isGangsaw
                          ? "border-cyan-200 bg-cyan-50/70"
                          : "border-slate-200 bg-slate-50/60 hover:border-emerald-300"
                      }`}
                    >
                      <span className="font-mono text-[9px] text-slate-400">Slot {i + 1}</span>
                      <span className="mt-0.5 font-mono text-xs font-bold text-slate-800">
                        {isTarget ? "MKR-W08" : isReserved ? "BLK-GLX" : isGangsaw ? "CUT-88" : "AVL"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Fast Stats Ribbon */}
        <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-100 pt-5 sm:grid-cols-4 text-center">
          <div>
            <div className="text-xl font-extrabold text-slate-900 sm:text-2xl font-mono">1.2 Sec</div>
            <div className="text-xs text-slate-500 font-medium">Camera Scan to Tag</div>
          </div>
          <div>
            <div className="text-xl font-extrabold text-emerald-600 sm:text-2xl font-mono">₹2.4L / mo</div>
            <div className="text-xs text-slate-500 font-medium">Avg Wastage Salvaged</div>
          </div>
          <div>
            <div className="text-xl font-extrabold text-cyan-600 sm:text-2xl font-mono">100% Offline</div>
            <div className="text-xs text-slate-500 font-medium">Works in Tin Sheds</div>
          </div>
          <div>
            <div className="text-xl font-extrabold text-amber-600 sm:text-2xl font-mono">0% Double-Sell</div>
            <div className="text-xs text-slate-500 font-medium">Atomic Stock Lock</div>
          </div>
        </div>
      </div>
    </div>
  );
}
