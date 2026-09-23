"use client";

import { useState } from "react";

type TabKey = "worker" | "billing" | "stock" | "showroom";

export function ProductDeviceTabs() {
  const [activeTab, setActiveTab] = useState<TabKey>("worker");
  const [workerLang, setWorkerLang] = useState<"en" | "hi">("hi");

  return (
    <section id="features" className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3.5 py-1 text-xs font-bold text-amber-800">
            💎 Core Capabilities
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Everything Your Yard Needs. <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Zero Complicated Software.
            </span>
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-base text-slate-600">
            From the cutter in the gangsaw shed to your sales rep closing orders on WhatsApp.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
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
                className={`flex flex-col items-center rounded-2xl border px-4 py-2.5 text-xs font-bold transition-all sm:px-5 sm:py-3 ${
                  isActive
                    ? "border-emerald-600 bg-white text-emerald-800 shadow-md shadow-emerald-600/10 ring-2 ring-emerald-500/20"
                    : "border-slate-200 bg-white/70 text-slate-600 hover:border-slate-300 hover:bg-white"
                }`}
              >
                <span>{tab.label}</span>
                <span className="mt-0.5 text-[10px] text-slate-400 font-medium">{tab.desc}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Canvas */}
        <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-10 text-left">
          {/* TAB 1: WORKER APP */}
          {activeTab === "worker" && (
            <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
              <div className="space-y-4 lg:col-span-5">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-emerald-100 px-3 py-1 font-mono text-xs font-bold text-emerald-800">
                    Offline First
                  </span>

                  {/* Hindi / English Toggle */}
                  <div className="flex items-center rounded-xl border border-slate-200 bg-slate-100 p-0.5 text-xs">
                    <button
                      onClick={() => setWorkerLang("en")}
                      className={`rounded-lg px-2.5 py-1 font-bold transition-all ${
                        workerLang === "en" ? "bg-white text-emerald-700 shadow-xs" : "text-slate-600"
                      }`}
                    >
                      English
                    </button>
                    <button
                      onClick={() => setWorkerLang("hi")}
                      className={`rounded-lg px-2.5 py-1 font-bold transition-all ${
                        workerLang === "hi" ? "bg-white text-emerald-700 shadow-xs" : "text-slate-600"
                      }`}
                    >
                      हिंदी
                    </button>
                  </div>
                </div>

                <h3 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
                  {workerLang === "hi"
                    ? "कारखाने के कामगारों के लिए सरल ऐप"
                    : "Built for Stone Cutters, Not Computer Users"}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {workerLang === "hi"
                    ? "बिना इंटरनेट के भी चलता है। केवल यूजरनेम से लॉगिन — कामगार अपना दैनिक वेतन और कटी हुई स्लैब तुरंत देख सकते हैं।"
                    : "Runs in tin sheds with zero cell signal. One-tap username login with no passwords to memorize. Workers track their daily wages transparently."}
                </p>

                <div className="space-y-2 pt-1 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span><strong>100% Offline:</strong> Saves shifts locally; auto-syncs when signal is back.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span><strong>Wage Transparency:</strong> Daily slab count ends payroll arguments.</span>
                  </div>
                </div>
              </div>

              {/* Mobile Phone Mockup in Light Styling */}
              <div className="flex justify-center lg:col-span-7">
                <div className="w-full max-w-[310px] rounded-[38px] border-4 border-slate-800 bg-slate-900 p-3 shadow-xl">
                  <div className="mx-auto h-4 w-24 rounded-full bg-slate-950 mb-3" />
                  <div className="rounded-[26px] bg-slate-50 p-4 text-slate-900 border border-slate-200">
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span className="flex items-center gap-1 font-bold text-emerald-700">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        {workerLang === "hi" ? "ऑफ़लाइन मोड चालू" : "Offline Active"}
                      </span>
                      <span className="font-mono font-bold text-slate-700">Ramesh K.</span>
                    </div>

                    <div className="mt-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-center shadow-xs">
                      <span className="text-[11px] font-bold text-emerald-800">
                        {workerLang === "hi" ? "आज की कटिंग कमाई (वेतन)" : "Today's Wage"}
                      </span>
                      <div className="mt-0.5 font-mono text-2xl font-extrabold text-emerald-700">
                        ₹1,240
                      </div>
                      <span className="text-[10px] text-slate-500">
                        {workerLang === "hi" ? "62 स्लैब कटी · गैंगसॉ #02" : "62 Slabs Cut · Gangsaw #02"}
                      </span>
                    </div>

                    <div className="mt-3 space-y-2">
                      <button className="flex w-full items-center justify-between rounded-xl bg-emerald-600 p-3 text-left font-bold text-xs text-white shadow-xs">
                        <span>📷 {workerLang === "hi" ? "नया ब्लॉक स्कैन करें" : "Scan New Block"}</span>
                        <span>→</span>
                      </button>

                      <button className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white p-3 text-left font-bold text-xs text-slate-800 shadow-xs">
                        <span>✂️ {workerLang === "hi" ? "स्लैब कट दर्ज करें" : "Log Slabs"}</span>
                        <span>→</span>
                      </button>

                      <button className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white p-3 text-left font-bold text-xs text-slate-800 shadow-xs">
                        <span>🚚 {workerLang === "hi" ? "ट्रक लोडिंग गेट पास" : "Dispatch Pass"}</span>
                        <span>→</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: WHATSAPP BILLING */}
          {activeTab === "billing" && (
            <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
              <div className="space-y-4 lg:col-span-6">
                <span className="rounded-full bg-emerald-100 px-3 py-1 font-mono text-xs font-bold text-emerald-800">
                  Instant Collections
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
                  GST Invoices Sent Straight to WhatsApp with UPI QR
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Never chase payments with calls. Auto-generates GST-compliant bills and dispatches them with embedded UPI payment QR code and E-Way bill.
                </p>
                <div className="space-y-2 pt-1 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span><strong>Zero Gateway Cuts:</strong> Direct bank-to-bank UPI transfers.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span><strong>Atomic Stock Locking:</strong> Stock cannot leave without confirmed payment.</span>
                  </div>
                </div>
              </div>

              {/* WhatsApp Interface Mockup */}
              <div className="lg:col-span-6">
                <div className="rounded-2xl border border-slate-200 bg-[#f0f2f5] p-4 shadow-md">
                  <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-700 font-bold text-white text-xs">
                      SM
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-800">Singhal Marbles (Buyer)</div>
                      <div className="text-[11px] text-emerald-700 font-medium">Online</div>
                    </div>
                  </div>

                  <div className="mt-3 space-y-2.5 text-xs">
                    <div className="max-w-[85%] rounded-xl bg-white p-3 text-slate-800 shadow-xs">
                      Bhaiya, please send the tax invoice for the 148 slabs. We will pay now.
                    </div>

                    <div className="ml-auto max-w-[90%] rounded-xl border border-emerald-200 bg-[#d9fdd3] p-3 text-slate-900 shadow-xs">
                      <div className="flex items-center justify-between font-mono text-[10px] text-emerald-900">
                        <span className="font-bold">TAX INVOICE #STQ-INV-9921</span>
                        <span>12:04 PM ✓✓</span>
                      </div>
                      <p className="mt-1 text-xs">
                        Namaste! Here is your GST invoice for <strong>148 Slabs Makrana Pure White</strong>.
                      </p>
                      <div className="mt-2 rounded-lg bg-white p-2 font-mono text-[11px] shadow-xs">
                        <div className="flex justify-between text-slate-600"><span>Subtotal:</span><span>₹2,84,000</span></div>
                        <div className="flex justify-between text-slate-600"><span>GST (18%):</span><span>₹51,120</span></div>
                        <div className="mt-1 flex justify-between border-t border-slate-100 pt-1 font-bold text-emerald-700">
                          <span>Total Due:</span><span>₹3,35,120</span>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-[11px]">
                        <span className="font-bold text-emerald-900">📄 Tax_Invoice_9921.pdf</span>
                        <span className="rounded bg-emerald-700 px-2 py-0.5 text-[10px] font-bold text-white">UPI QR</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: LIVE STOCK & MAP */}
          {activeTab === "stock" && (
            <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
              <div className="space-y-4 lg:col-span-6">
                <span className="rounded-full bg-cyan-100 px-3 py-1 font-mono text-xs font-bold text-cyan-800">
                  Zero Double-Selling
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
                  Every Stone Row Indexed. Zero Lost Slabs.
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  When two salesmen show the same block at 11:30 AM, ShilaTeq locks it atomically the second a quote or deposit is generated.
                </p>
                <div className="space-y-2 pt-1 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span><strong>Aging Tracker:</strong> Color-codes stones (Fresh &rarr; Amber &rarr; Critical).</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span><strong>1-Second GPS Search:</strong> Directs loader drivers straight to Row 4, Bay 2.</span>
                  </div>
                </div>
              </div>

              {/* Yard Stock Visualizer */}
              <div className="lg:col-span-6">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                  <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-200">
                    <span className="font-bold text-slate-800">Live Yard Feed</span>
                    <span className="font-mono font-bold text-emerald-700">1,482 Blocks In Yard</span>
                  </div>

                  <div className="mt-3 space-y-2 text-xs">
                    {[
                      { id: "MKR-881", name: "Makrana White Grade A", row: "Row 3 · Slot 12", days: 14, status: "Active" },
                      { id: "BLK-204", name: "Black Galaxy Granite", row: "Row 1 · Slot 04", days: 48, status: "Aging" },
                      { id: "LAK-512", name: "Lakha Red Granite", row: "Row 2 · Slot 09", days: 92, status: "Critical" },
                    ].map((item) => (
                      <div key={item.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3 shadow-xs">
                        <div>
                          <div className="font-mono font-bold text-slate-900">{item.id} · {item.name}</div>
                          <div className="text-[11px] text-slate-500">{item.row}</div>
                        </div>
                        <span
                          className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold ${
                            item.status === "Active"
                              ? "bg-emerald-100 text-emerald-800"
                              : item.status === "Aging"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.days}d ({item.status})
                        </span>
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
                <span className="rounded-full bg-amber-100 px-3 py-1 font-mono text-xs font-bold text-amber-800">
                  Branded Digital Catalog
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
                  Your Yard Gets Its Own 3D Online Showroom
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Send architects and VIP buyers a single link to explore your stock in 3D. Choose whether to display prices or mark &ldquo;Price on Request&rdquo;. Quarry purchase costs remain 100% confidential.
                </p>
              </div>

              <div className="lg:col-span-6">
                <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5 shadow-sm text-center">
                  <div className="mx-auto flex h-28 w-44 items-center justify-center rounded-xl border border-amber-200 bg-white shadow-xs">
                    <span className="font-mono text-xs font-bold text-amber-800">
                      🏛️ 3D Slab Preview
                    </span>
                  </div>
                  <div className="mt-3 font-bold text-slate-900 text-sm">
                    Italian Statuario Extra (Lot #STAT-402)
                  </div>
                  <div className="mt-0.5 font-mono text-xs text-amber-800 font-bold">
                    34 Slabs Available · Price on Request
                  </div>
                  <a
                    href="https://wa.me/917043765580?text=Namaste,%20I%20saw%20Lot%20STAT-402%20in%20your%20Showroom."
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-500 transition-colors"
                  >
                    💬 Inquire on WhatsApp
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
