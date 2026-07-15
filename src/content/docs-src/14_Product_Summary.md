# 🪨 Product Summary — ShilaTeq (StoneX)

> The executive close: what ShilaTeq is, who it serves, the impact it delivers, and where it's headed — a leave-behind for stakeholders, investors, and decision-makers.

[← Back to Documentation Hub](README.md)

---

## 📋 Product Overview

**ShilaTeq (StoneX)** is the **operating system for stone yards** — a mobile-first, multi-tenant ERP purpose-built for the businesses that quarry, cut, and trade dimensional stone. It gives every stone block a permanent, QR-coded digital identity the moment it arrives, and from there runs the entire business: procurement, cutting, quotations, orders, GST invoices, dispatch, payments, payroll, and a public 3D showroom that turns web visitors into leads.

Unlike paper registers, spreadsheets, or generic accounting software, ShilaTeq is engineered for the **physics and economics of stone** — volumetric pricing, cutting recovery and wastage, block-and-slab lifecycles, carrying cost, and Indian GST — and for the **reality of the shop floor**: cheap Android phones, patchy connectivity, and a low-literacy, Hindi-speaking workforce. It works on any phone, in English or Hindi, and keeps working when the internet doesn't.

ShilaTeq is a **live production platform** that has evolved well beyond its original MVP scope. It is India-native by design — rupee currency, GST (CGST/SGST/IGST), HSN 6802, and WhatsApp as the messaging layer are all first-class.

> **In one line:** ShilaTeq lets a yard owner run a multi-crore business on evidence instead of memory — seeing exactly what they own, what it cost, who owes them, and what it's worth.

## 👥 Target Audience

ShilaTeq is built for the people who touch a stone yard every day, and sold to the owner who runs it.

| Audience | Who they are | Why ShilaTeq matters to them |
|---|---|---|
| **Yard Owners / Admins** | Family-run stone-yard proprietors | Full, real-time visibility of stock, cash, margin, and staff in one place |
| **Supervisors / Managers** | The operational drivers of the yard | One connected flow for quotes, orders, payments, and dispatch |
| **Shop-floor Workers / Cutters** | Phone-only, low-literacy, Hindi-first | Simple, offline, bilingual screens to log real work and see their pay |
| **Drivers** | Workers assigned to deliveries | A focused view of just their deliveries, with clear next steps |
| **Prospective Buyers** | Web visitors browsing for stone | An always-on 3D showroom and a one-tap path to request a quote |

**Market fit:** small-to-mid, family-run stone yards, processors, and traders across India's stone belts — **Rajasthan and Gujarat** especially — with natural adjacency to tiles, engineered stone, and export processors. 💡 *Inferred: the addressable market spans thousands of such yards, most running on near-zero software today.*

See [User Roles](04_User_Roles.md) for the complete permissions matrix.

## 🧩 Core Modules

ShilaTeq is organised into a set of connected business modules. Each is documented in full in [Modules](03_Modules.md).

- 📦 **Inventory & Identity** — QR-coded blocks and slabs, tagging, aging, carrying cost, typo-tolerant search.
- 🪚 **Manufacturing** — the partial-cut engine: recovery %, wastage, remnants, and an immutable cut ledger.
- 🛒 **Sales** — leads, quotations, orders with credit gates and atomic reservation, and returns/RMA.
- 🚚 **Procurement** — suppliers, purchase orders, receive-to-blocks intake, and payables.
- 💰 **Finance** — payments, store-credit ledger, credit limits, unified ledger, expenses, and GST invoices.
- 👷 **Workforce** — worker provisioning, attendance with wage snapshots, payroll, advances, and piece-rate cutting.
- 🧾 **Logistics** — dispatch, gate passes, driver deliveries, public tracking, and delivery-to-sold reconciliation.
- 🖥️ **Public Showroom** — the per-yard 3D catalog with price gating and lead capture.
- 📊 **Reporting & BI** — dashboard KPIs, five-tab analytics, and multi-format exports.

## ⭐ Major Features

A snapshot of the signature capabilities — the full catalog lives in [Features](02_Features.md).

| Feature | Why it stands out |
|---|---|
| **QR digital identity** | Every block findable in seconds from any phone; camera QR scanning built in |
| **Partial-cut engine** | Recovery %, wastage, remnant blocks, and recovery-adjusted slab costing — yield that no paper ledger captures |
| **Offline-first worker app** | An outbox that queues shop-floor work with no signal and syncs safely, never double-counting |
| **Public 3D showroom** | A WebGL catalog per yard that gracefully degrades and doubles as a lead funnel |
| **Bilingual EN/हिंदी UX** | Icon- and number-first screens designed for a low-literacy workforce |
| **India-native commerce** | GST splits, HSN codes, rupee amounts in words, one-tap invoices and gate passes |
| **Financial depth** | Store credit, credit-limit gates, receivables aging, DSO, and sale-time COGS snapshots |
| **WhatsApp messaging** | Zero-setup deep links for quotes, invoices, dispatch, lead replies, and payment reminders |
| **Live sync + realtime** | Multi-tenant isolation with event-driven refresh so every screen stays current |
| **Zero-infra demo mode** | The whole product runs in a browser with realistic data — instant demos, no setup |

## 📈 Business Impact

