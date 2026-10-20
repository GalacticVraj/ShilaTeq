"use client";

import { useId, useMemo, useState } from "react";
import { LiveQr } from "@/components/kerf/LiveQr";
import {
  HERO_BLOCK,
  SAMPLE_YARD,
  ageBand,
  blockPath,
  sampleBlocks,
  type AgeBand,
  type SampleBlock,
} from "@/content/sampleYard";
import { cn } from "@/lib/cn";

/**
 * A simulated StoneX inventory screen on fictional sample data. Behaviour shown
 * is documented product behaviour only: fuzzy search on names with exact
 * matching on codes (03_Modules, Finder), ageing bands at the default 90/180
 * days, and the block record's fields. The layout is a simplification, not a
 * product screenshot, and says so.
 */

const MODULES = ["Inventory", "Cutting", "Quotes & orders", "GST invoices", "Payments", "Workers"];

/** Optimal-string-alignment distance (handles one transposition, e.g. marbel→marble). */
function osa(a: string, b: string) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      }
    }
  }
  return d[a.length][b.length];
}

export function matches(block: SampleBlock, raw: string) {
  const q = raw.trim().toLowerCase();
  if (!q) return true;
  // Codes match exactly, so KSH-B0001 can never be confused with KSH-B0007.
  if (/\d/.test(q))
    return block.code.toLowerCase().replace("-", "").includes(q.replace(/[\s-]/g, ""));
  const words = `${block.stone} ${block.type}`.toLowerCase().split(/\s+/);
  return q
    .split(/\s+/)
    .filter((w) => w.length >= 2)
    .every((qw) =>
      words.some(
        (w) =>
          w.includes(qw) ||
          (qw.length >= 4 && osa(w.slice(0, qw.length), qw) <= 1) ||
          (qw.length >= 5 && osa(w, qw) <= 2),
      ),
    );
}

const bandStyle: Record<AgeBand, string> = {
  fresh: "border-age-fresh text-age-fresh",
  amber: "border-age-amber text-age-amber",
  red: "border-age-red text-age-red",
};

function AgeChip({ days }: { days: number }) {
  const b = ageBand(days);
  return (
    <span
      className={cn(
        "inline-flex items-center border px-1.5 py-px font-mono text-[0.6875rem] tracking-wide uppercase",
        bandStyle[b],
      )}
    >
      {b}
    </span>
  );
}

