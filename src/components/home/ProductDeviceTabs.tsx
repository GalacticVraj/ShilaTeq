"use client";

import { useState } from "react";

type TabKey = "worker" | "billing" | "stock" | "showroom";

export function ProductDeviceTabs() {
  const [activeTab, setActiveTab] = useState<TabKey>("worker");
  const [workerLang, setWorkerLang] = useState<"en" | "hi">("hi");

  return (
    <section id="features" className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-950/60 px-3.5 py-1 text-xs font-semibold text-amber-400">
            💎 Complete Product Ecosystem
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            One Unified Platform. <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-amber-300 bg-clip-text text-transparent">
              Every Department in Sync.
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-400 sm:text-lg">
            From the machine operator in a tin shed to your sales rep closing ₹15 Lakh orders on WhatsApp.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {[
            { id: "worker", label: "📱 Offline Worker App", desc: "Hindi & English · Zero Signal" },
            { id: "billing", label: "🧾 WhatsApp GST Invoicing", desc: "1-Tap Invoices · Gate Passes" },
            { id: "stock", label: "📦 Live Stock & Yard Map", desc: "Zero Double-Selling · GPS Rows" },
            { id: "showroom", label: "💎 3D Public Showroom", desc: "Branded Buyer Catalog" },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabKey)}
                className={`flex flex-col items-center rounded-xl border px-4 py-2.5 text-xs font-semibold transition-all sm:px-5 sm:py-3 ${
                  isActive
                    ? "border-emerald-500 bg-slate-900 text-white shadow-lg shadow-emerald-500/10 ring-2 ring-emerald-500/40"
                    : "border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-white"
                }`}
              >
                <span>{tab.label}</span>
                <span className="mt-0.5 text-[10px] text-slate-500">{tab.desc}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Canvas */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/80 p-6 shadow-2xl backdrop-blur-xl sm:p-10">
          {/* TAB 1: WORKER APP */}
          {activeTab === "worker" && (
            <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
              <div className="space-y-4 lg:col-span-5">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-emerald-500/10 px-3 py-1 font-mono text-xs font-semibold text-emerald-400 border border-emerald-500/30">
                    Offline First · Local Storage
                  </span>

                  {/* Hindi / English Toggle */}
                  <div className="flex items-center rounded-lg border border-slate-700 bg-slate-900 p-0.5 text-xs">
                    <button
                      onClick={() => setWorkerLang("en")}
                      className={`rounded px-2.5 py-1 font-semibold transition-all ${
                        workerLang === "en" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      English
                    </button>
                    <button
                      onClick={() => setWorkerLang("hi")}
                      className={`rounded px-2.5 py-1 font-semibold transition-all ${
                        workerLang === "hi" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      हिंदी
                    </button>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-white sm:text-3xl">
                  {workerLang === "hi"
                    ? "कारखाने के कामगारों के लिए सरल ऐप"
                    : "Built for Hands That Work Stone, Not Keyboards"}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {workerLang === "hi"
                    ? "बिना इंटरनेट, टिन शेड में भी काम करे। केवल यूजरनेम से लॉगिन — कोई ईमेल या पासवर्ड की झंझट नहीं। कामगार अपना दैनिक वेतन और कटी हुई स्लैब स्वयं देख सकते हैं।"
                    : "Runs seamlessly in dead zones with zero cell reception. One-tap simple username login with zero passwords to memorize. Workers track their own daily cutting wages transparently."}
                </p>

                <div className="space-y-3 pt-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400">●</span>
                    <span><strong>100% Offline:</strong> Saves shifts locally; auto-syncs once reconnected.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400">●</span>
                    <span><strong>Wage Transparency:</strong> Cuts disputes between yard owner and gangsaw cutters.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400">●</span>
                    <span><strong>Zero App Store Download:</strong> Add to Home Screen in 5 seconds.</span>
                  </div>
                </div>
              </div>

              {/* Mobile Phone Mockup */}
              <div className="flex justify-center lg:col-span-7">
                <div className="w-full max-w-[320px] rounded-[36px] border-4 border-slate-700 bg-slate-900 p-3 shadow-2xl ring-1 ring-slate-800">
                  {/* Phone Speaker Notch */}
                  <div className="mx-auto h-4 w-28 rounded-full bg-slate-950 mb-3" />

                  {/* Phone Screen */}
                  <div className="rounded-[24px] bg-slate-950 p-4 text-white">
                    {/* Status header */}
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-emerald-400" />
                        {workerLang === "hi" ? "ऑफ़लाइन मोड (सुरक्षित)" : "Offline Mode (Active)"}
                      </span>
                      <span className="font-mono">Ramesh K.</span>
                    </div>

                    {/* Today Wage Card */}
                    <div className="mt-3 rounded-xl border border-emerald-500/30 bg-emerald-950/30 p-3 text-center">
                      <span className="text-[11px] text-emerald-300">
                        {workerLang === "hi" ? "आज की कटिंग कमाई (वेतन)" : "Today's Cutting Earnings"}
                      </span>
                      <div className="mt-1 font-mono text-2xl font-bold text-emerald-400">
                        ₹1,240
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {workerLang === "hi" ? "62 स्लैब कटी · गैंगसॉ #02" : "62 Slabs Cut · Gangsaw #02"}
                      </span>
                    </div>

                    {/* Quick Big Action Buttons for Shop Floor */}
                    <div className="mt-4 space-y-2">
                      <button className="flex w-full items-center justify-between rounded-xl bg-emerald-600 p-3 text-left font-bold text-xs shadow hover:bg-emerald-500 transition-colors">
                        <span className="flex items-center gap-2">
                          📷 {workerLang === "hi" ? "नया ब्लॉक स्कैन करें" : "Scan New Block"}
                        </span>
                        <span>→</span>
                      </button>

                      <button className="flex w-full items-center justify-between rounded-xl border border-slate-800 bg-slate-900 p-3 text-left font-semibold text-xs text-slate-200 hover:bg-slate-800 transition-colors">
                        <span className="flex items-center gap-2">
                          ✂️ {workerLang === "hi" ? "स्लैब कट दर्ज करें" : "Log Finished Slabs"}
                        </span>
                        <span>→</span>
                      </button>

                      <button className="flex w-full items-center justify-between rounded-xl border border-slate-800 bg-slate-900 p-3 text-left font-semibold text-xs text-slate-200 hover:bg-slate-800 transition-colors">
                        <span className="flex items-center gap-2">
                          🚚 {workerLang === "hi" ? "ट्रक लोडिंग गेट पास" : "Dispatch Gate Pass"}
                        </span>
                        <span>→</span>
                      </button>
                    </div>

                    <div className="mt-4 rounded-lg bg-slate-900 p-2 text-center text-[10px] text-slate-500 font-mono">
                      ShilaTeq Yard #04 · All Data Stored Locally
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: WHATSAPP GST BILLING */}
          {activeTab === "billing" && (
            <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
              <div className="space-y-4 lg:col-span-6">
                <span className="rounded-full bg-emerald-500/10 px-3 py-1 font-mono text-xs font-semibold text-emerald-400 border border-emerald-500/30">
                  Instant Revenue Collection
                </span>
                <h3 className="text-2xl font-bold text-white sm:text-3xl">
                  Invoices Sent Straight to WhatsApp with Payment QR
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Never chase payments with endless phone calls. ShilaTeq generates GST-compliant bills and dispatches them straight to your customer&rsquo;s WhatsApp with an embedded UPI payment QR and E-Way bill.
                </p>
                <div className="space-y-3 pt-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400">✓</span>
                    <span><strong>Zero Gateway Surcharges:</strong> Direct bank-to-bank UPI transfers.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400">✓</span>
                    <span><strong>Atomic Stock Locking:</strong> Stock cannot leave the yard without confirmed payment.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400">✓</span>
                    <span><strong>Automated Customer Ledger:</strong> Instant balance calculation for recurring builders.</span>
                  </div>
                </div>
              </div>

              {/* WhatsApp Interface Mockup */}
              <div className="lg:col-span-6">
                <div className="rounded-2xl border border-slate-800 bg-[#0b141a] p-4 shadow-2xl">
                  {/* WhatsApp Header */}
                  <div className="flex items-center gap-3 border-b border-slate-800/80 pb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-700 font-bold text-white">
                      SM
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">Singhal Marbles (Buyer)</div>
                      <div className="text-[11px] text-emerald-400">Online</div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="mt-4 space-y-3 text-xs">
                    <div className="max-w-[85%] rounded-lg bg-[#202c33] p-3 text-slate-200">
                      Bhaiya, please send the tax invoice for the 148 slabs Makrana block. We will pay now.
                    </div>

                    <div className="ml-auto max-w-[90%] rounded-lg border border-emerald-800/40 bg-[#005c4b] p-3 text-white shadow">
                      <div className="flex items-center justify-between font-mono text-[10px] text-emerald-200">
                        <span>TAX INVOICE #STQ-INV-9921</span>
                        <span>12:04 PM ✓✓</span>
                      </div>
                      <p className="mt-1 text-xs">
                        Namaste! Here is your GST invoice for <strong>148 Slabs (Makrana Pure White)</strong>.
                      </p>
                      <div className="mt-2 rounded bg-black/30 p-2 font-mono text-[11px]">
                        <div className="flex justify-between"><span>Subtotal:</span><span>₹2,84,000</span></div>
                        <div className="flex justify-between"><span>GST (18%):</span><span>₹51,120</span></div>
                        <div className="mt-1 flex justify-between border-t border-white/20 pt-1 font-bold text-amber-300">
                          <span>Total Payable:</span><span>₹3,35,120</span>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-emerald-200">📄 Tax_Invoice_9921.pdf</span>
                        <span className="rounded bg-emerald-800 px-2 py-0.5 text-[10px] font-bold">UPI QR Inside</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: LIVE STOCK & YARD MAP */}
          {activeTab === "stock" && (
            <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
              <div className="space-y-4 lg:col-span-6">
                <span className="rounded-full bg-cyan-500/10 px-3 py-1 font-mono text-xs font-semibold text-cyan-400 border border-cyan-500/30">
                  Zero Double-Selling Engine
                </span>
                <h3 className="text-2xl font-bold text-white sm:text-3xl">
                  Every Stone Row Indexed. <br />Zero Lost Inventory.
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  When two salesmen show the same block to different buyers at 11:30 AM, ShilaTeq locks the block atomically the second a deposit or quotation is created. No awkward calls. No lost trust.
                </p>
                <div className="space-y-3 pt-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400">✓</span>
                    <span><strong>Real-Time Aging Tracker:</strong> Color-codes stones (Fresh &rarr; Amber &rarr; Red) so capital never dies.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400">✓</span>
                    <span><strong>1-Second GPS Slot Search:</strong> Directs loader drivers straight to Row 4, Bay 2.</span>
                  </div>
                </div>
              </div>

              {/* Yard Stock Visualizer */}
              <div className="lg:col-span-6">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-2xl">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">Live Yard Inventory Feed</span>
                    <span className="font-mono text-emerald-400">1,482 Blocks In Stock</span>
                  </div>

                  <div className="mt-4 space-y-2 text-xs">
                    {[
                      { id: "MKR-881", name: "Makrana White Grade A", row: "Row 3 · Slot 12", days: 14, status: "Active" },
                      { id: "BLK-204", name: "Black Galaxy Granite", row: "Row 1 · Slot 04", days: 48, status: "Aging" },
                      { id: "LAK-512", name: "Lakha Red Granite", row: "Row 2 · Slot 09", days: 92, status: "Critical" },
                      { id: "TEK-301", name: "Teak Sandstone Slabs", row: "Row 5 · Slot 18", days: 6, status: "Active" },
                    ].map((item) => (
                      <div key={item.id} className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950 p-2.5">
                        <div>
                          <div className="font-mono font-bold text-white">{item.id} · {item.name}</div>
                          <div className="text-[11px] text-slate-400">{item.row}</div>
                        </div>
                        <div className="text-right">
                          <span
                            className={`rounded px-2 py-0.5 font-mono text-[10px] font-bold ${
                              item.status === "Active"
                                ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                                : item.status === "Aging"
                                ? "bg-amber-950 text-amber-400 border border-amber-800"
                                : "bg-red-950 text-red-400 border border-red-800"
                            }`}
                          >
                            {item.days}d ({item.status})
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: 3D PUBLIC SHOWROOM */}
          {activeTab === "showroom" && (
            <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
              <div className="space-y-4 lg:col-span-6">
                <span className="rounded-full bg-amber-500/10 px-3 py-1 font-mono text-xs font-semibold text-amber-400 border border-amber-500/30">
                  Turn Paperwork Into Marketing
                </span>
                <h3 className="text-2xl font-bold text-white sm:text-3xl">
                  Your Yard Gets Its Own Branded 3D Online Showroom
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Send architects, interior designers, and high-value buyers a single link to explore your live stock in 3D. Choose block by block whether to show the price or keep it &ldquo;Price on Request&rdquo;. Your costs and supplier margins stay 100% confidential.
                </p>
                <div className="space-y-3 pt-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400">✓</span>
                    <span><strong>100% Margin Confidentiality:</strong> Only you see the quarry purchase cost basis.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400">✓</span>
                    <span><strong>Instant Lead Capture:</strong> Buyer inquiries land directly in your WhatsApp.</span>
                  </div>
                </div>
              </div>

              {/* Showroom Interface Card */}
              <div className="lg:col-span-6">
                <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-slate-900 to-slate-950 p-5 shadow-2xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-amber-300">showroom.shilateq.com/your-yard</span>
                    </div>
                    <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                      Public 3D View
                    </span>
                  </div>

                  <div className="mt-4 rounded-xl border border-slate-800 bg-black/50 p-4 text-center">
                    <div className="mx-auto flex h-28 w-44 items-center justify-center rounded-lg border border-amber-400/30 bg-gradient-to-tr from-stone-800 via-stone-700 to-amber-950/40 shadow-xl">
                      <span className="font-mono text-xs font-bold text-amber-200">
                        🏛️ 3D Marble Slab Preview
                      </span>
                    </div>
                    <div className="mt-3 font-semibold text-white text-sm">
                      Italian Statuario Extra (Lot #STAT-402)
                    </div>
                    <div className="mt-1 font-mono text-xs text-amber-400">
                      Available: 34 Slabs (2,400 Sq.Ft) · Price on Request
                    </div>

                    <a
                      href="https://wa.me/917043765580?text=Namaste,%20I%20saw%20Lot%20STAT-402%20in%20your%203D%20Showroom."
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 shadow hover:bg-emerald-400 transition-colors"
                    >
                      💬 Inquire on WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
