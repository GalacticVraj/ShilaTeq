"use client";

import { useEffect, useRef, useState } from "react";
import type { Engine, FrameState, PaperRect } from "./engine";
import { LiveQr } from "@/components/kerf/LiveQr";
import { HERO_BLOCK, ageBand, blockPath } from "@/content/sampleYard";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";

/**
 * THE REGISTER — paper → stone → digital identity.
 *
 * The initial state is plain HTML/SVG (the register, the stone face): no
 * WebGL, nothing heavy. WebGL starts only on explicit intent — pressing or
 * dragging the page, tapping or holding it, or the button. The page lifts at
 * once (CSS) and the WebGL sheet takes over the gesture as soon as it is
 * ready. It is thrown off the block, the stone "wets" (CSS), and the one entry
 * that lifted off the page settles onto the block as a printed StoneX label
 * with a real QR.
 *
 * Fallbacks: reduced motion → instant swap; no WebGL / slow start → crossfade;
 * scrolling past without interacting → crossfade (no WebGL); no JS → the static
 * before/after rendered by the server. The button is the keyboard path.
 */

const ROT = (-2.4 * Math.PI) / 180; // keep in sync with --ledger-rot in kerf.css
const COMMIT_AT = 0.5;
const START_TIMEOUT_MS = 1500;

type Mode = "rest" | "pending" | "drag" | "spring" | "commit" | "throw" | "done";

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

const restState = (): FrameState => ({
  p: 0,
  lift: 0,
  grabX: 0,
  grabY: 0,
  offX: 0,
  offY: 0,
  spin: 0,
  alpha: 1,
});

const STATUS =
  "The paper register is gone. Its entry now lives on as KSH-B0001, a sample block with its own identity.";

type Controller = {
  activate(method: string): void;
  restore(): void;
  pointerDown(e: React.PointerEvent): void;
  pointerMove(e: React.PointerEvent): void;
  pointerUp(e: React.PointerEvent): void;
  pointerCancel(): void;
};

