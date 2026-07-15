import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDoc } from "@/lib/docs";
import { docsIndex } from "@/content/docs-index";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { DocContent } from "@/components/docs/DocContent";
import { DocsEnhancer } from "@/components/docs/DocsEnhancer";
import { JsonLd } from "@/components/ui/JsonLd";
import { site } from "@/config/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return docsIndex.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = getDoc(slug);
  if (!doc) return {};
  return {
    title: `${doc.meta.title} — Documentation`,
    description: doc.meta.summary,
    // Canonical only when a real domain exists (Gate-zero) — a relative
    // canonical without metadataBase is invalid (A-012).
    ...(site.url ? { alternates: { canonical: `/docs/${doc.meta.slug}` } } : {}),
    openGraph: { title: doc.meta.title, description: doc.meta.summary, type: "article" },
  };
}

export default async function DocPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = getDoc(slug);
  if (!doc) notFound();
  const { meta, content, toc, prev, next } = doc;

  return (
    <div className="min-w-0">
      <DocsEnhancer />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Documentation", href: "/docs" },
          { label: meta.title, href: `/docs/${meta.slug}` },
        ]}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "TechArticle",
          headline: meta.title,
          description: meta.summary,
          ...(site.url ? { url: `${site.url}/docs/${meta.slug}` } : {}),
          isPartOf: { "@type": "Collection", name: "ShilaTeq Documentation" },
        }}
      />

      <div className="mt-8 xl:grid xl:grid-cols-[1fr_15rem] xl:gap-10">
        <article data-doc-article className="min-w-0">
          <h1 className="font-display text-heading-1 text-ink-900 font-medium tracking-tight">
            {meta.title}
          </h1>
          <p className="text-body-lg text-ink-700 mt-2">{meta.summary}</p>
          <hr className="border-line-100 my-8" />
          <DocContent source={content} />

          {/* Prev / Next */}
          <nav
            aria-label="Documentation pagination"
            className="border-line-100 mt-14 grid gap-4 border-t pt-8 sm:grid-cols-2"
          >
            {prev ? (
              <Link
                href={`/docs/${prev.slug}`}
                className="rounded-paper border-line-100 bg-paper-2 shadow-desk hover:border-line-300 border p-4 transition-colors duration-180"
              >
                <span className="text-label text-ink-500 font-mono">← Previous</span>
                <span className="text-ink-900 mt-1 block font-bold">{prev.title}</span>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                href={`/docs/${next.slug}`}
                className="rounded-paper border-line-100 bg-paper-2 shadow-desk hover:border-line-300 border p-4 text-right transition-colors duration-180 sm:col-start-2"
              >
                <span className="text-label text-ink-500 font-mono">Next →</span>
                <span className="text-ink-900 mt-1 block font-bold">{next.title}</span>
              </Link>
            ) : null}
          </nav>
        </article>

        {/* On-page TOC */}
        {toc.length > 0 ? (
          <aside className="mt-10 hidden xl:mt-0 xl:block">
            <div className="sticky top-24" data-toc>
              <p className="eyebrow">On this page</p>
              <ul className="border-line-100 text-body-sm mt-3 space-y-2 border-l">
                {toc.map((h) => (
                  <li key={h.id}>
                    <a
                      href={`#${h.id}`}
                      className="text-ink-700 hover:text-ink-900 data-[active=true]:border-accent-600 data-[active=true]:text-ink-900 -ml-px block border-l-2 border-transparent pl-3 data-[active=true]:font-bold"
                    >
                      {h.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        ) : null}
      </div>
    </div>
  );
}
