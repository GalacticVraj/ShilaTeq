import type { Metadata } from "next";
import { industries } from "@/content/industries";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { DocumentCard } from "@/components/ui/DocumentCard";
import { DoorsBlock } from "@/components/ui/DoorsBlock";
import { RevealRunner } from "@/components/shared/RevealRunner";

export const metadata: Metadata = {
  title: "Industries — marble, granite, sandstone, limestone",
  description:
    "One system for the whole dimensional-stone trade: what ShilaTeq means specifically for marble, granite, sandstone, and limestone yards.",
};

/** /industries — a thin router page (phase-4/04 §5): four cards, no filler. */
export default function IndustriesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <RevealRunner />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Industries", href: "/industries" },
        ]}
      />

      <header className="mt-10 max-w-2xl">
        <p className="eyebrow">Industries</p>
        <h1 className="font-display text-display-2 text-ink-900 mt-3 font-medium tracking-tight">
          One system. Every stone.
        </h1>
        <p className="text-body-lg text-ink-700 mt-5">
          ShilaTeq runs the dimensional-stone trade — and each material fights its own battles. Pick
          yours.
        </p>
      </header>

      <section aria-labelledby="trades-h" className="mt-12">
        <h2 id="trades-h" className="sr-only">
          Choose your trade
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {industries.map((ind) => (
            <DocumentCard
              key={ind.slug}
              href={`/industries/${ind.slug}`}
              eyebrow={ind.name}
              title={ind.h1}
            >
              <p className="prose-link text-label mt-1 font-mono">What it means for your yard →</p>
            </DocumentCard>
          ))}
        </div>
      </section>

      <section aria-label="See it yourself" className="mt-16 max-w-2xl">
        <div>
          <DoorsBlock waPrefix="Mera stone ka kaam hai; ShilaTeq ke baare mein jaanna hai." />
        </div>
      </section>
    </div>
  );
}
