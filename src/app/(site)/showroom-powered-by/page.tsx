import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { DoorsBlock } from "@/components/ui/DoorsBlock";
import { HonestyStrip } from "@/components/ui/HonestyStrip";
import { Reveal } from "@/components/home/Reveal";
import { RevealRunner } from "@/components/shared/RevealRunner";

export const metadata: Metadata = {
  title: "What is ShilaTeq? The system behind that showroom",
  description:
    "You just saw a ShilaTeq showroom — a real stone yard's public catalog. Here's what runs behind it, and how a yard gets one of its own.",
  openGraph: {
    title: "What is ShilaTeq? The system behind that showroom",
    description: "That catalog is a real stone yard running its whole business on ShilaTeq.",
    type: "website",
  },
};

/**
 * /showroom-powered-by (phase-4/04 §15): the referral-loop landing for
 * visitors arriving from a customer's "Powered by ShilaTeq" catalog link.
 * Inverted arc — pride first. One scroll to the fork; no nav-heavy chrome.
 */

const PIPELINE = [
  "The stone is tagged with a QR identity the moment it arrives.",
  "Cutting, quotes, and orders run on it — with a payment gate that won't let goods move unpaid.",
  "And the same stock powers the public showroom you were just browsing.",
] as const;

const HONESTY = [
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
] as const;

export default function ShowroomPoweredBy() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <RevealRunner />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Powered by ShilaTeq", href: "/showroom-powered-by" },
        ]}
      />

      {/* Opener */}
      <header className="mt-8 max-w-2xl">
        <p className="eyebrow">Powered by ShilaTeq</p>
        <h1 className="font-display text-display-2 text-ink-900 mt-3 font-medium tracking-tight">
          You just saw a ShilaTeq showroom.
        </h1>
        <p className="text-body-lg text-ink-700 mt-5">
          That catalog is a real stone yard — running its whole business on ShilaTeq, from the block
          in the yard to the page you were browsing.
        </p>
      </header>

      {/* The fork */}
      <section aria-labelledby="fork" className="mt-10 max-w-2xl">
        <h2 id="fork" className="sr-only">
          Which are you?
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-paper border-line-100 bg-paper-2 shadow-desk border p-5">
            <p className="text-ink-900 font-bold">I&rsquo;m looking for stone</p>
            <p className="text-body-sm text-ink-700 mt-1">
              Then you&rsquo;re in the right place — head back to the catalog you came from and
              browse. We build the software; the yard sells the stone. We don&rsquo;t sell anything
              to buyers.
            </p>
          </div>
          <Link
            href="#for-owners"
            className="rounded-paper border-ink-900 bg-paper-2 shadow-desk hover:shadow-desk-2 block border p-5 transition-[box-shadow] duration-180"
          >
            <p className="text-ink-900 font-bold">I run a yard →</p>
            <p className="text-body-sm text-ink-700 mt-1">
              See what&rsquo;s behind that showroom — and how your yard gets one.
            </p>
          </Link>
        </div>
      </section>

      {/* Inverted arc — pride first */}
      <section id="for-owners" aria-labelledby="pride-h" className="mt-16 max-w-2xl scroll-mt-24">
        <Reveal className="reveal">
          <p className="eyebrow">Your yard, online</p>
          <h2 id="pride-h" className="font-display text-heading-1 text-ink-900 mt-3 font-medium">
            Your yard could look like that.
          </h2>
          <p className="text-body-lg text-ink-700 mt-4">
            Every ShilaTeq yard gets its own public 3D showroom at its own link — real stone,
            browsable by any buyer, on any phone. Prices shown or &ldquo;On request,&rdquo; block by
            block, entirely your call. And it rides on every invoice and WhatsApp message you send:
            your paperwork becomes your marketing.
          </p>
        </Reveal>

        <Reveal className="reveal mt-10">
          <h3 className="text-heading-2 text-ink-900 font-sans font-bold">
            And behind it, the whole yard runs.
          </h3>
          <ol className="mt-4">
            {PIPELINE.map((line, i) => (
              <li key={line} className="border-line-100 flex gap-3 border-b py-3 first:border-t">
                <span className="text-label text-ink-500 font-mono">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-body text-ink-700">{line}</span>
              </li>
            ))}
          </ol>
          <p className="text-body text-ink-700 mt-6">
            It works on any phone, in English or Hindi, and keeps working when the signal drops —
            because it was built for the yard, not the office.
          </p>
        </Reveal>

        <div className="mt-10">
          <HonestyStrip title="And honestly" items={[...HONESTY]} headingLevel="h3" />
        </div>

        {/* Doors — demo-first, source-tagged for the referral loop */}
        <section aria-label="See it yourself" className="border-line-100 mt-12 border-t pt-8">
          <h3 className="font-display text-heading-1 text-ink-900 font-medium">
            See it on a real yard&rsquo;s data.
          </h3>
          <div className="mt-6">
            <DoorsBlock waPrefix="Maine ek ShilaTeq showroom dekha; apne yard ke liye jaanna hai." />
          </div>
          <p className="text-body-sm text-ink-700 mt-6">
            Or learn more about{" "}
            <Link href="/product/showroom" className="prose-link">
              how the showroom works
            </Link>{" "}
            and{" "}
            <Link href="/guides/going-online" className="prose-link">
              taking your yard online safely
            </Link>
            .
          </p>
        </section>
      </section>
    </div>
  );
}
