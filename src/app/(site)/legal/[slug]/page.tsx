import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { legalDocs, getLegalDoc } from "@/content/legal";
import { LegalPage } from "@/components/legal/LegalPage";
import { site } from "@/config/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return legalDocs.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = getLegalDoc(slug);
  if (!doc) return {};
  return {
    title: doc.title,
    description: doc.description,
    ...(site.url ? { alternates: { canonical: `/legal/${doc.slug}` } } : {}),
    openGraph: { title: doc.title, description: doc.description, type: "article" },
  };
}

export default async function LegalSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = getLegalDoc(slug);
  if (!doc) notFound();
  return <LegalPage doc={doc} />;
}
