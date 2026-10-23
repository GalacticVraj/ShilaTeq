"use client";

import { useState, type ImgHTMLAttributes, type ReactNode } from "react";

type Shot = { query: string; note: string; img: ImgHTMLAttributes<HTMLImageElement>; alt: string; labels: ReactNode };

/** Two real searches in the Showroom, one tab each: the query, what it shows, how it was read. */
export default function SearchShots({ shots }: { shots: Shot[] }) {
  const [on, setOn] = useState(0);
  const s = shots[on];
  return (
    <div className="s-search">
      <div className="s-search__tabs" role="tablist" aria-label="Searches in the Showroom">
        {shots.map((x, i) => (
          <button
            key={x.query}
            type="button"
            role="tab"
            id={`s-search-tab-${i}`}
            aria-selected={i === on}
            aria-controls="s-search-panel"
            onClick={() => setOn(i)}
          >
            <span className="s-search__q">“{x.query}”</span>
            <span className="s-search__note">{x.note}</span>
          </button>
        ))}
      </div>
      <div id="s-search-panel" role="tabpanel" aria-labelledby={`s-search-tab-${on}`} className="s-frame s-frame--browser">
        <span className="s-frame__bar" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <div className="s-frame__screen" key={s.query}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img {...s.img} alt={s.alt} />
          {s.labels}
        </div>
      </div>
    </div>
  );
}
