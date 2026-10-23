import { Ledger } from "@/components/kerf/register/Ledger";
import { MarbleFace } from "@/components/kerf/register/MarbleFace";
import { Register } from "@/components/kerf/register/Register";
import { StonexPreview } from "@/components/kerf/StonexPreview";

/**
 * HOME (KERF milestone 1: "The Register"). Paper → stone → digital identity →
 * a simulated StoneX screen. Everything else on the homepage comes in later
 * milestones.
 */
export default function Home() {
  return (
    <>
      <section
        aria-labelledby="hero-h"
        className="mx-auto max-w-[1440px] px-4 pt-10 pb-20 sm:px-8 sm:pt-14 lg:px-12 lg:pt-16 lg:pb-28"
      >
        <Register
          ledger={<Ledger />}
          stone={<MarbleFace className="marble absolute inset-0 size-full" />}
          heading={
            <>
              <p className="eyebrow">StoneX ERP · by ShilaTeq</p>
              <h1 id="hero-h" className="display-cut text-hero text-charcoal-950 mt-5 text-balance">
                Your yard runs on{" "}
                <span className="relative inline-block whitespace-nowrap">
                  this page.
                  <svg
                    viewBox="0 0 200 12"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                    className="absolute -bottom-[0.06em] left-0 h-[0.12em] w-[96%]"
                  >
                    <path
                      d="M2 8C40 3 90 2 130 5s52 3 66-1"
                      fill="none"
                      stroke="var(--color-oxide-600)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                </span>
              </h1>
              <p className="text-lead text-charcoal-700 mt-8 max-w-[34rem]">
                StoneX gives every block in your yard its own identity, then runs cutting, quotes,
                GST invoices, payment records and dispatch from it. On the phones you already have.
              </p>
            </>
          }
        />
      </section>

      <section
        id="stonex"
        aria-labelledby="stonex-h"
        className="cv-auto mx-auto max-w-[1440px] scroll-mt-6 px-4 pb-24 sm:px-8 lg:px-12 lg:pb-32"
      >
        <div aria-hidden="true" className="bg-oxide-600 h-px w-full" />
        <div className="mt-12 grid gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <p className="eyebrow">StoneX ERP · simulated screen</p>
            <h2
              id="stonex-h"
              className="display-cut text-display text-charcoal-950 mt-4 text-balance"
            >
              One identity. Every job in the yard reads from it.
            </h2>
          </div>
          <p className="text-lead text-charcoal-700 self-end lg:col-span-6 lg:col-start-7">
            Search finds the block even when the spelling is off. Its record carries what it is,
            what it cost and how long it has waited, and the same identity drives cutting, quotes,
            GST invoices, payment records and dispatch.
          </p>
        </div>
        <div className="mt-12">
          <StonexPreview />
        </div>
        <p className="text-charcoal-500 mt-4 max-w-3xl text-[0.875rem]">
          Simulated StoneX screen with fictional sample data. The layout is simplified for this
          page; it is not a product screenshot and nothing here is connected to a real yard.
        </p>
      </section>

      <section aria-label="Keep going" className="cv-auto-sm border-ivory-200 border-t">
        <ul className="mx-auto grid max-w-[1440px] sm:grid-cols-3">
          {[
            ["Product overview", "Every part of StoneX, module by module", "/product"],
            ["How it compares", "Paper, Excel, accounting software, generic ERP", "/why"],
            ["Documentation", "The full product reference", "/docs"],
          ].map(([title, line, href]) => (
            <li
              key={href}
              className="border-ivory-200 border-b sm:border-r sm:border-b-0 sm:last:border-r-0"
            >
              {/* Plain anchor: a different root layout, so a full page load anyway. */}
              <a
                href={href}
                className="group hover:bg-ivory-100 block px-4 py-10 transition-colors sm:px-8 lg:px-12"
              >
                <span className="display-cut text-charcoal-950 block text-[1.75rem] leading-tight">
                  {title}{" "}
                  <span className="text-oxide-600 inline-block transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </span>
                <span className="text-charcoal-500 mt-2 block text-[0.9375rem]">{line}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
