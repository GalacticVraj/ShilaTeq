"use client";

import { useEffect, useRef, useState, type ChangeEvent, type PointerEvent } from "react";
import { VT } from "@/vendor/stonex-vision/components/vision/visionText.js";
import {
  DEMO_ROOMS,
  DEMO_STONES,
  OWN_PHOTO_TRIES,
  countOwnPhoto,
  loadStoneImage,
  ownPhotosUsed,
  thumb,
  type DemoStone,
} from "./demo";

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
  taps: { label: string; x: number; y: number }[];
  modelLoad: { loaded: number; total: number } | null;
  error: { code: string; kept?: boolean } | null;
};
type Session = {
  start(): Promise<unknown>;
  loadPhoto(file: Blob): Promise<unknown>;
  setStone(stone: DemoStone, load: typeof loadStoneImage): Promise<unknown>;
  tap(label: "pos" | "neg", x: number, y: number): Promise<unknown>;
  undo(): Promise<unknown>;
  confirmFloor(): Promise<unknown>;
  rejectFloor(): Promise<unknown>;
  exportImage(o?: { caption?: boolean }): Promise<Blob>;
  dispose(): Promise<unknown>;
};
const STAGES = VT.stages as Record<string, string>;
const ERRORS = VT.errors as Record<string, string>;
const FLOOR_CHECK = VT.floorCheck as Record<string, string>;
const TAP_SLOP = 10; // px a press may wander and still be a tap (more is a drag: never a mark)
const isLaid = (st: SvState | null) => (st?.mask?.coverage || 0) > 0 && !st?.floorCheck;
const reduced = () => typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * StoneVision, live: StoneX's own engine (src/vendor/stonex-vision) on two demo rooms and two demo
 * stones, or on a photo of the visitor's own (twice). The model downloads only when asked for; the
 * photo never leaves the browser. Around the engine, only presentation: real download progress, a
 * scan while it reads the room, a wipe when the stone is laid, a crossfade when the stone changes.
 */
