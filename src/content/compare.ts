/**
 * The comparison ENGINE dataset (redesign — COMPARISON_ENGINE_REDESIGN.md).
 *
 * One tabbed, feature-by-feature comparison replaces the four documentation-style
 * pages. Every cell is DERIVED from existing honest content (content/comparisons.ts
 * + the product docs) — no invented facts, no scores, no ratings.
 *
 * Honesty law (binding): StoneX must NOT win every row. Where an incumbent
 * genuinely wins (statutory books, multi-branch rollups) or ties (GST, offline,
 * reporting), the data says so, and every tool keeps its real advantages in the
 * concession panel (`wins`).
 *
 * The narrative, FAQ, trade-offs, metadata, and JSON-LD are still sourced from
 * content/comparisons.ts via the route map below — reuse, not rewrite.
 */

import { getComparison, type Comparison } from "./comparisons";

export type IncumbentId = "paper" | "excel" | "whatsapp" | "accounting" | "erp";

/** Native ✓ · Partial △ · Manual ✕ · Depends ⚠ · Planned 🔒 (StoneX roadmap only). */
export type CellStatus = "included" | "partial" | "manual" | "depends" | "planned";

/** Who honestly comes out ahead on this row. */
export type Winner = "stonex" | "incumbent" | "tie";

export type Incumbent = {
  id: IncumbentId;
  /** Short tab label. */
  tab: string;
  /** In-sentence name. */
  label: string;
  /** One honest line under the tabs. */
  blurb: string;
  /** Where this tool honestly wins (the concession panel). */
  wins: string[];
  /** Optional complement note (WhatsApp / Accounting are complements, not rivals). */
  winsNote?: string;
};

export type Cell = { status: CellStatus; method: string; winner: Winner };

export type Feature = {
  id: string;
  name: string;
  section: SectionName;
  /** The business benefit — why this row matters to a yard owner. */
  benefit: string;
  /** How StoneX handles it (constant across tabs). */
  stonex: { status: CellStatus; method: string };
  /** How each incumbent handles it. */
  cells: Record<IncumbentId, Cell>;
};

export type SectionName = "Inventory" | "Sales & Money" | "Floor & People" | "Growth";

export const sections: SectionName[] = ["Inventory", "Sales & Money", "Floor & People", "Growth"];

/** Presentation metadata for each status glyph (never color-alone: glyph + label). */
export const statusMeta: Record<
  CellStatus,
  { glyph: string; label: string; tone: "ok" | "warn" | "neutral" }
> = {
  included: { glyph: "✓", label: "Included", tone: "ok" },
  partial: { glyph: "△", label: "Partial", tone: "warn" },
  manual: { glyph: "✕", label: "Manual", tone: "neutral" },
  depends: { glyph: "⚠", label: "Depends", tone: "warn" },
  planned: { glyph: "🔒", label: "Planned", tone: "neutral" },
};

export const incumbents: Incumbent[] = [
  {
    id: "paper",
    tab: "Paper Register",
    label: "the paper register",
    blurb: "Free, familiar, disciplined — and blind.",
    wins: [
      "Zero cost, zero vendor, zero training.",
      "Works with no battery and no signal.",
      "Never asks you to change a habit.",
    ],
  },
  {
    id: "excel",
    tab: "Excel",
    label: "Excel sheets",
    blurb: "A clever first system — with no rules.",
    wins: [
      "Infinitely flexible — becomes anything, instantly.",
      "Free-ish, familiar, and psychologically yours.",
      "Genuinely strong at ad-hoc analysis and pivots.",
    ],
  },
  {
    id: "whatsapp",
    tab: "WhatsApp",
    label: "WhatsApp threads",
    blurb: "The right channel — but not a system of record.",
    wins: [
      "Every customer already lives there.",
      "The right channel for this trade.",
      "Your photos and negotiations are already in it.",
    ],
    winsNote:
      "StoneX doesn't replace WhatsApp — it sends quotes, invoices, and reminders through it.",
  },
  {
    id: "accounting",
    tab: "Accounting",
    label: "accounting software",
    blurb: "Keeps the books. Doesn't run the yard.",
    wins: [
      "Statutory books, filing, and your CA's fluency.",
      "Decades of reliability and a known ecosystem.",
      "The system of record for money — keep it.",
    ],
    winsNote: "StoneX feeds it clean numbers — it doesn't replace your accountant.",
  },
  {
    id: "erp",
    tab: "Generic ERP",
    label: "a generic ERP",
    blurb: "Built for identical widgets, not one-of-a-kind stone.",
    wins: [
      "Multi-branch consolidation and group rollups.",
      "Granular roles and approval chains.",
      "Deep integration ecosystems; more configurable.",
    ],
  },
];

