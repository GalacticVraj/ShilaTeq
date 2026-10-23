"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The hero film: a silent loop laid over its poster. The poster is the loop's
 * first frame, so the hand-over is invisible. It plays only while at least a
 * fifth of it is on screen and always stops when it leaves; with reduced motion
 * or Save-Data it never starts by itself, only from its visible Pause / Play
 * control (WCAG 2.2.2).
 */
export function FilmLoop({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  // The visitor's pause wins over "play while visible".
  const held = useRef(false);
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
      ?.saveData;
    // A calm setting never starts or resumes the film; it still stops off screen.
    const calm = matchMedia("(prefers-reduced-motion: reduce)").matches || !!saveData;
    // Autoplay can be refused (an iPhone in Low Power Mode): then the visitor's first
    // tap anywhere starts it, as a tap is allowed to.
    const onTap = () => {
      if (!held.current && v.paused) v.play().catch(() => {});
    };
    let waiting = false;
    const start = () =>
      v.play().catch(() => {
        if (waiting) return;
        waiting = true;
        document.addEventListener("touchend", onTap, { once: true, passive: true });
        document.addEventListener("click", onTap, { once: true });
      });
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.intersectionRatio < 0.2) v.pause();
        else if (!calm && !held.current) start();
      },
      { threshold: [0, 0.2] },
    );
    io.observe(v);
    return () => {
      io.disconnect();
      document.removeEventListener("touchend", onTap);
      document.removeEventListener("click", onTap);
    };
  }, []);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    held.current = !v.paused;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };

  return (
    <>
      <video
        ref={ref}
        className="f-film__media f-film__video"
        data-on={started || undefined}
        src={src}
        loop
        muted
        playsInline
        preload="none"
        aria-hidden="true"
        tabIndex={-1}
        onPlaying={() => {
          setStarted(true);
          setPlaying(true);
        }}
        onPause={() => setPlaying(false)}
      />
      <button type="button" className="f-film__toggle x-label js-only" onClick={toggle}>
        {playing ? "Pause" : "Play"}
        <span className="sr-only"> film</span>
      </button>
    </>
  );
}
