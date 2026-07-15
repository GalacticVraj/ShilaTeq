# 🚀 Product Opportunities & Roadmap

> An honest look at where ShilaTeq (StoneX) can go next — the real gaps to close, the enterprise and AI capabilities to add, and the forward bets worth making — each tied to concrete business value.

[← Back to Documentation Hub](README.md)

---

## Overview

A strong product earns the right to a candid improvement list. ShilaTeq today is a live, capable operating system for a single stone yard — but it was deliberately scoped, and it has clear, well-understood room to grow. This page organizes those opportunities by theme, grounds each in the product's actual current state, and — most importantly — states the **business value** of closing each gap.

Two conventions are used throughout:
- **✅ Confirmed gap** — a limitation directly evidenced in the product today.
- **💡 Speculative** — a forward-looking idea that's a reasonable, valuable bet but not yet designed.

> **Note:** Nothing here undercuts the product's current value. These are the *next* moves for a system that already runs the core business end-to-end. Read them as a roadmap, not a report card.

---

## 🎯 Prioritization Snapshot

A quick, opinionated read on impact vs. effort. "Impact" is business value to the target customer; "Effort" is relative build cost. Detailed write-ups follow.

| Opportunity | Impact | Effort | Business Value |
|---|---|---|---|
| **Installable native/PWA mobile app** | High | Low–Med | Home-screen presence, camera reliability, retention |
| **Complete audit-log auto-population** | High | Low–Med | Trust, accountability, dispute resolution, compliance |
| **Optional online payment / UPI collection** | High | Med | Faster cash-in, auto-reconciliation, fewer disputes |
| **Automated WhatsApp reminders (Business API)** | High | Med | Hands-off collections, better cash flow |
| **Accounting-software (Tally/Zoho) sync** | High | Med | Removes double entry, wins the accountant's vote |
| **Multi-yard organisation rollups** | High | Med–High | Unlocks multi-branch & group customers (bigger deals) |
| **Wire up the ready-made catalog components** | Med | Low | Richer showroom, more leads, quick win |
| **Full admin offline support** | Med | Med–High | Office keeps working through outages |
| **AI stone classifier from photos** | High | High | Faster, error-free tagging; a standout differentiator |
| **Demand forecasting & smart reorder** | High | High | Less dead capital, fewer stockouts |
| **E-invoicing / e-way-bill APIs** | Med–High | Med | Compliance at scale for larger yards |
| **AR "view in my space" in the showroom** | Med | High | Premium buyer experience, higher conversion |
| **Buyer-side marketplace** | High | High | Network effects; new revenue model |
| **RLS / permission hardening follow-ups** | High | Low | Closes security edges before scale |

---

## 🧩 Missing Features

Concrete capabilities the product doesn't have yet, each with a clear reason it matters.

### Installable mobile app experience ✅ Confirmed gap
ShilaTeq is a web app (installable to the home screen, but not a native app in the app stores).
- **What to add:** a polished installable experience — reliable "Add to Home Screen," app icon, splash — and eventually native store presence.
- **Business value:** a home-screen icon dramatically improves daily return usage; native packaging can improve camera/scan reliability and offline behaviour. Retention and adoption both rise.

### Complete the audit trail ✅ Confirmed gap
An activity/audit view exists, but automatic server-side population of the audit log is incomplete today.
- **What to add:** automatic, tamper-evident logging of every sensitive action (payments, price edits, status changes, logins) directly at the data layer.
- **Business value:** accountability and trust — who did what, when. Critical for dispute resolution, staff oversight, and any future compliance or investor due-diligence.

### Owner self-signup & onboarding ✅ Confirmed gap
New yard accounts are provisioned externally rather than through self-service signup.
- **What to add:** a guided self-signup and first-run onboarding wizard (create yard, set GSTIN and GST rate, tag a first block).
- **Business value:** removes a human step from every new customer — essential for scaling sales beyond hands-on onboarding.

### Deeper returns, quality, and grading tooling 💡
Returns/RMA and damage write-offs exist; grading is captured but light.
- **What to add:** richer grading workflows, defect photo capture on returns, quality-hold states.
- **Business value:** better dispute handling and tighter quality accounting on high-value material.

---

## 🏢 Enterprise Enhancements

Capabilities that unlock larger, multi-location, and more governance-conscious customers.

### Multi-yard organisation rollups ✅ Confirmed gap
The platform is strongest as one yard per account; cross-yard group views are limited.
- **What to add:** an organisation layer so a group owner sees consolidated stock, cash, and margin across all their yards, with per-yard drill-down and inter-yard stock transfers.
- **Business value:** moves ShilaTeq up-market to multi-branch operators and stone groups — larger contracts and stickier accounts.

### Granular roles & permissions 💡
Today's roles (admin, worker, driver, public) are clear but coarse.
- **What to add:** finer permissions (e.g., a manager who can quote but not edit prices; a cashier who records payments but not dispatches) and an activity-scoped access model.
- **Business value:** larger yards need separation of duties; it's also a control that reduces fraud and error.

