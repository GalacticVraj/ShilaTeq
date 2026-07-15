import type { Metadata } from "next";
import { PillarPage, type PillarConfig } from "@/components/product/PillarPage";
import { ExhibitPending } from "@/components/ui/ExhibitPending";
import { Reveal } from "@/components/home/Reveal";

export const metadata: Metadata = {
  title: "Orders, payments & one-tap GST invoices for stone yards",
  description:
    "A payment-gated pipeline: atomic reservations that end double-selling, credit-limit checks, store credit that never leaks, and compliant CGST/SGST/IGST invoices with HSN 6802.",
};

const config: PillarConfig = {
  slug: "sales-gst",
  eyebrow: "The money",
  h1: "Sold below cost. Nobody knew.",
  sting:
    "Margins guessed, credit tracked in memory, the same block promised twice, and GST math done by hand at month-end. The money side of a yard doesn't fail loudly — it leaks quietly.",
  objection: {
    q: "We already have Tally.",
    a: "Keep it. Tally keeps your books; ShilaTeq runs your yard — upstream of the books, where the stone and the money actually move. By the time numbers reach your accountant they're already true, as GST-compliant invoices and clean Excel exports. Direct Tally sync is on our roadmap.",
  },
  register: [
    [
      "Quotes that hold no stock",
      "Pitch the same block to five buyers; first to convert wins it. GST previewed on every quote.",
    ],
    [
      "Atomic reservation",
      "All-or-nothing. If a block was just taken, you're told to refresh — never half-reserved, never double-sold.",
    ],
    [
      "The credit gate",
      "Exposure across every open order, checked at the moment of sale. Soft — you can override, consciously.",
    ],
    [
      "The payment gate",
      "No confirmed payment, no processing, no dispatch. Paid amounts are computed from payments — never typed.",
    ],
    [
      "Store credit",
      "Returns and overpayments become a tracked balance that spends like cash and can never double-count.",
    ],
    [
      "One-tap GST invoice",
      "Correct CGST/SGST or IGST by place of supply, HSN 6802, the amount in words — in lakh and crore.",
    ],
    [
      "Gate pass on every load",
      "A printed pass with a tracking QR goes with the truck. Nothing leaves unrecorded.",
    ],
    [
      "Delivery closes the sale",
      "The driver's tap completes the order: stock sold, cost frozen at sale time, books consistent.",
    ],
    [
      "Returns with integrity",
      "Restock the good, write off the damaged — scrapped stone never silently re-enters the pool.",
    ],
    [
      "Receivables, worked",
      "Aging views and two-tap WhatsApp reminders — collection without the awkward phone call.",
    ],
  ],
  registerCaption: "Sales, payments, and GST capabilities",
  limit: {
    fact: "Payments are recorded, not collected.",
    reason:
      "ShilaTeq tracks the cash, UPI, and bank payments you receive — it doesn't process them, so there are no gateway fees and no cut of your money. Online UPI collection is on the roadmap.",
    roadmap: true,
  },
  demoHref: "/demo?step=5",
  demoMicroline: "step 5: try to move an unpaid order",
  waPrefix: "Mujhe billing, GST aur payments ke baare mein jaanna hai.",
  comparison: {
    label: "See how ShilaTeq works alongside Tally →",
    href: "/why/vs-tally-accounting",
  },
};

const PIPELINE_MINI = [
  ["Quoted", "no stock held"],
  ["Reserved", "atomic — yours alone"],
  ["⛩ Payment gate", "nothing moves unpaid"],
  ["Processing", "work begins"],
  ["Dispatched", "gate pass with the truck"],
  ["Delivered → SOLD", "one tap closes everything"],
] as const;

export default function SalesGstPage() {
  return (
    <PillarPage config={config}>
      {/* Mechanism: the disciplined pipeline */}
      <Reveal as="section" aria-labelledby="mech-pipe" className="reveal mt-16">
        <h2 id="mech-pipe" className="font-display text-heading-1 text-ink-900 font-medium">
          The mechanism: your rules, made unbreakable
        </h2>
        <div className="text-body text-ink-700 mt-6 max-w-2xl space-y-4">
          <p>
            Every order walks one disciplined line — and the software physically refuses the
            shortcuts that cost yards money. Not because it distrusts your team, but because on a
            busy Saturday, discipline shouldn&rsquo;t depend on memory.
          </p>
        </div>
        <ol className="mt-8 max-w-2xl" aria-label="The order pipeline">
          {PIPELINE_MINI.map(([stage, note], i) => (
            <li
              key={stage}
              className="border-line-100 flex items-baseline gap-4 border-b py-3.5 first:border-t"
            >
              <span className="text-label text-ink-500 w-8 shrink-0 font-mono">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className={stage.includes("gate") ? "text-ink-900 font-bold" : "text-ink-900"}>
                {stage}
              </span>
              <span className="text-label text-ink-500 ml-auto text-right font-mono">{note}</span>
            </li>
          ))}
        </ol>
        <div className="text-body text-ink-700 mt-8 max-w-2xl space-y-4">
          <p>
            Two rules do most of the protecting.{" "}
            <strong className="text-ink-900">Reservation is atomic:</strong> when two salesmen reach
            for the same block, exactly one succeeds and the other is told, cleanly, to refresh —
            the double-sell is structurally impossible.{" "}
            <strong className="text-ink-900">And money moves first:</strong> an order cannot advance
            past reserved until at least one confirmed payment exists. The paid amount is always the
            sum of real payments — no one can type a number into it.
          </p>
          <p>
            When the sale completes, the invoice is one tap: the correct CGST/SGST split for
            in-state sales or IGST across states, the HSN code for worked stone, and the total
            written out in words, in lakh and crore — a proper tax document, printed from any
            browser.
          </p>
        </div>
      </Reveal>

      {/* Proof exhibits (pending founder assets) */}
      <Reveal as="section" aria-labelledby="proof-h" className="reveal mt-16">
        <h2 id="proof-h" className="font-display text-heading-1 text-ink-900 font-medium">
          Seen in the product
        </h2>
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <ExhibitPending
            caption="EXHIBIT · the payment gate"
            will="an order at Reserved with the gate message — “record a confirmed payment first.”"
          />
          <ExhibitPending
            caption="EXHIBIT · a GST invoice"
            will="a generated invoice showing the CGST/SGST split, HSN 6802, and the amount in words."
          />
        </div>
      </Reveal>
    </PillarPage>
  );
}
