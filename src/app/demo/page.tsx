import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/ui/JsonLd";
import { WhatsAppGlyph } from "@/components/ui/DoorsBlock";
import { DemoStepNav } from "@/components/demo/DemoStepNav";
import { DemoResume } from "@/components/demo/DemoResume";
import { DemoLaunch } from "@/components/demo/DemoLaunch";
import { QualForm } from "@/components/demo/QualForm";
import { demoSteps, getStep, TOTAL_STEPS } from "@/content/demoSteps";
import { site, waLink, waDefaultPrefill } from "@/config/site";

export const metadata: Metadata = {
  title: "Try the full ShilaTeq demo — no signup",
  description:
    "A full yard — stock, orders, workers — yours to run. A guided six-step walkthrough of the real product, with sample data and a reset button. Nothing to install, no signup.",
  ...(site.url ? { alternates: { canonical: "/demo" } } : {}),
  openGraph: {
    title: "Try the full ShilaTeq demo — no signup",
    description: "A full yard, yours to run. Six guided steps, real product, no signup.",
    type: "website",
  },
};

/** Full demo-app URL for a step's deep action (null until Gate-zero resolves). */
function demoUrl(deepPath = ""): string | null {
  return site.demoAppUrl ? `${site.demoAppUrl}${deepPath}?src=demo` : null;
}

function parsePhase(raw?: string): "overview" | number | "done" {
  if (raw === "done") return "done";
  const n = Number(raw);
  if (Number.isInteger(n) && n >= 1 && n <= TOTAL_STEPS) return n;
  return "overview";
}

export default async function DemoPage({
  searchParams,
}: {
  searchParams: Promise<{ step?: string }>;
}) {
  const { step } = await searchParams;
  const phase = parsePhase(step);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Demo", href: "/demo" },
        ]}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "ShilaTeq",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "INR",
            description: "Free interactive demo",
          },
        }}
      />

      {phase === "overview" ? <Overview /> : null}
      {typeof phase === "number" ? <StepView n={phase} /> : null}
      {phase === "done" ? <Done /> : null}
    </div>
  );
}

/* ─────────────────────────── Overview ─────────────────────────── */

