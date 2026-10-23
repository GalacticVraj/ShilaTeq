"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Plays the hero film and names the part on screen (data-scene on its box), so the
 * scene index follows the footage. The film (public/film/stone-film.mp4) is the
 * original's 0–10.2 s and 21.15 s to the end, cut with ffmpeg: the seconds between
 * hold a real client's dashboard and a counter/walls scene StoneVision doesn't do,
 * and are not in the file at all.
 *
 * On a first visit the intro covers the film for ~2.65 s, so if the film has
 * started under it, it starts again from the beginning, once, as the intro opens
 * (or is skipped), so the opening is never missed.
 *
 * It also places the film's own copy of the hero's marble (.c-film__stone) exactly
 * under the hero's ground (--fx, --fy, --gw, --gh), so the film can blend into the
 * stone: the film is its own compositing group, so it cannot blend with the ground
 * itself. Layout offsets ignore transforms, so the strip transition never moves it.
 */
// [end of the scene in the film's own seconds, scene]
const SCENES = [
  [5.4, "block"], // every slab has a story; the block
  [9.25, "slabs"], // every cut counts
  [9.5, "cut"], // the slab turns to face us: the red cut is drawn
  [10.2, "record"],
  [Infinity, "end"], // the slabs mend; ShilaTeq
] as const;
// The intro's opening onto the hero, or its skip (chapters.css), and the intro.
const INTRO_CLEARS = ["c-intro-out", "c-intro-skip"];
const INTRO = ".c-intro";

export function FilmScenes({ className, children }: { className: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const box = ref.current;
    const v = box?.querySelector("video");
    if (!box || !v) return;
    const mark = () => {
      const t = v.currentTime;
      const [, scene] = SCENES.find(([end]) => t < end)!;
      if (box.dataset.scene !== scene) box.dataset.scene = scene;
    };
    // Checked on every frame shown where supported, and on timeupdate and seeked too.
    const rvfc = "requestVideoFrameCallback" in v;
    let id = 0;
    const each = () => {
      mark();
      id = v.requestVideoFrameCallback(each);
    };
    if (rvfc) id = v.requestVideoFrameCallback(each);
    v.addEventListener("timeupdate", mark);
    v.addEventListener("seeked", mark);
    const intro =
      document.documentElement.dataset.intro === "play" ? document.querySelector(INTRO) : null;
    const restart = (e: Event) => {
      const own = e.target === intro && INTRO_CLEARS.includes((e as AnimationEvent).animationName);
      if (own && v.currentTime > 0.2) v.currentTime = 0;
    };
    intro?.addEventListener("animationstart", restart);

    // The film's marble, under the ground's.
    const film = box.querySelector<HTMLElement>(".c-film");
    const ground = box.querySelector<HTMLElement>(".c-hero__ground");
    const place = () => {
      if (!film || !ground) return;
      let x = 0;
      let y = 0;
      for (
        let el: HTMLElement | null = film;
        el && el !== box;
        el = el.offsetParent as HTMLElement
      ) {
        x += el.offsetLeft;
        y += el.offsetTop;
      }
      box.style.setProperty("--fx", `${x}px`);
      box.style.setProperty("--fy", `${y}px`);
      box.style.setProperty("--gw", `${ground.offsetWidth}px`);
      box.style.setProperty("--gh", `${ground.offsetHeight}px`);
      box.dataset.aligned = "";
    };
    place();
    const ro = new ResizeObserver(place);
    for (const el of [box, film, box.querySelector(".c-hero__title")]) if (el) ro.observe(el);
    document.fonts?.ready.then(place);

    return () => {
      if (rvfc) v.cancelVideoFrameCallback(id);
      v.removeEventListener("timeupdate", mark);
      v.removeEventListener("seeked", mark);
      intro?.removeEventListener("animationstart", restart);
      ro.disconnect();
    };
  }, []);

  return (
    <div ref={ref} className={className} data-scene="block">
      {children}
    </div>
  );
}
