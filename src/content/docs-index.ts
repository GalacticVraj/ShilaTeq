/**
 * Pure documentation index — no fs, safe for client components (the sidebar).
 * The fs-reading transform lives in src/lib/docs.ts (server-only).
 */

export type DocMeta = {
  slug: string;
  file: string;
  title: string;
  summary: string;
};

export const docsIndex: DocMeta[] = [
  {
    slug: "product-overview",
    file: "01_Product_Overview.md",
    title: "Product Overview",
    summary: "The guided, end-to-end tour — one block's complete journey through the platform.",
  },
  {
    slug: "features",
    file: "02_Features.md",
    title: "Features",
    summary:
      "Every feature in the product, grouped into 17 domains, documented against one template.",
  },
  {
    slug: "modules",
    file: "03_Modules.md",
    title: "Modules",
    summary: "The 19 logical modules and how they connect into one pipeline.",
  },
  {
    slug: "user-roles",
    file: "04_User_Roles.md",
    title: "User Roles & Permissions",
    summary: "Admin, worker, driver, public — who can do what, and how yards stay sealed.",
  },
  {
    slug: "user-journeys",
    file: "05_User_Journeys.md",
    title: "User Journeys",
    summary: "Seven realistic end-to-end journeys, from first login to returns.",
  },
  {
    slug: "screens-and-pages",
    file: "06_Screens_and_Pages.md",
    title: "Screens & Pages",
    summary: "Every screen in the admin app, worker app, and public pages.",
  },
  {
    slug: "business-workflows",
    file: "07_Business_Workflows.md",
    title: "Business Workflows",
    summary: "The core processes and the state machines that keep a yard honest.",
  },
  {
    slug: "reports-and-analytics",
    file: "08_Reports_and_Analytics.md",
    title: "Reports & Analytics",
    summary: "The dashboard, the five-tab BI suite, the metric catalog, and exports.",
  },
  {
    slug: "notifications",
    file: "09_Notifications.md",
    title: "Notifications & Messaging",
    summary: "Toasts, the two alert engines, WhatsApp templates, and sync status.",
  },
  {
    slug: "integrations",
    file: "10_Integrations.md",
    title: "Integrations & Platform",
    summary:
      "The deliberately short list of services the platform stands on — and the deliberate absences.",
  },
  {
    slug: "product-strengths",
    file: "11_Product_Strengths.md",
    title: "Product Strengths",
    summary: "The signature capabilities and the honest comparison with the alternatives.",
  },
  {
    slug: "product-opportunities",
    file: "12_Product_Opportunities.md",
    title: "Roadmap & Opportunities",
    summary: "A candid improvement list — the gaps, the enterprise path, and the forward bets.",
  },
  {
    slug: "faq",
    file: "13_FAQ.md",
    title: "Product FAQ",
    summary: "Straight answers for buyers, users, and stakeholders — limitations included.",
  },
  {
    slug: "product-summary",
    file: "14_Product_Summary.md",
    title: "Product Summary",
    summary: "The executive close: what it is, who it serves, and where it's headed.",
  },
];
