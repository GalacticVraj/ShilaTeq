import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { getImageProps } from "next/image";
import { SiteHeader } from "@/components/cross/SiteHeader";
import "./chapters.css";
import "./intro.css";

/**
 * "Chapters": a cinematic, scroll-told homepage.
 *   Intro            first entry only (~2.8 s, intro.css), "the mark": the red dot
 *                    becomes a cut, a small slab of real Statuarietto opens from it
 *                    like a book and closes, and the dot is ShilaTeq's.
 *   Opening (marble) the promise and the call on the real stone, over the film,
 *                    shown whole at its own 2.78:1 and played whole, still
 *                    stretches tightened. On scroll the stone gives way to black,
 *                    the film shrinks to a strip, closes to the red cut, and the
 *                    cut opens on the name.
 *   StoneX (bone)    a camera over the real inventory screenshot, with a spotlight
 *                    and markers on the actual interface (measured in pixels).
 *   StoneVision      (deep green) a real slab and its book-matched twin lie down
 *                    as a floor.
 *   Showroom         (signal) the yard's stone as a standing installation.
 *   End (black)      Book a demo.
 * Motion is CSS scroll-driven (never hijacked); without support or with reduced
 * motion every chapter is a calm, static composition. Where the film stood (it
 * shows a client's records and is never published) is a picture StoneVision made:
 * Statuarietto on a free Unsplash room's floor (public/vision-demo).
 */

export const metadata: Metadata = {
  title: "ShilaTeq — Stone, intelligently managed",
};

const DEMO_MAIL = "mailto:shilateq@gmail.com?subject=" + encodeURIComponent("StoneX demo request");

// The real StoneX inventory screen (fictional "Demo Stone Yard").
const SHOT = { src: "/product/stonex/inventory-demo.png", w: 2880, h: 1716 };

/* First entry, once per tab session: decided before the first paint, so the
   intro never flashes in late. Skipped with reduced motion, Save-Data, a deep
   link or a repeat visit. Any key, tap, wheel or scroll ends it at once; it
   ends itself when its last animation does (timed from the first paint, not from
   this script), with a 6 s safety net, and then leaves the page entirely ("off":
   no layout, no 3D layers). The page under it is live throughout. */
const INTRO_SCRIPT = `(function(){var d=document.documentElement,n=navigator.connection;
if(location.hash||matchMedia("(prefers-reduced-motion: reduce)").matches||(n&&n.saveData))return;
try{if(sessionStorage.getItem("st-intro"))return;sessionStorage.setItem("st-intro","1")}catch(e){}
d.dataset.intro="play";var t=["keydown","pointerdown","wheel","touchstart","scroll"];
function end(){if(d.dataset.intro!=="play")return;d.dataset.intro="done";t.forEach(function(e){removeEventListener(e,end,true)});
setTimeout(function(){d.dataset.intro="off"},300)}
t.forEach(function(e){addEventListener(e,end,{capture:true,passive:true})});
addEventListener("animationend",function(e){if(e.animationName==="c-intro-out")end()});setTimeout(end,6000)})()`;

// The opening's stone: a real Statuarietto close-up (2400 × 2214).
const STONE = { w: 2400, h: 2214 };

type Mark = {
  label: string;
  // The element's box in the screenshot, in its own pixels.
  x: number;
  y: number;
  w: number;
  h: number;
  side: "top" | "bottom" | "right";
  end?: true; // label aligned to the box's right edge
  wide?: true; // shown on wide screens only (outside the phone crop)
};
type Stop = {
  title: string;
  at: [number, number]; // the camera's target, as fractions of the screenshot
  span: number; // fraction of the screenshot's width in view (wide screens)
  atPhone?: [number, number];
  spanPhone: number;
  marks: Mark[];
};