export function StonexPreview() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(HERO_BLOCK.code);
  const searchId = useId();
  const results = useMemo(() => sampleBlocks.filter((b) => matches(b, query)), [query]);
  const block = sampleBlocks.find((b) => b.code === selected) ?? HERO_BLOCK;

  return (
    <div className="border-charcoal-900/15 bg-ivory-50 border shadow-[0_30px_60px_-30px_rgb(20_25_20/0.35)]">
      {/* App bar */}
      <div className="bg-forest-950 text-ivory-50 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3 sm:px-5">
        <p className="flex items-baseline gap-3">
          <span className="display-cut text-[1.35rem] leading-none">StoneX</span>
          <span className="text-ivory-200 text-[0.8125rem]">{SAMPLE_YARD} · fictional</span>
        </p>
        <p className="border-oxide-100/60 text-oxide-100 border px-2 py-1 font-mono text-[0.6875rem] tracking-[0.12em] uppercase">
          Simulated · sample data · not live
        </p>
      </div>

      <div className="grid md:grid-cols-[11rem_1fr] lg:grid-cols-[12rem_1fr_19rem]">
        {/* Module rail (context only; not navigable in this preview) */}
        <div className="border-ivory-200 bg-ivory-100 hidden border-r py-4 md:block">
          <p className="eyebrow px-4">Modules</p>
          <ul className="mt-2 text-[0.9375rem]">
            {MODULES.map((m) => (
              <li
                key={m}
                aria-current={m === "Inventory" ? "page" : undefined}
                className={cn(
                  "border-l-2 px-4 py-1.5",
                  m === "Inventory"
                    ? "border-forest-700 text-charcoal-950 font-semibold"
                    : "text-charcoal-500 border-transparent",
                )}
              >
                {m}
              </li>
            ))}
          </ul>
        </div>

        {/* Inventory */}
        <div className="min-w-0 p-4 sm:p-5">
          <label htmlFor={searchId} className="eyebrow block">
            Find a block
          </label>
          <input
            id={searchId}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Try a misspelling: makrna, marbel, jaisalmr"
            autoComplete="off"
            spellCheck={false}
            className="border-charcoal-500 bg-label text-charcoal-950 placeholder:text-charcoal-500 focus-visible:border-oxide-600 mt-2 h-12 w-full border px-3 text-[1rem] outline-none"
          />
          <p aria-live="polite" className="text-charcoal-500 mt-2 font-mono text-[0.75rem]">
            {results.length} of {sampleBlocks.length} sample blocks
          </p>

          <ul className="border-ivory-200 mt-3 border-t" aria-label="Sample stock">
            {results.map((b) => (
              <li key={b.code} className="border-ivory-200 border-b">
                <button
                  type="button"
                  aria-pressed={b.code === selected}
                  onClick={() => setSelected(b.code)}
                  className={cn(
                    "grid w-full grid-cols-[6.5rem_1fr_auto] items-center gap-x-3 gap-y-1 px-2 py-3 text-left transition-colors sm:grid-cols-[6.5rem_1fr_7.5rem_4.5rem_5.5rem]",
                    b.code === selected ? "bg-forest-100" : "hover:bg-ivory-100",
                  )}
                >
                  <span className="text-charcoal-950 font-mono text-[0.875rem] font-semibold">
                    {b.code}
                  </span>
                  <span className="text-charcoal-900 truncate text-[0.9375rem]">
                    {b.stone} <span className="text-charcoal-500">· {b.type}</span>
                  </span>
                  <span className="text-charcoal-700 hidden font-mono text-[0.8125rem] whitespace-nowrap sm:block">
                    {b.size}
                  </span>
                  <span className="hidden sm:block">
                    <AgeChip days={b.ageDays} />
                  </span>
                  <span className="text-charcoal-700 text-right text-[0.8125rem] sm:text-left">
                    {b.status}
                  </span>
                </button>
              </li>
            ))}
            {results.length === 0 ? (
              <li className="text-charcoal-500 px-2 py-6 text-[0.9375rem]">
                No sample block matches. Codes match exactly; names forgive a typo or two.
              </li>
            ) : null}
          </ul>
        </div>

        {/* Block record */}
        <aside
          aria-label={`Block record ${block.code}`}
          className="border-ivory-200 bg-label border-t p-4 sm:p-5 md:col-span-2 lg:col-span-1 lg:border-t-0 lg:border-l"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow">Block record</p>
              <p className="text-charcoal-950 mt-1 font-mono text-[1.375rem] font-semibold">
                {block.code}
              </p>
              <p className="text-charcoal-700 text-[0.9375rem]">
                {block.stone} · {block.type}
              </p>
            </div>
            <LiveQr
              path={blockPath(block.code)}
              label={`QR code for sample block ${block.code}`}
              className="size-20 shrink-0 [&_svg]:size-full"
            />
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-[0.875rem]">
            {(
              [
                ["Status", block.status],
                ["Grade", block.grade],
                ["Size", block.size],
                ["Finish", block.finish],
                ["Location", block.zone],
                ["Age in yard", `${block.ageDays} days`],
              ] as const
            ).map(([k, v]) => (
              <div key={k}>
                <dt className="eyebrow">{k}</dt>
                <dd className="text-charcoal-900 mt-0.5">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="border-ivory-200 mt-4 flex items-center justify-between border-t pt-3">
            <span className="eyebrow">Ageing</span>
            <AgeChip days={block.ageDays} />
          </div>
          <div className="border-ivory-200 mt-3 flex items-center justify-between border-t pt-3">
            <span className="eyebrow">Cost basis</span>
            <span className="text-charcoal-900 font-mono text-[0.875rem]">
              {block.costBasis} <span className="text-charcoal-500">sample</span>
            </span>
          </div>
          <p className="text-charcoal-500 mt-1 text-[0.8125rem] leading-snug">
            Visible to the yard only. The public card a scan opens never shows it.
          </p>
          <a
            href={blockPath(block.code)}
            className="text-forest-700 mt-4 inline-flex min-h-11 items-center font-semibold underline underline-offset-4"
          >
            Open its public card
          </a>
        </aside>
      </div>
    </div>
  );
}
