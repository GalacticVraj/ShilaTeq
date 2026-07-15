import { DoorsBlock } from "@/components/ui/DoorsBlock";
import { HonestyStrip } from "@/components/ui/HonestyStrip";
import { Reveal } from "@/components/home/Reveal";
import { StoneTexture } from "@/components/home/StoneTexture";
import { BlockFace, BlockQRLabel, BLOCK_CODE } from "@/components/home/FollowedBlock";
import { S3Identity } from "@/components/home/S3Identity";
import { S4Pipeline } from "@/components/home/S4Pipeline";
import { S5NightShed } from "@/components/home/S5NightShed";
import { CopyLine } from "@/components/home/CopyLine";
import { SceneRunner } from "@/components/home/SceneRunner";
import { site } from "@/config/site";
import { Button } from "@/components/ui/Button";

/**
 * HOME — the nine-scene film (phase-4/03, choreography per phase-4/05).
 * Scene order is sacred (phase-4/14 via Phase-2 story law). Approved
 * fallbacks in use are recorded in AMENDMENTS A-006.
 */

const LOSSES = [
  {
    label: "TUE · 11:40",
    line: "The block nobody could find while the buyer waited.",
    detail: "Thousands of near-identical blocks, no index — a sale lost to a walk around the yard.",
  },
  {
    label: "THU · 17:05",
    line: "The slab that sold below cost. Nobody knew.",
    detail: "Cutting wastage never entered the price, so the margin was a guess wearing a number.",
  },
  {
    label: "ROW 6 · 180 DAYS",
    line: "The stone quietly eating cash as it ages.",
    detail: "Dead capital doesn't announce itself — it just sits there, month after month.",
  },
  {
    label: "SAT · 12:15",
    line: "The same block, promised to two buyers.",
    detail: "Two salesmen, one register, no way to know — and one very awkward phone call.",
  },
  {
    label: "LEDGER PG. 84",
    line: "The credit that quietly became a bad debt.",
    detail: "Sold on trust, tracked in memory — exposure nobody could see until it was gone.",
  },
] as const;

const HONESTY = [
  {
    fact: "Payments are recorded, not collected.",
    reason: "No gateway fees, no cut of your money. Online UPI collection is on the roadmap.",
    roadmap: true,
  },
  {
    fact: "Messages go by WhatsApp, not email.",
    reason: "It's the channel your customers actually read. There is no email system — by design.",
  },
  {
    fact: "One yard per account today.",
    reason: "Group rollups for multi-yard owners are on the roadmap.",
    roadmap: true,
  },
  {
    fact: "No app-store app. Add it to your home screen.",
    reason: "It's how ShilaTeq stays instant on any phone, with nothing to install or update.",
  },
  {
    fact: "The full audit trail is still being completed.",
    reason: "An activity view exists today; automatic logging of every action is in progress.",
    roadmap: true,
  },
] as const;

