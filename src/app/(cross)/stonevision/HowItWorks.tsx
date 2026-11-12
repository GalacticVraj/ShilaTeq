"use client";

import { useEffect, useRef, useState, type CSSProperties, type ImgHTMLAttributes } from "react";

type Img = ImgHTMLAttributes<HTMLImageElement>;
export type RackSlab = { name: string; img: Img };

const STEPS = [
  { no: "01", who: "Your stock", text: "Pick any slab you’ve photographed in StoneX." },
  {
    no: "02",
    who: "Their room",
    text: "Your buyer adds one photo of their room, from their phone.",
  },
  {
    no: "03",
    who: "Their floor",
    text: "StoneVision lays your slab across it: in perspective, in their light.",
  },
];

/**
 * How it works, as one scene the page's scroll plays (--p, 0 → 1, on a sticky screen):
 *   a rack of slabs, a finger picks one · the others leave, the pick comes forward ·
 *   their room appears and the slab tips onto its floor · it opens into a book-matched pair ·
 *   the stone spreads over the whole floor (StoneVision's real result).
 * With reduced motion: the finished picture beside the three steps.
 */
export default function HowItWorks({
  rack,
  pick,
  room,
  laid,
}: {
  rack: RackSlab[];
  pick: number;
  room: Img;
  laid: Img;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const chosen = rack[pick];

  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - innerHeight)));
      el.style.setProperty("--p", p.toFixed(4));
      setStep(p < 0.3 ? 0 : p < 0.6 ? 1 : 2);
    };
    const onScroll = () => {
      frame ||= requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div ref={ref} className="v-scene" data-step={step}>
      <div className="v-scene__sticky">
        <div className="v-scene__stage">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img {...room} alt="" className="v-scene__room" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            {...laid}
            alt={`A living room with ${chosen.name} laid on its floor by StoneVision.`}
            className="v-scene__laid"
          />
          <span className="v-scene__wall" aria-hidden="true">
            Your stock
          </span>
          {/* the rack: every slab but the pick, which is drawn on its own below */}
          {rack.map((s, i) =>
            i === pick ? null : (
              <div
                key={s.name}
                className="v-scene__rack"
                style={{ "--i": i - pick } as CSSProperties}
                aria-hidden="true"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img {...s.img} alt="" />
                <span>{s.name}</span>
              </div>
            ),
          )}
          <div className="v-scene__slab" aria-hidden="true">
            <div className="v-scene__book">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img {...chosen.img} alt="" className="v-scene__leaf" />
              {/* the second leaf: the same slab mirrored (inside its own plane), folded under the first */}
              <span className="v-scene__leaf v-scene__leaf--b">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img {...chosen.img} alt="" />
              </span>
            </div>
            <span className="v-scene__name">{chosen.name}</span>
          </div>
          <span className="v-scene__finger" aria-hidden="true" />
          <span className="v-scene__tag v-scene__tag--slab" aria-hidden="true">
            {chosen.name} · picked
          </span>
          <span className="v-scene__tag v-scene__tag--laid" aria-hidden="true">
            Floor found · slab laid
          </span>
        </div>
        <ol className="v-scene__steps">
          {STEPS.map((s, k) => (
            <li key={s.no} data-on={k === step ? "" : undefined}>
              <span className="v-scene__no" aria-hidden="true">
                {s.no}
              </span>
              <span>
                <b>{s.who}</b>
                <span>{s.text}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
