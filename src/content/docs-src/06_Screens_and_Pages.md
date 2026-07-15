# 🖥️ Screens & Pages

> Every screen in **ShilaTeq (StoneX)** — admin, worker, and public — documented from the user's point of view: what they see, what they can do, and why it matters.

[← Back to Documentation Hub](README.md)

---

This is the complete screen reference for the platform. ShilaTeq is a mobile-first responsive web app with three surfaces: the **Admin app** (the full operations platform, ~26 screens), the **Worker app** (a focused, bilingual, offline-first set of 7 screens), and **Public pages** (no login — the showroom, a block's QR identity card, and delivery tracking).

Each screen is documented with a consistent structure: **Purpose · Key information displayed · Available actions · Navigation · Connected features · Business importance.** Descriptions are from the user's perspective — what appears on screen and what they can do — not the underlying implementation. Notable claims are tagged **✅ Confirmed** or **💡 Inferred**.

**Related reading:** [Features](02_Features.md) · [User Roles](04_User_Roles.md) · [User Journeys](05_User_Journeys.md) · [Business Workflows](07_Business_Workflows.md) · [Reports & Analytics](08_Reports_and_Analytics.md)

> **Access rules in brief:** the Admin app is admin-only. Worker screens are open to both workers and admins. Public pages need no login. A **driver** is a worker assigned to a dispatch — there is no separate driver login. See [User Roles](04_User_Roles.md).

---

## 📇 All screens at a glance

| Area | Screen | Route | Who |
|---|---|---|---|
| **Auth** | Login | `/login` | Everyone |
| **Overview / BI** | Dashboard | `/dashboard` | Admin |
| | Reports & Analytics | `/reports` | Admin |
| **Inventory** | Inventory Directory | `/inventory` | Admin |
| | Add Block (tag wizard) | `/inventory/add` | Admin |
| | Block Detail | `/inventory/:id` | Admin |
| | Edit Block | `/inventory/:id/edit` | Admin |
| | Inventory Analytics | `/inventory/analytics` | Admin |
| | Slabs | `/slabs` | Admin |
| | Find Stone | `/find` | Admin |
| **Sales** | Leads Inbox | `/leads` | Admin |
| | Quotations | `/quotations` | Admin |
| | Quotation Detail | `/quotations/:id` | Admin |
| | Orders | `/orders` | Admin |
| | Order Detail (pipeline hub) | `/orders/:id` | Admin |
| | Order Returns (RMA) | `/orders/:id/returns` | Admin |
| | Customers & History | `/customers` | Admin |
| | Invoices | `/invoices` | Admin |
| | Dispatches | `/dispatches` | Admin |
| | Dispatch Detail | `/dispatches/:id` | Admin |
| **Procurement** | Suppliers | `/suppliers` | Admin |
| | Purchases (POs) | `/purchases` | Admin |
| | Purchase Order Detail | `/purchases/:id` | Admin |
| **Workforce** | Workers Directory | `/workers` | Admin |
| | Worker Detail | `/workers/:id` | Admin |
| | Attendance Register | `/attendance` | Admin |
| **Finance / System** | Finance | `/finance` | Admin |
| | Expenses | `/expenses` | Admin |
| | Activity Log | `/activity` | Admin |
| | Settings | `/settings` | Admin |
| **Worker app** | Worker Dashboard | `/worker/dashboard` | Worker + Admin |
| | Task Progress | `/worker/task/:id` | Worker + Admin |
| | Cut Block | `/worker/cut/:id` | Worker + Admin |
| | Deliveries | `/worker/deliveries` | Worker + Admin |
| | My Pay (Earnings) | `/worker/earnings` | Worker + Admin |
| | Worker Find | `/worker/find` | Worker + Admin |
| | Scan QR | `/scan` | Worker + Admin |
| **Public** | Catalog Showroom | `/catalog(/:yardSlug)` | Public |
| | QR Block Card | `/qr/:qrCodeId` | Public |
| | Track Dispatch | `/track/:token` | Public |

---

# 🔐 Auth

## Login
**Route:** `/login`

| | |
|---|---|
| **Purpose** | Single entry point for both admins and workers; routes each to their home screen. |
| **Key information** | Branded StoneX sign-in card. Admins enter **email + password**; workers enter **username only** (no email or complex password to remember). ✅ Confirmed |
| **Available actions** | Sign in. On success, admins land on `/dashboard` and workers on `/worker/dashboard`. Failed logins show a single, deliberately generic message (*"Wrong username or password."*) so no account details leak. ✅ Confirmed |
| **Navigation** | Redirects to the correct home by role after login; already-authenticated users visiting `/login` are bounced to their home. |
| **Connected features** | Role resolution, multi-tenant scoping (a user only ever sees their own yard's data). |
| **Business importance** | The worker-friendly **username-only** login is what makes the shop floor actually adopt the app — no email literacy required. ✅ Confirmed |

---

# 📊 Admin — Overview & BI

## Dashboard
**Route:** `/dashboard`

| | |
|---|---|
| **Purpose** | The owner's command center — triages the day and surfaces exactly what needs action. |
| **Key information** | A greeting header with the yard name; four hero **KPIs** — *To Collect*, *To Pay*, *Stock Value*, *Sales this month*. A **"Needs your attention"** action center with severity-ranked cards: overdue receivables (>30 days), orders ready to dispatch, deliveries in transit, aging/critically-aged blocks, written-off stock, pending attendance, wages & supplier payables, POs to receive. An **operational snapshot** (Orders: reserved/processing/ready-to-dispatch · Deliveries: pending/in-transit/delivered-today · Team: on-duty/available/busy). ✅ Confirmed |
| **Available actions** | Tap any KPI or alert to jump straight to the relevant screen; **Quick actions** row: New Order, New Quote, Finance, Attendance, Find Stone. ✅ Confirmed |
| **Navigation** | Deep-links into Finance (receivables/payables tabs), Orders, Dispatches, Inventory, Reports, Attendance, Workers. |
| **Connected features** | Live sync (auto-refreshes on any change), the alerts engine, aging thresholds from Settings. |
| **Business importance** | Replaces "the owner's memory" with a prioritised worklist — the first screen every day, and the one that prevents money and stock from slipping through the cracks. ✅ Confirmed |

## Reports & Analytics
**Route:** `/reports`

| | |
|---|---|
| **Purpose** | The business-intelligence hub — five tabs of analytics over a chosen date range. |
| **Key information** | **P&L** (revenue, COGS using sale-time cost snapshots, expenses, write-offs, net), **Sales**, **Inventory**, **Profitability**, and **Receivables** (aging buckets, DSO). Each panel shows KPIs with period-over-period **delta chips**, mini **sparklines**, and plain-language insight strips. Date presets are built in. ✅ Confirmed |
| **Available actions** | Switch tabs, change the date range/preset, and **export** — whole-report **PDF/Excel/Print**, plus per-panel **CSV** and **PNG**. ✅ Confirmed |
| **Navigation** | Reached from the sidebar and the Dashboard "Sales this month" KPI and write-off alert. |
| **Connected features** | Pulls from orders, payments, inventory, expenses, and damage logs; COGS uses frozen sale-time costs so past reports never rewrite themselves. |
| **Business importance** | Turns day-to-day operations into owner-level insight (margin, DSO, sell-through, gangsaw recovery) with exports for the accountant. See [Reports & Analytics](08_Reports_and_Analytics.md). ✅ Confirmed |

---

# 📦 Admin — Inventory

## Inventory Directory
**Route:** `/inventory`

| | |
|---|---|
| **Purpose** | The master list of every block in the yard. |
| **Key information** | A fast, memoized table/card view of blocks: code, stone type/variety, dimensions, quantity (sqft), status, location, age (colour-coded against amber/red thresholds), and price. Six filters narrow the list. ✅ Confirmed |
| **Available actions** | Search & filter; open a block; **export CSV**; open a block's **QR** modal; **share the public catalog** link (copy / open / WhatsApp). Add-block entry point. ✅ Confirmed |
| **Navigation** | To Block Detail, Add Block, Inventory Analytics, Slabs; out to the public catalog. |
| **Connected features** | QR identity, aging alerts, the public showroom (via the Catalog button), CSV export (formula-injection-safe). |
| **Business importance** | The single source of truth for "what stone do we have, where, how old, and worth what." ✅ Confirmed |

## Add Block (Tag Wizard)
**Route:** `/inventory/add`

| | |
|---|---|
| **Purpose** | Manually tag a new block into inventory (the alternative to receiving via a PO). |
| **Key information** | A **3-stage wizard** collecting the block's identity, dimensions, grade/finish, location, and pricing; supports up to **5 photos** (auto-downscaled to keep the app light). A QR code is minted for the block. ✅ Confirmed |
| **Available actions** | Fill the required fields (selling price required for admins), attach photos, submit to create the block with a fresh code and QR. |
| **Navigation** | Returns to Inventory / the new Block Detail. |
| **Connected features** | QR minting, image downscaling, block-code prefix from Settings. |
| **Business importance** | Captures stock that arrives outside a purchase order (e.g. legacy yard stock) so *every* block has a digital identity. ✅ Confirmed |

## Block Detail
**Route:** `/inventory/:id`

| | |
|---|---|
| **Purpose** | The full record for one block — its identity, economics, and lifecycle actions. |
| **Key information** | Photo gallery, code & QR, stone type/variety, dimensions, quantity, grade, finish, location, status, age, cost basis, selling price, and a **carrying-cost** estimate; per-slab margin where cut. ✅ Confirmed |
| **Available actions** | **Cut into slabs** (admin full-cut modal), **mark damaged / write off**, edit, view/print the block QR label, opt the block into the public catalog. ✅ Confirmed |
| **Navigation** | To Edit Block, to the worker Cut screen, back to Inventory. |
| **Connected features** | Cut engine, damage/RMA logging, carrying-cost model, catalog price gating. |
| **Business importance** | Where a block's economics live — its cost, its age risk, and the decision to cut, hold, or write it off. ✅ Confirmed |

## Edit Block
**Route:** `/inventory/:id/edit`

| | |
|---|---|
| **Purpose** | Correct or update a block's attributes. |
| **Key information** | Editable form of the block's fields, including the **"show price publicly"** catalog opt-in toggle. ✅ Confirmed |
| **Available actions** | Update fields and save; toggle public price visibility. |
| **Navigation** | Back to Block Detail. |
| **Connected features** | Public catalog price gating, inventory list. |
| **Business importance** | Keeps records accurate and gives per-block control over what the public showroom reveals. ✅ Confirmed |

## Inventory Analytics
**Route:** `/inventory/analytics`

| | |
|---|---|
| **Purpose** | Per-block financial analytics across the whole yard. |
| **Key information** | Lifetime **P&L per block** and **aging buckets** — which stock is making money and which is sitting too long. ✅ Confirmed |
| **Available actions** | Review, sort, and identify slow-movers / carrying-cost risks. |
| **Navigation** | From Inventory; complements Reports. |
| **Connected features** | Aging thresholds, carrying-cost model, costing engine. |
| **Business importance** | Surfaces dead capital tied up in aged stone so the owner can act (discount, cut, or clear). ✅ Confirmed |

## Slabs
**Route:** `/slabs`

| | |
|---|---|
| **Purpose** | The inventory of cut slabs (gangsaw output). |
| **Key information** | Slab list with code, parent block, dimensions/thickness, finish, grade, recovery-adjusted cost, price, and status. ✅ Confirmed |
| **Available actions** | Inline, **optimistic status changes**; review slab economics; slabs also surface in the public catalog. ✅ Confirmed |
| **Navigation** | Links back to parent blocks; feeds order/quotation selectors. |
| **Connected features** | Partial-cut engine, recovery-adjusted costing, catalog. |
| **Business importance** | Tracks the higher-value finished product distinctly from raw blocks, with honest cost after wastage. ✅ Confirmed |

## Find Stone
**Route:** `/find`

| | |
|---|---|
| **Purpose** | A fast, forgiving finder across blocks *and* slabs. |
| **Key information** | Unified search results with a **typo-tolerant** engine (fuzzy on names, but never on codes/QR digits so `KSH-B0002` can't match `KSH-B0001`). ✅ Confirmed |
| **Available actions** | Search by name, variety, or code; open any result. |
| **Navigation** | To Block/Slab detail. |
| **Connected features** | Shared search engine (also powers worker Find and the public Showcase). |
| **Business importance** | "Find any block in seconds" even with a misspelling — the everyday lookup tool on the floor and in the office. ✅ Confirmed |

---

# 🛒 Admin — Sales

## Leads Inbox
**Route:** `/leads`

| | |
|---|---|
| **Purpose** | The inbox for quote requests captured by the public catalog. |
| **Key information** | Lead cards showing customer name, phone, the specific stone (if any), quantity, message, time-ago, and status; **stat cards double as filters** (New / Contacted / Closed / All) with a live count on New. ✅ Confirmed |
| **Available actions** | **Reply on WhatsApp** (pre-filled message with catalog footer; auto-advances New → Contacted), mark Contacted, Close, Reopen, delete, copy phone, tap through to the linked block. ✅ Confirmed |
| **Navigation** | To the linked Block Detail; onward to Quotations. |
| **Connected features** | Public catalog lead capture, WhatsApp templates, live sync. |
| **Business importance** | Closes the loop from anonymous web visitor to a worked, contacted sales lead — no lead is lost. ✅ Confirmed |

## Quotations
**Route:** `/quotations`

| | |
|---|---|
| **Purpose** | Create and manage price quotes. |
| **Key information** | List of quotations with code, customer, value, validity, and status (draft/sent/accepted/converted/rejected/expired). A **3-step wizard** builds new quotes with a **GST preview**. ✅ Confirmed |
| **Available actions** | Create a quote, add block/slab lines, preview GST; from a quote: mark **Sent**, **Accept**, **Reject**, or **Convert to order**. |
| **Navigation** | To Quotation Detail; convert flows into Orders. |
| **Connected features** | GST engine, inventory selectors, WhatsApp share, print. |
| **Business importance** | Professional, GST-aware quotes — and the key design rule that **quotes hold no stock**, so the yard can pitch the same block to many buyers without locking it. ✅ Confirmed |

## Quotation Detail
**Route:** `/quotations/:id`

| | |
|---|---|
| **Purpose** | The full view of one quotation. |
| **Key information** | Buyer details, line items with rates, GST breakdown, validity, and current status; expiry is computed at read time. ✅ Confirmed |
| **Available actions** | Advance status (send/accept/reject), **print** the quotation, share on **WhatsApp**, and **convert to an order** (which re-checks each line is still available and reserves stock atomically). ✅ Confirmed |
| **Navigation** | Creates and links to the resulting Order on conversion. |
| **Connected features** | Convert-to-order (with race-guard), print suite, catalog QR on the printout. |
| **Business importance** | The bridge from a price offer to a committed, stock-reserving order. ✅ Confirmed |

## Orders
**Route:** `/orders`

| | |
|---|---|
| **Purpose** | The list of all sales orders and the entry point to create one directly. |
| **Key information** | Orders with code, customer, value, paid amount, and pipeline status (reserved → processing → shipped → sold / cancelled); filters and skeleton-loaded lists. ✅ Confirmed |
| **Available actions** | Create a new order via a wizard (select customer + stock, **credit-limit check**, atomic **secure reservation**); open any order. ✅ Confirmed |
| **Navigation** | To Order Detail; from Dashboard quick actions and quote conversion. |
| **Connected features** | Secure reservation (double-booking-proof), credit-limit gate, live sync. |
| **Business importance** | The commercial backbone — every sale is an order, and reservation guarantees two buyers never get the same block. ✅ Confirmed |

## Order Detail (Pipeline Hub)
**Route:** `/orders/:id`

| | |
|---|---|
| **Purpose** | The single hub where an order is fulfilled end-to-end. |
| **Key information** | Order summary, line items with costs, customer, a **status pipeline**, payments & balance, applied store credit, worker assignments, dispatch status, and invoice status. ✅ Confirmed |
| **Available actions** | **Record payments** (cash/UPI/card/bank; overpay-guarded) and apply **store credit**; **edit a reserved order** (add/remove lines with auto re-reserve/release, floored at the paid amount); **assign workers**; **Start Processing** and **Create Dispatch / gate pass** (both **gated on ≥1 confirmed payment**); generate the **GST invoice**; open **Returns**. ✅ Confirmed |
| **Navigation** | To Dispatch Detail, Order Returns, Invoices, Customer History, worker task screens. |
| **Connected features** | Payment gate, sold cascade, dispatch/gate pass, GST invoicing, store-credit ledger, worker assignment. |
| **Business importance** | The operational heart of a sale — it enforces the *no-fulfilment-without-payment* SOP and orchestrates money, stock, labour, and delivery from one place. ✅ Confirmed |

## Order Returns (RMA)
**Route:** `/orders/:id/returns`

| | |
|---|---|
| **Purpose** | Process a return against a **sold** order. |
| **Key information** | Each order line with a return quantity and a **disposition** choice — **Restock** or **Scrap** — plus the computed credit due and loss. ✅ Confirmed |
| **Available actions** | Select lines/quantities and disposition, then process: restocked items return to *available*; scrapped items are **written off** (damage log, estimated loss) and permanently removed from the pool; store credit is booked for any new overpayment. ✅ Confirmed |
| **Navigation** | Back to Order Detail; credit surfaces on Customer History. |
| **Connected features** | Damage/write-off logging, store-credit ledger, COGS reversal. |
| **Business importance** | Handles after-sales correctly — good stock re-sells, damaged stock is honestly written off, and the customer's money is tracked to the rupee. ✅ Confirmed |

## Customers & History
**Route:** `/customers`

| | |
|---|---|
| **Purpose** | The customer directory and per-customer financial history. |
| **Key information** | Each customer's **credit limit**, current **exposure**, a **store-credit** badge/balance, order history, and negotiation logs. ✅ Confirmed |
| **Available actions** | Set/adjust credit limits, review exposure and store credit, view order & payment history. |
| **Navigation** | Into individual orders; feeds the credit-limit gate at order creation. |
| **Connected features** | Credit-limit policy, store-credit ledger, receivables. |
| **Business importance** | Controls credit risk — the yard knows exactly how exposed it is to each buyer before it reserves more stock. ✅ Confirmed |

## Invoices
**Route:** `/invoices`

| | |
|---|---|
| **Purpose** | The register of issued GST tax invoices. |
| **Key information** | List of invoices with number, order, buyer, value, and date; one invoice per order. ✅ Confirmed |
| **Available actions** | View and **reprint** any invoice (GST split, HSN 6802, amount-in-words, live seller block, catalog QR footer). ✅ Confirmed |
| **Navigation** | Linked from Order Detail. |
| **Connected features** | GST engine, print suite, catalog QR. |
| **Business importance** | Compliant, reprintable tax invoices — the legal record of every sale. ✅ Confirmed |

## Dispatches
**Route:** `/dispatches`

| | |
|---|---|
| **Purpose** | The list of all outbound deliveries / gate passes. |
| **Key information** | Dispatches with code, order, vehicle/transporter, driver, and status (dispatched → in_transit → delivered), plus a ledger tab. ✅ Confirmed |
| **Available actions** | Open a dispatch, reprint the gate pass, assign a driver, access the public tracking QR. |
| **Navigation** | To Dispatch Detail and the linked order. |
| **Connected features** | Gate-pass printing, driver assignment, public tracking, sold-cascade reconciliation. |
| **Business importance** | Logistics visibility — what's leaving, what's on the road, and what's landed. ✅ Confirmed |

## Dispatch Detail
**Route:** `/dispatches/:id`

| | |
|---|---|
| **Purpose** | The full record of one dispatch. |
| **Key information** | Vehicle/transporter/e-way details, items, a status **timeline** with timestamps, driver, and the tracking token/QR. ✅ Confirmed |
| **Available actions** | **Assign an internal driver** (login-enabled workers), reprint the **gate pass**, share the public **track** link/QR. ✅ Confirmed |
| **Navigation** | To the linked order; to the public tracking page. |
| **Connected features** | Driver deliveries (RLS-scoped), public `/track` page, sold cascade on delivery. |
| **Business importance** | The dispatch control record — and the handoff point to the driver and the customer's tracking link. ✅ Confirmed |

---

# 🏗️ Admin — Procurement

## Suppliers
**Route:** `/suppliers`

| | |
|---|---|
| **Purpose** | Manage vendors and what the yard owes them. |
| **Key information** | Supplier directory with contact details and **payables** (outstanding balances). ✅ Confirmed |
| **Available actions** | Create/edit suppliers; review payables. |
| **Navigation** | Into Purchases (POs reference suppliers). |
| **Connected features** | Purchase orders, supplier payments, finance payables. |
| **Business importance** | Keeps the payables side of the ledger organised and vendor records clean. ✅ Confirmed |

## Purchases (Purchase Orders)
**Route:** `/purchases`

| | |
|---|---|
| **Purpose** | Raise and manage purchase orders. |
| **Key information** | PO list with code, supplier, value, paid amount, and status (draft/ordered/received/cancelled). A **3-step wizard** creates new POs. ✅ Confirmed |
| **Available actions** | Create a PO (supplier + line items), open a PO to receive it, record supplier payments. |
| **Navigation** | To Purchase Order Detail; received POs create blocks in Inventory. |
| **Connected features** | Receive → blocks fan-out, supplier payments, QR minting. |
| **Business importance** | The formal buying process that feeds stock into the yard with a known cost basis. ✅ Confirmed |

## Purchase Order Detail
**Route:** `/purchases/:id`

| | |
|---|---|
| **Purpose** | The full view of one PO and the point of intake. |
| **Key information** | Supplier, line items (type, dimensions, sqft, rate, line total, received flag), status, and paid amount. ✅ Confirmed |
| **Available actions** | **Receive** the PO — one atomic action that flips it to *received* and **fans each line out into a new QR-tagged block**; record **supplier payments**. ✅ Confirmed |
| **Navigation** | To the newly created blocks in Inventory. |
| **Connected features** | Block creation, QR identity, supplier payables. |
| **Business importance** | The moment raw stone enters the system with a permanent identity and cost basis — see [User Journeys §6](05_User_Journeys.md). ✅ Confirmed |

---

# 👷 Admin — Workforce

## Workers Directory
**Route:** `/workers`

| | |
|---|---|
| **Purpose** | Manage the workforce and their app access. |
| **Key information** | Worker list with name, role/skill, status, daily wage, and login state. ✅ Confirmed |
| **Available actions** | Add/edit workers; **provision or remove a username login** (so a worker can use the worker app / act as a driver). ✅ Confirmed |
| **Navigation** | To Worker Detail. |
| **Connected features** | Worker login provisioning, attendance, payroll, driver assignment. |
| **Business importance** | Controls who can access the worker app and be assigned tasks or deliveries. ✅ Confirmed |

## Worker Detail
**Route:** `/workers/:id`

| | |
|---|---|
| **Purpose** | One worker's profile and payroll card. |
| **Key information** | Personal details, wage, attendance summary, earnings/advances/payouts (net owed). ✅ Confirmed |
| **Available actions** | Manage the worker's login, review their payroll, approve advances / record payouts. |
| **Navigation** | From the Workers directory; ties to Attendance and Finance. |
| **Connected features** | Payroll engine, attendance snapshots, advance requests. |
| **Business importance** | The single view of a worker's cost and pay position. ✅ Confirmed |

## Attendance Register
**Route:** `/attendance`

| | |
|---|---|
| **Purpose** | Mark daily attendance and drive payroll. |
| **Key information** | A **calendar register** per worker (present / half-day / absent), with the **daily wage snapshotted** at mark time so later wage edits never rewrite history. ✅ Confirmed |
| **Available actions** | Mark attendance, approve **advance requests**, record **payouts**. |
| **Navigation** | Flagged by the Dashboard "attendance pending" alert; feeds Finance payables. |
| **Connected features** | Payroll (net = wages − advances − payouts), wage snapshots, worker earnings self-service. |
| **Business importance** | Attendance *is* payroll here — marking the register accrues wages honestly and immutably. ✅ Confirmed |

---

# 💰 Admin — Finance & System

## Finance
**Route:** `/finance`

| | |
|---|---|
| **Purpose** | The unified money-in / money-out view. |
| **Key information** | A combined **ledger** merging customer payments (in) with supplier payments, expenses, and wage advances/payouts (out); tabs for receivables and payables. ✅ Confirmed |
| **Available actions** | Review cash position; send **WhatsApp payment reminders** on overdue receivables. ✅ Confirmed |
| **Navigation** | Deep-linked from the Dashboard KPIs and alerts (receivables/payables tabs). |
| **Connected features** | Ledger builder, WhatsApp templates, receivables aging. |
| **Business importance** | One place to see what's owed to the yard and by the yard — the operator's cashflow cockpit. ✅ Confirmed |

## Expenses
**Route:** `/expenses`

| | |
|---|---|
| **Purpose** | The cashbook for operating expenses. |
| **Key information** | Expense entries across **8 categories**, with dates and amounts. ✅ Confirmed |
| **Available actions** | Record/edit/delete expenses; categorise. |
| **Navigation** | Feeds the P&L in Reports and the Finance ledger. |
| **Connected features** | Reporting (net = gross − expenses − write-offs), ledger. |
| **Business importance** | Captures the "out" side that turns revenue into real profit. ✅ Confirmed |

## Activity Log
**Route:** `/activity`

| | |
|---|---|
| **Purpose** | An audit / diagnostics view. |
| **Key information** | An **audit-log** viewer plus a tab of **caught client errors** (a ring buffer of runtime issues). ✅ Confirmed |
| **Available actions** | Review activity and error entries. |
| **Navigation** | From the sidebar. |
| **Connected features** | Error capture sink, audit log. |
| **Business importance** | Transparency and troubleshooting. **⚠️ Limitation:** server-side audit-log population is incomplete today, so this view is not yet a full audit trail. ✅ Confirmed |

## Settings
**Route:** `/settings`

| | |
|---|---|
| **Purpose** | Configure the yard — the values that drive calculations everywhere. |
| **Key information** | **Yard profile** (name, owner, address, city, **state** = GST place of supply, total area, **block-code prefix**); **Tax & finance** (Seller **GSTIN**, default **GST rate**, **carrying-cost rate**, default **processing cost**); **inventory-aging thresholds** (amber/red days); a **demo-data reset** control. ✅ Confirmed |
| **Available actions** | Edit and save yard settings; reset local demo data. |
| **Navigation** | From the sidebar; changes ripple into Dashboard, Inventory, invoices, and Reports. |
| **Connected features** | GST engine, aging alerts, carrying-cost model, block-code generation, catalog. |
| **Business importance** | The control panel for correctness — one wrong state or GST rate would flow into every invoice, so this screen is set up once and trusted. ✅ Confirmed |

---

# 📱 Worker App

> The worker surface is **mobile-first, bilingual (English / हिंदी)**, and **offline-first**. It is deliberately minimal: a worker sees their tasks, their cuts, their deliveries, and their pay — and nothing about pricing or other people's work. Admins can also open these screens.

## Worker Dashboard
**Route:** `/worker/dashboard`

| | |
|---|---|
| **Purpose** | The worker's home — status, work, and a clear "is my work safe?" signal. |
| **Key information** | A big three-way **status toggle** (Available / Busy / Off); stat tiles (active, done today, pending steps, progress %); a **My Work** list of active assignments with per-task progress; a **slabs I cut** tally; a completed-work history; and a bold **sync chip** (green *Synced* / amber *N syncing* / red *N not synced*). A language toggle (EN/हिं) and a live "last synced" time are always visible. ✅ Confirmed |
| **Available actions** | Set availability status; open a task; toggle language; open the **sync sheet** to retry or clear stuck offline actions; manual refresh. ✅ Confirmed |
| **Navigation** | To Task Progress, Worker Find (to cut), My Pay. |
| **Connected features** | Offline outbox + sync UI, live sync, bilingual dictionary. |
| **Business importance** | Gives a low-literacy user total confidence that their work is captured — the sync chip is legible even in bright sunlight. ✅ Confirmed |

## Task Progress
**Route:** `/worker/task/:assignmentId`

| | |
|---|---|
| **Purpose** | Work through an assigned job step by step, online or off. |
| **Key information** | An **offline-first step checklist** with progress, the current step highlighted, and an offline banner when there's no signal (*"Offline — your progress is saved and will sync automatically."*). ✅ Confirmed |
| **Available actions** | Tap to complete steps (strictly in order); every tap is optimistic and queued locally if offline. Out-of-order or conflicting taps are safely rejected/dropped rather than corrupting state. ✅ Confirmed |
| **Navigation** | Back to the Worker Dashboard. |
| **Connected features** | Offline outbox, conflict-aware sync, idempotent step completion. |
| **Business importance** | The floor gets a reliable digital SOP that works in dead zones and can't be double-applied. ✅ Confirmed |

## Cut Block
**Route:** `/worker/cut/:id`

| | |
|---|---|
| **Purpose** | Record a gangsaw partial cut of a block into slabs. |
| **Key information** | The block being cut, a **consumed-area** input (prefilled with remaining), and rows for each output slab (length × width, thickness, finish, grade). **Pricing is hidden** from the worker. ✅ Confirmed |
| **Available actions** | Enter consumed area and slab rows and submit; the platform computes **recovery %, wastage, remnant**, mints the slabs, closes the parent block, and creates a remnant block for any leftover — with an **idempotency guard** so a block can never be cut twice. ✅ Confirmed |
| **Navigation** | Reached from the QR card, Worker Find, or a scan; returns to the dashboard. |
| **Connected features** | Partial-cut engine, recovery-adjusted slab costing, offline sync. |
| **Business importance** | Turns raw blocks into sellable slabs with accurate yield and cost — the core manufacturing event — captured by the person doing it. ✅ Confirmed |

## Deliveries
**Route:** `/worker/deliveries`

| | |
|---|---|
| **Purpose** | A driver's list of their delivery runs. |
| **Key information** | **Only the logged-in driver's** assigned dispatches (RLS-scoped on the live backend), each with its current status; bilingual UI. ✅ Confirmed |
| **Available actions** | Forward-only **Mark In Transit** → **Mark Delivered** (optimistic, with toasts). Marking delivered triggers the sold cascade that completes the order. ✅ Confirmed |
| **Navigation** | Self-contained; feeds admin Dispatches/Dashboard live. |
| **Connected features** | Sold cascade, dispatch reconciliation, live sync. |
| **Business importance** | The driver closes the sale from the field with one tap, and sees only their own work. ✅ Confirmed |

## My Pay (Earnings)
**Route:** `/worker/earnings`

| | |
|---|---|
| **Purpose** | Worker self-service view of attendance and pay. |
| **Key information** | A **month calendar** of the worker's own attendance (present/half/absent) with monthly counts; a money summary (**Earned / Paid / Net balance**); **payment history** (advances & payouts); and an **advance-requests** list. Everything is scoped to just this worker. ✅ Confirmed |
| **Available actions** | Browse months; **request an advance** (amount + optional note). ✅ Confirmed |
| **Navigation** | From the worker dashboard. |
| **Connected features** | Payroll engine, attendance snapshots, advance-approval workflow. |
| **Business importance** | Transparency for the worker (no more "how much am I owed?") and a clean request channel that flows to admin approval. ✅ Confirmed |

## Worker Find
**Route:** `/worker/find`

| | |
|---|---|
| **Purpose** | Let a worker look up a block/slab to act on it. |
| **Key information** | The same typo-tolerant search results, in the worker's language. ✅ Confirmed |
| **Available actions** | Search and open a block, typically to cut it. |
| **Navigation** | To the Cut screen. |
| **Connected features** | Shared search engine, cut flow. |
| **Business importance** | The floor can find the exact block to work on without needing the admin app. ✅ Confirmed |

## Scan QR
**Route:** `/scan`

| | |
|---|---|
| **Purpose** | Camera-based QR scanning to jump to a block instantly. |
| **Key information** | A live camera view (rear-camera preferred) with a manual-paste fallback. ✅ Confirmed |
| **Available actions** | Scan a block's QR (native detector with a JS fallback for older browsers) to open its record/actions. ✅ Confirmed |
| **Navigation** | To the block's identity/detail or cut flow. |
| **Connected features** | QR identity system, camera scanning with fallback. |
| **Business importance** | "Point your phone at a block and know everything about it" — the signature fast-lookup on the yard floor. ✅ Confirmed |

---

# 🌐 Public Pages

> Public pages need **no login** and carry no app chrome. They expose only safe, curated information — never purchase prices, suppliers, or exact stock locations.

## Catalog Showroom
**Route:** `/catalog` and `/catalog/:yardSlug`

| | |
|---|---|
| **Purpose** | The yard's public, shareable 3D stone showroom and lead-capture front door. |
| **Key information** | A cinematic hero with a **WebGL marble block** (a pure-CSS cube fallback ensures it never breaks), a **Showcase grid** of the yard's **available** stock, a stats band, and a full-screen **stone detail** overlay. Prices appear **only where the yard opted in**, else **"On request."** Stone imagery is procedurally generated for a consistent, offline-safe look. A one-per-session branded intro plays first. With no slug, the app auto-selects a single yard or shows a chooser. ✅ Confirmed |
| **Available actions** | Browse and search stock, open stone details, and **Request a Quote** (name, phone, quantity, message). ✅ Confirmed |
| **Navigation** | Submitting a quote creates a lead in the admin **Leads** inbox; shared links unfurl into rich preview cards. |
| **Connected features** | Lead capture, per-block price gating, WhatsApp reply loop, catalog QR on printed invoices/quotes. |
| **Business importance** | Turns any stone yard into an always-on digital showroom that converts web visitors into structured leads — a genuine differentiator for a traditionally offline trade. ✅ Confirmed |

## QR Block Card
**Route:** `/qr/:qrCodeId`

| | |
|---|---|
| **Purpose** | A public, safe "identity card" for a single block, opened by scanning its QR. |
| **Key information** | Branded card with the block code, stone variety/type, a status banner (Available / Reserved / Sold), size, quantity, grade, finish, zone-level location, and age in yard. It shows **only safe fields** — no purchase price or supplier; a reserving customer's name is hidden from the public and revealed only to logged-in staff. ✅ Confirmed |
| **Available actions** | Public: view. Logged-in staff get extra buttons — **Cut into Slabs** (if available) and, for admins, **Open full block record**. ✅ Confirmed |
| **Navigation** | Staff can jump to the Cut screen or Block Detail; public users see the card only. |
| **Connected features** | QR identity system, safe public lookup, cut flow (staff). |
| **Business importance** | Anyone in the yard — including a walk-in customer — can point a phone at a block and get a trustworthy, privacy-safe fact sheet. ✅ Confirmed |

## Track Dispatch
**Route:** `/track/:token`

| | |
|---|---|
| **Purpose** | Public, no-login delivery tracking and driver/transporter self-report. |
| **Key information** | A branded card with the order/delivery code, customer, item count, a **status timeline** with timestamps (packed → dispatched → in transit → delivered), and driver/vehicle/transporter details — **no prices**. ✅ Confirmed |
| **Available actions** | Whoever holds the link can advance the status **forward only** (*Mark In Transit*, *Mark Delivered*) and add an optional delivery note. ✅ Confirmed |
| **Navigation** | Reached via the tracking link/QR printed on the gate pass or shared on WhatsApp. |
| **Connected features** | Gate pass, dispatch lifecycle, sold-cascade reconciliation. |
| **Business importance** | Gives customers and third-party transporters live delivery visibility and a way to self-report — without any account or exposure of sensitive data. ✅ Confirmed <br>**⚠️ Note:** the public token flow is a live-backend feature. |

---

*Part of the **ShilaTeq (StoneX) Product Documentation Hub**. See also [User Journeys](05_User_Journeys.md), [Features](02_Features.md), and [Business Workflows](07_Business_Workflows.md).*
