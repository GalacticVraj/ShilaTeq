import Link from "next/link";
import type { LegalDoc } from "@/content/legal";
import { legalDocs } from "@/content/legal";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { DocContent } from "@/components/docs/DocContent";
import { Badge } from "@/components/ui/Badge";
import { JsonLd } from "@/components/ui/JsonLd";
import { site } from "@/config/site";

/**
 * Legal document template (phase-4/04 §13). Full typographic system (candor
 * extends to legal — readable measure, real headings). A prominent draft
 * banner and an honest review-marker count sit above the body; review markers
 * are inline blockquotes within the content.
 */

const dateFmt = new Intl.DateTimeFormat("en-IN", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

export function LegalPage({ doc }: { doc: LegalDoc }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Legal", href: "/legal" },
          { label: doc.title, href: `/legal/${doc.slug}` },
        ]}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: doc.title,
          description: doc.description,
          ...(site.url ? { url: `${site.url}/legal/${doc.slug}` } : {}),
        }}
      />

      <article className="mx-auto mt-8 max-w-2xl">
        <header>
          <p className="eyebrow">Legal</p>
          <h1 className="font-display text-display-2 text-ink-900 mt-3 font-medium tracking-tight">
            {doc.title}
          </h1>
          <p className="text-label text-ink-500 mt-3 font-mono">
            Updated <time dateTime={doc.updated}>{dateFmt.format(new Date(doc.updated))}</time>
          </p>
        </header>

        {/* Draft banner — honest about status */}
        <div className="rounded-paper border-line-300 bg-warn-100 mt-6 border p-4">
          <div className="flex items-center gap-2">
            <Badge variant="in-progress">Draft — pending review</Badge>
          </div>
          <p className="text-body-sm text-ink-900 mt-2">
            This is a working draft in plain language, not final legal text. {doc.reviewMarkers}{" "}
            section{doc.reviewMarkers === 1 ? "" : "s"} below{" "}
            {doc.reviewMarkers === 1 ? "is" : "are"} marked{" "}
            <span className="font-mono">⚖️ Review</span> and must be completed with the
            company&rsquo;s legal counsel before this document is relied upon in production.
          </p>
        </div>

        <hr className="border-line-100 my-8" />

        <DocContent source={doc.body} />

        {/* Other legal documents */}
        <nav aria-label="Other legal documents" className="border-line-100 mt-14 border-t pt-8">
          <h2 className="eyebrow">Other legal documents</h2>
          <ul className="mt-3 space-y-2.5">
            {legalDocs
              .filter((d) => d.slug !== doc.slug)
              .map((d) => (
                <li key={d.slug}>
                  <Link href={`/legal/${d.slug}`} className="prose-link text-body">
                    {d.title} →
                  </Link>
                </li>
              ))}
          </ul>
        </nav>
      </article>
    </div>
  );
}
