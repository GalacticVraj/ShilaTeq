"use client";

import Image from "next/image";
import { useRef, useState, useSyncExternalStore, type KeyboardEvent, type ReactNode } from "react";
import FlipCard from "@/components/cross/micro/FlipCard";
import RubberSegment from "@/components/cross/micro/RubberSegment";
import StatusMark from "@/components/cross/micro/StatusMark";
import { BLOCK, YARD_STEPS as STEPS, type Capture } from "@/components/cross/sampleYardData";

/**
 * Section 3 of the Cross-Section prototype: "Follow one block" — the interactive island.
 * The journey's text and captures live in sampleYardData.ts (shared with the no-JS
 * fallback). Product screens are not captured yet, so each step shows labelled placeholder
 * frames, never imitation UI.
 */

const STONE = "/stone/statuarietto.jpg";
const DEMO_MAIL =
  "mailto:shilateq@gmail.com?subject=" +
  encodeURIComponent("StoneX demo request (from the sample yard)");

// Six slabs from one block: one photograph, each card zoomed (1.8×) onto a different region,
// so the faces read as six cuts of one stone rather than one image repeated.
const SLABS = ["10% 14%", "52% 20%", "90% 30%", "16% 74%", "55% 62%", "88% 86%"].map(
  (focus, i) => ({ code: `${BLOCK}-S0${i + 1}`, short: `S0${i + 1}`, focus }),
);

// Status Mark on the Bone record cards: Malachite glyph when done. Its labels are dimmed
// by opacity (0.6 when done), so they use Obsidian, which keeps them ≥ 4.5:1 on Bone.
const MARK = {
  color: "#111715",
  doneColor: "#164b3d",
  strike: false,
  size: 20,
  fontSize: 15,
} as const;

const finePointer = {
  subscribe(cb: () => void) {
    const m = matchMedia("(pointer: fine)");
    m.addEventListener("change", cb);
    return () => m.removeEventListener("change", cb);
  },
  get: () => matchMedia("(pointer: fine)").matches,
};

/** A labelled stand-in for a product capture: hatched, captioned, never imitation UI. */
function Pending({ capture }: { capture: Capture }) {
  return (
    <figure className="x-pending" data-device={capture.device}>
      <div className="x-pending__view">
        <span className="x-pending__tag x-label">Capture pending</span>
        <span className="x-pending__title">{capture.title}</span>
        <span className="x-pending__shows">{capture.shows}</span>
      </div>
      <figcaption className="x-label">
        {capture.device} · real StoneX screen, fictional data · to be captured
      </figcaption>
    </figure>
  );
}

function Fields({ rows }: { rows: { k: string; v: ReactNode }[] }) {
  return (
    <dl className="x-fields">
      {rows.map(({ k, v }) => (
        <div key={k}>
          <dt className="x-label">{k}</dt>
          <dd>{v}</dd>
        </div>
      ))}
    </dl>
  );
}

/* ---------- The five steps ---------- */

