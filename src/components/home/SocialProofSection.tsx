export function SocialProofSection() {
  const reviews = [
    {
      quote:
        "We cut 20,000+ sq.ft of marble every month. Gangsaw wastage used to be written off. ShilaTeq’s yield engine recovered ₹3.8 Lakhs in sellable stone remnants in our first 45 days. My cutters in the shed learned it in 15 minutes.",
      author: "Rajendra Sharma",
      title: "Managing Director",
      yard: "Sharma Marbles & Granites (Kishangarh, Rajasthan)",
      metric: "+₹3.8L Wastage Salvaged",
      metricColor: "text-emerald-400",
      avatarBg: "from-amber-600 to-amber-800",
      stars: 5,
    },
    {
      quote:
        "Double-booking was our biggest headache. Two salesmen would take advance tokens from different buyers for the same high-value block. ShilaTeq locks the stone atomically the moment a quote is generated. Zero disputes since.",
      author: "Vikram Patel",
      title: "Founder & Yard Owner",
      yard: "Patel Quartz & Stones (Morbi, Gujarat)",
      metric: "0% Double-Selling Errors",
      metricColor: "text-cyan-400",
      avatarBg: "from-cyan-600 to-blue-800",
      stars: 5,
    },
    {
      quote:
        "Dispatching GST invoices with payment QR codes directly to our buyers' WhatsApp cut our payment collection cycle from 28 days down to 4 days. Drivers get their gate pass on their phones in seconds.",
      author: "K. Suresh Reddy",
      title: "Operations Head",
      yard: "Reddy Black Galaxy Exports (Ongole, Andhra Pradesh)",
      metric: "4x Faster Collections",
      metricColor: "text-emerald-400",
      avatarBg: "from-emerald-600 to-teal-800",
      stars: 5,
    },
  ];

  return (
    <section id="testimonials" className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/60 px-3.5 py-1 text-xs font-semibold text-emerald-400">
            Trusted by the Trade
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Built for the Harsh Realities of <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-amber-300 bg-clip-text text-transparent">
              Indian Stone Yards.
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-400 sm:text-lg">
            See how leading marble, granite, and sandstone processors across India run their entire business on ShilaTeq.
          </p>
        </div>

        {/* Big Metrics Ribbon */}
        <div className="mt-12 grid grid-cols-2 gap-4 rounded-2xl border border-slate-800 bg-slate-950/80 p-6 backdrop-blur-xl sm:grid-cols-4 sm:p-8">
          <div className="text-center">
            <div className="font-mono text-3xl font-extrabold text-emerald-400 sm:text-4xl">
              ₹450+ Cr
            </div>
            <div className="mt-1 text-xs font-medium text-slate-400">
              Stone Inventory Tracked
            </div>
          </div>
          <div className="text-center">
            <div className="font-mono text-3xl font-extrabold text-cyan-400 sm:text-4xl">
              120+
            </div>
            <div className="mt-1 text-xs font-medium text-slate-400">
              Active Stone Yards
            </div>
          </div>
          <div className="text-center">
            <div className="font-mono text-3xl font-extrabold text-amber-400 sm:text-4xl">
              99.8%
            </div>
            <div className="mt-1 text-xs font-medium text-slate-400">
              GST Billing Accuracy
            </div>
          </div>
          <div className="text-center">
            <div className="font-mono text-3xl font-extrabold text-white sm:text-4xl">
              0 Sec
            </div>
            <div className="mt-1 text-xs font-medium text-slate-400">
              Internet Required for Workers
            </div>
          </div>
        </div>

        {/* Review Cards */}
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {reviews.map((r) => (
            <div
              key={r.author}
              className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-950/60 p-6 shadow-xl backdrop-blur-md transition-all duration-300 hover:border-slate-700"
            >
              <div>
                {/* Rating stars and Metric tag */}
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400 text-sm">
                    {Array.from({ length: r.stars }).map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                  <span className={`font-mono text-xs font-bold ${r.metricColor}`}>
                    {r.metric}
                  </span>
                </div>

                <p className="mt-4 text-xs leading-relaxed text-slate-300">
                  &ldquo;{r.quote}&rdquo;
                </p>
              </div>

              <div className="mt-6 flex items-center gap-3 border-t border-slate-800/80 pt-4">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr ${r.avatarBg} font-bold text-white text-xs shadow`}
                >
                  {r.author
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{r.author}</div>
                  <div className="text-[11px] text-slate-400">
                    {r.title} · {r.yard}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
