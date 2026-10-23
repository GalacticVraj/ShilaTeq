import type { CSSProperties, ReactNode } from "react";
import type { Metadata } from "next";
import { getImageProps } from "next/image";
import { SiteHeader } from "@/components/cross/SiteHeader";
import SearchShots from "./SearchShots";
// The product pages' shared system (hero on marble, sections, chips, FAQ, footer) lives in vision.css.
import "../stonevision/vision.css";
import "./showroom.css";

/**
 * the Showroom product page (/showroom).
 *   Hero      the promise; the Showroom itself, desktop and phone
 *   Buyers    what a buyer sees: the aisle, search, the record, compare, StoneVision
 *   Enquiry   form → receipt → your Leads
 *   Control   what the yard decides
 *   FAQ       beside Book a demo
 * Every screen is StoneX's real Showroom (src/catalog) running on its own fictional demo yard,
 * renamed "Demo Stone Yard" and given the site's sample stone photos (public/showroom-demo).
 * Claims are checked against StoneX's code (read-only, eb9a0d8).
 */

export const metadata: Metadata = {
  title: "Showroom — ShilaTeq",
};

const DEMO_MAIL = "mailto:shilateq@gmail.com?subject=" + encodeURIComponent("Showroom demo request");
const S = "/showroom-demo";

const shot = (name: string, w: number, h: number, sizes: string, eager = false) =>
  getImageProps({
    src: `${S}/${name}.jpg`,
    width: w,
    height: h,
    alt: "",
    sizes,
    ...(eager ? { loading: "eager", fetchPriority: "high" } : {}),
  }).props;
const desk = (name: string, h: number, sizes: string, eager = false) => shot(name, 1440, h, sizes, eager);
const phone = (name: string, sizes: string, eager = false) => shot(name, 780, 1688, sizes, eager);
const pc = (n: number) => `${+(n * 100).toFixed(3)}%`;

/** A red label on a picture, at a point given as fractions of it. */
function Chip({ x, y, children, end }: { x: number; y: number; children: ReactNode; end?: boolean }) {
  return (
    <span className="v-chip" data-end={end ? "" : undefined} style={{ left: pc(x), top: pc(y) } as CSSProperties} aria-hidden="true">
      {children}
    </span>
  );
}

/** A real screen in a browser frame; with `mobile`, phones see the Showroom's own phone screen instead. */
function Browser({
  img,
  alt,
  children,
  className = "",
  mobile,
}: {
  img: ReturnType<typeof desk>;
  alt: string;
  children?: ReactNode;
  className?: string;
  mobile?: { img: ReturnType<typeof phone>; alt: string; labels?: ReactNode };
}) {
  const frame = (
    <div className={`s-frame s-frame--browser ${className} ${mobile ? "s-wide-only" : ""}`}>
      <span className="s-frame__bar" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      <div className="s-frame__screen">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img {...img} alt={alt} loading={img.loading ?? "lazy"} />
        {children}
      </div>
    </div>
  );
  if (!mobile) return frame;
  return (
    <div className="s-shot">
      {frame}
      <Phone img={mobile.img} alt={mobile.alt} className="s-phone-only">
        {mobile.labels}
      </Phone>
    </div>
  );
}

function Phone({ img, alt, className = "", children }: { img: ReturnType<typeof phone>; alt: string; className?: string; children?: ReactNode }) {
  return (
    <div className={`s-frame s-frame--phone ${className}`}>
      <div className="s-frame__screen">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img {...img} alt={alt} loading={img.loading ?? "lazy"} />
        {children}
      </div>
    </div>
  );
}

const CONTROL: [string, string, ReactNode][] = [
  ["Only what’s available", "Sold stone leaves by itself.", <path key="i" d="M4 7h16M4 12h16M4 17h10M18 15l2 2 3-4" />],
  ["Prices only where you choose", "Off until you publish them.", <path key="i" d="M3 12V4h8l10 10-8 8L3 12ZM7.5 7.5h.01" />],
  ["Your own photos", "Never a stock picture.", <path key="i" d="M4 5h16v14H4zM4 15l5-4 4 3 3-2 4 3" />],
  ["Your link, everywhere", "On every quote and invoice.", <path key="i" d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />],
  ["No sign-up for buyers", "Name and phone are enough.", <path key="i" d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />],
  ["The way to your yard", "Directions in Google Maps.", <path key="i" d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12ZM12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />],
];

