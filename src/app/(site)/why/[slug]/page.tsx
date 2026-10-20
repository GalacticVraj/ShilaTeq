import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { compareRoutes, getCompareRoute } from "@/content/compare";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/ui/JsonLd";
import { DoorsBlock } from "@/components/ui/DoorsBlock";
import { RevealRunner } from "@/components/shared/RevealRunner";
import { CompareEngine } from "@/components/why/CompareEngine";
import { ComparisonExtras } from "@/components/why/ComparisonExtras";

/**
 * The comparison engine's route: static params from the route map — every URL
 * SSR-renders the same engine with its incumbent preselected (COMPARISON_ENGINE_
 * REDESIGN.md §10). Metadata + FAQ JSON-LD stay per-incumbent for SEO.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return compareRoutes.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const r = getCompareRoute(slug);
  if (!r) return {};
  return {
    title: r.metaTitle,
    description: r.metaDescription,
    openGraph: { title: r.metaTitle, description: r.metaDescription, type: "article" },
  };
}

export default async function WhySlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const r = getCompareRoute(slug);
  if (!r) notFound();
  const c = r.comparison;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <RevealRunner />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Why ShilaTeq", href: "/why" },
          { label: r.incumbent.tab, href: `/why/${slug}` },
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

      {/* Respect-first opener (unchanged copy, single h1 for SEO) */}
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

      {/* The comparison engine, preselected to this incumbent */}
      <div className="mt-12">
        <CompareEngine initialIncumbentId={r.route.incumbentId} />
      </div>

      {/* Retained narrative + SEO */}
      <ComparisonExtras c={c} />

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
