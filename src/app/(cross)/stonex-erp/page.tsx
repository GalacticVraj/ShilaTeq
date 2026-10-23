import type { CSSProperties, ImgHTMLAttributes, ReactNode } from "react";
import type { Metadata } from "next";
import { getImageProps } from "next/image";
import { SiteHeader } from "@/components/cross/SiteHeader";
import YardSearch from "./YardSearch";
import "./erp.css";

/**
 * the StoneX ERP product page (/stonex-erp).
 *   Hero     what it is, in one line, on the real dashboard (labelled)
 *   Loop     the difference: yard → online showroom → the buyer's floor → a lead
 *   Screen   the real inventory screen, then four close-ups: the question each ends
 *   Search   StoneX's own search, live, as three steps
 *   Modules  everything else, one card each: what it is, what it saves
 *   Compare  the usual way against StoneX
 *   FAQ      as a conversation, beside the call to book a demo
 * Every claim is checked against the StoneX code (read-only). Every screen is
 * the fictional demo yard; the Showroom, room and lead are drawn, and say so.
 */

export const metadata: Metadata = {
  title: "StoneX ERP — ShilaTeq",
};

const DEMO_MAIL = "mailto:shilateq@gmail.com?subject=" + encodeURIComponent("StoneX demo request");

const DASH = { src: "/product/stonex/dashboard-demo.png", w: 2880, h: 1720, shown: 1240 };
const INV = { src: "/product/stonex/inventory-demo.png", w: 2880, h: 1716 };

// Red labels on the real screens: the element's box in the screenshot's own
// pixels, and the side its label sits on (chosen so no two labels meet and none
// covers what it names). `wide`: wide screens only.
type Mark = {
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
  side: "top" | "bottom" | "right" | "left" | "inside"; // left: in the margin beside the screen
  end?: true; // label aligned to the box's right edge
  wide?: true;
};
const HERO_MARKS: Mark[] = [
  { label: "Money to collect", x: 619, y: 403, w: 516, h: 167, side: "bottom" },
  { label: "Stock value, live", x: 1701, y: 403, w: 514, h: 167, side: "top" },
  { label: "What needs you today", x: 1320, y: 759, w: 733, h: 130, side: "top", wide: true },
];
const SCREEN_MARKS: Mark[] = [
  // The modules, group by group, named in the margin beside the sidebar.
  { label: "Dashboard & reports", x: 35, y: 150, w: 440, h: 205, side: "left" },
  { label: "Stock & Find Stone", x: 35, y: 377, w: 440, h: 200, side: "left" },
  { label: "Sales: leads to GST invoices", x: 35, y: 602, w: 440, h: 536, side: "left" },
  { label: "Purchases & suppliers", x: 35, y: 1163, w: 440, h: 202, side: "left" },
  { label: "Workers & payroll", x: 35, y: 1385, w: 440, h: 293, side: "left" },
  // And the screen itself.
  { label: "Arrivals → blocks → slabs", x: 576, y: 285, w: 821, h: 81, side: "right" },
  { label: "Show it on the buyer’s floor", x: 1917, y: 177, w: 406, h: 78, side: "top" },
  { label: "Stock value & old stock, live", x: 867, y: 452, w: 841, h: 43, side: "right" },
  { label: "Its own code", x: 658, y: 778, w: 350, h: 86, side: "top" },
  { label: "Size & sq ft", x: 1279, y: 782, w: 147, h: 78, side: "bottom" },
  { label: "Yard place", x: 1606, y: 796, w: 110, h: 46, side: "top" },
  { label: "Sold or reserved", x: 1853, y: 793, w: 176, h: 54, side: "bottom" },
  { label: "Days in yard", x: 2241, y: 799, w: 54, h: 39, side: "top" },
  { label: "QR label", x: 2739, y: 795, w: 46, h: 47, side: "bottom", end: true },
];

// A window on the inventory screen, in its pixels: the list itself, without the sidebar.
type View = { x: number; y: number; w: number; h: number };
const YARD_VIEW: View = { x: 560, y: 140, w: 1160, h: 860 };

