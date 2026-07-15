# ShilaTeq (StoneX) — Feature Catalogue

> The complete, forensic inventory of everything ShilaTeq does — every admin, worker, public, and hidden capability, grouped by domain and documented against a single consistent template.

[← Back to Documentation Hub](README.md)

---

## How to read this document

ShilaTeq (StoneX) is the operating system for stone yards. It gives every stone block a QR-coded digital identity the moment it arrives and then runs the entire business on top of it — procurement, cutting, quotations, orders, GST invoices, dispatch, payments, payroll, and a public 3D showroom that turns web visitors into leads. It works on any phone, in English or Hindi, and keeps working when the internet doesn't.

This document catalogues **every feature** in the platform. Features are grouped into **17 functional domains**. Each feature follows the same template so you can scan or compare quickly:

> **Overview · Purpose · Business Value · User Benefits · Typical Use Cases · Who Uses It · Where It Appears · Inputs · Outputs · Related Features · Important Business Rules · Limitations · Future Enhancement Ideas**

**Confidence tags** appear where claims matter:
- **✅ Confirmed** — directly supported by the platform's behavior.
- **💡 Inferred** — a reasonable conclusion drawn from how the product works (e.g., ROI framing, market fit).

Related sibling docs referenced throughout: [Modules](03_Modules.md) · [User Roles](04_User_Roles.md) · [User Journeys](05_User_Journeys.md) · [Screens & Pages](06_Screens_and_Pages.md) · [Business Workflows](07_Business_Workflows.md) · [Reports & Analytics](08_Reports_and_Analytics.md) · [Notifications](09_Notifications.md).

---

## Feature domains at a glance

| # | Domain | Headline capabilities |
|---|--------|----------------------|
| 1 | 📊 Dashboard & Alerts | Command dashboard, smart alerts, action cards |
| 2 | 📦 Inventory & Block Identity | QR identity, tagging wizard, block/slab registers, carrying cost |
| 3 | 🔍 Search & Discovery | Typo-tolerant finder, camera QR scan, quick-nav palette |
| 4 | 🏭 Cutting & Manufacturing | Partial-cut engine, recovery %, remnants, cut ledger |
| 5 | 🛒 Quotations & Orders | Quote wizard, order pipeline, reservations, payment gates |
| 6 | 💳 Payments, Credit & Invoicing | Payments, store credit, credit limits, GST invoices |
| 7 | 🚚 Dispatch & Delivery | Gate passes, driver app, public tracking, reconciliation |
| 8 | ↩️ Returns & Write-offs | RMA engine, damage log |
| 9 | 🛍️ Public 3D Showroom & Leads | WebGL catalog, price gating, lead capture, sharing |
| 10 | 🏗️ Procurement | Suppliers, purchase orders, receive-to-blocks |
| 11 | 👷 Workforce, Attendance & Payroll | Worker app, attendance, wages, advances, bilingual UX |
| 12 | 💰 Finance, Expenses & Ledger | Unified ledger, cashbook, reminders |
| 13 | 📈 Reports & Analytics | 5-tab BI, exports, plain-language insights |
| 14 | 🔔 Notifications & Messaging | Alerts bell, WhatsApp layer, toasts |
| 15 | 📴 Offline & Sync | Outbox engine, live sync, sync UI |
| 16 | ⚙️ Settings & Administration | Yard config, activity log, demo reset, print suite |
| 17 | 🔐 Security & Multi-tenancy | Tenant isolation, roles, worker auth |

---

# 📊 1. Dashboard & Alerts

## Business Command Dashboard

### Overview
The owner/manager landing screen — a single glance at the health of the whole yard: key metrics, money at risk, work waiting to be done, and one-tap "action cards" that jump straight into the task that needs attention. **✅ Confirmed**

### Purpose
Replace the mental juggling of "what needs my attention today?" with a curated, always-current operating picture so nothing important slips.

### Business Value
- Turns scattered signals (unpaid orders, aging stock, unmarked attendance, ready-to-ship jobs) into a prioritized to-do list.
- Shortens the daily "management round" from a walk through registers and WhatsApp to a single screen.
- Surfaces revenue, receivables, and stock value without opening a report.

### User Benefits
- Immediate situational awareness on login.
- Action cards remove navigation friction — the dashboard tells you *and* takes you there.
- Live figures (no manual refresh) thanks to event-driven sync.

### Typical Use Cases
- Morning check: what's overdue, what's ready to dispatch, who hasn't been marked present.
- Mid-day pulse: today's sales, cash position, low-stock nudges.
- Owner drop-in: quick confidence read without training.

### Who Uses It
Admin / Owner and Supervisor. Landing page for all admin logins.

### Where It Appears
`/dashboard` (admin home). See [Screens & Pages](06_Screens_and_Pages.md).

### Inputs
Live business data across blocks, orders, purchase orders, leads, attendance, and receivables (read automatically).

### Outputs
KPI tiles, a ranked alert feed, and deep-link action cards.

### Related Features
Smart Alerts & Action Cards · Notifications Bell · [Reports & Analytics](08_Reports_and_Analytics.md).

### Important Business Rules
- Figures reflect the current yard only (multi-tenant scoped).
- Numbers update via live sync after any relevant change — no stale caches on-screen.

### Limitations
- Single-yard view; cross-yard/org roll-ups are limited. **✅ Confirmed**

### Future Enhancement Ideas
Configurable tile layout, target-vs-actual goals, week-over-week trend chips on each KPI.

---

## Smart Alerts & Action Cards

### Overview
A dedicated dashboard alerts engine that scans the business for conditions needing action — overdue receivables (>30 days), orders ready to dispatch, unmarked attendance, wages payable, stale reservations, low stock, write-offs — and renders them as ranked, tappable cards. This is one of **two independent alert engines** in the platform (the other powers the header bell). **✅ Confirmed**

### Purpose
Convert "you should probably check…" into explicit, clickable prompts so operational debt never accumulates silently.

### Business Value
- Money doesn't sit uncollected because an overdue-AR alert nags until cleared.
- Finished orders don't wait on the floor because a "ready to dispatch" card is visible.
- Payroll and attendance stay current because "unmarked attendance" surfaces daily.

### User Benefits
- Prioritized by severity, so the most urgent items rise to the top.
- Each alert is actionable — tapping navigates to the exact record.

### Typical Use Cases
- Chasing a customer whose payment crossed 30 days.
- Dispatching an order that's paid and processed but not yet shipped.
- Marking today's attendance before it's forgotten.

### Who Uses It
Admin / Owner and Supervisor.

