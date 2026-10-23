import type { CSSProperties, ReactNode } from "react";
import type { Metadata } from "next";
import { getImageProps } from "next/image";
import { SiteHeader } from "@/components/cross/SiteHeader";
import BeforeAfter from "./BeforeAfter";
import StoneVisionDemo from "./StoneVisionDemo";
import "./vision.css";

/**
 * the StoneVision product page (/stonevision).
 *   Hero     the promise, on the home page's marble; a real result, before and after
 *   Steps    the slab, their room, their floor: each with a real picture
 *   Demo     StoneVision itself, live (StoneX's engine, src/vendor/stonex-vision)
 *   Compare  one room, two stones
 *   Loop     stock → Showroom → their floor → your Leads
 *   Gets     what a buyer gets, in short
 *   FAQ      as a conversation, beside Book a demo
 * Every claim is checked against StoneX's code (read-only, eb9a0d8). Pictures: free Unsplash rooms
 * and sample slabs, laid by StoneVision itself (public/vision-demo); the lead card is drawn, and says so.
 */

export const metadata: Metadata = {
  title: "StoneVision — ShilaTeq",
};

const DEMO_MAIL = "mailto:shilateq@gmail.com?subject=" + encodeURIComponent("StoneVision demo request");
const V = "/vision-demo";

// A window on the StoneX inventory screenshot (fictional demo yard), its "Visualize in your space"
// button marked: in its own pixels.
const INV = { src: "/product/stonex/inventory-demo.png", w: 2880, h: 1716 };
const INV_VIEW = { x: 900, y: 20, w: 1800, h: 1200 }; // 3:2, the step pictures' shape
const INV_BUTTON = { x: 1917, y: 177, w: 406, h: 78 };

const GETS: [string, string, ReactNode][] = [
  ["The real slab", "Its own photo, never a texture.", <path key="i" d="M4 5h16v14H4zM4 15l5-4 4 3 3-2 4 3" />],
  ["The room’s own light", "Shadows stay on the stone.", <path key="i" d="M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M3 12h2M19 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4M8 12a4 4 0 1 0 8 0 4 4 0 0 0-8 0Z" />],
  ["Floor found for them", "Or marked with one tap.", <path key="i" d="M3 17 12 9l9 8M6.5 14 3 21h18l-3.5-7" />],
  ["Before and after", "Drag to compare.", <path key="i" d="M12 4v16M4 6h5v12H4zM15 6h5v12h-5z" />],
  ["Another stone, same photo", "Only the stone changes.", <path key="i" d="M4 7h11l-3-3M20 17H9l3 3" />],
  ["Private by design", "The photo stays on their phone.", <path key="i" d="M6 11V8a6 6 0 0 1 12 0v3M5 11h14v10H5zM12 15v2" />],
];

const FAQ: [string, string][] = [
  [
    "Is the buyer’s photo uploaded anywhere?",
    "No. StoneVision runs in their browser and the room photo stays on their phone. Only the floor finder itself downloads, once.",
  ],
  [
    "What does it show the stone on?",
    "Floors. It finds the floor in the photo, or the buyer taps it, and lays the slab on it in the room’s perspective.",
  ],
  [
    "What do I need to offer it?",
    "Your ShilaTeq Showroom, and slabs photographed with the slab camera in StoneX. Each slab is shown from its own photo.",
  ],
  [
    "Is the picture exact?",
    "It’s a preview to help buyers choose. Colour and veins come from the slab’s own photo; size is approximate unless the buyer measures two points on the floor.",
  ],
  [
    "Which phones does it work on?",
    "A recent phone or computer browser. The first time, it downloads about 28 MB; after that it starts from the browser’s cache.",
  ],
];

const pc = (n: number) => `${+(n * 100).toFixed(3)}%`;

/** An image at the sizes it is shown at (Next's optimiser picks the file for each screen). */
const pic = (src: string, w: number, h: number, sizes: string, eager = false) =>
  getImageProps({ src, width: w, height: h, alt: "", sizes, ...(eager ? { loading: "eager", fetchPriority: "high" } : {}) }).props;
