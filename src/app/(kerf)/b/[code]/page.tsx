import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SAMPLE_YARD, ageBand, findBlock, sampleBlocks } from "@/content/sampleYard";

/**
 * Where the homepage's QR codes land: a SAMPLE public block card. It shows only
 * the safe fields a real StoneX QR card shows (06_Screens_and_Pages, QR Block
 * Card) — never purchase price or supplier. Noindex: it is a demonstration.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return sampleBlocks.map((b) => ({ code: b.code.toLowerCase() }));
}

type Props = { params: Promise<{ code: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  return {
    title: `${code.toUpperCase()} — sample block card`,
    robots: { index: false, follow: true },
  };
}

export default async function BlockCard({ params }: Props) {
  const { code } = await params;
  const b = findBlock(code);
  if (!b) notFound();

  const fields = [
    ["Stone", `${b.stone} · ${b.type}`],
    ["Grade", b.grade],
    ["Size", b.size],
    ["Quantity", "1 block"],
    ["Finish", b.finish],
    ["Location", b.zone],
    ["Age in yard", `${b.ageDays} days (${ageBand(b.ageDays)})`],
  ] as const;

  return (
    <section className="mx-auto max-w-xl px-4 py-12 sm:py-16">
      <p className="eyebrow">Sample · what a scanned StoneX label opens</p>
      <article className="border-charcoal-900/15 bg-label mt-5 border">
        <p
          className={
            b.status === "Available"
              ? "bg-forest-800 text-ivory-50 px-5 py-2 font-mono text-[0.8125rem] tracking-[0.12em] uppercase"
              : "bg-charcoal-900 text-ivory-50 px-5 py-2 font-mono text-[0.8125rem] tracking-[0.12em] uppercase"
          }
        >
          {b.status}
        </p>
        <div className="p-5 sm:p-6">
          <h1 className="text-charcoal-950 font-mono text-[2rem] leading-none font-semibold">
            {b.code}
          </h1>
          <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4">
            {fields.map(([k, v]) => (
              <div key={k}>
                <dt className="eyebrow">{k}</dt>
                <dd className="text-charcoal-900 mt-1">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </article>
      <p className="text-charcoal-700 mt-6 text-[0.9375rem]">
        This is a fictional block in a sample yard ({SAMPLE_YARD}). On a real yard, scanning a
        StoneX label opens a card like this one: public, with safe fields only. It never shows the
        price the yard paid or who supplied the stone.
      </p>
      <Link
        href="/"
        className="text-forest-700 mt-6 inline-flex min-h-11 items-center font-semibold underline underline-offset-4"
      >
        Back to the register
      </Link>
    </section>
  );
}
