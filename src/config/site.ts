/**
 * Site configuration — the single home for Gate-zero values.
 * Source: website/phase-4/12_IMPLEMENTATION_ROADMAP.md (Gate-zero) + AMENDMENTS.md A-004.
 *
 * HONESTY LAW: no fake values may ever render. Components consuming these values
 * must degrade honestly when a value is null (e.g., the WhatsApp door does not
 * render, and a dev-only note marks the pending gate). The launch checklist
 * (phase-4/13 §G) blocks launch while any gate value is null.
 */

export const site = {
  name: "ShilaTeq",
  /** The category flag — titles/About/PR only, never the hero (Phase-2 01 §3). */
  categoryLine: "The operating system for stone yards",
  /** Plain-register one-liner (Phase-2 positioning, canonical). */
  plainLine:
    "Your whole yard on one phone — every block, every rupee, every worker, every customer.",

  /** GATE-ZERO [Founder A2]: branded production domain. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? null,

  /**
   * GATE-ZERO [Founder]: WhatsApp business number in international format
   * without "+" (e.g. "9198XXXXXXXX"). Null = doors degrade per A-004.
   */
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? null,

  /**
   * GATE-ZERO [Founder C11/D21]: the public demo application URL
   * (the product's zero-infra demo). Null = /demo renders its pending state.
   */
  demoAppUrl: process.env.NEXT_PUBLIC_DEMO_APP_URL ?? null,

  /** Live showroom example URL (a real yard's public catalog) — footer proof link. */
  showroomUrl: process.env.NEXT_PUBLIC_SHOWROOM_URL ?? null,

  /** PostHog analytics — loads only when the key is set (M7). */
  posthogKey: process.env.NEXT_PUBLIC_POSTHOG_KEY ?? null,
  posthogHost: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",

  /**
   * Company entity facts for legal/trust pages (Gate-zero B7). Null = the
   * honest placeholder renders; no invented entity/address/email ever.
   */
  legalEntity: process.env.NEXT_PUBLIC_LEGAL_ENTITY ?? null,
  legalAddress: process.env.NEXT_PUBLIC_LEGAL_ADDRESS ?? null,
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? null,
  securityEmail: process.env.NEXT_PUBLIC_SECURITY_EMAIL ?? null,
} as const;

/** Build a wa.me deep link with a prefilled, page-contextual opener (Phase-4 06 §1). */
export function waLink(prefill: string): string | null {
  if (!site.whatsappNumber) return null;
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(prefill)}`;
}

/** Default conversational opener; pages append their context (Phase-2 08 §3). */
export const waDefaultPrefill = "Namaste, main ShilaTeq ke baare mein jaanna chahta/chahti hoon.";

/** Primary navigation — 5 items, frozen (Phase-4 01 §3). */
export const nav = [
  { label: "Product", href: "/product" },
  { label: "Demo", href: "/demo" },
  { label: "Why ShilaTeq", href: "/why" },
  { label: "Pricing", href: "/pricing" },
  { label: "Resources", href: "/resources" },
] as const;

export const footerColumns = [
  {
    title: "Product",
    links: [
      { label: "Overview", href: "/product" },
      { label: "Inventory & QR identity", href: "/product/inventory-qr" },
      { label: "Sales, payments & GST", href: "/product/sales-gst" },
      { label: "The worker app", href: "/product/worker-app" },
      { label: "Showroom & leads", href: "/product/showroom" },
      { label: "Try the demo", href: "/demo" },
    ],
  },
  {
    title: "Why ShilaTeq",
    links: [
      { label: "vs Paper & register", href: "/why/vs-paper" },
      { label: "vs Excel & WhatsApp", href: "/why/vs-excel-whatsapp" },
      { label: "vs Accounting software", href: "/why/vs-tally-accounting" },
      { label: "vs Generic ERP", href: "/why/vs-erp" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Guides", href: "/guides" },
      { label: "FAQ", href: "/faq" },
      { label: "Documentation", href: "/docs" },
      { label: "Security", href: "/security" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
] as const;