export function Register({
  heading,
  ledger,
  stone,
}: {
  heading: React.ReactNode;
  ledger: React.ReactNode;
  /** The block face (server-rendered; real photography slots in here). */
  stone: React.ReactNode;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef<HTMLParagraphElement>(null);
  const ctl = useRef<Controller | null>(null);
  const [identified, setIdentified] = useState(false);

  useEffect(() => {
    const root = rootRef.current!;
    const stage = stageRef.current!;
    const canvas = canvasRef.current!;
    const wrap = wrapRef.current!;
    const ledgerEl = wrap.querySelector<HTMLElement>("[data-ledger]")!;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");

    let engine: Engine | null = null;
    let loading: Promise<boolean> | null = null;
    let failed = false;
    let s = restState();
    let mode: Mode = "rest";
    let done = false; // identified
    let method = "";
    let target = 0;
    let from = 0;
    let t0 = 0;
    let raf = 0;
    let last = 0;
    let dir: [number, number] = [0.3, 1];
    let start: [number, number] = [0, 0];
    let current: [number, number] = [0, 0];
    let pressing = false;
    let moved = false;
    let touchTimer = 0;
    let touchEngaged = false;
    let autoDone = false;
    let flying: Array<{ el: HTMLElement; clone: HTMLElement; anim: Animation }> = [];
    let paperW = 0;

    const cls = (name: string, on: boolean) => root.classList.toggle(name, on);
    const texScale = () => Math.min(window.devicePixelRatio || 1, 2);
    const dpr = () =>
      Math.min(
        window.devicePixelRatio || 1,
        window.matchMedia("(pointer: coarse)").matches ? 1.5 : 2,
      );
    const vibrate = (ms: number) => {
      if (typeof navigator.vibrate === "function") navigator.vibrate(ms);
    };

    // Layout offsets ignore CSS transforms, so the lift never skews the rect.
    const paperRect = (): PaperRect => ({
      cx: wrap.offsetLeft + wrap.offsetWidth / 2,
      cy: wrap.offsetTop + wrap.offsetHeight / 2,
      w: ledgerEl.offsetWidth,
      h: ledgerEl.offsetHeight,
      rot: ROT,
    });

    // ---------- WebGL: only on explicit intent ----------
    const ensureGL = (): Promise<boolean> => {
      if (engine) return Promise.resolve(true);
      if (failed || mq.matches) return Promise.resolve(false);
      loading ??= (async () => {
        try {
          const [{ createEngine }, { paintLedger }] = await Promise.all([
            import("./engine"),
            import("./paint"),
          ]);
          const e = await createEngine(canvas);
          if (!e) throw new Error("WebGL2 unavailable");
          e.resize(stage.clientWidth, stage.clientHeight, dpr());
          const rect = paperRect();
          e.setPaper(await paintLedger(ledgerEl, wrap, texScale()), rect);
          paperW = rect.w;
          engine = e;
          return true;
        } catch {
          failed = true;
          return false;
        }
      })();
      return loading;
    };
    const withTimeout = (p: Promise<boolean>) =>
      Promise.race([p, new Promise<boolean>((r) => setTimeout(() => r(false), START_TIMEOUT_MS))]);
    const onContextLost = () => {
      engine = null;
      failed = true;
      cls("paper-in-gl", false);
    };
    canvas.addEventListener("webglcontextlost", onContextLost);

    // ---------- frame loop ----------
    const loop = (now: number) => {
      const dt = Math.min(64, now - (last || now));
      last = now;
      const t = now - t0;
      let active = true;

      if (mode === "drag") {
        s.p += (target - s.p) * (1 - Math.exp(-dt / 70));
        s.lift += (1 - s.lift) * (1 - Math.exp(-dt / 60));
      } else if (mode === "spring") {
        const k = clamp01(t / 320);
        s.p = from * (1 - easeOut(k));
        s.lift = 1 - easeOut(k);
        if (k >= 1) {
          s = restState();
          mode = "rest";
          cls("paper-in-gl", false);
          cls("is-lifted", false);
          active = false;
        }
      } else if (mode === "commit") {
        const k = clamp01(t / (420 + (1 - from) * 520));
        s.p = from + (1 - from) * easeInOut(k);
        s.lift = Math.max(s.lift, easeOut(k));
        if (k >= 1) startThrow(now);
      } else if (mode === "throw") {
        const k = clamp01(t / 560);
        const dist = Math.hypot(stage.clientWidth, stage.clientHeight) * 0.75;
        s.offX = dir[0] * dist * k * k;
        s.offY = dir[1] * dist * k * k;
        s.spin = (dir[0] >= 0 ? 1 : -1) * 1.5 * k;
        s.alpha = 1 - clamp01((k - 0.6) / 0.4);
        if (k >= 1) {
          mode = "done";
          active = false;
        }
      } else {
        active = false;
      }

      engine?.draw(mode === "done" ? null : s);
      raf = active ? requestAnimationFrame(loop) : 0;
    };

    const run = (next: Mode) => {
      mode = next;
      t0 = performance.now();
      from = s.p;
      if (!raf) {
        last = 0;
        raf = requestAnimationFrame(loop);
      }
    };

    // ---------- identity ----------
    const identify = () => {
      done = true;
      cls("is-identified", true);
      setIdentified(true);
      track("register_crumpled", { method });
    };

    // The entry leaves the paper's clip: overlay clones fly to the label.
    const flyInk = () => {
      const targetEl = codeRef.current;
      const spans = Array.from(wrap.querySelectorAll<HTMLElement>("[data-hero-row] .ink-lift"));
      if (!targetEl || !spans.length) return;
      const sr = stage.getBoundingClientRect();
      const tr = targetEl.getBoundingClientRect();
      const tx = tr.left + tr.width / 2 - sr.left;
      const ty = tr.top + tr.height / 2 - sr.top;
      flying = spans.map((el, i) => {
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        const cx = r.left + r.width / 2 - sr.left;
        const cy = r.top + r.height / 2 - sr.top;
        const clone = document.createElement("span");
        clone.className = "ink-fly";
        clone.setAttribute("aria-hidden", "true");
        clone.textContent = el.textContent;
        clone.style.font = cs.font;
        clone.style.color = cs.color;
        clone.style.left = `${cx}px`;
        clone.style.top = `${cy}px`;
        stage.appendChild(clone);
        el.style.visibility = "hidden";
        const anim = clone.animate(
          [
            { transform: `translate(-50%, -50%) rotate(${ROT}rad) translateY(-3px)`, opacity: 1 },
            {
              transform: `translate(${tx - cx}px, ${ty - cy}px) translate(-50%, -50%) scale(0.5)`,
              opacity: 0,
            },
          ],
          {
            duration: 720,
            delay: i * 25,
            easing: "cubic-bezier(0.65, 0, 0.15, 1)",
            fill: "forwards",
          },
        );
        anim.onfinish = () => clone.remove();
        return { el, clone, anim };
      });
    };

    function startThrow(now: number) {
      mode = "throw";
      t0 = now;
      flyInk();
      cls("is-wet", true);
      window.setTimeout(identify, 120);
      vibrate(12);
    }

    /** No-WebGL path: reduced motion, WebGL unavailable or slow, or scroll-past. */
    const swap = () => {
      cls("is-lifted", false);
      cls("paper-faded", true);
      cls("is-wet", true);
      identify();
    };

    // ---------- gestures ----------
    const grab = (clientX: number, clientY: number) => {
      if (!engine) return false;
      const rect = paperRect();
      const sr = stage.getBoundingClientRect();
      const dx = clientX - sr.left - rect.cx;
      const dy = clientY - sr.top - rect.cy;
      const c = Math.cos(-ROT);
      const sn = Math.sin(-ROT);
      s = restState();
      s.grabX = Math.max(-0.35, Math.min(0.35, (c * dx - sn * dy) / rect.w)) * rect.w;
      s.grabY = Math.max(-0.35, Math.min(0.35, (sn * dx + c * dy) / rect.h)) * rect.h;
      target = 0;
      // Hand the paper to WebGL in the same task as hiding the HTML page.
      engine.draw(s);
      cls("paper-in-gl", true);
      cls("is-lifted", true);
      return true;
    };

    const dragTo = (clientX: number, clientY: number) => {
      const rect = paperRect();
      const dx = clientX - start[0];
      const dy = clientY - start[1];
      const d = Math.hypot(dx, dy);
      const x = d / (Math.hypot(rect.w, rect.h) * 0.55);
      // a little resistance before the paper gives
      target = clamp01(x < 0.2 ? x * 0.4 : 0.08 + (x - 0.2) * 1.15);
      if (d > 24) dir = [dx / d, dy / d];
    };

    const release = () => run(s.p >= COMMIT_AT || target >= COMMIT_AT ? "commit" : "spring");

    /** Plays the whole sequence from a point just off the page's centre. */
    const autoplay = () => {
      const sr = stage.getBoundingClientRect();
      const rect = paperRect();
      if (!grab(sr.left + rect.cx + rect.w * 0.08, sr.top + rect.cy - rect.h * 0.06)) return false;
      dir = [0.3, 1];
      run("commit");
      return true;
    };

    /** Button or tap: start WebGL now, then play; fall back to the swap. */
    const activate = async (how: string) => {
      if (mode !== "rest" || done) return;
      method = how;
      if (mq.matches) return swap();
      cls("is-lifted", true);
      mode = "pending";
      const ok = await withTimeout(ensureGL());
      if (done) return;
      mode = "rest";
      if (!ok || !autoplay()) swap();
    };

    const restore = () => {
      flying.forEach(({ el, clone, anim }) => {
        anim.cancel();
        clone.remove();
        el.style.visibility = "";
      });
      flying = [];
      cancelAnimationFrame(raf);
      raf = 0;
      mode = "rest";
      done = false;
      s = restState();
      engine?.draw(null);
      for (const c of ["paper-in-gl", "is-lifted", "paper-faded", "is-wet", "is-identified"]) {
        cls(c, false);
      }
      setIdentified(false);
    };

    // ---------- mouse / pen (React handlers call into these) ----------
    ctl.current = {
      activate: (how) => void activate(how),
      restore,
      pointerDown(e) {
        if (e.pointerType === "touch" || e.button !== 0 || done || mode !== "rest") return;
        e.preventDefault();
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        start = current = [e.clientX, e.clientY];
        moved = false;
        pressing = true;
        method = "drag";
        cls("is-grabbing", true);
        if (mq.matches) return; // becomes the swap on pointerup
        cls("is-lifted", true);
        if (engine) {
          if (grab(start[0], start[1])) run("drag");
          return;
        }
        // First press: start WebGL; the drag continues once it is ready.
        mode = "pending";
        void withTimeout(ensureGL()).then((ok) => {
          if (done || mode !== "pending") return;
          mode = "rest";
          if (!ok) {
            if (!pressing) swap();
            return; // still pressing: pointerup swaps
          }
          if (pressing && grab(start[0], start[1])) {
            run("drag");
            dragTo(current[0], current[1]);
          } else if (!pressing && !autoplay()) swap();
        });
      },
      pointerMove(e) {
        if (e.pointerType === "touch" || !pressing) return;
        current = [e.clientX, e.clientY];
        if (Math.hypot(current[0] - start[0], current[1] - start[1]) > 6) moved = true;
        if (mode === "drag") dragTo(current[0], current[1]);
      },
      pointerUp(e) {
        if (e.pointerType === "touch") return;
        pressing = false;
        cls("is-grabbing", false);
        if (mode === "drag") {
          if (moved) return release();
          method = "click";
          dir = [0.3, 1];
          run("commit");
        } else if (mode === "rest" && !done) {
          swap(); // reduced motion, or WebGL unavailable
        } // "pending": resolved when WebGL is ready (or times out)
      },
      pointerCancel() {
        pressing = false;
        cls("is-grabbing", false);
        if (mode === "drag") run("spring");
        else if (mode === "rest") cls("is-lifted", false);
      },
    };

    // ---------- touch: tap = play; press-and-hold then drag = scrub ----------
    const onTouchStart = (e: TouchEvent) => {
      if (done || mode !== "rest" || e.touches.length > 1) return;
      start = current = [e.touches[0].clientX, e.touches[0].clientY];
      moved = false;
      pressing = true;
      touchEngaged = false;
      // Touching the paper itself is the explicit intent: warm WebGL up now.
      if (!mq.matches) void ensureGL();
      touchTimer = window.setTimeout(() => {
        if (!pressing || moved || mq.matches || done) return;
        const engage = () => {
          if (!pressing || moved || done || mode !== "rest") return;
          if (grab(start[0], start[1])) {
            touchEngaged = true;
            method = "hold";
            vibrate(10);
            run("drag");
          }
        };
        if (engine) engage();
        else void ensureGL().then((ok) => ok && engage());
      }, 260);
    };
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      current = [t.clientX, t.clientY];
      if (touchEngaged) {
        e.preventDefault(); // the page holds still while you hold the paper
        dragTo(t.clientX, t.clientY);
      } else if (Math.hypot(t.clientX - start[0], t.clientY - start[1]) > 8) {
        moved = true;
        clearTimeout(touchTimer);
      }
    };
    const onTouchEnd = () => {
      pressing = false;
      clearTimeout(touchTimer);
      if (touchEngaged) {
        touchEngaged = false;
        release();
      } else if (!moved && !done && mode === "rest") void activate("tap");
    };
    const onTouchCancel = () => {
      pressing = false;
      clearTimeout(touchTimer);
      if (touchEngaged) {
        touchEngaged = false;
        run("spring");
      }
    };
    const noMenu = (e: Event) => e.preventDefault();
    wrap.addEventListener("touchstart", onTouchStart, { passive: true });
    wrap.addEventListener("touchmove", onTouchMove, { passive: false });
    wrap.addEventListener("touchend", onTouchEnd);
    wrap.addEventListener("touchcancel", onTouchCancel);
    wrap.addEventListener("contextmenu", noMenu);

    // ---------- resize (only matters once WebGL exists) ----------
    let resizeTimer = 0;
    const ro = new ResizeObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(async () => {
        if (!engine) return;
        engine.resize(stage.clientWidth, stage.clientHeight, dpr());
        const rect = paperRect();
        if (mode === "rest" && !done && Math.abs(rect.w - paperW) > 2) {
          const { paintLedger } = await import("./paint");
          engine?.setPaper(await paintLedger(ledgerEl, wrap, texScale()), rect);
          paperW = rect.w;
        } else engine.setPaperRect(rect);
        if (!raf) engine?.draw(null);
      }, 150);
    });
    ro.observe(stage);

    // Nobody has to perform the gesture: scrolling past completes the story,
    // without starting WebGL.
    let wasVisible = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.5) wasVisible = true;
        else if (wasVisible && entry.boundingClientRect.top < 0 && !autoDone) {
          autoDone = true;
          if (!done && mode === "rest") {
            method = "scroll";
            swap();
          }
        }
      },
      { threshold: [0, 0.5] },
    );
    io.observe(stage);

    return () => {
      clearTimeout(resizeTimer);
      clearTimeout(touchTimer);
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener("webglcontextlost", onContextLost);
      wrap.removeEventListener("touchstart", onTouchStart);
      wrap.removeEventListener("touchmove", onTouchMove);
      wrap.removeEventListener("touchend", onTouchEnd);
      wrap.removeEventListener("touchcancel", onTouchCancel);
      wrap.removeEventListener("contextmenu", noMenu);
      flying.forEach(({ anim, clone }) => {
        anim.cancel();
        clone.remove();
      });
      engine?.dispose();
      ctl.current = null;
    };
  }, []);

  return (
    // The root's state classes are toggled imperatively (mid-animation), so
    // React must never re-render its className.
    <div ref={rootRef} className="grid gap-y-10 lg:grid-cols-12 lg:gap-x-10">
      {/* Copy + controls */}
      <div className="flex flex-col justify-center lg:col-span-5">
        {heading}
        <div className="js-only mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
          <button
            type="button"
            onClick={() => (identified ? ctl.current?.restore() : ctl.current?.activate("button"))}
            aria-describedby="register-hint"
            className="bg-forest-800 text-ivory-50 hover:bg-forest-700 inline-flex min-h-12 items-center px-6 text-[1.0625rem] font-semibold transition-colors duration-200"
          >
            {identified ? "Restore the register" : "Crumple the register"}
          </button>
          <a
            href="#stonex"
            className="text-charcoal-900 decoration-oxide-600 inline-flex min-h-12 items-center text-[1.0625rem] font-semibold underline decoration-2 underline-offset-[6px]"
          >
            See StoneX ↓
          </a>
        </div>
        <p id="register-hint" className="js-only text-charcoal-500 mt-3 font-mono text-[0.8125rem]">
          {identified ? (
            "The page is gone. The entry is not."
          ) : (
            <>
              <span className="hint-fine">
                Crumples the paper register on the right. Or drag the page itself.
              </span>
              <span className="hint-coarse">
                Crumples the paper register. Or tap the page, or press and hold it.
              </span>
            </>
          )}
        </p>
        <div aria-live="polite" className="js-only mt-5">
          {identified ? (
            <p className="text-charcoal-700 text-[0.9375rem]">
              {STATUS}{" "}
              <a
                href={blockPath(HERO_BLOCK.code)}
                className="text-forest-700 font-semibold underline underline-offset-4"
              >
                See what a scan shows
              </a>
            </p>
          ) : null}
        </div>
      </div>

      {/* The stage: a sawn block face, the register on top */}
      <div className="relative lg:col-span-7">
        <div
          aria-hidden="true"
          className="kerf-line absolute -top-6 -bottom-6 -left-5 hidden w-px lg:block"
        />
        <div
          ref={stageRef}
          className="stage border-charcoal-900/15 relative aspect-[4/5] overflow-hidden border sm:aspect-[6/5] lg:aspect-[10/9]"
        >
          {stone}
          <div aria-hidden="true" className="sweep pointer-events-none absolute inset-0" />
          <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="stage-canvas pointer-events-none absolute inset-0 size-full"
          />
          <div
            ref={wrapRef}
            className="ledger-wrap absolute top-[6%] left-[8%] w-[84%] sm:left-[13%] sm:w-[60%] lg:top-[7%] lg:left-[10%] lg:w-[58%]"
            onPointerDown={(e) => ctl.current?.pointerDown(e)}
            onPointerMove={(e) => ctl.current?.pointerMove(e)}
            onPointerUp={(e) => ctl.current?.pointerUp(e)}
            onPointerCancel={() => ctl.current?.pointerCancel()}
          >
            {ledger}
          </div>

          {/* Identity, laid onto the stone */}
          <div className="identity identity-overlay pointer-events-none absolute inset-0">
            <div className="label-card bg-label absolute bottom-[7%] left-[6%] w-[34%] p-[2.2%] shadow-[0_1px_1px_rgb(0_0_0/0.15),0_10px_24px_rgb(20_20_15/0.22)] sm:w-[25%]">
              <LiveQr
                path={blockPath(HERO_BLOCK.code)}
                enabled={identified}
                label={`QR code for sample block ${HERO_BLOCK.code}. It opens the block's public card.`}
                className="aspect-square w-full [&_svg]:block [&_svg]:size-full"
              />
              <p
                ref={codeRef}
                className="code-type text-charcoal-950 mt-[6%] font-mono text-[clamp(0.7rem,1.5vw,1rem)] leading-none font-semibold"
              >
                {HERO_BLOCK.code}
              </p>
              <p className="text-charcoal-700 mt-1 text-[clamp(0.55rem,1vw,0.75rem)] leading-tight">
                {HERO_BLOCK.stone} · {HERO_BLOCK.type}
              </p>
              <p className="text-charcoal-500 mt-1 flex justify-between font-mono text-[clamp(0.5rem,0.85vw,0.65rem)] leading-none tracking-wide uppercase">
                <span>Grade {HERO_BLOCK.grade}</span>
                <span>Sample</span>
              </p>
            </div>
            {/* Leader lines from the label to each attribute (user units, so dashes stay whole) */}
            <svg
              className="absolute inset-0 hidden size-full lg:block"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {ATTR_TOPS.map((top, i) => (
                <line
                  key={top}
                  className="leader"
                  pathLength={100}
                  x1={31.5}
                  y1={64 + i * 4}
                  x2={57}
                  y2={top + 3.5}
                  stroke="var(--color-forest-700)"
                  strokeWidth={0.18}
                />
              ))}
            </svg>
            <Attributes className="hidden lg:block" card />
          </div>
        </div>
        {/* Below desktop + no-JS: the after-state as a list under the stage */}
        <div className="identity identity-list mt-6 lg:hidden">
          <p className="eyebrow nojs-only">After: the same block, with an identity</p>
          <p className="nojs-only mt-2 font-mono text-lg font-semibold">{HERO_BLOCK.code}</p>
          <Attributes className="mt-3 space-y-4" />
        </div>
      </div>
    </div>
  );
}