// The site's bar, as on every page; on a phone its menu also lists this page.
const PRODUCTS = [
  { href: "/stonex-erp", label: "StoneX ERP", current: true },
  { href: "/stonevision", label: "StoneVision" },
  { href: "/showroom", label: "Showroom" },
];
const ON_THIS_PAGE = [
  {
    label: "On this page",
    links: [
      { href: "#loop", label: "How it sells" },
      { href: "#tour", label: "The screen" },
      { href: "#search", label: "Search" },
      { href: "#modules", label: "Modules" },
      { href: "#compare", label: "Compare" },
      { href: "#faq", label: "FAQ" },
    ],
  },
];

const SHOWROOM = [
  ["calacatta-gold", "Calacatta Gold"],
  ["black-galaxy", "Black Galaxy"],
  ["statuarietto", "Statuarietto"],
  ["tan-brown", "Tan Brown"],
] as const;

const MODULES: [string, string, string, ReactNode][] = [
  ["Stock & QR", "Every block and slab, coded and tagged.", "Find any piece fast.", <path key="i" d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 18h2v2h-2zM14 18h2M18 14h2" />],
  ["Cutting", "Block to slabs, wastage recorded.", "Know each slab’s real cost.", <path key="i" d="M3 5h18v14H3zM9 5v14M15 5v14" />],
  ["Sales", "Quote, order, GST invoice.", "Every sale on record.", <path key="i" d="M6 3h9l3 3v15H6zM9 10h6M9 14h6M9 18h3" />],
  ["Dispatch", "Gate pass and a QR for the driver.", "Know what left the gate.", <path key="i" d="M2 6h12v10H2zM14 9h4l3 3.5V16h-7M5.5 19.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM17.5 19.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />],
  ["Payments", "Cash, UPI, card or bank, per order.", "Know who owes you.", <path key="i" d="M3 7h18v12H3zM3 7l3-3h12l3 3M16 13h2" />],
  ["Workers", "Attendance, wages, advances, tasks.", "In Hindi, works offline.", <path key="i" d="M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M17 11a2.5 2.5 0 1 0 0-5M17 14c2.5.4 4 2.7 4 6" />],
  ["Purchases", "Orders to suppliers, stock received.", "Stock in without typing twice.", <path key="i" d="M3 4h2.5l2 11h11l2-8H6.2M9 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM17 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />],
  ["Reports", "P&L, margin, stock ageing.", "Export to Excel or PDF.", <path key="i" d="M4 20V11M10 20V5M16 20v-6M3 20h18" />],
];

// The usual way of running a yard, against StoneX. StoneX: checked in its code.
const VS = [
  ["Finding a slab", "Walk the yard", "Search it, or scan its QR"],
  ["“Will it suit my room?”", "They guess", "They see it on their floor"],
  ["Enquiries", "Lost in calls", "A lead, with the stone"],
  ["Selling twice", "Two promises, one block", "Reserved when ordered"],
  ["Money owed", "A ledger and memory", "On one screen"],
];

const FAQ: [string, string][] = [
  ["Who is StoneX for?", "Marble, granite and natural-stone yards: traders, processors and anyone who buys blocks and sells slabs."],
  [
    "How do buyers find my stone?",
    "Your available stock is in your online Showroom. Share its link on WhatsApp. Buyers browse, search in plain words, even “safed marble”, and try a slab on their floor with StoneVision.",
  ],
  [
    "What happens when a buyer enquires?",
    "It lands in StoneX as a lead with the stone they chose. Reply on WhatsApp in one tap, then quote, order and invoice in StoneX.",
  ],
  ["Will my yard team use it?", "Worker screens are in Hindi and English, run on a phone, and keep working offline."],
  ["Does it connect to Tally?", "Not directly. Every report exports to Excel or PDF."],
];

const pc = (n: number) => `${+(n * 100).toFixed(3)}%`;

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

/** Red labels on a screenshot `w` × `h` px: an outline on each element, its name beside. */
function Marks({ marks, w, h }: { marks: Mark[]; w: number; h: number }) {
  return marks.map((m, i) => (
    <span
      key={m.label}
      className="e-mark"
      data-side={m.side}
      data-end={m.end ? "" : undefined}
      data-wide={m.wide ? "" : undefined}
      aria-hidden="true"
      style={
        {
          "--i": i,
          left: pc(m.x / w),
          top: pc(m.y / h),
          width: pc(m.w / w),
          height: pc(m.h / h),
        } as CSSProperties
      }
    >
      <span className="e-mark__label">{m.label}</span>
    </span>
  ));
}

/** A window on the inventory screenshot: just the part `v`, at its own shape. */
function Window({ img, v, className }: { img: ImgHTMLAttributes<HTMLImageElement>; v: View; className?: string }) {
  return (
    <span className={["e-win", className].filter(Boolean).join(" ")} style={{ aspectRatio: `${v.w} / ${v.h}` }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        {...img}
        alt=""
        style={{ width: pc(INV.w / v.w), left: pc(-v.x / v.w), top: pc(-v.y / v.h) }}
      />
    </span>
  );
}

export default function StonexErpPage() {
  const { props: dash } = getImageProps({
    src: DASH.src,
    width: DASH.w,
    height: DASH.h,
    alt: "",
    sizes: "(min-width: 64rem) 55vw, 100vw",
    fetchPriority: "high",
    loading: "eager",
  });
  const { props: ground } = getImageProps({
    src: "/stone/statuarietto.jpg",
    width: 2400,
    height: 2214,
    alt: "",
    sizes: "(min-width: 64rem) 100vw, 150vw",
    loading: "eager",
  });
  const { props: inv } = getImageProps({
    src: INV.src,
    width: INV.w,
    height: INV.h,
    alt: "",
    sizes: "(min-width: 64rem) 80vw, 100vw",
  });
  const { props: yard } = getImageProps({
    src: INV.src,
    width: INV.w,
    height: INV.h,
    alt: "",
    sizes: "(min-width: 64rem) 60vw, 240vw",
  });
  const slabImg = (sizes: string) =>
    getImageProps({ src: "/stone/statuarietto-slab.jpg", width: 1240, height: 2214, alt: "", sizes }).props;
  const stone = (file: string) =>
    getImageProps({ src: `/stone/${file}.jpg`, width: 1200, height: 1200, alt: "", sizes: "12rem" }).props;

  return (
    <div className="e-page">
      <SiteHeader
        home={{ href: "/", label: "ShilaTeq home" }}
        links={PRODUCTS}
        more={ON_THIS_PAGE}
        demo={DEMO_MAIL}
      />

      <main id="main">
        {/* ---------- Hero ---------- */}
        <section className="e-hero" aria-labelledby="e-title">
          {/* The home page's ground: the same Statuarietto under the same wash. */}
          <div className="e-hero__ground" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img {...ground} alt="" />
          </div>
          <div className="e-hero__copy">
            <p className="e-hero__kicker x-label">
              <span className="e-hero__product">StoneX ERP</span> for marble &amp; granite yards
            </p>
            <h1 id="e-title" className="e-hero__title">
              <span>Run your stone yard.</span> <span>Reach more buyers.</span>
            </h1>
            <p className="e-hero__lede">
              Stock, cutting, sales and payments in one system. And your stock online, for buyers.
            </p>
            <div className="e-hero__ctas">
              <a href={DEMO_MAIL} className="x-btn x-btn--signal e-cta">
                Book a demo <span aria-hidden="true">→</span>
              </a>
              <a href="#loop" className="x-link-cut">
                How it works <span aria-hidden="true">↓</span>
              </a>
            </div>
            <ul className="e-hero__facts">
              <li>QR on every block &amp; slab</li>
              <li>GST invoices</li>
              <li>Hindi worker screens</li>
            </ul>
          </div>
          <figure className="e-hero__visual">
            <span className="e-hero__screen">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                {...dash}
                alt="The StoneX dashboard for a fictional demo yard: money to collect and to pay, stock value, sales this month, and what needs attention."
              />
              <Marks marks={HERO_MARKS} w={DASH.w} h={DASH.shown} />
            </span>
            <figcaption className="x-label">The StoneX dashboard · fictional demo yard</figcaption>
          </figure>
        </section>

        {/* ---------- Loop: the difference ---------- */}
        <section id="loop" className="e-sec e-sec--light e-loop" aria-labelledby="e-loop-title">
          <div className="e-head e-reveal">
            <p className="x-label e-head__no">What makes StoneX different</p>
            <h2 id="e-loop-title" className="e-head__title">
              From your yard to the buyer’s floor.
            </h2>
          </div>
          <ol className="e-loop__steps">
            <li className="e-loop__step" style={{ "--i": 0 } as CSSProperties}>
              <div className="e-loop__pic e-loop__pic--yard" aria-hidden="true">
                <Window img={yard} v={YARD_VIEW} className="e-loop__window" />
              </div>
              <p className="e-loop__no x-label">1 · Your yard</p>
              <h3 className="e-loop__title">Every slab in StoneX</h3>
              <p>Coded, QR-tagged and priced.</p>
            </li>
            <li className="e-loop__step" style={{ "--i": 1 } as CSSProperties}>
              <div className="e-loop__pic e-loop__pic--show" aria-hidden="true">
                <span className="e-phone">
                  <span className="e-phone__switch">
                    <span>Explore stones</span>
                    <span>Visualize in your room</span>
                  </span>
                  <span className="e-phone__grid">
                    {SHOWROOM.map(([file, name]) => (
                      <span key={file} className="e-phone__stone">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img {...stone(file)} alt="" />
                        <span>{name}</span>
                      </span>
                    ))}
                  </span>
                </span>
              </div>
              <p className="e-loop__no x-label">2 · Your showroom</p>
              <h3 className="e-loop__title">Online by itself</h3>
              <p>Only available stone shows.</p>
            </li>
            <li className="e-loop__step" style={{ "--i": 2 } as CSSProperties}>
              <div className="e-loop__pic e-loop__pic--room" aria-hidden="true">
                <span className="e-room">
                  <span className="e-room__wall">
                    <span className="e-room__window" />
                  </span>
                  <span className="e-room__floor">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img {...slabImg("20rem")} alt="" />
                  </span>
                  <span className="e-room__corners" />
                </span>
              </div>
              <p className="e-loop__no x-label">3 · Their room</p>
              <h3 className="e-loop__title">Seen on their floor</h3>
              <p>Your slab on their room photo.</p>
            </li>
            <li className="e-loop__step" style={{ "--i": 3 } as CSSProperties}>
              <div className="e-loop__pic e-loop__pic--lead" aria-hidden="true">
                <span className="e-lead">
                  <span className="e-lead__tag x-label">New lead</span>
                  <span className="e-lead__stone">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img {...slabImg("4rem")} alt="" />
                    <span>
                      <b>Statuarietto</b>
                      <small>tried on their floor</small>
                    </span>
                  </span>
                  <span className="e-lead__reply">Reply on WhatsApp</span>
                </span>
              </div>
              <p className="e-loop__no x-label">4 · Your lead</p>
              <h3 className="e-loop__title">Back in StoneX</h3>
              <p>With the stone they chose.</p>
            </li>
          </ol>
          <p className="e-loop__back">
            <span aria-hidden="true">↺</span> Then quote, order and invoice, all in StoneX.
          </p>
          <p className="e-cap x-label">Yard: fictional demo · the rest drawn to explain</p>
        </section>

        {/* ---------- Tour: the real screen ---------- */}
        <section id="tour" className="e-sec e-sec--ink e-toursec" aria-labelledby="e-tour-title">
          <div className="e-head e-reveal">
            <p className="x-label e-head__no">The screen</p>
            <h2 id="e-tour-title" className="e-head__title">
              Your whole yard on one screen.
            </h2>
          </div>
          <figure className="e-screen">
            {/* On a phone it scrolls sideways, big enough to read its labels. */}
            <div className="e-screen__scroll" tabIndex={0} role="region" aria-label="StoneX inventory screen, labelled">
              <div className="e-screen__shot">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  {...inv}
                  alt="StoneX inventory for a fictional demo yard, labelled: its modules (dashboard and reports; stock and Find Stone; sales from leads to GST invoices; purchases and suppliers; workers and payroll); arrivals, blocks and slabs; show it on the buyer’s floor; stock value and old stock, live; and on each block its own code, size and square feet, yard place, sold or reserved, days in the yard and its QR label."
                />
                <Marks marks={SCREEN_MARKS} w={INV.w} h={INV.h} />
              </div>
            </div>
            <figcaption className="x-label">
              StoneX inventory · fictional demo yard
              <span className="e-screen__swipe"> · swipe to see it all</span>
            </figcaption>
          </figure>
        </section>

        {/* ---------- Search ---------- */}
        <section id="search" className="e-sec e-sec--ink e-asksec" aria-labelledby="e-ask-title">
          <div className="e-head e-reveal">
            <p className="x-label e-head__no">Search</p>
            <h2 id="e-ask-title" className="e-head__title">
              Find any stone by typing like you talk.
            </h2>
            <p className="e-head__text">Spelling mistakes are fine.</p>
          </div>
          <YardSearch />
          <p className="e-cap e-asksec__note x-label">
            Live demo: StoneX’s own search on a sample yard of 22 blocks
          </p>
        </section>

        {/* ---------- Modules ---------- */}
        <section id="modules" className="e-sec e-sec--light" aria-labelledby="e-mod-title">
          <div className="e-head e-reveal">
            <p className="x-label e-head__no">Inside StoneX</p>
            <h2 id="e-mod-title" className="e-head__title">
              Everything else the business runs on.
            </h2>
          </div>
          <ul className="e-mods">
            {MODULES.map(([name, what, gain, icon], i) => (
              <li key={name} className="e-mod" style={{ "--i": i } as CSSProperties}>
                <svg viewBox="0 0 24 24" className="e-mod__icon" aria-hidden="true">
                  {icon}
                </svg>
                <h3 className="e-mod__name">{name}</h3>
                <p className="e-mod__what">{what}</p>
                <p className="e-mod__gain">{gain}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* ---------- Compare ---------- */}
        <section id="compare" className="e-sec e-sec--ink e-vssec" aria-labelledby="e-vs-title">
          <div className="e-head e-reveal">
            <p className="x-label e-head__no">Compared</p>
            <h2 id="e-vs-title" className="e-head__title">
              The usual way, and the StoneX way.
            </h2>
          </div>
          <div className="e-vs">
            <span className="e-vs__stone" aria-hidden="true">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img {...slabImg("(min-width: 64rem) 30vw, 60vw")} alt="" />
            </span>
            <table>
              <caption className="sr-only">The usual way of running a stone yard, and StoneX</caption>
              <colgroup>
                <col className="e-vs__what" />
                <col className="e-vs__old" />
                <col />
              </colgroup>
              <thead>
                <tr>
                  <th scope="col">
                    <span className="sr-only">Job</span>
                  </th>
                  <th scope="col">The usual way</th>
                  <th scope="col" className="e-vs__us">
                    StoneX
                  </th>
                </tr>
              </thead>
              <tbody>
                {VS.map(([job, old, us], i) => (
                  <tr key={job} style={{ "--i": i } as CSSProperties}>
                    <th scope="row">{job}</th>
                    <td className="e-vs__then">
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M7 7l10 10M17 7 7 17" />
                      </svg>
                      {old}
                    </td>
                    <td className="e-vs__us">
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M5 12.5 10 17.5 19.5 7" />
                      </svg>
                      {us}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ---------- FAQ + Book a demo ---------- */}
        <section id="faq" className="e-sec e-sec--light e-faq" aria-labelledby="e-faq-title">
          <div className="e-faq__lead">
            <p className="x-label e-head__no">Questions</p>
            <h2 id="e-faq-title" className="e-head__title">
              See it on your own stock.
            </h2>
            <p className="e-faq__text">Book a demo and we’ll walk you through StoneX.</p>
            <div className="e-faq__ctas">
              <a href={DEMO_MAIL} className="x-btn x-btn--signal e-cta">
                Book a demo <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
          <div className="e-chat">
            {FAQ.map(([q, a]) => (
              <details key={q} name="faq" className="e-chat__item">
                <summary>
                  <span className="e-chat__q">{q}</span>
                  <span className="e-chat__plus" aria-hidden="true" />
                </summary>
                <div className="e-chat__a">
                  <span className="e-chat__who" aria-hidden="true" />
                  <p>{a}</p>
                </div>
              </details>
            ))}
          </div>
        </section>
      </main>

      <footer className="e-foot x-label">
        <span className="x-wordmark e-foot__mark">
          <Wordmark />
          <span className="sr-only">ShilaTeq</span>
        </span>
        <span>every screen: fictional demo yard</span>
        <span>© 2026 ShilaTeq</span>
      </footer>
    </div>
  );
}
