"use client";

import { useState } from "react";

export function RoiCalculator() {
  const [tonnage, setTonnage] = useState(1200);
  const [stoneType, setStoneType] = useState<"marble" | "granite" | "sandstone">("marble");

  const avgSqFtPerTon = stoneType === "marble" ? 75 : stoneType === "granite" ? 65 : 85;
  const avgPricePerSqFt = stoneType === "marble" ? 220 : stoneType === "granite" ? 320 : 140;

  const monthlyWastageSaved = Math.round(
    tonnage * avgSqFtPerTon * 0.08 * avgPricePerSqFt * 0.4
  );

  const weeklyHoursSaved = Math.round(18 + (tonnage / 1200) * 16);
  const deadCapitalRecovered = Math.round(monthlyWastageSaved * 1.8);
  const annualSavings = monthlyWastageSaved * 12 + deadCapitalRecovered * 2;

  const formatInr = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} Lakhs`;
    return `₹${val.toLocaleString("en-IN")}`;
  };

  return (
    <section id="roi-calculator" className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-200 bg-teal-50 px-3.5 py-1 text-xs font-bold text-teal-800">
            ⚡ Instant Financial Payback
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            See Your Monthly Savings.
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-base text-slate-600">
            Move the slider to calculate how much cutting wastage and lost hours ShilaTeq saves your yard.
          </p>
        </div>

        <div className="mt-10 overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-10">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 text-left">
            {/* Input Controls */}
            <div className="space-y-6 lg:col-span-6">
              <div>
                <label className="text-xs font-bold tracking-wider text-slate-700 uppercase">
                  1. Primary Stone Material
                </label>
                <div className="mt-3 grid grid-cols-3 gap-2.5">
                  {[
                    { id: "marble", label: "Marble", icon: "🏛️" },
                    { id: "granite", label: "Granite", icon: "⬛" },
                    { id: "sandstone", label: "Sandstone", icon: "🟫" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setStoneType(item.id as typeof stoneType)}
                      className={`flex flex-col items-center justify-center rounded-2xl border p-3 text-xs font-bold transition-all ${
                        stoneType === item.id
                          ? "border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/20 shadow-xs"
                          : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-white"
                      }`}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span className="mt-1">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tonnage Slider */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold tracking-wider text-slate-700 uppercase">
                    2. Monthly Yard Volume (Tons)
                  </label>
                  <span className="font-mono text-base font-extrabold text-emerald-700 sm:text-lg">
                    {tonnage.toLocaleString()} Tons / mo
                  </span>
                </div>
                <div className="mt-3">
                  <input
                    type="range"
                    min="200"
                    max="5000"
                    step="100"
                    value={tonnage}
                    onChange={(e) => setTonnage(Number(e.target.value))}
                    className="h-2.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-emerald-600"
                  />
                  <div className="mt-1 flex justify-between font-mono text-[11px] text-slate-400">
                    <span>200 Tons (Small)</span>
                    <span>1,500 Tons (Mid-Size)</span>
                    <span>5,000 Tons (Mega Yard)</span>
                  </div>
                </div>
              </div>

              {/* Guarantees */}
              <div className="space-y-2 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span><strong>Zero Hardware to Buy:</strong> Runs in phone browsers</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span><strong>Zero Transaction Surcharges:</strong> Direct UPI payments</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span><strong>48-Hour Yard Setup:</strong> Live on day two</span>
                </div>
              </div>
            </div>

            {/* Live Financial Savings Output */}
            <div className="flex flex-col justify-between rounded-2xl border border-emerald-200 bg-emerald-50/60 p-6 sm:p-8 lg:col-span-6">
              <div>
                <div className="flex items-center justify-between border-b border-emerald-200/80 pb-3">
                  <span className="text-xs font-bold tracking-wider text-emerald-800 uppercase">
                    Estimated Net Benefit
                  </span>
                  <span className="rounded-full bg-emerald-200/80 px-2.5 py-0.5 font-mono text-xs font-bold text-emerald-900">
                    ~18x ROI
                  </span>
                </div>

                <div className="mt-5 space-y-4">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Monthly Wastage Salvaged</h4>
                      <p className="text-xs text-slate-500">From remnant tracking & cut plans</p>
                    </div>
                    <span className="font-mono text-xl font-extrabold text-emerald-700">
                      +{formatInr(monthlyWastageSaved)} / mo
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between border-t border-emerald-200/60 pt-3">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Yard Hours Saved</h4>
                      <p className="text-xs text-slate-500">Zero physical searches & manual registers</p>
                    </div>
                    <span className="font-mono text-xl font-extrabold text-teal-700">
                      ~{weeklyHoursSaved} hrs / wk
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between border-t border-emerald-200/60 pt-3">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Dead Capital Unlocked</h4>
                      <p className="text-xs text-slate-500">Alerts before blocks pass 60 days</p>
                    </div>
                    <span className="font-mono text-xl font-extrabold text-amber-700">
                      {formatInr(deadCapitalRecovered)}
                    </span>
                  </div>
                </div>

                {/* Big Total Box */}
                <div className="mt-6 rounded-2xl border border-emerald-300 bg-white p-4 text-center shadow-xs">
                  <span className="text-xs font-bold tracking-wider text-emerald-800 uppercase">
                    Estimated 1-Year Financial Advantage
                  </span>
                  <div className="mt-1 font-mono text-3xl font-extrabold text-emerald-700 sm:text-4xl">
                    {formatInr(annualSavings)}
                  </div>
                </div>
              </div>

              {/* Conversion CTA */}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#pricing"
                  className="flex-1 rounded-xl bg-emerald-600 py-3.5 text-center text-xs font-bold text-white shadow-md shadow-emerald-600/25 transition-all hover:bg-emerald-500 active:scale-95"
                >
                  ⚡ Choose Plan & Save
                </a>
                <a
                  href={`https://wa.me/917043765580?text=Namaste,%20my%20yard%20handles%20${tonnage}%20tons%20of%20${stoneType}%20per%20month.%20I%20want%20to%20see%20ShilaTeq%20savings.`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  💬 Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
