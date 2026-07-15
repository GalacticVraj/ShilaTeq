import type { Metadata } from "next";
import Link from "next/link";
import { faqGroups, allFaqItems } from "@/content/faq";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { DoorsBlock } from "@/components/ui/DoorsBlock";
import { JsonLd } from "@/components/ui/JsonLd";
import { FaqDeepLink } from "@/components/faq/FaqDeepLink";

export const metadata: Metadata = {
  title: "ShilaTeq — honest answers",
  description:
    "Straight answers about ShilaTeq, grouped by what actually worries stone-yard owners: cost, workers, data, GST, getting started — and what we don't do yet.",
  openGraph: {
    title: "ShilaTeq — honest answers",
    description: "Straight answers, limitations included.",
    type: "website",
  },
};

/**
 * /faq (phase-4/04 §8): anxiety-grouped native <details>, deep-linkable,
 * FAQPage schema over every visible Q&A. Ends with the doors.
 */
export default function FaqPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <FaqDeepLink />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "FAQ", href: "/faq" },
        ]}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: allFaqItems().map((it) => ({
            "@type": "Question",
            name: it.q,
            acceptedAnswer: { "@type": "Answer", text: it.a },
          })),
        }}
      />

      <header className="mt-8 max-w-2xl">
        <p className="eyebrow">FAQ</p>
        <h1 className="font-display text-display-2 text-ink-900 mt-3 font-medium tracking-tight">
          Honest answers.
        </h1>
        <p className="text-body-lg text-ink-700 mt-5">
          Grouped by what actually worries a yard owner — including the things we don&rsquo;t do
          yet. If your question isn&rsquo;t here, ask us on WhatsApp.
        </p>
      </header>

      <div className="mt-12 max-w-2xl">
        {faqGroups.map((group) => (
          <section
            key={group.title}
            aria-labelledby={`grp-${group.title.replace(/\W+/g, "-")}`}
            className="mt-10 first:mt-0"
          >
            <h2
              id={`grp-${group.title.replace(/\W+/g, "-")}`}
              className="font-display text-heading-1 text-ink-900 font-medium"
            >
              {group.title}
            </h2>
            <div className="mt-4">
              {group.items.map((it) => (
                <details
                  key={it.slug}
                  id={it.slug}
                  className="group border-line-100 scroll-mt-24 border-b first:border-t"
                >
                  <summary className="text-body text-ink-900 flex cursor-pointer list-none items-baseline justify-between gap-4 py-4 font-bold [&::-webkit-details-marker]:hidden">
                    {it.q}
                    <span
                      aria-hidden="true"
                      className="text-ink-500 ease-standard shrink-0 font-mono transition-transform duration-180 group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="text-body text-ink-700 pb-5">{it.a}</p>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Related */}
      <section aria-label="Related" className="mt-14 max-w-2xl">
        <h2 className="eyebrow">Still deciding?</h2>
        <ul className="mt-3 space-y-2.5">
          <li>
            <Link href="/why" className="prose-link text-body">
              Compare ShilaTeq with how you work today →
            </Link>
          </li>
          <li>
            <Link href="/guides" className="prose-link text-body">
              Read the guides for running a yard →
            </Link>
          </li>
          <li>
            <Link href="/security" className="prose-link text-body">
              How your data is protected →
            </Link>
          </li>
        </ul>
      </section>

      {/* Doors */}
      <section
        aria-label="See it yourself"
        className="border-line-100 mt-12 max-w-2xl border-t pt-8"
      >
        <DoorsBlock waPrefix="Mera ek sawaal hai ShilaTeq ke baare mein." />
      </section>
    </div>
  );
}
