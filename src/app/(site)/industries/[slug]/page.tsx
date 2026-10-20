import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { industries, getIndustry } from "@/content/industries";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { DoorsBlock } from "@/components/ui/DoorsBlock";
import { HonestyStrip } from "@/components/ui/HonestyStrip";
import { Reveal } from "@/components/home/Reveal";
import { RevealRunner } from "@/components/shared/RevealRunner";

/**
 * Industry pages (phase-4/04 §5): thin-but-true — recognition (2 paragraphs
 * max) → material pains → the 3 features that matter here → honest limit →
 * doors + comparison bridge. ≤1.5 viewports is the law; padding would betray.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return industries.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const ind = getIndustry(slug);
  if (!ind) return {};
  return {
    title: ind.metaTitle,
    description: ind.metaDescription,
    openGraph: { title: ind.metaTitle, description: ind.metaDescription, type: "website" },
  };
}

export default async function IndustryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ind = getIndustry(slug);
  if (!ind) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <RevealRunner />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Industries", href: "/industries" },
          { label: ind.name, href: `/industries/${ind.slug}` },
        ]}
      />

      {/* Recognition */}
      <header className="mt-10 max-w-2xl">
        <p className="eyebrow">{ind.name}</p>
        <h1 className="font-display text-display-2 text-ink-900 mt-3 font-medium tracking-tight">
          {ind.h1}
        </h1>
        <p className="text-body-lg text-ink-700 mt-5">{ind.recognition[0]}</p>
        <p className="text-body-lg text-ink-700 mt-4">{ind.recognition[1]}</p>
      </header>

      {/* Material pains */}
      <Reveal as="section" aria-labelledby="pains-h" className="reveal mt-14 max-w-3xl">
        <h2 id="pains-h" className="font-display text-heading-1 text-ink-900 font-medium">
          What this trade fights daily
        </h2>
        <ul className="mt-6">
          {ind.pains.map(([name, line]) => (
            <li key={name} className="border-line-100 border-b py-4 first:border-t">
              <p className="text-ink-900 font-bold">{name}</p>
              <p className="text-body text-ink-700 mt-1">{line}</p>
            </li>
          ))}
        </ul>
      </Reveal>

      {/* Same product, your stone */}
      <Reveal as="section" aria-labelledby="fit-h" className="reveal mt-14 max-w-3xl">
        <h2 id="fit-h" className="font-display text-heading-1 text-ink-900 font-medium">
          Same product. Your stone.
        </h2>
        <p className="text-body text-ink-700 mt-3 max-w-2xl">
          There is no &ldquo;{ind.name.toLowerCase()} edition&rdquo; — one system runs every yard.
          These are the three parts of it that matter most in your trade:
        </p>
        <ul className="mt-6">
          {ind.features.map((f) => (
            <li key={f.title} className="border-line-100 border-b py-5 first:border-t">
              <p className="eyebrow">{f.pillar}</p>
              <h3 className="text-heading-3 text-ink-900 mt-1 font-sans font-bold">{f.title}</h3>
              <p className="text-body text-ink-700 mt-1">{f.line}</p>
              <p className="mt-2">
                <Link href={f.href} className="prose-link text-label font-mono">
                  See how it works →
                </Link>
              </p>
            </li>
          ))}
        </ul>
      </Reveal>

      {/* Honest limit */}
      <div className="mt-14 max-w-2xl">
        <HonestyStrip title="The honest part" items={[ind.limit]} />
      </div>

      {/* Doors + comparison bridge */}
      <section aria-label="See it yourself" className="mt-14 max-w-2xl">
        <h2 className="font-display text-heading-1 text-ink-900 font-medium">
          See it on a real yard&rsquo;s data.
        </h2>
        <div className="mt-6">
          <DoorsBlock waPrefix={ind.waPrefix} />
        </div>
        <p className="text-body text-ink-700 mt-6">
          Comparing with how you work today?{" "}
          <Link href={ind.comparison.href} className="prose-link">
            {ind.comparison.label} →
          </Link>
        </p>
      </section>
    </div>
  );
}
