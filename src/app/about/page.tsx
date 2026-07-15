import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { DoorsBlock } from "@/components/ui/DoorsBlock";
import { JsonLd } from "@/components/ui/JsonLd";
import { Reveal } from "@/components/home/Reveal";
import { RevealRunner } from "@/components/shared/RevealRunner";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "About ShilaTeq — stone technology",
  description:
    "Why ShilaTeq exists: to give the stone trade software that actually understands it. Our philosophy, why honesty is part of the product, and why we chose depth over breadth.",
  openGraph: {
    title: "About ShilaTeq — stone technology",
    description: "Why ShilaTeq exists, and what we believe.",
    type: "website",
  },
};

/**
 * /about (phase-4/04 §10): a statement of purpose, not a company timeline.
 * Grounded in Phase-1/2 — mission & vision verbatim, the candor doctrine,
 * depth-over-breadth. No invented founder story, counts, or achievements;
 * the founder section uses the honest placeholder until real content exists.
 */
export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <RevealRunner />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "About", href: "/about" },
        ]}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: "About ShilaTeq",
          description:
            "Why ShilaTeq exists — software built for the way stone yards actually work.",
          publisher: { "@type": "Organization", name: "ShilaTeq" },
        }}
      />

      {/* The naming story */}
      <header className="mt-8 max-w-2xl">
        <p className="eyebrow">About</p>
        <h1 className="font-display text-display-2 text-ink-900 mt-3 font-medium tracking-tight">
          Stone technology.
        </h1>
        <p className="text-body-lg text-ink-700 mt-5">
          <span lang="hi">शिला</span> (<em>shila</em>) is the Sanskrit and Hindi word for stone.
          ShilaTeq is, literally, stone technology — software built for one trade, by people who
          took the time to understand it.
        </p>
      </header>

      {/* Why we exist */}
      <Reveal as="section" aria-labelledby="why" className="reveal mt-16 max-w-2xl">
        <h2 id="why" className="font-display text-heading-1 text-ink-900 font-medium">
          Why ShilaTeq exists
        </h2>
        <div className="text-body text-ink-700 mt-5 space-y-4">
          <p>
            The stone trade is one of the largest under-digitised physical industries in the
            country. A single yard can hold crores of rupees of stone — thousands of near-identical
            blocks — and run the whole thing on a paper register, chalk marks, WhatsApp threads, and
            the owner&rsquo;s memory. It works, remarkably well, until the day it expensively
            doesn&rsquo;t: the block nobody can find while a buyer waits, the slab sold below cost,
            the credit that quietly became a bad debt.
          </p>
          <p>
            The trade waited a long time for software that understood it. What arrived instead was
            software built for offices and factories — English-only, desktop-first, and blind to
            what a stone block actually is. ShilaTeq exists to close that gap: to give a yard the
            operational clarity a modern warehouse takes for granted, without asking a low-literacy,
            phone-only workforce to change how they work.
          </p>
        </div>
      </Reveal>

      {/* Mission & vision — verbatim from the product's own words */}
      <Reveal as="section" aria-labelledby="mission" className="reveal mt-16 max-w-2xl">
        <h2 id="mission" className="font-display text-heading-1 text-ink-900 font-medium">
          What we&rsquo;re building
        </h2>
        <blockquote className="border-accent-600 bg-paper-1 mt-5 border-l-2 py-4 pr-4 pl-5">
          <p className="text-body-lg text-ink-900">
            Give every stone block a permanent digital identity, and let a yard run its entire
            business — quarry intake to delivered invoice — from any phone, even offline, in the
            worker&rsquo;s own language.
          </p>
          <footer className="text-label text-ink-500 mt-2 font-mono">Our mission</footer>
        </blockquote>
        <p className="text-body text-ink-700 mt-5">
          The longer horizon is to become the operating system for the dimensional-stone trade — a
          single source of truth for every block, cut, rupee, and customer. Not a pivot away from
          that mission; the same one, extended.
        </p>
      </Reveal>

      {/* Philosophy: depth over breadth */}
      <Reveal as="section" aria-labelledby="depth" className="reveal mt-16 max-w-2xl">
        <h2 id="depth" className="font-display text-heading-1 text-ink-900 font-medium">
          Why depth, not breadth
        </h2>
        <div className="text-body text-ink-700 mt-5 space-y-4">
          <p>
            We could have built a generic tool that works a little for everyone. We chose instead to
            model one trade completely — the block that becomes slabs and a remnant, the wastage
            that has to be priced in, the stone that ages, the payment that must come before goods
            move. That depth is the hardest thing for a general-purpose tool to copy, and it&rsquo;s
            the whole reason ShilaTeq is worth using.
          </p>
          <p>
            Depth where the trade needs it; simplicity where the user needs it. A Hindi-speaking
            cutter should be able to use it offline on a cheap phone, and an owner should be able to
            trust it for GST and margins. Getting both right is the work.
          </p>
        </div>
      </Reveal>

      {/* Honesty as part of the product */}
      <Reveal as="section" aria-labelledby="honesty" className="reveal mt-16 max-w-2xl">
        <h2 id="honesty" className="font-display text-heading-1 text-ink-900 font-medium">
          Why honesty is part of the product
        </h2>
        <div className="text-body text-ink-700 mt-5 space-y-4">
          <p>
            The trade has been sold to before, and oversold to. So we made candour a rule, not a
            mood. When a cost is unknown, the product shows &ldquo;N/A&rdquo; rather than a
            flattering margin. Write-offs are recorded, not hidden. And we publish what the product{" "}
            <em>doesn&rsquo;t</em> do yet — payments recorded not collected, one yard per account
            today, no email — with the reason and the road, right on the{" "}
            <Link href="/#honesty" className="prose-link">
              homepage
            </Link>{" "}
            and in every comparison.
          </p>
          <p>
            We&rsquo;d rather you decide on evidence than on our adjectives. That&rsquo;s why the
            whole product is a{" "}
            <Link href="/demo" className="prose-link">
              free demo you can run yourself
            </Link>{" "}
            — no signup, no one calling you.
          </p>
        </div>
      </Reveal>

      {/* The people — honest placeholder until real founder content exists */}
      <Reveal as="section" aria-labelledby="people" className="reveal mt-16 max-w-2xl">
        <h2 id="people" className="font-display text-heading-1 text-ink-900 font-medium">
          The people behind it
        </h2>
        {site.legalEntity ? (
          <p className="text-body text-ink-700 mt-5">{/* real bio slots in when provided */}</p>
        ) : (
          <div className="rounded-paper border-line-300 bg-paper-1 mt-5 border border-dashed p-5">
            <p className="text-body text-ink-900">A proper introduction is coming here.</p>
            <p className="text-body-sm text-ink-700 mt-1">
              Family businesses buy from people, and you deserve to know who built this and why.
              We&rsquo;re writing that honestly rather than padding this page — until then, the best
              introduction is the product itself.
            </p>
          </div>
        )}
      </Reveal>

      {/* Doors */}
      <section
        aria-label="See it yourself"
        className="border-line-100 mt-16 max-w-2xl border-t pt-8"
      >
        <div>
          <DoorsBlock waPrefix="Main ShilaTeq ke baare mein aur jaanna chahta/chahti hoon." />
        </div>
        <p className="text-body-sm text-ink-700 mt-6">
          More on how we protect your data on the{" "}
          <Link href="/security" className="prose-link">
            security page
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
