# ❓ Frequently Asked Questions

> Straight answers to the questions buyers, users, and stakeholders actually ask about ShilaTeq (StoneX) — what it is, how it works, and where it's honestly still growing.

[← Back to Documentation Hub](README.md)

---

## Overview

This FAQ is grouped so you can jump to what you need:

- [About the Product](#-about-the-product)
- [Getting Started](#-getting-started)
- [Roles & Access](#-roles--access)
- [Features & Workflows](#-features--workflows)
- [Offline & Mobile](#-offline--mobile)
- [Security & Data](#-security--data)
- [Pricing & Scaling](#-pricing--scaling)
- [Integrations](#-integrations)
- [Support & Roadmap](#-support--roadmap)

Answers are marked **✅ Confirmed** where directly supported by the product, and **💡 Inferred** where they represent a reasonable expectation (for example, pricing) rather than a stated fact.

---

## 🪨 About the Product

### What is ShilaTeq?
**ShilaTeq is the operating system for stone yards.** ✅ It's a mobile-first web platform that gives every stone block a QR-coded digital identity the moment it arrives, then runs the entire business from there — procurement, cutting, quotations, orders, GST invoices, dispatch, payments, and payroll — plus a public 3D showroom that turns web visitors into leads. It's built for marble, granite, sandstone, and limestone yards, works on any phone in English or Hindi, and keeps working when the internet doesn't.

> **Note:** *ShilaTeq* is the product name; you may occasionally see the internal engineering name **StoneX** in a URL (the live app runs at `stonevl.vercel.app`). They're the same thing.

### What does the name mean?
"Shila" (शिला) is the Sanskrit/Hindi word for *stone* or *rock*. ShilaTeq is, literally, *stone technology*. ✅

### Who should use it?
Small-to-mid, family-run **stone yards, processors, and traders** — the businesses that quarry, cut, and sell dimensional stone, predominantly across India's stone belts (Rajasthan, Gujarat, and beyond). ✅ Within a yard, it serves five kinds of user: the **owner/admin**, the **supervisor/manager**, the **shop-floor worker/cutter**, the **driver**, and the **public buyer** browsing the online showroom. See [User Roles](04_User_Roles.md).

### What problems does it solve?
The chronic, expensive problems of running a stone yard on paper and memory: ✅
- **"Where is that block?"** — thousands of near-identical blocks, no index. → QR identity + instant search.
- **Dead capital** in slow-moving stock. → Aging buckets + carrying-cost alerts.
- **Invisible margins** — cost guessed, cutting wastage unseen. → Recovery-adjusted costing + true cost-of-goods at sale time.
- **Credit & payment leakage** — sold on informal credit, overpayments lost. → Credit limits, store-credit ledger, payment tracking.
- **Manual GST invoicing** — error-prone tax math. → One-tap compliant invoices.
- **No shopfront** — buyers can't see stock. → Public 3D showroom with lead capture.
- **Connectivity & language gaps** on the floor. → Offline-first, bilingual worker app.

### How is it different from generic accounting software or an ERP?
ShilaTeq is **purpose-built for stone.** ✅ Generic accounting software sees the money but not the stone; a generic ERP treats a block like a boxed product and needs expensive customization to fit. ShilaTeq natively models the block → slab → remnant lifecycle, volumetric (area-based) pricing, cutting recovery, aging, and carrying cost — and wraps it in an offline, bilingual, India-native experience. See the full comparison in [Product Strengths](11_Product_Strengths.md).

### Is it a real, live product or a prototype?
It's a **live production system**, deployed and in use, that has evolved well beyond its original "Phase 1 MVP" scope. ✅

---

## 🚀 Getting Started

### How do users get started?
The fastest way to experience ShilaTeq is its **built-in demo mode** — a full, in-browser version pre-loaded with realistic sample data and a reset button, requiring no server, signup, or setup. ✅ It's ideal for evaluating the product, training staff, and practicing safely without touching real records.

### How are accounts created?
Today, new **yard accounts are provisioned as part of onboarding** rather than through open self-signup. ✅ Once a yard exists, its owner/admin sets up the yard profile (name, GSTIN, GST rate, carrying-cost rate, aging thresholds) and starts tagging stock.

> **💡 Roadmap:** Self-service owner signup and a guided first-run onboarding wizard are on the roadmap — see [Product Opportunities](12_Product_Opportunities.md).

### What's the first thing I should do after logging in?
Set up your **yard profile in Settings** (GSTIN, GST rate, thresholds), then **tag your first block** — either manually through the tagging wizard or by receiving a purchase order, which automatically creates block records for you. From that first tagged block, every other workflow (quote, order, invoice, dispatch) becomes available. ✅

### Do I need to install anything or buy hardware?
No. ✅ ShilaTeq runs in a web browser on the phones and computers you already own. You can add it to your phone's home screen for app-like access. There's no server to run, no software to install, and no barcode scanners to buy — the phone's camera does the scanning.

---

## 👥 Roles & Access

### What roles exist?
Four. ✅

| Role | Who they are | How they log in | What they see |
|---|---|---|---|
| **Admin / Owner** | The yard owner or a trusted manager | Email + password | The full platform — inventory, sales, finance, workforce, reports, settings |
| **Worker** | Shop-floor cutter or general staff | **Username only** | A simple worker app — tasks, cutting, deliveries, own earnings, scanning |
| **Driver** | A worker assigned to a delivery | (Same as worker) | Only their assigned deliveries |
| **Public / Guest** | A prospective buyer | No login | The public showroom, a block's QR card, and delivery tracking links |

Full details and the permissions matrix are in [User Roles](04_User_Roles.md).

### How do workers log in?
Workers log in with a **username only** — no email, no complicated password to remember. ✅ An admin provisions a worker's login from the Workers page, and the worker then signs in with that username on any phone. This is deliberate: it keeps access effortless for a shop-floor workforce that may not have or want email accounts.

### Is "driver" a separate role?
No — a driver is simply a **worker who's been assigned to a dispatch.** ✅ When an admin assigns a delivery to a worker, that worker sees it in their deliveries list and can mark it in-transit and delivered. They see only their own deliveries.

### Can workers see prices, costs, or margins?
No. ✅ The worker app deliberately **hides pricing and financial information.** A cutter sees the stone, the task, and their own earnings — not selling prices, customer credit, or margins. Financial visibility is reserved for admins.

### Can the public see everything in my catalog?
No — the public showroom shows **only available blocks**, with **safe information only** (no purchase cost, no supplier, no exact stock location), and **prices are gated per block**: you choose which blocks show a price and which say "On request." ✅

---

## 🛠️ Features & Workflows

### What can ShilaTeq actually do, end to end?
It runs the full lifecycle: ✅
1. **Procurement** — suppliers, purchase orders, and receiving stock (which auto-creates tagged blocks).
2. **Inventory** — QR identity, tagging, photos, aging, carrying cost, per-block analytics, typo-tolerant search.
3. **Manufacturing** — cutting a block into slabs with recovery %, wastage, and a leftover remnant block.
4. **Sales** — quotations (with GST preview), orders (with credit checks and safe stock reservation), returns.
5. **Finance** — payments in/out, store credit, credit limits, expenses, and one-tap GST invoices.
6. **Logistics** — dispatch, gate passes, driver assignment, and public delivery tracking.
7. **Workforce** — attendance, payroll with wage snapshots, advances, and piece-rate cutting.
8. **Showroom** — a public 3D catalog that captures leads into an admin inbox.
9. **Reporting** — dashboards and a 5-tab analytics suite with exports.

See [Features](02_Features.md) and [Business Workflows](07_Business_Workflows.md).

### Does it support GST invoicing?
Yes — GST is native. ✅ ShilaTeq generates compliant tax invoices with the correct **CGST/SGST/IGST split** (intra-state vs. inter-state), the **HSN code** for stone, and the total **spelled out in Indian words** (lakh/crore). Invoices print cleanly and can be shared on WhatsApp.

### How does cutting a block work?
A worker enters how much material was consumed and lists the slabs produced. ShilaTeq computes the **recovery percentage** and **wastage**, mints the new slabs (each with its own identity and a cost that correctly reflects wastage), records the cut permanently in a ledger, and — if material is left over — automatically creates a **remnant block** that's instantly available to sell again. ✅

### How does the public catalog / showroom work?
Each yard gets its own public 3D showroom at a shareable link. ✅ Visitors browse available stone in an interactive 3D experience, see prices where you've allowed them (or "On request"), and can **request a quote** — which lands in your admin **Leads inbox**. You reply on WhatsApp, and the lead automatically advances from "new" to "contacted." An admin can share the catalog link (or a catalog QR embedded on invoices) directly.

### How are payments handled?
Payments are **recorded manually** as they come in — **cash, UPI, bank transfer, card, or credit note.** ✅ ShilaTeq automatically keeps each order's paid amount and outstanding balance in sync, guards against overpayment, and requires at least one confirmed payment before an order can move past "reserved." There is **no online payment gateway** today (see below).

> **⚠️ Limitation:** ShilaTeq does not process card/UPI payments online — it *records* payments you collect. This keeps it free of transaction fees and compliance overhead, which suits a cash-and-credit market. Optional online/UPI collection is a roadmap item. 💡

### What happens with returns and damaged stock?
Returns can be processed on a completed (sold) order. ✅ Each returned item is either **restocked** (good — back into the sellable pool) or **scrapped** (damaged — written off and removed from stock, with the loss recorded). If a return leaves the customer having overpaid, that surplus automatically becomes **store credit** on their account, which can be applied to future orders — no money quietly lost.

### Can I edit an order after it's placed?
Yes — a reserved order can have lines added or removed, and stock is automatically re-reserved or released to match, with a floor at the amount already paid. ✅

### Does it help me find slow-moving or aging stock?
Yes. ✅ Blocks automatically age into **fresh / amber / red** buckets against thresholds you set, with **carrying-cost estimates**, surfaced as dashboard alerts. Inventory analytics show lifetime profit and aging per block so you can spot dead capital.

---

## 📴 Offline & Mobile

### Does it work offline?
Yes — for the **shop floor**, offline is a core design goal. ✅ Workers can log cutting output and complete task steps with no signal; their actions are saved on the device and **sync automatically** — safely and without duplicates — the moment connectivity returns. A sync indicator shows what's saved and what's syncing.

> **⚠️ Limitation:** Offline currently covers **worker actions** (cutting, tasks, deliveries). The **admin/office app** still needs a connection to *first load* its pages — full offline support for the office side is a roadmap item. 💡

### Is there a mobile app?
ShilaTeq is a **mobile-first web app** that runs in any phone browser and can be **added to your home screen** for app-like access. ✅ There is **no native app in the app stores yet** — a native/installable app experience is on the roadmap. 💡 In practice, most users run it from their phone's browser or home screen today.

### What kind of phone do I need?
Any reasonably modern smartphone with a browser and a camera. ✅ ShilaTeq is deliberately optimized to run well on **mid-range Android hardware** and modest networks — heavy features load only when needed, and screens stay light.

### What languages are supported?
The **worker app is fully bilingual — English and हिंदी (Hindi)** — with an icon- and number-first design so literacy is never a barrier, and the language choice syncs across the worker's screens. ✅ The admin app is primarily in English. Extending more of the experience (including the public showroom) to additional languages is a roadmap idea. 💡

### Can I scan a block's QR code with my phone?
Yes. ✅ The scanner uses your phone's camera, preferring fast built-in barcode detection and falling back to a software scanner on browsers that need it, so it works across virtually all modern phones. There's also a manual-entry fallback. Scanning a block pulls up its full record instantly (for logged-in users) or a safe public identity card (for anyone).

---

## 🔒 Security & Data

### Is my data secure?
Yes. ✅ ShilaTeq runs on a managed, enterprise-grade cloud backend with security enforced at the **data layer**, not just in the app. Sensitive operations (reserving stock, cutting, applying credit, processing returns, creating worker logins) run as protected server-side functions that can't be bypassed from a browser. Credentials are never hard-coded in the app.

### How is multi-tenant isolation handled — can another yard see my data?
No. ✅ Every business record is tagged to your yard, and the database itself enforces **row-level security**: a user can only ever read and write their own yard's data. This isolation is applied on every table and enforced by the backend, so it can't be worked around from the front end. The public showroom is the one deliberately public surface, and it exposes only safe, available-stock information through narrow, read-only channels — never a direct view of your tables.

### Who can see prices and financial information?
Only **admins/owners.** ✅ Workers never see prices, costs, or margins; the public sees only the prices you explicitly choose to publish per block.

### Is there an audit trail of who did what?
There is an **activity view** that shows recent actions and captured errors. ✅ Automatic, server-side population of a complete, tamper-evident audit log is **still being completed** — it's a known, tracked improvement. 💡 See [Product Opportunities](12_Product_Opportunities.md).

### What about backups and losing data?
Data lives in a managed cloud with automated durability, so there are no local files to lose. ✅ Customer-facing backup/restore and "export my data" controls are a roadmap enhancement; in the meantime, reports and data export freely to Excel and CSV. 💡

### Are there any known security items being worked on?
Yes, and we're transparent about them. ✅ A previously-published demo owner password is flagged for rotation, and a few permission-hardening follow-ups are tracked before large-scale multi-tenant rollout. These are documented and prioritized in [Product Opportunities](12_Product_Opportunities.md).

---

## 💳 Pricing & Scaling

### How much does it cost?
> **💡 Inferred:** ShilaTeq is a **B2B SaaS product**, so the expected model is a **subscription** (likely per-yard, possibly tiered by users or features). This documentation set does **not** state official prices — please contact the ShilaTeq team for current plans. Any figures you see elsewhere in these docs are illustrative, not quotes.

What we *can* say with confidence: the product is designed for **low total cost of ownership.** ✅ There's no hardware to buy, no servers to run, no per-message fees (WhatsApp uses free click-to-chat links), and no payment-processor cut (payments are recorded, not processed). The barriers to trying it are near zero thanks to demo mode.

### Can it scale to many yards and users?
Yes, technically. ✅ The platform is **multi-tenant** — one secure deployment serves many isolated yards — runs on a managed cloud that scales as a service, and is delivered globally for fast access. It's engineered to stay responsive as data grows (efficient live updates, on-demand loading of heavy features).

> **⚠️ Limitation:** Today it's strongest as **one yard per account.** A group owner wanting a **single consolidated view across multiple yards/branches** (organisation rollups) will find that limited for now — it's a prioritized roadmap item. 💡

### How many users can be on one yard account?
The role model supports one or more admins plus as many workers as the yard provisions (each with their own username login), all seeing live, synchronized data. ✅ There's no architectural single-user limit; practical limits scale with the managed cloud backend.

### Will it slow down as my inventory grows?
It's built not to. ✅ Live freshness is event-driven rather than constant polling, large photos are kept out of list views, and heavy features load only when needed — all specifically to keep the app fast on modest phones as records accumulate.

---

## 🔌 Integrations

### What integrations are available?
ShilaTeq integrates a small, deliberate set of high-value services and device capabilities: ✅
- **Supabase** — the managed cloud backend (data, login, live sync, secure functions, storage).
- **WhatsApp** — built-in messaging for quotes, invoices, dispatch tracking, lead replies, and payment reminders (via free click-to-chat links).
- **Vercel** — global hosting and instant, zero-downtime updates.
- **Google Maps** — the yard's location embedded on the public showroom.
- **Your phone's camera** — QR scanning to find any block instantly.
- **PDF / Excel / CSV export** — GST invoices, gate passes, QR labels, and report/data exports.
- **3D / WebGL** — the interactive public showroom.
- **On-device storage** — the offline outbox that keeps the shop floor working.

Full detail is in [Integrations](10_Integrations.md).

### Does it connect to Tally or other accounting software?
Not directly, today. ✅ But ShilaTeq produces GST-compliant invoices and exports clean **Excel/CSV** files, so your accountant can bring the numbers into any package. A direct **Tally/Zoho** connector is a high-priority roadmap item. 💡

### Can it send automatic WhatsApp messages or emails?
ShilaTeq **composes** ready-to-send WhatsApp messages that a user sends with a tap — this keeps messaging free and instant. ✅ Fully **automated, unattended** messaging (via the WhatsApp Business API) and **email** are roadmap items; there's no email/SMS provider integrated today. 💡

### Does it generate e-invoices or e-way bills?
Not yet. ✅ It generates GST tax invoices and gate passes today. Government **e-invoicing (IRN)** and **e-way-bill** API integration is a roadmap item aimed at larger yards. 💡

---

## 🧭 Support & Roadmap

### What's on the roadmap?
Highlights (full detail and prioritization in [Product Opportunities](12_Product_Opportunities.md)): 💡
- **Near-term:** complete the automatic audit trail, wire up the remaining showroom components, polish the installable app experience, finish security hardening.
- **Next:** automated WhatsApp payment reminders, optional online/UPI payment collection, accounting-software (Tally) sync, owner self-signup.
- **Later:** multi-yard organisation rollups, an **AI stone classifier** that tags blocks from a photo, demand forecasting and assisted pricing, AR "view in my space" in the showroom, and a buyer-side marketplace.

### Is ShilaTeq still being actively developed?
Yes — it's a live product that has already grown well past its original MVP scope, with a clear, prioritized roadmap. ✅

### How do I evaluate it before committing?
Start with **demo mode** — the entire product runs in the browser with realistic sample data and a reset button, so you (and your staff) can explore every workflow risk-free before onboarding a real yard. ✅

### Where can I learn more about a specific area?
Use this documentation hub: ✅
- [Product Overview](01_Product_Overview.md) — the guided, end-to-end tour.
- [Features](02_Features.md) / [Modules](03_Modules.md) — everything the product does.
- [User Roles](04_User_Roles.md) / [User Journeys](05_User_Journeys.md) — who does what.
- [Business Workflows](07_Business_Workflows.md) — how core processes flow.
- [Integrations](10_Integrations.md) · [Product Strengths](11_Product_Strengths.md) · [Product Opportunities](12_Product_Opportunities.md).

---

> **💡 A note on honesty:** This FAQ deliberately states current limitations — no native app yet, no online payment gateway, admin-side offline still coming, audit-log auto-population in progress. We'd rather set accurate expectations than oversell. Every limitation here is paired with a clear reason and a roadmap path.

---

*Part of the **ShilaTeq (StoneX) Product Documentation Hub** — the operating system for stone yards.*
