"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type PointerEvent,
} from "react";
import { VT } from "@/vendor/stonex-vision/components/vision/visionText.js";
import { DEMO_ROOMS, DEMO_STONES, loadStoneImage, thumb, type DemoStone } from "./demo";
import { PEOPLE } from "@/components/cross/Contact";

// The way on, once the visitor has seen their stone laid: talk to us about their own yard.
const waYard = (stone: string) =>
  `https://wa.me/${PEOPLE[0].number}?text=${encodeURIComponent(`Hi ShilaTeq, I just tried StoneVision with ${stone}. I'd like it for my yard's slabs.`)}`;

// The parts of StoneX's VisionSession state this screen reads (session.js INITIAL).
type SvState = {
  phase: string;
  stage: string | null;
  decoding: boolean;
  gpuLost: boolean;
  pendingTap: boolean;
  autoFound: boolean;
  photo: { url: string | null; width: number; height: number } | null;
  mask: { coverage: number } | null;
  floorCheck: { ask: string } | null;
  tryAnother: { at: number; of: number } | null; // the first selection's other shapes: the one shown, of how many
  taps: { label: string; x: number; y: number; kind?: string }[]; // kind 'stroke': a brush stroke
  modelLoad: { loaded: number; total: number } | null;
  segmenter: { id: string } | null; // the floor finder, once loaded
  error: { code: string; kept?: boolean } | null;
};
type Floor = { width: number; height: number; data: Uint8Array };
type Session = {
  start(): Promise<unknown>;
  loadPhoto(file: Blob, opts?: { floor?: Floor | null }): Promise<unknown>;
  setStone(stone: DemoStone, load: typeof loadStoneImage): Promise<unknown>;
  tap(label: "pos" | "neg", x: number, y: number): Promise<unknown>;
  undo(): Promise<unknown>;
  reset(): Promise<unknown>;
  brush(label: "pos" | "neg", points: number[][], radius: number): Promise<unknown>;
  confirmFloor(): Promise<unknown>;
  rejectFloor(): Promise<unknown>;
  tryAnother(): Promise<unknown>;
  exportImage(o?: { caption?: boolean }): Promise<Blob>;
  dispose(): Promise<unknown>;
};
const STAGES = VT.stages as Record<string, string>;
const ERRORS = VT.errors as Record<string, string>;
const FLOOR_CHECK = VT.floorCheck as Record<string, string>;
const TAP_SLOP = 10; // px a press may wander and still be a tap (more is a drag: never a mark)
const BRUSH_CSS_PX = 18; // the brush's radius on screen: a fingertip (as in StoneX)
const isLaid = (st: SvState | null) => (st?.mask?.coverage || 0) > 0 && !st?.floorCheck;
const reduced = () =>
  typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * StoneVision, live: StoneX's own engine (src/vendor/stonex-vision) on two demo rooms and two demo
 * stones, or on a photo of the visitor's own (twice). The model downloads only when asked for; the
 * photo never leaves the browser. Around the engine, only presentation: real download progress, a
 * scan while it reads the room, a wipe when the stone is laid, a crossfade when the stone changes.
 */
/**
 * A demo room's floor as the model found it beforehand (white = floor), laid at once on every phone, iPhones
 * (which run without the model) included. None (it didn't load): the engine looks for the floor itself.
 */
async function loadFloor(url: string): Promise<Floor | null> {
  try {
    const img = await createImageBitmap(await (await fetch(url)).blob());
    const c = document.createElement("canvas");
    c.width = img.width;
    c.height = img.height;
    const ctx = c.getContext("2d")!;
    ctx.drawImage(img, 0, 0);
    const px = ctx.getImageData(0, 0, c.width, c.height).data;
    const data = new Uint8Array(c.width * c.height);
    for (let i = 0; i < data.length; i++) data[i] = px[i * 4] > 127 ? 1 : 0;
    img.close();
    return { width: c.width, height: c.height, data };
  } catch {
    return null;
  }
}