### Security & isolation hardening follow-ups ✅ Confirmed gap
The multi-tenant model is enforced at the data layer, with several hardening items already tracked (privileged-function lockdown, payment caps). A few follow-ups remain.
- **What to add:** finish the remaining permission-revocation and isolation hardening passes; formal penetration testing before large-scale rollout.
- **Business value:** removes the last cross-tenant edge cases before the platform carries many yards — protecting the whole book of business and the brand.

### Data residency, backup & retention controls 💡
- **What to add:** customer-visible backup/restore, export-my-data, and configurable retention.
- **Business value:** table-stakes assurances for enterprise buyers and privacy expectations.

---

## 🤖 AI-Powered Capabilities

Where machine intelligence can add outsized value on top of the data ShilaTeq already captures.

### AI stone classifier from photos 💡
- **What it does:** point the camera at a block; the app suggests stone type, variety, likely grade, and even estimated dimensions.
- **Business value:** faster, more consistent tagging with fewer errors — and a genuinely differentiating "wow" that lowers the skill needed to onboard stock. High impact.

### Demand forecasting & smart reorder 💡
- **What it does:** learn each variety's sell-through and seasonality to flag what's about to run short and what's turning into dead capital.
- **Business value:** less money frozen in slow movers, fewer lost sales from stockouts — directly improves working-capital efficiency.

### Dynamic / assisted pricing 💡
- **What it does:** recommend a selling price per block from cost, age, recovery, market movement, and carrying cost.
- **Business value:** protects margin on aging stock and removes guesswork from quoting — especially valuable for less experienced staff.

### Conversational insights & lead handling 💡
- **What it does:** a natural-language assistant ("show me white marble over 180 days old under ₹900/sqft") and AI-drafted, on-brand replies to showroom leads.
- **Business value:** faster decisions for owners and faster, more professional follow-up that converts more leads.

> **💡 All AI items are speculative.** They're strong bets *because* ShilaTeq already captures clean, structured data (costs, cuts, ages, sell-through) — the hard part of any AI feature is the data, and that groundwork is done.

---

## 📊 Better Analytics

The reporting suite is already strong (P&L, Sales, Inventory, Profitability, Receivables with exports). The next tier:

- **Predictive & trend analytics** — forecasts, not just history: projected receivables, expected stockouts, margin trajectory. 💡
- **Cohort & customer analytics** — lifetime value, repeat-purchase behaviour, best-customer identification. 💡
- **Variety-level profitability heatmaps** — which stone types and finishes actually make money, visually. 💡
- **Cutting-yield benchmarking** — track recovery % over time and by worker/machine to target wastage. 💡
- **Scheduled report delivery** — automatic weekly/monthly summaries pushed to the owner (via WhatsApp/email once that channel exists). 💡

**Business value:** ShilaTeq already tells owners *what happened*; this tier tells them *what's coming* and *what to do* — moving the product from record-keeping to decision-making.

---

## ⚙️ Automation Ideas

- **Automated payment reminders** — scheduled, unattended WhatsApp/email nudges on overdue balances (today a person taps send). ✅ Confirmed gap → high cash-flow value.
- **Auto-populated audit trail** — logging as an automatic side effect of every action, not a manual concern. ✅ Confirmed gap.
- **Rule-based alerts & workflows** — "notify me when any block passes 180 days," "flag any order shipping unpaid." 💡
- **Auto-reorder suggestions** — turn forecasting into a one-tap purchase-order draft. 💡
- **Recurring expenses & payroll runs** — templated monthly cashbook and pay cycles. 💡

**Business value:** each removes a recurring manual task where busy yards forget or err — compounding into real time saved and money not lost.

---

## 📱 Mobile Improvements

- **Full offline support for the admin app** ✅ Confirmed gap — today worker actions queue offline, but the office app needs a connection to first load its pages. Adding an offline caching layer would let supervisors keep working through outages.
- **Native camera & scanning polish** 💡 — tighter, faster scanning and batch-scan (tag or reconcile many blocks in a row).
- **Push notifications** 💡 — real device notifications for new leads, deliveries, and overdue payments (rather than in-app only).
- **Home-screen install prompts & app-store presence** 💡 — meet users where they expect to find apps.
- **Voice input for the shop floor** 💡 — hands-free logging for workers whose hands are literally full of stone.

**Business value:** the shop floor and the road are where this product lives; every mobile improvement directly increases how often and how reliably it gets used.

---

## 🛍️ Customer Experience Improvements

