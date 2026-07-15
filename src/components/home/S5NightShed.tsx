/**
 * S5 — Signature moment #3: the night shed (phase-4/03 S5, 05).
 * SERVER component (A-007): both narrative states (waiting/synced) are
 * server-rendered; SceneRunner toggles `.is-synced` and `.chip-paused` on
 * [data-s5]; CSS shows the right state and forces the resolved green state
 * under reduced-motion. The SyncChipNarrative is drawn in the site's own
 * ink-diagram language (A-006 §3 — the product screenshot plate joins when
 * real screenshots exist).
 */

const QUEUE = [
  { code: "KSH-B0007", work: "cut logged · 4 slabs" },
  { code: "KSH-B0012", work: "task step done" },
  { code: "DN-101", work: "marked in transit" },
];

export function S5NightShed() {
  return (
    <div
      data-s5=""
      className="rounded-paper border-night-1 bg-night-0 ease-standard border p-5 transition-colors duration-400 sm:p-6"
    >
      {/* The sync chip */}
      <div className="flex items-center gap-3">
        {/* waiting chip */}
        <span
          aria-hidden="true"
          className="s5-wait chip-waiting border-warn-600 bg-warn-100/20 text-warn-600 inline-flex size-6 items-center justify-center rounded-full border"
        >
          <span className="bg-warn-600 size-2 rounded-full" />
        </span>
        {/* synced chip */}
        <span
          aria-hidden="true"
          className="s5-sync border-chip-green bg-chip-green/15 text-chip-green inline-flex size-6 items-center justify-center rounded-full border"
        >
          <svg
            viewBox="0 0 24 24"
            className="size-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path className="s4-tick is-revealed" d="M5 12.5l4.5 4.5L19 7" />
          </svg>
        </span>
        <p className="text-data text-night-ink font-mono font-medium" role="status">
          <span className="s5-wait">No signal · 3 saved, waiting to sync</span>
          <span className="s5-sync">Synced — everything saved.</span>
        </p>
      </div>

      {/* The queued work — the worker's shift, safe on the device */}
      <ul className="border-night-1 mt-4 space-y-2 border-t pt-4">
        {QUEUE.map((row) => (
          <li
            key={row.code}
            className="text-data text-night-ink-soft flex items-baseline justify-between gap-4 font-mono"
          >
            <span>
              <span className="text-night-ink">{row.code}</span> · {row.work}
            </span>
            <span aria-hidden="true">
              <span className="s5-wait text-warn-600">…</span>
              <span className="s5-sync text-chip-green">✓</span>
            </span>
          </li>
        ))}
      </ul>

      <p className="text-body-sm text-night-ink-soft mt-4">
        <span className="s5-wait">
          Offline — your progress is saved and will sync automatically.
        </span>
        <span className="s5-sync">
          Signal returned. The queue drained in order — once each, never twice.
        </span>
      </p>
    </div>
  );
}
