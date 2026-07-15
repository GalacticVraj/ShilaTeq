import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { DocumentCard } from "@/components/ui/DocumentCard";
import { DoorsBlock } from "@/components/ui/DoorsBlock";
import { Reveal } from "@/components/home/Reveal";
import { RevealRunner } from "@/components/shared/RevealRunner";

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
 * /why hub (phase-4/04 §4): honor the question → four bridge cards → the
 * canonical register WITH VISIBLE CONCESSIONS (the two bolded rows are the
 * credibility — phase-2/10 §6, binding) → doors.
 */

const CARDS = [
  {
    href: "/why/vs-paper",
    eyebrow: "vs the paper register",
    title: "Keep the discipline. Add the eyes.",
    line: "The register is free, familiar, and blind. The warmest comparison on this site.",
  },
  {
    href: "/why/vs-excel-whatsapp",
    eyebrow: "vs Excel & WhatsApp",
    title: "The system you built — with rules.",
    line: "The sheet was the right instinct. It just can't reserve a block or enforce a payment.",
  },
  {
    href: "/why/vs-tally-accounting",
    eyebrow: "vs accounting software",
    title: "Tally keeps the books. This runs the yard.",
    line: "Not a replacement — a complement your accountant will actually like.",
  },
  {
    href: "/why/vs-erp",
    eyebrow: "vs generic ERP",
    title: "Built for widgets. Your blocks aren't.",
    line: "Including the honest list of where ERPs still beat us today.",
  },
] as const;

/** The canonical grid (phase-2/10 §6). ✓ native · ~ partial/with effort · ✗ absent. */
type Cell = "y" | "p" | "n";
const TABLE: Array<{
  need: string;
  cells: [Cell, Cell, Cell, Cell, Cell];
  concession?: string;
}> = [
  { need: "Find one block fast", cells: ["n", "n", "n", "p", "y"] },
  { need: "Cut → slabs → remnant, reconciled", cells: ["n", "n", "n", "p", "y"] },
  { need: "True margin after wastage", cells: ["n", "n", "p", "p", "y"] },
  { need: "Stop double-selling", cells: ["n", "n", "n", "p", "y"] },
  { need: "Work offline on the floor", cells: ["y", "n", "n", "n", "y"] },
  { need: "Hindi, low-literacy floor UX", cells: ["p", "n", "n", "n", "y"] },
  { need: "GST invoice in one tap", cells: ["n", "n", "y", "y", "y"] },
  { need: "Public showroom + leads", cells: ["n", "n", "n", "n", "y"] },
  {
    need: "Statutory books & filing",
    cells: ["n", "n", "y", "y", "n"],
    concession: "Keep your accounting software — ShilaTeq exports to it.",
  },
  {
    need: "Multi-branch rollups",
    cells: ["n", "p", "p", "y", "n"],
    concession: "Generic ERPs win this today. Rollups are on our roadmap.",
  },
];

const COLS = ["Paper", "Excel", "Accounting", "Generic ERP", "ShilaTeq"] as const;

function CellMark({ v }: { v: Cell }) {
  if (v === "y")
    return (
      <span className="text-ok-600">
        ✓<span className="sr-only"> yes</span>
      </span>
    );
  if (v === "p")
    return (
      <span className="text-ink-500">
        ~<span className="sr-only"> partial</span>
      </span>
    );
  return (
    <span className="text-ink-500">
      ✗<span className="sr-only"> no</span>
    </span>
  );
}

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
          answer, one comparison at a time: what each approach genuinely does well, where it breaks
          under a stone yard, and where, today, it still beats us.
        </p>
      </header>

      {/* The four comparisons */}
      <Reveal as="section" aria-labelledby="comparisons-h" className="reveal mt-14">
        <h2 id="comparisons-h" className="sr-only">
          The four comparisons
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {CARDS.map((card) => (
            <DocumentCard
              key={card.href}
              href={card.href}
              eyebrow={card.eyebrow}
              title={card.title}
            >
              <p>{card.line}</p>
              <p className="prose-link text-label mt-3 font-mono">Read the comparison →</p>
            </DocumentCard>
          ))}
        </div>
      </Reveal>

      {/* The canonical register */}
      <Reveal as="section" aria-labelledby="grid-h" className="reveal mt-16">
        <h2 id="grid-h" className="font-display text-heading-1 text-ink-900 font-medium">
          The whole picture — concessions included
        </h2>
        <p className="text-body text-ink-700 mt-3 max-w-2xl">
          A comparison table where the vendor wins every row is a comparison table nobody believes.
          Two rows below go against us — on purpose, because they&rsquo;re true.
        </p>
        <div className="mt-6 overflow-x-auto">
          <table className="register min-w-[640px]">
            <caption className="sr-only">
              What each approach can do for a stone yard. Legend: ✓ native, ~ partial or with
              effort, ✗ absent.
            </caption>
            <thead>
              <tr>
                <th scope="col">The yard needs to…</th>
                {COLS.map((col) => (
                  <th key={col} scope="col" className="text-center">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TABLE.map((row) => (
                <tr key={row.need}>
                  <td className="text-ink-900 font-bold">
                    {row.need}
                    {row.concession ? (
                      <span className="text-body-sm text-ink-700 mt-1 block font-normal">
                        {row.concession}
                      </span>
                    ) : null}
                  </td>
                  {row.cells.map((cell, i) => (
                    <td key={COLS[i]} className="text-data text-center font-mono">
                      <CellMark v={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-label text-ink-500 mt-3 font-mono">
          ✓ native · ~ partial or with effort · ✗ absent
        </p>
      </Reveal>

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
