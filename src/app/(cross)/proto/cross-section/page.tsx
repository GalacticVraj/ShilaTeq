import type { CSSProperties } from "react";
import { getImageProps } from "next/image";
import QR from "qrcode";

/**
 * Cross-Section prototype — C1 "The Cut" hero and section 2 (the StoneX reveal)
 * only, for review. Every product statement here maps to verified StoneX code
 * (Phase 0 audit); the block record and the screenshot are fictional sample data.
 */

const DEMO_MAIL = "mailto:shilateq@gmail.com?subject=" + encodeURIComponent("StoneX demo request");

// Statuarietto marble, James St. John, CC BY 2.0 (Wikimedia Commons). Stands in
// until ShilaTeq photographs a real yard.
const STONE_SOURCE =
  "https://commons.wikimedia.org/wiki/File:Statuarietto_White_Marble_(Apuan_Marble_Formation,_Tertiary_metamorphism_of_Jurassic_limestones;_Carrara_region,_Italy)_2_(41756462202).jpg";

// A real StoneX screen in mock mode (fictional "Demo Stone Yard"), captured at 2×.
const SHOT = { src: "/product/stonex/inventory-demo.png", w: 2880, h: 1716 };

/**
 * The camera move as CSS variables, for one frame shape (`name`). At rest the
 * crop (screenshot pixels; its height follows from the frame's aspect) fills the
 * frame. In motion the screen starts whole, fitted to the frame's width and
 * centred, and only `scale` changes: about the one point that sits in the same
 * place in both framings, so the camera pushes straight in.
 */
function pushIn(name: string, aspect: number, crop: { x: number; y: number; w: number }) {
  const s = SHOT.w / crop.w;
  // The whole screen's vertical offset, in its own heights (0 when the frame has its shape).
  const ty = (SHOT.w / SHOT.h / aspect - 1) / 2;
  const pct = (n: number) => `${+(n * 100).toFixed(3)}%`;
  return {
    [`--aspect-${name}`]: aspect,
    [`--s-${name}`]: +s.toFixed(4),
    [`--ty-${name}`]: pct(ty),
    [`--fx-${name}`]: pct(((crop.x / SHOT.w) * s) / (s - 1)),
    [`--fy-${name}`]: pct((ty + (crop.y / SHOT.h) * s) / (s - 1)),
    // The frame's top and bottom margins around the whole screen, in frame heights.
    [`--open-${name}`]: pct((1 - (aspect * SHOT.h) / SHOT.w) / 2),
  };
}

const reveal = {
  // Phones: a tall frame; the push-in lands on the block column, readable at 320px.
  ...pushIn("phone", 4 / 5, { x: 641, y: 665, w: 626 }),
  // From 44rem: the screen's own shape; it lands on block, size, place and status.
  ...pushIn("wide", SHOT.w / SHOT.h, { x: 634, y: 665, w: 1532 }),
} as CSSProperties;