- **Wire up the ready-made showroom components** ✅ Confirmed gap — several designed catalog elements (featured rail, stone index, filter bar, light-sweep tiles) are built but not yet live. Turning them on enriches the showroom quickly. **Low effort, quick win.**
- **AR "view in my space"** 💡 — let a buyer preview a slab's look and scale in their own room via the phone camera. Premium, conversion-lifting.
- **Buyer accounts & saved favourites** 💡 — let returning buyers save blocks, track their enquiries, and re-order.
- **Richer lead nurturing** 💡 — automated, tasteful follow-up sequences for showroom enquiries that go cold.
- **Multi-language showroom** 💡 — the worker app is bilingual; extend EN/हिंदी (and regional languages) to the public catalog for wider reach.

**Business value:** the showroom is the top of the funnel — every improvement here turns more anonymous visitors into quotes, and more quotes into repeat customers.

---

## 🔒 Security Enhancements

- **Finish audit-log auto-population** ✅ Confirmed gap — see above; foundational for accountability.
- **Complete permission-revocation hardening** ✅ Confirmed gap — close the remaining isolation follow-ups before large multi-tenant scale.
- **Two-factor authentication for owners/admins** 💡 — protect the account that controls the whole business.
- **Rotate and vault operational secrets** ✅ Confirmed — a known follow-up is to rotate a previously-published demo owner password; broader secret-rotation hygiene should be routine.
- **Session & device management** 💡 — let an owner see and revoke active logins (important where workers share phones).
- **Formal third-party security review** 💡 — independent penetration testing ahead of scale, for both safety and buyer confidence.

**Business value:** ShilaTeq holds a yard's entire commercial life — stock, cash, customers. Security isn't a feature here; it's the license to be trusted with that data at scale.

---

## ⚡ Performance Improvements

The platform is already efficient (event-driven freshness, on-demand heavy assets, lean list payloads). Next steps:

- **Progressive/offline caching for the admin app** 💡 — instant repeat loads and outage tolerance for the office.
- **Image pipeline upgrades** 💡 — server-side thumbnails and modern formats for even faster galleries on slow networks.
- **Background sync & prefetch** 💡 — anticipate the next screen so navigation feels instant on modest phones.
- **Load & soak testing at multi-yard scale** 💡 — validate responsiveness as the number of tenants and records grows.

**Business value:** speed is adoption on the kind of low-end hardware and patchy networks this market runs on; every millisecond saved is a user who keeps using it.

---

## 🔗 Integration Opportunities

These map directly to the deliberate "not integrated yet" choices in [Integrations](10_Integrations.md) — each is an opt-in upgrade as customers grow.

| Integration | What it unlocks | Business value |
|---|---|---|
| **Online payment / UPI collection** 💡 | Pay-by-link, UPI QR on invoices, auto-reconciled receipts | Faster cash-in, fewer disputes, less manual matching |
| **WhatsApp Business API** 💡 | Automated, unattended messaging & delivery receipts | Hands-off reminders and confirmations at scale |
| **Accounting sync (Tally / Zoho / QuickBooks)** 💡 | One-way or two-way books integration | Ends double entry; wins the accountant, who often influences the buy |
| **E-invoicing & e-way-bill APIs** 💡 | Government IRN/e-way-bill generation | Compliance for larger yards crossing turnover thresholds |
| **Logistics / transporter APIs** 💡 | Live carrier tracking, automated freight docs | Real-time delivery visibility for bigger operations |
| **Buyer-side marketplace** 💡 | A cross-yard buyer network discovering listed stock | Network effects and a new revenue model (listings/commissions) |

> **💡 Tip:** Because ShilaTeq already produces GST-correct invoices and clean Excel/CSV exports, the *data* is integration-ready today. Most of these are connectors on top of a proven foundation, not rebuilds.

---

## 🗺️ Suggested Sequencing

A pragmatic order that front-loads high-value, lower-effort wins and de-risks scale before the big bets.

```mermaid
flowchart LR
    subgraph NOW["🟢 Near-term — trust & quick wins"]
      A["Auto-populate audit log"]
      B["Wire up showroom components"]
      C["Installable app polish"]
      D["Finish security hardening"]
    end
    subgraph NEXT["🟡 Next — cash flow & reach"]
      E["Automated WhatsApp reminders"]
      F["Online payment / UPI collection"]
      G["Accounting (Tally) sync"]
      H["Owner self-signup & onboarding"]
    end
    subgraph LATER["🔵 Later — scale & differentiation"]
      I["Multi-yard org rollups"]
      J["AI stone classifier"]
      K["Demand forecasting & pricing"]
      L["AR showroom / marketplace"]
    end
    NOW --> NEXT --> LATER
```

---

## Related Reading

- [Product Strengths](11_Product_Strengths.md) — the foundation these opportunities build on
- [Integrations](10_Integrations.md) — the deliberate absences these integration opportunities address
- [FAQ](13_FAQ.md) — honest answers on current limitations and the roadmap
- [Reports and Analytics](08_Reports_and_Analytics.md) — today's analytics that the "better analytics" ideas extend

---

*Part of the **ShilaTeq (StoneX) Product Documentation Hub** — the operating system for stone yards.*
