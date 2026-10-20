import type { Metadata } from "next";
import Link from "next/link";
import { guides, readingTime } from "@/content/guides";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/ui/JsonLd";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Guides for running a stone yard",
  description:
    "Practical guides for stone-yard owners: dead capital, credit control, gangsaw recovery, GST invoicing, double-selling, honest pricing, going online, and worker adoption.",
  openGraph: {
    title: "Guides for running a stone yard",
    description:
      "Practical, honest guides for running a stone yard better — with or without software.",
    type: "website",
  },
};

/**
 * /guides hub (phase-4/04 §7): the first real management literature for stone
 * yards. Utility-first — "run your yard better, with or without us."
 */
export default function GuidesHub() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Guides", href: "/guides" },
        ]}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "ShilaTeq Guides",
          itemListElement: guides.map((g, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: g.title,
            ...(site.url ? { url: `${site.url}/guides/${g.slug}` } : {}),
          })),
        }}
      />

      <header className="mt-8 max-w-2xl">
        <p className="eyebrow">Guides</p>
        <h1 className="font-display text-display-2 text-ink-900 mt-3 font-medium tracking-tight">
          Run your yard better — with or without us.
        </h1>
        <p className="text-body-lg text-ink-700 mt-5">
          The stone trade has never had much written down for the people who run it. These guides
          are our attempt to change that: practical, honest, and useful whether or not you ever open
          the demo. If you leave knowing one thing more than you arrived with, they&rsquo;ve done
          their job.
        </p>
      </header>

      <section aria-labelledby="all-guides" className="mt-12">
        <h2 id="all-guides" className="sr-only">
          All guides
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2">
          {guides.map((g) => (
            <li key={g.slug}>
              <Link
                href={`/guides/${g.slug}`}
                className="rounded-paper border-line-100 bg-paper-2 shadow-desk ease-standard hover:border-line-300 hover:shadow-desk-2 flex h-full flex-col border p-6 transition-[border-color,box-shadow] duration-180"
              >
                <p className="eyebrow">{g.category}</p>
                <h3 className="text-heading-2 text-ink-900 mt-2 font-sans font-bold">{g.title}</h3>
                <p className="text-body text-ink-700 mt-2 flex-1">{g.description}</p>
                <p className="text-label text-ink-500 mt-4 font-mono">
                  {readingTime(g.body)} min read
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