export default async function CrossSectionPrototype() {
  // One photograph behind both sides of the cut. Desktop draws it larger than
  // its box (a vein-focused zoom), so it asks for more pixels; on phones most of
  // it sits under shade, so a viewport-width file is enough (and keeps LCP down).
  const { props: stone } = getImageProps({
    src: "/stone/statuarietto.jpg",
    width: 2400,
    height: 2214,
    alt: "",
    sizes: "(min-width: 64rem) 82vw, 100vw",
    fetchPriority: "high",
    loading: "eager",
  });

  // Drawn at up to ~1.9× its box (wide) and ~4.6× (phones): the full-size file.
  const { props: shot } = getImageProps({
    src: SHOT.src,
    width: SHOT.w,
    height: SHOT.h,
    alt: "StoneX inventory for a fictional demo yard: each block listed with its code, stone, size, place in the yard, status, age and price per square foot.",
    sizes: "(min-width: 44rem) 190vw, 460vw",
  });

  // A real QR, but it only carries text: the sample record has no page to open.
  const qr = await QR.toString("SY-B0021 · sample record · fictional yard (ShilaTeq prototype)", {
    type: "svg",
    margin: 1,
    errorCorrectionLevel: "M",
    color: { dark: "#111715", light: "#f3f6f2" },
  });

  return (
    <>
      <p className="x-ribbon x-label">
        Prototype · fictional data
        <span className="hidden sm:inline"> · hero + section 2 only · not for publication</span>
      </p>

      <header className="x-header">
        <div className="x-wrap x-header__inner">
          <a href="#main" className="x-wordmark" aria-label="ShilaTeq">
            <span aria-hidden="true">
              Sh
              <span className="x-wordmark__i">
                ı<span className="x-wordmark__dot" />
              </span>
              laTeq
            </span>
          </a>
          <nav aria-label="Primary" className="x-nav">
            <a href="#stonex">StoneX ERP</a>
            {/* Not built in this prototype: shown for layout only, deliberately not links. */}
            {["StoneVision", "About"].map((item) => (
              <span key={item}>
                {item}
                <span className="sr-only"> (not built in this prototype)</span>
              </span>
            ))}
          </nav>
          <a href={DEMO_MAIL} className="x-btn x-btn--signal x-btn--small x-header__cta">
            Book a demo
          </a>
        </div>
      </header>

      <main id="main">
        {/* The cut divides the hero: the stone and the promise above it, the
            record and the product message below it (on phones and desktop). */}
        <section className="x-hero" aria-labelledby="hero-title">
          <div className="x-wrap x-hero__grid">
            <div className="x-hero__above">
              <p className="x-hero__eyebrow x-label">
                <span className="x-hero__products">StoneX ERP + StoneVision</span> · for marble,
                granite and stone yards
              </p>
              <h1 id="hero-title" className="x-hero__title x-display">
                <span className="x-line">
                  <span style={{ "--i": 0 } as CSSProperties}>Know every block.</span>
                </span>
                <span className="x-line">
                  <span style={{ "--i": 1 } as CSSProperties}>Sell every slab.</span>
                </span>
              </h1>
            </div>

            <div className="x-hero__below">
              <p className="x-hero__lede">
                <strong>StoneX ERP</strong> puts a QR code on every block and slab and follows it
                from arrival to cutting, sale, dispatch and payment. <strong>StoneVision</strong>{" "}
                lets your buyers see your real slabs on their own floor.
              </p>
              <div className="x-hero__actions">
                <a href={DEMO_MAIL} className="x-btn x-btn--signal">
                  Book a demo
                </a>
                <a href="#stonex" className="x-link-cut">
                  See how StoneX works <span aria-hidden="true">↓</span>
                </a>
              </div>
              <p className="x-hero__credit">
                Stone:{" "}
                <a href={STONE_SOURCE} rel="noopener noreferrer">
                  Statuarietto marble
                </a>{" "}
                by James St. John,{" "}
                <a href="https://creativecommons.org/licenses/by/2.0/" rel="noopener noreferrer">
                  CC BY 2.0
                </a>
                , cropped.
              </p>
            </div>

            {/* One photograph spanning the rows above, across and just below the
                cut (subgrid), so the cut can sit wherever the headline ends. */}
            <div className="x-stone" aria-hidden="true">
              {/* next/image's optimised srcset as a plain server-rendered <img>. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img {...stone} alt="" className="x-stone__img" />
              <div className="x-stone__shade x-stone__shade--upper" />
              <div className="x-stone__gap" />
              <div className="x-stone__shade x-stone__shade--lower" />
            </div>
            <div className="x-kerf" aria-hidden="true" />

            <article className="x-record" aria-label="Sample block record (fictional)">
              <div className="x-record__head">
                <div>
                  <p className="x-record__tag x-label">Sample · fictional yard</p>
                  <p className="x-record__code">SY-B0021</p>
                  <p className="x-record__name">Statuarietto · Marble</p>
                </div>
                <div
                  className="x-record__qr"
                  role="img"
                  aria-label="QR tag for SY-B0021"
                  dangerouslySetInnerHTML={{ __html: qr }}
                />
              </div>
              <dl className="x-record__fields">
                <div>
                  <dt className="x-label">Size</dt>
                  <dd>11 × 5.4 ft</dd>
                </div>
                <div>
                  <dt className="x-label">Grade</dt>
                  <dd>A</dd>
                </div>
                <div>
                  <dt className="x-label">In the yard</dt>
                  <dd>Zone A · Row 2</dd>
                </div>
                <div>
                  <dt className="x-label">Status</dt>
                  <dd className="x-chip">Available</dd>
                </div>
              </dl>
              <p className="x-record__note">
                Cost, supplier and price never appear when someone outside the yard scans a tag.
              </p>
            </article>
          </div>
        </section>

        <div className="x-strata" aria-hidden="true">
          <div className="x-strata__cut" />
        </div>

        {/* One real screen, one camera move. Pure CSS: the resting state is the
            readable crop; where scroll timelines exist the move plays on scroll. */}
        <section
          id="stonex"
          className="x-reveal on-light"
          aria-labelledby="stonex-title"
          style={reveal}
        >
          <div className="x-wrap x-reveal__head">
            <p className="x-reveal__eyebrow x-label">StoneX ERP</p>
            <h2 id="stonex-title" className="x-reveal__title x-display">
              Your yard, <span className="x-accent">on one screen.</span>
            </h2>
            <p className="x-reveal__line">
              Stock, cutting, orders, dispatch and payments. Every block and slab on record.
            </p>
          </div>
          <div className="x-reveal__track">
            <div className="x-wrap x-reveal__stage">
              <figure className="x-reveal__fit">
                <div className="x-reveal__view">
                  {/* The cut opens on this layer; the frame (above) opens on phones. */}
                  <div className="x-reveal__cut">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img {...shot} alt={shot.alt} className="x-reveal__img" />
                  </div>
                </div>
                <figcaption className="x-reveal__cap x-label">
                  StoneX · Inventory · fictional demo yard
                </figcaption>
              </figure>
            </div>
          </div>
          <p className="x-wrap">
            {/* The StoneX page is not built in this prototype: shown for layout only. */}
            <span className="x-reveal__fit x-reveal__next">
              <span className="x-link-cut">
                Explore StoneX <span aria-hidden="true">→</span>
              </span>
              <span className="sr-only"> (page not built in this prototype)</span>
            </span>
          </p>
        </section>

        {/* Quiet strata from the light chapter back into obsidian (no signal run-out here). */}
        <div className="x-strata x-strata--quiet" aria-hidden="true" />

        <footer className="x-end">
          <div className="x-wrap x-label">
            End of prototype · Showroom, StoneVision and Book a demo are not built yet.
          </div>
        </footer>
      </main>
    </>
  );
}
