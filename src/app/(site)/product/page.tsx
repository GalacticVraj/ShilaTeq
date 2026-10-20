import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { DocumentCard } from "@/components/ui/DocumentCard";
import { DoorsBlock } from "@/components/ui/DoorsBlock";
import { HonestyStrip } from "@/components/ui/HonestyStrip";
import { JsonLd } from "@/components/ui/JsonLd";
import { Reveal } from "@/components/home/Reveal";
import { RevealRunner } from "@/components/shared/RevealRunner";

export const metadata: Metadata = {
  title: "The product — one system for the whole stone yard",
  description:
    "The life of a block, end to end: QR identity, cutting with honest yield, payment-gated orders, one-tap GST invoices, an offline Hindi worker app, and a public 3D showroom.",
};

/**
 * /product — the map (phase-4/04 §1): orient → the life of a block →
 * the four pillars → what it runs on → condensed honesty → doors.
 * Clarity owns this page; the homepage owns choreography.
 */

const LIFECYCLE = [
  [
    "01",
    "A truck arrives",
    "Receive the purchase order — every line becomes a tagged, costed block in one tap.",
  ],
  [
    "02",
    "The block gets its identity",
    "A QR label is minted the moment stone enters the yard. Findable in seconds, forever.",
  ],
  [
    "03",
    "It goes on show",
    "If you choose, the block appears in your public 3D showroom — price shown or “On request”.",
  ],
  [
    "04",
    "The gangsaw runs",
    "The cutter logs the cut. Recovery and wastage are computed; the leftover becomes a sellable remnant block.",
  ],
  [
    "05",
    "A quote goes out",
    "GST-previewed, shared on WhatsApp. Quotes hold no stock — first to convert wins the stone.",
  ],
  [
    "06",
    "The order reserves it",
    "Atomically — two salesmen can never sell the same block. A soft credit check runs at the same moment.",
  ],
  [
    "07",
    "Money before movement",
    "No confirmed payment, nothing moves. Then: one-tap GST invoice, gate pass with the truck.",
  ],
  [
    "08",
    "Delivered means sold",
    "The driver taps once — the order completes, stock is marked sold, cost is frozen, the books stay true.",
  ],
] as const;

const PILLARS = [
  {
    href: "/product/inventory-qr",
    eyebrow: "The stone",
    title: "Inventory & QR identity",
    line: "Find any block in seconds. Cut with honest yield. Watch aging before it eats cash.",
  },
  {
    href: "/product/sales-gst",
    eyebrow: "The money",
    title: "Sales, payments & GST",
    line: "No double-selling, no unpaid dispatches, one-tap compliant invoices.",
  },
  {
    href: "/product/worker-app",
    eyebrow: "The people",
    title: "The worker app",
    line: "Hindi, icons-first, works without signal — and every worker sees his own pay.",
  },
  {
    href: "/product/showroom",
    eyebrow: "The customer",
    title: "Showroom & leads",
    line: "Your yard's own 3D catalog, price-gated block by block, with leads landing in your inbox.",
  },
] as const;

const PLATFORM: Array<[string, string]> = [
  [
    "Any phone",
    "A mobile-first web app — add it to the home screen. No hardware to buy; the camera is the scanner.",
  ],
  ["English or हिंदी", "The worker app is fully bilingual, icon- and number-first."],
  [
    "Offline where it matters",
    "Shop-floor work queues on the device and syncs exactly once when signal returns.",
  ],
  [
    "Sealed data",
    "Your yard's stock, customers, and money are isolated at the database level. No other yard ever sees them.",
  ],
  ["Nothing trapped", "Everything exports to Excel and CSV, always."],
];

