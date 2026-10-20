import { DocsSidebar } from "@/components/docs/DocsSidebar";

/**
 * Docs shell (phase-4/04 §9): a persistent left sidebar + content column.
 * The sidebar is sticky on desktop; on mobile it collapses into a details
 * disclosure so the content leads. Per-page TOC lives inside each page.
 */
export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="lg:grid lg:grid-cols-[16rem_1fr] lg:gap-10">
        {/* Sidebar — sticky on desktop, disclosure on mobile */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <details className="group lg:open" open>
            <summary className="rounded-paper border-line-100 bg-paper-2 text-label text-ink-700 flex cursor-pointer items-center justify-between border px-4 py-2.5 font-mono tracking-wider uppercase lg:hidden">
              Documentation
              <span aria-hidden="true" className="transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <div className="mt-3 lg:mt-0">
              <DocsSidebar />
            </div>
          </details>
        </div>

        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
