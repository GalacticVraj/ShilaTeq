"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { EXAMPLES, searchYard, type Parsed, type Status } from "./stoneSearch";

const STATUS: Record<Status, string> = {
  available: "For sale",
  reserved: "Reserved",
  processing: "On order",
  sold: "Sold",
  cut: "Cut into slabs",
  at_saw: "At the saw",
};
const SHOWN = 4;
const ft = (n: number) => String(+n.toFixed(2));
const rupees = (n: number) => `₹${n.toLocaleString("en-IN")}`;

/** What the parser lifted out of the words, as plain chips. */
function parts(p: Parsed) {
  const out: string[] = [];
  if (p.kind) out.push(p.kind === "slab" ? "Slabs only" : "Blocks only");
  if (p.zone) out.push(`Zone ${p.zone.toUpperCase()}`);
  if (p.grade) out.push(`Grade ${p.grade.toUpperCase()}`);
  if (p.size) out.push(`${ft(p.size[0])} × ${ft(p.size[1])} ft, either way`);
  if (p.thicknessIn != null) out.push(`${Math.round(p.thicknessIn * 25.4)} mm thick`);
  if (p.min != null && p.max != null) out.push(`${rupees(p.min)}–${p.max} / sq ft`);
  else if (p.max != null) out.push(`Up to ${rupees(p.max)} / sq ft`);
  else if (p.min != null) out.push(`From ${rupees(p.min)} / sq ft`);
  return out;
}

/**
 * The search, live: StoneX's own matcher on a fictional demo yard. Until someone
 * uses it, it types the examples itself (only on screen, never with reduced
 * motion); the first touch hands it over for good.
 */
export default function YardSearch() {
  const [q, setQ] = useState(EXAMPLES[0]);
  const [mine, setMine] = useState(false);
  const qRef = useRef(q);
  const boxRef = useRef<HTMLDivElement>(null);
  const { parsed, words, results } = useMemo(() => searchYard(q), [q]);

  useEffect(() => {
    qRef.current = q;
  }, [q]);

  useEffect(() => {
    const box = boxRef.current;
    if (mine || !box || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let alive = true;
    let seen = false;
    let timer = 0;
    const io = new IntersectionObserver(([e]) => (seen = e.isIntersecting), { threshold: 0.35 });
    io.observe(box);
    const wait = (ms: number) => new Promise<void>((r) => (timer = window.setTimeout(r, ms)));
    (async () => {
      for (let i = 1; alive; i = (i + 1) % EXAMPLES.length) {
        await wait(2800);
        while (alive && !seen) await wait(400);
        for (let n = qRef.current.length; alive && n >= 0; n--) {
          setQ(qRef.current.slice(0, n));
          await wait(22);
        }
        const text = EXAMPLES[i];
        for (let n = 1; alive && n <= text.length; n++) {
          setQ(text.slice(0, n));
          await wait(55 + Math.random() * 45);
        }
      }
    })();
    return () => {
      alive = false;
      clearTimeout(timer);
      io.disconnect();
    };
  }, [mine]);

  const take = () => setMine(true);
  const chips = parts(parsed);
  const fixed = words.some((w) => w.read);

  return (
    <div className="e-ask" ref={boxRef}>
      <p className="e-step" aria-hidden="true">
        <span>1</span> You type
      </p>
      <div className="e-ask__bar" data-fixed={fixed ? "" : undefined}>
        <label htmlFor="e-ask-q" className="sr-only">
          Search the demo yard’s stock
        </label>
        <svg className="e-ask__icon" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="m15.5 15.5 5 5" />
        </svg>
        <input
          id="e-ask-q"
          type="search"
          className="e-ask__input"
          value={q}
          autoComplete="off"
          spellCheck={false}
          placeholder="Try: whte marble zone a"
          onFocus={(e) => {
            take();
            e.currentTarget.select();
          }}
          onChange={(e) => {
            take();
            setQ(e.target.value);
          }}
        />
        <p className="e-ask__count" aria-live={mine ? "polite" : "off"}>
          {results.length} of 22 blocks
        </p>
        <div className="e-ask__tries">
          <span className="x-label">Try</span>
          {[...EXAMPLES.slice(0, 3), "reserved"].map((ex) => (
            <button
              key={ex}
              type="button"
              className="e-ask__try"
              aria-pressed={q === ex}
              onClick={() => {
                take();
                setQ(ex);
              }}
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      {/* Room for every result shown, so the page below never jumps while it types. */}
      <div className="e-ask__out">
      <div className="e-ask__col">
      <p className="e-step" aria-hidden="true">
        <span>2</span> StoneX understands
      </p>
      {chips.length > 0 || words.length > 0 ? (
        <ul className="e-ask__read" aria-label="What StoneX understood">
          {chips.map((c) => (
            <li key={c} className="e-chip">
              {c}
            </li>
          ))}
          {words.map((w) =>
            w.read ? (
              <li key={`${w.typed}>${w.read}`} className="e-chip e-chip--fixed">
                <span aria-hidden="true">
                  <s>{w.typed}</s> → {w.read}
                </span>
                <span className="sr-only">
                  {w.typed}, read as {w.read}
                </span>
              </li>
            ) : (
              <li key={w.typed} className={w.miss ? "e-chip e-chip--miss" : "e-chip"}>
                {w.typed}
                {w.miss && <span className="sr-only">, not found</span>}
              </li>
            ),
          )}
        </ul>
      ) : (
        <p className="e-ask__none">Everything in the yard, until you type.</p>
      )}
      </div>

      <div className="e-ask__col">
      <p className="e-step" aria-hidden="true">
        <span>3</span> Found in the yard
      </p>
      {results.length ? (
        <ol className="e-ask__results" aria-label="Matching blocks">
          {results.slice(0, SHOWN).map((s) => (
            <li key={s.code} className="e-ask__row">
              <span className="e-ask__code">{s.code}</span>
              <span className="e-ask__name">
                {s.variety} <small>{s.type}</small>
              </span>
              <span className="e-ask__size">
                {ft(s.l)} × {ft(s.w)} ft
              </span>
              <span className="e-ask__zone">{s.zone}</span>
              <span className="e-ask__status" data-s={s.status}>
                {STATUS[s.status]}
              </span>
              <span className="e-ask__rate">{s.rate ? `${rupees(s.rate)}/sq ft` : "—"}</span>
            </li>
          ))}
          {results.length > SHOWN && (
            <li className="e-ask__more x-label">and {results.length - SHOWN} more</li>
          )}
        </ol>
      ) : (
        <p className="e-ask__none">
          No block matches all of that. Every word has to match something the yard recorded.
        </p>
      )}
      </div>
      </div>
    </div>
  );
}
