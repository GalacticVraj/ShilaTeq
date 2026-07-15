import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { DoorsBlock } from "@/components/ui/DoorsBlock";
import { HonestyStrip, type HonestyItem } from "@/components/ui/HonestyStrip";
import { JsonLd } from "@/components/ui/JsonLd";
import { Reveal } from "@/components/home/Reveal";
import { RevealRunner } from "@/components/shared/RevealRunner";

/**
 * Pillar page scaffold — the miniature arc, binding order (phase-4/04 §2 /
 * phase-4/07): pain opener → mechanism (taught) → proof → the native
 * objection answered in place → feature register (completeness) → one honest
 * limit → the doors. Server component; motion = narrative reveals only.
 */

export type PillarConfig = {
  slug: string;
  eyebrow: string;
  /** The pillar's pain-question h1 (plain register). */
  h1: string;
  /** Two-sentence sting under the h1. */
  sting: string;
  /** The native objection, in the visitor's words, and its structural answer. */
  objection: { q: string; a: string };
  /** The completeness register: [capability, one plain line]. */
  register: Array<[string, string]>;
  registerCaption: string;
  /** One honest limit (+ roadmap flag). */
  limit: HonestyItem;
  /** Doors config. */
  demoHref: string;
  demoMicroline: string;
  waPrefix: string;
  comparison: { label: string; href: string };
};

export function PillarPage({
  config,
  children,
}: {
  config: PillarConfig;
  /** The mechanism + proof sections (pillar-specific). */
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <RevealRunner />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Product", href: "/product" },
          { label: config.eyebrow, href: `/product/${config.slug}` },
        ]}
      />

      {/* Opener — the pain, named */}
      <header className="mt-10 max-w-2xl">
        <p className="eyebrow">{config.eyebrow}</p>
        <h1 className="font-display text-display-2 text-ink-900 mt-3 font-medium tracking-tight">
          {config.h1}
        </h1>
        <p className="text-body-lg text-ink-700 mt-5">{config.sting}</p>
      </header>

      {/* Mechanism + proof (pillar-specific) */}
      {children}

      {/* The native objection, answered where it arises */}
      <Reveal className="reveal mt-16 max-w-2xl">
        <section aria-label="The honest question">
          <div className="rounded-paper border-line-300 bg-paper-2 shadow-desk border p-6">
            <p className="text-body-lg text-ink-900 font-bold">
              &ldquo;{config.objection.q}&rdquo;
            </p>
            <p className="text-body text-ink-700 mt-3">{config.objection.a}</p>
          </div>
        </section>
      </Reveal>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: config.objection.q,
              acceptedAnswer: { "@type": "Answer", text: config.objection.a },
            },
          ],
        }}
      />

      {/* The completeness register */}
      <Reveal className="reveal mt-16 max-w-3xl">
        <section aria-label="Everything in this part of ShilaTeq">
          <h2 className="font-display text-heading-1 text-ink-900 font-medium">
            Everything this covers
          </h2>
          <table className="register mt-6">
            <caption className="sr-only">{config.registerCaption}</caption>
            <thead>
              <tr>
                <th scope="col">Capability</th>
                <th scope="col">What it does for the yard</th>
              </tr>
            </thead>
            <tbody>
              {config.register.map(([cap, line]) => (
                <tr key={cap}>
                  <td className="text-ink-900 font-bold">{cap}</td>
                  <td className="text-ink-700">{line}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </Reveal>

      {/* One honest limit */}
      <div className="mt-16 max-w-2xl">
        <HonestyStrip title="The honest part" items={[config.limit]} headingLevel="h2" />
      </div>

      {/* The doors + the comparison bridge */}
      <section aria-label="See it yourself" className="mt-16 max-w-2xl">
        <h2 className="font-display text-heading-1 text-ink-900 font-medium">
          Decide on evidence, not on our words.
        </h2>
        <div className="mt-6">
          <DoorsBlock
            demoHref={config.demoHref}
            demoMicroline={config.demoMicroline}
            waPrefix={config.waPrefix}
          />
        </div>
        <p className="text-body text-ink-700 mt-6">
          Weighing it against what you use today?{" "}
          <Link href={config.comparison.href} className="prose-link">
            {config.comparison.label}
          </Link>
        </p>
      </section>
    </div>
  );
}
