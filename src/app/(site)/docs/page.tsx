import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { docsIndex } from "@/content/docs-index";

export const metadata: Metadata = {
  title: "Documentation",
  description:
    "The complete product documentation for ShilaTeq — features, modules, workflows, roles, reporting, and the honest limitations. Nothing hidden.",
};

/**
 * /docs landing (phase-4/04 §9): evaluator-oriented — start with the tour;
 * the candor note; the 15 docs as a register. The full doc set is the depth
 * proof ("nothing to hide — here's everything").
 */
export default function DocsLanding() {
  return (
    <div className="min-w-0">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Documentation", href: "/docs" },
        ]}
      />

      <header className="mt-8 max-w-2xl">
        <p className="eyebrow">Documentation</p>
        <h1 className="font-display text-heading-1 text-ink-900 mt-3 font-medium tracking-tight">
          Everything the product does — written down.
        </h1>
        <p className="text-body-lg text-ink-700 mt-4">
          This is the same documentation the team writes for itself: every feature, every module,
          every workflow, and every limitation. New here? Start with the{" "}
          <Link href="/docs/product-overview" className="prose-link">
            Product Overview
          </Link>{" "}
          — it follows one block from the quarry truck to a delivered invoice.
        </p>
        <p className="rounded-paper border-accent-600 bg-paper-1 text-body-sm text-ink-700 mt-4 border-l-2 py-3 pr-3 pl-4">
          We document our limitations here too — what the product doesn&rsquo;t do yet, and why.
          We&rsquo;d rather you know before you decide than discover it after.
        </p>
      </header>

      <section aria-labelledby="all-docs" className="mt-12">
        <h2 id="all-docs" className="sr-only">
          All documents
        </h2>
        <ul className="max-w-3xl">
          {docsIndex.map((d) => (
            <li key={d.slug} className="border-line-100 border-b first:border-t">
              <Link
                href={`/docs/${d.slug}`}
                className="group ease-standard hover:bg-paper-1 block py-4 transition-colors duration-180"
              >
                <h3 className="text-heading-3 text-ink-900 font-sans font-bold group-hover:underline group-hover:underline-offset-2">
                  {d.title}
                </h3>
                <p className="text-body text-ink-700 mt-1">{d.summary}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