/** Terse cell constructor — winner defaults to StoneX. */
const c = (status: CellStatus, method: string, winner: Winner = "stonex"): Cell => ({
  status,
  method,
  winner,
});

export const features: Feature[] = [
  // ─────────────────────────────── Inventory
  {
    id: "qr-identity",
    name: "QR block identity",
    section: "Inventory",
    benefit: "Scan any stone to pull its full record — even without logging in.",
    stonex: { status: "included", method: "A permanent QR identity, minted at intake." },
    cells: {
      paper: c("manual", "A chalk mark on the stone."),
      excel: c("manual", "A row isn't a block."),
      whatsapp: c("manual", "A photo buried in a thread."),
      accounting: c("manual", "Not modelled at all."),
      erp: c("depends", "Custom fields only imitate it."),
    },
  },
  {
    id: "search",
    name: "Find any block",
    section: "Inventory",
    benefit: "Stop losing sales while a buyer waits on the phone.",
    stonex: { status: "included", method: "Typo-tolerant search + scan, from any phone." },
    cells: {
      paper: c("manual", "Someone walks the rows."),
      excel: c("partial", "Ctrl-F — if the sheet is current."),
      whatsapp: c("manual", "Scroll back through old photos."),
      accounting: c("manual", "The books don't track stone."),
      erp: c("depends", "Only if a consultant modelled it."),
    },
  },
  {
    id: "recovery",
    name: "Cutting recovery & remnants",
    section: "Inventory",
    benefit: "Know the true yield of every gangsaw cut.",
    stonex: { status: "included", method: "Recovery %, wastage, auto remnant, cut ledger." },
    cells: {
      paper: c("manual", "Slabs counted; wastage never written."),
      excel: c("manual", "Edit three cells — or forget to."),
      whatsapp: c("manual", "Not tracked anywhere."),
      accounting: c("manual", "Invisible to the books."),
      erp: c("depends", "A foreign concept; customization imitates."),
    },
  },
  {
    id: "aging",
    name: "Aging & carrying cost",
    section: "Inventory",
    benefit: "Surface dead capital before it silently drains cash.",
    stonex: { status: "included", method: "Fresh / amber / red aging + carrying-cost alerts." },
    cells: {
      paper: c("manual", "Nothing turns amber at 90 days."),
      excel: c("partial", "A date column, if it's maintained."),
      whatsapp: c("manual", "No record of age."),
      accounting: c("partial", "Seen late, from vouchers."),
      erp: c("depends", "With enough configuration."),
    },
  },

  // ─────────────────────────────── Sales & Money
  {
    id: "reservation",
    name: "Stop double-selling",
    section: "Sales & Money",
    benefit: "The same block can never be promised to two buyers.",
    stonex: { status: "included", method: "Atomic reservation; reserved stock disappears." },
    cells: {
      paper: c("manual", "One book, no locking."),
      excel: c("manual", "Cells don't reserve stone."),
      whatsapp: c("manual", "Two chats, two promises."),
      accounting: c("manual", "Not an accounting concept."),
      erp: c("depends", "Possible, with the right config."),
    },
  },
  {
    id: "margin",
    name: "True margin after wastage",
    section: "Sales & Money",
    benefit: "Never sell a slab below its real cost by accident.",
    stonex: { status: "included", method: "Sale-time COGS from wastage-adjusted cost." },
    cells: {
      paper: c("manual", "Margins by feel."),
      excel: c("partial", "Only as good as your formulas."),
      whatsapp: c("manual", "No costing at all."),
      accounting: c("partial", "Margins without cutting wastage."),
      erp: c("depends", "If block cost is modelled correctly."),
    },
  },
  {
    id: "gst",
    name: "GST invoicing",
    section: "Sales & Money",
    benefit: "Compliance becomes a tap, not a month-end deadline.",
    stonex: { status: "included", method: "One tap: CGST/SGST/IGST, HSN 6802, ₹ in words." },
    cells: {
      paper: c("manual", "GST math by hand."),
      excel: c("manual", "A template you maintain."),
      whatsapp: c("manual", "Typed out by hand."),
      accounting: c("included", "Its core strength.", "tie"),
      erp: c("included", "With the tax module configured.", "tie"),
    },
  },
  {
    id: "payment-gate",
    name: "Payment gate",
    section: "Sales & Money",
    benefit: "Nothing leaves the yard until a payment is confirmed.",
    stonex: { status: "included", method: "No confirmed payment, nothing dispatches." },
    cells: {
      paper: c("manual", "Discipline lives in memory."),
      excel: c("manual", "Nothing enforces the rule."),
      whatsapp: c("manual", "A promise in a chat."),
      accounting: c("manual", "Records payment after the fact."),
      erp: c("depends", "Approval chains, if they're built."),
    },
  },
  {
    id: "books",
    name: "Statutory books & filing",
    section: "Sales & Money",
    benefit: "Keep your accountant's system — and feed it the truth.",
    stonex: { status: "partial", method: "Exports clean numbers to it — isn't a books system." },
    cells: {
      paper: c("manual", "Hand-kept, error-prone ledgers."),
      excel: c("manual", "A sheet isn't statutory books."),
      whatsapp: c("manual", "Not applicable."),
      accounting: c("included", "Statutory books & filing — its job.", "incumbent"),
      erp: c("included", "Full books & compliance modules.", "incumbent"),
    },
  },

  // ─────────────────────────────── Floor & People
  {
    id: "offline",
    name: "Works offline on the floor",
    section: "Floor & People",
    benefit: "A dropped signal never stalls a cut or a delivery.",
    stonex: { status: "included", method: "The worker app logs work offline, syncs later." },
    cells: {
      paper: c("included", "A register needs no signal.", "tie"),
      excel: c("manual", "The sheet's on someone's laptop."),
      whatsapp: c("partial", "Messages queue, then send."),
      accounting: c("manual", "Desktop, online only."),
      erp: c("manual", "A terminal in an office."),
    },
  },
  {
    id: "worker-app",
    name: "Worker app — Hindi & payroll",
    section: "Floor & People",
    benefit: "The shop floor actually adopts it — that's where software dies.",
    stonex: { status: "included", method: "Bilingual EN/हिंदी app; attendance, wages, advances." },
    cells: {
      paper: c("partial", "No literacy needed — but no data either."),
      excel: c("manual", "The cutter won't edit a spreadsheet."),
      whatsapp: c("partial", "Hindi chat, but no structure."),
      accounting: c("manual", "No shop-floor concept."),
      erp: c("manual", "English, dense, desktop-first."),
    },
  },
  {
    id: "dispatch",
    name: "Dispatch & delivery tracking",
    section: "Floor & People",
    benefit: "Goods leave and arrive on the record, not on trust.",
    stonex: { status: "included", method: "Gate pass + tracking QR; driver app; public link." },
    cells: {
      paper: c("manual", "A hand-written gate pass."),
      excel: c("manual", "A row, maybe."),
      whatsapp: c("partial", "Share updates in the chat."),
      accounting: c("manual", "Not its domain."),
      erp: c("depends", "A logistics module, if licensed."),
    },
  },

  // ─────────────────────────────── Growth
  {
    id: "showroom",
    name: "Showroom, leads & customers",
    section: "Growth",
    benefit: "Turn web visitors into quote requests — without building a website.",
    stonex: { status: "included", method: "Per-yard 3D showroom, price-gated, leads inbox." },
    cells: {
      paper: c("manual", "No shopfront."),
      excel: c("manual", "No shopfront."),
      whatsapp: c("partial", "A WhatsApp catalog — real reach."),
      accounting: c("manual", "None."),
      erp: c("manual", "Rarely, and never stone-native."),
    },
  },
  {
    id: "reports",
    name: "Reports & analytics",
    section: "Growth",
    benefit: "Run the business on evidence instead of memory.",
    stonex: { status: "included", method: "Dashboard KPIs + P&L, profitability, receivables." },
    cells: {
      paper: c("manual", "Month-end archaeology."),
      excel: c("partial", "Pivot tables, if you build them."),
      whatsapp: c("manual", "Nothing."),
      accounting: c("partial", "Financial reports only."),
      erp: c("included", "Strong BI — a genuine strength.", "tie"),
    },
  },
  {
    id: "rollups",
    name: "Multi-branch rollups",
    section: "Growth",
    benefit: "A consolidated group view across several locations.",
    stonex: { status: "planned", method: "One yard per account today; rollups on the roadmap." },
    cells: {
      paper: c("manual", "None.", "tie"),
      excel: c("partial", "Link workbooks by hand.", "incumbent"),
      whatsapp: c("manual", "None.", "tie"),
      accounting: c("partial", "Group entities in the books.", "incumbent"),
      erp: c("included", "Consolidation across branches.", "incumbent"),
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Route map — one URL per incumbent, each SSR-rendering the engine preselected.
// Reuses the narrative/FAQ/metadata from content/comparisons.ts. `vs-whatsapp`
// is additive (no existing URL removed).
// ─────────────────────────────────────────────────────────────────────────────

export type CompareRoute = {
  slug: string;
  incumbentId: IncumbentId;
  /** Source comparison in content/comparisons.ts for narrative + FAQ + metadata. */
  comparisonSlug: string;
  /** Optional metadata override (used by vs-whatsapp). */
  metaTitle?: string;
  metaDescription?: string;
};

export const compareRoutes: CompareRoute[] = [
  { slug: "vs-paper", incumbentId: "paper", comparisonSlug: "vs-paper" },
  { slug: "vs-excel-whatsapp", incumbentId: "excel", comparisonSlug: "vs-excel-whatsapp" },
  {
    slug: "vs-whatsapp",
    incumbentId: "whatsapp",
    comparisonSlug: "vs-excel-whatsapp",
    metaTitle: "From WhatsApp threads to one system — ShilaTeq",
    metaDescription:
      "WhatsApp is the right channel for the stone trade — ShilaTeq builds on it. An honest look at where threads break as your system of record, and what one connected yard changes.",
  },
  { slug: "vs-tally-accounting", incumbentId: "accounting", comparisonSlug: "vs-tally-accounting" },
  { slug: "vs-erp", incumbentId: "erp", comparisonSlug: "vs-erp" },
];

export function getIncumbent(id: IncumbentId): Incumbent {
  const found = incumbents.find((i) => i.id === id);
  if (!found) throw new Error(`Unknown incumbent: ${id}`);
  return found;
}

export type ResolvedCompareRoute = {
  route: CompareRoute;
  incumbent: Incumbent;
  comparison: Comparison;
  metaTitle: string;
  metaDescription: string;
};

/** Resolve a /why/<slug> route to its tab, narrative, and metadata. */
export function getCompareRoute(slug: string): ResolvedCompareRoute | undefined {
  const route = compareRoutes.find((r) => r.slug === slug);
  if (!route) return undefined;
  const comparison = getComparison(route.comparisonSlug);
  if (!comparison) return undefined;
  return {
    route,
    incumbent: getIncumbent(route.incumbentId),
    comparison,
    metaTitle: route.metaTitle ?? comparison.metaTitle,
    metaDescription: route.metaDescription ?? comparison.metaDescription,
  };
}
