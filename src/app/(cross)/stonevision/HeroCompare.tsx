"use client";

import { useState, type ImgHTMLAttributes } from "react";
import BeforeAfter from "./BeforeAfter";

type Img = ImgHTMLAttributes<HTMLImageElement>;
export type HeroStone = { name: string; type: string; swatch: string; after: Img };

/**
 * The hero: one room, before and after, and a row of stones to lay on it. Every result was made by
 * StoneVision beforehand, so a tap changes the floor at once (nothing to download).
 */
export default function HeroCompare({ before, stones }: { before: Img; stones: HeroStone[] }) {
  const [i, setI] = useState(0);
  const st = stones[i];
  return (
    <>
      <BeforeAfter
        before={before}
        afters={stones.map((s) => s.after)}
        shown={i}
        alt={`An open hall with its wooden floor replaced by ${st.name} slabs, laid by StoneVision, with the window light kept on the stone.`}
        w={1600}
        h={1066}
        start={38}
        intro
      >
        <span className="v-chip" data-end="" style={{ left: "97%", top: "83%" }}>
          {st.name} · its own slab photo
        </span>
        <span className="v-chip" style={{ left: "66%", top: "61%" }}>
          Window light, kept
        </span>
      </BeforeAfter>
      <div className="v-swap" role="group" aria-label="Lay another stone on this floor">
        {stones.map((s, k) => (
          <button
            key={s.name}
            type="button"
            className="v-swap__stone"
            aria-pressed={k === i}
            onClick={() => setI(k)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.swatch} alt="" />
            <span>
              <b>{s.name}</b>
              <small>{s.type}</small>
            </span>
          </button>
        ))}
      </div>
    </>
  );
}
