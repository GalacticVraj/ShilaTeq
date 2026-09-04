import type { Metadata } from "next";
import { DoorsBlock } from "@/components/ui/DoorsBlock";
import { DocumentCard } from "@/components/ui/DocumentCard";
import { HonestyStrip } from "@/components/ui/HonestyStrip";

export const metadata: Metadata = {
  title: "Pricing — Simple plans for every yard",
  description:
    "ShilaTeq's pricing models for ERP SaaS. Starter, Growth, Professional, and Enterprise plans tailored for your yard's needs.",
};

const pricingTiers = [
  {
    name: "Starter",
    monthly: "₹1,499/mo",
    annually: "₹15,999/yr",
    builtFor: "Small yards digitising inventory and cutting-yield tracking for the first time",
  },
  {
    name: "Growth",
    monthly: "₹2,999/mo",
    annually: "₹31,999/yr",
    builtFor: "Yards ready to run quotations, orders and GST billing digitally, and stop double-selling stock",
  },
  {
    name: "Professional",
    monthly: "₹4,499/mo",
    annually: "₹47,999/yr",
    builtFor: "Full-cycle yards wanting dispatch, returns, procurement and the public 3D showroom for online leads",
  },
  {
    name: "Enterprise",
    monthly: "₹5,499/mo",
    annually: "₹65,988/yr",
    builtFor: "Larger processors and traders wanting workforce, payroll, full financial ledgers and BI reporting, plus priority support",
  },
] as const;

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
          Simple plans for every yard.
        </h1>
        <p className="text-body-lg text-ink-700 mt-5">
          Whether you&rsquo;re just starting to digitise your inventory or running a full-cycle operation, we have a tier that fits your needs perfectly. No hidden costs.
        </p>
      </header>

      {/* Pricing Tiers */}
      <section aria-label="Pricing tiers" className="mt-14 max-w-5xl">
        <h2 className="font-display text-heading-1 text-ink-900 font-medium">
          Choose your plan
        </h2>
        <div className="mt-6 overflow-x-auto">
          <table className="register w-full min-w-[800px]">
            <thead>
              <tr>
                <th scope="col" className="w-1/4">Tier</th>
                <th scope="col" className="w-1/6">Monthly</th>
                <th scope="col" className="w-1/6">Billed Annually</th>
                <th scope="col" className="w-5/12">Built For</th>
              </tr>
            </thead>
            <tbody>
              {pricingTiers.map((tier) => (
                <tr key={tier.name}>
                  <td className="text-ink-900 font-bold">{tier.name}</td>
                  <td className="text-ink-900">{tier.monthly}</td>
                  <td className="text-ink-900 font-medium">{tier.annually}</td>
                  <td className="text-ink-700">{tier.builtFor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

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
          Ready to get started?
        </h2>
        <p className="text-body text-ink-700 mt-3">
          Tell us which plan you&rsquo;re interested in, and we&rsquo;ll help you get set up.
        </p>
        <div className="mt-6">
          <DoorsBlock
            variant="pricing"
            waPrefix="Mujhe ShilaTeq plan ke baare mein baat karni hai."
          />
        </div>
      </section>
    </div>
  );
}
