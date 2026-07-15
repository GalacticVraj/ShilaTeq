import type { Metadata } from "next";
import Link from "next/link";
import { legalDocs } from "@/content/legal";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = {
  title: "Legal",
  description:
    "ShilaTeq's legal documents — privacy policy, terms of service, cookie policy, and disclaimer. Written in plain language.",
};

/** /legal index — the four legal documents, plainly listed. */
export default function LegalIndex() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Legal", href: "/legal" },
        ]}
      />

      <header className="mt-8 max-w-2xl">
        <p className="eyebrow">Legal</p>
        <h1 className="font-display text-display-2 text-ink-900 mt-3 font-medium tracking-tight">
          The fine print, in plain language.
        </h1>
        <p className="text-body-lg text-ink-700 mt-5">
          We&rsquo;d rather you could actually read these. They&rsquo;re working drafts today —
          honestly marked where our lawyers still need to weigh in — and we&rsquo;ll keep them
          readable as they&rsquo;re finalised.
        </p>
      </header>

      <ul className="mt-12 max-w-3xl">
        {legalDocs.map((d) => (
          <li key={d.slug} className="border-line-100 border-b first:border-t">
            <Link
              href={`/legal/${d.slug}`}
              className="group ease-standard hover:bg-paper-1 block py-4 transition-colors duration-180"
            >
              <h2 className="text-heading-3 text-ink-900 font-sans font-bold group-hover:underline group-hover:underline-offset-2">
                {d.title}
              </h2>
              <p className="text-body text-ink-700 mt-1">{d.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
