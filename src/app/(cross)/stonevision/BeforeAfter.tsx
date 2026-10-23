"use client";

import { useState, type CSSProperties, type ImgHTMLAttributes, type ReactNode } from "react";

type Img = ImgHTMLAttributes<HTMLImageElement>;

/**
 * A photo and StoneVision's result, split by a handle the visitor drags. The control is a native
 * range input laid over the picture, so keys, touch and screen readers work as they do anywhere.
 * `intro`: the split sweeps across once on arrival (CSS, never with reduced motion), until touched.
 * `children`: labels drawn over the result (they show on the result's side only).
 */
export default function BeforeAfter({
  before,
  after,
  alt,
  w,
  h,
  start = 50,
  intro = false,
  children,
}: {
  before: Img;
  after: Img;
  alt: string;
  w: number;
  h: number;
  start?: number;
  intro?: boolean;
  children?: ReactNode;
}) {
  const [at, setAt] = useState(start);
  const [touched, setTouched] = useState(false);
  return (
    <div
      className="v-ba"
      data-intro={intro && !touched ? "" : undefined}
      style={{ aspectRatio: `${w} / ${h}`, "--at": `${at}%` } as CSSProperties}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img {...after} alt={alt} className="v-ba__img" />
      <div className="v-ba__labels" aria-hidden="true">
        {children}
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img {...before} alt="" className="v-ba__img v-ba__before" />
      <span className="v-ba__tag v-ba__tag--before" aria-hidden="true">
        Their photo
      </span>
      <span className="v-ba__tag v-ba__tag--after" aria-hidden="true">
        With StoneVision
      </span>
      <span className="v-ba__handle" aria-hidden="true">
        <span>‹ ›</span>
      </span>
      <input
        type="range"
        min={0}
        max={100}
        value={at}
        onPointerDown={() => setTouched(true)}
        onKeyDown={() => setTouched(true)}
        onChange={(e) => setAt(Number(e.target.value))}
        className="v-ba__range"
        aria-label="Drag to compare the room photo and StoneVision’s result"
      />
    </div>
  );
}