const STOPS: Stop[] = [
  {
    title: "Every module, one system",
    at: [0.25, 0.6],
    span: 0.5,
    atPhone: [0.15, 0.6],
    spanPhone: 0.3,
    marks: [
      { label: "Leads to invoices", x: 35, y: 602, w: 440, h: 536, side: "right" },
      { label: "Procurement", x: 35, y: 1163, w: 440, h: 202, side: "right" },
      { label: "Workers & payroll", x: 35, y: 1385, w: 440, h: 293, side: "right" },
    ],
  },
  {
    title: "Arrival, block, slab",
    at: [0.3965, 0.227],
    span: 0.48,
    atPhone: [0.344, 0.227],
    spanPhone: 0.3,
    marks: [
      { label: "Arrival → block → slab", x: 576, y: 285, w: 821, h: 81, side: "top" },
      { label: "Stock value", x: 867, y: 452, w: 537, h: 43, side: "bottom" },
      { label: "Ageing", x: 1423, y: 452, w: 285, h: 43, side: "bottom", wide: true },
    ],
  },
  {
    title: "One block, one record",
    at: [0.412, 0.478],
    span: 0.42,
    atPhone: [0.362, 0.478],
    spanPhone: 0.3,
    marks: [
      { label: "Block ID", x: 658, y: 778, w: 350, h: 86, side: "top" },
      { label: "Size", x: 1279, y: 782, w: 147, h: 78, side: "bottom" },
      { label: "Yard zone", x: 1606, y: 796, w: 110, h: 46, side: "top", wide: true },
    ],
  },
  {
    title: "Status, age, QR",
    at: [0.805, 0.478],
    span: 0.4,
    atPhone: [0.87, 0.478],
    spanPhone: 0.3,
    marks: [
      { label: "Status", x: 1853, y: 793, w: 176, h: 54, side: "bottom", wide: true },
      { label: "Age", x: 2241, y: 799, w: 54, h: 39, side: "top" },
      { label: "QR", x: 2739, y: 795, w: 46, h: 47, side: "bottom", end: true },
    ],
  },
  {
    title: "Into the buyer’s room",
    at: [0.736, 0.126],
    span: 0.4,
    spanPhone: 0.3,
    marks: [{ label: "StoneVision", x: 1917, y: 177, w: 406, h: 78, side: "bottom" }],
  },
];

// Phones see the screen through a 4:5 frame; wide screens through one of its own shape.
const PHONE_FRAME = 4 / 5;
const clamp = (n: number, lo: number, hi: number) => Math.min(Math.max(n, lo), hi);
const fix = (n: number) => +n.toFixed(3);
const pct = (n: number) => `${fix(n * 100)}%`;

/** Scale + translate (in % of the screenshot) that centre `at` with `span` in view,
 *  kept inside the image; `frameRatio` = frame height / screenshot height. */
function camera([x, y]: [number, number], span: number, frameRatio: number) {
  const s = 1 / span;
  const halfW = 1 / (2 * s);
  const halfH = frameRatio / (2 * s);
  const cx = clamp(x, halfW, 1 - halfW);
  const cy = halfH >= 0.5 ? 0.5 : clamp(y, halfH, 1 - halfH);
  return { s: fix(s), tx: fix((0.5 - cx) * s * 100), ty: fix((0.5 - cy) * s * 100) };
}
/** Per stop: its view (--sN, --txN, --tyN) and, from the second stop on, the
 *  pulled-back view half-way from the previous stop (--smN, --txmN, --tymN). */
