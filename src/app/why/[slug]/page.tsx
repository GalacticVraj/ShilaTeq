import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { comparisons, getComparison } from "@/content/comparisons";
import { ComparisonPage } from "@/components/why/ComparisonPage";

/**
 * The comparison engine's route: static params from the content model —
 * a future comparison ships by adding one object to content/comparisons.ts.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return comparisons.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = getComparison(slug);
  if (!c) return {};
  return {
    title: c.metaTitle,
    description: c.metaDescription,
    openGraph: {
      title: c.metaTitle,
      description: c.metaDescription,
      type: "article",
    },
  };
}

export default async function WhySlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = getComparison(slug);
  if (!c) notFound();
  return <ComparisonPage c={c} />;
}
