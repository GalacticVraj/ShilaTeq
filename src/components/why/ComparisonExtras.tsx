import Link from "next/link";
import type { Comparison } from "@/content/comparisons";
import { HonestyStrip } from "@/components/ui/HonestyStrip";
import { Reveal } from "@/components/home/Reveal";
import { Button } from "@/components/ui/Button";
import { WhatsAppGlyph } from "@/components/ui/DoorsBlock";
import { site, waLink } from "@/config/site";

/**
 * The retained narrative/SEO that lives BELOW the comparison engine on each
 * /why/<slug> page (COMPARISON_ENGINE_REDESIGN.md §3): the honest trade-offs,
 * the bridge line, the FAQ (its FAQPage JSON-LD is emitted by the page), the
 * accountant share, and related links. All sourced unchanged from
 * content/comparisons.ts — reuse, not rewrite.
 */
export function ComparisonExtras({ c }: { c: Comparison }) {
  const shareWa = c.accountantShare
    ? waLink(
        `Namaste — ek reference bhej raha/rahi hoon: ShilaTeq aur Tally saath kaise chalte hain. ${site.url ?? ""}/why/${c.slug}`,
      )
    : null;

  return (
    <>
      {/* Honest trade-offs */}
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
    </>
  );
}