ShilaTeq is designed to move the numbers a yard owner actually cares about. The mechanisms below are **✅ Confirmed** capabilities; the magnitudes are **💡 Inferred / illustrative**.

| Business outcome | How ShilaTeq drives it | Confidence |
|---|---|---|
| **Faster quotes, recovered labour** | Find any block in seconds instead of hours via QR + typo-tolerant search | ✅ Mechanism / 💡 magnitude |
| **Protected margin** | Recovery-adjusted costing + sale-time COGS make wastage and true cost visible | ✅ Mechanism / 💡 magnitude |
| **Less dead capital** | Aging buckets and carrying-cost alerts surface slow movers early | ✅ Mechanism / 💡 magnitude |
| **Lower credit losses** | Credit-limit gates, payment gating, and a store-credit ledger contain exposure | ✅ Mechanism / 💡 magnitude |
| **More inbound demand** | An always-on public showroom converts web visitors into leads | ✅ Mechanism / 💡 magnitude |
| **Compliance made easy** | One-tap GST invoices and gate passes reduce clerical time and error | ✅ Mechanism / 💡 magnitude |
| **Reliable shop-floor throughput** | Offline-first, bilingual worker app keeps work flowing without signal or literacy barriers | ✅ Mechanism / 💡 magnitude |

> **💡 Note on figures:** ShilaTeq's documentation deliberately avoids inventing specific ROI percentages or price points. The *capabilities* that produce these outcomes are confirmed in the product; the *size* of the gain will vary by yard. See [Reports & Analytics](08_Reports_and_Analytics.md) for the metrics ShilaTeq surfaces to quantify impact in each yard's own numbers.

## 🎁 Customer Benefits

For the people who use it every day, ShilaTeq delivers benefits that are felt immediately:

- **For owners** — a single screen that tells the truth about stock, cash, margin, and staff; the end of running a high-value business from memory and paper.
- **For supervisors** — one connected flow instead of scattered ledgers, WhatsApp threads, and mental math; quotes to dispatch without leaving the app.
- **For workers** — screens they can actually use, in their language, that keep working offline and let them see their own earnings and request advances.
- **For drivers** — a focused, unambiguous view of just their deliveries.
- **For buyers** — a real online presence to browse, and a frictionless way to ask for a price.

> **💡 Tip for evaluators:** the fastest way to feel the benefit is the built-in demo mode — the full product, realistic data, zero setup. See the [Product Overview](01_Product_Overview.md) for a guided walkthrough.

## 🏆 Why Organizations Should Choose ShilaTeq

ShilaTeq wins on the things a horizontal ERP or a spreadsheet simply cannot match:

1. **Domain depth that can't be faked.** ShilaTeq models the stone itself — blocks, cutting, slabs, remnants, recovery, carrying cost — not a generic product. This is the hardest capability for any general-purpose tool to replicate.
2. **Built for the real environment.** Offline-first, mobile-first, and bilingual by design — engineered for spotty yard Wi-Fi, cheap Android phones, and a Hindi-speaking workforce, not a clean office.
3. **Financial integrity end to end.** Payment gating, credit limits, store-credit ledgers, payment caps, and honest COGS snapshots protect the yard's money at every step — and refuse to fabricate a margin when cost is unknown.
4. **India-native, not localised as an afterthought.** GST logic, HSN codes, rupee amounts in words, and WhatsApp messaging are core, not add-ons.
5. **A growth engine, not just a system of record.** The public 3D showroom turns the platform into a lead funnel every yard gets for free.
6. **Honest and transparent.** ShilaTeq is candid about its boundaries — manual payment recording, WhatsApp-based messaging, web-first (PWA-installable) delivery — so buyers know exactly what they're getting. See [Product Opportunities](12_Product_Opportunities.md) for the honest roadmap.

> **The strategic case:** ShilaTeq is the first platform to treat the stone yard as a first-class business to be run, not a generic warehouse to be inventoried. For the full competitive breakdown, see [Product Strengths](11_Product_Strengths.md).

## 🔮 Future Vision

ShilaTeq's north star is to become **the operating system for the entire dimensional-stone trade** — the single source of truth for every block, cut, rupee, and customer across India's stone economy and beyond. Building toward that, the natural horizons include: 💡 *Inferred / directional*

- **Deeper financial rails** — an integrated online payment gateway to complement today's manual recording, and richer receivables automation.
- **A native mobile experience** — extending the installable, offline-capable web app toward first-class native apps for the shop floor.
- **Broader reach across the value chain** — from quarry-side intake through export processors, tiles, and engineered stone.
- **Multi-yard and group rollups** — richer org-level consolidation for owners running more than one yard.
- **Stronger notification channels** — email and richer messaging alongside the existing WhatsApp and in-app layers.
- **Deeper intelligence** — turning the platform's rich operational data into predictive insight on aging, pricing, and demand.

Each of these builds on a foundation already in production. The vision isn't a pivot — it's the same mission, extended: give every stone block a permanent digital identity, and let every yard run its entire business from any phone, even offline, in its own language.

> **The closing thought:** the stone trade has waited a long time for software that understands it. ShilaTeq is that software — live today, honest about its edges, and pointed squarely at becoming the industry's default operating system.

---

*Part of the **ShilaTeq (StoneX) Product Documentation Hub** — the operating system for stone yards. Return to the [Documentation Hub](README.md).*
