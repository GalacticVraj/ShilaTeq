import type { Metadata } from "next";
import { getImageProps } from "next/image";
import { Contact, waLink } from "@/components/cross/Contact";
import { SiteHeader } from "@/components/cross/SiteHeader";
import HeroCompare from "./HeroCompare";
import HowItWorks from "./HowItWorks";
import BacklitStone from "./BacklitStone";
import { DEMO_STONES, thumb } from "./demo";
import StoneVisionDemo from "./StoneVisionDemo";
import "./vision.css";

/**
 * the StoneVision product page (/stonevision).
 *   Hero     the promise, on the home page's marble; a real result, before and after
 *   Demo     StoneVision itself, live (StoneX's engine, src/vendor/stonex-vision)
 *   How      one scrolled scene: the slab, their room, the slab laid on their floor
 *   FAQ      as a conversation, beside Book a demo
 * Every claim is checked against StoneX's code (read-only, eb9a0d8). Pictures: free Unsplash rooms
 * and sample slabs, laid by StoneVision itself (public/vision-demo).
 */

export const metadata: Metadata = {
  title: "StoneVision — ShilaTeq",
};

const DEMO_MAIL =
  "mailto:shilateq@gmail.com?subject=" + encodeURIComponent("StoneVision demo request");
const WA = waLink("Hi ShilaTeq, I'd like a demo of StoneVision for my yard.");
const V = "/vision-demo";

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
];

// The hero's results, one per demo stone (in DEMO_STONES' order): public/vision-demo/result-hall-*.jpg
const HERO_RESULT = ["statuarietto", "azul", "black-galaxy", "calacatta-gold"];
const HERO_SIZES = "(min-width: 64rem) 55vw, 100vw";
const STORY_SIZES = "(min-width: 64rem) 60vw, 100vw";
// How it works: the slabs on the rack (name, public/stone file, its size); the third is picked.
const RACK: [string, string, number, number][] = [
  ["Azul Macaubas", "azul-macaubas", 2048, 1639],
  ["Black Galaxy", "black-galaxy", 2048, 1113],
  ["Statuarietto", "statuarietto-slab", 1240, 2214],
  ["Calacatta Gold", "calacatta-gold", 2048, 767],
  ["Rockville White", "rockville-white", 1600, 1163],
];

/** An image at the sizes it is shown at (Next's optimiser picks the file for each screen). */
const pic = (src: string, w: number, h: number, sizes: string, eager = false) =>
  getImageProps({
    src,
    width: w,
    height: h,
    alt: "",
    sizes,
    ...(eager ? { loading: "eager", fetchPriority: "high" } : {}),
  }).props;
// The demo pictures: 2000 × 1333 photos; StoneVision's results at its 1600 px render size.
const room = (name: string, sizes: string, eager = false) =>
  pic(`${V}/${name}.jpg`, 2000, 1333, sizes, eager);
const result = (name: string, sizes: string, eager = false) =>
  pic(`${V}/${name}.jpg`, 1600, 1066, sizes, eager);

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
              { href: "#faq", label: "FAQ" },
            ],
          },
        ]}
        demo={WA}
      />

      <main id="main">
        {/* ---------- Hero ---------- */}
        <section className="v-hero" aria-labelledby="v-title">
          <div className="v-hero__ground" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              {...pic(
                "/stone/statuarietto.jpg",
                2400,
                2214,
                "(min-width: 64rem) 100vw, 150vw",
                true,
              )}
              alt=""
            />
          </div>
          <div className="v-hero__copy">
            <p className="v-hero__kicker x-label">
              <span className="v-hero__product">StoneVision</span> for stone yards &amp; showrooms
            </p>
            <h1 id="v-title" className="v-hero__title">
              <span>Your slab, on their floor.</span> <span>Before they visit.</span>
            </h1>
            <p className="v-hero__lede">Buyers try your real slab on a photo of their room.</p>
            <div className="v-hero__ctas">
              <a href="#try" className="x-btn x-btn--signal v-cta">
                Try it on a room <span aria-hidden="true">↓</span>
              </a>
              <a href={WA} className="x-link-cut" target="_blank" rel="noopener noreferrer">
                <span className="v-wide">Book a demo on WhatsApp</span>
                <span className="v-narrow">WhatsApp us</span> <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
          <figure className="v-hero__visual">
            <HeroCompare
              before={room("room-hall", HERO_SIZES, true)}
              stones={DEMO_STONES.map((st, k) => ({
                name: st.name,
                type: st.type,
                swatch: thumb(st.thumbUrl, 128),
                after: result(`result-hall-${HERO_RESULT[k]}`, HERO_SIZES, k === 0),
              }))}
            />
            <figcaption className="x-label">
              Made by StoneVision · demo room and slabs · drag to compare, tap a stone
            </figcaption>
          </figure>
        </section>

        {/* ---------- Live demo ---------- */}
        <section id="try" className="v-sec v-sec--ink v-try" aria-labelledby="v-try">
          <div className="v-head v-reveal">
            <p className="x-label v-head__no">Live demo</p>
            <h2 id="v-try" className="v-head__title">
              Now try your own room.
            </h2>
            <p className="v-head__text">
              Take a photo of any room and pick a stone. This is the real StoneVision, the one your
              buyers would use.
            </p>
          </div>
          <StoneVisionDemo />
        </section>

        {/* ---------- How it works ---------- */}
        <section id="how" className="v-sec v-how" aria-labelledby="v-how">
          <div className="v-head v-reveal">
            <p className="x-label v-head__no">How it works</p>
            <h2 id="v-how" className="v-head__title">
              From your stock to their room.
            </h2>
          </div>
          <HowItWorks
            pick={2}
            rack={RACK.map(([name, file, w, h]) => ({
              name,
              img: pic(`/stone/${file}.jpg`, w, h, "(min-width: 64rem) 16vw, 40vw"),
            }))}
            room={room("room-living", STORY_SIZES)}
            laid={result("result-living-statuarietto", STORY_SIZES)}
          />
        </section>

        {/* ---------- Backlit stone ---------- */}
        <section className="v-sec v-glowsec" aria-labelledby="v-glow">
          <div className="v-glowsec__head">
            <p className="x-label v-head__no">Stone, alive</p>
            <h2 id="v-glow" className="v-head__title">
              Put a lamp behind it.
            </h2>
            <p className="v-head__text">
              Onyx and thin marble let light through. Move the lamp, or drag it on your phone, and
              watch the stone glow from within.
            </p>
          </div>
          {/* ponytail: stand-in slab until the owner's onyx photo arrives; add it to this list (first) */}
          <BacklitStone stones={[{ name: "Calacatta Gold", src: "/stone/calacatta-gold.jpg" }]} />
        </section>

        {/* ---------- FAQ + Book a demo ---------- */}
        <section id="faq" className="v-sec v-sec--light v-faq" aria-labelledby="v-faq">
          <div className="v-faq__lead">
            <p className="x-label v-head__no">Questions</p>
            <h2 id="v-faq" className="v-head__title">
              Let buyers see it at home.
            </h2>
            <div className="v-faq__ctas">
              <a
                href={WA}
                className="x-btn x-btn--signal v-cta"
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp us <span aria-hidden="true">→</span>
              </a>
              <a href={DEMO_MAIL} className="x-link-cut">
                Or email
              </a>
            </div>
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
        <Contact />
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