function Arrives({ qr }: { qr: string }) {
  return (
    <>
      <p>{STEPS[0].copy}</p>
      <div className="x-yard__object x-tagset">
        <div className="x-tag">
          <div>
            <p className="x-label x-tag__yard">Sample Yard · QR tag</p>
            <p className="x-tag__code">{BLOCK}</p>
            <p className="x-tag__stone">Statuarietto · Marble</p>
            <p className="x-label x-tag__meta">11 × 5.4 ft · Grade A · Zone A · Row 2</p>
          </div>
          <div
            className="x-tag__qr"
            role="img"
            aria-label={`QR tag for ${BLOCK}`}
            dangerouslySetInnerHTML={{ __html: qr }}
          />
        </div>
        <div className="x-scan">
          <div>
            <p className="x-label x-scan__head">Anyone who scans it sees</p>
            <ul>
              <li>the stone, its size, grade and finish</li>
              <li>where it sits in the yard</li>
              <li>whether it is available, reserved or sold</li>
            </ul>
          </div>
          <div>
            <p className="x-label x-scan__head">Never shown outside the yard</p>
            <ul>
              <li>what it cost, and from which supplier</li>
              <li>its price</li>
              <li>who reserved it</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

function Cut({ fine }: { fine: boolean }) {
  return (
    <>
      <p>{STEPS[1].copy}</p>
      <div className="x-yard__object">
        <p className="x-lineage x-label">
          <span>{BLOCK}</span>
          <span aria-hidden="true">→</span>
          <span>6 slabs · one bundle · “6 of 6 slabs left”</span>
          <span aria-hidden="true">+</span>
          <span>remnant {BLOCK}-R1</span>
        </p>
        <ul className="x-rack" aria-label={`Slabs cut from ${BLOCK}`}>
          {SLABS.map((s) => (
            <li key={s.code} className="x-rack__cell">
              <FlipCard
                width="100%"
                height="100%"
                radius={2}
                background="#f3f6f2"
                color="#111715"
                shadow={false}
                tilt={false}
                glare={false}
                hoverScale={1}
                stiffness={210}
                damping={24}
                draggable={fine}
                ariaLabel={`Slab ${s.code}: cut from block ${BLOCK}, 10.8 by 5.2 feet, 18 millimetres, polished, available. Flip between the stone and its record.`}
                front={
                  <div className="x-slab">
                    <Image
                      src={STONE}
                      alt=""
                      fill
                      sizes="(min-width: 64rem) 30rem, 90vw"
                      className="x-slab__img"
                      style={{
                        objectPosition: s.focus,
                        transform: "scale(1.8)",
                        transformOrigin: s.focus,
                      }}
                    />
                    <span className="x-slab__mark x-label">{s.short}</span>
                  </div>
                }
                back={
                  <div className="x-slab x-slab--record">
                    <p className="x-label x-slab__kind">Slab record</p>
                    <p className="x-slab__code">{s.code}</p>
                    <Fields
                      rows={[
                        { k: "Cut from", v: BLOCK },
                        { k: "Size", v: "10.8 × 5.2 ft" },
                        { k: "Thickness", v: "18 mm" },
                        { k: "Finish", v: "Polished" },
                        { k: "Status", v: <span className="x-chip">Available</span> },
                      ]}
                    />
                  </div>
                }
              />
            </li>
          ))}
        </ul>
        <p className="x-yard__hint">Flip a slab to see its record.</p>
        <div className="x-remnant">
          <span className="x-label">Remnant</span>
          <span className="x-remnant__code">{BLOCK}-R1</span>
          <span>back in Zone A as a block of its own</span>
        </div>
      </div>
    </>
  );
}

function OnShow({ price, setPrice }: { price: string; setPrice: (v: string) => void }) {
  return (
    <>
      <p>{STEPS[2].copy}</p>
      <div className="x-yard__object x-show">
        <div className="x-show__control">
          <p className="x-label x-show__label">Price in the showroom</p>
          <RubberSegment
            items={[
              { value: "shown", label: "Shown" },
              { value: "request", label: "On request" },
            ]}
            value={price}
            onChange={(v) => setPrice(v)}
            aria-label="Price in the showroom"
            size="lg"
            radius={2}
            inset={4}
            stretch={35}
            squash={0}
            trackColor="#1f2925"
            thumbColor="#f3f6f2"
            textColor="#f3f6f2"
            activeTextColor="#111715"
          />
          <p className="x-show__note">A per-stone setting in StoneX.</p>
        </div>
        <figure className="x-buyer">
          <div className="x-buyer__photo">
            <Image
              src={STONE}
              alt=""
              fill
              sizes="(min-width: 64rem) 14rem, 40vw"
              style={{ objectFit: "cover", objectPosition: "30% 40%" }}
            />
          </div>
          <div className="x-buyer__text">
            <p className="x-buyer__name">Statuarietto · Marble</p>
            <p className="x-buyer__meta">6 slabs · 10.8 × 5.2 ft · polished</p>
            <p className="x-buyer__price" aria-live="polite">
              {price === "shown" ? "₹480 per sq ft" : "Price on request"}
            </p>
          </div>
          <figcaption className="x-label x-buyer__cap">
            Buyer&apos;s view · illustration, not a StoneX screen
          </figcaption>
        </figure>
        <p className="x-lead">
          <span className="x-label x-lead__kind">Leads · new</span>
          <span>
            <strong>Sample Buyer</strong> asked about {BLOCK} · 4 slabs
          </span>
        </p>
      </div>
    </>
  );
}

function Promised() {
  return (
    <>
      <p>{STEPS[3].copy}</p>
      <div className="x-yard__object x-order">
        <p className="x-label x-order__head">QT-018 → ORD-014 · Sample Buyer</p>
        <ul className="x-slabchips" aria-label={`Slabs of ${BLOCK}`}>
          {SLABS.map((s, i) => (
            <li key={s.code} data-reserved={i < 4 || undefined}>
              <span className="x-label">{s.short}</span>
              {i < 4 ? "Reserved" : "Available"}
            </li>
          ))}
        </ul>
        <ol className="x-track">
          <li>
            <StatusMark status="done" label="Reserved: S01–S04 held for this order" {...MARK} />
          </li>
          <li>
            <StatusMark status="done" label="Part-payment recorded" {...MARK} />
          </li>
          <li>
            <StatusMark status="done" label="Processing" {...MARK} />
          </li>
          <li>
            <StatusMark status="pending" label="Shipped, when it is dispatched" {...MARK} />
          </li>
          <li>
            <StatusMark status="pending" label="Sold, when every slab is delivered" {...MARK} />
          </li>
        </ol>
      </div>
    </>
  );
}

function Delivered({
  active,
  delivered,
  setDelivered,
  restart,
}: {
  active: boolean;
  delivered: boolean;
  setDelivered: (v: boolean) => void;
  restart: () => void;
}) {
  return (
    <>
      <p>{STEPS[4].copy}</p>
      <div className="x-yard__object x-order">
        <p className="x-label x-order__head">Dispatch SY-DN0007 · ORD-014 · 4 slabs</p>
        <ol className="x-track">
          <li>
            <StatusMark status="done" label="Order packed" {...MARK} />
          </li>
          <li>
            <StatusMark status="done" label="Dispatched" {...MARK} />
          </li>
          <li>
            {/* Only spins while this step is on screen. */}
            <StatusMark
              status={delivered ? "done" : active ? "running" : "pending"}
              label="In transit"
              {...MARK}
            />
          </li>
          <li>
            <StatusMark status={delivered ? "done" : "pending"} label="Delivered" {...MARK} />
          </li>
        </ol>
        {delivered ? (
          <div className="x-closed">
            <p className="x-closed__sold">
              <span className="x-label">ORD-014</span> Sold
            </p>
            <p>Still in Zone A: S05 and S06 (“2 of 6 slabs left”) and the remnant {BLOCK}-R1.</p>
          </div>
        ) : (
          <button type="button" className="x-yard__try" onClick={() => setDelivered(true)}>
            <span className="x-label">Try it</span> Mark it delivered, as the driver does from their
            link
          </button>
        )}
        <p className="sr-only" aria-live="polite">
          {delivered ? "Delivered. Order ORD-014 is now sold." : ""}
        </p>
      </div>
      <div className="x-yard__end">
        <p className="x-yard__end-title">Every block in your yard can carry a record like this.</p>
        <div className="x-yard__end-actions">
          <a href={DEMO_MAIL} className="x-btn x-btn--signal">
            Book a demo
          </a>
          <button type="button" className="x-link-cut" onClick={restart}>
            Follow it again
          </button>
        </div>
      </div>
    </>
  );
}

/* ---------- The stepper ---------- */

export function SampleYard({ qr }: { qr: string }) {
  const [active, setActive] = useState(0);
  const [price, setPrice] = useState("request");
  const [delivered, setDelivered] = useState(false);
  const fine = useSyncExternalStore(finePointer.subscribe, finePointer.get, () => false);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const heads = useRef<(HTMLHeadingElement | null)[]>([]);
  const stage = useRef<HTMLDivElement>(null);
  const last = STEPS.length - 1;

  const go = (i: number, focus: "tab" | "panel") => {
    setActive(i);
    // After the new panel is painted: move focus, and bring its top into view.
    requestAnimationFrame(() => {
      if (focus === "tab") {
        tabs.current[i]?.focus();
        return;
      }
      heads.current[i]?.focus({ preventScroll: true });
      if ((stage.current?.getBoundingClientRect().top ?? 0) < 0) {
        const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
        stage.current?.scrollIntoView({ block: "start", behavior: still ? "auto" : "smooth" });
      }
    });
  };

  const onTabKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const to: Record<string, number> = {
      ArrowDown: active + 1,
      ArrowRight: active + 1,
      ArrowUp: active - 1,
      ArrowLeft: active - 1,
      Home: 0,
      End: last,
    };
    if (!(e.key in to)) return;
    e.preventDefault();
    go(Math.min(last, Math.max(0, to[e.key])), "tab");
  };

  const panel = (i: number): ReactNode => {
    switch (i) {
      case 0:
        return <Arrives qr={qr} />;
      case 1:
        return <Cut fine={fine} />;
      case 2:
        return <OnShow price={price} setPrice={setPrice} />;
      case 3:
        return <Promised />;
      default:
        return (
          <Delivered
            active={active === 4}
            delivered={delivered}
            setDelivered={setDelivered}
            restart={() => {
              setDelivered(false);
              go(0, "panel");
            }}
          />
        );
    }
  };

  return (
    <div className="x-yard__stage" ref={stage}>
      <div
        role="tablist"
        aria-label={`${BLOCK}'s journey`}
        aria-orientation="vertical"
        className="x-yard__rail js-only"
        onKeyDown={onTabKey}
      >
        {STEPS.map((step, i) => (
          <button
            key={step.title}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`x-yard-tab-${i}`}
            aria-selected={i === active}
            aria-controls={`x-yard-panel-${i}`}
            tabIndex={i === active ? 0 : -1}
            data-state={i < active ? "done" : i === active ? "active" : "next"}
            className="x-yard__tab"
            onClick={() => go(i, "tab")}
          >
            <span className="x-yard__tab-num x-label">0{i + 1}</span>
            <span className="x-yard__tab-title">{step.title}</span>
            <span className="x-yard__tab-status x-label">{step.status}</span>
          </button>
        ))}
      </div>

      <div className="x-yard__panels">
        {STEPS.map((step, i) => (
          <section
            key={step.title}
            role="tabpanel"
            id={`x-yard-panel-${i}`}
            aria-labelledby={`x-yard-tab-${i}`}
            hidden={i !== active}
            className="x-yard__panel"
          >
            {/* Only the open step is rendered: less HTML to parse on slow phones, and the
                no-JS reader gets the <noscript> list instead. Empty shells keep the tab ARIA valid. */}
            {i === active && (
              <>
                <p className="x-label x-yard__count">
                  Step {i + 1} of {STEPS.length}
                </p>
                <h3
                  ref={(el) => {
                    heads.current[i] = el;
                  }}
                  tabIndex={-1}
                  className="x-yard__title x-display"
                >
                  {step.title}
                </h3>
                <p className="x-label x-yard__status">Record · {step.status}</p>
                <div className="x-yard__body">{panel(i)}</div>
                <div className="x-yard__evidence">
                  <p className="x-label x-yard__evidence-head">Product evidence</p>
                  <div className="x-yard__evidence-grid">
                    {step.captures.map((c) => (
                      <Pending key={c.title} capture={c} />
                    ))}
                  </div>
                </div>
                <div className="x-yard__nav">
                  {i > 0 && (
                    <button
                      type="button"
                      className="x-yard__back"
                      onClick={() => go(i - 1, "panel")}
                    >
                      ← Back
                    </button>
                  )}
                  {i < last && (
                    <button
                      type="button"
                      className="x-yard__next"
                      onClick={() => go(i + 1, "panel")}
                    >
                      Next: {STEPS[i + 1].title}
                    </button>
                  )}
                </div>
              </>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