export default function StoneVisionDemo() {
  const stageRef = useRef<HTMLDivElement>(null);
  const holder = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const session = useRef<Session | null>(null);
  const starting = useRef<Promise<Session> | null>(null);
  const press = useRef<{ id: number; x: number; y: number } | null>(null);
  const revealed = useRef<string | null>(null); // the photo whose stone was last revealed
  const [s, setS] = useState<SvState | null>(null);
  const [room, setRoom] = useState<string>(DEMO_ROOMS[0].id);
  const [stone, setStone] = useState<DemoStone>(DEMO_STONES[0]);
  const [compare, setCompare] = useState<number | null>(null);
  const [mode, setMode] = useState<"add" | "remove">("add");
  const [used, setUsed] = useState(0);
  const [saving, setSaving] = useState(false);
  // the photo over the stage once the floor is found; `go`: the stone is ready, wipe it away
  const [reveal, setReveal] = useState<{ url: string; go: boolean } | null>(null);
  const [fade, setFade] = useState<{ url: string; out: boolean } | null>(null); // the stone before, fading

  useEffect(() => {
    setUsed(ownPhotosUsed()); // eslint-disable-line react-hooks/set-state-in-effect -- browser-only count
    return () => {
      session.current?.dispose();
      session.current = null;
    };
  }, []);

  // Each state the engine reports. The first time a photo's floor is found, the photo itself covers the
  // stage (so nothing half-made shows) and wipes away once the stone is fully laid.
  const onChange = (st: SvState) => {
    setS(st);
    const url = st.photo?.url;
    // (an error ends the wait too: the cover never stays over the picture)
    const ready = (st.phase === "ready" && !st.stage) || !!st.error;
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
      const ss = new Engine({ canvas: c, autoFloor: true, onChange: (st: unknown) => onChange(st as SvState) });
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
    if (r.top < 0 || r.bottom > innerHeight) el.scrollIntoView({ behavior: reduced() ? "auto" : "smooth", block: "center" });
  };
  const fresh = () => {
    setCompare(null);
    setMode("add");
    setFade(null);
    showStage();
  };
  const openRoom = async (id: string) => {
    setRoom(id);
    fresh();
    const r = DEMO_ROOMS.find((x) => x.id === id)!;
    const ss = await ensure();
    const blob = await (await fetch(r.src)).blob();
    await ss.loadPhoto(new File([blob], `${r.id}.jpg`, { type: "image/jpeg" }));
  };
  const openOwn = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || ownPhotosUsed() >= OWN_PHOTO_TRIES) return;
    countOwnPhoto();
    setUsed(ownPhotosUsed());
    setRoom("own");
    fresh();
    const ss = await ensure();
    await ss.loadPhoto(file);
  };
  // Another stone on the same floor: the one on screen fades out over the new one once it is laid.
  const pickStone = async (st: DemoStone) => {
    if (st.slabId === stone.slabId) return;
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

  const started = !!s;
  const hasPhoto = !!s?.photo;
  const busy = !!s && (s.phase === "working" || s.phase === "preparing" || s.decoding);
  const hasFloor = (s?.mask?.coverage || 0) > 0;
  const laid = isLaid(s);
  const W = s?.photo?.width || 3,
    H = s?.photo?.height || 2;
  // Real progress only: the model's bytes while it downloads; otherwise the step, named.
  const progress = s?.stage === "model" && s.modelLoad?.total ? s.modelLoad.loaded / s.modelLoad.total : null;
  const stageText = s?.gpuLost
    ? VT.gpuRestoring
    : s?.decoding
      ? STAGES.photo
      : busy && s?.stage
        ? STAGES[s.stage] + (progress != null ? ` ${Math.floor(progress * 100)}%` : "")
        : null;
  const prompt =
    !s || !hasPhoto || compare != null || s.phase === "error"
      ? null
      : stageText ||
        (s.floorCheck ? VT.floorCheck.prompt : !hasFloor ? VT.tapFloor : mode === "remove" ? VT.removeHint : null);
  // The engine reads the room (its long step): a scan line passes over the photo meanwhile.
  const scanning = busy && (s?.stage === "analyse" || s?.stage === "floor" || s?.stage === "room");
  const left = Math.max(0, OWN_PHOTO_TRIES - used);
  const preview = DEMO_ROOMS.find((r) => r.id === room) ?? DEMO_ROOMS[0];

  const toPx = (e: PointerEvent) => {
    const r = canvas.current!.getBoundingClientRect();
    return [((e.clientX - r.left) / r.width) * canvas.current!.width, ((e.clientY - r.top) / r.height) * canvas.current!.height];
  };
  const moveSplit = (e: PointerEvent, pressed = false) => {
    if (compare == null || !(pressed || e.buttons || e.pointerType === "touch")) return;
    const r = canvas.current!.getBoundingClientRect();
    setCompare(Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)));
  };

  return (
    <div className="v-demo" data-state={laid ? "laid" : hasPhoto ? "photo" : "none"}>
      <div ref={stageRef} className="v-demo__stage" style={{ aspectRatio: `${W} / ${H}` }} data-scan={scanning ? "" : undefined}>
        {/* Before the engine starts: the demo room, and the way in. */}
        {!hasPhoto && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview.src} alt="" className="v-demo__preview" />
        )}
        <div ref={holder} className="v-demo__holder" role="img" aria-label={laid ? VT.altResult(stone.name) : VT.altPhoto} hidden={!hasPhoto} />
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
          <img src={s.photo.url} alt={VT.before} draggable={false} className="v-demo__before" style={{ clipPath: `inset(0 ${100 - compare * 100}% 0 0)` }} />
        )}
        {scanning && <span className="v-demo__scan" aria-hidden="true" />}
        {hasPhoto && (
          <div
            className="v-demo__touch"
            onPointerDown={(e) => {
              if (compare != null) return moveSplit(e, true);
              press.current = { id: e.pointerId, x: e.clientX, y: e.clientY };
            }}
            onPointerUp={(e) => {
              const p = press.current;
              press.current = null;
              if (compare != null || !p || p.id !== e.pointerId || Math.hypot(e.clientX - p.x, e.clientY - p.y) > TAP_SLOP) return;
              if (s?.phase === "error") return;
              const [x, y] = toPx(e);
              session.current?.tap(mode === "remove" ? "neg" : "pos", x, y);
            }}
            onPointerCancel={() => (press.current = null)}
            onPointerMove={moveSplit}
            {...(compare != null
              ? {
                  role: "slider",
                  tabIndex: 0,
                  "aria-label": VT.compareSlider,
                  "aria-valuemin": 0,
                  "aria-valuemax": 100,
                  "aria-valuenow": Math.round(compare * 100),
                  onKeyDown: (e) => {
                    const step = ({ ArrowLeft: -0.05, ArrowDown: -0.05, ArrowRight: 0.05, ArrowUp: 0.05 } as Record<string, number>)[e.key];
                    if (!step) return;
                    e.preventDefault();
                    setCompare(Math.min(1, Math.max(0, compare + step)));
                  },
                }
              : { role: "presentation" })}
          >
            {/* the visitor's taps (not the engine's own, when it found the floor by itself) */}
            {(s?.taps || []).slice(s?.autoFound ? 1 : 0).map((m, i) => (
              <span
                key={i}
                className="v-demo__mark"
                data-neg={m.label === "neg" ? "" : undefined}
                style={{ left: `${(100 * m.x) / W}%`, top: `${(100 * m.y) / H}%` }}
              />
            ))}
            {compare != null && (
              <>
                <span className="v-demo__tag" style={{ left: "0.75rem", opacity: compare > 0.15 ? 1 : 0 }}>
                  {VT.before}
                </span>
                <span className="v-demo__tag" style={{ right: "0.75rem", opacity: compare < 0.85 ? 1 : 0 }}>
                  {VT.after}
                </span>
                <span className="v-demo__split" style={{ left: `${compare * 100}%` }}>
                  <span aria-hidden="true">‹ ›</span>
                </span>
              </>
            )}
          </div>
        )}
        {laid && compare == null && !reveal && (
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
        {progress != null && (
          <span className="v-demo__bar" aria-hidden="true">
            <span style={{ transform: `scaleX(${progress})` }} />
          </span>
        )}
        {!started && (
          <div className="v-demo__start">
            <button type="button" className="x-btn x-btn--signal v-demo__go" onClick={() => openRoom(room)}>
              Try it live <span aria-hidden="true">→</span>
            </button>
            <p>Runs in your browser. The first time, it downloads about 28 MB.</p>
          </div>
        )}
      </div>

      <div className="v-demo__panel">
        <fieldset className="v-demo__group">
          <legend className="x-label">1 · A room</legend>
          <div className="v-demo__rooms">
            {DEMO_ROOMS.map((r) => (
              <button
                key={r.id}
                type="button"
                className="v-demo__room"
                aria-pressed={room === r.id}
                disabled={busy && started}
                onClick={() => openRoom(r.id)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={thumb(r.src, 256)} alt="" />
                <span>{r.label}</span>
              </button>
            ))}
            <label className="v-demo__room v-demo__own" aria-disabled={left === 0} data-on={room === "own" ? "" : undefined}>
              <input type="file" accept="image/*" className="sr-only" disabled={left === 0} onChange={openOwn} />
              <span className="v-demo__plus" aria-hidden="true">
                +
              </span>
              <span>{left > 0 ? `Your room · ${left} ${left === 1 ? "try" : "tries"}` : "Tries used"}</span>
            </label>
          </div>
        </fieldset>

        <fieldset className="v-demo__group">
          <legend className="x-label">2 · A stone</legend>
          <div className="v-demo__stones">
            {DEMO_STONES.map((st) => (
              <button key={st.slabId} type="button" className="v-demo__stone" aria-pressed={stone.slabId === st.slabId} onClick={() => pickStone(st)}>
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
            </div>
          </div>
        )}

        {hasPhoto && (
          <fieldset className="v-demo__group">
            <legend className="x-label">3 · Look closer</legend>
            <div className="v-demo__tools">
              <button
                type="button"
                aria-pressed={compare != null}
                disabled={!laid}
                onClick={() => {
                  setCompare(compare == null ? 0.5 : null);
                  showStage();
                }}
              >
                {VT.compare}
              </button>
              <button type="button" disabled={!laid || saving} onClick={save}>
                {saving ? VT.saving : VT.save}
              </button>
              <button type="button" aria-pressed={mode === "remove"} disabled={!hasFloor} onClick={() => setMode(mode === "remove" ? "add" : "remove")}>
                {VT.remove}
              </button>
              <button type="button" disabled={!s?.taps.length || busy} onClick={() => session.current?.undo()}>
                {VT.undo}
              </button>
            </div>
            {laid && s?.autoFound && <p className="v-demo__note">{VT.autoFound}</p>}
          </fieldset>
        )}

        {s?.error && s.phase !== "no-webgl" && (
          <p role="alert" className="v-demo__error">
            {s.error.kept ? VT.keptAsked : ERRORS[s.error.code] || VT.tapFailed}
          </p>
        )}
        {s?.phase === "no-webgl" && (
          <p role="alert" className="v-demo__error">
            This browser can’t draw the preview (it needs WebGL2). Try it on a recent phone or computer.
          </p>
        )}
        <p className="v-demo__fine">
          {VT.privacy.replace("this phone", "this device")} Demo rooms: free Unsplash photos. Demo stones: sample
          slabs, not a yard’s stock.
        </p>
      </div>
    </div>
  );
}
