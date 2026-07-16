"use client";

import { useId, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import {
  features,
  incumbents,
  sections,
  statusMeta,
  getIncumbent,
  type CellStatus,
  type Feature,
  type Incumbent,
  type IncumbentId,
} from "@/content/compare";

/**
 * The comparison ENGINE (COMPARISON_ENGINE_REDESIGN.md). One tabbed, feature-by-
 * feature comparison — instant client switching, no route change. The active
 * incumbent's content is server-rendered for SEO/no-JS; tabs are enhancement.
 *
 * Motion law: the only thing that moves on a tab switch is the incumbent-
 * dependent cell (keyed remount → a gentle `cmp-swap`). Feature names and the
 * StoneX column never remount → zero layout shift, no whole-page animation.
 */

const GRID = "grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)]";

function toneClass(tone: "ok" | "warn" | "neutral"): string {
  return tone === "ok" ? "text-ok-600" : tone === "warn" ? "text-warn-700" : "text-ink-500";
}

function StatusChip({ status }: { status: CellStatus }) {
  const m = statusMeta[status];
  return (
    <span
      className={cn(
        "text-label inline-flex items-center gap-1.5 font-mono font-medium",
        toneClass(m.tone),
      )}
    >
      <span aria-hidden="true">{m.glyph}</span>
      {m.label}
    </span>
  );
}

function WinnerTag({ label, tone = "ok" }: { label: string; tone?: "ok" | "neutral" }) {
  return (
    <span
      className={cn(
        "rounded-paper-sm text-label mt-2.5 inline-flex items-center gap-1 px-2 py-0.5 font-mono font-medium tracking-wide",
        tone === "ok" ? "bg-ok-100 text-ok-600" : "border-line-300 text-ink-700 border",
      )}
    >
      {tone === "ok" ? <span aria-hidden="true">◆</span> : null}
      {label}
    </span>
  );
}

function CellBody({ status, method }: { status: CellStatus; method: string }) {
  return (
    <>
      <StatusChip status={status} />
      <p className="text-body text-ink-700 mt-1.5 md:min-h-[3.2em]">{method}</p>
    </>
  );
}

function cellSurface(win: boolean): string {
  return win ? "border-ok-600/25 bg-ok-100/70" : "border-line-100 bg-paper-2";
}

function FeatureRow({
  feature,
  incumbent,
  index,
}: {
  feature: Feature;
  incumbent: Incumbent;
  index: number;
}) {
  const inc = feature.cells[incumbent.id];
  const sx = feature.stonex;
  const incWins = inc.winner === "incumbent";
  const sxWins = inc.winner === "stonex";
  const tie = inc.winner === "tie";
  const delay = `${Math.min(index, 5) * 30}ms`;

  // Keyed on the incumbent id so ONLY this block remounts + replays cmp-swap.
  const incBlock = (
    <div key={incumbent.id} className="cmp-swap" style={{ animationDelay: delay }}>
      <CellBody status={inc.status} method={inc.method} />
      {incWins ? <WinnerTag label={`${incumbent.tab} wins here`} /> : null}
    </div>
  );

  const sxBlock = (
    <div>
      <CellBody status={sx.status} method={sx.method} />
      {sxWins ? (
        <WinnerTag label="StoneX advantage" />
      ) : tie ? (
        <WinnerTag label="Matched" tone="neutral" />
      ) : null}
    </div>
  );

  return (
    <li>
      {/* Desktop / tablet: three-column row */}
      <div className={cn("hidden gap-3 md:grid", GRID)}>
        <div className="py-5 pr-4">
          <h3 className="text-heading-3 text-ink-900 font-sans font-bold">{feature.name}</h3>
          <p className="text-body-sm text-ink-500 mt-1">{feature.benefit}</p>
        </div>
        <div className={cn("rounded-paper border p-4", cellSurface(incWins))}>{incBlock}</div>
        <div className={cn("rounded-paper border p-4", cellSurface(sxWins))}>{sxBlock}</div>
      </div>

      {/* Mobile: a stacked card — never horizontal scroll */}
      <div className="rounded-paper border-line-100 bg-paper-2 border p-4 md:hidden">
        <h3 className="text-heading-3 text-ink-900 font-sans font-bold">{feature.name}</h3>
        <p className="text-body-sm text-ink-500 mt-1">{feature.benefit}</p>
        <div className="mt-4 grid gap-3">
          <div className={cn("rounded-paper border p-3", cellSurface(incWins))}>
            <p className="eyebrow mb-1.5">{incumbent.tab}</p>
            {incBlock}
          </div>
          <div className={cn("rounded-paper border p-3", cellSurface(sxWins))}>
            <p className="eyebrow text-accent-700 mb-1.5">StoneX</p>
            {sxBlock}
          </div>
        </div>
      </div>
    </li>
  );
}

function Legend() {
  const order: CellStatus[] = ["included", "partial", "manual", "depends", "planned"];
  return (
    <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2">
      {order.map((s) => {
        const m = statusMeta[s];
        return (
          <span
            key={s}
            className="text-label text-ink-500 inline-flex items-center gap-1.5 font-mono"
          >
            <span aria-hidden="true" className={toneClass(m.tone)}>
              {m.glyph}
            </span>
            {m.label}
          </span>
        );
      })}
    </div>
  );
}

function ConcessionPanel({ incumbent }: { incumbent: Incumbent }) {
  return (
    <div className="rounded-paper border-line-300 bg-paper-2 shadow-desk mt-10 border p-6 sm:p-8">
      <div key={incumbent.id} className="cmp-swap">
        <p className="eyebrow">Honest concession</p>
        <h2 className="font-display text-heading-1 text-ink-900 mt-2 font-medium">
          Where {incumbent.label} honestly wins
        </h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {incumbent.wins.map((w) => (
            <li key={w} className="text-body text-ink-900 flex gap-2.5">
              <span aria-hidden="true" className="text-ok-600 mt-0.5">
                ✓
              </span>
              {w}
            </li>
          ))}
        </ul>
        {incumbent.winsNote ? (
          <p className="text-body-sm text-ink-700 mt-5">{incumbent.winsNote}</p>
        ) : null}
      </div>
    </div>
  );
}

export function CompareEngine({
  initialIncumbentId = "paper",
}: {
  initialIncumbentId?: IncumbentId;
}) {
  const [active, setActive] = useState<IncumbentId>(initialIncumbentId);
  const incumbent = getIncumbent(active);
  const baseId = useId();
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const tabId = (id: IncumbentId) => `${baseId}-tab-${id}`;
  const panelId = `${baseId}-panel`;

  const selectAt = (idx: number) => {
    const id = incumbents[idx].id;
    setActive(id);
    tabRefs.current[id]?.focus();
  };

  return (
    <div>
      {/* Sticky header: tablist + column labels */}
      <div className="bg-paper-0 border-line-100 sticky top-[57px] z-30 border-b py-3">
        <p className="eyebrow">Compare StoneX with</p>
        <div
          role="tablist"
          aria-label="Compare StoneX with a current method"
          className="rounded-paper bg-paper-1 mt-2 flex gap-1 overflow-x-auto p-1 sm:inline-flex"
        >
          {incumbents.map((inc, idx) => {
            const selected = inc.id === active;
            return (
              <button
                key={inc.id}
                type="button"
                role="tab"
                id={tabId(inc.id)}
                aria-selected={selected}
                aria-controls={panelId}
                tabIndex={selected ? 0 : -1}
                ref={(el) => {
                  tabRefs.current[inc.id] = el;
                }}
                onClick={() => setActive(inc.id)}
                onKeyDown={(e) => {
                  const last = incumbents.length - 1;
                  if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                    e.preventDefault();
                    selectAt(idx === last ? 0 : idx + 1);
                  } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                    e.preventDefault();
                    selectAt(idx === 0 ? last : idx - 1);
                  } else if (e.key === "Home") {
                    e.preventDefault();
                    selectAt(0);
                  } else if (e.key === "End") {
                    e.preventDefault();
                    selectAt(last);
                  }
                }}
                className={cn(
                  "rounded-paper-sm text-body ease-standard px-3.5 py-2 font-bold whitespace-nowrap transition-colors duration-180",
                  selected
                    ? "bg-paper-2 text-ink-900 shadow-desk"
                    : "text-ink-500 hover:text-ink-900",
                )}
              >
                {inc.tab}
              </button>
            );
          })}
        </div>

        {/* Column header (desktop) */}
        <div className={cn("mt-4 hidden gap-3 md:grid", GRID)}>
          <span className="eyebrow">Feature</span>
          <span className="eyebrow">{incumbent.tab}</span>
          <span className="eyebrow text-accent-700">StoneX</span>
        </div>
      </div>

      {/* Panel */}
      <div
        id={panelId}
        role="tabpanel"
        aria-labelledby={tabId(active)}
        tabIndex={0}
        className="pt-6"
      >
        <p key={incumbent.id} className="cmp-swap text-body-lg text-ink-700 max-w-2xl">
          {incumbent.blurb}
        </p>

        {sections.map((section) => {
          const rows = features.filter((f) => f.section === section);
          if (!rows.length) return null;
          return (
            <section key={section} aria-label={section} className="mt-8">
              <h2 className="eyebrow text-ink-700 border-line-300 border-b pb-2">{section}</h2>
              <ul className="mt-4 space-y-3 md:space-y-1">
                {rows.map((f, i) => (
                  <FeatureRow key={f.id} feature={f} incumbent={incumbent} index={i} />
                ))}
              </ul>
            </section>
          );
        })}

        <Legend />
        <ConcessionPanel incumbent={incumbent} />
      </div>
    </div>
  );
}
