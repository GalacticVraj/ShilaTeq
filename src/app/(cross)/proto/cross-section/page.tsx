import type { CSSProperties } from "react";
import { getImageProps } from "next/image";
import QR from "qrcode";
import { EvidenceSteps, type Step } from "@/components/cross/EvidenceSteps";
import { SampleYardLazy } from "@/components/cross/SampleYardLazy";
import { YARD_STEPS } from "@/components/cross/sampleYardData";

/**
 * Cross-Section prototype — C1 "The Cut" hero and section 2 only, for review.
 * Every product statement here maps to verified StoneX code (Phase 0 audit);
 * the block record and both screenshots are fictional sample data.
 */

const DEMO_MAIL = "mailto:shilateq@gmail.com?subject=" + encodeURIComponent("StoneX demo request");

// Statuarietto marble, James St. John, CC BY 2.0 (Wikimedia Commons). Stands in
// until ShilaTeq photographs a real yard.
const STONE_SOURCE =
  "https://commons.wikimedia.org/wiki/File:Statuarietto_White_Marble_(Apuan_Marble_Formation,_Tertiary_metamorphism_of_Jurassic_limestones;_Carrara_region,_Italy)_2_(41756462202).jpg";

const steps: Step[] = [
  {
    tag: "Inventory & QR",
    question: "Where is that block, and is it still available?",
    answer:
      "Every block and slab carries its own QR tag. StoneX shows where it sits in the yard, whether it is available, reserved or sold, and how many days it has been there.",
    shot: "inventory",
    alt: "StoneX inventory for a fictional demo yard: blocks listed with size, yard zone, status and age.",
    // Marks sit in the whitespace just before the cell they explain.
    stage: {
      crop: { x: 560, y: 615, w: 1760 },
      pins: [
        { x: 1584, y: 818, label: "Where it sits in the yard" },
        { x: 1800, y: 1233, label: "Available, reserved or sold" },
      ],
    },
    phone: {
      crop: { x: 1530, y: 665, w: 780 },
      pins: [
        { x: 1575, y: 818, label: "Where it sits" },
        { x: 1810, y: 1094, label: "Available or not" },
      ],
    },
  },
  {
    tag: "Cutting",
    question: "What did this block turn into?",
    answer:
      "When a block is cut, the cut is recorded on a phone. Each slab carries the block's code and a share of its cost, and a leftover piece becomes a block of its own.",
    shot: "inventory",
    alt: "StoneX inventory for a fictional demo yard: blocks and slabs counted separately, each block with its own code.",
    stage: {
      crop: { x: 547, y: 158, w: 1382 },
      pins: [
        { x: 1410, y: 325, label: "Cut blocks are counted as slabs" },
        { x: 830, y: 798, label: "Every block has its own code" },
      ],
    },
    phone: {
      crop: { x: 559, y: 245, w: 900 },
      pins: [
        { x: 1420, y: 325, label: "Slabs from cut blocks" },
        { x: 880, y: 798, label: "Block code" },
      ],
    },
  },
  {
    tag: "Orders & dispatch",
    question: "Can I promise these slabs to this buyer?",
    answer:
      "Turning a quote into an order reserves those exact slabs, so they cannot be sold twice. Nothing is dispatched until a payment is recorded.",
    shot: "dashboard",
    alt: "StoneX dashboard for a fictional demo yard: orders reserved, processing and ready to dispatch, and deliveries.",
    stage: {
      crop: { x: 559, y: 763, w: 1500 },
      pins: [
        { x: 979, y: 1430, label: "Slabs reserved for orders" },
        { x: 1627, y: 1319, label: "Deliveries" },
      ],
    },
    phone: {
      crop: { x: 559, y: 1160, w: 740 },
      pins: [{ x: 979, y: 1430, label: "Reserved for orders" }],
    },
  },
  {
    tag: "Payments",
    question: "Who still owes us money?",
    answer:
      "The dashboard shows what is owed to you, what is overdue and what you owe, with every part-payment recorded.",
    shot: "dashboard",
    alt: "StoneX dashboard for a fictional demo yard: amounts to collect and to pay, and an overdue payment.",
    stage: {
      crop: { x: 559, y: 268, w: 1140 },
      pins: [
        { x: 936, y: 508, label: "Owed to you" },
        { x: 1454, y: 508, label: "What you owe" },
        { x: 1008, y: 806, label: "Overdue" },
      ],
    },
    phone: {
      crop: { x: 575, y: 380, w: 760 },
      pins: [
        { x: 936, y: 508, label: "Owed to you" },
        { x: 1008, y: 806, label: "Overdue" },
      ],
    },
  },
];

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
            {["StoneVision", "Sample yard", "About"].map((item) => (
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

        <section id="stonex" className="x-evidence on-light" aria-labelledby="stonex-title">
          <div className="x-wrap">
            <header className="x-evidence__head">
              <p className="x-evidence__eyebrow x-label">StoneX ERP</p>
              <h2 id="stonex-title" className="x-evidence__title x-display">
                The questions your yard asks <span className="x-accent">every day.</span>
              </h2>
              <p className="x-evidence__intro">
                Four everyday questions, answered from one record per block. The screens are StoneX
                itself, running a fictional demo yard.
              </p>
            </header>
            <EvidenceSteps steps={steps} />
          </div>
        </section>

        {/* Quiet strata from the light chapter back into obsidian (no signal run-out here). */}
        <div className="x-strata x-strata--quiet" aria-hidden="true" />

        <section id="sample-yard" className="x-yard" aria-labelledby="sample-yard-title">
          <div className="x-wrap">
            <header className="x-yard__head">
              <p className="x-label x-yard__eyebrow">
                <span className="x-yard__flag">Sample yard</span> · fictional data, real StoneX
                record formats
              </p>
              <h2 id="sample-yard-title" className="x-yard__h2 x-display">
                Follow one block.
              </h2>
              <p className="x-yard__intro">
                SY-B0021 arrives as a block and leaves as paid-for slabs. Each step is a record
                StoneX keeps. The yard, the buyer and every number here are fictional.
              </p>
            </header>
            <SampleYardLazy qr={qr} />
            {/* The island streams in behind JS; without JS the journey is still told in order. */}
            <noscript>
              <ol className="x-yard__static">
                {YARD_STEPS.map((step, i) => (
                  <li key={step.title}>
                    <p className="x-label x-yard__count">
                      Step {i + 1} of {YARD_STEPS.length}
                    </p>
                    <h3 className="x-yard__title x-display">{step.title}</h3>
                    <p className="x-label x-yard__status">Record · {step.status}</p>
                    <p className="x-yard__static-copy">{step.copy}</p>
                  </li>
                ))}
              </ol>
            </noscript>
          </div>
        </section>

        <footer className="x-end">
          <div className="x-wrap x-label">
            End of prototype · sections 4–6 (StoneVision, founders, demo booking) are not built.
          </div>
        </footer>
      </main>
    </>
  );
}
