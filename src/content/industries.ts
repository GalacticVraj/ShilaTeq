/**
 * Industry pages content model (phase-4/04 §5): thin-but-true, material-true
 * statements only — same product, no invented "editions", no fake industry
 * statistics. If a claim isn't material-differentiated, it doesn't go here.
 */

export type Industry = {
  slug: string;
  name: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  /** Two recognition paragraphs max (blueprint law). */
  recognition: [string, string];
  /** Material-specific pains — 3, honest. */
  pains: Array<[string, string]>;
  /** The 3 features that matter most for this material, each with its pillar. */
  features: Array<{ title: string; line: string; href: string; pillar: string }>;
  /** The most relevant comparison for this audience. */
  comparison: { label: string; href: string };
  /** One honest limitation relevant here. */
  limit: { fact: string; reason: string; roadmap?: boolean };
  waPrefix: string;
};

export const industries: Industry[] = [
  {
    slug: "marble",
    name: "Marble",
    metaTitle: "Software for marble yards & traders",
    metaDescription:
      "For marble yards where variety and grade decide the price: QR identity per block, aging watch on premium stock, honest per-block P&L, and a showroom buyers can browse.",
    h1: "In marble, the variety is the price.",
    recognition: [
      "A marble yard's wealth is written in names — the variety and the grade decide whether a block is worth thousands or lakhs, and two stones that look alike to an outsider can differ by a family's monthly income. Everything depends on knowing exactly which block is which.",
      "That's an identity problem before it's anything else — and identity is the first thing ShilaTeq gives every block.",
    ],
    pains: [
      [
        "The look-alike problem",
        "Dozens of near-identical white blocks; the premium one and the ordinary one, told apart by memory.",
      ],
      [
        "Premium stock, aging quietly",
        "High-value marble ties up serious capital — and nothing announces when it's been sitting half a year.",
      ],
      [
        "Buyers who buy on sight",
        "Marble sells to the eye. If buyers can't see your stock, they're seeing someone else's.",
      ],
    ],
    features: [
      {
        title: "QR identity with grade and variety",
        line: "Every block carries its variety, grade, dimensions, and origin — scan the label, end the guessing.",
        href: "/product/inventory-qr",
        pillar: "The stone",
      },
      {
        title: "Aging watch on premium capital",
        line: "Fresh → amber → red buckets with carrying-cost estimates — dead capital surfaces before it silently drains.",
        href: "/product/inventory-qr",
        pillar: "The stone",
      },
      {
        title: "The 3D showroom",
        line: "Your available marble, browsable at your own link — prices shown or “On request”, block by block.",
        href: "/product/showroom",
        pillar: "The customer",
      },
    ],
    comparison: { label: "vs the paper register", href: "/why/vs-paper" },
    limit: {
      fact: "Showroom imagery is generated stone art, not photos of your slabs.",
      reason:
        "Blocks you photograph show your photos; the catalog's ambient stone visuals are procedurally drawn — honest to the variety's character, never passed off as a specific stone.",
    },
    waPrefix: "Mera marble ka kaam hai; ShilaTeq ke baare mein jaanna hai.",
  },
  {
    slug: "granite",
    name: "Granite",
    metaTitle: "Granite business & inventory software",
    metaDescription:
      "For granite processors where the gangsaw decides the margin: recovery % on every cut, wastage priced into slab cost, remnants recovered, and per-block lifetime P&L.",
    h1: "In granite, the gangsaw decides the margin.",
    recognition: [
      "Granite is a processor's trade: the money is made — or lost — between the block that goes into the gangsaw and the slabs that come out. Yield is everything, and in most yards, yield is the one number nobody actually knows.",
      "ShilaTeq computes it on every single cut, and prices the wastage into the surviving slabs — so a granite margin finally means what it says.",
    ],
    pains: [
      [
        "The invisible yield",
        "Recovery percentage — the trade's most important number — usually lives nowhere at all.",
      ],
      [
        "Wastage that never enters the price",
        "Slabs priced off nominal block cost sell below true cost, quietly, forever.",
      ],
      [
        "Offcuts lost to memory",
        "The usable remainder of a part-cut block has value — if anyone remembers it exists.",
      ],
    ],
    features: [
      {
        title: "Recovery % on every cut",
        line: "Consumed area in, slab area out — the yield computed and permanently recorded, cut after cut.",
        href: "/product/inventory-qr",
        pillar: "The stone",
      },
      {
        title: "Wastage priced into slabs",
        line: "True slab cost per sqft, automatically — so quoting below cost stops being possible by accident.",
        href: "/product/sales-gst",
        pillar: "The money",
      },
      {
        title: "The cutter's own app",
        line: "The gangsaw operator logs the cut himself — in Hindi, offline in the shed, prices hidden.",
        href: "/product/worker-app",
        pillar: "The people",
      },
    ],
    comparison: { label: "vs generic ERP", href: "/why/vs-erp" },
    limit: {
      fact: "Machine-level analytics aren't here yet.",
      reason:
        "Recovery is tracked per cut and per block; per-machine and per-operator breakdowns are on the roadmap.",
      roadmap: true,
    },
    waPrefix: "Mera granite processing ka kaam hai; ShilaTeq ke baare mein jaanna hai.",
  },
  {
    slug: "sandstone",
    name: "Sandstone",
    metaTitle: "Software for sandstone yards & traders",
    metaDescription:
      "For sandstone yards moving volume on thin margins: instant stock answers, credit control across many buyers, gate passes on every load, and one-tap GST paperwork.",
    h1: "In sandstone, volume hides the leaks.",
    recognition: [
      "Sandstone moves in volume — more loads, more buyers, more credit extended across more names than most trades juggle. When the margin per load is thin, the business is won on control: knowing what left, who owes, and what the paperwork says.",
      "ShilaTeq puts a gate pass on every load and a running exposure on every buyer — control that scales with the trucks.",
    ],
    pains: [
      [
        "Loads outrunning paperwork",
        "On a busy day the trucks move faster than the records — and gaps in the record are losses.",
      ],
      [
        "Credit across many names",
        "Thin-margin volume means credit everywhere; total exposure per buyer lives in nobody's head reliably.",
      ],
      [
        "GST at dispatch pace",
        "Compliant invoices and gate passes, needed at the speed the vehicles leave.",
      ],
    ],
    features: [
      {
        title: "Gate pass on every load",
        line: "A printed pass with a tracking QR goes with each truck — nothing leaves unrecorded.",
        href: "/product/sales-gst",
        pillar: "The money",
      },
      {
        title: "Credit exposure, live",
        line: "Every buyer's outstanding across every open order, checked at the moment of the next sale.",
        href: "/product/sales-gst",
        pillar: "The money",
      },
      {
        title: "Drivers who close their own runs",
        line: "Forward-only delivery updates from the road — one tap completes the order and the books.",
        href: "/product/worker-app",
        pillar: "The people",
      },
    ],
    comparison: { label: "vs Excel & WhatsApp", href: "/why/vs-excel-whatsapp" },
    limit: {
      fact: "No transporter or e-way-bill API integration yet.",
      reason:
        "E-way numbers are entered on the dispatch; the gate pass and public tracking link cover the load. Portal integrations are on the roadmap.",
      roadmap: true,
    },
    waPrefix: "Mera sandstone ka kaam hai; ShilaTeq ke baare mein jaanna hai.",
  },
  {
    slug: "limestone",
    name: "Limestone",
    metaTitle: "Software for limestone yards & traders",
    metaDescription:
      "For limestone yards where dimensional stock and steady buyers rule: clean stock answers by size, receivables worked over WhatsApp, and honest margins per block.",
    h1: "In limestone, the size is the sale.",
    recognition: [
      "Limestone trades on dimensions — the buyer asks by size and finish, and the yard that answers fastest usually wins the order. Steady buyers, repeat orders, running accounts: it's a relationship trade with a paperwork problem.",
      "ShilaTeq answers the size question in seconds and keeps every running account honest to the rupee.",
    ],
    pains: [
      [
        "The size question",
        "“What do you have in 2×2, honed?” — answered today by walking the yard or guessing.",
      ],
      [
        "Running accounts drifting",
        "Repeat buyers on standing credit; who owes what, exactly, drifts between memory and pages.",
      ],
      [
        "Repeat orders, retyped",
        "The same buyer, the same stone, the paperwork rebuilt from scratch each time.",
      ],
    ],
    features: [
      {
        title: "Search by what buyers ask",
        line: "Type, size, finish, grade — filtered answers in seconds, from the office or the yard.",
        href: "/product/inventory-qr",
        pillar: "The stone",
      },
      {
        title: "Receivables, worked",
        line: "Aging views per buyer and two-tap WhatsApp reminders — collection without the awkward call.",
        href: "/product/sales-gst",
        pillar: "The money",
      },
      {
        title: "Customer history in one place",
        line: "Every buyer's orders, payments, credit, and store-credit balance — the relationship, on the record.",
        href: "/product/sales-gst",
        pillar: "The money",
      },
    ],
    comparison: { label: "vs the paper register", href: "/why/vs-paper" },
    limit: {
      fact: "No standing-order automation yet.",
      reason:
        "Repeat orders are quick to raise but still raised each time; recurring-order templates are a roadmap idea.",
      roadmap: true,
    },
    waPrefix: "Mera limestone ka kaam hai; ShilaTeq ke baare mein jaanna hai.",
  },
];

export function getIndustry(slug: string): Industry | undefined {
  return industries.find((i) => i.slug === slug);
}