export default function Home() {
  return (
    <>
      <SceneRunner />
      {/* ================= S0 — ARRIVAL ================= */}
      <section id="top" className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-10 py-16 sm:py-20 lg:grid-cols-[11fr_9fr] lg:gap-14">
          <div>
            <h1 className="overture-1 font-display text-display-1 text-ink-900 font-medium tracking-tight">
              Your whole yard. On one phone.
            </h1>
            <div className="overture-2">
              <p className="text-body-lg text-ink-700 mt-6 max-w-xl">
                Every block, every rupee, every worker, every customer — ShilaTeq runs your stone
                yard end to end. In English or Hindi. Even when there&rsquo;s no signal.
              </p>
              <div className="mt-8">
                <DoorsBlock />
              </div>
            </div>
          </div>
          {/* The material field — the followed block, present from first paint. */}
          <div className="parallax-09" aria-hidden="true">
            <BlockFace className="aspect-[4/3] w-full">
              <div className="absolute bottom-4 left-4">
                <BlockQRLabel />
              </div>
            </BlockFace>
          </div>
        </div>
        <p className="eyebrow border-line-100 border-t pt-4 pb-10">the whole story ↓</p>
      </section>

      {/* ================= S1 — RECOGNITION ================= */}
      <section
        id="yard"
        aria-labelledby="yard-h"
        className="cv-scene mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28"
      >
        <Reveal className="reveal max-w-2xl">
          <p className="eyebrow">The yard</p>
          <h2
            id="yard-h"
            className="font-display text-display-2 text-ink-900 mt-3 font-medium tracking-tight"
          >
            You run crores on memory. And it works.
          </h2>
          <p className="text-body-lg text-ink-700 mt-6">
            Rows of blocks under the open sky, each worth anywhere from thousands to lakhs. A
            register that has never missed a day. Chalk marks that mean something to exactly one
            person. Your memory, doing the work of a system — and doing it well.
          </p>
          <p className="text-body-lg text-ink-700 mt-4">
            Nobody built this business with software. You built it with discipline, trust, and
            thirty years of knowing every stone by heart.
          </p>
          <p className="font-display text-heading-1 text-ink-900 mt-6 font-medium">
            It works — until the day it doesn&rsquo;t.
          </p>
        </Reveal>
      </section>

      {/* ================= S2 — THE LEDGER OF LOSSES ================= */}
      <section id="losses" aria-labelledby="losses-h" className="cv-scene-tall bg-paper-1">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <Reveal className="reveal max-w-2xl">
            <p className="eyebrow">The silent losses</p>
            <h2
              id="losses-h"
              className="font-display text-display-2 text-ink-900 mt-3 font-medium tracking-tight"
            >
              Where a yard bleeds without noticing.
            </h2>
            <p className="text-body text-ink-700 mt-4">
              These are the trade&rsquo;s losses, not yours alone. Every yard bleeds here — the
              bleed just never had a name.
            </p>
          </Reveal>
          <Reveal
            as="ul"
            className="reveal stagger [&>li]:ease-standard mt-10 max-w-2xl [&>li]:transition-[opacity,transform] [&>li]:duration-400"
          >
            {LOSSES.map((loss) => (
              <li key={loss.label} className="border-line-300 border-b first:border-t">
                <details className="group py-4">
                  <summary className="flex cursor-pointer list-none items-baseline gap-4 [&::-webkit-details-marker]:hidden">
                    <span className="text-label text-ink-500 shrink-0 font-mono">{loss.label}</span>
                    <span className="text-body text-ink-900">{loss.line}</span>
                  </summary>
                  <p className="text-body-sm text-ink-700 mt-2 pl-0 sm:pl-[7.5rem]">
                    {loss.detail}
                  </p>
                </details>
              </li>
            ))}
          </Reveal>
          <Reveal className="reveal mt-10 max-w-2xl">
            <p className="font-display text-heading-1 text-ink-900 font-medium">
              Every one of these has the same cause: the yard can&rsquo;t see itself.
            </p>
          </Reveal>
          {/* The baseline rule draws full-width and persists into S3. */}
          <Reveal className="mt-12">
            <div className="rule-draw bg-ink-900 h-px w-full" aria-hidden="true" />
          </Reveal>
        </div>
      </section>

      {/* ================= S3 — THE IDEA: QR IDENTITY (Signature #1) ================= */}
      <section
        id="identity"
        aria-labelledby="identity-h"
        className="cv-scene-tall mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32"
      >
        <div className="max-w-2xl">
          <p className="eyebrow">The idea</p>
          <h2
            id="identity-h"
            className="font-display text-display-2 text-ink-900 mt-3 font-medium tracking-tight"
          >
            Every block gets an identity.
          </h2>
        </div>

        {/* Text-equivalent summary precedes the visual (phase-4/03 S3). */}
        <p className="sr-only">
          A stone block receives a QR label the moment it arrives. Its code is {BLOCK_CODE}. Its
          record holds what it is, what it cost, and how old it is. Point a phone at any block, and
          the stone tells you everything.
        </p>

        <S3Identity>
          <div
            className="mt-12 grid items-center gap-10 lg:grid-cols-[10fr_9fr]"
            aria-hidden="true"
          >
            {/* The block sits on S2's baseline. */}
            <div className="relative">
              <BlockFace className="aspect-[4/3] w-full">
                <div className="s3-label absolute bottom-5 left-5">
                  <BlockQRLabel />
                </div>
              </BlockFace>
              <p className="text-heading-3 text-ink-900 mt-3 font-mono">
                <span className="s3-code inline-block align-bottom">{BLOCK_CODE}</span>
                <span className="s3-caret bg-ink-900 inline-block w-[2px] -translate-y-[2px] self-stretch">
                  &nbsp;
                </span>
              </p>
            </div>

            {/* The record draws itself around the stone. */}
            <ul className="space-y-5">
              {[
                { k: "what it is", v: "Makrana white · Grade A · 9×4 ft", delay: "1000ms" },
                {
                  k: "what it cost",
                  v: "cost basis carried from the day it arrived",
                  delay: "1060ms",
                },
                {
                  k: "how old it is",
                  v: "aging fresh → amber → red, watched daily",
                  delay: "1120ms",
                },
              ].map((a, i) => (
                <li key={a.k} className="flex items-start gap-4">
                  <svg
                    viewBox="0 0 80 2"
                    className="mt-3.5 h-0.5 w-14 shrink-0 sm:w-20"
                    aria-hidden="true"
                  >
                    <line
                      className="s3-leader"
                      x1="0"
                      y1="1"
                      x2="80"
                      y2="1"
                      stroke="var(--color-ink-700)"
                      strokeWidth="2"
                      style={{ animationDelay: `${820 + i * 60}ms` }}
                    />
                  </svg>
                  <div className="s3-annot" style={{ animationDelay: a.delay }}>
                    <p className="eyebrow">{a.k}</p>
                    <p className="text-body text-ink-900 mt-0.5">{a.v}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <p className="s3-support text-body-lg text-ink-700 mt-12 max-w-2xl">
            Point a phone at any block, and the stone tells you everything.
            {site.url ? <> The QR above is real — scan it.</> : null}
          </p>
        </S3Identity>

        <p className="font-display text-heading-1 text-ink-900 mt-10 max-w-2xl font-medium">
          And once every block has an identity, the whole yard can run on it.
        </p>
      </section>

      {/* ================= S4 — THE WHOLE YARD, MOVING (Signature #2) ================= */}
      <section
        id="pipeline"
        aria-labelledby="pipeline-h"
        className="cv-scene-tall mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28"
      >
        <Reveal className="reveal max-w-2xl">
          <p className="eyebrow">The whole yard</p>
          <h2
            id="pipeline-h"
            className="font-display text-display-2 text-ink-900 mt-3 font-medium tracking-tight"
          >
            From quarry truck to delivered invoice. In order.
          </h2>
          <p className="text-body-lg text-ink-700 mt-4">
            One order&rsquo;s life, the way your yard actually runs it — with your own rule at the
            center.
          </p>
        </Reveal>
        <div className="mt-12 max-w-2xl">
          <S4Pipeline />
        </div>
        <Reveal className="reveal mt-10 max-w-2xl">
          <p className="text-body-lg text-ink-700">
            But who&rsquo;s going to use all this?{" "}
            <span className="text-ink-900 font-bold">Your workers?</span>
          </p>
        </Reveal>
      </section>

      {/* ================= S5 — THE NIGHT SHED (Signature #3) ================= */}
      <section id="workers" aria-labelledby="workers-h" className="cv-scene-tall scene-night">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <div className="grid gap-10 lg:grid-cols-[11fr_9fr] lg:gap-14">
            <Reveal className="reveal">
              <p className="eyebrow">The people</p>
              <h2
                id="workers-h"
                className="font-display text-display-2 text-night-ink mt-3 font-medium tracking-tight"
              >
                Ramesh can use this. In the shed. With no signal.
              </h2>
              <ul className="text-body-lg text-night-ink-soft mt-8 max-w-xl space-y-4">
                <li>
                  <span className="text-night-ink font-bold">A username. Nothing else.</span> No
                  email, no password to memorize — his admin sets it up in a tap.
                </li>
                <li>
                  <span className="text-night-ink font-bold">Icons and numbers first.</span> The
                  whole worker app runs in English or <span lang="hi">हिंदी</span> — built for hands
                  that work stone, not keyboards.
                </li>
                <li>
                  <span className="text-night-ink font-bold">Works offline.</span> A full shift
                  logged in a dead zone. Everything saved, synced once — never lost, never counted
                  twice.
                </li>
              </ul>
              <p className="text-body text-night-ink-soft mt-8 max-w-xl">
                And it shows a worker his own pay. In a trade that runs on trust, that says
                everything.
              </p>
            </Reveal>
            <Reveal className="reveal self-center">
              <S5NightShed />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ================= S6 — THE SHOWROOM (Signature #4) ================= */}
      <section
        id="showroom"
        aria-labelledby="showroom-h"
        className="cv-scene-tall mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-36"
      >
        <Reveal className="reveal mx-auto max-w-2xl text-center">
          <p className="eyebrow">The world sees your yard</p>
          <h2
            id="showroom-h"
            className="font-display text-display-2 text-ink-900 mt-3 font-medium tracking-tight"
          >
            And while your yard runs itself — the world can finally see it.
          </h2>
        </Reveal>

        <Reveal className="mt-14">
          <div className="grid items-stretch gap-4 sm:grid-cols-[1fr_6fr_1fr]">
            <div
              className="s6-stage-l rounded-paper-sm hidden overflow-hidden sm:block"
              aria-hidden="true"
            >
              <StoneTexture seed={7} className="size-full" />
            </div>
            <div className="s6-frame rounded-paper border-ink-900 bg-paper-2 shadow-desk-2 border p-6 sm:p-10">
              <p className="eyebrow">The showroom</p>
              <h3 className="font-display text-heading-1 text-ink-900 mt-3 font-medium">
                Your yard. Looking like this.
              </h3>
              <p className="text-body-lg text-ink-700 mt-4 max-w-xl">
                Every ShilaTeq yard gets its own public 3D showroom at its own link — real stone,
                browsable by any buyer, on any phone. It rides on every invoice and every WhatsApp
                message you send: your paperwork becomes your marketing.
              </p>
              <div className="border-line-100 mt-6 border-t pt-5">
                <p className="text-body text-ink-900 font-bold">
                  &ldquo;But who sees my prices?&rdquo;
                </p>
                <p className="text-body text-ink-700 mt-1 max-w-xl">
                  You choose, block by block. A price — or simply{" "}
                  <span className="font-mono">&ldquo;On request&rdquo;</span>. Competitors see
                  nothing you don&rsquo;t show. Your costs, suppliers, and margins are never public.
                  Ever.
                </p>
              </div>
              <div className="mt-8">
                {site.showroomUrl ? (
                  <Button href={site.showroomUrl} external>
                    Open the live showroom ↗
                  </Button>
                ) : (
                  <Button href="/demo" microline="the showroom is step 6">
                    See it in the demo
                  </Button>
                )}
              </div>
            </div>
            <div
              className="s6-stage-r rounded-paper-sm hidden overflow-hidden sm:block"
              aria-hidden="true"
            >
              <StoneTexture seed={11} className="size-full" />
            </div>
          </div>
        </Reveal>

        <Reveal className="reveal mx-auto mt-14 max-w-2xl text-center">
          <p className="text-body-lg text-ink-700">
            Now — before you decide, here&rsquo;s what we don&rsquo;t do.
          </p>
        </Reveal>
      </section>

      {/* ================= S7 — THE HONEST LOOK ================= */}
      {/* Deliberately the least designed section on the page (phase-4/03 S7). */}
      <section
        id="honesty"
        aria-labelledby="honesty-h"
        className="cv-scene mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20"
      >
        <div className="max-w-2xl">
          <HonestyStrip items={[...HONESTY]} />
          <p className="text-body text-ink-900 mt-8">
            That&rsquo;s the whole truth. The rest you should see for yourself.
          </p>
        </div>
      </section>

      {/* ================= S8 — THE OPEN GATE ================= */}
      <section
        id="doors"
        aria-labelledby="doors-h"
        className="cv-scene mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28"
      >
        <div className="mx-auto max-w-2xl text-center">
          <h2
            id="doors-h"
            className="font-display text-display-2 text-ink-900 font-medium tracking-tight"
          >
            See it for yourself.
          </h2>
          <p className="text-body-lg text-ink-700 mt-4">
            The full product, a sample yard, and a reset button. Explore alone — no signup, nothing
            to install, and no one will call you.
          </p>
          <div className="mt-8 flex justify-center">
            <DoorsBlock demoMicroline="no signup · nothing to install · reset anytime" />
          </div>
          <p className="border-line-100 text-body text-ink-700 mt-14 border-t pt-6">
            QR on every block · the whole yard on one phone · Hindi, even offline
          </p>
          <p className="mt-2">
            <CopyLine line="ShilaTeq — QR on every block, the whole yard on one phone, works in Hindi even offline" />
          </p>
        </div>
      </section>
    </>
  );
}
