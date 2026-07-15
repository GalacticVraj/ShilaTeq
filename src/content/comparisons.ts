/**
 * The comparison engine's content model (Milestone-3 directive): one typed
 * object per incumbent; the ComparisonPage template renders all of them.
 * Adding a future comparison (Odoo, Busy, Marg…) = adding one entry here —
 * AFTER the competitor-research gate for named vendors (Phase-2 10 §5).
 *
 * Content law: respect-first, concessions styled equal, no attacks, no
 * invented numbers, honest trade-offs (phase-4/14; Phase-2 10 doctrine).
 */

export type Comparison = {
  slug: string;
  incumbent: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  h1: string;
  /** Respect-first opener: what the incumbent genuinely does well. */
  respect: string[];
  /** The workflow today — how the yard actually runs on the incumbent. */
  workflow: Array<[string, string]>;
  /** The hidden costs — named, specific, never hysterical. */
  hiddenCosts: Array<[string, string]>;
  /** THE CONCESSION BLOCK — where the incumbent honestly wins today. */
  wins: { title: string; items: string[] };
  /** Where it breaks — the structural gaps. */
  breaks: Array<[string, string]>;
  /** The same yard on ShilaTeq — how the workflow changes. */
  change: Array<[string, string]>;
  /** Honest trade-offs of switching — stated plainly. */
  tradeoffs: Array<{ fact: string; reason: string; roadmap?: boolean }>;
  /** The bridge line — set alone, display type. */
  bridge: string;
  faq: Array<{ q: string; a: string }>;
  related: {
    pillar: { label: string; href: string };
    guides: Array<{ label: string; href: string }>;
  };
  demoHref: string;
  demoMicroline: string;
  waPrefix: string;
  /** Optional extra affordance (e.g. the accountant-share on vs-tally). */
  accountantShare?: boolean;
};

