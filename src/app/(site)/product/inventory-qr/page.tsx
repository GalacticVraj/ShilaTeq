import type { Metadata } from "next";
import { PillarPage, type PillarConfig } from "@/components/product/PillarPage";
import { RecoveryCalculator } from "@/components/product/RecoveryCalculator";
import { ExhibitPending } from "@/components/ui/ExhibitPending";
import { Reveal } from "@/components/home/Reveal";
import { BlockFace, BlockQRLabel } from "@/components/home/FollowedBlock";

export const metadata: Metadata = {
  title: "Stone inventory with QR identity — find any block in seconds",
  description:
    "Every block gets a permanent QR identity: typo-tolerant search, camera scanning, aging alerts, cutting with recovery-adjusted cost, and per-block lifetime P&L.",
};

const config: PillarConfig = {
  slug: "inventory-qr",
  eyebrow: "The stone",
  h1: "“Where is that block?”",
  sting:
    "A buyer on the phone, a worker walking the rows, and a sale cooling by the minute. A yard holds thousands of near-identical blocks — and until each one has an identity, finding one is a search party.",
  objection: {
    q: "Who will tag my old stock?",
    a: "New stock tags itself — receiving a purchase order fans every line out into QR-coded, costed blocks in one tap. For the stone already in your yard, onboarding includes help tagging your first fifty blocks, and the 3-stage tagging wizard takes under a minute per block once your team finds its rhythm.",
  },
  register: [
    [
      "QR identity at intake",
      "Every block minted with a permanent code the moment it arrives — by PO receive or the tagging wizard.",
    ],
    [
      "Typo-tolerant search",
      "“Marbel” finds marble; block codes match exactly, so KSH-B0002 can never be mistaken for KSH-B0001.",
    ],
    [
      "Camera scanning",
      "Point any phone at a label to open the block's full record. A safe public card for anyone else who scans.",
    ],
    [
      "Aging watch",
      "Fresh → amber → red buckets (your thresholds; defaults 90/180 days) with carrying-cost estimates.",
    ],
    [
      "The partial-cut engine",
      "Consumed area in, slabs out: recovery %, wastage, and an instantly sellable remnant block.",
    ],
    [
      "Recovery-adjusted cost",
      "Wastage raises the surviving slabs' unit cost automatically. Unknown cost shows N/A — never a fake margin.",
    ],
    [
      "Immutable cut ledger",
      "Every cut writes a permanent record. Yield history can never be quietly rewritten.",
    ],
    [
      "Per-block lifetime P&L",
      "What each block cost, held, and earned — the trader's question, answered per stone.",
    ],
    [
      "Printable QR labels",
      "80×110 mm labels from any browser. The label on the stone is the system in the yard.",
    ],
    [
      "Clean exports",
      "Stock registers to CSV/Excel any time — hardened so ₹ and formulas survive the accountant's spreadsheet.",
    ],
  ],
  registerCaption: "Inventory and identity capabilities",
  limit: {
    fact: "Day-to-day tagging is an admin action today.",
    reason:
      "A Hindi worker-tagging mode exists in the product but its route is currently admin-only — workers' write paths are cutting, tasks, and deliveries.",
  },
  demoHref: "/demo?step=1",
  demoMicroline: "step 1: find a block with a typo",
  waPrefix: "Mujhe inventory aur QR tagging ke baare mein jaanna hai.",
  comparison: {
    label: "See the honest comparison with the paper register →",
    href: "/why/vs-paper",
  },
};

export default function InventoryQRPage() {
  return (
    <PillarPage config={config}>
      {/* Mechanism 1: the identity */}
      <Reveal as="section" aria-labelledby="mech-id" className="reveal mt-16">
        <h2 id="mech-id" className="font-display text-heading-1 text-ink-900 font-medium">
          The mechanism: an identity on every stone
        </h2>
        <div className="mt-8 grid items-start gap-10 lg:grid-cols-[9fr_10fr]">
          <div aria-hidden="true">
            <BlockFace className="aspect-[4/3] w-full max-w-md">
              <div className="absolute bottom-4 left-4">
                <BlockQRLabel />
              </div>
            </BlockFace>
          </div>
          <div className="text-body text-ink-700 max-w-xl space-y-4">
            <p>
              The moment a block enters your yard — received against a purchase order, or tagged at
              the gate — it is minted with a QR code. That code is its identity for life: what it
              is, what it cost, how old it is, where it sits, and everything that ever happens to
              it.
            </p>
            <p>
              From then on, nobody walks the rows hoping. Type three letters — even misspelled — and
              the block surfaces. Point a camera at the label and its whole record opens. The chalk
              mark and the memory are retired with honor.
            </p>
          </div>
        </div>
      </Reveal>

      {/* Mechanism 2: the cutting math — the teachable moment */}
      <Reveal as="section" aria-labelledby="mech-cut" className="reveal mt-16">
        <h2 id="mech-cut" className="font-display text-heading-1 text-ink-900 font-medium">
          The math most yards never see
        </h2>
        <div className="text-body text-ink-700 mt-6 max-w-2xl space-y-4">
          <p>
            Cutting is where yards silently leak money. A block goes into the gangsaw; slabs come
            out; and the material lost between the two never enters anyone&rsquo;s price. ShilaTeq
            computes it on every cut:
          </p>
          <p className="rounded-paper border-line-100 bg-paper-1 text-data text-ink-900 border p-4 font-mono">
            recovery % = slab area out ÷ block area consumed
            <br />
            wastage = consumed − out
            <br />
            true slab cost/sqft = block cost ÷ slab area out
          </p>
          <p>
            The wastage prices itself into the surviving slabs — so your margin is real, not a guess
            wearing a number. And whatever stone remains becomes a new, instantly sellable remnant
            block. Nothing is lost; nothing is fictional.
          </p>
        </div>
        <div className="mt-8 max-w-2xl">
          <RecoveryCalculator />
        </div>
      </Reveal>

      {/* Proof exhibits (pending founder assets — honest frames, never fakes) */}
      <Reveal as="section" aria-labelledby="proof-h" className="reveal mt-16">
        <h2 id="proof-h" className="font-display text-heading-1 text-ink-900 font-medium">
          Seen in the product
        </h2>
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <ExhibitPending
            caption="EXHIBIT · find-with-a-typo"
            will="the Find screen locating “makrana whi…” with the spelling slip, block statuses visible."
          />
          <ExhibitPending
            caption="EXHIBIT · block detail with carrying cost"
            will="one block's full record — dimensions, grade, age band, and its carrying-cost line."
          />
        </div>
      </Reveal>
    </PillarPage>
  );
}
