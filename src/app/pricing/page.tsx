import type { Metadata } from "next";
import { DoorsBlock } from "@/components/ui/DoorsBlock";
import { DocumentCard } from "@/components/ui/DocumentCard";
import { HonestyStrip } from "@/components/ui/HonestyStrip";

export const metadata: Metadata = {
  title: "Pricing — and what you'll never pay for",
  description:
    "ShilaTeq's cost shape: no hardware, no servers, no per-message fees, no payment-gateway cut, no lock-in. Ask on WhatsApp — an answer today.",
};

/**
 * PRICING — the cost-shape page (phase-4/04 §6) and the system's designated
 * prototype (phase-4/12 M1): dense, honest, componentful — the guinea pig for
 * tokens, Register, Documents, HonestyStrip and the flipped DoorsBlock.
 * The number slot (§6.4) is ABSENT until [Founder B6] resolves — never
 * placeholdered (phase-4/14 rule 8).
 */

const costShape = [
  {
    item: "No hardware to buy",
    why: "ShilaTeq runs in the browser on the phones and computers your yard already owns. The camera is the scanner.",
  },
  {
    item: "No servers to run",
    why: "Your data lives in a managed cloud. Nothing to patch, back up, or babysit.",
  },
  {
    item: "No per-message fees",
    why: "Quotes, invoices, and reminders go over WhatsApp click-to-chat links — there is no messaging bill.",
  },
  {
    item: "No payment-gateway cut",
    why: "ShilaTeq records the payments you collect. It never takes a percentage of your money.",
  },
  {
    item: "No lock-in",
    why: "Everything exports to Excel and CSV, always. Your data is yours — leaving is easy, which is why staying has to be earned.",
  },
] as const;

const honesty = [
  {
    fact: "We haven't published a price list here yet.",
    reason:
      "Pricing depends on your yard. Ask on WhatsApp and you'll have a straight answer today — not a callback next week.",
  },
  {
    fact: "Payments are recorded, not collected.",
    reason:
      "No transaction fees and no compliance overhead. Online UPI collection is on the roadmap.",
    roadmap: true,
  },
  {
    fact: "One yard per account today.",
    reason: "Group rollups for multi-yard owners are on the roadmap.",
    roadmap: true,
  },
] as const;

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      {/* Opener — disarm (07: primary message first) */}
      <header className="max-w-2xl">
        <p className="eyebrow">Pricing</p>
        <h1 className="font-display text-display-2 text-ink-900 mt-3 font-medium tracking-tight">
          What ShilaTeq costs — and what it never will.
        </h1>
        <p className="text-body-lg text-ink-700 mt-5">
          Pricing depends on your yard — how much stone, how many people. Ask us on WhatsApp and
          you&rsquo;ll get an answer today. What we can tell you right now is the shape of the cost:
          the list of things you will never pay for.
        </p>
      </header>

      {/* The cost-shape register */}
      <section aria-label="What you'll never pay for" className="mt-14 max-w-3xl">
        <h2 className="font-display text-heading-1 text-ink-900 font-medium">
          What you&rsquo;ll never pay for
        </h2>
        <table className="register mt-6">
          <thead>
            <tr>
              <th scope="col">Never on your bill</th>
              <th scope="col">Why</th>
            </tr>
          </thead>
          <tbody>
            {costShape.map((row) => (
              <tr key={row.item}>
                <td className="text-ink-900 font-bold">
                  <span aria-hidden="true" className="text-ok-600 mr-2">
                    ✓
                  </span>
                  {row.item}
                </td>
                <td className="text-ink-700">{row.why}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* What onboarding includes */}
      <section aria-label="What onboarding includes" className="mt-14 max-w-3xl">
        <DocumentCard eyebrow="Getting started" title="What setup includes">
          <ul className="mt-2 list-none space-y-2">
            <li>Your yard provisioned and handed over ready to log in.</li>
            <li>
              Settings done <em>with</em> you — GSTIN, GST rate, block-code prefix, aging thresholds
              — so every calculation is right from day one.
            </li>
            <li>Help tagging your first fifty blocks.</li>
            <li>Worker logins created, so the floor starts on day one.</li>
          </ul>
        </DocumentCard>
      </section>

      {/* Honesty strip */}
      <section className="mt-14 max-w-3xl">
        <HonestyStrip title="The honest part" items={[...honesty]} />
      </section>

      {/* Doors — the one page where the order flips (phase-4/04 §6.7) */}
      <section aria-label="Talk to us" className="mt-14 max-w-3xl">
        <h2 className="font-display text-heading-1 text-ink-900 font-medium">
          Get your number today
        </h2>
        <p className="text-body text-ink-700 mt-3">
          Tell us roughly how many blocks and slabs your yard holds, and we&rsquo;ll give you a
          straight price — usually within minutes.
        </p>
        <div className="mt-6">
          <DoorsBlock
            variant="pricing"
            waPrefix="Mujhe pricing ke baare mein jaanna hai. Mere yard mein lagbhag ___ blocks hain."
          />
        </div>
      </section>
    </div>
  );
}
