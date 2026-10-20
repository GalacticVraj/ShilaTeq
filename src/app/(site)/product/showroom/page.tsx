import type { Metadata } from "next";
import { PillarPage, type PillarConfig } from "@/components/product/PillarPage";
import { ExhibitPending } from "@/components/ui/ExhibitPending";
import { Reveal } from "@/components/home/Reveal";
import { Button } from "@/components/ui/Button";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Your yard's own 3D showroom — with leads to WhatsApp",
  description:
    "A public catalog at your own link: available stone in 3D, prices shown or “On request” block by block, and every enquiry landing in your leads inbox for a one-tap WhatsApp reply.",
};

const config: PillarConfig = {
  slug: "showroom",
  eyebrow: "The customer",
  h1: "Buyers can't see your stone.",
  sting:
    "Your best blocks sit in row six while buyers scroll past on their phones. The yards that win tomorrow's enquiries are the ones a buyer can browse tonight — without calling, without visiting, without knowing your name yet.",
  objection: {
    q: "Who sees my prices?",
    a: "Exactly who you choose. Every block is opted into the showroom individually, and its price is a separate choice — show a number, or show “On request”. The gating happens at the data layer, not just on screen: costs, suppliers, margins, and un-opted stock are never sent to the public at all. Competitors see a catalog; your commercial secrets stay in the office.",
  },
  register: [
    [
      "A showroom at your link",
      "A per-yard public catalog — share it on WhatsApp, print its QR on your invoices, put it everywhere.",
    ],
    [
      "3D that never breaks",
      "An interactive stone hero with a graceful fallback, so the page works on every phone.",
    ],
    [
      "Available stock only",
      "Sold, reserved, and damaged stone never appear. The catalog is always honestly current.",
    ],
    [
      "Price gating, per block",
      "A price or “On request” — your call, block by block, enforced server-side.",
    ],
    [
      "Quote requests → leads",
      "A buyer asks about a stone; the enquiry lands in your inbox with the block attached.",
    ],
    [
      "One-tap WhatsApp reply",
      "A pre-written response opens in WhatsApp — and the lead advances to Contacted automatically.",
    ],
    [
      "Every paper markets you",
      "Invoices and quotes carry your catalog QR; customer messages carry your showroom link.",
    ],
    [
      "Findable, literally",
      "Your yard's location on the map, on the page — buyers can trust it and drive to it.",
    ],
    [
      "Public tracking links",
      "Customers follow their delivery on a safe link — status only, never prices.",
    ],
    [
      "Safe by construction",
      "Public pages read a narrow, safe slice of data. There is no path from the catalog to your books.",
    ],
  ],
  registerCaption: "Showroom and lead capabilities",
  limit: {
    fact: "No buyer accounts or saved favourites yet.",
    reason:
      "Today the showroom is browse-and-enquire — buyers don't create logins. Accounts, favourites, and richer catalog browsing are on the roadmap.",
    roadmap: true,
  },
  demoHref: "/demo?step=6",
  demoMicroline: "step 6: the showroom reveal",
  waPrefix: "Mujhe apne yard ke online showroom ke baare mein jaanna hai.",
  comparison: {
    label: "See how this beats Excel sheets and WhatsApp threads →",
    href: "/why/vs-excel-whatsapp",
  },
};

const LEAD_LOOP = [
  ["A buyer browses", "your catalog link — from an invoice QR, a shared message, or a search."],
  ["They ask about a stone", "name, phone, and the block they want — one short form, no account."],
  ["It lands in your inbox", "as a new lead, with the exact block attached."],
  [
    "You reply on WhatsApp",
    "one tap opens a pre-written response; the lead marks itself Contacted.",
  ],
  ["The quote follows", "and the conversation is already warm."],
] as const;

export default function ShowroomPage() {
  return (
    <PillarPage config={config}>
      {/* Mechanism: the demand loop */}
      <Reveal as="section" aria-labelledby="mech-loop" className="reveal mt-16">
        <h2 id="mech-loop" className="font-display text-heading-1 text-ink-900 font-medium">
          The mechanism: paperwork that markets you
        </h2>
        <div className="text-body text-ink-700 mt-6 max-w-2xl space-y-4">
          <p>
            The showroom isn&rsquo;t a website you have to feed. It draws from your live inventory —
            only what&rsquo;s available, only what you opted in — and every document you already
            print carries its QR. Your invoices become your marketing. Then the loop closes itself:
          </p>
        </div>
        <ol className="mt-8 max-w-2xl" aria-label="From browse to lead">
          {LEAD_LOOP.map(([step, line], i) => (
            <li
              key={step}
              className="border-line-100 flex items-baseline gap-4 border-b py-3.5 first:border-t"
            >
              <span className="text-label text-ink-500 w-8 shrink-0 font-mono">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>
                <span className="text-ink-900 font-bold">{step}</span>{" "}
                <span className="text-ink-700">{line}</span>
              </span>
            </li>
          ))}
        </ol>
        {site.showroomUrl ? (
          <div className="mt-8">
            <Button href={site.showroomUrl} external>
              Open a live showroom ↗
            </Button>
          </div>
        ) : null}
      </Reveal>

      {/* Proof exhibits (pending founder assets) */}
      <Reveal as="section" aria-labelledby="proof-h" className="reveal mt-16">
        <h2 id="proof-h" className="font-display text-heading-1 text-ink-900 font-medium">
          Seen in the product
        </h2>
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <ExhibitPending
            caption="EXHIBIT · a real yard's catalog"
            will="a live showroom page — the 3D stone hero and the available-stock showcase."
          />
          <ExhibitPending
            caption="EXHIBIT · “On request”"
            will="a public block card with its price gated, beside the same block's full record in the admin app."
          />
        </div>
      </Reveal>
    </PillarPage>
  );
}
