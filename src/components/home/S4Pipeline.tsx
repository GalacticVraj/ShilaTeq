import { cn } from "@/lib/cn";

/**
 * S4 — Signature moment #2, the STEPPED variant for all viewports
 * (the blueprint's pre-decided fallback, AMENDMENTS A-006 §1).
 * SERVER component (A-007): both gate states and the post-gate stations are
 * server-rendered; the SceneRunner toggles `.is-paid` on [data-s4]; CSS shows
 * the right state. AT and no-JS users always have the complete pipeline in
 * the DOM (phase-4/03 S4 accessibility law); reduced-motion CSS forces the
 * gate-annotated complete view.
 */

type Station = { code: string; title: string; line: string };

const BEFORE_GATE: Station[] = [
  {
    code: "01",
    title: "Received",
    line: "A purchase order arrives. One tap turns every line into tagged, costed stock.",
  },
  {
    code: "02",
    title: "Tagged",
    line: "Each block is minted with its QR identity — findable in seconds from any phone.",
  },
  {
    code: "03",
    title: "Cut",
    line: "The cutter logs the cut. Wastage prices itself into the slabs; the leftover becomes a sellable remnant.",
  },
  {
    code: "04",
    title: "Quoted",
    line: "A GST-previewed quote goes out on WhatsApp. Quotes hold no stock — first to convert wins.",
  },
  {
    code: "05",
    title: "Reserved",
    line: "The order reserves its stone atomically. Two salesmen can never sell the same block.",
  },
];

const AFTER_GATE: Station[] = [
  { code: "06", title: "Processing", line: "Payment recorded — now the work begins." },
  {
    code: "07",
    title: "Dispatched",
    line: "A gate pass goes with the truck. Nothing leaves unrecorded.",
  },
  {
    code: "08",
    title: "Delivered → SOLD",
    line: "The driver taps once. The whole sale closes itself.",
  },
];

const CASCADE = ["stock marked sold", "cost frozen at sale", "assignment closed"];

export function S4Pipeline() {
  return (
    <div data-s4="">
      {/* Text summary precedes the visual for AT (phase-4/03 S4). */}
      <p className="sr-only">
        The pipeline, in order: received, tagged, cut, quoted, reserved — then the payment gate: no
        confirmed payment, nothing moves. After a payment is recorded: processing, dispatched,
        delivered, and the order completes to sold — stock marked sold, cost frozen, assignment
        closed.
      </p>

      <ol className="border-line-300 relative ml-2 border-l pl-6 sm:ml-4 sm:pl-8">
        {BEFORE_GATE.map((s) => (
          <StationRow key={s.code} station={s} />
        ))}

        {/* THE GATE — the moral center (phase-4/03 S4). */}
        <li className="relative py-5">
          <span
            aria-hidden="true"
            className="border-warn-600 bg-warn-100 absolute top-7 -left-[31px] flex size-3 items-center justify-center rounded-full border sm:-left-[39px]"
          />
          <div className="rounded-paper border-line-300 bg-paper-2 shadow-desk border p-5">
            <p className="eyebrow">The gate</p>

            {/* Unpaid state (hidden by CSS once .is-paid / under reduced-motion) */}
            <div className="s4-unpaid">
              <p className="text-body-lg text-ink-900 mt-2 font-bold">
                &ldquo;No confirmed payment — nothing moves.&rdquo;
              </p>
              <p className="text-body-sm text-ink-700 mt-1">
                ShilaTeq refuses to process, dispatch, or ship an unpaid order. Your rule, made
                unbreakable.
              </p>
              <button
                type="button"
                data-gate-btn=""
                className="rounded-paper bg-ink-900 text-body text-paper-2 ease-standard mt-4 inline-flex min-h-12 items-center gap-2 px-5 py-2.5 font-bold transition-colors duration-180 hover:bg-black active:scale-[0.98] motion-reduce:active:scale-100"
              >
                Record payment →
              </button>
            </div>

            {/* Paid state */}
            <p
              className="s4-paid text-body-lg text-ink-900 mt-2 flex items-center gap-2 font-bold"
              data-gate-paid=""
              tabIndex={-1}
            >
              <svg
                viewBox="0 0 24 24"
                className="text-ok-600 size-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path className="s4-tick" d="M4 12.5l5 5L20 6.5" />
              </svg>
              <span>
                Payment recorded.{" "}
                <span className="text-ink-700 font-normal">
                  (The gate only opens after a confirmed payment.)
                </span>
              </span>
            </p>
          </div>
        </li>

        {/* After the gate — always in the DOM; visually held until the enactment. */}
        {AFTER_GATE.map((s) => (
          <StationRow key={s.code} station={s} className="s4-after" />
        ))}
        {/* The sold cascade — then stillness (the story's biggest rest). */}
        <li className="s4-after relative py-2 pb-6">
          <ul className="ml-1 space-y-1">
            {CASCADE.map((line, i) => (
              <li
                key={line}
                className="text-data text-ink-700 flex items-center gap-2 font-mono"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <span aria-hidden="true" className="text-ok-600">
                  ✓
                </span>
                {line}
              </li>
            ))}
          </ul>
        </li>
      </ol>
    </div>
  );
}

function StationRow({ station, className }: { station: Station; className?: string }) {
  return (
    <li className={cn("relative py-4", className)}>
      <span
        aria-hidden="true"
        className={cn(
          "border-ink-700 bg-paper-0 absolute top-6 -left-[30px] size-2.5 rounded-full border sm:-left-[38px]",
        )}
      />
      <p className="text-label text-ink-500 font-mono">{station.code}</p>
      <h3 className="text-heading-3 text-ink-900 mt-0.5 font-sans font-bold">{station.title}</h3>
      <p className="text-body text-ink-700 mt-1 max-w-xl">{station.line}</p>
    </li>
  );
}