/** Vertical positions (% of the stage) of the attribute cards on desktop. */
const ATTR_TOPS = [20, 37, 54];

function Attributes({ className, card = false }: { className?: string; card?: boolean }) {
  const items = [
    {
      k: "What it is",
      v: `${HERO_BLOCK.stone} ${HERO_BLOCK.type.toLowerCase()}, grade ${HERO_BLOCK.grade}`,
      sub: HERO_BLOCK.size,
    },
    { k: "What it cost", v: "Cost basis carried from the day it arrived" },
    {
      k: "How long it has waited",
      v: `${HERO_BLOCK.ageDays} days`,
      chip: ageBand(HERO_BLOCK.ageDays),
    },
  ];
  return (
    <ul className={className}>
      {items.map((a, i) => (
        <li
          key={a.k}
          style={card ? { top: `${ATTR_TOPS[i]}%` } : undefined}
          className={cn(
            "attr",
            card &&
              "bg-ivory-50/92 border-charcoal-900/10 absolute right-[5%] w-[38%] border px-[2.2%] py-[1.6%]",
          )}
        >
          <p className="eyebrow">{a.k}</p>
          <p className="text-charcoal-900 mt-1 flex flex-wrap items-center gap-2 text-[0.9375rem] leading-snug">
            {a.v}
            {a.chip ? (
              <span className="border-age-amber text-age-amber border px-1.5 py-0.5 font-mono text-[0.6875rem] tracking-wide uppercase">
                {a.chip} · 90–180 days
              </span>
            ) : null}
          </p>
          {a.sub ? <p className="text-charcoal-700 font-mono text-[0.8125rem]">{a.sub}</p> : null}
        </li>
      ))}
    </ul>
  );
}
