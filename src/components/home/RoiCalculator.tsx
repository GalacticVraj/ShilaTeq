"use client";

import { useState } from "react";

export function RoiCalculator() {
  const [tonnage, setTonnage] = useState(1200);
  const [stoneType, setStoneType] = useState<"marble" | "granite" | "sandstone">("marble");

  // Calculations based on industry benchmarks in Kishangarh & Ongole
  const avgSqFtPerTon = stoneType === "marble" ? 75 : stoneType === "granite" ? 65 : 85;
  const avgPricePerSqFt = stoneType === "marble" ? 220 : stoneType === "granite" ? 320 : 140;

  // 12% yield improvement via ShilaTeq remnant tracking & gangsaw cut plans
  const monthlyWastageSaved = Math.round(
    tonnage * avgSqFtPerTon * 0.08 * avgPricePerSqFt * 0.4
  );

  // 35 hours per week saved on searching blocks and manual registers
  const weeklyHoursSaved = Math.round(18 + (tonnage / 1200) * 16);

  // Dead capital recovery: 15% reduction in dead stock over 90 days
  const deadCapitalRecovered = Math.round(monthlyWastageSaved * 1.8);

  // Annual Net Advantage
  const annualSavings = monthlyWastageSaved * 12 + deadCapitalRecovered * 2;

  // Format INR currency
  const formatInr = (val: number) => {
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Cr`;
    }
    if (val >= 100000) {
      return `₹${(val / 100000).toFixed(2)} Lakhs`;
    }
    return `₹${val.toLocaleString("en-IN")}`;
  };

  return (
    <section id="roi-calculator" className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-950/60 px-3.5 py-1 text-xs font-semibold text-cyan-400">
            ⚡ Financial Impact & Payback
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            How Much Money Does ShilaTeq{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-amber-300 bg-clip-text text-transparent">
              Save Your Yard Every Month?
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-400 sm:text-lg">
            Move the slider to match your yard&rsquo;s monthly intake. See your instant yield recovery, labor savings, and freed dead capital.
          </p>
        </div>

        <div className="mt-12 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/80 p-6 shadow-2xl backdrop-blur-xl sm:p-10">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            {/* Input Controls */}
            <div className="space-y-8 lg:col-span-6">
              {/* Stone Material Switcher */}
              <div>
                <label className="text-xs font-semibold tracking-wider text-slate-300 uppercase">
                  1. Select Primary Material Processed
                </label>
                <div className="mt-3 grid grid-cols-3 gap-2.5">
                  {[
                    { id: "marble", label: "Marble", icon: "🏛️" },
                    { id: "granite", label: "Granite", icon: "⬛" },
                    { id: "sandstone", label: "Sandstone / Quartz", icon: "🟫" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setStoneType(item.id as typeof stoneType)}
                      className={`flex flex-col items-center justify-center rounded-xl border p-3 text-xs font-semibold transition-all ${
                        stoneType === item.id
                          ? "border-emerald-500 bg-emerald-950/40 text-emerald-300 ring-1 ring-emerald-500/50"
                          : "border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-white"
                      }`}
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span className="mt-1">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tonnage Slider */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold tracking-wider text-slate-300 uppercase">
                    2. Monthly Yard Volume (Tons)
                  </label>
                  <span className="font-mono text-base font-bold text-emerald-400 sm:text-lg">
                    {tonnage.toLocaleString()} Metric Tons / mo
                  </span>
                </div>
                <div className="mt-4">
                  <input
                    type="range"
                    min="200"
                    max="5000"
                    step="100"
                    value={tonnage}
                    onChange={(e) => setTonnage(Number(e.target.value))}
                    className="h-2.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 accent-emerald-500"
                  />
                  <div className="mt-2 flex justify-between font-mono text-[11px] text-slate-500">
                    <span>200 Tons (Small Yard)</span>
                    <span>1,500 Tons (Mid-Size)</span>
                    <span>5,000 Tons (Mega Processor)</span>
                  </div>
                </div>
              </div>

              {/* Fast Proof Points */}
              <div className="space-y-3 rounded-xl border border-slate-800/80 bg-slate-900/40 p-4 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span><strong>Zero Hardware Investment:</strong> Works directly in phone browsers</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span><strong>No WhatsApp Gateway Surcharges:</strong> Free direct click-to-chat dispatch</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span><strong>Setup in 48 Hours:</strong> We help tag your first 50 blocks on-site</span>
                </div>
              </div>
            </div>

            {/* Live Financial Savings Output */}
            <div className="flex flex-col justify-between rounded-xl border border-emerald-500/30 bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950/20 p-6 lg:col-span-6">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                    Estimated Net Savings & Gains
                  </span>
                  <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 font-mono text-xs font-bold text-emerald-400">
                    ~18x ShilaTeq ROI
                  </span>
                </div>

                <div className="mt-6 space-y-5">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-white">Monthly Cutting Yield Recovery</h4>
                      <p className="text-xs text-slate-400">From automated remnant indexing & reduced gangsaw wastage</p>
                    </div>
                    <span className="font-mono text-xl font-bold text-emerald-400">
                      +{formatInr(monthlyWastageSaved)} / mo
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between border-t border-slate-800/60 pt-4">
                    <div>
                      <h4 className="text-sm font-semibold text-white">Shop-Floor & Yard Hours Saved</h4>
                      <p className="text-xs text-slate-400">Eliminating block hunt, register matching & manual bills</p>
                    </div>
                    <span className="font-mono text-xl font-bold text-cyan-400">
                      ~{weeklyHoursSaved} hrs / week
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between border-t border-slate-800/60 pt-4">
                    <div>
                      <h4 className="text-sm font-semibold text-white">Dead Capital Unlocked</h4>
                      <p className="text-xs text-slate-400">Alerts on stones aging &gt;60 days before they lose value</p>
                    </div>
                    <span className="font-mono text-xl font-bold text-amber-400">
                      {formatInr(deadCapitalRecovered)}
                    </span>
                  </div>
                </div>

                {/* Big Total Box */}
                <div className="mt-8 rounded-xl border border-emerald-500/40 bg-emerald-950/40 p-4 text-center">
                  <span className="text-xs font-semibold tracking-wider text-emerald-300 uppercase">
                    Estimated 1-Year Financial Advantage
                  </span>
                  <div className="mt-1 font-mono text-3xl font-extrabold text-emerald-400 sm:text-4xl">
                    {formatInr(annualSavings)}
                  </div>
                  <p className="mt-1 text-[11px] text-slate-300">
                    Versus typical monthly software fee of ₹2,999/mo (Growth Plan)
                  </p>
                </div>
              </div>

              {/* Conversion CTA */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="/demo"
                  className="flex-1 rounded-xl bg-emerald-500 py-3.5 text-center text-xs font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-400 active:scale-95"
                >
                  ⚡ Start 14-Day Free Trial
                </a>
                <a
                  href={`https://wa.me/917043765580?text=Namaste,%20my%20yard%20handles%20about%20${tonnage}%20tons%20of%20${stoneType}%20per%20month.%20I%20want%20to%20see%20ShilaTeq%20savings%20in%20action.`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/90 px-4 py-3.5 text-xs font-semibold text-slate-200 transition-colors hover:bg-slate-700"
                >
                  💬 Talk with Yard Specialist
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
