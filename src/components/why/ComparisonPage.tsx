import Link from "next/link";
import type { Comparison } from "@/content/comparisons";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { DoorsBlock } from "@/components/ui/DoorsBlock";
import { HonestyStrip } from "@/components/ui/HonestyStrip";
import { JsonLd } from "@/components/ui/JsonLd";
import { Reveal } from "@/components/home/Reveal";
import { RevealRunner } from "@/components/shared/RevealRunner";
import { Button } from "@/components/ui/Button";
import { WhatsAppGlyph } from "@/components/ui/DoorsBlock";
import { site, waLink } from "@/config/site";

/**
 * The comparison ENGINE (Milestone-3 directive): one template renders every
 * Comparison content object. Section order implements the master posture
 * (Phase-2 10): respect → the workflow today → hidden costs → THE CONCESSION
 * (styled equal) → where it breaks → the same yard on ShilaTeq → honest
 * trade-offs → the bridge line → FAQ → related links → doors.
 * Never attacks; concessions are load-bearing content.
 */
export function ComparisonPage({ c }: { c: Comparison }) {
  const shareWa = c.accountantShare
    ? waLink(
        `Namaste — ek reference bhej raha/rahi hoon: ShilaTeq aur Tally saath kaise chalte hain. ${site.url ?? ""}/why/${c.slug}`,
      )
    : null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <RevealRunner />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Why ShilaTeq", href: "/why" },
          { label: c.eyebrow, href: `/why/${c.slug}` },
        ]}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: c.faq.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />

      {/* Respect-first opener */}
      <header className="mt-10 max-w-2xl">
        <p className="eyebrow">{c.eyebrow}</p>
        <h1 className="font-display text-display-2 text-ink-900 mt-3 font-medium tracking-tight">
          {c.h1}
        </h1>
        {c.respect.map((p) => (
          <p key={p.slice(0, 24)} className="text-body-lg text-ink-700 mt-5">
            {p}
          </p>
        ))}
      </header>

      {/* The workflow today */}
      <Reveal as="section" aria-labelledby={`wf-${c.slug}`} className="reveal mt-16 max-w-3xl">
        <h2 id={`wf-${c.slug}`} className="font-display text-heading-1 text-ink-900 font-medium">
          How the yard runs on {c.incumbent}
        </h2>
        <ol className="mt-6">
          {c.workflow.map(([step, line], i) => (
            <li
              key={step}
              className="border-line-100 grid grid-cols-[2.5rem_1fr] gap-3 border-b py-4 first:border-t sm:grid-cols-[3rem_12rem_1fr]"
            >
              <span className="text-label text-ink-500 font-mono">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-ink-900 font-bold">{step}</span>
              <span className="text-body text-ink-700 col-span-2 sm:col-span-1">{line}</span>
            </li>
          ))}
        </ol>
      </Reveal>

      {/* The hidden costs */}
      <Reveal as="section" aria-labelledby={`hc-${c.slug}`} className="reveal mt-16 max-w-3xl">
        <h2 id={`hc-${c.slug}`} className="font-display text-heading-1 text-ink-900 font-medium">
          What it costs without announcing itself
        </h2>
        <ul className="mt-6">
          {c.hiddenCosts.map(([name, line]) => (
            <li key={name} className="border-line-100 border-b py-4 first:border-t">
              <p className="text-ink-900 font-bold">{name}</p>
              <p className="text-body text-ink-700 mt-1">{line}</p>
            </li>
          ))}
        </ul>
      </Reveal>

      {/* THE CONCESSION — styled with the same weight as our wins (binding) */}
      <Reveal as="section" aria-labelledby={`win-${c.slug}`} className="reveal mt-16 max-w-3xl">
        <div className="rounded-paper border-line-300 bg-paper-2 shadow-desk border p-6">
          <h2 id={`win-${c.slug}`} className="font-display text-heading-1 text-ink-900 font-medium">
            {c.wins.title}
          </h2>
          <ul className="mt-4 space-y-3">
            {c.wins.items.map((item) => (
              <li key={item.slice(0, 24)} className="text-body text-ink-900 flex gap-3">
                <span aria-hidden="true" className="text-ok-600">
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      {/* Where it breaks */}
      <Reveal as="section" aria-labelledby={`br-${c.slug}`} className="reveal mt-16 max-w-3xl">
        <h2 id={`br-${c.slug}`} className="font-display text-heading-1 text-ink-900 font-medium">
          Where it breaks — structurally
        </h2>
        <ul className="mt-6">
          {c.breaks.map(([name, line]) => (
            <li key={name} className="border-line-100 border-b py-4 first:border-t">
              <p className="text-ink-900 font-bold">{name}</p>
              <p className="text-body text-ink-700 mt-1">{line}</p>
            </li>
          ))}
        </ul>
      </Reveal>

      {/* The same yard, on ShilaTeq */}
      <Reveal as="section" aria-labelledby={`ch-${c.slug}`} className="reveal mt-16 max-w-3xl">
        <h2 id={`ch-${c.slug}`} className="font-display text-heading-1 text-ink-900 font-medium">
          The same yard, on ShilaTeq
        </h2>
        <ol className="mt-6">
          {c.change.map(([step, line], i) => (
            <li
              key={step}
              className="border-line-100 grid grid-cols-[2.5rem_1fr] gap-3 border-b py-4 first:border-t sm:grid-cols-[3rem_12rem_1fr]"
            >
              <span className="text-label text-ink-500 font-mono">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-ink-900 font-bold">{step}</span>
              <span className="text-body text-ink-700 col-span-2 sm:col-span-1">{line}</span>
            </li>
          ))}
        </ol>
      </Reveal>

      {/* Honest trade-offs of switching */}
      <div className="mt-16 max-w-2xl">
        <HonestyStrip title="The honest trade-offs" items={c.tradeoffs} />
      </div>

      {/* The bridge line */}
      <Reveal className="reveal mt-16 max-w-3xl">
        <p className="font-display text-display-2 text-ink-900 font-medium tracking-tight">
          {c.bridge}
        </p>
      </Reveal>

      {/* FAQ */}
      <Reveal as="section" aria-labelledby={`faq-${c.slug}`} className="reveal mt-16 max-w-2xl">
        <h2 id={`faq-${c.slug}`} className="font-display text-heading-1 text-ink-900 font-medium">
          Asked honestly, answered honestly
        </h2>
        <div className="mt-6">
          {c.faq.map((f) => (
            <details
              key={f.q}
              name={`faq-${c.slug}`}
              className="group border-line-100 border-b first:border-t"
            >
              <summary className="text-body text-ink-900 flex cursor-pointer list-none items-baseline justify-between gap-4 py-4 font-bold [&::-webkit-details-marker]:hidden">
                {f.q}
                <span
                  aria-hidden="true"
                  className="text-ink-500 ease-standard shrink-0 font-mono transition-transform duration-180 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="text-body text-ink-700 pb-5">{f.a}</p>
            </details>
          ))}
        </div>
      </Reveal>

      {/* Accountant share (vs-tally only) */}
      {shareWa ? (
        <Reveal className="reveal mt-10 max-w-2xl">
          <div className="rounded-paper border-line-100 bg-paper-1 border p-5">
            <p className="text-body text-ink-900">Your accountant&rsquo;s opinion matters here.</p>
            <div className="mt-3">
              <Button href={shareWa} variant="secondary" external>
                <WhatsAppGlyph />
                Send this page to your accountant
              </Button>
            </div>
          </div>
        </Reveal>
      ) : null}

      {/* Related links */}
      <Reveal as="section" aria-label="Related reading" className="reveal mt-16 max-w-2xl">
        <h2 className="eyebrow">Go deeper</h2>
        <ul className="mt-4 space-y-2.5">
          <li>
            <Link href={c.related.pillar.href} className="prose-link text-body">
              {c.related.pillar.label} →
            </Link>
          </li>
          {c.related.guides.map((g) => (
            <li key={g.href}>
              <Link href={g.href} className="prose-link text-body">
                {g.label} →
              </Link>
            </li>
          ))}
        </ul>
      </Reveal>

      {/* Doors */}
      <section aria-label="Decide on evidence" className="mt-16 max-w-2xl">
        <h2 className="font-display text-heading-1 text-ink-900 font-medium">
          Decide on evidence, not on our words.
        </h2>
        <div className="mt-6">
          <DoorsBlock demoHref={c.demoHref} demoMicroline={c.demoMicroline} waPrefix={c.waPrefix} />
        </div>
      </section>
    </div>
  );
}