### Where It Appears
`/dashboard`. A parallel, differently-tuned engine feeds the [Notifications Bell](#notifications-bell) in the header.

### Inputs
Receivables aging, order/dispatch states, attendance status, reservation age, stock levels, damage log.

### Outputs
Severity-ranked alert cards with counts and navigation targets.

### Related Features
Notifications Bell · Business Command Dashboard · Customer History & Receivables · Attendance Register.

### Important Business Rules
- Aging thresholds and severity respect yard settings (amber/red day thresholds).
- Two engines exist by design — dashboard cards and the header bell draw from overlapping but independently computed signal sets. **✅ Confirmed**

### Limitations
- Alert rules are curated, not user-authored — you can't yet define custom alert conditions. **💡 Inferred**

### Future Enhancement Ideas
User-defined alert rules, snooze/dismiss with memory, push/WhatsApp escalation for critical alerts.

---

# 📦 2. Inventory & Block Identity

## QR Digital Block Identity

### Overview
The platform's foundational idea: **every block gets a permanent QR-coded digital identity** the moment it enters the yard. Scan the QR (or open its link) and you get the block's full record — grade, dimensions, origin, status, and location — instead of a chalk mark and someone's memory. **✅ Confirmed**

### Purpose
Give each physical stone a durable, machine-readable identity so it can be found, tracked, quoted, cut, and sold without ambiguity.

### Business Value
- Eliminates "which block was that?" errors that cost time and margin.
- Makes the yard auditable — every block's history is attached to it.
- Enables instant lookups, public share cards, and label printing.

### User Benefits
- Owners/staff find any block in seconds.
- Customers can view a safe, public identity card for a block via its QR.
- Workers identify stock by scanning, not by reading codes.

### Typical Use Cases
- Physical stock-take by walking the yard scanning blocks.
- Sharing a specific block with a buyer via its public QR card.
- Printing a durable label to affix to the block.

### Who Uses It
Everyone — Admin, Worker, and Public (via the safe QR card).

### Where It Appears
Minted at tagging and on PO receive; visible on block detail, in the inventory QR modal, on printed labels, and via the public `/qr/:qrCodeId` card.

### Inputs
Block record (generated identity assigned automatically).

### Outputs
A unique QR identifier and scannable code; a public identity URL; a printable label.

### Related Features
Block Tagging Wizard · Public QR Block Card · Camera QR Scanning · Block QR Label Printing.

### Important Business Rules
- The public QR card exposes **safe fields only** — no purchase price, supplier, or margin. **✅ Confirmed**
- QR lookups go through a narrow, purpose-built public read path (no broad public table access). **✅ Confirmed**

### Limitations
- QR is per-block; slabs are identified by derived slab codes rather than their own printed QR labels. **💡 Inferred**

### Future Enhancement Ideas
Per-slab QR labels, NFC tags for harsh outdoor conditions, scan-history trail per block.

---

## Block Inventory Directory

### Overview
The master register of every block in the yard — a filterable, sortable directory with mobile card views, CSV export, per-block QR access, and one-click catalog sharing. **✅ Confirmed**

### Purpose
Provide the single source of truth for "what stone do we have right now?" with fast filtering and drill-down.

### Business Value
- Replaces paper stock registers with a searchable, always-current list.
- Supports quick answers to buyer enquiries ("do you have X variety?").
- CSV export feeds accountants, auditors, and spreadsheets.

### User Benefits
- Six filters (type, variety, status, and more) narrow large yards fast.
- Optimized lists load quickly even with photo-heavy inventory (images are kept out of list payloads).
- Tap through to full block detail.

### Typical Use Cases
- Filtering to available granite blocks to answer a quote.
- Exporting current stock for a monthly audit.
- Sharing an available block to the public catalog.

### Who Uses It
Admin / Owner and Supervisor.

### Where It Appears
`/inventory`.

### Inputs
Filter selections, search terms.

### Outputs
Filtered block rows, CSV file, QR modal, catalog share link.

### Related Features
QR Digital Block Identity · Slab Inventory · Typo-Tolerant Stone Finder · Catalog Sharing · Inventory Analytics.

### Important Business Rules
- Reserved, cut, sold, and damaged blocks are labeled by status; damaged stock is excluded from sellable selectors elsewhere. **✅ Confirmed**
- CSV export is hardened against spreadsheet formula injection and ships a UTF-8 BOM so ₹ renders correctly in Excel. **✅ Confirmed**

### Limitations
- One warehouse/zone view per yard. **✅ Confirmed**

### Future Enhancement Ideas
Saved filter presets, bulk actions, map/zone visual layout of the yard.

---

## Block Tagging Wizard

### Overview
A guided **3-stage intake wizard** for adding a new block: details, photos (up to 5, auto-downscaled), and QR minting. It enforces the fields a block needs to be a first-class record and includes a hidden Hindi worker mode. **✅ Confirmed**

### Purpose
Standardize how blocks enter the system so every block is complete, photographed, and QR-identified from day one.

### Business Value
- Clean data at the source prevents downstream costing and search failures.
- Photos make remote quoting and the public showroom possible.
- Downscaling keeps the app fast and storage cheap.

### User Benefits
- Step-by-step flow reduces errors and training time.
- Required-field validation before submit.
- Workers can tag stock without needing to set prices (pricing is the admin's job).

### Typical Use Cases
- Tagging a newly quarried or purchased block.
- Photographing stock for the online showroom.
- Shop-floor staff logging arrivals in Hindi.

### Who Uses It
Admin / Owner (full flow, price required). Worker tagging is supported (price optional). **✅ Confirmed**

### Where It Appears
`/inventory/add`.

### Inputs
12 required block fields (type, variety, dimensions, quantity, grade, origin, etc.), up to 5 photos, and — for admins — a selling price.

### Outputs
A new block record with a minted QR identity, downscaled photos, and a tagged timestamp.

### Related Features
QR Digital Block Identity · PO Receive → Block Intake (the automated alternative) · Bilingual Worker Experience.

### Important Business Rules
- **Selling price is required for admins, optional for workers** — a deliberate division of labor. **✅ Confirmed**
- Photos are canvas-downscaled to roughly 150 KB before storage. **✅ Confirmed**

### Limitations
- The built-in Hindi worker tagging mode exists but its route is currently admin-only, so it's effectively unreachable for pure workers today (a latent capability). **✅ Confirmed**

### Future Enhancement Ideas
Unlock the worker-facing tagging route, barcode/quarry-slip import, voice-assisted field entry.

---

## Block Detail & Carrying Cost

### Overview
The full profile of a single block: photo gallery, dimensions, status, live carrying-cost, per-slab margin readouts, and the entry points to cut it into slabs or mark it damaged. **✅ Confirmed**

### Purpose
Give a complete, decision-ready view of one block, including how much it's costing to hold and what it's worth cut up.

### Business Value
- Carrying cost makes the true cost of slow-moving stock visible, nudging price cuts or promotion.
- Cut-to-slabs and damage actions live where the context is.

### User Benefits
- One screen for everything about a block.
- Margin math done for you (recovery-adjusted, null-safe).

### Typical Use Cases
- Deciding whether to hold, discount, or cut a block.
- Reviewing aging cost before quoting.
- Initiating a full cut or writing off a damaged block.

### Who Uses It
Admin / Owner and Supervisor.

### Where It Appears
`/inventory/:id`.

### Inputs
Block identifier; configured carrying-cost rate and aging thresholds from Settings.

### Outputs
Block profile, carrying-cost figure, margin readouts, cut/damage actions.

### Related Features
Admin Full-Cut · Partial-Cut Engine · Inventory Analytics · Damage & Write-off Log · Yard Settings.

### Important Business Rules
- Carrying cost is a simple annualized model (purchase value × rate% × days ÷ 365), **report-only — never folded into COGS**. **✅ Confirmed**
- Unknown cost surfaces as N/A, never as a fake 100% margin. **✅ Confirmed**

### Limitations
- Carrying cost is annualized-simple, not compounding or tiered. **💡 Inferred**

### Future Enhancement Ideas
Suggested reprice based on aging, side-by-side "hold vs cut" profitability preview.

---

## Slab Inventory

### Overview
The register of slabs produced by cutting blocks — with inline, optimistic status changes and recovery-adjusted costing carried from the cut. **✅ Confirmed**

### Purpose
Track finished/processed slab stock separately from raw blocks, each with its own status and cost basis.

### Business Value
- Slabs are the primary sellable unit for processors; managing them cleanly protects margin.
- Recovery-adjusted cost means wastage is reflected in each slab's true unit cost.

### User Benefits
- Quick inline status toggles (available/reserved/sold/damaged) with instant UI feedback.
- Accurate per-slab margins.

### Typical Use Cases
- Managing slab stock after gangsaw cutting.
- Reserving or selling individual slabs.
- Marking a slab damaged.

### Who Uses It
Admin / Owner and Supervisor.

### Where It Appears
`/slabs`.

### Inputs
Slab status changes; slabs are created by the cutting engines.

### Outputs
Updated slab statuses; slab cost basis for costing and reports.

### Related Features
Partial-Cut Engine · Recovery-Adjusted Slab Costing · Quotation Wizard · Order Creation Wizard.

### Important Business Rules
- A slab's material cost per sqft is spread over **actual output area**, so wastage raises unit cost. **✅ Confirmed**
- Damaged slabs never return to the available pool. **✅ Confirmed**

### Limitations
- Slabs don't currently carry their own printed QR labels. **💡 Inferred**

### Future Enhancement Ideas
Slab bundling, grade-based auto-pricing, slab-level photos in the catalog.

---

## Per-Block Inventory Analytics

### Overview
Lifetime profit-and-loss per block and aging analysis across the yard — how much each block cost to hold, what it earned, and which stock is going stale. **✅ Confirmed**

### Purpose
Answer "which stock makes money and which is dead weight?" at the individual-block level.

### Business Value
- Identifies capital tied up in aging inventory.
- Reveals per-block profitability to inform buying and pricing.

### User Benefits
- Aging buckets highlight slow movers.
- Lifetime P&L per block, computed for you.

### Typical Use Cases
- Quarterly review of stock performance.
- Spotting blocks past the red aging threshold for clearance.
- Informing the next procurement round.

### Who Uses It
Admin / Owner.

### Where It Appears
`/inventory/analytics`.

### Inputs
Block cost/holding data; aging thresholds from Settings.

### Outputs
Per-block P&L, aging bucket distribution.

### Related Features
Block Detail & Carrying Cost · Reports & Analytics · Yard Settings.

### Important Business Rules
- Aging bands use the yard's amber/red day thresholds (defaults amber 90d / red 180d). **✅ Confirmed**

### Limitations
- Analytics are per-block and per-yard; portfolio/segment roll-ups live in Reports. **💡 Inferred**

### Future Enhancement Ideas
Predicted days-to-sell, ABC inventory classification, reorder recommendations.

---

## Public QR Block Card

### Overview
A login-free, safe public identity card for a single block, opened by scanning its QR or following its link — showing the stone's presentable details without exposing any commercial secrets. **✅ Confirmed**

### Purpose
Let a yard share a specific block with a buyer or visitor confidently, knowing sensitive data stays hidden.

### Business Value
- A block QR on a business card, WhatsApp, or the physical stone becomes a shareable sales asset.
- No risk of leaking cost, supplier, or margin.

### User Benefits
- Buyers see a clean, branded stone card instantly, no app or login.
- Owners share with confidence.

### Typical Use Cases
- A buyer scans the label on a block in the yard.
- A salesperson shares a block link over WhatsApp.

### Who Uses It
Public / Guest (no session). Generated by Admin.

### Where It Appears
`/qr/:qrCodeId`.

### Inputs
QR identifier (from scan or link).

### Outputs
A safe, read-only block card.

### Related Features
QR Digital Block Identity · Camera QR Scanning · Public 3D Showroom Catalog.

### Important Business Rules
- Public reads are served by a narrow, safe-columns-only path — a direct consequence of an early data-leak fix. No broad anonymous table access exists. **✅ Confirmed**

### Limitations
- Shows presentable fields only, by design.

### Future Enhancement Ideas
"Request a quote" button directly on the card, related-stone suggestions.

---

## Block QR Label Printing

### Overview
A self-contained printer that produces an 80×110 mm QR label for a block — ready to affix to the physical stone. Part of the platform's four-printer print suite. **✅ Confirmed**

### Purpose
Bridge the digital identity to the physical block with a durable, scannable tag.

### Business Value
- Makes the QR identity usable in the yard, not just on screen.
- Zero external dependencies — prints from any browser.

### User Benefits
- One click to a print-ready label.
- Consistent, legible tags across all stock.

### Typical Use Cases
- Labeling newly tagged or received blocks.
- Re-printing a lost or weathered label.

### Who Uses It
Admin / Owner and Supervisor.

### Where It Appears
Block detail / inventory QR modal, via the print suite.

### Inputs
Block record and its QR identity.

### Outputs
A print-ready 80×110 mm QR label (opens in a print popup, leaving the app untouched).

### Related Features
QR Digital Block Identity · Print Suite · Public QR Block Card.

### Important Business Rules
- Printing happens in an isolated popup so the app's interface is never disturbed. **✅ Confirmed**

### Limitations
- Fixed label size; no batch/sheet printing of many labels at once. **💡 Inferred**

### Future Enhancement Ideas
Batch label sheets, configurable label sizes, thermal-printer presets.

---

# 🔍 3. Search & Discovery

## Typo-Tolerant Stone Finder

### Overview
A unified finder that locates any block or slab across code, variety, type, color, supplier, QR, and location — with hand-built fuzzy matching that tolerates typos on names but **never** on codes. Powers admin find, worker find, and the public showroom search. **✅ Confirmed**

### Purpose
Make "find the stone" effortless even with misspellings, partial words, or messy handwriting-derived queries.

### Business Value
- Faster answers to buyers; less time hunting stock.
- Fewer wrong-block mistakes because codes are matched exactly.

### User Benefits
- Multi-word search that ANDs terms for precision.
- Forgiving on names ("marbel" finds "marble"), strict on identifiers.
- Same experience for admins, workers, and public visitors.

### Typical Use Cases
- Admin answering a phone enquiry ("Kishangarh white, ~2×3 ft?").
- Worker locating a block to cut.
- Public visitor searching the showroom.

### Who Uses It
Admin, Worker, and Public.

### Where It Appears
`/find` (admin), `/worker/find` (worker), and the public catalog Showcase.

### Inputs
Free-text search query.

### Outputs
Relevance-weighted list of matching blocks and slabs.

### Related Features
Block Inventory Directory · Slab Inventory · Public 3D Showroom Catalog · Command Palette.

### Important Business Rules
- Fuzzy matching (edit distance ≤ 1) applies only to name words ≥ 4 characters **with no digits** — so `KSH-B0002` can never fuzzy-match `KSH-B0001`. **✅ Confirmed**
- Codes and QR digits are matched exactly, always. **✅ Confirmed**

### Limitations
- Single-character tolerance only; larger typos won't match. **💡 Inferred**

### Future Enhancement Ideas
Synonym/color-family search, voice search, photo-similarity search.

---

## Camera QR Scanning

### Overview
An in-app camera scanner that reads block QR codes using the device's native barcode detection, with a canvas-based fallback for browsers that lack it, plus a manual-paste escape hatch. **✅ Confirmed**

### Purpose
Turn any phone into a yard scanner so staff identify stock by pointing the camera, not by typing codes.

### Business Value
- Speeds stock-takes and floor lookups dramatically.
- Works across browsers thanks to the fallback path.

### User Benefits
- Rear-camera preference for comfortable scanning.
- Robust: native detection where available, image-decode fallback elsewhere, manual paste as last resort.
- Accepts both full QR URLs and bare identifiers.

### Typical Use Cases
- Scanning a block to open its record.
- Physical inventory counts.
- Verifying the right block before cutting or dispatch.

### Who Uses It
Admin and Worker.

### Where It Appears
`/scan` (admin+worker), and the worker scanning flow.

### Inputs
Camera stream or pasted QR value.

### Outputs
The identified block's record/card.

### Related Features
QR Digital Block Identity · Public QR Block Card · Typo-Tolerant Stone Finder.

### Important Business Rules
- The scanner tolerates both full URLs and bare IDs when extracting the identifier. **✅ Confirmed**

### Limitations
- Camera access depends on browser permissions and HTTPS. **💡 Inferred**

### Future Enhancement Ideas
Continuous multi-scan mode for bulk counts, offline scan queue, torch/flash toggle.

---

## Command Palette (Quick Navigation)

### Overview
A keyboard-driven quick-launcher (⌘K / Ctrl-K style) for jumping between screens and records using fuzzy navigation search — a power-user accelerator distinct from inventory search. **✅ Confirmed**

### Purpose
Let frequent users move around the app at speed without hunting through menus.

### Business Value
- Reduces clicks-per-task for power users (supervisors, owners).
- Lowers the learning curve for navigation.

### User Benefits
- Fast, fuzzy jump-to-anything.
- Keyboard-first workflow.

### Typical Use Cases
- Jumping straight to Orders, Finance, or a specific screen.
- Rapid context switching during a busy day.

### Who Uses It
Admin / Owner and Supervisor (desktop-oriented).

### Where It Appears
Global, within the admin app shell.

### Inputs
Typed navigation query.

### Outputs
A ranked list of destinations to jump to.

### Related Features
Typo-Tolerant Stone Finder (a separate, inventory-specific mechanism) · Business Command Dashboard.

### Important Business Rules
- Navigation search uses a general-purpose fuzzy library, **separate from** the bespoke inventory search engine. **✅ Confirmed**

### Limitations
- Optimized for navigation; not a substitute for deep inventory search. **💡 Inferred**

### Future Enhancement Ideas
Command actions (create order, record payment) directly from the palette, recent-items memory.

---

# 🏭 4. Cutting & Manufacturing

## Partial-Cut (Gangsaw) Engine

### Overview
The manufacturing heart of ShilaTeq: a worker enters how much of a block was consumed and the slabs produced, and the platform computes recovery %, wastage, remnant, and recovery-adjusted slab costs — atomically, offline-safe, and idempotent. **✅ Confirmed**

### Purpose
Capture the real economics of cutting a block into slabs on a gangsaw, including the material lost as wastage and the leftover that becomes a new sellable block.

### Business Value
- True yield visibility (recovery %) exposes cutting efficiency and waste.
- Wastage is correctly priced into surviving slabs, protecting margin.
- Leftover stone isn't lost — it becomes an instantly quotable remnant block.

### User Benefits
- Simple worker input (consumed area + slab rows); the math is automatic.
- Pricing is hidden from the worker — they log output, not money.
- Guardrails prevent impossible entries.

### Typical Use Cases
- Cutting a raw block into slabs on the gangsaw.
- Recording a partial cut where the block isn't fully consumed.
- Logging cutting output from a phone on the shop floor, even offline.

### Who Uses It
Worker (primary). Admins can also perform a legacy full-cut from block detail.

### Where It Appears
`/worker/cut/:id`.

### Inputs
Consumed area (prefilled with the block's remaining area) and N slab rows (length × width, thickness, finish, grade).

### Outputs
Newly minted slabs, an immutable cut-event ledger row, an optional remnant block, and the parent block closed as "cut."

### Related Features
Recovery-Adjusted Slab Costing · Immutable Cut-Event Ledger · Remnant Block Recovery · Offline Outbox Engine · Slab Inventory.

### Important Business Rules
- Block must be available to cut; the engine rejects consuming more than remains, or producing more output area than was consumed. **✅ Confirmed**
- **Recovery % = output area ÷ consumed area × 100.** Wastage = consumed − output. **✅ Confirmed**
- The parent block always closes (status "cut", zero remaining) — the remainder *is* the remnant, not a partially-open parent. **✅ Confirmed**
- Idempotent by a per-block cut key: an offline replay or double-tap can never cut the same block twice. **✅ Confirmed**

### Limitations
- One consumed-input cut per action; complex multi-block batching isn't modeled. **💡 Inferred**

### Future Enhancement Ideas
Blade/consumable cost capture, cutting-time logging for machine utilization, defect-at-cut tagging.

---

## Recovery-Adjusted Slab Costing

### Overview
The costing rule that spreads a block's total material cost across the **actual slab output area**, so cutting wastage automatically raises the per-sqft cost of the surviving slabs — yielding true, honest slab economics. **✅ Confirmed**

### Purpose
Ensure slab margins reflect reality (including waste), never nominal cost.

### Business Value
- Prevents over-optimistic margins that ignore cutting loss.
- Makes low-yield stone visibly less profitable, informing pricing and buying.

### User Benefits
- Accurate margin per slab without manual spreadsheets.
- Null-safe: unknown cost shows N/A, never a fabricated 100%.

### Typical Use Cases
- Pricing slabs after a low-recovery cut.
- Comparing profitability across varieties with different yields.

### Who Uses It
Admin / Owner (visible in costing and reports); runs automatically at cut time.

### Where It Appears
Applied at cutting; surfaced in slab detail, block/slab margins, and Reports.

### Inputs
Block purchase price, consumed area, total slab output area.

### Outputs
Per-slab material cost per sqft, feeding margin calculations.

### Related Features
Partial-Cut Engine · Slab Inventory · GST Invoicing (COGS snapshots) · Reports & Analytics.

### Important Business Rules
- Slab material cost/sqft = purchase price × consumed ÷ output area; higher wastage → higher unit cost. **✅ Confirmed**
- A `null` cost means "unknown" and must surface as N/A — never coerced to 0. **✅ Confirmed**

### Limitations
- Processing cost is additive and per-sqft; it doesn't model per-slab labor variance. **💡 Inferred**

### Future Enhancement Ideas
Finish-specific processing rates, energy/consumable cost allocation per cut.

---

## Immutable Cut-Event Ledger

### Overview
Every cut writes a permanent, append-only ledger entry recording what was consumed and produced — a tamper-evident manufacturing history for each block. **✅ Confirmed**

### Purpose
Preserve an auditable record of manufacturing so yield and history can never be silently rewritten.

### Business Value
- Auditable production trail supports disputes, audits, and yield analysis.
- Feeds gangsaw recovery metrics in reporting.

### User Benefits
- Trustworthy history that later edits can't alter.
- Basis for recovery-% reporting.

### Typical Use Cases
- Reviewing how a block was cut and what it yielded.
- Aggregating recovery performance over a period.

### Who Uses It
Admin / Owner (analysis); written automatically at cut.

### Where It Appears
Behind block/slab history and the gangsaw recovery metric in Reports.

### Inputs
Cut execution data (consumed, output, slabs).

### Outputs
An immutable cut-event record per cut.

### Related Features
Partial-Cut Engine · Recovery-Adjusted Slab Costing · Reports & Analytics.

### Important Business Rules
- Cut events are immutable and written only via a controlled, secure server path. **✅ Confirmed**

### Limitations
- Ledger is read-only; corrections require compensating actions, not edits. **💡 Inferred**

### Future Enhancement Ideas
Per-machine and per-operator recovery breakdowns, downtime and reject capture.

---

## Remnant Block Recovery

### Overview
When a block isn't fully consumed in a cut, the leftover is automatically minted as a new, instantly-sellable remnant block (coded ‑R1, ‑R2…) inheriting the parent's variety, dimensions basis, origin, and prices. **✅ Confirmed**

### Purpose
Ensure valuable leftover stone re-enters inventory as a first-class, quotable block instead of being lost or forgotten.

### Business Value
- Recovers revenue from offcuts that paper systems typically lose.
- Keeps inventory accurate — leftovers are counted, priced, and sellable.

### User Benefits
- No manual re-tagging of leftovers — it's automatic.
- Remnants are immediately available to quote and sell.

### Typical Use Cases
- A 100-sqft block with 40 consumed leaves a 60-sqft remnant, auto-created as ‑R1.
- Selling remnants as smaller pieces to different buyers.

### Who Uses It
Created automatically for workers; sold by Admin.

### Where It Appears
Inventory directory (as a new available block) after a partial cut.

### Inputs
The remaining area after a partial cut.

### Outputs
A new available block with inherited attributes and remnant coding.

### Related Features
Partial-Cut Engine · Block Inventory Directory · Quotation Wizard.

### Important Business Rules
- A remnant is created only when the remaining area exceeds the threshold (default > 0). **✅ Confirmed**
- Remnants are plain available blocks — instantly quotable and sellable. **✅ Confirmed**

### Limitations
- Remnant dimensions inherit the parent basis rather than capturing exact physical offcut geometry. **💡 Inferred**

### Future Enhancement Ideas
Precise remnant dimension capture, remnant-specific discount rules, offcut clearance list.

---

# 🛒 5. Quotations & Orders

## Quotation Wizard & Lifecycle

### Overview
A 3-step wizard to build a customer quotation from available blocks/slabs, with GST preview, a clean lifecycle (draft → sent → accepted → converted, plus reject/expire), and one-click conversion to an order. Crucially, **quotes hold no stock**. **✅ Confirmed**

### Purpose
Give buyers professional, GST-accurate quotes fast, without locking inventory prematurely.

### Business Value
- Faster, more professional quoting wins deals.
- Not reserving stock at quote time means the same hot block can be quoted to many buyers — first to convert wins.
- GST preview sets correct expectations up front.

### User Benefits
- Guided, three-step build.
- Send, accept, reject, and convert with clear status.
- WhatsApp share of the quote.

### Typical Use Cases
- Quoting a walk-in or phone enquiry.
- Following up a showroom lead with a formal quote.
- Converting an accepted quote into a live order.

### Who Uses It
Admin / Owner and Supervisor.

### Where It Appears
`/quotations` and `/quotations/:id`.

### Inputs
Customer, selected blocks/slabs, rates, validity date.

### Outputs
A quotation record, GST-previewed totals, a printable/shareable quote, and (on convert) an order.

### Related Features
Order Creation Wizard · GST Invoicing · WhatsApp Messaging Layer · Print Suite · Leads Inbox.

### Important Business Rules
- **Quotes don't hold stock** — the same available block may appear on many drafts. **✅ Confirmed**
- Expiry is computed at read time and lazily persisted. **✅ Confirmed**
- Conversion re-checks each line is still available (race-guarded) before reserving. **✅ Confirmed**

### Limitations
- No multi-currency; India-native ₹/GST only. **✅ Confirmed**

### Future Enhancement Ideas
Quote versioning/revisions, e-signature acceptance, auto-expiry reminders to the buyer.

---

## Order Creation Wizard

### Overview
Create an order directly (no prior quote) — selecting stock, running a soft credit-limit check, and atomically reserving blocks and slabs so two orders can never claim the same stone. **✅ Confirmed**

### Purpose
Turn a confirmed sale into a live, stock-reserving order safely and quickly.

### Business Value
- Prevents double-selling with atomic reservation.
- Credit-limit awareness protects against over-extending risky customers.

### User Benefits
- Direct path from decision to reserved order.
- Clear over-limit warning with an explicit override for exceptions.

### Typical Use Cases
- Booking a confirmed sale without a formal quote.
- Reserving stock for a customer on the spot.

### Who Uses It
Admin / Owner and Supervisor.

### Where It Appears
`/orders` (creation), leading to `/orders/:id`.

### Inputs
Customer, selected blocks/slabs, and — if over limit — an override confirmation.

### Outputs
A reserved order with stock flipped to reserved.

### Related Features
Secure Block Reservation · Credit-Limit Gates · Payment-Gated Order Pipeline · Quotation Wizard.

### Important Business Rules
- Reservation is atomic — if any requested block/slab is no longer available, nothing is reserved and the user is told to refresh. **✅ Confirmed**
- The credit-limit gate is a soft, override-able warning (a null limit means unlimited). **✅ Confirmed**

### Limitations
- No partial-reservation fallback by design — it's all-or-nothing. **✅ Confirmed**

### Future Enhancement Ideas
Backorder/waitlist for contested stock, quote-first enforcement policy option.

---

## Secure Block Reservation & Concurrency Guard

### Overview
The atomic reservation mechanism behind orders and quote-conversion: it locks the requested blocks and slabs, flips only those still available in a single all-or-nothing step, and treats any conflict as "refresh, don't retry." **✅ Confirmed**

### Purpose
Guarantee that concurrent users, offline replays, and cross-tab actions can never double-book the same stone.

### Business Value
- Eliminates the classic double-sell embarrassment and its financial/relationship cost.
- Makes multi-user operation safe without complex locking for staff to understand.

### User Benefits
- Confidence that a reserved order truly owns its stock.
- Clear, honest messaging when stock was taken by someone else first.

### Typical Use Cases
- Two staff reserving overlapping stock simultaneously.
- Converting a quote whose block was just sold on another order.
- An offline action syncing after the world moved on.

### Who Uses It
Runs for Admin / Supervisor actions; invisible infrastructure.

### Where It Appears
Order creation and quotation conversion.

### Inputs
The order and its requested block/slab set.

### Outputs
Either a fully reserved set or a clean conflict signal with zero partial changes.

### Related Features
Order Creation Wizard · Quotation Wizard · Order Editing Under Reservation · Offline Outbox Engine.

### Important Business Rules
- Both blocks and slabs are locked and flipped in one transaction — any shortfall on either set reserves nothing. **✅ Confirmed**
- Conflicts are surfaced as a distinct "moved on / double-booking" signal; clients drop the intent and refetch rather than blindly retrying. **✅ Confirmed**

### Limitations
- Deliberately no automatic retry — a human decides after refresh. **✅ Confirmed**

### Future Enhancement Ideas
Soft-hold timers, queue-for-notification when contested stock frees up.

---

## Payment-Gated Order Pipeline

### Overview
The order detail hub runs a disciplined pipeline (reserved → processing → shipped → sold) where **every advance past "reserved" requires at least one confirmed payment** — enforcing standard operating procedure. **✅ Confirmed**

### Purpose
Prevent orders from progressing to work or dispatch before the business has money in hand.

### Business Value
- Protects cash flow — no processing or shipping on unpaid orders.
- Encodes SOP so discipline doesn't depend on staff memory.

### User Benefits
- Clear next-step buttons that unlock only when prerequisites are met.
- Plain guidance ("Record a confirmed payment first").

### Typical Use Cases
- Starting processing once an advance is paid.
- Creating a dispatch only after payment and processing.
- Completing an order to sold.

### Who Uses It
Admin / Owner and Supervisor.

### Where It Appears
`/orders/:id` (the order pipeline hub).

### Inputs
Payment records; stage-transition actions.

### Outputs
Advancing order status; unlocked pipeline actions.

### Related Features
Payment Recording · Dispatch & Gate Pass · Delivery Reconciliation · Worker Assignment on Orders.

### Important Business Rules
- At least one confirmed payment is required to move past reserved. **✅ Confirmed**
- Processing → shipped happens only via dispatch creation; shipped → sold via a delivered dispatch (or explicit transition). **✅ Confirmed**
- Transitions are validated against an explicit allowed-transition whitelist. **✅ Confirmed**

### Limitations
- No configurable minimum-advance percentage — one confirmed payment suffices. **💡 Inferred**

### Future Enhancement Ideas
Configurable advance thresholds, milestone-based payment gates, approval workflow for exceptions.

---

## Order Editing Under Reservation

### Overview
A reserved order can be edited — adding or removing lines — with the platform automatically re-reserving new stock and releasing removed stock, while never letting the total drop below what's already been paid. **✅ Confirmed** (a "hidden gem")

### Purpose
Let real-world order changes happen safely after reservation without breaking stock or payment integrity.

### Business Value
- Accommodates buyers who change their minds without cancel-and-recreate churn.
- Keeps inventory and payments perfectly consistent through edits.

### User Benefits
- Add/remove lines on a live reserved order.
- Automatic stock reconciliation — no manual re-reserving.

### Typical Use Cases
- A customer adds a slab to a booked order.
- Removing a line the customer dropped.

### Who Uses It
Admin / Owner and Supervisor.

### Where It Appears
`/orders/:id`.

### Inputs
Added/removed order lines.

### Outputs
Re-reserved/released stock and a recomputed order total (floored at paid amount).

### Related Features
Secure Block Reservation · Payment-Gated Order Pipeline · Payment Recording.

### Important Business Rules
- New lines are atomically re-reserved; removed lines release their stock. **✅ Confirmed**
- The order total can't be edited below the amount already paid. **✅ Confirmed**

### Limitations
- Editing is intended for pre-sold stages; sold orders change via returns, not edits. **💡 Inferred**

### Future Enhancement Ideas
Line-level change history, customer-visible revision notices.

---

## Worker Assignment on Orders

### Overview
Assign workers to an order's work (and a driver to its dispatch) directly from the order hub, feeding the worker app's task and delivery queues. **✅ Confirmed**

### Purpose
Connect commercial orders to shop-floor execution so the right people know what to do.

### Business Value
- Closes the loop between "sold" and "made/delivered."
- Ties labor to specific orders for accountability.

### User Benefits
- Assign from where the order lives.
- Assignments flow straight to workers' phones.

### Typical Use Cases
- Assigning cutters/finishers to an order's stone.
- Assigning a driver to the order's dispatch.

### Who Uses It
Admin / Owner and Supervisor.

### Where It Appears
`/orders/:id` (assignment); surfaces in `/worker/dashboard` and `/worker/deliveries`.

### Inputs
Worker/driver selections.

### Outputs
Worker assignments and tasks; driver-linked dispatches.

### Related Features
Worker Task Progress · Task Templates · Driver Delivery App · Dispatch & Gate Pass.

### Important Business Rules
- Only login-enabled workers can be assigned as drivers. **✅ Confirmed**
- Creating an assignment auto-creates a task with its first step in progress. **✅ Confirmed**

### Limitations
- Assignment is manual (no auto-balancing across workers). **💡 Inferred**

### Future Enhancement Ideas
Workload-aware auto-assignment, skill-based routing, per-worker capacity view.

---

# 💳 6. Payments, Credit & Invoicing

## Payment Recording (Money-In)

### Overview
Record customer payments against an order in multiple modes (cash, UPI, card, bank transfer, plus system credit-notes). The order's paid amount is always **derived** from confirmed payments — never typed directly. **✅ Confirmed**

### Purpose
Track money received accurately and let it drive the order pipeline and receivables.

### Business Value
- Reliable receivables because paid amounts are computed from real payment rows.
- Multiple modes reflect how Indian yards actually get paid.

### User Benefits
- Simple in-context payment entry.
- Overpayment guards prevent obvious mistakes.

### Typical Use Cases
- Logging a cash advance to unlock processing.
- Recording a UPI or bank transfer against an order.

### Who Uses It
Admin / Owner and Supervisor.

### Where It Appears
`/orders/:id` (payments), and reflected in Finance and Customer History.

### Inputs
Amount, mode, and confirmation status.

### Outputs
A confirmed payment record; a recomputed order paid amount.

### Related Features
Payment-Gated Order Pipeline · Store-Credit Ledger · Unified Finance Ledger · Customer History.

### Important Business Rules
- Paid amount is the sum of confirmed payments, maintained automatically — never set by hand. **✅ Confirmed**
- Manual payments are capped server-side so confirmed totals can't exceed the order total (credit-note rows are pre-capped and exempt). **✅ Confirmed**

### Limitations
- **No online payment gateway** — payments are recorded manually, not collected in-app. **✅ Confirmed**

### Future Enhancement Ideas
UPI/payment-gateway integration, auto-reconciliation from bank statements, payment receipts over WhatsApp.

---

## Store-Credit Ledger

### Overview
A per-customer store-credit ledger where the balance is simply the running sum of credit-note (grant), application (spend), and refund rows — the model that powers overpayment credits and applying credit to future orders. **✅ Confirmed**

### Purpose
Handle customer credit cleanly (e.g., from returns/overpayments) and let it be spent on future orders without double-counting.

### Business Value
- Keeps customer money accounted for instead of ad-hoc adjustments.
- Turns returns and overpayments into retained, spendable balances.

### User Benefits
- Transparent credit balance per customer.
- Apply credit to an order like cash.

### Typical Use Cases
- Booking credit when a return overpays an order.
- Applying available credit to a new order's outstanding balance.

### Who Uses It
Admin / Owner (authorized).

### Where It Appears
Order detail (apply credit) and Customer History (balance badge).

### Inputs
Credit grants (from returns/overpayment) and application requests.

### Outputs
An updated credit balance; a confirmed credit-note payment on the order.

### Related Features
Returns / RMA Engine · Payment Recording · Credit-Limit Gates · Customer History.

### Important Business Rules
- Balance = running sum of ledger amounts; spending inserts a negative application row so the next balance read already reflects it (no separate "spent" flag to desync). **✅ Confirmed**
- Applying credit is capped by both available balance and the order's outstanding amount, server-enforced regardless of UI input. **✅ Confirmed**

### Limitations
- Cash-refund payout is schema-ready but not an active in-app flow. **✅ Confirmed**

### Future Enhancement Ideas
Credit expiry policies, credit statements for customers, cash-refund workflow.

---

## Credit-Limit Gates

### Overview
A soft, override-able credit policy: when a customer's exposure (unpaid balances plus the prospective order) would exceed their credit limit, order creation warns the operator, who can override for exceptions. **✅ Confirmed**

### Purpose
Prevent over-extending credit to risky customers while keeping legitimate exceptions frictionless.

### Business Value
- Reduces bad-debt risk by making exposure visible at the point of sale.
- Keeps control with the operator rather than hard-blocking business.

### User Benefits
- Clear at-a-glance exposure vs. limit.
- Override for trusted exceptions.

### Typical Use Cases
- Warning before booking an order that pushes a customer over limit.
- Consciously overriding for a long-standing customer.

### Who Uses It
Admin / Owner and Supervisor.

### Where It Appears
Order creation; customer exposure shown in Customer History.

### Inputs
Customer credit limit; current exposure; the prospective order value.

### Outputs
A warning (with override) or a clear pass.

### Related Features
Order Creation Wizard · Customer History & Receivables · Store-Credit Ledger.

### Important Business Rules
- Exposure = sum of unpaid balances across non-cancelled orders plus the prospective order. **✅ Confirmed**
- A null limit means unlimited; the gate is soft and override-able. **✅ Confirmed**

### Limitations
- No hard-block mode or approval hierarchy for overrides. **💡 Inferred**

### Future Enhancement Ideas
Role-gated overrides, aging-weighted risk scoring, per-customer limit review reminders.

---

## GST Invoicing

### Overview
One-click, India-native GST invoicing: a frozen snapshot invoice with HSN 6802, correct CGST/SGST or IGST split, amount-in-words, a catalog QR footer, and a live-rendered seller block — one invoice per order. **✅ Confirmed**

### Purpose
Produce compliant, professional tax invoices instantly, with correct GST math and Indian formatting.

### Business Value
- Compliance and professionalism without an accountant in the loop.
- Correct place-of-supply tax split avoids costly GST errors.

### User Benefits
- One invoice per order, minted with a sequential number.
- Amount-in-words and rich formatting for a polished document.

### Typical Use Cases
- Invoicing a completed sale.
- Reprinting an invoice for a customer or auditor.

### Who Uses It
Admin / Owner and Supervisor.

### Where It Appears
`/orders/:id` (generate) and `/invoices` (list & reprint).

### Inputs
Order lines, buyer name/GSTIN/state, place-of-supply toggle; seller profile from Settings.

### Outputs
A numbered GST invoice, printable via the print suite.

### Related Features
Invoice Register & Reprint · Print Suite · Yard Settings (GSTIN/GST rate) · Reports & Analytics.

### Important Business Rules
- Intra-state → CGST + SGST (split kept exact via a remainder trick); inter-state → IGST. Place-of-supply is a manual toggle. **✅ Confirmed**
- Exactly one invoice per order; line snapshot is frozen while the seller block re-renders live at print time. **✅ Confirmed**
- Worked-stone HSN is 6802; amount-in-words uses Indian crore/lakh grouping. **✅ Confirmed**

### Limitations
- No e-invoice/IRN or e-way-bill portal integration (e-way number is a manual field). **💡 Inferred**

### Future Enhancement Ideas
GSTN e-invoice/IRN generation, e-way-bill API, emailed invoice PDFs.

---

## Invoice Register & Reprint

### Overview
A searchable list of all generated invoices with one-click reprint — the yard's tax-document archive. **✅ Confirmed**

### Purpose
Keep every invoice retrievable for customers, accountants, and audits.

### Business Value
- Instant retrieval replaces digging through files.
- Consistent reprints for compliance.

### User Benefits
- Find and reprint any invoice quickly.

### Typical Use Cases
- Reissuing an invoice a customer lost.
- Pulling invoices for GST filing or audit.

### Who Uses It
Admin / Owner and Supervisor.

### Where It Appears
`/invoices`.

### Inputs
Search/filter over invoices.

### Outputs
Invoice list; reprinted documents.

### Related Features
GST Invoicing · Print Suite · Reports & Analytics.

### Important Business Rules
- Reprints re-render the seller block live while preserving the frozen line snapshot. **✅ Confirmed**

### Limitations
- List/reprint only; invoices aren't editable after generation (by design). **💡 Inferred**

### Future Enhancement Ideas
Bulk export for a filing period, invoice status (paid/unpaid) badges.

---

## Customer History & Receivables

### Overview
A per-customer profile showing credit limit, live exposure, store-credit balance, order history, and negotiation logs — the relationship and money view for each buyer. **✅ Confirmed**

### Purpose
Understand each customer's value, risk, and outstanding balance at a glance.

### Business Value
- Informs credit decisions and collection priorities.
- Consolidates the customer relationship in one place.

### User Benefits
- Exposure and store-credit badges surface risk and available credit.
- History supports better negotiation and service.

### Typical Use Cases
- Reviewing a customer before extending credit.
- Prioritizing collections by exposure.
- Checking a customer's store-credit before applying it.

### Who Uses It
Admin / Owner and Supervisor.

### Where It Appears
`/customers`.

### Inputs
Customer records, orders, payments, ledger.

### Outputs
Customer profile with exposure, credit limit, store credit, and history.

### Related Features
Credit-Limit Gates · Store-Credit Ledger · Payment Reminders · Unified Finance Ledger.

### Important Business Rules
- Exposure aggregates unpaid balances across non-cancelled orders. **✅ Confirmed**

### Limitations
- No CRM-style pipeline/opportunity tracking beyond negotiation logs. **💡 Inferred**

### Future Enhancement Ideas
Customer statements, automated dunning schedules, loyalty/repeat-buyer insights.

---

# 🚚 7. Dispatch & Delivery

## Dispatch & Gate Pass

### Overview
Create a dispatch from a paid, processed order — capturing vehicle, transporter, driver, e-way, and notes — which mints a gate pass / loading slip (with an embedded tracking QR) and advances the order to shipped. **✅ Confirmed**

### Purpose
Formalize the hand-off of goods leaving the yard with a proper document and a trackable dispatch.

### Business Value
- A real gate pass controls what leaves the yard (loss/theft prevention).
- The tracking QR turns a paper slip into a live status link for the buyer.

### User Benefits
- One action creates the dispatch, prints the gate pass, and moves the order forward.
- Reprintable anytime.

### Typical Use Cases
- Loading a vehicle and issuing a gate pass.
- Generating an e-way-referenced loading slip.

### Who Uses It
Admin / Owner and Supervisor.

### Where It Appears
`/orders/:id` (create) and `/dispatches` / `/dispatches/:id`.

### Inputs
Vehicle, transporter, driver, phone, e-way number, notes.

### Outputs
A dispatch record, a printed gate pass with tracking QR, and the order set to shipped.

### Related Features
Payment-Gated Order Pipeline · Driver Delivery App · Public Dispatch Tracking · Delivery Reconciliation · Print Suite.

### Important Business Rules
- Dispatch creation is gated: order must be processing/shipped, have a confirmed payment, and have no active dispatch. **✅ Confirmed**
- Creating a dispatch is the only path from processing → shipped. **✅ Confirmed**
- The gate pass prints in an isolated popup and is explicitly "not a tax invoice." **✅ Confirmed**

### Limitations
- One active dispatch per order at a time. **✅ Confirmed**

### Future Enhancement Ideas
Multi-drop dispatches, transporter directory, e-way-bill API auto-fill.

---

## Driver Delivery App

### Overview
A focused, bilingual worker view for assigned drivers showing **only their** deliveries, with forward-only "Mark In Transit" → "Mark Delivered" actions and optimistic feedback. **✅ Confirmed**

### Purpose
Give drivers a dead-simple, phone-first way to update delivery status from the road.

### Business Value
- Real-time delivery status without phone calls to the office.
- Drivers see only what concerns them — no data over-exposure.

### User Benefits
- Just their deliveries, in their language (English/Hindi).
- Two big forward-only buttons; instant UI response.

### Typical Use Cases
- A driver marking a load in transit on departure.
- Confirming delivery at the customer site.

### Who Uses It
Worker acting as Driver.

### Where It Appears
`/worker/deliveries`.

### Inputs
Status-advance taps (optional delivery note downstream).

### Outputs
Advanced dispatch status; toast confirmations.

### Related Features
Dispatch & Gate Pass · Public Dispatch Tracking · Delivery Reconciliation · Bilingual Worker Experience.

### Important Business Rules
- A driver sees only dispatches assigned to them (enforced by tenant/row security on the live backend). **✅ Confirmed**
- Status is forward-only. **✅ Confirmed**

### Limitations
- No in-app GPS/route/navigation. **💡 Inferred**

### Future Enhancement Ideas
Proof-of-delivery photo/signature, live location sharing, route optimization.

---

## Public Dispatch Tracking

### Overview
A login-free tracking page a buyer opens via a secret token (from the gate pass QR/link) to see delivery status — safe fields only, no prices — and optionally advance/confirm delivery. **✅ Confirmed**

### Purpose
Let customers self-serve delivery status, reducing "where's my order?" calls.

### Business Value
- Professional, modern buyer experience.
- Fewer status-chasing interruptions for staff.

### User Benefits
- No login; scan or click to track.
- Clean status timeline without sensitive data.

### Typical Use Cases
- A buyer checking whether their stone has shipped.
- Confirming receipt from the tracking link.

### Who Uses It
Public / Guest (buyer).

### Where It Appears
`/track/:token`.

### Inputs
The dispatch tracking token.

### Outputs
A safe delivery-status view; optional status advance stamped as link-driven.

### Related Features
Dispatch & Gate Pass · Delivery Reconciliation · WhatsApp Messaging Layer.

### Important Business Rules
- Token access returns safe fields only (no prices) and supports forward-only status advance. **✅ Confirmed**
- Token-based tracking operates on the live backend (not simulated in demo mode). **✅ Confirmed**

### Limitations
- Requires the live backend; the tracking flow isn't exercised in pure demo mode. **✅ Confirmed**

### Future Enhancement Ideas
ETA estimates, WhatsApp status pushes, map-based tracking.

---

## Delivery Reconciliation

### Overview
When a dispatch is marked delivered, the platform automatically completes the underlying order to "sold" — snapshotting costs and closing worker assignments — so operations and finance stay in lockstep. **✅ Confirmed**

### Purpose
Ensure the commercial state of an order always matches physical reality without manual double-entry.

### Business Value
- Books the sale (and its COGS snapshot) exactly when goods are delivered.
- No orders stuck "shipped" long after delivery.

### User Benefits
- One driver action closes the whole order.
- Reports and receivables update automatically.

### Typical Use Cases
- A driver marks delivered; the order auto-completes to sold.
- Dashboard and reports reflect the completed sale without staff action.

### Who Uses It
Triggered by Driver/Worker delivery; benefits Admin/Finance.

### Where It Appears
Effect visible across Orders, Dispatches, Dashboard, and Reports.

### Inputs
A delivered dispatch.

### Outputs
Order completed to sold; COGS snapshot onto each order line; active worker assignments completed.

### Related Features
Driver Delivery App · Payment-Gated Order Pipeline · GST Invoicing (COGS snapshot) · Reports & Analytics.

### Important Business Rules
- A delivered dispatch auto-completes its order to sold. **✅ Confirmed**
- At sale, unit costs are frozen onto order lines; unknown cost stays unknown (never faked). **✅ Confirmed**

### Limitations
- Reconciliation is delivery-driven; partial-delivery accounting isn't modeled. **💡 Inferred**

### Future Enhancement Ideas
Partial-delivery support, delivery-vs-invoice discrepancy checks.

---

# ↩️ 8. Returns & Write-offs

## Returns / RMA Engine

### Overview
A batch returns tool for sold orders: each returned line is dispositioned as **Restock** (back to sellable) or **Scrap** (written off), with correct credit, COGS reversal, and store-credit booking — including a clever rule so repeated returns never double-count credit. **✅ Confirmed**

### Purpose
Handle post-sale returns accurately across inventory, cost, and customer credit.

### Business Value
- Returns don't corrupt stock, margin, or receivables.
- Overpayments from returns become retained store credit, not cash leakage.

### User Benefits
- Line-by-line disposition control.
- Automatic, correct financial consequences.

### Typical Use Cases
- A customer returns a slab in good condition (restock).
- A damaged-in-transit item is scrapped and written off.
- Partial returns that shrink an order.

### Who Uses It
Admin / Owner and Supervisor.

### Where It Appears
`/orders/:id/returns`.

### Inputs
Return lines with quantities and Restock/Scrap disposition.

### Outputs
Restocked/scrapped items, a recomputed order total, booked store credit (on overpayment), and damage entries for scrap.

### Related Features
Damage & Write-off Log · Store-Credit Ledger · Slab Inventory · Reports & Analytics.

### Important Business Rules
- Returns are allowed **only on sold orders**. **✅ Confirmed**
- Scrapped items go to damaged and **never** return to the available pool; restocked items return to available. **✅ Confirmed**
- Full-quantity returns delete the line (so a later cascade can't wrongly re-release stock); partial returns shrink it. **✅ Confirmed**
- Only the incremental new overpayment is booked to store credit — repeated returns can't double-count. **✅ Confirmed**

### Limitations
- No customer-initiated return requests; RMA is admin-driven. **💡 Inferred**

### Future Enhancement Ideas
Return reasons analytics, restocking fees, customer-facing return requests.

---

## Damage & Write-off Log

### Overview
A record of written-off stock (from scrapped returns or in-yard damage) with reason and estimated loss, feeding dashboard alerts and the Reports P&L "write-offs" line. **✅ Confirmed**

### Purpose
Account for stone that leaves the sellable pool due to damage, with a visible financial impact.

### Business Value
- Losses are recorded, not hidden — honest P&L and better process improvement.
- Write-off alerts prompt investigation of recurring damage.

### User Benefits
- Clear reason codes and loss estimates.
- Loss automatically reflected in reports.

### Typical Use Cases
- Writing off a block damaged in handling.
- Scrapping a defective returned slab.

### Who Uses It
Admin / Owner and Supervisor.

### Where It Appears
Written from block detail and the returns engine; surfaced in Dashboard alerts and Reports.

### Inputs
Damaged item, reason (cutting/handling/transport/defect/other), quantity.

### Outputs
A damage record with a coded ID and estimated loss (on a cost basis).

### Related Features
Returns / RMA Engine · Block Detail · Smart Alerts · Reports & Analytics.

### Important Business Rules
- Estimated loss uses the item's cost basis × quantity. **✅ Confirmed**
- Damaged stock is excluded from quotation/order selectors, find filters, and stock-value snapshots. **✅ Confirmed**

### Limitations
- Loss is estimated at cost; it doesn't model recovery/insurance offsets. **💡 Inferred**

### Future Enhancement Ideas
Photo evidence on damage records, damage-rate trends by cause and worker.

---

# 🛍️ 9. Public 3D Showroom & Leads

## Public 3D Showroom Catalog

### Overview
A per-yard, login-free online showroom rendered with WebGL/three.js — a cinematic 3D marble-block hero, a searchable stone showcase, parallax stats, and full-viewport stone detail overlays — with graceful fallbacks so "the hero never breaks." **✅ Confirmed**

### Purpose
Give each yard a beautiful public storefront that showcases available stock and converts visitors into enquiries.

### Business Value
- A modern web presence that competes with far larger firms.
- Turns anonymous web traffic into qualified leads.
- Shareable links unfurl into rich preview cards on social/WhatsApp.

### User Benefits
- Immersive 3D presentation of stone.
- Fast, smooth, and resilient across devices (CSS-cube fallback when WebGL is unavailable or motion is reduced).
- Search the showcase with the same typo-tolerant engine.

### Typical Use Cases
- A buyer browsing a yard's available stone online.
- A yard sharing its catalog link on WhatsApp/social.
- Showcasing a specific stone in a full-screen detail view.

### Who Uses It
Public / Guest; curated by Admin (which blocks appear, whether prices show).

### Where It Appears
`/catalog` and `/catalog/:yardSlug`.

### Inputs
Yard slug (or auto-selection); available, catalog-opted-in blocks.

### Outputs
A rendered showroom of available stock with detail overlays and a quote-request path.

### Related Features
Per-Block Price Gating · Lead Capture & Enquiry Inbox · Catalog Sharing · Typo-Tolerant Stone Finder · Procedural Stone Art.

### Important Business Rules
- Only available blocks appear; reads go through narrow, safe-columns-only public paths. **✅ Confirmed**
- The heavy 3D bundle loads only in the showroom; reduced-motion and no-WebGL both fall back to a pure-CSS cube. **✅ Confirmed**
- Stone imagery is procedurally generated (not customer photos) except the hero backdrop. **✅ Confirmed**

### Limitations
- Four richer catalog components (a featured rail, stone index, filter bar, and light-sweep tile) exist but are **not yet wired in** — planned/partial. **✅ Confirmed**
- Location is shown at zone level only; no exact stack disclosed. **✅ Confirmed**

### Future Enhancement Ideas
Wire in the planned featured rail / filter bar, per-stone AR preview, buyer accounts with saved favorites.

---

## Per-Block Price Gating

### Overview
Each catalog block can individually show its price or display "On request" — the yard controls disclosure per block via a catalog opt-in, and prices are gated at the data source, not just hidden in the UI. **✅ Confirmed**

### Purpose
Let yards market stock publicly while protecting pricing strategy where they choose.

### Business Value
- Encourages enquiries ("On request" prompts contact) while showing prices where it helps.
- Prevents competitors from scraping the full price list.

### User Benefits
- Owners decide, per block, what the public sees.
- Buyers see either a price or a clear "On request" prompt.

### Typical Use Cases
- Publishing commodity stock with prices but keeping premium pieces "On request."
- Opting a block into the public catalog with price visibility.

### Who Uses It
Configured by Admin; experienced by Public.

### Where It Appears
Block edit (catalog opt-in / show-price flag); enforced in the public catalog.

### Inputs
Per-block "show price publicly" setting.

### Outputs
Either a public price or an "On request" label — enforced server-side.

### Related Features
Public 3D Showroom Catalog · Lead Capture · Block Editing.

### Important Business Rules
- Price is returned publicly only when the block opts in; otherwise it's null with an "On request" flag — decided at the data layer, not the browser. **✅ Confirmed**

### Limitations
- Binary per-block (show/hide); no tiered pricing by buyer segment. **💡 Inferred**

### Future Enhancement Ideas
Buyer-segment pricing, "login to see price" gating, minimum-quantity price breaks.

---

## Lead Capture & Enquiry Inbox

### Overview
Public visitors submit a quote request from the catalog (name, phone, quantity, message, optional block), which lands in the admin Leads inbox with a new/contacted/closed lifecycle — and a WhatsApp reply auto-advances the lead. **✅ Confirmed**

### Purpose
Convert showroom interest into structured, actionable sales leads.

### Business Value
- No lead falls through the cracks — every enquiry is captured and tracked.
- WhatsApp-first follow-up matches how Indian buyers communicate.

### User Benefits
- Buyers request quotes without an account.
- Owners get a clean inbox with one-tap WhatsApp replies.

### Typical Use Cases
- A visitor requests a quote on a specific stone.
- An owner replying to a new lead over WhatsApp (auto-marking it contacted).

### Who Uses It
Public submits; Admin manages.

### Where It Appears
Catalog quote-request panel (public) → `/leads` (admin).

### Inputs
Name, phone, quantity, message, optional block reference.

### Outputs
A new lead in the inbox; a WhatsApp reply link with a catalog promo footer.

### Related Features
Public 3D Showroom Catalog · Quotation Wizard · WhatsApp Messaging Layer · Smart Alerts.

### Important Business Rules
- Lead submission validates name and phone; a block reference is kept only if it belongs to that yard. **✅ Confirmed**
- Replying over WhatsApp auto-advances a lead from new → contacted. **✅ Confirmed**
- The public can submit but has no direct read access to the leads table. **✅ Confirmed**

### Limitations
- No email capture/lead source beyond the catalog form. **💡 Inferred**

### Future Enhancement Ideas
Lead assignment/ownership, response-time SLA alerts, lead-to-order conversion analytics.

---

## Catalog Sharing

### Overview
From admin inventory, share the public catalog URL — open it, copy it, or WhatsApp-share it — and printed invoices/quotations embed a catalog QR so every document doubles as a marketing touchpoint. **✅ Confirmed**

### Purpose
Make it trivial to drive buyers to the online showroom from anywhere.

### Business Value
- Every printed document and message becomes a channel back to the catalog.
- Frictionless sharing increases catalog traffic and leads.

### User Benefits
- One-tap share/copy/WhatsApp of the catalog.
- Auto-embedded catalog QR on paperwork.

### Typical Use Cases
- WhatsApp-sharing the catalog with a prospect.
- A customer scanning the catalog QR on their invoice.

### Who Uses It
Admin / Owner and Supervisor.

### Where It Appears
Inventory (catalog share control); invoice/quotation print footers.

### Inputs
The yard's auto-minted catalog slug/URL.

### Outputs
A shareable catalog link and embedded catalog QR codes.

### Related Features
Public 3D Showroom Catalog · GST Invoicing · Quotation Wizard · WhatsApp Messaging Layer.

### Important Business Rules
- Yard catalog slugs are auto-minted; shared links unfurl into rich preview cards via static social meta tags. **✅ Confirmed**

### Limitations
- One catalog per yard; no per-campaign tracked links. **💡 Inferred**

### Future Enhancement Ideas
UTM/campaign-tagged share links, QR scan analytics, custom vanity slugs.

---

# 🏗️ 10. Procurement

## Supplier Directory & Payables

### Overview
Manage vendors and track what the yard owes them — a supplier CRUD register with payables visibility. **✅ Confirmed**

### Purpose
Keep supplier records and outstanding balances organized for buying and paying.

### Business Value
- Clear payables position for cash planning.
- Consolidated vendor records for repeat purchasing.

### User Benefits
- Supplier details in one place.
- Payables at a glance.

### Typical Use Cases
- Adding a new quarry/vendor.
- Checking what's owed to a supplier before paying.

### Who Uses It
Admin / Owner and Supervisor.

### Where It Appears
`/suppliers`.

### Inputs
Supplier details; linked purchase orders and payments.

### Outputs
Supplier records with payable balances.

### Related Features
Purchase Order Wizard · Supplier Payments · Unified Finance Ledger.

### Important Business Rules
- Supplier payables derive from purchase orders and confirmed supplier payments. **✅ Confirmed**

### Limitations
- No vendor performance scoring or price-history analytics. **💡 Inferred**

### Future Enhancement Ideas
Vendor scorecards, price-trend tracking, purchase recommendations.

---

## Purchase Order Wizard

### Overview
A 3-step wizard to raise a purchase order to a supplier — capturing line items (stone type/variety, dimensions, quantity, purchase rate) and issuing a coded PO. **✅ Confirmed**

### Purpose
Formalize buying so incoming stock is planned, costed, and ready to intake.

### Business Value
- Documented procurement with cost basis captured up front.
- Sets up frictionless receive-to-inventory later.

### User Benefits
- Guided PO creation.
- Auto-generated PO code.

### Typical Use Cases
- Ordering blocks from a quarry/vendor.
- Recording agreed purchase rates for costing.

### Who Uses It
Admin / Owner and Supervisor.

### Where It Appears
`/purchases` and `/purchases/:id`.

### Inputs
Supplier, line items (type/variety, dimensions, quantity, purchase price per sqft).

### Outputs
A PO with a generated code, status "ordered," and receivable line items.

### Related Features
PO Receive → Block Intake · Supplier Directory · Supplier Payments.

### Important Business Rules
- PO codes are auto-generated; status flows draft → ordered → received | cancelled. **✅ Confirmed**

### Limitations
- No multi-currency or import/duty modeling. **💡 Inferred**

### Future Enhancement Ideas
Partial receipts, landed-cost allocation (freight/duty), PO approval workflow.

---

## PO Receive → Block Intake

### Overview
A single confirm on a purchase order **fans out every unreceived line into new blocks** — each with a generated block code, minted QR identity, inherited dimensions/variety, and the PO's purchase price as its cost basis — atomically. **✅ Confirmed**

### Purpose
Turn "goods received" into fully-tagged, QR-identified inventory in one step, with cost carried automatically.

### Business Value
- Eliminates manual re-tagging of received stock — huge time saver.
- Guarantees cost basis flows from PO to block for accurate margins.

### User Benefits
- One click converts a PO into shelf-ready, QR-tagged blocks.
- No data re-entry, no lost cost linkage.

### Typical Use Cases
- Receiving a truckload of blocks against a PO.
- Instantly making received stock quotable and sellable.

### Who Uses It
Admin / Owner and Supervisor.

### Where It Appears
Purchase order detail (receive action).

### Inputs
The purchase order to receive.

### Outputs
New available blocks (coded, QR-minted, cost-carried) with the PO marked received and back-linked.

### Related Features
Purchase Order Wizard · QR Digital Block Identity · Block Tagging Wizard (manual alternative) · Recovery-Adjusted Slab Costing.

### Important Business Rules
- Receiving is atomic; each line becomes a block with sequential coding and the PO's purchase price as cost basis. **✅ Confirmed**
- The manual tag wizard is the alternate intake path for stock without a PO. **✅ Confirmed**

### Limitations
- Whole-PO receive; per-line partial receiving isn't modeled. **💡 Inferred**

### Future Enhancement Ideas
Partial/over/under-receipt handling, quarry-slip photo attachment, quality-check step before intake.

---

## Supplier Payments (Money-Out)

### Overview
Record payments to suppliers against purchase orders, mirroring the customer-payment mechanism — the PO's paid amount is derived from confirmed supplier payments, with overpayment guards. **✅ Confirmed**

### Purpose
Track money paid out to vendors accurately against POs.

### Business Value
- Accurate payables and cash-out visibility.
- Symmetric, trustworthy accounting with the money-in side.

### User Benefits
- In-context payment entry against a PO.
- Overpayment protection.

### Typical Use Cases
- Paying a supplier advance or balance.
- Reconciling what's been paid against a PO.

### Who Uses It
Admin / Owner and Supervisor.

### Where It Appears
Purchase order detail (supplier payments), reflected in Finance.

### Inputs
Amount, mode, confirmation.

### Outputs
Confirmed supplier payment; recomputed PO paid amount.

### Related Features
Purchase Order Wizard · Supplier Directory · Unified Finance Ledger.

### Important Business Rules
- PO paid amount is the sum of confirmed supplier payments, maintained automatically. **✅ Confirmed**

### Limitations
- Manual recording; no bank/gateway integration. **✅ Confirmed**

### Future Enhancement Ideas
Payment scheduling, bulk supplier settlements, remittance advice generation.

---

# 👷 11. Workforce, Attendance & Payroll

## Worker Directory & Login Provisioning

### Overview
Manage the yard's workforce and provision worker logins — a directory with a payroll card per worker and a control to grant a **username-only** login (created securely behind the scenes). **✅ Confirmed**

### Purpose
Onboard workers into the system and give them phone access without the friction of emails/passwords they'd struggle with.

### Business Value
- Gets low-literacy, phone-only staff into the digital workflow.
- Central roster tied to attendance, payroll, and assignments.

### User Benefits
- Provision or remove a worker login in a click.
- Payroll card summarizes each worker's pay position.

### Typical Use Cases
- Adding a new cutter and enabling their app login.
- Reviewing a worker's payroll summary.
- Revoking access when someone leaves.

### Who Uses It
Admin / Owner.

### Where It Appears
`/workers` and `/workers/:id`.

### Inputs
Worker details; a chosen username for login.

### Outputs
Worker records; provisioned/removed logins; payroll cards.

### Related Features
Worker Login (Username-Only Auth) · Attendance Register · Advances & Payroll · Worker Assignment on Orders.

### Important Business Rules
- Only a yard's owner/admin can provision or remove a worker's login. **✅ Confirmed**
- Usernames are globally unique. **✅ Confirmed**

### Limitations
- No self-onboarding for workers — always admin-provisioned. **✅ Confirmed**

### Future Enhancement Ideas
Bulk import of workers, per-worker skill/role tags, document (ID) storage.

---

## Worker App & Dashboard

### Overview
The worker's phone home screen: an availability status toggle, personal stats, a "My Work" queue of tasks and deliveries, and the offline-sync status UI — all bilingual and designed for low-literacy use. **✅ Confirmed**

### Purpose
Give shop-floor staff a simple, phone-first cockpit for their day's work.

### Business Value
- Digitizes shop-floor execution that used to live on paper and in memory.
- Bilingual, icon/number-first design means real adoption by real workers.

### User Benefits
- See exactly what to do next.
- Toggle availability; view personal stats.
- Works offline with visible sync status.

### Typical Use Cases
- A cutter checking their assigned tasks.
- A worker marking themselves available/unavailable.
- Confirming that offline work has synced.

### Who Uses It
Worker (also accessible to Admin).

### Where It Appears
`/worker/dashboard`.

### Inputs
Status toggle; navigation into tasks/deliveries.

### Outputs
Task/delivery queue, stats, sync status.

### Related Features
Worker Task Progress · Driver Delivery App · Worker Self-Service Earnings · Offline Outbox Engine · Bilingual Worker Experience.

### Important Business Rules
- The worker surface is available to admins too (for supervision/testing). **✅ Confirmed**

### Limitations
- Admin pages still need network to first load; only worker mutations queue offline. **✅ Confirmed**

### Future Enhancement Ideas
Shift scheduling, push notifications for new assignments, in-app worker chat.

---

## Worker Task Progress

### Overview
An offline-first, step-by-step checklist for a worker's assigned job — strictly sequential, conflict-aware, and idempotent so taps survive poor connectivity without ever corrupting progress. **✅ Confirmed**

### Purpose
Guide workers through a job step by step and capture completion reliably, even offline.

### Business Value
- Standardizes how jobs are done (fewer skipped steps, better quality).
- Reliable capture in a low-connectivity yard environment.

### User Benefits
- Clear, ordered steps in the worker's language.
- Progress is saved and syncs automatically — "your progress is saved."
- Impossible to double-complete or complete out of order.

### Typical Use Cases
- Working through a cutting/polishing/packing checklist.
- Completing steps while offline in a yard dead-zone.

### Who Uses It
Worker (also Admin).

### Where It Appears
`/worker/task/:assignmentId`.

### Inputs
Step-completion taps.

### Outputs
Advancing task progress; assignment auto-completed when the last step is done.

### Related Features
Task Templates · Offline Outbox Engine · Sync Status UI · Worker Assignment on Orders.

### Important Business Rules
- Steps are strictly sequential and guarded by an optimistic index check; out-of-order or stale taps are rejected as conflicts and dropped (never replayed to clobber fresher state). **✅ Confirmed**
- Completing an already-completed step is a harmless no-op, which makes offline replay safe. **✅ Confirmed**
- Completing the last step auto-completes the assignment. **✅ Confirmed**

### Limitations
- Linear checklists only; no branching/conditional steps. **💡 Inferred**

### Future Enhancement Ideas
Photo/measurement capture per step, branching templates, time-per-step analytics.

---

## Task Templates

### Overview
Per-job-type step lists (general, cutting, polishing, packing, loading, driving) resolved as yard-override → built-in default → generic fallback — so each assignment auto-generates the right checklist. **✅ Confirmed**

### Purpose
Encode each yard's standard operating steps so workers always follow the correct process.

### Business Value
- Consistent quality and process across staff and shifts.
- Customizable per yard without losing sensible defaults.

### User Benefits
- The right steps appear automatically for each job type.
- Yards can tailor steps to their own process.

### Typical Use Cases
- Auto-creating a cutting checklist when a cutter is assigned.
- Overriding default steps to match a yard's method.

### Who Uses It
Configured by Admin; experienced by Worker.

### Where It Appears
Applied when a worker assignment/task is created; surfaced in Worker Task Progress.

### Inputs
Job type; optional yard step overrides.

### Outputs
A resolved step list for the task.

### Related Features
Worker Task Progress · Worker Assignment on Orders.

### Important Business Rules
- Resolution order is yard override, then built-in default, then a generic fallback. **✅ Confirmed**
- A new assignment auto-creates a task with its first step in progress. **✅ Confirmed**

### Limitations
- Templates are per job type, not per individual product/spec. **💡 Inferred**

### Future Enhancement Ideas
Template library/marketplace, mandatory-photo steps, per-step SLAs.

---

## Attendance Register & Wage Snapshots

### Overview
A calendar-style daily attendance register (present / half-day / absent) that **snapshots each day's wage at mark time** — so later wage-rate changes never rewrite payroll history. A daily-wage model, not piece-rate. **✅ Confirmed**

### Purpose
Track who worked when and accrue wages reliably and immutably.

### Business Value
- Accurate, tamper-resistant payroll base.
- Historical payroll integrity through wage snapshots.

### User Benefits
- Simple present/half/absent marking on a calendar.
- Past pay is never silently altered by a rate change.

### Typical Use Cases
- Marking daily attendance for the crew.
- Computing wages owed for a period.

### Who Uses It
Admin / Owner.

### Where It Appears
`/attendance`.

### Inputs
Daily attendance status per worker; the worker's current daily wage.

### Outputs
Attendance records with frozen per-day wage credited.

### Related Features
Advances & Payroll · Worker Directory · Worker Self-Service Earnings · Unified Finance Ledger.

### Important Business Rules
- Wage credited is frozen per day at mark time; present → full, half-day → half, absent → 0. **✅ Confirmed**
- Later wage edits never rewrite historical attendance wages. **✅ Confirmed**

### Limitations
- Daily-wage model only; no piece-rate or hourly/overtime modeling. **✅ Confirmed**

### Future Enhancement Ideas
Biometric/QR clock-in, overtime and piece-rate options, shift patterns.

---

## Advances & Payroll

### Overview
Manage worker advances and payouts against accrued wages, with an approval flow for worker-requested advances and a running net-payable per worker. **✅ Confirmed**

### Purpose
Handle the reality of advances and settlements cleanly so both sides know what's owed.

### Business Value
- Controlled advances with an approval gate.
- Accurate net-payable prevents over/under-paying staff.

### User Benefits
- Approve/deny advance requests in a click.
- Clear running balance per worker.

### Typical Use Cases
- Approving a worker's advance request.
- Recording a wage payout.
- Settling net wages for a period.

### Who Uses It
Admin / Owner (approvals/payouts); Worker requests advances.

### Where It Appears
`/attendance` and worker payroll cards; requests originate in `/worker/earnings`.

### Inputs
Advance requests; payout entries.

### Outputs
Approved advances/payouts; updated net payable (earned − advances − payouts).

### Related Features
Attendance Register · Worker Self-Service Earnings · Unified Finance Ledger.

### Important Business Rules
- Net = sum of wages credited − (advances + payouts). **✅ Confirmed**
- Advance requests flow worker → admin decision → recorded advance payment. **✅ Confirmed**

### Limitations
- No statutory deductions (PF/ESI/TDS) modeling. **💡 Inferred**

### Future Enhancement Ideas
Payslip generation, statutory deduction support, direct-to-bank/UPI payouts.

---

## Worker Self-Service Earnings

### Overview
A worker-facing view of their own pay position — earnings, advances, and net — with the ability to request an advance, all in their language. **✅ Confirmed**

### Purpose
Give workers transparency into their pay and a simple way to ask for advances.

### Business Value
- Trust and transparency reduce payroll disputes.
- Self-service advance requests reduce owner interruptions.

### User Benefits
- See what they've earned and what's owed.
- Request an advance from their phone.
- Bilingual, number-first presentation.

### Typical Use Cases
- A worker checking their earnings for the month.
- Requesting an advance ahead of a festival/need.

### Who Uses It
Worker (also Admin).

### Where It Appears
`/worker/earnings`.

### Inputs
Advance requests.

### Outputs
Personal earnings summary; submitted advance requests.

### Related Features
Advances & Payroll · Attendance Register · Bilingual Worker Experience.

### Important Business Rules
- Workers can read only their own attendance/payments and raise advance requests (tenant/row security enforced). **✅ Confirmed**

### Limitations
- View + request only; workers can't self-approve or edit records. **✅ Confirmed**

### Future Enhancement Ideas
Downloadable payslips, earnings trend charts, in-app advance-status notifications.

---

## Bilingual Worker Experience

### Overview
The entire worker surface is available in English and हिंदी, with an icon/number-first design for low-literacy users and a language preference that persists and syncs across tabs. A signature "hidden gem." **✅ Confirmed**

### Purpose
Meet real shop-floor workers where they are — in their language, with minimal reading required.

### Business Value
- Drives genuine adoption by staff who wouldn't use an English-only app.
- Reduces training and error rates on the floor.

### User Benefits
- Toggle between English and Hindi anywhere in the worker app.
- Icon- and number-led screens reduce reliance on reading.
- Preference remembered across sessions and tabs.

### Typical Use Cases
- A Hindi-speaking cutter using tasks and cutting in Hindi.
- A driver reading deliveries in their language.

### Who Uses It
Worker (and Admin when using worker screens).

### Where It Appears
Worker layout, dashboard, find, cut, task, deliveries, and earnings.

### Inputs
Language toggle.

### Outputs
Localized worker UI.

### Related Features
Worker App & Dashboard · Worker Task Progress · Driver Delivery App · Worker Self-Service Earnings.

### Important Business Rules
- Language preference persists and stays in sync across browser tabs. **✅ Confirmed**
- A complete Hindi worker mode also exists inside block tagging (currently behind an admin-only route). **✅ Confirmed**

### Limitations
- Two languages (EN/HI); other regional languages aren't yet included. **💡 Inferred**

### Future Enhancement Ideas
Additional regional languages, voice prompts/read-aloud, per-worker default language.

---

# 💰 12. Finance, Expenses & Ledger

## Unified Finance Ledger

### Overview
A single money-in/money-out ledger that merges customer payments (in) with supplier payments, expenses, and wage advances/payouts (out) — counting only confirmed rows — for a true cash picture. **✅ Confirmed**

### Purpose
Give the owner one honest view of cash movement across every source.

### Business Value
- Real cash position without stitching together separate registers.
- Confirmed-only counting avoids overstating cash.

### User Benefits
- All inflows and outflows in one linked ledger.
- Tabbed views for focus.

### Typical Use Cases
- Reviewing the day's/week's cash movement.
- Reconciling money in vs. out.
- Following payment reminders on outstanding receivables.

### Who Uses It
Admin / Owner.

### Where It Appears
`/finance`.

### Inputs
Customer/supplier payments, expenses, wage advances/payouts.

### Outputs
A unified, linked ledger with cash totals.

### Related Features
Payment Recording · Supplier Payments · Expenses Cashbook · Advances & Payroll · Payment Reminders.

### Important Business Rules
- Only confirmed rows count toward cash totals. **✅ Confirmed**

### Limitations
- Operational cashbook view, not full double-entry accounting. **💡 Inferred**

### Future Enhancement Ideas
Bank reconciliation, accounting-software export (Tally/Zoho), cash-flow forecasting.

---

## Expenses Cashbook

### Overview
A simple cashbook for recording business expenses across eight categories — the outflow side of yard operations beyond suppliers and wages. **✅ Confirmed**

### Purpose
Capture everyday operating costs so P&L reflects true net profit.

### Business Value
- Complete cost capture yields honest margins in reports.
- Category breakdown reveals where money goes.

### User Benefits
- Fast expense entry with sensible categories.
- Feeds directly into the unified ledger and reports.

### Typical Use Cases
- Logging fuel, maintenance, utilities, or office costs.
- Reviewing spend by category.

### Who Uses It
Admin / Owner.

### Where It Appears
`/expenses`.

### Inputs
Amount, category (of eight), date, notes.

### Outputs
Expense records feeding the ledger and P&L.

### Related Features
Unified Finance Ledger · Reports & Analytics.

### Important Business Rules
- Expenses reduce net profit in the reporting engine (net = gross − expenses − write-offs). **✅ Confirmed**

### Limitations
- Fixed set of eight categories; no custom category tree. **💡 Inferred**

### Future Enhancement Ideas
Receipt-photo capture, recurring expenses, custom categories, vendor tagging.

---

## WhatsApp Payment Reminders

### Overview
From Finance, send a customer a payment reminder over WhatsApp via a zero-API deep link — one of five typed message templates. Reminders deliberately omit the catalog promo footer. **✅ Confirmed**

### Purpose
Make collections effortless and consistent using the channel customers actually read.

### Business Value
- Faster collections, lower DSO, with no messaging API or cost.
- Consistent, professional wording every time.

### User Benefits
- One tap to a pre-filled reminder.
- No copy-pasting or manual composing.

### Typical Use Cases
- Nudging a customer with an overdue balance.
- Following up systematically on receivables.

### Who Uses It
Admin / Owner and Supervisor.

### Where It Appears
`/finance` (and customer context).

### Inputs
Customer/outstanding context.

### Outputs
A pre-composed WhatsApp reminder deep link.

### Related Features
WhatsApp Messaging Layer · Customer History & Receivables · Unified Finance Ledger · Smart Alerts.

### Important Business Rules
- Reminders use a zero-API wa.me deep link and, unlike customer-facing promos, do **not** append the catalog footer. **✅ Confirmed**

### Limitations
- Manual send (no automated dunning schedule). **✅ Confirmed**

### Future Enhancement Ideas
Scheduled reminder cadences, delivery/read confirmation, SMS/email fallback.

---

# 📈 13. Reports & Analytics

## 5-Tab Reporting & BI

### Overview
A five-tab business-intelligence suite — P&L, Sales, Inventory, Profitability, and Receivables — with KPIs, period deltas, sparklines, insight strips, and date presets, powered by a pure reporting engine with snapshot-aware costing. **✅ Confirmed**

### Purpose
Turn operational data into decisions: profit, sales trends, stock value, product/customer profitability, and collections.

### Business Value
- Owner-grade visibility that usually requires an analyst or accountant.
- Snapshot-aware COGS means margins are historically honest.

### User Benefits
- Five focused lenses with deltas vs. the previous period.
- Quick date presets and at-a-glance KPIs.
- Metrics like AOV, sell-through, DSO, and gangsaw recovery %.

### Typical Use Cases
- Reviewing monthly P&L and net profit.
- Analyzing which varieties/customers are most profitable.
- Watching receivables aging and DSO.

### Who Uses It
Admin / Owner.

### Where It Appears
`/reports`. See [Reports & Analytics](08_Reports_and_Analytics.md).

### Inputs
Date window/preset; all operational data.

### Outputs
KPIs, trends, breakdowns, aging bands, and derived metrics.

### Related Features
Report Exports & Print · Plain-Language Insights · Inventory Analytics · Recovery-Adjusted Slab Costing.

### Important Business Rules
- Net profit = gross − expenses − write-offs; COGS prefers sale-time snapshot cost. **✅ Confirmed**
- "As-of-now" snapshots (stock value, aging, receivables/payables) are never date-filtered. **✅ Confirmed**
- DSO ≈ receivables ÷ daily revenue; aging uses the yard's thresholds. **✅ Confirmed**

### Limitations
- Reporting is descriptive/analytical, not predictive/forecasting. **💡 Inferred**

### Future Enhancement Ideas
Forecasting, custom report builder, scheduled report emails, drill-through to source records.

---

## Report Exports & Print

### Overview
Export any report to PDF or Excel, print it, or pull per-panel CSV and PNG — with export libraries loaded only when needed and CSV hardened against spreadsheet formula injection. **✅ Confirmed**

### Purpose
Get reports out of the app and into board packs, filings, and spreadsheets.

### Business Value
- Shareable, professional outputs for accountants, banks, and partners.
- Safe CSVs that render ₹ correctly and resist injection attacks.

### User Benefits
- Multiple formats (PDF/Excel/Print/CSV/PNG) from one place.
- Per-panel exports for focused sharing.

### Typical Use Cases
- Exporting P&L to PDF for a lender.
- Pulling a receivables CSV for the accountant.
- Grabbing a chart PNG for a presentation.

### Who Uses It
Admin / Owner.

### Where It Appears
`/reports` (export menu per panel).

### Inputs
Chosen report/panel and format.

### Outputs
PDF, Excel, CSV (BOM + injection-safe), PNG, or print output.

### Related Features
5-Tab Reporting & BI · CSV data hygiene (shared with inventory export) · Print Suite.

### Important Business Rules
- CSV exports neutralize formula-injection prefixes and emit a UTF-8 BOM so ₹ survives Excel. **✅ Confirmed**
- Heavy export libraries load lazily at export time to keep the app light. **✅ Confirmed**

### Limitations
- No scheduled/automated report delivery. **💡 Inferred**

### Future Enhancement Ideas
Scheduled email exports, branded report templates, Google Sheets export.

---

## Plain-Language Insights

### Overview
Each report can surface up to five plain-language insight statements — the engine translating the numbers into sentences an owner can act on. **✅ Confirmed**

### Purpose
Bridge the gap between data and decision for non-analyst owners.

### Business Value
- Faster comprehension → faster action.
- Democratizes analytics for users who don't read charts fluently.

### User Benefits
- "Here's what the numbers mean" in words.
- Insight strips highlight what changed and why it matters.

### Typical Use Cases
- Understanding a profit dip without dissecting the chart.
- Spotting a receivables or sell-through issue called out in plain terms.

### Who Uses It
Admin / Owner.

### Where It Appears
`/reports` (insight strips).

### Inputs
Computed report metrics and deltas.

### Outputs
Up to five plain-language insight statements.

### Related Features
5-Tab Reporting & BI · Smart Alerts.

### Important Business Rules
- Insights are derived from the same pure reporting computations as the KPIs. **✅ Confirmed**

### Limitations
- Rule-based phrasing, not generative narrative. **💡 Inferred**

### Future Enhancement Ideas
Natural-language Q&A over reports, anomaly-explanation drill-downs.

---

# 🔔 14. Notifications & Messaging

## Notifications Bell

### Overview
A header notifications bell driven by an app-wide alerts engine covering leads, receivables aging, purchase/payables, and stale reservations — severity-ranked — the second of the platform's two independent alert engines. **✅ Confirmed**

### Purpose
Keep time-sensitive signals one glance away from anywhere in the admin app.

### Business Value
- Cross-cutting awareness without living on the dashboard.
- Severity ranking focuses attention on what matters most.

### User Benefits
- Always-visible alert count in the header.
- Consistent signals across screens.

### Typical Use Cases
- Noticing new leads or overdue receivables while working elsewhere.
- Catching stale reservations that should be released.

### Who Uses It
Admin / Owner and Supervisor.

### Where It Appears
Header (global admin shell). See [Notifications](09_Notifications.md).

### Inputs
App-wide business data (leads, receivables, POs/payables, reservations).

### Outputs
A ranked list of alerts with counts.

### Related Features
Smart Alerts & Action Cards (the dashboard engine) · WhatsApp Messaging Layer.

### Important Business Rules
- This bell engine is independent from the dashboard engine — overlapping but separately computed signals. **✅ Confirmed**
- Alerts refresh via the live-sync backbone. **✅ Confirmed**

### Limitations
- In-app only; no push or email delivery. **✅ Confirmed**

### Future Enhancement Ideas
Push notifications, per-user alert preferences, mark-as-read history.

---

## WhatsApp Messaging Layer

### Overview
WhatsApp is ShilaTeq's messaging backbone — zero-API wa.me deep links across five typed templates (quote, invoice, dispatch + tracking, lead reply, payment reminder), with customer-facing messages appending a catalog promo footer. **✅ Confirmed**

### Purpose
Communicate with customers on the channel they actually use, without paying for or integrating a messaging API.

### Business Value
- Free, instant, familiar communication that gets read.
- Every customer message doubles as catalog marketing.
- Consistent, professional templated wording.

### User Benefits
- One tap sends a pre-composed, correct message.
- No app switching, copy-pasting, or manual typing.

### Typical Use Cases
- Sending a quote or invoice to a buyer.
- Sharing dispatch status with a tracking link.
- Replying to a lead; nudging a payment.

### Who Uses It
Admin / Owner and Supervisor.

### Where It Appears
Quotations, Invoices/Orders, Dispatches, Leads, and Finance.

### Inputs
The relevant record (quote/invoice/dispatch/lead/receivable).

### Outputs
A pre-filled WhatsApp deep link opening the user's WhatsApp.

### Related Features
Quotation Wizard · GST Invoicing · Dispatch & Gate Pass · Lead Capture · Payment Reminders · Catalog Sharing.

### Important Business Rules
- Customer-facing messages append the catalog promo footer; reminders deliberately don't. **✅ Confirmed**
- No WhatsApp Business API dependency — pure deep links. **✅ Confirmed**

### Limitations
- No delivery/read receipts or two-way inbox — it hands off to WhatsApp. **✅ Confirmed**

### Future Enhancement Ideas
WhatsApp Business API for delivery status and templates, message history log.

---

## Toasts & Confirmations

### Overview
A consistent feedback layer: non-blocking toast notifications for outcomes and a promise-based confirmation dialog for destructive/important actions (with a safe native fallback). **✅ Confirmed**

### Purpose
Give users immediate, reliable feedback and a deliberate confirm step before consequential actions.

### Business Value
- Fewer accidental destructive actions.
- Clear success/failure feedback reduces uncertainty and support load.

### User Benefits
- Instant, unobtrusive confirmations of what just happened.
- A clear "are you sure?" before irreversible steps.

### Typical Use Cases
- Confirming before cancelling an order or clearing data.
- Toast feedback after recording a payment or advancing a dispatch.

### Who Uses It
All app users.

### Where It Appears
Global, across admin and worker surfaces.

### Inputs
Action outcomes; confirmation prompts.

### Outputs
Toast messages; confirm/deny decisions.

### Related Features
Every action-bearing feature relies on this layer.

### Important Business Rules
- The confirm dialog is promise-based with a native fallback so flows (and tests) work even without the provider. **✅ Confirmed**

### Limitations
- Ephemeral; toasts aren't persisted into a notification history. **💡 Inferred**

### Future Enhancement Ideas
Toast action buttons (undo), persistent notification center.

---

# 📴 15. Offline & Sync

## Offline Outbox Engine

### Overview
The worker app's offline backbone: mutations queue in a durable on-device outbox keyed by idempotency, then auto-sync when connectivity returns — sequentially, oldest-first, with exponential backoff, conflict-drop, and dead-letter after repeated failures. **✅ Confirmed**

### Purpose
Let workers keep working in yard dead-zones and guarantee their actions eventually sync exactly once.

### Business Value
- Zero lost work in low-connectivity environments — a real differentiator for stone yards.
- Structurally impossible to double-apply an action.

### User Benefits
- Tap and move on; "your progress is saved and will sync automatically."
- Optimistic UI shows the result immediately.
- Failed items are visible and retryable, not silently lost.

### Typical Use Cases
- Completing task steps offline.
- Logging a cut with no signal.
- Recovering after being offline for a while.

### Who Uses It
Worker.

### Where It Appears
Behind worker task/cut/delivery actions; status shown in the sync UI.

### Inputs
Worker mutations (task steps, cuts, etc.).

### Outputs
Queued, then synced actions; cache invalidated to reflect confirmed state.

### Related Features
Worker Task Progress · Partial-Cut Engine · Sync Status UI · Secure Block Reservation (conflict handling).

### Important Business Rules
- The outbox is keyed by idempotency key, so duplicates are structurally impossible. **✅ Confirmed**
- Draining is sequential and oldest-first to preserve intent order; conflicts are dropped (never replayed) so stale intents can't clobber fresher state; unknown errors back off and dead-letter after repeated attempts. **✅ Confirmed**
- Offline actions are optimistic and kept; server errors roll back the optimistic change. **✅ Confirmed**

### Limitations
- Applies to worker mutations only; admin pages still need network to first load (no full offline caching layer / service worker). **✅ Confirmed**

### Future Enhancement Ideas
Offline read-caching for worker screens, background-sync service worker, richer conflict-resolution UI.

---

## Live Sync (Realtime + Polling)

### Overview
A belt-and-braces freshness system: every change triggers an instant same-tab refetch, a short cross-tab poll, and a tenant-scoped realtime channel — so admin screens stay current without manual reloads. **✅ Confirmed**

### Purpose
Keep everyone's view accurate in real time across tabs, users, and devices.

### Business Value
- No stale-data mistakes (e.g., quoting sold stock).
- Multi-user, multi-tab operation "just works."

### User Benefits
- Lists and dashboards update themselves.
- Consistency across open tabs and team members.

### Typical Use Cases
- A dispatch marked delivered reflecting instantly on the dashboard.
- Two staff seeing each other's changes without refreshing.

### Who Uses It
Admin / Owner and Supervisor (invisible infrastructure).

### Where It Appears
Across all admin lists and dashboards.

### Inputs
Any data mutation; realtime change events.

### Outputs
Refreshed, current views everywhere.

### Related Features
Business Command Dashboard · Notifications Bell · Offline Outbox Engine.

### Important Business Rules
- Realtime events are scoped to the tenant (row-level security honored), combined with a short cross-tab poll and instant same-tab refetch. **✅ Confirmed**
- Caches are intentionally longer-lived because freshness is event-driven, not time-driven. **✅ Confirmed**

### Limitations
- Requires the live backend for true realtime; demo mode relies on same/cross-tab signals. **💡 Inferred**

### Future Enhancement Ideas
Presence indicators (who's viewing/editing), field-level live collaboration.

---

## Sync Status UI

### Overview
Worker-facing sync visibility: a status chip (Synced / N syncing / N not synced) and a bottom-sheet listing failed items with friendly labels, plus Retry and confirm-gated Clear controls. **✅ Confirmed**

### Purpose
Make offline sync legible and controllable for workers, so trust in "it saved" is earned, not assumed.

### Business Value
- Confidence that work is captured, reducing re-entry and disputes.
- Self-service recovery of failed items without admin help.

### User Benefits
- At-a-glance sync state.
- Clear list of anything stuck, with retry.

### Typical Use Cases
- Confirming everything synced after reconnecting.
- Retrying a dead-lettered action.

### Who Uses It
Worker.

### Where It Appears
Worker dashboard/task screens (chip + sheet); an offline banner on the task screen.

### Inputs
Outbox state changes.

### Outputs
Sync status display; retry/clear actions.

### Related Features
Offline Outbox Engine · Worker Task Progress.

### Important Business Rules
- Dead-lettered items can be retried (re-queued) or cleared behind a confirmation. **✅ Confirmed**

### Limitations
- Surface for worker mutations only. **✅ Confirmed**

### Future Enhancement Ideas
Per-item error detail, one-tap "retry all," sync history log.

---

# ⚙️ 16. Settings & Administration

## Yard Settings & Configuration

### Overview
The control panel for the yard: profile, GSTIN and GST rate, carrying-cost rate, inventory aging thresholds, and the demo-data reset — the levers that tune costing, tax, aging, and branding across the platform. **✅ Confirmed**

### Purpose
Let each yard configure the platform to its own tax, costing, and aging policies.

### Business Value
- One place to set the parameters that drive invoices, costing, and alerts.
- Correct GST/HSN and rates ensure compliant documents.

### User Benefits
- Self-service configuration without support.
- Changes propagate to invoices, reports, and alerts.

### Typical Use Cases
- Setting GSTIN and default GST rate.
- Tuning carrying-cost rate and aging thresholds.
- Updating yard profile shown on documents.

### Who Uses It
Admin / Owner.

### Where It Appears
`/settings`.

### Inputs
Yard profile, GSTIN/GST rate, carrying-cost rate, aging thresholds.

### Outputs
Platform-wide configuration applied to invoicing, costing, aging, and branding.

### Related Features
GST Invoicing · Block Detail & Carrying Cost · Inventory Analytics · Smart Alerts · Demo Data Reset.

### Important Business Rules
- Carrying-cost rate and aging thresholds are yard-configurable (defaults: carrying 14%/yr, aging amber 90d / red 180d). **✅ Confirmed**
- The live seller block on printed invoices is re-rendered from these settings at print time. **✅ Confirmed**

### Limitations
- Single warm-stone theme by design — no dark mode or theme options. **✅ Confirmed**

### Future Enhancement Ideas
Multi-user role management UI, document-template branding, per-yard number-format options.

---

## Activity Log & Client Error Sink

### Overview
An admin activity/audit viewer with a companion tab that surfaces caught client-side errors — a lightweight operational and reliability window into the yard's system. **✅ Confirmed**

### Purpose
Provide visibility into system activity and any errors the app caught, aiding oversight and support.

### Business Value
- A starting point for auditability and troubleshooting.
- Captured errors help diagnose issues without user bug reports.

### User Benefits
- One place to review activity and recent client errors.

### Typical Use Cases
- Reviewing recent system activity.
- Investigating a captured client error after a user hiccup.

### Who Uses It
Admin / Owner.

### Where It Appears
`/activity`.

### Inputs
Activity records; captured client errors (ring buffer).

### Outputs
Activity feed and a caught-errors list.

### Related Features
Security & Multi-tenancy · Toasts & Confirmations.

### Important Business Rules
- Client errors/rejections are captured globally into a capped on-device ring buffer surfaced here. **✅ Confirmed**

### Limitations
- **The audit log's server-side auto-population is incomplete** — today activity is largely recorded in the demo/mock layer, with server-side triggers noted as a follow-up. Treat auditability as partial. **✅ Confirmed**

### Future Enhancement Ideas
Complete server-side audit triggers, error-monitoring integration (e.g., Sentry hook point already marked), exportable audit trails.

---

## Demo Data Reset

### Overview
A one-action reset that wipes operational data back to a clean, deterministic starting state while preserving the yard and its owner login — ideal for demos, training, and trials. **✅ Confirmed**

### Purpose
Let anyone explore or demo the full platform with realistic data and reset it on demand.

### Business Value
- Frictionless sales demos and training without setup.
- Zero-infra evaluation via the built-in demo backend.

### User Benefits
- Explore freely, then reset to a pristine state.
- No risk of "messing up" a demo permanently.

### Typical Use Cases
- Resetting after a sales demo.
- Giving a new user a clean sandbox to practice in.

### Who Uses It
Admin / Owner.

### Where It Appears
`/settings` (demo reset). Also available as an operator SQL reset on the live backend.

### Inputs
Reset confirmation.

### Outputs
Operational data cleared to a seeded baseline; yard + owner preserved.

### Related Features
Yard Settings · Zero-infra demo mode (built-in mock backend).

### Important Business Rules
- Reset preserves the yard row and admin owner (login survives) and restores a deterministic seed. **✅ Confirmed**

### Limitations
- Destructive to operational data by design; intended for demo/training, not production housekeeping. **✅ Confirmed**

### Future Enhancement Ideas
Selective reset by module, snapshot/restore of a demo state.

---

## Print Suite

### Overview
Four self-contained, zero-dependency document printers — GST invoice, quotation, dispatch gate pass (with embedded tracking QR), and 80×110 mm block QR label — each printing in an isolated popup so the app is never disturbed. **✅ Confirmed** (a "hidden gem")

### Purpose
Produce professional, print-ready physical documents directly from the browser.

### Business Value
- Compliant, branded paperwork without external tools.
- Reliable printing that never breaks the running app.

### User Benefits
- Consistent, polished documents every time.
- Invoices include amount-in-words and a live seller block; gate passes carry a scannable tracking QR.

### Typical Use Cases
- Printing a GST invoice or quotation.
- Issuing a gate pass at loading.
- Printing a block QR label.

### Who Uses It
Admin / Owner and Supervisor.

### Where It Appears
Invoices/Orders, Quotations, Dispatches, and inventory (label).

### Inputs
The relevant record and yard profile.

### Outputs
Print-ready A4 documents / a labeled QR sticker via an isolated print popup.

### Related Features
GST Invoicing · Quotation Wizard · Dispatch & Gate Pass · Block QR Label Printing.

### Important Business Rules
- Printing occurs in a separate popup and calls print there, leaving the app's interface untouched. **✅ Confirmed**
- The gate pass is explicitly marked "not a tax invoice." **✅ Confirmed**

### Limitations
- Browser-print based; no server-generated archival PDFs. **💡 Inferred**

### Future Enhancement Ideas
Server-side PDF archival, template theming, multi-language document output.

---

# 🔐 17. Security & Multi-tenancy

## Multi-Tenant Isolation

### Overview
Every business record is scoped to a yard, and access is enforced at the data layer so one yard can never see or touch another's data — the backbone that makes ShilaTeq safe to run as shared infrastructure. **✅ Confirmed**

### Purpose
Guarantee strict data isolation between yards on a shared platform.

### Business Value
- Trust: a yard's stock, customers, and finances are private.
- Enables the platform to serve many yards on one system safely.

### User Benefits
- Confidence that data is private and protected.
- No accidental cross-yard leakage.

### Typical Use Cases
- Multiple yards using the platform without seeing each other.
- Public endpoints exposing only safe, scoped data.

### Who Uses It
All roles (invisible infrastructure).

### Where It Appears
Everywhere data is read or written.

### Inputs
Authenticated identity and yard membership.

### Outputs
Data views and writes strictly scoped to the user's yard.

### Related Features
Role-Based Access & Worker Auth · Public QR Block Card · Public Dispatch Tracking · Lead Capture.

### Important Business Rules
- Reads are member-scoped and writes admin-scoped across all business tables; new records are stamped with the correct yard and verified on write. **✅ Confirmed**
- Public exposure is never a broad policy — only narrow, safe-columns-only public paths (QR card, catalog, dispatch token, lead submit). **✅ Confirmed**
- Privileged operations are locked to the service role and can't be called by ordinary users. **✅ Confirmed**

### Limitations
- Single-warehouse scoping per yard; multi-yard org roll-ups are limited. **✅ Confirmed**

### Future Enhancement Ideas
Organization/group tier with cross-yard roll-ups and central admin.

---

## Role-Based Access & Worker Auth

### Overview
Three surfaces (admin, worker, public) gated by role, with a friction-free **username-only worker login** provisioned by admins — plus driver scoping so a driver sees only their own deliveries. **✅ Confirmed**

### Purpose
Give each person exactly the access they need — no more — while making worker login practical on the shop floor.

### Business Value
- Least-privilege access protects sensitive data (workers never see pricing/margins).
- Username-only login removes the biggest adoption barrier for low-literacy staff.

### User Benefits
- Admins get the full platform; workers get a focused, safe subset.
- Workers log in with just a username.
- Drivers see only their deliveries.

### Typical Use Cases
- An owner using all admin tools.
- A cutter logging in with a username to see their tasks.
- A driver seeing only their assigned dispatches.

### Who Uses It
Admin, Worker, Driver (a worker role), Public.

### Where It Appears
Route access control throughout; worker provisioning from `/workers`; login at `/login`.

### Inputs
Credentials (admin: email + password; worker: username); yard role/membership.

### Outputs
Role-appropriate access to screens and data.

### Related Features
Worker Directory & Login Provisioning · Multi-Tenant Isolation · Driver Delivery App · Worker Self-Service Earnings.

### Important Business Rules
- Role resolution prefers yard ownership, then admin membership, then defaults to worker; it's stable across token refreshes. **✅ Confirmed**
- Worker accounts are provisioned by that yard's owner/admin only; login is username-only and failures are masked as "Wrong username or password." **✅ Confirmed**
- Drivers (workers linked to a dispatch) see only their own deliveries. **✅ Confirmed**
- Pricing and margins are hidden from workers throughout. **✅ Confirmed**

### Limitations
- **No owner self-signup** — admin accounts are provisioned externally; workers via admin. **✅ Confirmed**

### Future Enhancement Ideas
Owner self-signup, granular custom roles/permissions, single sign-on, worker PIN/biometric login.

---

# 🧩 Cross-Cutting Platform Capabilities

These platform-wide capabilities aren't a single screen but shape the entire product experience — several are ShilaTeq's signature "hidden gems."

## Procedural Stone Art

### Overview
All stone imagery in the showroom and 3D hero is **procedurally generated** as deterministic, offline-safe textures across many palettes and finishes — no photo library required, usable as image, CSS, or 3D texture. **✅ Confirmed** (a "hidden gem")

### Purpose
Render beautiful, consistent stone visuals everywhere without depending on (or storing) real photos.

### Business Value
- A polished showroom even for yards that haven't photographed stock.
- Offline-safe, lightweight, and infinitely variable visuals.

### User Benefits
- Attractive, uniform stone rendering.
- Works without network or asset downloads.

### Typical Use Cases
- Powering the 3D hero and showcase tiles.
- Providing swatches where real photos are absent.

### Who Uses It
Public (in the catalog); infrastructure for the showroom.

### Where It Appears
Public 3D showroom (hero cube faces, showcase).

### Inputs
Palette and finish selection.

### Outputs
Deterministic stone textures (polished/honed/leathered).

### Related Features
Public 3D Showroom Catalog · Per-Block Price Gating.

### Important Business Rules
- Imagery is procedural (the single real photo is the hero backdrop). **✅ Confirmed**

### Limitations
- Stylized rather than photorealistic for specific real slabs. **💡 Inferred**

### Future Enhancement Ideas
Blend real photos with procedural finishes, per-variety texture tuning.

---

## Performance & Resilience

### Overview
A layer of engineering that keeps the app fast and unbreakable: code-splitting with idle pre-warming, shape-matched loading skeletons (zero layout shift), memoized lists, lean list payloads (photos excluded), and **self-healing** recovery from stale-deploy chunk errors via a one-shot reload. **✅ Confirmed** (includes "hidden gems")

### Purpose
Deliver a snappy, stable experience on modest phones and through deploys.

### Business Value
- Fast app on worker-grade devices drives adoption.
- Self-healing means a mid-deploy user is never stranded on a broken screen.

### User Benefits
- Quick loads and smooth navigation.
- No jarring layout shifts; graceful recovery from stale-code errors.

### Typical Use Cases
- Navigating large inventory lists quickly.
- Continuing seamlessly right after a new version deploys.

### Who Uses It
All users (invisible infrastructure).

### Where It Appears
Across the app.

### Inputs
Navigation and data loads.

### Outputs
Fast, stable, self-recovering UI.

### Related Features
Live Sync · Block Inventory Directory · Public 3D Showroom Catalog.

### Important Business Rules
- Multi-megabyte photos are kept out of list queries; images are downscaled on upload. **✅ Confirmed**
- Stale-deploy/dynamic-import failures trigger a single debounced reload so users never strand on a broken chunk. **✅ Confirmed**

### Limitations
- Client-side performance techniques; no CDN/edge-caching claims made here. **💡 Inferred**

### Future Enhancement Ideas
Image CDN, virtualized long lists, further bundle trimming.

---

## PWA & Installability

### Overview
ShilaTeq is a mobile-first, installable progressive web app: it ships app icons and a manifest so it can be added to a phone home screen, and rich social meta so shared links unfurl into branded preview cards. **✅ Confirmed**

### Purpose
Deliver an app-like presence on any phone without app-store friction.

### Business Value
- Reaches any device with a browser — no store approvals or installs required.
- Professional link previews aid marketing and sharing.

### User Benefits
- Install to home screen for quick access.
- Shared catalog/links look polished on WhatsApp/social.

### Typical Use Cases
- A worker adding the app to their home screen.
- A yard sharing a catalog link that unfurls into a rich card.

### Who Uses It
All users.

### Where It Appears
Platform-wide (manifest, icons, social meta).

### Inputs
Browser install prompt; link sharing.

### Outputs
Installable app entry; rich link previews.

### Related Features
Public 3D Showroom Catalog · Catalog Sharing.

### Important Business Rules
- A manifest and branded icons exist for installability; static social meta covers every route so crawlers get rich previews. **✅ Confirmed**

### Limitations
- **No native mobile app** (web/PWA only), and **no offline caching service worker** for the admin app — installability without full offline support. **✅ Confirmed**

### Future Enhancement Ideas
Full service-worker offline caching, native app wrappers, push notifications.

---

# 📌 Feature summary & confidence note

ShilaTeq spans roughly **60 distinct features** across **17 domains** — from QR block identity and the partial-cut engine to GST invoicing, the offline outbox, the 3D showroom, and multi-tenant security. Most capabilities are **✅ Confirmed** directly from the platform's behavior; a handful of framings (ROI, market fit, and some limitation nuances) are marked **💡 Inferred**.

**Deliberate design choices (not gaps):** single warm-stone theme (no dark mode), WhatsApp-first messaging (no email/SMS), manual payment recording (no online gateway), admin-provisioned accounts (no owner self-signup), and worker-only offline (no admin service-worker caching). **Genuinely partial/planned:** complete server-side audit-log population, and four richer catalog components (featured rail, stone index, filter bar, light-sweep tile) that are built but not yet wired into the public showroom.

**Where to go next:**
- Understand the logical grouping of these features → [Modules](03_Modules.md)
- See who can do what → [User Roles](04_User_Roles.md)
- Walk the end-to-end flows → [User Journeys](05_User_Journeys.md) · [Business Workflows](07_Business_Workflows.md)
- Screen-by-screen detail → [Screens & Pages](06_Screens_and_Pages.md)
- Reporting depth → [Reports & Analytics](08_Reports_and_Analytics.md)
- All alerts and messaging → [Notifications](09_Notifications.md)

---

*Part of the **ShilaTeq (StoneX) Product Documentation Hub**. ShilaTeq is the operating system for stone yards — every block, cut, rupee, and customer, from any phone, even offline.*