function Overview() {
  const wa = waLink(waDefaultPrefill);
  return (
    <div className="mt-8 max-w-2xl">
      <p className="eyebrow">The demo</p>
      <h1 className="font-display text-display-2 text-ink-900 mt-3 font-medium tracking-tight">
        A full yard. Yours to run.
      </h1>
      <p className="text-body-lg text-ink-700 mt-5">
        This is the real product, loaded with a sample yard — stock, orders, workers, money.
        We&rsquo;ll walk you through the six things worth trying first, in order. Explore alone.
        Reset anytime. No signup, nothing to install, and no one will call you.
      </p>

      <div className="mt-8">
        <Link
          href="/demo?step=1"
          className="rounded-paper bg-ink-900 text-body text-paper-2 ease-standard inline-flex min-h-12 items-center gap-2 px-6 py-3 font-bold transition-colors duration-180 hover:bg-black active:scale-[0.98] motion-reduce:active:scale-100"
        >
          Start the walkthrough →
        </Link>
        <p className="text-label text-ink-500 mt-2 font-mono">
          6 steps · about 5 minutes · no signup
        </p>
      </div>

      <DemoResume />

      {/* Static overview — crawlable, complete with no JS */}
      <section aria-labelledby="what-youll-do" className="mt-12">
        <h2 id="what-youll-do" className="font-display text-heading-1 text-ink-900 font-medium">
          What you&rsquo;ll do
        </h2>
        <ol className="mt-6">
          {demoSteps.map((s) => (
            <li
              key={s.key}
              className="border-line-100 grid grid-cols-[2.5rem_1fr] gap-3 border-b py-4 first:border-t"
            >
              <span className="text-label text-ink-500 font-mono">
                {String(s.n).padStart(2, "0")}
              </span>
              <div>
                <Link
                  href={`/demo?step=${s.n}`}
                  className="text-heading-3 text-ink-900 font-sans font-bold hover:underline hover:underline-offset-2"
                >
                  {s.title}
                </Link>
                <p className="text-body text-ink-700 mt-1">{s.youllSee}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Direct open + WhatsApp */}
      <section aria-label="Or jump straight in" className="border-line-100 mt-12 border-t pt-8">
        <p className="text-body text-ink-700">
          Prefer to explore on your own? Open the demo yard directly.
        </p>
        <div className="mt-4">
          <DemoLaunch href={demoUrl()} label="Open the demo yard" waHref={wa} />
        </div>
        {wa ? (
          <p className="text-body-sm text-ink-700 mt-6">
            Questions as you go?{" "}
            <a href={wa} target="_blank" rel="noopener noreferrer" className="prose-link">
              Ask us on WhatsApp
            </a>
            .
          </p>
        ) : null}
      </section>
    </div>
  );
}

/* ─────────────────────────── A step ─────────────────────────── */

function StepView({ n }: { n: number }) {
  const s = getStep(n)!;
  const wa = waLink(`${waDefaultPrefill} Main demo ke step ${n} par hoon.`);

  return (
    <div className="mt-8 max-w-2xl">
      <DemoStepNav current={n} total={TOTAL_STEPS} />

      <div className="mt-8">
        <p className="eyebrow">
          Step {n} of {TOTAL_STEPS}
        </p>
        <h1
          id="demo-step-heading"
          tabIndex={-1}
          className="font-display text-display-2 text-ink-900 mt-2 font-medium tracking-tight outline-none"
        >
          {s.title}
        </h1>

        <div className="mt-6 space-y-5">
          <p className="text-body-lg text-ink-700">{s.pain}</p>

          <div className="rounded-paper border-line-100 bg-paper-1 border p-5">
            <p className="eyebrow">Do this</p>
            <p className="text-body text-ink-900 mt-2">{s.doThis}</p>
          </div>

          <div className="rounded-paper border-line-100 bg-paper-2 shadow-desk border p-5">
            <p className="eyebrow">What you&rsquo;ll see</p>
            <p className="text-body text-ink-900 mt-2">{s.youllSee}</p>
          </div>

          {s.note ? (
            <p className="border-accent-600 bg-paper-1 text-body-sm text-ink-700 border-l-2 py-3 pr-3 pl-4">
              <span className="text-ink-900 font-bold">Honestly: </span>
              {s.note}
            </p>
          ) : null}

          <div className="pt-2">
            <DemoLaunch href={demoUrl(s.deepPath)} label={s.actionLabel} waHref={wa} />
          </div>
        </div>
      </div>

      {/* Quiet WhatsApp rail with step context */}
      {wa ? (
        <p className="border-line-100 text-body-sm text-ink-700 mt-10 border-t pt-6">
          Stuck on this step?{" "}
          <a href={wa} target="_blank" rel="noopener noreferrer" className="prose-link">
            <WhatsAppGlyph className="text-ok-600 inline size-4 align-text-bottom" /> Ask us on
            WhatsApp
          </a>{" "}
          — we&rsquo;ll know exactly where you are.
        </p>
      ) : null}
    </div>
  );
}

/* ─────────────────────────── Completion ─────────────────────────── */

function Done() {
  const wa = waLink(`${waDefaultPrefill} Maine poora demo dekh liya.`);
  return (
    <div className="mt-8 max-w-2xl">
      <p className="eyebrow">You&rsquo;ve seen it all</p>
      <h1 className="font-display text-display-2 text-ink-900 mt-3 font-medium tracking-tight">
        That showroom you saw? Real yard. Real stone.
      </h1>
      <p className="text-body-lg text-ink-700 mt-5">
        You&rsquo;ve now touched every part of ShilaTeq that matters — finding stone, cutting it
        honestly, holding the line on payment, and putting a yard online. The rest is your
        yard&rsquo;s own numbers.
      </p>

      <div className="mt-10">
        <QualForm />
      </div>

      {/* Skip path — the plain door */}
      <section aria-label="Or just explore" className="border-line-100 mt-10 border-t pt-8">
        <p className="text-body text-ink-700">
          Not ready to talk? That&rsquo;s fine — keep exploring the demo yard as long as you like.
        </p>
        <div className="mt-4">
          <DemoLaunch href={demoUrl()} label="Back to the demo yard" waHref={wa} />
        </div>
        <p className="mt-6">
          <Link href="/demo" className="prose-link text-body">
            Restart the walkthrough
          </Link>
        </p>
      </section>
    </div>
  );
}
