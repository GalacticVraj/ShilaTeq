import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { DocumentCard } from "@/components/ui/DocumentCard";
import { guides, readingTime } from "@/content/guides";

export const metadata: Metadata = {
  title: "Resources — learn the stone trade and the product",
  description:
    "Everything to learn about running a stone yard and about ShilaTeq: practical guides, full product documentation, honest answers, and comparisons with how you work today.",
};

/**
 * /resources hub (Milestone-4 directive; AMENDMENT A-010): one calm index that
 * organizes Guides, Documentation, FAQ, product learning, industry learning,
 * and comparisons — exploration without overwhelm. Curated links only; the
 * sub-hubs hold the full lists.
 */

const PRODUCT = [
  { label: "The stone — inventory & QR identity", href: "/product/inventory-qr" },
  { label: "The money — sales, payments & GST", href: "/product/sales-gst" },
  { label: "The people — the worker app", href: "/product/worker-app" },
  { label: "The customer — showroom & leads", href: "/product/showroom" },
] as const;

const INDUSTRIES = [
  { label: "Marble", href: "/industries/marble" },
  { label: "Granite", href: "/industries/granite" },
  { label: "Sandstone", href: "/industries/sandstone" },
  { label: "Limestone", href: "/industries/limestone" },
] as const;

const COMPARE = [
  { label: "vs the paper register", href: "/why/vs-paper" },
  { label: "vs Excel & WhatsApp", href: "/why/vs-excel-whatsapp" },
  { label: "vs accounting software", href: "/why/vs-tally-accounting" },
  { label: "vs generic ERP", href: "/why/vs-erp" },
] as const;

export default function ResourcesHub() {
  const featuredGuides = guides.slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
        ]}
      />

      <header className="mt-8 max-w-2xl">
        <p className="eyebrow">Resources</p>
        <h1 className="font-display text-display-2 text-ink-900 mt-3 font-medium tracking-tight">
          Learn the trade. Learn the product.
        </h1>
        <p className="text-body-lg text-ink-700 mt-5">
          Everything worth reading, in one place — whether you&rsquo;re running a yard better this
          week or deciding whether ShilaTeq is for you. If you leave knowing more than you arrived
          with, that&rsquo;s a good visit.
        </p>
      </header>

      {/* Three primary destinations */}
      <section aria-labelledby="primary" className="mt-12">
        <h2 id="primary" className="sr-only">
          Main sections
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <DocumentCard href="/guides" eyebrow="Guides" title="Run your yard better">
            <p>Practical, honest guides — useful with or without the product.</p>
          </DocumentCard>
          <DocumentCard href="/docs" eyebrow="Documentation" title="Everything the product does">
            <p>The complete product documentation, limitations included.</p>
          </DocumentCard>
          <DocumentCard href="/faq" eyebrow="FAQ" title="Honest answers">
            <p>Grouped by what actually worries a yard owner.</p>
          </DocumentCard>
        </div>
      </section>

      {/* Featured guides */}
      <section aria-labelledby="featured-guides" className="mt-16">
        <div className="flex items-baseline justify-between gap-4">
          <h2 id="featured-guides" className="font-display text-heading-1 text-ink-900 font-medium">
            Start with these guides
          </h2>
          <Link href="/guides" className="prose-link text-label shrink-0 font-mono">
            All guides →
          </Link>
        </div>
        <ul className="mt-6 grid gap-4 sm:grid-cols-3">
          {featuredGuides.map((g) => (
            <li key={g.slug}>
              <Link
                href={`/guides/${g.slug}`}
                className="rounded-paper border-line-100 bg-paper-2 shadow-desk hover:border-line-300 flex h-full flex-col border p-5 transition-[border-color] duration-180"
              >
                <p className="eyebrow">{g.category}</p>
                <h3 className="text-heading-3 text-ink-900 mt-2 font-sans font-bold">{g.title}</h3>
                <p className="text-body-sm text-ink-700 mt-2 flex-1">{g.description}</p>
                <p className="text-label text-ink-500 mt-3 font-mono">
                  {readingTime(g.body)} min read
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Learn the product / by trade / compare */}
      <section aria-labelledby="explore" className="mt-16">
        <h2 id="explore" className="sr-only">
          Explore
        </h2>
        <div className="grid gap-10 sm:grid-cols-3">
          <LinkColumn title="Learn the product" links={PRODUCT} />
          <LinkColumn title="By your trade" links={INDUSTRIES} />
          <LinkColumn title="Compare" links={COMPARE} />
        </div>
      </section>

      {/* Getting started */}
      <section aria-labelledby="start" className="border-line-100 mt-16 max-w-2xl border-t pt-10">
        <h2 id="start" className="font-display text-heading-1 text-ink-900 font-medium">
          Getting started
        </h2>
        <p className="text-body text-ink-700 mt-3">
          The fastest way to understand ShilaTeq isn&rsquo;t to read about it — it&rsquo;s to run a
          sample yard yourself. No signup, nothing to install.
        </p>
        <p className="mt-4">
          <Link href="/demo" className="prose-link text-body">
            Try the full demo →
          </Link>
        </p>
      </section>
    </div>
  );
}

function LinkColumn({
  title,
  links,
}: {
  title: string;
  links: ReadonlyArray<{ label: string; href: string }>;
}) {
  return (
    <div>
      <h3 className="eyebrow">{title}</h3>
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-body-sm text-ink-700 hover:text-ink-900 hover:underline hover:underline-offset-2"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