// The demo pictures: 2000 × 1333 photos; StoneVision's results at its 1600 px render size.
const room = (name: string, sizes: string, eager = false) => pic(`${V}/${name}.jpg`, 2000, 1333, sizes, eager);
const result = (name: string, sizes: string, eager = false) => pic(`${V}/${name}.jpg`, 1600, 1066, sizes, eager);

/** A window on a screenshot: just the part `v` (its pixels), at its own shape. */
function Window({ w, h, v, sizes, children }: { w: number; h: number; v: { x: number; y: number; w: number; h: number }; sizes: string; children?: ReactNode }) {
  const img = pic(INV.src, w, h, sizes);
  return (
    <span className="v-win" style={{ aspectRatio: `${v.w} / ${v.h}` }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img {...img} alt="" loading="lazy" style={{ width: pc(w / v.w), left: pc(-v.x / v.w), top: pc(-v.y / v.h) }} />
      {children}
    </span>
  );
}

/** A red label on a picture, at a point given as fractions of it. */
function Chip({ x, y, children, end }: { x: number; y: number; children: ReactNode; end?: boolean }) {
  return (
    <span className="v-chip" data-end={end ? "" : undefined} style={{ left: pc(x), top: pc(y) } as CSSProperties}>
      {children}
    </span>
  );
}

export default function StoneVisionPage() {
  return (
    <div className="v-page">
      <SiteHeader
        home={{ href: "/", label: "ShilaTeq home" }}
        links={[
          { href: "/stonex-erp", label: "StoneX ERP" },
          { href: "/stonevision", label: "StoneVision", current: true },
          { href: "/showroom", label: "Showroom" },
        ]}
        more={[
          {
            label: "On this page",
            links: [
              { href: "#how", label: "How it works" },
              { href: "#try", label: "Try it live" },
              { href: "#compare", label: "Compare stones" },
              { href: "#loop", label: "Stock to enquiry" },
              { href: "#faq", label: "FAQ" },
            ],
          },
        ]}
        demo={DEMO_MAIL}
      />

      <main id="main">
        {/* ---------- Hero ---------- */}
        <section className="v-hero" aria-labelledby="v-title">
          <div className="v-hero__ground" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img {...pic("/stone/statuarietto.jpg", 2400, 2214, "(min-width: 64rem) 100vw, 150vw", true)} alt="" />
          </div>
          <div className="v-hero__copy">
            <p className="v-hero__kicker x-label">
              <span className="v-hero__product">StoneVision</span> for stone yards &amp; showrooms
            </p>
            <h1 id="v-title" className="v-hero__title">
              <span>Your slab, on their floor.</span> <span>Before they visit.</span>
            </h1>
            <p className="v-hero__lede">
              Buyers add a room photo and see your real slab on their floor. Their enquiry comes
              back to you.
            </p>
            <div className="v-hero__ctas">
              <a href={DEMO_MAIL} className="x-btn x-btn--signal v-cta">
                Book a demo <span aria-hidden="true">→</span>
              </a>
              <a href="#try" className="x-link-cut">
                Try it live <span aria-hidden="true">↓</span>
              </a>
            </div>
            <ul className="v-hero__facts">
              <li>Your real slab photo</li>
              <li>The room’s own light</li>
              <li>Photo stays on their phone</li>
            </ul>
          </div>
          <figure className="v-hero__visual">
            <BeforeAfter
              before={room("room-hall", "(min-width: 64rem) 55vw, 100vw", true)}
              after={result("result-hall-statuarietto", "(min-width: 64rem) 55vw, 100vw", true)}
              alt="An open hall with its wooden floor replaced by Statuarietto marble slabs, laid by StoneVision, with the window light kept on the stone."
              w={1600}
              h={1066}
              start={38}
              intro
            >
              <Chip x={0.97} y={0.83} end>
                Statuarietto · its own slab photo
              </Chip>
              <Chip x={0.66} y={0.61}>
                Window light, kept
              </Chip>
            </BeforeAfter>
            <figcaption className="x-label">
              Made by StoneVision · demo room and slab · drag to compare
            </figcaption>
          </figure>
        </section>

        {/* ---------- How it works ---------- */}
        <section id="how" className="v-sec v-sec--light" aria-labelledby="v-how">
          <div className="v-head v-reveal">
            <p className="x-label v-head__no">How it works</p>
            <h2 id="v-how" className="v-head__title">
              From your stock to their room.
            </h2>
          </div>
          {/* On a phone the three steps are a row to swipe through. */}
          <div className="v-steps-scroll" tabIndex={0} role="region" aria-label="How it works, in three steps">
          <ol className="v-steps">
            <li className="v-step" style={{ "--i": 0 } as CSSProperties}>
              <div className="v-step__pic">
                <Window w={INV.w} h={INV.h} v={INV_VIEW} sizes="(min-width: 56rem) 60vw, 160vw">
                  <span
                    className="v-mark"
                    style={{
                      left: pc((INV_BUTTON.x - INV_VIEW.x) / INV_VIEW.w),
                      top: pc((INV_BUTTON.y - INV_VIEW.y) / INV_VIEW.h),
                      width: pc(INV_BUTTON.w / INV_VIEW.w),
                      height: pc(INV_BUTTON.h / INV_VIEW.h),
                    }}
                  >
                    <span>Opens StoneVision</span>
                  </span>
                </Window>
              </div>
              <p className="x-label v-step__no">1 · You</p>
              <h3 className="v-step__title">Pick the slab</h3>
              <p>From your Showroom, or straight from your stock.</p>
            </li>
            <li className="v-step" style={{ "--i": 1 } as CSSProperties}>
              <div className="v-step__pic">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img {...room("room-bright", "(min-width: 56rem) 32vw, 85vw")} alt="A bright, empty room with a wooden floor." loading="lazy" />
                <Chip x={0.04} y={0.08}>
                  Their photo
                </Chip>
              </div>
              <p className="x-label v-step__no">2 · Your buyer</p>
              <h3 className="v-step__title">Adds their room</h3>
              <p>A photo that never leaves their phone.</p>
            </li>
            <li className="v-step" style={{ "--i": 2 } as CSSProperties}>
              <div className="v-step__pic">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  {...result("result-bright-statuarietto", "(min-width: 56rem) 32vw, 85vw")}
                  alt="The same room with Statuarietto marble slabs laid on its floor by StoneVision."
                  loading="lazy"
                />
                <Chip x={0.04} y={0.08}>
                  Floor found · slab laid
                </Chip>
              </div>
              <p className="x-label v-step__no">3 · StoneVision</p>
              <h3 className="v-step__title">Lays it on their floor</h3>
              <p>In the room’s own light and perspective.</p>
            </li>
          </ol>
          </div>
        </section>

        {/* ---------- Live demo ---------- */}
        <section id="try" className="v-sec v-sec--ink v-try" aria-labelledby="v-try">
          <div className="v-head v-reveal">
            <p className="x-label v-head__no">Live demo</p>
            <h2 id="v-try" className="v-head__title">
              Try it now. Our room, or yours.
            </h2>
            <p className="v-head__text">The real StoneVision, in your browser.</p>
          </div>
          <StoneVisionDemo />
        </section>

        {/* ---------- Compare ---------- */}
        <section id="compare" className="v-sec v-sec--light" aria-labelledby="v-compare">
          <div className="v-head v-reveal">
            <p className="x-label v-head__no">Compare</p>
            <h2 id="v-compare" className="v-head__title">
              Same room. Another stone. One tap.
            </h2>
          </div>
          <div className="v-pair">
            <figure>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img {...result("result-bright-statuarietto", "(min-width: 48rem) 48vw, 100vw")} alt="A bright room with a Statuarietto marble floor, by StoneVision." loading="lazy" />
              <figcaption>
                <b>Statuarietto</b> marble
              </figcaption>
            </figure>
            <figure>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img {...result("result-bright-azul", "(min-width: 48rem) 48vw, 100vw")} alt="The same room with an Azul Macaubas quartzite floor, by StoneVision." loading="lazy" />
              <figcaption>
                <b>Azul Macaubas</b> quartzite
              </figcaption>
            </figure>
          </div>
          <p className="v-cap x-label">Both made by StoneVision · demo room and slabs</p>
        </section>

        {/* ---------- Loop: stock → enquiry ---------- */}
        <section id="loop" className="v-sec v-sec--deep v-loop" aria-labelledby="v-loop">
          <div className="v-head v-reveal">
            <p className="x-label v-head__no">Stock to enquiry</p>
            <h2 id="v-loop" className="v-head__title">
              Every picture leads back to a real slab.
            </h2>
          </div>
          <div className="v-loop__body">
            <ol className="v-chain">
              <li>
                <b>In your stock</b>
                <span>Each slab in StoneX has its code and its own photo.</span>
              </li>
              <li>
                <b>In your Showroom</b>
                <span>Buyers browse what’s available, online.</span>
              </li>
              <li>
                <b>On their floor</b>
                <span>They try the slab in StoneVision.</span>
              </li>
              <li>
                <b>In your Leads</b>
                <span>Their quote request arrives with that slab.</span>
              </li>
            </ol>
            <figure className="v-lead">
              <div className="v-lead__card">
                <p className="v-lead__tag x-label">New lead</p>
                <p className="v-lead__stone">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img {...pic("/stone/statuarietto-slab.jpg", 1240, 2214, "56px")} alt="" loading="lazy" />
                  <span>
                    <b>Statuarietto</b>
                    <small>Block DEMO-B01</small>
                  </span>
                </p>
                <p className="v-lead__msg">“Slab DEMO-B01-S01 — I tried it on a photo of my floor.”</p>
                <p className="v-lead__reply">Reply on WhatsApp</p>
              </div>
              <figcaption className="x-label">Drawn to explain · StoneVision’s own message</figcaption>
            </figure>
          </div>
        </section>

        {/* ---------- What buyers get ---------- */}
        <section className="v-sec v-sec--light" aria-labelledby="v-gets">
          <div className="v-head v-reveal">
            <p className="x-label v-head__no">What buyers get</p>
            <h2 id="v-gets" className="v-head__title">
              A picture they can trust.
            </h2>
          </div>
          <ul className="v-gets">
            {GETS.map(([title, text, icon], i) => (
              <li key={title} style={{ "--i": i } as CSSProperties}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  {icon}
                </svg>
                <h3>{title}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* ---------- FAQ + Book a demo ---------- */}
        <section id="faq" className="v-sec v-sec--light v-faq" aria-labelledby="v-faq">
          <div className="v-faq__lead">
            <p className="x-label v-head__no">Questions</p>
            <h2 id="v-faq" className="v-head__title">
              Let buyers see it at home.
            </h2>
            <p className="v-faq__text">Book a demo and we’ll show StoneVision on your own slabs.</p>
            <a href={DEMO_MAIL} className="x-btn x-btn--signal v-cta">
              Book a demo <span aria-hidden="true">→</span>
            </a>
          </div>
          <div className="v-chat">
            {FAQ.map(([q, a]) => (
              <details key={q} name="faq" className="v-chat__item">
                <summary>
                  <span className="v-chat__q">{q}</span>
                  <span className="v-chat__plus" aria-hidden="true" />
                </summary>
                <div className="v-chat__a">
                  <span className="v-chat__who" aria-hidden="true" />
                  <p>{a}</p>
                </div>
              </details>
            ))}
          </div>
        </section>
      </main>

      <footer className="v-foot x-label">
        <span className="x-wordmark v-foot__mark">
          <span aria-hidden="true">
            Sh
            <span className="x-wordmark__i">
              ı<span className="x-wordmark__dot" />
            </span>
            laTeq
          </span>
          <span className="sr-only">ShilaTeq</span>
        </span>
        <span>rooms: Unsplash · stones: sample slabs · pictures made by StoneVision</span>
        <span>© 2026 ShilaTeq</span>
      </footer>
    </div>
  );
}