function cameraVars(phone: boolean) {
  const ratio = phone ? SHOT.w / SHOT.h / PHONE_FRAME : 1;
  const at = (st: Stop) => (phone ? (st.atPhone ?? st.at) : st.at);
  const span = (st: Stop) => (phone ? st.spanPhone : st.span);
  return STOPS.map((st, i) => {
    const c = camera(at(st), span(st), ratio);
    let v = `--s${i + 1}:${c.s};--tx${i + 1}:${c.tx}%;--ty${i + 1}:${c.ty}%`;
    if (i > 0) {
      const p = STOPS[i - 1];
      const mid: [number, number] = [(at(p)[0] + at(st)[0]) / 2, (at(p)[1] + at(st)[1]) / 2];
      const m = camera(mid, Math.min(1, Math.max(span(p), span(st)) * 1.22), ratio);
      v += `;--sm${i + 1}:${m.s};--txm${i + 1}:${m.tx}%;--tym${i + 1}:${m.ty}%`;
    }
    return v;
  }).join(";");
}
const CAMERA_CSS = `.c-x{${cameraVars(false)}}@media (width < 40rem){.c-x{${cameraVars(true)}}}`;

// Scroll choreography of the camera (in % of its track): stop N holds from
// 18·N% to 18·N+10%; markers arrive just as the camera lands.
const hold = (n: number) => 18 * n;
const range = (from: number, to: number) =>
  ({ animationRange: `contain ${fix(from)}% contain ${fix(to)}%` }) as CSSProperties;
const markRange = (n: number, j: number) =>
  range(hold(n) - 1.5 + j * 1.6, n === STOPS.length ? 100 : hold(n) + 12);
const stopRange = (n: number) => range(hold(n) - 2, n === STOPS.length ? 100 : hold(n) + 12.5);

const STONES = [
  ["calacatta-gold", "Calacatta Gold"],
  ["black-galaxy", "Black Galaxy"],
  ["azul-macaubas", "Azul Macaubas"],
  ["statuarietto", "Statuarietto"],
  ["rockville-white", "Rockville White"],
  ["tan-brown", "Tan Brown"],
] as const;

const pad = (n: number) => String(n).padStart(2, "0");

function Wordmark() {
  return (
    <span aria-hidden="true">
      Sh
      <span className="x-wordmark__i">
        ı<span className="x-wordmark__dot" />
      </span>
      laTeq
    </span>
  );
}

function Marks({ stop, marks, timed }: { stop: number; marks: Mark[]; timed?: boolean }) {
  return marks.map((m, j) => (
    <span
      key={m.label}
      className={["c-mark", `c-mark--${stop}`, m.wide && "c-mark--wide"].filter(Boolean).join(" ")}
      data-side={m.side}
      data-end={m.end}
      style={{
        left: pct(m.x / SHOT.w),
        top: pct(m.y / SHOT.h),
        width: pct(m.w / SHOT.w),
        height: pct(m.h / SHOT.h),
        ...(timed && markRange(stop, j)),
      }}
    >
      <span className="c-mark__label">{m.label}</span>
    </span>
  ));
}

