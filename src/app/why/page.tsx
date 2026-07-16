import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { DoorsBlock } from "@/components/ui/DoorsBlock";
import { RevealRunner } from "@/components/shared/RevealRunner";
import { CompareEngine } from "@/components/why/CompareEngine";

export const metadata: Metadata = {
  title: "Why ShilaTeq — an honest comparison",
  description:
    "Paper registers, Excel sheets, WhatsApp threads, Tally, generic ERPs — where each honestly wins, where each breaks under a stone yard, and what one connected system changes.",
  openGraph: {
    title: "Why ShilaTeq — an honest comparison",
    description:
      "Where paper, Excel, Tally, and generic ERPs honestly win — and where they break under a stone yard.",
    type: "website",
  },
};

/**
 * /why hub: the comparison engine is the experience (COMPARISON_ENGINE_REDESIGN.md).
 * The honest question stays the h1; the engine replaces the old cards + static
 * matrix. Individual /why/vs-* URLs open the same engine preselected.
 */
export default function WhyPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <RevealRunner />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Why ShilaTeq", href: "/why" },
        ]}
      />

      <header className="mt-10 max-w-2xl">
        <p className="eyebrow">Why ShilaTeq</p>
        <h1 className="font-display text-display-2 text-ink-900 mt-3 font-medium tracking-tight">
          &ldquo;Why not keep doing what I do?&rdquo;
        </h1>
        <p className="text-body-lg text-ink-700 mt-5">
          It&rsquo;s the right question — your current way built the business. So here is the honest
          answer, feature by feature: what your current tool genuinely does well, where it breaks
          under a stone yard, and where, today, it still beats us. Pick what you run today.
        </p>
      </header>

      {/* The comparison engine — default to the warmest comparison */}
      <div className="mt-12">
        <CompareEngine initialIncumbentId="paper" />
      </div>

      {/* Doors */}
      <section aria-label="Decide on evidence" className="mt-16 max-w-2xl">
        <h2 className="font-display text-heading-1 text-ink-900 font-medium">
          Decide on evidence, not on our words.
        </h2>
        <div className="mt-6">
          <DoorsBlock waPrefix="Main apne current tareeke se comparison samajhna chahta/chahti hoon." />
        </div>
      </section>
    </div>
  );
}
