import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { guides, getGuide, readingTime } from "@/content/guides";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { DocContent } from "@/components/docs/DocContent";
import { DoorsBlock } from "@/components/ui/DoorsBlock";
import { JsonLd } from "@/components/ui/JsonLd";
import { site } from "@/config/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) return {};
  return {
    title: `${g.title} — Guides`,
    description: g.description,
    // Canonical only with a real domain (A-012).
    ...(site.url ? { alternates: { canonical: `/guides/${g.slug}` } } : {}),
    openGraph: { title: g.title, description: g.description, type: "article" },
  };
}

const dateFmt = new Intl.DateTimeFormat("en-IN", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) notFound();

  const mins = readingTime(g.body);
  const relatedGuides = g.related.guides
    .map((s) => getGuide(s))
    .filter((x): x is NonNullable<typeof x> => Boolean(x));

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Guides", href: "/guides" },
          { label: g.title, href: `/guides/${g.slug}` },
        ]}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: g.title,
          description: g.description,
          datePublished: g.updated,
          dateModified: g.updated,
          author: { "@type": "Organization", name: "ShilaTeq" },
          publisher: { "@type": "Organization", name: "ShilaTeq" },
          ...(site.url ? { url: `${site.url}/guides/${g.slug}` } : {}),
        }}
      />

      <article className="mx-auto mt-8 max-w-2xl">
        <header>
          <p className="eyebrow">{g.category}</p>
          <h1 className="font-display text-display-2 text-ink-900 mt-3 font-medium tracking-tight">
            {g.title}
          </h1>
          <p className="text-body-lg text-ink-700 mt-4">{g.description}</p>
          <p className="text-label text-ink-500 mt-4 font-mono">
            {mins} min read
            <span aria-hidden="true"> · </span>
            Updated <time dateTime={g.updated}>{dateFmt.format(new Date(g.updated))}</time>
          </p>
        </header>

        <hr className="border-line-100 my-8" />

        <DocContent source={g.body} />

        {/* Forward affordance (Phase-3 11 #40) */}
        <div className="rounded-paper border-line-100 bg-paper-1 mt-12 border p-5">
          <p className="text-body text-ink-900">Found this useful?</p>
          <p className="text-body-sm text-ink-700 mt-1">
            Send it to someone at your yard — or see how ShilaTeq puts it into practice.
          </p>
        </div>

        {/* Related reading */}
        <section aria-label="Related reading" className="mt-10">
          <h2 className="eyebrow">Related</h2>
          <ul className="mt-3 space-y-2.5">
            {g.related.pillar ? (
              <li>
                <Link href={g.related.pillar.href} className="prose-link text-body">
                  {g.related.pillar.label} →
                </Link>
              </li>
            ) : null}
            {g.related.comparison ? (
              <li>
                <Link href={g.related.comparison.href} className="prose-link text-body">
                  {g.related.comparison.label} →
                </Link>
              </li>
            ) : null}
            {relatedGuides.map((rg) => (
              <li key={rg.slug}>
                <Link href={`/guides/${rg.slug}`} className="prose-link text-body">
                  {rg.title} →
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Quiet doors */}
        <section aria-label="See it yourself" className="border-line-100 mt-12 border-t pt-8">
          <DoorsBlock waPrefix="Maine ShilaTeq ki ek guide padhi; product ke baare mein jaanna hai." />
        </section>
      </article>
    </div>
  );
}
