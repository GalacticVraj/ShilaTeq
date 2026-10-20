"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";

/**
 * Section 2 of the Cross-Section prototype: four everyday questions, each answered
 * by a crop of a real StoneX screen (mock mode, fictional "Demo Stone Yard").
 * Desktop: one sticky frame re-frames the same screenshots as each question
 * reaches the middle of the viewport (no scroll hijacking). Phones and no-JS:
 * every question carries its own, tighter crop.
 */

const SHOTS = {
  inventory: { src: "/product/stonex/inventory-demo.png", w: 2880, h: 1716, name: "Inventory" },
  dashboard: { src: "/product/stonex/dashboard-demo.png", w: 2880, h: 1720, name: "Dashboard" },
} as const;

type ShotId = keyof typeof SHOTS;
/** A crop in screenshot pixels; its height follows from the frame's aspect ratio. */
type Crop = { x: number; y: number; w: number };
/** A numbered mark at a point in screenshot pixels, placed in whitespace beside its target. */
type Pin = { x: number; y: number; label: string };

export type Step = {
  tag: string;
  question: string;
  answer: string;
  shot: ShotId;
  alt: string;
  stage: { crop: Crop; pins: Pin[] };
  phone: { crop: Crop; pins: Pin[] };
};

const STAGE_ASPECT = 16 / 10;
const PHONE_ASPECT = 4 / 3;

function cropStyle(shot: ShotId, { x, y, w }: Crop): CSSProperties {
  const s = SHOTS[shot];
  return {
    "--s": s.w / w,
    "--tx": `${(-x / s.w) * 100}%`,
    "--ty": `${(-y / s.h) * 100}%`,
  } as CSSProperties;
}

function pinStyle({ x, y, w }: Crop, aspect: number, pin: Pin): CSSProperties {
  return {
    "--px": `${((pin.x - x) / w) * 100}%`,
    "--py": `${((pin.y - y) / (w / aspect)) * 100}%`,
  } as CSSProperties;
}

function Pins({
  crop,
  aspect,
  pins,
  on,
}: {
  crop: Crop;
  aspect: number;
  pins: Pin[];
  on?: boolean;
}) {
  return pins.map((pin, i) => (
    <span
      key={pin.label}
      className="x-pin"
      data-on={on || undefined}
      style={pinStyle(crop, aspect, pin)}
      aria-hidden="true"
    >
      {i + 1}
    </span>
  ));
}

function Legend({ pins }: { pins: Pin[] }) {
  return (
    <ol className="x-legend">
      {pins.map((pin, i) => (
        <li key={pin.label}>
          <b aria-hidden="true">{i + 1}</b>
          {pin.label}
        </li>
      ))}
    </ol>
  );
}

function caption(shot: ShotId) {
  return `StoneX · fictional demo yard · ${SHOTS[shot].name}`;
}

export function EvidenceSteps({ steps }: { steps: Step[] }) {
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const items = listRef.current?.querySelectorAll<HTMLElement>("[data-step]");
    if (!items) return;
    // The question crossing the middle band of the viewport is the active one.
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.step));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const current = steps[active];
  // Each screenshot keeps the crop of its most recent question, so switching
  // shots crossfades while moving within a shot re-frames it.
  const cropFor = (shot: ShotId) => {
    if (current.shot === shot) return current.stage.crop;
    return steps.find((s) => s.shot === shot)!.stage.crop;
  };

  return (
    <div className="x-steps">
      <ol ref={listRef} className="x-steps__list">
        {steps.map((step, i) => (
          <li
            key={step.tag}
            className="x-step"
            data-step={i}
            data-active={i === active || undefined}
          >
            <p className="x-step__num x-label">
              <b>{String(i + 1).padStart(2, "0")}</b>
              <span>{step.tag}</span>
            </p>
            <h3 className="x-step__q">{step.question}</h3>
            <p className="x-step__a">{step.answer}</p>
            <figure className="x-step__inline x-frame">
              <div
                className="x-frame__view"
                style={{ "--aspect": `${PHONE_ASPECT}` } as CSSProperties}
              >
                <Image
                  src={SHOTS[step.shot].src}
                  width={SHOTS[step.shot].w}
                  height={SHOTS[step.shot].h}
                  sizes="(min-width: 64rem) 1px, 250vw"
                  alt={step.alt}
                  className="x-frame__img"
                  style={cropStyle(step.shot, step.phone.crop)}
                />
                <Pins crop={step.phone.crop} aspect={PHONE_ASPECT} pins={step.phone.pins} />
              </div>
              <Legend pins={step.phone.pins} />
              <figcaption className="x-frame__cap x-label">{caption(step.shot)}</figcaption>
            </figure>
          </li>
        ))}
      </ol>

      <figure className="x-steps__stage x-frame js-only">
        <div className="x-frame__view" style={{ "--aspect": `${STAGE_ASPECT}` } as CSSProperties}>
          {(Object.keys(SHOTS) as ShotId[]).map((shot) => (
            <div key={shot} className="x-stage__shot" data-on={current.shot === shot || undefined}>
              <Image
                src={SHOTS[shot].src}
                width={SHOTS[shot].w}
                height={SHOTS[shot].h}
                sizes="(min-width: 64rem) 120vw, 1px"
                alt={current.shot === shot ? current.alt : ""}
                aria-hidden={current.shot === shot ? undefined : true}
                className="x-frame__img"
                style={cropStyle(shot, cropFor(shot))}
              />
            </div>
          ))}
          <div className="x-stage__pins">
            {steps.map((step, i) => (
              <Pins
                key={step.tag}
                crop={step.stage.crop}
                aspect={STAGE_ASPECT}
                pins={step.stage.pins}
                on={i === active}
              />
            ))}
          </div>
        </div>
        <Legend pins={current.stage.pins} />
        <figcaption className="x-frame__cap x-label">{caption(current.shot)}</figcaption>
      </figure>
    </div>
  );
}