const FAQ: [string, string][] = [
  ["Do buyers need to sign up?", "No. They ask for a quote with their name and phone number, and it lands in your StoneX Leads."],
  [
    "Will sold stone still show?",
    "Only available stock is listed. When you sell or reserve a stone in StoneX, it leaves the showroom by itself.",
  ],
  ["Can I keep prices private?", "Yes. Prices are off until you publish them, block by block. Other stones show “Price on request”."],
  [
    "How do buyers find my showroom?",
    "Your showroom link goes out with your quotes, invoices and dispatch messages on WhatsApp, and as a QR code on printed invoices and quotations. Share it anywhere else too.",
  ],
  [
    "Does it understand Hindi?",
    "The search does: colour words like “safed” and “kala” work, in Hindi script too. The pages themselves are in English.",
  ],
  [
    "Do I need StoneX ERP?",
    "Yes. The showroom is fed from your StoneX stock, photos and prices, and its enquiries arrive in StoneX as leads.",
  ],
];

export default function ShowroomPage() {
  return (
    <div className="v-page s-page">
      <SiteHeader
        home={{ href: "/", label: "ShilaTeq home" }}
        links={[
          { href: "/stonex-erp", label: "StoneX ERP" },
          { href: "/stonevision", label: "StoneVision" },
          { href: "/showroom", label: "Showroom", current: true },
        ]}
        more={[
          {
            label: "On this page",
            links: [
              { href: "#buyers", label: "What buyers see" },
              { href: "#enquiry", label: "From enquiry to sale" },
              { href: "#control", label: "You stay in control" },
              { href: "#faq", label: "FAQ" },
            ],
          },
        ]}
        demo={DEMO_MAIL}
      />

      <main id="main">
        {/* ---------- Hero ---------- */}
        <section className="v-hero s-hero" aria-labelledby="s-title">
          <div className="v-hero__ground" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              {...getImageProps({ src: "/stone/statuarietto.jpg", width: 2400, height: 2214, alt: "", sizes: "(min-width: 64rem) 100vw, 150vw", loading: "eager" }).props}
              alt=""
            />
          </div>
          <div className="v-hero__copy">
            <p className="v-hero__kicker x-label">
              <span className="v-hero__product">Showroom</span> your stone yard, online
            </p>
            <h1 id="s-title" className="v-hero__title">
              <span>Your stock, online.</span> <span>Every enquiry, to you.</span>
            </h1>
            <p className="v-hero__lede">
              Your available stone, online, fed from StoneX. Buyers browse, search and ask you for a
              quote.
            </p>
            <div className="v-hero__ctas">
              <a href={DEMO_MAIL} className="x-btn x-btn--signal v-cta">
                Book a demo <span aria-hidden="true">→</span>
              </a>
              <a href="#buyers" className="x-link-cut">
                How it works <span aria-hidden="true">↓</span>
              </a>
            </div>
            <ul className="v-hero__facts">
              <li>Fed from your stock</li>
              <li>Search in plain words</li>
              <li>Enquiries land in Leads</li>
            </ul>
          </div>
          <figure className="v-hero__visual s-hero__shots">
            <Browser
              img={desk("entrance", 900, "(min-width: 64rem) 50vw, 100vw", true)}
              alt="The Showroom of a fictional demo yard: its name, a switch between exploring stones and visualizing them in your room, and how many stones are in the yard now."
              className="s-hero__browser"
            >
              <Chip x={0.36} y={0.085}>
                Browse, or see it in their room
              </Chip>
              <Chip x={0.03} y={0.37}>
                Your yard’s own showroom
              </Chip>
            </Browser>
            <Phone
              img={phone("m-entrance", "(min-width: 64rem) 14vw, 62vw", true)}
              alt="The same Showroom on a phone."
              className="s-hero__phone"
            />
            <figcaption className="x-label">StoneX’s Showroom · fictional demo yard, sample stone photos</figcaption>
          </figure>
        </section>

        {/* ---------- What buyers see ---------- */}
        <section id="buyers" className="v-sec v-sec--light" aria-labelledby="s-buyers">
          <div className="v-head v-reveal">
            <p className="x-label v-head__no">What buyers see</p>
            <h2 id="s-buyers" className="v-head__title">
              Your yard, open day and night.
            </h2>
          </div>

          <article className="s-feat" aria-labelledby="s-f1">
            <div className="s-feat__copy">
              <p className="x-label s-feat__no">01 · Browse</p>
              <h3 id="s-f1" className="s-feat__title">
                Walk the aisle.
              </h3>
              <p>Every stone for sale, side by side, with its own photo.</p>
            </div>
            <Browser
              img={desk("aisle", 560, "(min-width: 64rem) 60vw, 100vw")}
              alt="The Showroom's aisle: the demo yard's stones standing side by side to scale, each with its photo, size and price where published."
            >
              <Chip x={0.62} y={0.24}>
                Drawn to scale
              </Chip>
            </Browser>
          </article>

          <article className="s-feat s-feat--flip" aria-labelledby="s-f2">
            <div className="s-feat__copy">
              <p className="x-label s-feat__no">02 · Search</p>
              <h3 id="s-f2" className="s-feat__title">
                Search the way buyers talk.
              </h3>
              <p>Typos and Hindi colour words are fine.</p>
            </div>
            <SearchShots
              shots={[
                {
                  query: "safed marble",
                  note: "Hindi colour word",
                  img: desk("search-safed", 740, "(min-width: 64rem) 60vw, 100vw"),
                  alt: "A search for “safed marble” in the Showroom, read as white marble: the white marbles in stock.",
                  labels: (
                    <Chip x={0.255} y={0.15}>
                      “safed” read as White
                    </Chip>
                  ),
                },
                {
                  query: "calacata under 1000",
                  note: "A typo and a budget",
                  img: desk("search-typo", 740, "(min-width: 64rem) 60vw, 100vw"),
                  alt: "A search for “calacata under 1000”, read as Calacatta up to ₹1,000 per sq ft: one stone.",
                  labels: (
                    <Chip x={0.285} y={0.15}>
                      Typo forgiven, budget read
                    </Chip>
                  ),
                },
              ]}
            />
          </article>

          <article className="s-feat" aria-labelledby="s-f3">
            <div className="s-feat__copy">
              <p className="x-label s-feat__no">03 · Decide</p>
              <h3 id="s-f3" className="s-feat__title">
                Every stone, its full record.
              </h3>
              <p>Size, thickness, finish and grade, straight from StoneX.</p>
            </div>
            <Browser
              img={desk("detail", 900, "(min-width: 64rem) 60vw, 100vw")}
              alt="A stone's page in the Showroom: its photo, sold as one whole block, size, thickness, area, price and a Request a quote button."
              mobile={{
                img: phone("m-detail", "72vw"),
                alt: "A stone's page in the Showroom on a phone: its photo, size, thickness, area, price and a Request a quote button.",
                labels: (
                  <>
                    <Chip x={0.95} y={0.425} end>
                      From your StoneX record
                    </Chip>
                    <Chip x={0.95} y={0.805} end>
                      Only if you publish it
                    </Chip>
                  </>
                ),
              }}
            >
              <Chip x={0.617} y={0.07}>
                From your StoneX record
              </Chip>
              <Chip x={0.715} y={0.452}>
                Price only if you publish it
              </Chip>
            </Browser>
          </article>

          <article className="s-feat s-feat--flip" aria-labelledby="s-f4">
            <div className="s-feat__copy">
              <p className="x-label s-feat__no">04 · Compare</p>
              <h3 id="s-f4" className="s-feat__title">
                Up to four, side by side.
              </h3>
              <p>Every figure in one table.</p>
            </div>
            <Browser
              img={desk("compare", 900, "(min-width: 64rem) 60vw, 100vw")}
              alt="Three stones compared side by side in the Showroom, each with Request a quote, and their figures in rows."
            >
              <Chip x={0.355} y={0.045}>
                Request a quote from any of them
              </Chip>
            </Browser>
          </article>
        </section>

        {/* ---------- StoneVision inside ---------- */}
        <section className="v-sec v-sec--ink s-vision" aria-labelledby="s-vision">
          <div className="s-feat s-feat--flip">
            <div className="s-feat__copy">
              <p className="x-label v-head__no">05 · Visualize</p>
              <h2 id="s-vision" className="v-head__title">
                On their floor, before they visit.
              </h2>
              <p className="v-head__text">StoneVision is built in.</p>
              <a href="/stonevision#try" className="x-link-cut s-link">
                Try StoneVision live <span aria-hidden="true">→</span>
              </a>
            </div>
            <Browser
              img={desk("vision", 900, "(min-width: 64rem) 60vw, 100vw")}
              alt="StoneVision inside the Showroom: “See the stone in your space”, with a stone from the demo yard laid as a floor."
            >
              <Chip x={0.03} y={0.105}>
                StoneVision, built in
              </Chip>
            </Browser>
          </div>
        </section>

        {/* ---------- Enquiry to sale ---------- */}
        <section id="enquiry" className="v-sec v-sec--deep" aria-labelledby="s-enquiry">
          <div className="v-head v-reveal">
            <p className="x-label v-head__no">From enquiry to sale</p>
            <h2 id="s-enquiry" className="v-head__title">
              They ask. You know which stone.
            </h2>
          </div>
          <ol className="s-flow">
            <li>
              <Phone img={phone("m-quote", "(min-width: 56rem) 18vw, 60vw")} alt="The Request a quote form on a phone: name, phone number, how much they need, and a message." />
              <p className="x-label s-flow__no">1 · They ask</p>
              <h3>Name and phone, nothing more</h3>
              <p>No sign-up.</p>
            </li>
            <li>
              <div className="s-card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img {...shot("sent", 540, 540, "(min-width: 56rem) 26vw, 80vw")} alt="Request sent: the yard has the request about Calacatta Oro, with the buyer's name and number." loading="lazy" />
              </div>
              <p className="x-label s-flow__no">2 · They get a receipt</p>
              <h3>Exactly what was sent</h3>
              <p>With your yard’s name.</p>
            </li>
            <li>
              <div className="s-card s-card--lead">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img {...shot("lead", 558, 262, "(min-width: 56rem) 26vw, 80vw")} alt="The new lead in StoneX: the buyer, the stone and block code, the quantity, and a WhatsApp button." loading="lazy" />
              </div>
              <p className="x-label s-flow__no">3 · It lands in StoneX</p>
              <h3>A lead, with the stone</h3>
              <p>Reply on WhatsApp in one tap.</p>
            </li>
          </ol>
          <p className="s-flow__cap x-label">StoneX’s Showroom and Leads · fictional demo yard and buyer</p>
        </section>

        {/* ---------- Control ---------- */}
        <section id="control" className="v-sec v-sec--light" aria-labelledby="s-control">
          <div className="v-head v-reveal">
            <p className="x-label v-head__no">You stay in control</p>
            <h2 id="s-control" className="v-head__title">
              It shows what you decide.
            </h2>
          </div>
          <ul className="v-gets s-control">
            {CONTROL.map(([title, text, icon]) => (
              <li key={title}>
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
        <section id="faq" className="v-sec v-sec--light v-faq" aria-labelledby="s-faq">
          <div className="v-faq__lead">
            <p className="x-label v-head__no">Questions</p>
            <h2 id="s-faq" className="v-head__title">
              Open your yard online.
            </h2>
            <p className="v-faq__text">Book a demo and we’ll show the Showroom on your own stock.</p>
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
        <span>screens: StoneX’s Showroom on a fictional demo yard · stone photos: samples</span>
        <span>© 2026 ShilaTeq</span>
      </footer>
    </div>
  );
}
