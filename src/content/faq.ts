/**
 * FAQ content (phase-4/04 §8, phase-4/06). Grouped by ANXIETY, not by feature.
 * Seeded from the Phase-1 product FAQ voice; every answer honest, limitations
 * included, no over-promises. Each item has a stable slug for deep-linking.
 */

export type FaqItem = { slug: string; q: string; a: string };
export type FaqGroup = { title: string; items: FaqItem[] };

export const faqGroups: FaqGroup[] = [
  {
    title: "Cost & commitment",
    items: [
      {
        slug: "what-does-it-cost",
        q: "How much does it cost?",
        a: "Pricing depends on your yard — how much stone and how many people. The fastest way to a straight number is to ask us on WhatsApp; you'll usually have an answer within minutes, not a callback next week. What we can tell you now is the shape of the cost: there's no hardware to buy, no servers to run, no per-message fees, and no cut taken from your payments.",
      },
      {
        slug: "what-else-will-i-pay-for",
        q: "What else will I have to pay for?",
        a: "Nothing hidden. The camera on the phones you already own is the scanner. Messaging goes through WhatsApp's free click-to-chat links, so there's no messaging bill. Payments are recorded, not processed, so there's no gateway fee or percentage taken. And your data exports to Excel and CSV any time — leaving is free, which is why we have to earn your staying.",
      },
      {
        slug: "can-i-leave",
        q: "What if I want to stop using it?",
        a: "Then you take your data and go. Everything exports to Excel and CSV whenever you want. There's no lock-in by design — we'd rather keep you by being worth it than by trapping your data.",
      },
    ],
  },
  {
    title: "Workers & adoption",
    items: [
      {
        slug: "will-my-workers-use-it",
        q: "My workers aren't tech people. Will they actually use it?",
        a: "That's exactly what the worker app is built for. A worker logs in with just a username his admin creates — no email, no password to memorise. His screens are icons and numbers, in English or Hindi, with the choice remembered. And it works offline, so a dropped signal in the shed never loses his work. Most importantly, it gives him something back: he sees his own attendance, his own earnings, and can request an advance from his phone.",
      },
      {
        slug: "no-signal-in-the-shed",
        q: "There's no signal in my shed. Does it still work?",
        a: "Yes — that's a core design goal. A worker can log a full shift of cutting and tasks with no connection at all; everything saves on his device and syncs automatically when signal returns, in order, exactly once. A clear indicator shows him whether his work is saved. The admin/office side does need a connection to first load its pages — full offline for the office is on the roadmap.",
      },
      {
        slug: "can-workers-see-prices",
        q: "Can my workers see prices and margins?",
        a: "No. Pricing and financial information are hidden from workers entirely. A cutter sees the stone, his task, and his own pay — never selling prices, customer credit, or margins. Financial visibility is for admins only.",
      },
    ],
  },
  {
    title: "Data & privacy",
    items: [
      {
        slug: "will-competitors-see-my-prices",
        q: "If I go online, will competitors see my prices?",
        a: "Only what you choose to show. Every block is put on the public showroom individually, and its price is a separate choice — show a number, or show “On request.” Your costs, suppliers, margins, and any stock you haven't opted in are never sent to a public page at all. Competitors see a catalog; your commercial secrets stay in the office.",
      },
      {
        slug: "can-another-yard-see-my-data",
        q: "Can another yard on the platform see my data?",
        a: "No. Every record belongs to exactly one yard, and the isolation is enforced at the database level, not just hidden on screen — the backend refuses to return one yard's data to another yard's user. Shared platform, sealed boxes.",
      },
      {
        slug: "is-there-an-audit-trail",
        q: "Is there a record of who did what?",
        a: "There is an activity view that shows recent actions and captured errors. To be straight with you: automatic, complete server-side logging of every sensitive action is still being finished — it's a known, tracked improvement, not a finished feature yet. We'd rather tell you that than imply a complete audit trail exists today.",
      },
    ],
  },
  {
    title: "Accountant & GST",
    items: [
      {
        slug: "does-it-do-gst",
        q: "Does it handle GST invoicing?",
        a: "Yes, natively. It generates compliant tax invoices with the correct CGST/SGST split for in-state sales or IGST for inter-state, the HSN code for worked stone, and the total spelled out in words in the Indian lakh/crore convention. Invoices print cleanly and can be shared on WhatsApp. (For anything specific to your obligations or turnover thresholds, confirm with your accountant — we handle the mechanics, not the tax advice.)",
      },
      {
        slug: "does-it-connect-to-tally",
        q: "Does it connect to Tally?",
        a: "Not directly, yet. Today ShilaTeq produces GST-compliant invoices and clean Excel/CSV exports your accountant can bring into any package. A direct Tally connector is on the roadmap — one of the first integrations we intend to ship, precisely because your accountant's opinion matters. We don't announce dates we can't keep.",
      },
      {
        slug: "e-invoice-e-way",
        q: "Does it generate e-invoices (IRN) or e-way bills?",
        a: "Not yet. It generates GST tax invoices and gate passes today; the e-way number is entered manually on the dispatch. Government e-invoicing (IRN) and e-way-bill API integration is on the roadmap, aimed at larger yards that cross the relevant thresholds.",
      },
    ],
  },
  {
    title: "Getting started",
    items: [
      {
        slug: "how-do-accounts-work",
        q: "How do I get an account?",
        a: "Today, yard accounts are set up as part of onboarding rather than through open self-signup. Once your yard exists, you complete a short setup — GSTIN, GST rate, block-code prefix, aging thresholds — and start tagging stock. Self-service signup is on the roadmap; for now, a real person helps you get going.",
      },
      {
        slug: "who-tags-my-existing-stock",
        q: "Who tags all the stone I already have?",
        a: "New stock tags itself: receiving a purchase order fans every line out into QR-coded, costed blocks in one tap. For the stone already standing in your yard, onboarding includes help tagging your first fifty blocks, and the tagging wizard takes under a minute per block once your team finds its rhythm.",
      },
      {
        slug: "do-i-need-hardware",
        q: "Do I need to buy anything?",
        a: "No. ShilaTeq runs in a web browser on the phones and computers you already own — add it to your home screen for app-like access. There's no server to run, no software to install, and no barcode scanners to buy. The phone's camera does the scanning.",
      },
      {
        slug: "how-do-i-try-it",
        q: "How can I try it before deciding?",
        a: "Start with the demo — a full sample yard, real product, with a reset button, and no signup. Explore every workflow risk-free, on your own phone, before you talk to anyone.",
      },
    ],
  },
  {
    title: "What we don't do yet",
    items: [
      {
        slug: "online-payments",
        q: "Can it collect payments online?",
        a: "No — it records the payments you collect (cash, UPI, bank transfer, card), rather than processing them. That keeps it free of transaction fees and compliance overhead, which suits a cash-and-credit trade. Optional online/UPI collection is on the roadmap.",
      },
      {
        slug: "multiple-yards",
        q: "Can I manage multiple yards in one view?",
        a: "Not yet. Today ShilaTeq is strongest as one yard per account. A group owner who wants a single consolidated view across branches will find that limited for now — multi-yard rollups are a prioritised roadmap item. Many owners start with their busiest yard.",
      },
      {
        slug: "native-app",
        q: "Is there an app in the Play Store?",
        a: "Not today. ShilaTeq is a mobile-first web app you add to your home screen for app-like access — which is how it stays instant, with nothing to install or update. A native/installable app experience is on the roadmap.",
      },
      {
        slug: "email",
        q: "Does it send email?",
        a: "No — there's no email channel at all, by design. All customer messaging goes through WhatsApp, the channel your buyers actually read, and all internal alerts are in-app. If you're expecting emailed reports or reminders, they won't arrive by email.",
      },
    ],
  },
];

export function allFaqItems(): FaqItem[] {
  return faqGroups.flatMap((g) => g.items);
}