/** Dims the screen around one stop's elements (holes cut in the screenshot's own pixels). */
function Spot({
  stop,
  marks,
  id,
  timed,
}: {
  stop: number;
  marks: Mark[];
  id: string;
  timed?: boolean;
}) {
  const p = 16;
  return (
    <svg
      className={`c-spot c-spot--${stop}`}
      viewBox={`0 0 ${SHOT.w} ${SHOT.h}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      style={timed ? stopRange(stop) : undefined}
    >
      <mask id={id}>
        <rect width={SHOT.w} height={SHOT.h} fill="#fff" />
        {marks.map((m) => (
          <rect
            key={m.label}
            className={m.wide ? "c-spot__wide" : undefined}
            x={m.x - p}
            y={m.y - p}
            width={m.w + 2 * p}
            height={m.h + 2 * p}
            rx={18}
            fill="#000"
          />
        ))}
      </mask>
      <rect width={SHOT.w} height={SHOT.h} fill="#0b100e" fillOpacity={0.5} mask={`url(#${id})`} />
    </svg>
  );
}

export default function ChaptersPrototype() {
  // In the film's place: StoneVision's own result (a demo room, Statuarietto laid on its floor).
  const { props: still } = getImageProps({
    src: "/vision-demo/result-hall-statuarietto.jpg",
    width: 1600,
    height: 1066,
    alt: "",
    sizes: "100vw",
    fetchPriority: "high",
    loading: "eager",
  });
  // The intro's marble: the hero's own Statuarietto, as a CSS image-set from the
  // optimiser's 1x / 2x files.
  const marble = `image-set(${getImageProps({
    src: "/stone/statuarietto.jpg",
    width: 1280,
    height: 1181,
    alt: "",
  })
    .props.srcSet!.split(", ")
    .map((s) => {
      const [url, density] = s.split(" ");
      return `url("${url}") ${density}`;
    })
    .join(", ")})`;
  // The opening's stone: the real Statuarietto close-up, the ground of the hero. A
  // 1 KB preview of the same photo shows until it arrives.
  const { props: stone } = getImageProps({
    src: "/stone/statuarietto.jpg",
    width: STONE.w,
    height: STONE.h,
    alt: "",
    sizes: "(min-width: 64rem) 100vw, 150vw",
    loading: "eager",
    fetchPriority: "high",
  });
  const { props: granite } = getImageProps({
    src: "/stone/black-galaxy.jpg",
    width: 2048,
    height: 1113,
    alt: "",
    sizes: "100vw",
  });
  const { props: screen } = getImageProps({
    src: SHOT.src,
    width: SHOT.w,
    height: SHOT.h,
    alt: "",
    sizes: "(min-width: 40rem) 230vw, 333vw",
  });
  const { props: slab } = getImageProps({
    src: "/stone/statuarietto-slab.jpg",
    width: 1240,
    height: 2214,
    alt: "",
    sizes: "(min-width: 40rem) 55vw, 95vw",
  });

  return (
    <div className="c-page">
      <style dangerouslySetInnerHTML={{ __html: CAMERA_CSS }} />

      {/* First entry (about 2.8 s), "the mark" (intro.css): the red dot becomes a
          cut; a small slab of real Statuarietto opens from it like a book and
          closes again; the dot is ShilaTeq's, and the wordmark glides to the top
          bar as the site fades in. Decorative and see-through to the pointer. */}
      <script dangerouslySetInnerHTML={{ __html: INTRO_SCRIPT }} />
      <div className="c-intro" aria-hidden="true" style={{ "--marble": marble } as CSSProperties}>
        <span className="ci-bg" />
        <div className="ci-book">
          <span className="ci-leaf ci-leaf--l">
            <span />
          </span>
          <span className="ci-leaf ci-leaf--r">
            <span />
          </span>
        </div>
        <span className="ci-dot" />
        <p className="c-intro__mark x-wordmark">
          <Wordmark />
        </p>
      </div>

      {/* The site's bar. Its Book a demo is the opening's own, one red button in view. */}
      <SiteHeader
        home={{ href: "#main", label: "ShilaTeq" }}
        links={[
          { href: "/stonex-erp", label: "StoneX ERP" },
          { href: "/stonevision", label: "StoneVision" },
          { href: "/showroom", label: "Showroom" },
        ]}
        demo={DEMO_MAIL}
      />

      <main id="main">
        {/* ---------- Opening: the film, the cut, the name ---------- */}
        <section className="c-open" aria-labelledby="c-title">
          <div className="c-open__stage">
            <div className="c-hero on-light">
              {/* The hero stands on the real marble (the intro's stone, lightened). */}
              <div className="c-hero__ground" aria-hidden="true">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img {...stone} alt="" />
              </div>
              <h1 id="c-title" className="c-hero__title">
                <span className="x-line">
                  <span style={{ "--i": 2 } as CSSProperties}>
                    <span className="c-hero__stone">Stone,</span>{" "}
                    <span className="c-hero__smart">
                      <span>intelligently</span> <span>managed.</span>
                    </span>
                  </span>
                </span>
              </h1>

              <div className="c-hero__actions">
                <p className="c-hero__pitch">
                  <strong>ERP + visualisation,</strong> built for natural stone.
                </p>
                <div className="c-hero__ctas">
                  <a href={DEMO_MAIL} className="x-btn x-btn--signal c-hero__cta">
                    Book a demo <span aria-hidden="true">→</span>
                  </a>
                  <a href="#stonex" className="x-link-cut">
                    See StoneX <span aria-hidden="true">↓</span>
                  </a>
                </div>
              </div>

              <figure className="c-hero__film">
                <div className="c-film__open">
                  <div className="c-film c-film--still">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      {...still}
                      alt="An open hall with Statuarietto marble laid on its floor by StoneVision, the window light kept on the stone."
                      className="f-film__media"
                    />
                    <span className="c-film__label" aria-hidden="true">
                      Made by StoneVision
                    </span>
                    <span className="c-film__cut" aria-hidden="true" />
                    <span className="c-film__flash" aria-hidden="true" />
                  </div>
                </div>
              </figure>

              {/* The cut opens on the name (overlaid while scrolling; its own block otherwise). */}
              <div className="c-name">
                <div className="c-name__win">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img {...granite} alt="" className="c-name__stone" />
                  <p className="c-name__mark x-wordmark">
                    <Wordmark />
                    <span className="sr-only">ShilaTeq</span>
                  </p>
                  <p className="c-name__line x-display">From block to buyer’s floor.</p>
                  <p className="c-name__products x-label">StoneX ERP · Showroom · StoneVision</p>
                </div>
                <span className="c-name__rule c-name__rule--a" aria-hidden="true" />
                <span className="c-name__rule c-name__rule--b" aria-hidden="true" />
              </div>
            </div>
          </div>
        </section>

        {/* ---------- StoneX: a camera over the real screen ---------- */}
        <section id="stonex" className="c-x on-light" aria-labelledby="c-x-title">
          <div className="c-x__open">
            <p className="x-label c-x__kicker">Chapter 01 · the yard</p>
            <h2 id="c-x-title" className="c-x__title x-display">
              StoneX <span>ERP</span>
            </h2>
            <p className="c-x__sub">Your yard, on one screen.</p>
          </div>

          {/* Scroll-driven camera (motion + support only). */}
          <div className="c-cam">
            <div className="c-cam__stage">
              <div className="c-frame">
                <div className="c-layer c-cam__layer">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    {...screen}
                    alt="StoneX inventory screen for a fictional demo yard."
                    className="c-layer__img"
                  />
                  {STOPS.map((st, i) => (
                    <Spot
                      key={st.title}
                      stop={i + 1}
                      marks={st.marks}
                      id={`c-cam-spot-${i + 1}`}
                      timed
                    />
                  ))}
                  {STOPS.map((st, i) => (
                    <Marks key={st.title} stop={i + 1} marks={st.marks} timed />
                  ))}
                </div>
              </div>
              <div className="c-cam__bar">
                <ol className="c-cam__caps">
                  <li className="c-cap c-cap--0" style={range(0, 12)}>
                    <span className="x-label">00 / {pad(STOPS.length)}</span>
                    The whole yard
                  </li>
                  {STOPS.map((st, i) => (
                    <li key={st.title} className="c-cap c-cap--stop" style={stopRange(i + 1)}>
                      <span className="x-label">
                        {pad(i + 1)} / {pad(STOPS.length)}
                      </span>
                      {st.title}
                    </li>
                  ))}
                </ol>
                <div className="c-cam__rail" aria-hidden="true">
                  <span className="c-cam__fill" />
                  {STOPS.map((st, i) => (
                    <span
                      key={st.title}
                      className="c-cam__tick"
                      style={{ left: `${hold(i + 1)}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* The same views as still frames: reduced motion, no support, no JS. */}
          <div className="c-shots">
            {STOPS.map((st, i) => (
              <figure key={st.title} className={`c-shot c-shot--${i + 1}`}>
                <div className="c-frame">
                  <div className="c-layer">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      {...screen}
                      alt={`StoneX inventory for a fictional demo yard: ${st.title.toLowerCase()}.`}
                      className="c-layer__img"
                    />
                    <Spot stop={i + 1} marks={st.marks} id={`c-shot-spot-${i + 1}`} />
                    <Marks stop={i + 1} marks={st.marks} />
                  </div>
                </div>
                <figcaption className="c-cap">
                  <span className="x-label">
                    {pad(i + 1)} / {pad(STOPS.length)}
                  </span>
                  {st.title}
                </figcaption>
              </figure>
            ))}
          </div>
          <p className="c-x__note x-label">StoneX · inventory · fictional demo yard</p>
        </section>

        {/* ---------- StoneVision: the slab and its twin lie down as a floor ---------- */}
        <section id="stonevision" className="c-v" aria-labelledby="c-v-title">
          <div className="c-v__stage">
            <div className="c-v__room" aria-hidden="true">
              <span className="c-v__window" />
              <span className="c-v__shadow" />
              <div className="c-v__floor">
                <div className="c-v__slab c-v__slab--a">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img {...slab} alt="" />
                </div>
                <div className="c-v__slab c-v__slab--b">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img {...slab} alt="" />
                </div>
                <span className="c-v__lightbox">
                  <span className="c-v__light" />
                </span>
              </div>
            </div>
            <p className="x-label c-v__kicker">Chapter 02 · in the Showroom</p>
            <h2 id="c-v-title" className="c-v__title x-display">
              StoneVision
            </h2>
            <div className="c-v__copy">
              <p className="c-v__line">Your real slab, on their floor.</p>
              <p className="c-v__small">
                A buyer photographs their room; your real slabs lie on its floor. Opened from StoneX
                too: “Visualize in your space”.
              </p>
            </div>
          </div>
        </section>

        {/* ---------- Showroom: the yard's stone, standing ---------- */}
        <section id="showroom" className="c-s on-light" aria-labelledby="c-s-title">
          <div className="c-s__head">
            <p className="x-label">Chapter 03 · part of StoneX</p>
            <h2 id="c-s-title" className="c-s__title x-display">
              Showroom
            </h2>
            <p className="c-s__line">Your available stone, online.</p>
            <p className="c-s__small">Buyers browse and enquire. Enquiries land in StoneX leads.</p>
          </div>
          <div className="c-s__hall">
            <ul className="c-s__rack" aria-label="Stone in the showroom (sample photographs)">
              {STONES.map(([file, name], i) => {
                const { props: img } = getImageProps({
                  src: `/stone/${file}.jpg`,
                  width: 1200,
                  height: 2100,
                  alt: "",
                  sizes: "(min-width: 40rem) 18vw, 40vw",
                });
                return (
                  <li key={file} className="c-slab" style={{ "--n": i } as CSSProperties}>
                    <span className="c-slab__name x-label">{name}</span>
                    <span className="c-slab__face">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img {...img} alt="" className="c-slab__img" />
                      <span className="c-slab__edge" aria-hidden="true" />
                      <span className="c-slab__shadow" aria-hidden="true" />
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* ---------- End ---------- */}
        <section className="c-end" aria-labelledby="c-end-title">
          <p className="x-label c-end__kicker">StoneX ERP · Showroom · StoneVision</p>
          <h2 id="c-end-title" className="c-end__title x-display">
            <a href={DEMO_MAIL}>
              Book a demo <span aria-hidden="true">→</span>
            </a>
          </h2>
          <footer className="c-foot x-label">
            <span className="x-wordmark c-foot__mark">
              <Wordmark />
              <span className="sr-only">ShilaTeq</span>
            </span>
            <span>Screens: fictional demo yard · pictures made by StoneVision</span>
            <span>© 2026 ShilaTeq</span>
          </footer>
        </section>
      </main>
    </div>
  );
}