export const comparisons: Comparison[] = [
  // ─────────────────────────────────────────── vs PAPER
  {
    slug: "vs-paper",
    incumbent: "the paper register",
    metaTitle: "Your stock register, given eyes — ShilaTeq vs the paper register",
    metaDescription:
      "The register is free, familiar, and disciplined — and blind. An honest comparison: where paper wins, where it breaks, and what changes when every block gets a QR identity.",
    eyebrow: "vs the paper register",
    h1: "The register built your business. It just can't see.",
    respect: [
      "Let's say it plainly: the paper register is a serious system. It's free, it never crashes, it works in any weather, and yours carries decades of discipline — entries made every single day, in the same careful hand. Businesses worth crores run on it, including, perhaps, yours.",
      "We're not here to mock it. We're here to show you what it can't do — and what happens when you keep its discipline and add sight.",
    ],
    workflow: [
      [
        "Stock arrives",
        "A line in the register; a chalk mark on the stone; the rest lives in memory.",
      ],
      [
        "A buyer asks",
        "Someone walks the rows. The register knows what came in — not where it is or what state it's in.",
      ],
      [
        "A block is cut",
        "The slabs get counted; the wastage between block-in and slabs-out is never written anywhere.",
      ],
      [
        "Credit is given",
        "A name and a number on a page. Total exposure across pages: whoever can hold it in their head.",
      ],
      [
        "Month-end",
        "GST math by hand, margins by feel, and the honest answer to 'did we make money?' is 'probably.'",
      ],
    ],
    hiddenCosts: [
      [
        "The unfound block",
        "Hours of searching, and sometimes the sale itself, while a buyer waits.",
      ],
      [
        "The invisible wastage",
        "Cutting loss never enters the price — so some slabs sell below their true cost.",
      ],
      ["The aging stock", "Nothing in a register turns amber at 90 days. Dead capital just sits."],
      ["The double promise", "Two salesmen, one register, no locking — the same block sold twice."],
      [
        "The single copy",
        "One book, one fire, one flood — and the history of the business is gone.",
      ],
    ],
    wins: {
      title: "Where paper honestly wins",
      items: [
        "Zero cost, zero vendor, zero trust required in anyone.",
        "Works with no battery, no signal, no learning curve.",
        "It never asks you to change a habit — ShilaTeq will ask for a few.",
      ],
    },
    breaks: [
      [
        "No index",
        "A register records arrival; it can't answer 'where is that white Grade-A block right now?'",
      ],
      [
        "No reconciliation",
        "Block in, slabs out — the register can't check one against the other.",
      ],
      [
        "No shared truth",
        "Two people can't consult one book at once; the yard and the office see different worlds.",
      ],
      [
        "No memory of memory",
        "When the person who knows the yard retires, the index of the business retires with him.",
      ],
    ],
    change: [
      [
        "Stock arrives",
        "Receive the PO — every line becomes a QR-tagged, costed block. The register entry writes itself.",
      ],
      [
        "A buyer asks",
        "Type three letters, even misspelled — or scan the label. Found in seconds, from any phone.",
      ],
      [
        "A block is cut",
        "Recovery and wastage computed on every cut; the leftover becomes a sellable remnant block.",
      ],
      [
        "Credit is given",
        "Exposure across every open order, visible at the moment of sale — with your override, consciously.",
      ],
      [
        "Month-end",
        "One-tap GST invoices all month; margins computed from true, wastage-adjusted cost.",
      ],
    ],
    tradeoffs: [
      {
        fact: "Your existing stock needs tagging once.",
        reason:
          "New stock tags itself via purchase orders; the stone already in the yard is a one-time effort — onboarding includes help with the first fifty blocks.",
      },
      {
        fact: "It's a subscription, and the register was free.",
        reason:
          "The honest counterweight: no hardware, no per-message fees, no gateway cut — and pricing is a straight answer on WhatsApp, not a negotiation.",
      },
      {
        fact: "The office side needs internet.",
        reason:
          "Workers' shop-floor actions work offline; admin screens need a connection to load.",
      },
    ],
    bridge: "Keep the discipline of your register. Give it eyes.",
    faq: [
      {
        q: "Can I keep writing the register alongside?",
        a: "Yes. Many yards run both for a season. Most stop updating the book the week they realise the phone answers faster — but that's your call to make, not ours.",
      },
      {
        q: "What if my supervisor can't type well?",
        a: "Search is typo-tolerant — 'marbel' finds marble. Codes are matched exactly, so a slip can never open the wrong block. And the camera does most of the finding: point it at a label.",
      },
      {
        q: "Is my data safer than a book?",
        a: "It lives in a managed cloud, isolated per yard at the database level, and exports to Excel any time. There is no single copy to lose — and no way for another yard to read yours.",
      },
    ],
    related: {
      pillar: { label: "Inventory & QR identity", href: "/product/inventory-qr" },
      guides: [
        {
          label: "The Dead Capital Guide — how aging stock eats cash",
          href: "/guides/dead-capital",
        },
        { label: "The Double-Sell Problem", href: "/guides/double-sell" },
      ],
    },
    demoHref: "/demo?step=1",
    demoMicroline: "find a block in seconds — with a typo",
    waPrefix: "Main abhi register par kaam karta/karti hoon; ShilaTeq ke baare mein jaanna hai.",
  },

  // ─────────────────────────────────────────── vs EXCEL + WHATSAPP
  {
    slug: "vs-excel-whatsapp",
    incumbent: "Excel sheets and WhatsApp threads",
    metaTitle: "From Excel sheets and WhatsApp threads to one system — ShilaTeq",
    metaDescription:
      "The sheet was your first system — and it was clever. An honest look at where spreadsheets and WhatsApp threads break under a stone yard, and what one connected system changes.",
    eyebrow: "vs Excel & WhatsApp",
    h1: "You already built a system. It just has no rules.",
    respect: [
      "If your yard runs on a spreadsheet, someone smart built it — usually a son, a daughter, or a sharp supervisor who saw the register's limits and did something about it. That instinct was right. And WhatsApp already holds your photos, your negotiations, your relationships — we like WhatsApp so much we built on it.",
      "The problem isn't the sheet. It's that a sheet has no rules — and a stone yard needs rules.",
    ],
    workflow: [
      [
        "Stock lives in a sheet",
        "Rows added by hand, updated when someone remembers, on whoever's laptop has the latest copy.",
      ],
      [
        "Sales live in chats",
        "Photos, prices, and promises scattered across threads — the order book is a scroll-back.",
      ],
      [
        "Two people, two truths",
        "The sheet on the desktop and the sheet on the phone quietly disagree.",
      ],
      [
        "A cut happens",
        "Someone edits three cells — or forgets to. The sheet doesn't know blocks become slabs.",
      ],
      [
        "A block sells",
        "Nothing stops it appearing in another quote tomorrow. Cells don't reserve stone.",
      ],
    ],
    hiddenCosts: [
      [
        "The formula typo",
        "One mis-dragged cell and a price is wrong for a month — a mistake that compounds silently.",
      ],
      [
        "The version problem",
        "'Final_v3_REAL.xlsx' — and nobody is sure which numbers were true on Tuesday.",
      ],
      [
        "The scroll-back order book",
        "The only record of a ₹2-lakh order is somewhere above 400 messages.",
      ],
      ["The double-sell", "Sheets don't lock. Two salesmen, one block, two promises."],
      ["The dependence", "The whole system lives in one person's head and one person's laptop."],
    ],
    wins: {
      title: "Where Excel and WhatsApp honestly win",
      items: [
        "Infinitely flexible — a sheet becomes anything, instantly, with no vendor to ask.",
        "Free-ish, familiar, and psychologically yours.",
        "WhatsApp genuinely is the right channel for this trade — which is why ShilaTeq sends quotes, invoices, and reminders through it rather than replacing it.",
      ],
    },
    breaks: [
      ["No identity", "A row isn't a block. Nothing connects the cell to the stone in row six."],
      [
        "No rules",
        "Nothing enforces 'money before dispatch' or 'one block, one buyer.' Discipline is manual.",
      ],
      [
        "No cascades",
        "A delivery doesn't close an order; a cut doesn't update stock. Someone must remember to tell the sheet.",
      ],
      ["No floor access", "The cutter in the shed can't and won't edit a spreadsheet."],
    ],
    change: [
      [
        "Stock lives in the system",
        "Every block QR-tagged and costed at intake — one truth, live on every phone at once.",
      ],
      [
        "Sales live in a pipeline",
        "Quotes hold no stock; orders reserve atomically; the same block can never be promised twice.",
      ],
      [
        "Rules enforce themselves",
        "No confirmed payment, nothing moves. Paid amounts computed, never typed.",
      ],
      [
        "Cuts update everything",
        "Recovery, wastage, remnant, slab costs — automatic, on every cut.",
      ],
      [
        "WhatsApp stays",
        "Quotes, invoices, dispatch tracking, and reminders go out as pre-written WhatsApp messages — the channel you love, with a system behind it.",
      ],
    ],
    tradeoffs: [
      {
        fact: "You give up the sheet's infinite flexibility.",
        reason:
          "ShilaTeq is opinionated where the trade needs discipline. Everything still exports to Excel whenever you want to slice numbers your own way.",
      },
      {
        fact: "The sheet's author needs a new role.",
        reason:
          "Whoever built your spreadsheet becomes the person who runs ShilaTeq best — the instinct that built the sheet is exactly what the system rewards.",
      },
    ],
    bridge: "The system you built in Excel — with rules, so it can't lie to you.",
    faq: [
      {
        q: "Can I get my data out to Excel?",
        a: "Always. Stock, orders, reports — everything exports to Excel and CSV, hardened so ₹ symbols and formulas survive. Nothing is trapped; leaving is easy, which is why staying has to be earned.",
      },
      {
        q: "Do I stop using WhatsApp?",
        a: "No — you use it better. ShilaTeq composes the quote, the invoice message, the dispatch-tracking link, and the payment reminder; you tap send. The conversation stays in WhatsApp, where your customers already are.",
      },
      {
        q: "What happens to my existing sheet data?",
        a: "Your stock gets tagged into the system (new arrivals tag themselves via purchase orders; onboarding includes help with the first fifty blocks). The sheet retires with honour as a backup.",
      },
    ],
    related: {
      pillar: { label: "Showroom & leads", href: "/product/showroom" },
      guides: [
        { label: "The Double-Sell Problem", href: "/guides/double-sell" },
        { label: "Taking Your Yard Online Safely", href: "/guides/going-online" },
      ],
    },
    demoHref: "/demo?step=5",
    demoMicroline: "watch an order refuse to double-sell",
    waPrefix: "Hum abhi Excel/WhatsApp par kaam karte hain; ShilaTeq ke baare mein jaanna hai.",
  },

  // ─────────────────────────────────────────── vs TALLY / ACCOUNTING
  {
    slug: "vs-tally-accounting",
    incumbent: "accounting software",
    metaTitle: "ShilaTeq and Tally — the yard and the books",
    metaDescription:
      "Not a Tally alternative: an honest explanation of why accounting software can't run a stone yard, how ShilaTeq works upstream of the books, and what your accountant gets from day one.",
    eyebrow: "vs accounting software",
    h1: "Tally keeps your books. Nothing is keeping your yard.",
    respect: [
      "Your accountant is right to insist on proper books. Accounting software like Tally is the money's system of record — statutory accounts, filing, decades of earned trust. We are not here to replace it, and we never will be.",
      "But notice what the books can't see: the books meet your business only after everything has already happened. The block that couldn't be found, the wastage that never entered a price, the same stone promised twice — by the time the numbers reach the books, the money is already made or already lost.",
    ],
    workflow: [
      [
        "The yard runs on paper or sheets",
        "Stock, cutting, credit, and dispatch live outside the accounting package entirely.",
      ],
      [
        "Vouchers are entered after the fact",
        "Someone types what already happened — days later, from slips and memory.",
      ],
      [
        "The accountant reconciles",
        "Month-end is archaeology: matching entries to events nobody fully recorded.",
      ],
      [
        "Margins are computed backwards",
        "From invoices — with no knowledge of cutting wastage or true block cost.",
      ],
    ],
    hiddenCosts: [
      [
        "Double entry, literally",
        "Everything happens once in the yard and again at the keyboard — twice the work, plus the gap between them.",
      ],
      [
        "Margins without wastage",
        "The books divide revenue by recorded cost — but cutting loss never made it into recorded cost.",
      ],
      [
        "Compliance under deadline",
        "Invoices assembled at filing time instead of generated correctly at sale time.",
      ],
    ],
    wins: {
      title: "Where accounting software honestly wins",
      items: [
        "Statutory books, filing workflows, and the accountant's fluency — keep all of it.",
        "Decades of reliability and an ecosystem every CA knows.",
        "If your only problem were bookkeeping, you wouldn't need us at all.",
      ],
    },
    breaks: [
      [
        "It doesn't know a block exists",
        "No stone, no cutting, no yield, no aging, no reservations — the physical business is invisible.",
      ],
      [
        "It can't enforce yard rules",
        "'No dispatch unpaid' and 'one block, one buyer' aren't accounting concepts.",
      ],
      ["It can't run the floor", "No cutter logs a gangsaw run into a voucher entry."],
    ],
    change: [
      [
        "The yard runs on ShilaTeq",
        "Stone, cutting, credit, dispatch — recorded as they happen, by the people doing them.",
      ],
      [
        "Documents are born correct",
        "GST invoices generated at sale time: CGST/SGST or IGST by place of supply, HSN 6802, amount in words.",
      ],
      [
        "The accountant receives truth",
        "Clean, export-ready numbers — invoices and Excel/CSV files that reconcile because they were never guessed.",
      ],
      [
        "The books stay the books",
        "Tally keeps doing what Tally does — now fed by a yard that actually knows itself.",
      ],
    ],
    tradeoffs: [
      {
        fact: "There's no direct Tally sync today.",
        reason:
          "Your accountant works from ShilaTeq's GST invoices and Excel/CSV exports — clean, but still an import step. A direct connector is on the roadmap.",
        roadmap: true,
      },
      {
        fact: "No government e-invoice (IRN) or e-way-bill API yet.",
        reason:
          "Invoices are compliant documents; e-way numbers are entered manually. Portal integrations are on the roadmap for larger yards.",
        roadmap: true,
      },
    ],
    bridge:
      "Tally keeps your books. ShilaTeq runs your yard. Your accountant gets cleaner numbers from day one.",
    faq: [
      {
        q: "Is ShilaTeq a Tally alternative?",
        a: "No — the question itself is the category error. Accounting software records money after the fact; ShilaTeq runs the physical business upstream of the books: the stone, the cutting, the credit, the dispatch. They meet at the export.",
      },
      {
        q: "What exactly does my accountant get?",
        a: "GST-compliant invoices (correct CGST/SGST/IGST split, HSN 6802, amount in words), plus Excel and CSV exports of stock, orders, payments, and reports — hardened so ₹ and formulas survive the spreadsheet.",
      },
      {
        q: "Will there ever be a direct connection?",
        a: "A Tally connector is on the roadmap — one of the first integrations we intend to ship, precisely because your accountant's vote matters. We don't announce dates we can't keep.",
      },
    ],
    related: {
      pillar: { label: "Sales, payments & GST", href: "/product/sales-gst" },
      guides: [
        { label: "GST on stone: HSN 6802, rates, invoices", href: "/guides/gst-stone" },
        { label: "The Credit Control Guide", href: "/guides/credit-control" },
      ],
    },
    demoHref: "/demo?step=5",
    demoMicroline: "see an invoice born correct",
    waPrefix: "Hum Tally use karte hain; ShilaTeq iske saath kaise chalega, jaanna hai.",
    accountantShare: true,
  },

  // ─────────────────────────────────────────── vs GENERIC ERP
  {
    slug: "vs-erp",
    incumbent: "a generic ERP",
    metaTitle: "Why generic ERPs struggle with stone — and what fits instead",
    metaDescription:
      "ERPs are serious software built for factories of identical things. An honest comparison for stone yards: where ERPs still win, where they break on stone, and what a stone-native system changes.",
    eyebrow: "vs generic ERP",
    h1: "ERPs are built for identical widgets. Your blocks are one of a kind.",
    respect: [
      "Generic ERPs are serious software — powerful, proven, and right for factories that make ten thousand identical things a day. If you run one well, you have our respect: it isn't easy.",
      "The trouble starts with a single assumption buried in every generic ERP: that a product is a SKU — one of many identical units. A stone block is the opposite of that. It is singular, irregular, divisible, and aging — and no amount of configuration makes a SKU behave like a stone.",
    ],
    workflow: [
      [
        "The consultants arrive",
        "Months of workshops to explain what a gangsaw is and why blocks become slabs plus a remnant.",
      ],
      [
        "The customization begins",
        "Custom fields, custom screens, custom reports — the project costs more than the software.",
      ],
      [
        "The office adapts",
        "Somebody learns it. Usually one person. The system's truth lives in their patience.",
      ],
      [
        "The floor never does",
        "English screens, dense forms, desktop assumptions — the cutter goes back to chalk.",
      ],
      [
        "The register returns",
        "The yard quietly runs on paper again, and the ERP records a delayed echo of it.",
      ],
    ],
    hiddenCosts: [
      [
        "The implementation bill",
        "Licence, consultants, customization, training — and then the annual maintenance of all four.",
      ],
      [
        "The abandonment risk",
        "The most expensive software is the kind that's paid for and unused.",
      ],
      [
        "The modelling gap",
        "If the system can't represent a remnant block or recovery %, those numbers simply don't exist.",
      ],
    ],
    wins: {
      title: "Where a generic ERP honestly wins — today",
      items: [
        "Multi-branch consolidation: a group view across locations. ShilaTeq runs one yard per account today; rollups are on the roadmap.",
        "Granular roles and approval chains for large organisations — ours are deliberately simple (admin, worker).",
        "Integration ecosystems: banking, e-invoicing/IRN, e-way APIs — items still on our roadmap.",
        "The comfort of a big vendor behind a big cheque.",
      ],
    },
    breaks: [
      [
        "Stone isn't a SKU",
        "Block → slabs + remnant, recovery-adjusted cost, aging stone — foreign concepts that customization only imitates.",
      ],
      [
        "The floor is the failure point",
        "No Hindi, no offline, no icon-first screens — and a system the floor won't touch starves from below.",
      ],
      [
        "Weight where you need lightness",
        "A family yard needs answers on a phone in the sun, not a terminal in an office.",
      ],
    ],
    change: [
      [
        "No consultants",
        "Stone concepts are native: blocks, slabs, remnants, recovery, aging, gate passes — nothing to configure into existence.",
      ],
      [
        "The floor adopts it",
        "Username-only login, Hindi screens, offline sync — built for the cutter first, because adoption is won or lost there.",
      ],
      [
        "Days, not quarters",
        "A provisioned yard, settings done with you, first fifty blocks tagged together — running in days.",
      ],
      [
        "Depth where stone needs it",
        "Recovery math, remnant tracking, payment gates, per-block P&L — deeper than a generic ERP on exactly the things that are your business.",
      ],
    ],
    tradeoffs: [
      {
        fact: "Multi-yard groups hit our ceiling first.",
        reason:
          "One yard per account today. If you need consolidated rollups across branches now, a generic ERP genuinely serves that better — rollups are on our roadmap, and we'd rather tell you than sell you.",
        roadmap: true,
      },
      {
        fact: "Roles are simple by design.",
        reason:
          "Admin and worker — least-privilege and easy to reason about. Granular permission tiers for larger teams are on the roadmap.",
        roadmap: true,
      },
    ],
    bridge: "Depth where the trade needs it. Simplicity where the user needs it.",
    faq: [
      {
        q: "Is ShilaTeq an ERP?",
        a: "It does what a yard would want from one — inventory, sales, procurement, payroll, dispatch, GST — but it isn't a generic ERP you configure into shape. It's built stone-native, and the worker app is half the point.",
      },
      {
        q: "We're a large processor with multiple units. Should we still talk?",
        a: "Honestly: if consolidated multi-branch rollups are your first requirement, we're not there yet — that's on the roadmap. Many groups start with their busiest yard as its own account. Ask us on WhatsApp and we'll tell you plainly whether we fit today.",
      },
      {
        q: "What about e-invoicing (IRN) thresholds?",
        a: "ShilaTeq generates compliant GST invoices; government e-invoice and e-way-bill API integration is on the roadmap. If your turnover mandates IRN today, tell us — we'd rather set the expectation straight.",
      },
    ],
    related: {
      pillar: { label: "The worker app", href: "/product/worker-app" },
      guides: [
        {
          label: "The Worker App Question — how low-literacy teams adopt software",
          href: "/guides/worker-adoption",
        },
        { label: "Gangsaw Recovery: the math of cutting", href: "/guides/gangsaw-recovery" },
      ],
    },
    demoHref: "/demo?step=4",
    demoMicroline: "the Hindi, offline cut — the part ERPs never solve",
    waPrefix: "Hum ek ERP evaluate kar rahe hain; ShilaTeq se comparison samajhna hai.",
  },
];

export function getComparison(slug: string): Comparison | undefined {
  return comparisons.find((c) => c.slug === slug);
}