export default function ProductPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <RevealRunner />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Product", href: "/product" },
        ]}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "ShilaTeq",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          description:
            "The operating system for stone yards: QR block identity, cutting with honest yield, payment-gated orders, GST invoicing, an offline Hindi worker app, and a public 3D showroom.",
        }}
      />

      {/* Opener */}
      <header className="mt-10 max-w-2xl">
        <p className="eyebrow">The product</p>
        <h1 className="font-display text-display-2 text-ink-900 mt-3 font-medium tracking-tight">
          One system. The whole yard.
        </h1>
        <p className="text-body-lg text-ink-700 mt-5">
          Not five tools stitched together — one connected system where the stone, the money, the
          people, and the customer can never drift apart. The easiest way to understand it is to
          follow one block.
        </p>
      </header>

      {/* The life of a block */}
      <Reveal as="section" aria-labelledby="life-h" className="reveal mt-16">
        <h2 id="life-h" className="font-display text-heading-1 text-ink-900 font-medium">
          The life of a block
        </h2>
        <ol className="mt-8 grid max-w-3xl gap-0">
          {LIFECYCLE.map(([code, title, line]) => (
            <li
              key={code}
              className="border-line-100 grid grid-cols-[3rem_1fr] gap-4 border-b py-5 first:border-t"
            >
              <span className="text-label text-ink-500 font-mono">{code}</span>
              <div>
                <h3 className="text-heading-3 text-ink-900 font-sans font-bold">{title}</h3>
                <p className="text-body text-ink-700 mt-1">{line}</p>
              </div>
            </li>
          ))}
        </ol>
      </Reveal>

      {/* The four pillars */}
      <Reveal as="section" aria-labelledby="pillars-h" className="reveal mt-16">
        <h2 id="pillars-h" className="font-display text-heading-1 text-ink-900 font-medium">
          Four promises, kept in depth
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {PILLARS.map((p) => (
            <DocumentCard key={p.href} href={p.href} eyebrow={p.eyebrow} title={p.title}>
              <p>{p.line}</p>
              <p className="prose-link text-label mt-3 font-mono">See how it works →</p>
            </DocumentCard>
          ))}
        </div>
      </Reveal>

      {/* What it runs on */}
      <Reveal as="section" aria-labelledby="platform-h" className="reveal mt-16 max-w-3xl">
        <h2 id="platform-h" className="font-display text-heading-1 text-ink-900 font-medium">
          Built for the real yard
        </h2>
        <table className="register mt-6">
          <caption className="sr-only">Platform facts</caption>
          <thead>
            <tr>
              <th scope="col">Fact</th>
              <th scope="col">What it means</th>
            </tr>
          </thead>
          <tbody>
            {PLATFORM.map(([fact, means]) => (
              <tr key={fact}>
                <td className="text-ink-900 font-bold">{fact}</td>
                <td className="text-ink-700">{means}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Reveal>

      {/* Condensed honesty */}
      <div className="mt-16 max-w-2xl">
        <HonestyStrip
          title="What it doesn't do. Yet."
          items={[
            {
              fact: "Payments are recorded, not collected.",
              reason: "No gateway fees, no cut of your money. UPI collection is on the roadmap.",
              roadmap: true,
            },
            {
              fact: "One yard per account today.",
              reason: "Group rollups for multi-yard owners are on the roadmap.",
              roadmap: true,
            },
            {
              fact: "Messages go by WhatsApp, not email.",
              reason: "It's the channel your customers actually read — by design.",
            },
          ]}
        />
        <p className="text-body-sm text-ink-700 mt-4">
          The full list lives on the{" "}
          <Link href="/#honesty" className="prose-link">
            homepage&rsquo;s honest section
          </Link>
          .
        </p>
      </div>

      {/* Doors */}
      <section aria-label="See it yourself" className="mt-16 max-w-2xl">
        <h2 className="font-display text-heading-1 text-ink-900 font-medium">
          The map is not the yard. Walk it yourself.
        </h2>
        <div className="mt-6">
          <DoorsBlock waPrefix="Main product ke baare mein baat karna chahta/chahti hoon." />
        </div>
      </section>
    </div>
  );
}