export default function StoneVisionDemo() {
  const stageRef = useRef<HTMLDivElement>(null);
  const holder = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const session = useRef<Session | null>(null);
  const starting = useRef<Promise<Session> | null>(null);
  const press = useRef<{ id: number; x: number; y: number } | null>(null);
  // the brush picked up (StoneX's Paint floor / Erase) and the stroke being painted, in render px
  const [brush, setBrush] = useState<"pos" | "neg" | null>(null);
  const [stroke, setStroke] = useState<{ id: number; points: number[][]; radius: number } | null>(
    null,
  );
  const strokeRef = useRef<{ id: number; points: number[][]; radius: number } | null>(null);
  const revealed = useRef<string | null>(null); // the photo whose stone was last revealed
  const [s, setS] = useState<SvState | null>(null);
  const [begun, setBegun] = useState(false); // the visitor has done something (picked a room, a stone, their photo)
  // Until the demo has run itself on the first room, its finished picture covers the stage: no wait is ever seen.
  const [ghost, setGhost] = useState(true);
  const ghostRef = useRef(true);
  const unGhost = () => {
    ghostRef.current = false;
    setGhost(false);
  };
  const [room, setRoom] = useState<string>(DEMO_ROOMS[0].id);
  const [stone, setStone] = useState<DemoStone>(DEMO_STONES[0]);
  const [compare, setCompare] = useState<number | null>(null);
  const [mode, setMode] = useState<"add" | "remove">("add");
  const [saving, setSaving] = useState(false);
  // the photo over the stage once the floor is found; `go`: the stone is ready, wipe it away
  const [reveal, setReveal] = useState<{ url: string; go: boolean } | null>(null);
  const [fade, setFade] = useState<{ url: string; out: boolean } | null>(null); // the stone before, fading

  // Each state the engine reports. The first time a photo's floor is found, the photo itself covers the
  // stage (so nothing half-made shows) and wipes away once the stone is fully laid.
  const onChange = (st: SvState) => {
    setS(st);
    const url = st.photo?.url;
    // (an error ends the wait too: the cover never stays over the picture; a demo room's ready-made floor
    // is laid before the model has read the photo, its picture finished while the room is still being read)
    const ready =
      (st.phase === "ready" && !st.stage) ||
      !!st.error ||
      (st.phase === "preparing" && st.stage === "analyse" && isLaid(st));
    if (ghostRef.current) {
      // the run on its own: no wipe; the cover lifts once the live picture is the finished one
      if (url) revealed.current = url;
      if (url && isLaid(st) && ready) unGhost();
      else if (st.error) unGhost();
      return;
    }
    if (url && isLaid(st) && revealed.current !== url) {
      revealed.current = url;
      if (!reduced()) setReveal({ url, go: ready });
    } else if (ready) setReveal((r) => (r && !r.go ? { ...r, go: true } : r));
  };

  // The engine, once: its canvas, its session (which starts downloading the floor finder), the stone.
  const ensure = () =>
    (starting.current ??= (async () => {
      const { VisionSession } = await import("@/vendor/stonex-vision/lib/vision/session.js");
      const c = document.createElement("canvas");
      c.className = "v-demo__canvas";
      holder.current!.appendChild(c);
      canvas.current = c;
      // (its JSDoc predates autoFloor, which the constructor takes)
      const Engine = VisionSession as unknown as new (o: object) => Session;
      const ss = new Engine({
        canvas: c,
        autoFloor: true,
        onChange: (st: unknown) => onChange(st as SvState),
      });
      session.current = ss;
      ss.start();
      ss.setStone(stone, loadStoneImage);
      if (process.env.NODE_ENV === "development" && location.search.includes("bake")) {
        (window as unknown as { __sv: Session }).__sv = ss; // dev only: the page's stills are made with it
      }
      return ss;
    })());

  // On a phone the controls are under the picture: bring the picture back into view.
  const showStage = () => {
    const el = stageRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (r.top < 0 || r.bottom > innerHeight)
      el.scrollIntoView({ behavior: reduced() ? "auto" : "smooth", block: "center" });
  };
  const fresh = () => {
    setCompare(null);
    setMode("add");
    setBrush(null);
    setFade(null);
    showStage();
  };
  // `own`: the demo running itself (nothing on screen changes, the page doesn't move)
  const openRoom = async (id: string, own = false) => {
    if (!own) {
      setBegun(true);
      unGhost();
      fresh();
    }
    setRoom(id);
    const r = DEMO_ROOMS.find((x) => x.id === id)!;
    const ss = await ensure();
    const [blob, floor] = await Promise.all([
      fetch(r.src).then((x) => x.blob()),
      loadFloor(r.floor),
    ]);
    await ss.loadPhoto(new File([blob], `${r.id}.jpg`, { type: "image/jpeg" }), { floor });
  };
  useEffect(() => {
    // The floor finder (~27 MB, kept by the browser after the first visit) starts downloading as soon as
    // the page has loaded, and the demo runs itself on the first room when it comes near the screen: by the
    // time a visitor reaches it, it is live. Only a browser set to save data waits to be asked.
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
      ?.saveData;
    let live = true;
    const warm = () => {
      if (live && holder.current && !saveData) ensure();
    };
    if (document.readyState === "complete") warm();
    else addEventListener("load", warm, { once: true });
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting || saveData) return;
        io.disconnect();
        if (ghostRef.current) openRoom(DEMO_ROOMS[0].id, true);
      },
      { rootMargin: "100% 0px" },
    );
    if (stageRef.current) io.observe(stageRef.current);
    return () => {
      live = false;
      io.disconnect();
      removeEventListener("load", warm);
      session.current?.dispose();
      session.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- once, on mount
  }, []);

  const openOwn = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setBegun(true);
    unGhost();
    setRoom("own");
    fresh();
    const ss = await ensure();
    await ss.loadPhoto(file);
  };
  // Another stone on the same floor: the one on screen fades out over the new one once it is laid.
  const pickStone = async (st: DemoStone) => {
    if (st.slabId === stone.slabId) return;
    setBegun(true);
    if (ghostRef.current && !isLaid(s)) unGhost(); // its cover shows the first stone: show the live one
    setStone(st);
    setCompare(null);
    showStage();
    const ss = session.current;
    if (!ss) return;
    if (isLaid(s) && !reduced()) {
      try {
        const snap = URL.createObjectURL(await ss.exportImage({ caption: false }));
        setFade({ url: snap, out: false });
      } catch {
        /* no snapshot: the stone simply changes */
      }
    }
    await ss.setStone(st, loadStoneImage);
    setFade((f) => (f ? { ...f, out: true } : f));
    setTimeout(() => setFade(null), 1200); // the fade's own end, if its transition never runs
  };
  const save = async () => {
    if (!session.current || saving) return;
    setSaving(true);
    try {
      const blob = await session.current.exportImage();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `stonevision-${stone.name.toLowerCase().replace(/\s+/g, "-")}.jpg`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    } finally {
      setSaving(false);
    }
  };

  const hasPhoto = !!s?.photo;
  const busy = !!s && (s.phase === "working" || s.phase === "preparing" || s.decoding);
  const hasFloor = (s?.mask?.coverage || 0) > 0;
  const laid = isLaid(s);
  const W = s?.photo?.width || 3,
    H = s?.photo?.height || 2;
  // Real progress only: the model's bytes while it downloads; otherwise the step, named.
  const progress =
    s?.stage === "model" && s.modelLoad?.total ? s.modelLoad.loaded / s.modelLoad.total : null;
  const stageText = s?.gpuLost
    ? VT.gpuRestoring
    : s?.decoding
      ? STAGES.photo
      : busy && s?.stage
        ? STAGES[s.stage] + (progress != null ? ` ${Math.floor(progress * 100)}%` : "")
        : null;
  const prompt =
    !s || !hasPhoto || ghost || compare != null || s.phase === "error"
      ? null
      : stageText ||
        (s.floorCheck
          ? VT.floorCheck.prompt
          : brush
            ? brush === "neg"
              ? VT.paintRemoveHint
              : VT.paintAddHint
            : !hasFloor
              ? VT.tapFloor
              : mode === "remove"
                ? VT.removeHint
                : null);
  // The engine reads the room (its long step): a scan line passes over the photo meanwhile.
  const scanning =
    !ghost && busy && (s?.stage === "analyse" || s?.stage === "floor" || s?.stage === "room");
  // "Try another": the model's next shape for the first selection, with how many there are (as in StoneX)
  const another = s?.tryAnother;
  const anotherButton = another && (
    <button type="button" onClick={() => session.current?.tryAnother()} disabled={busy}>
      {VT.tryAnother} <span aria-hidden="true">· {VT.shapeOf(another.at, another.of)}</span>
      <span className="sr-only">({VT.shapeShown(another.at, another.of)})</span>
    </button>
  );
  const preview = DEMO_ROOMS.find((r) => r.id === room) ?? DEMO_ROOMS[0];

  const toPx = (e: PointerEvent) => {
    const r = canvas.current!.getBoundingClientRect();
    return [
      ((e.clientX - r.left) / r.width) * canvas.current!.width,
      ((e.clientY - r.top) / r.height) * canvas.current!.height,
    ];
  };
  const moveSplit = (e: PointerEvent, pressed = false) => {
    if (compare == null || !(pressed || e.buttons || e.pointerType === "touch")) return;
    const r = canvas.current!.getBoundingClientRect();
    setCompare(Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)));
  };

  return (
    <div className="v-demo" data-state={laid ? "laid" : hasPhoto ? "photo" : "none"}>
      <div
        ref={stageRef}
        className="v-demo__stage"
        style={{ aspectRatio: `${W} / ${H}`, "--ar": W / H } as CSSProperties}
        data-scan={scanning ? "" : undefined}
      >
        {!hasPhoto && !ghost && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview.src} alt="" className="v-demo__preview" />
        )}
        <div
          ref={holder}
          className="v-demo__holder"
          role="img"
          aria-label={laid ? VT.altResult(stone.name) : VT.altPhoto}
          hidden={!hasPhoto}
        />
        {/* Until the demo has run itself: its finished picture (the same one the engine makes). */}
        {ghost && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={DEMO_ROOMS[0].result} alt="" className="v-demo__preview v-demo__ghost" />
        )}
        {/* The stone just laid: the photo wipes away from left to right, once. */}
        {reveal && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={reveal.url}
            alt=""
            className="v-demo__reveal"
            data-go={reveal.go ? "" : undefined}
            onAnimationEnd={() => setReveal(null)}
          />
        )}
        {reveal?.go && <span className="v-demo__sweep" aria-hidden="true" />}
        {/* The stone before, fading out over the new one. */}
        {fade && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={fade.url}
            alt=""
            className="v-demo__fade"
            data-out={fade.out ? "" : undefined}
            onTransitionEnd={() => {
              URL.revokeObjectURL(fade.url);
              setFade(null);
            }}
          />
        )}
        {compare != null && s?.photo?.url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={s.photo.url}
            alt={VT.before}
            draggable={false}
            className="v-demo__before"
            style={{ clipPath: `inset(0 ${100 - compare * 100}% 0 0)` }}
          />
        )}
        {scanning && <span className="v-demo__scan" aria-hidden="true" />}
        {hasPhoto && (
          <div
            className="v-demo__touch"
            data-brush={brush && compare == null ? "" : undefined}
            onPointerDown={(e) => {
              if (compare != null) return moveSplit(e, true);
              if (e.pointerType === "mouse" && e.button !== 0) return;
              if (brush) {
                // the finger paints; the page doesn't scroll under it. Nothing to paint on while the photo is read.
                if (s?.phase === "preparing" || s?.decoding) return;
                const r = canvas.current!.getBoundingClientRect();
                strokeRef.current = {
                  id: e.pointerId,
                  points: [toPx(e)],
                  radius: (BRUSH_CSS_PX * canvas.current!.width) / r.width,
                };
                setStroke(strokeRef.current);
                e.currentTarget.setPointerCapture?.(e.pointerId);
                return;
              }
              press.current = { id: e.pointerId, x: e.clientX, y: e.clientY };
            }}
            onPointerUp={(e) => {
              const st = strokeRef.current;
              if (st && st.id === e.pointerId) {
                strokeRef.current = null;
                setStroke(null);
                if (brush) session.current?.brush(brush, st.points, st.radius);
                return;
              }
              const p = press.current;
              press.current = null;
              if (
                compare != null ||
                !p ||
                p.id !== e.pointerId ||
                Math.hypot(e.clientX - p.x, e.clientY - p.y) > TAP_SLOP
              )
                return;
              if (s?.phase === "error") return;
              const [x, y] = toPx(e);
              session.current?.tap(mode === "remove" ? "neg" : "pos", x, y);
            }}
            onPointerCancel={() => {
              press.current = null;
              strokeRef.current = null;
              setStroke(null);
            }}
            onPointerMove={(e) => {
              const st = strokeRef.current;
              if (st && st.id === e.pointerId) {
                st.points = [...st.points, toPx(e)];
                setStroke({ ...st });
                return;
              }
              moveSplit(e);
            }}
            {...(compare != null
              ? {
                  role: "slider",
                  tabIndex: 0,
                  "aria-label": VT.compareSlider,
                  "aria-valuemin": 0,
                  "aria-valuemax": 100,
                  "aria-valuenow": Math.round(compare * 100),
                  onKeyDown: (e) => {
                    const step = (
                      {
                        ArrowLeft: -0.05,
                        ArrowDown: -0.05,
                        ArrowRight: 0.05,
                        ArrowUp: 0.05,
                      } as Record<string, number>
                    )[e.key];
                    if (!step) return;
                    e.preventDefault();
                    setCompare(Math.min(1, Math.max(0, compare + step)));
                  },
                }
              : { role: "presentation" })}
          >
            {/* the visitor's taps (not the engine's own, when it found the floor by itself) */}
            {stroke && (
              <svg
                className="v-demo__stroke"
                viewBox={`0 0 ${W} ${H}`}
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <polyline
                  points={stroke.points.map((q) => q.join(",")).join(" ")}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2 * stroke.radius}
                  stroke={brush === "neg" ? "#DC2626" : "#16A34A"}
                  strokeOpacity="0.45"
                />
              </svg>
            )}
            {(s?.taps || [])
              .slice(s?.autoFound ? 1 : 0)
              .filter((m) => !m.kind)
              .map((m, i) => (
                <span
                  key={i}
                  className="v-demo__mark"
                  data-neg={m.label === "neg" ? "" : undefined}
                  style={{ left: `${(100 * m.x) / W}%`, top: `${(100 * m.y) / H}%` }}
                />
              ))}
            {compare != null && (
              <>
                <span
                  className="v-demo__tag"
                  style={{ left: "0.75rem", opacity: compare > 0.15 ? 1 : 0 }}
                >
                  {VT.before}
                </span>
                <span
                  className="v-demo__tag"
                  style={{ right: "0.75rem", opacity: compare < 0.85 ? 1 : 0 }}
                >
                  {VT.after}
                </span>
                <span className="v-demo__split" style={{ left: `${compare * 100}%` }}>
                  <span aria-hidden="true">‹ ›</span>
                </span>
              </>
            )}
          </div>
        )}
        {(laid || ghost) && compare == null && !reveal && (
          <p className="v-demo__label" aria-hidden="true">
            {stone.name} · on this floor
          </p>
        )}
        <div role="status" aria-live="polite">
          {prompt && (
            <p className="v-demo__prompt">
              {busy && <span className="v-demo__spin" aria-hidden="true" />}
              {prompt}
            </p>
          )}
        </div>
        {progress != null && begun && (
          <span className="v-demo__bar" aria-hidden="true">
            <span style={{ transform: `scaleX(${progress})` }} />
          </span>
        )}
        {/* on the picture: look before/after, keep it */}
        {(laid || compare != null) && !busy && !reveal && (
          <div className="v-demo__quick">
            {compare == null ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setBrush(null);
                    setCompare(0.5);
                  }}
                >
                  <span aria-hidden="true">⇆</span> {VT.compare}
                </button>
                <button type="button" disabled={saving} onClick={save}>
                  <span aria-hidden="true">↓</span> {saving ? VT.saving : VT.save}
                </button>
              </>
            ) : (
              <button type="button" onClick={() => setCompare(null)}>
                Done
              </button>
            )}
          </div>
        )}
        {compare == null && !brush && (!busy || ghost) && (
          <label className="v-demo__own-btn">
            <input type="file" accept="image/*" className="sr-only" onChange={openOwn} />
            <span aria-hidden="true">+</span> Your room photo
          </label>
        )}
      </div>

      <div className="v-demo__panel">
        <fieldset className="v-demo__group">
          <legend className="x-label">Room</legend>
          <div className="v-demo__rooms">
            {DEMO_ROOMS.map((r) => (
              <button
                key={r.id}
                type="button"
                className="v-demo__room"
                aria-pressed={room === r.id}
                disabled={busy && begun}
                onClick={() => openRoom(r.id)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={thumb(r.src, 256)} alt="" />
                <span>{r.label}</span>
              </button>
            ))}
            <label className="v-demo__room v-demo__own" data-on={room === "own" ? "" : undefined}>
              <input type="file" accept="image/*" className="sr-only" onChange={openOwn} />
              <span className="v-demo__plus" aria-hidden="true">
                +
              </span>
              <span>Your room</span>
            </label>
          </div>
        </fieldset>

        <fieldset className="v-demo__group">
          <legend className="x-label">Stone</legend>
          <div className="v-demo__stones">
            {DEMO_STONES.map((st) => (
              <button
                key={st.slabId}
                type="button"
                className="v-demo__stone"
                aria-pressed={stone.slabId === st.slabId}
                onClick={() => pickStone(st)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={thumb(st.thumbUrl, 128)} alt="" />
                <span>
                  <b>{st.name}</b>
                  <small>{st.type}</small>
                </span>
              </button>
            ))}
          </div>
        </fieldset>

        {s?.floorCheck && (
          <div className="v-demo__check" role="group" aria-labelledby="v-floor-check">
            <p id="v-floor-check">
              <b>{VT.floorCheck.prompt}</b> {FLOOR_CHECK[s.floorCheck.ask] || VT.floorCheck.PARTLY}
            </p>
            <div>
              <button type="button" onClick={() => session.current?.confirmFloor()} disabled={busy}>
                {VT.floorCheck.yes}
              </button>
              <button type="button" onClick={() => session.current?.rejectFloor()} disabled={busy}>
                {VT.floorCheck.no}
              </button>
              {anotherButton}
            </div>
          </div>
        )}

        {/* Putting the floor right, as in StoneX, folded away until wanted: another shape, a tap to add or
            take out, undo, start over. */}
        {hasPhoto && !s?.floorCheck && (
          <details className="v-demo__fix">
            <summary>Floor not quite right?</summary>
            <div className="v-demo__fixes">
              {anotherButton}
              <span className="v-demo__seg" role="group" aria-label="A tap on the picture">
                <button type="button" aria-pressed={mode === "add"} onClick={() => setMode("add")}>
                  Tap to add
                </button>
                <button
                  type="button"
                  aria-pressed={mode === "remove"}
                  disabled={!hasFloor}
                  onClick={() => setMode("remove")}
                >
                  Tap to remove
                </button>
              </span>
              <button
                type="button"
                disabled={!s?.taps.length || busy}
                onClick={() => session.current?.undo()}
              >
                {VT.undo}
              </button>
              <button
                type="button"
                disabled={!s?.taps.length || busy}
                onClick={async () => {
                  await session.current?.reset();
                  setMode("add");
                }}
              >
                {VT.startOver}
              </button>
            </div>
            {laid && s?.autoFound && <p className="v-demo__note">{VT.autoFound}</p>}
          </details>
        )}

        {laid && !busy && (
          <div className="v-demo__next">
            <p>
              <b>Your buyers can do this with your own slabs.</b>
            </p>
            <a
              href={waYard(stone.name)}
              className="x-btn x-btn--signal"
              target="_blank"
              rel="noopener noreferrer"
            >
              Get it for my yard <span aria-hidden="true">→</span>
            </a>
          </div>
        )}

        {s?.error && s.phase !== "no-webgl" && (
          <p role="alert" className="v-demo__error">
            {s.error.kept ? VT.keptAsked : ERRORS[s.error.code] || VT.tapFailed}
          </p>
        )}
        {s?.phase === "no-webgl" && (
          <p role="alert" className="v-demo__error">
            This browser can’t draw the preview (it needs WebGL2). Try it on a recent phone or
            computer.
          </p>
        )}
        <p className="v-demo__fine">
          {VT.privacy.replace("this phone", "this device")} Demo rooms: free Unsplash photos. Demo
          stones: sample slabs, not a yard’s stock.
        </p>
      </div>
    </div>
  );
}
