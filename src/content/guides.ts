/**
 * Guides content (phase-4/04 §7, phase-4/06 §3). Educational-first: teach the
 * trade, sell second. Every factual claim traces to the Phase-1 knowledge base
 * (aging bands, the recovery formula, HSN 6802, credit/store-credit mechanics,
 * carrying-cost concept) — NO invented statistics, ROI, or external tax-law
 * claims. The GST guide is explicitly non-advisory.
 *
 * `updated` is the honest authoring date. Reading time is computed from words.
 */

export type Guide = {
  slug: string;
  title: string;
  description: string;
  /** ISO authoring date (honest — written now). */
  updated: string;
  category: "Working capital" | "Sales & credit" | "Cutting" | "Compliance" | "Going digital";
  /** Markdown body — rendered through the shared DocContent pipeline. */
  body: string;
  related: {
    pillar?: { label: string; href: string };
    comparison?: { label: string; href: string };
    guides: string[]; // slugs
  };
};

const AUTHORED = "2026-07-15";

export const guides: Guide[] = [
  {
    slug: "dead-capital",
    title: "Dead capital: the cost of stone that sits",
    description:
      "Aged stock doesn't announce itself — it just quietly ties up cash. How to see it, measure its carrying cost, and act before it drains a season's profit.",
    updated: AUTHORED,
    category: "Working capital",
    body: `A stone yard is a fortune you can walk through. Rows of blocks, each worth thousands to lakhs, standing in the sun. But some of those blocks arrived a long time ago — and every day they sit, they cost you money you never see leave your hand.

That is dead capital. It is the least visible loss in the trade, and often the largest.

## Why aged stock is expensive even when it's paid for

A block that isn't selling isn't free to hold. Three costs run quietly the whole time:

- **The money is frozen.** Whatever you paid for that block is cash you can't use to buy stone that would actually move.
- **The carrying cost.** Space, handling, insurance, and the plain opportunity cost of capital — a percentage of the block's value, every year, for as long as it stands.
- **The quiet discount ahead.** Stone that has sat for a year usually sells at a cut, if it sells at all. The longer it waits, the deeper the eventual discount.

None of this shows up in a register. A register records what arrived. It has no way to shout when something has been standing too long.

## Aging bands: fresh, amber, red

The simplest discipline in the world is to put every block into one of three buckets by how long it has been in the yard:

- **Fresh** — recently arrived, moving normally.
- **Amber** — sitting longer than it should. Worth a second look.
- **Red** — well past its expected shelf life. This is where dead capital lives.

Where you draw the amber and red lines depends on your trade — a fast-moving sandstone yard and a premium-marble trader will set them very differently. ShilaTeq lets you choose your own thresholds; out of the box it suggests amber at 90 days and red at 180, which many yards find a sensible starting point.

## Putting a number on it

The moment stock has an aging band, you can attach a carrying cost to it: a rate (a percentage per year that reflects your cost of holding stone) applied to the block's value for the days it has been standing. It is a simple, honest estimate — not an exact accounting figure — and its job is not precision. Its job is to make the invisible visible, so a block sitting in row six for 200 days stops being scenery and starts being a number you can act on.

> A note on honesty: carrying cost is a rule-of-thumb estimate for decision-making. It is deliberately kept out of your cost-of-goods and margins, so it never distorts what a block actually cost you.

## What to do with a red block

Seeing it is most of the battle. Once a block is flagged red, you have real choices — and you can make them on evidence instead of instinct:

1. **Discount to move it.** A block sold at a cut today frees capital for stone that turns.
2. **Cut it.** Sometimes a slow block becomes fast slabs, or a sellable remnant.
3. **Feature it.** Put it in front of buyers — including on a public showroom — where it can actually be seen.

The worst choice is the default one: leaving it to stand for another season because nothing reminded you it was there.

## The one habit that pays for itself

Look at your amber and red stock once a week. That's it. A yard that reviews its aging stock every week rarely accumulates a graveyard of dead capital, because nothing gets to sit long enough to become one. The point isn't the software — it's the habit. The software just makes the habit take two minutes instead of a walk around the yard with a notebook.`,
    related: {
      pillar: { label: "Inventory & QR identity", href: "/product/inventory-qr" },
      comparison: { label: "vs the paper register", href: "/why/vs-paper" },
      guides: ["gangsaw-recovery", "credit-control"],
    },
  },

  {
    slug: "credit-control",
    title: "Selling on credit without the bad debts",
    description:
      "Udhaar is how the stone trade works — and where it leaks. How to extend credit confidently: exposure limits, payment discipline, and collections that don't cost you the relationship.",
    updated: AUTHORED,
    category: "Sales & credit",
    body: `The stone trade runs on trust and credit. A buyer takes stone today and pays over weeks — that's not a flaw in the business, it's the business. But credit given without control is where a good year quietly becomes an average one.

The goal isn't to stop extending credit. It's to always know exactly how much you've extended, to whom, and to make sure goods never move on a promise you can't see.

## Know your exposure — to the rupee

Exposure is the total a customer owes you across every open order. On paper, that number lives in someone's head or scattered across pages, which means at the exact moment you decide whether to give more credit, you're guessing.

The discipline: before you reserve more stone for a buyer, look at what they already owe across everything. A running total per customer turns "he's good for it" into a number you can actually weigh.

A credit limit makes that judgment repeatable. Set a ceiling per customer; when a new order would push their total exposure past it, you get a warning. Not a hard stop — you know your buyers, and a trusted, long-standing customer is a conscious exception. But an exception you make on purpose, seeing the number, is very different from one you make blind.

## Money before goods move

The single most protective rule in a yard is simple: **nothing leaves until a payment is confirmed.** No processing, no dispatch, no truck at the gate on an unpaid order.

This isn't about distrust. It's about removing the gap where losses live — the order that shipped "just this once" as a favour and became a six-month chase. When the rule is absolute and applies to everyone, no one has to be the person who says no. The system says it.

The related discipline: never let the "paid" figure be a number someone typed. It should always be the sum of the actual payments recorded against the order, so the money and the goods can never drift apart.

## When a return becomes credit

Returns and overpayments are where money quietly vanishes. A customer returns stone, the maths gets fuzzy, and a few thousand rupees evaporate in the confusion.

The clean way: any surplus a customer is owed becomes **store credit** — a tracked balance on their account that spends like cash on their next order. Nothing is refunded in a panic, nothing is forgotten, and the customer's money stays the customer's money until they use it. Handled carefully, repeat returns can never double-count that credit.

## Collections without the awkward call

The hardest part of credit is asking for it back. Which is why most overdue balances sit longer than they should — the phone call is uncomfortable, so it doesn't happen.

Two things make collections easier:

1. **Aging visibility.** Sort receivables by how overdue they are, and chase the oldest and largest first. You collect more by working the list than by working your memory.
2. **A gentle, standard message.** A short, polite reminder on WhatsApp — the channel your customer already reads — is far easier to send than a call, and far easier to send *consistently*. Consistency is what actually brings money in.

Credit control isn't about being hard on your customers. It's about being clear — so the trust that makes the trade work doesn't quietly cost you the profit that makes it worth doing.`,
    related: {
      pillar: { label: "Sales, payments & GST", href: "/product/sales-gst" },
      comparison: { label: "vs accounting software", href: "/why/vs-tally-accounting" },
      guides: ["double-sell", "dead-capital"],
    },
  },

  {
    slug: "gangsaw-recovery",
    title: "Gangsaw recovery: the maths of cutting",
    description:
      "Cutting is where yards silently lose money. How to measure recovery and wastage on every cut — and why wastage has to be priced into the slabs that survive.",
    updated: AUTHORED,
    category: "Cutting",
    body: `Ask a processor what their gangsaw recovery is, and most can't tell you — not because they don't care, but because the number lives nowhere. Yet it may be the most important figure in the whole business, because cutting is exactly where a yard's margin is made or lost.

## Recovery and wastage, defined

When a block goes into the gangsaw, some of it becomes usable slab and some is lost to the cut. Two numbers describe what happened:

- **Recovery %** = slab area produced ÷ block area consumed × 100
- **Wastage** = block area consumed − slab area produced

If you feed 100 sqft of block into the saw and get 68 sqft of slab out, your recovery is 68% and your wastage is 32 sqft. That wastage isn't free — you paid for the whole block. So the cost of those 32 lost square feet has to go *somewhere*.

## Where the money leaks

Here's the mistake almost every paper-run yard makes: they price slabs off the block's nominal cost per square foot.

Say a block cost ₹40,000 for 100 sqft — ₹400 per sqft. It's tempting to price the slabs as if they cost ₹400 per sqft. But you only got 68 sqft of slab. The real cost of the surviving slabs is:

> true slab cost per sqft = block cost ÷ slab area produced = ₹40,000 ÷ 68 = **₹588 per sqft**

Nearly ₹190 per square foot higher than the nominal figure — and if you quote off the nominal number, every one of those slabs is being sold with a chunk of your margin already gone, invisibly, before you even negotiate.

## Wastage has to be priced in

This is the whole point: **the cost of the wastage must land on the slabs that survived.** The block's entire material cost gets spread over the actual output, not the theoretical output. A low-recovery cut makes each surviving slab genuinely more expensive — and a yard that prices honestly protects its margin, while a yard that prices off nominal cost slowly gives it away.

Recovery-adjusted costing does this automatically: it takes the block's cost, divides it across what actually came off the saw, and every slab carries its true cost from that moment. Where the cost is genuinely unknown, it should show as unknown — never faked into a rosy margin.

## The leftover is not scrap

One more thing the maths should capture: the part of the block that wasn't consumed. If you cut 60 sqft out of a 100 sqft block, the remaining 40 sqft still has value — it's a smaller block, sellable to a different buyer. Track it as a remnant, and offcuts stop being losses and start being inventory.

## Why tracking it changes behaviour

The moment recovery is measured on every cut, two things happen. Low-recovery blocks and low-recovery operators become visible — you can see which stone and which practices waste material. And your quotes finally rest on true cost, so you stop accidentally selling below it.

You don't need software to do this maths — you need to do it at all. Most yards don't, because doing it by hand on every cut is impractical. That's the gap worth closing, however you close it: recovery is only useful if it's measured every single time, not estimated once a year.`,
    related: {
      pillar: { label: "Inventory & QR identity", href: "/product/inventory-qr" },
      comparison: { label: "vs generic ERP", href: "/why/vs-erp" },
      guides: ["dead-capital", "pricing-blocks"],
    },
  },

  {
    slug: "gst-stone",
    title: "GST for stone businesses: a plain guide",
    description:
      "The essentials of GST invoicing for a stone yard — HSN codes, the CGST/SGST vs IGST split, and what makes an invoice compliant. Written plainly. Not tax advice.",
    updated: AUTHORED,
    category: "Compliance",
    body: `> **This is a plain-language explainer, not tax advice.** Rates, thresholds, and rules change, and your situation is specific. Confirm everything with your accountant or a qualified professional before you rely on it. What follows is how GST invoicing generally works for a stone yard, in ordinary language.

GST turned invoicing from a receipt into a compliance document. For a busy yard, that's a headache exactly when you're least free to deal with it — at the moment stone is leaving. Understanding the few moving parts makes it far less daunting.

## The HSN code

Every item on a GST invoice carries an HSN code — a classification number that tells the tax system what you sold. Worked dimensional stone (cut, dressed slabs and the like) generally falls under **HSN 6802**. Getting the code right matters because it ties to the applicable rate; getting it consistently right across every invoice matters even more.

## The tax split: CGST/SGST or IGST

This is the part that trips people up, and it comes down to one question: **where is the sale going?**

- **Within your state** (intra-state): the tax is split into two halves — **CGST** (central) and **SGST** (state). Same total, two lines.
- **To another state** (inter-state): it's a single **IGST** line for the full amount.

What decides it is the *place of supply* — essentially, where the goods are headed. Get the place of supply right and the split follows automatically. Get it wrong and you have a compliance problem to unwind later.

One subtlety worth knowing: when tax is split into two halves, the halves must add back exactly to the total, to the paisa. Careless rounding creates invoices that don't reconcile — a small thing that causes real friction at filing time.

## What makes an invoice compliant

Beyond the tax maths, a proper tax invoice generally needs: your GSTIN and your buyer's, the place of supply, the HSN code, a clear line-item breakdown, the tax split, and the total — often with the amount written out in words (in the Indian lakh/crore convention). It should carry a sequential invoice number, and it should be a document you can reproduce for an auditor months later.

## Why "at sale time" beats "at filing time"

The most common failure isn't getting the maths wrong — it's leaving it all to month-end. Invoices assembled from slips and memory at filing time are where errors creep in and hours disappear.

The healthier discipline is to generate each invoice *correctly, at the moment of sale*: the split computed from the place of supply, the HSN attached, the number sequential, the words spelled out — done once, done right, retrievable forever. Your accountant then works from clean, correct documents instead of reconstructing them.

## What software does and doesn't do here

Tools that generate GST invoices (ShilaTeq among them) handle the mechanical parts — the split, the HSN, the amount-in-words, the sequential numbering, a reprintable document. What they don't do is replace your accountant or your judgment about your specific obligations, thresholds, and any e-invoicing or e-way-bill requirements that apply to your turnover. Use the tool for the mechanics; use your accountant for the certainty.`,
    related: {
      pillar: { label: "Sales, payments & GST", href: "/product/sales-gst" },
      comparison: { label: "how ShilaTeq works with Tally", href: "/why/vs-tally-accounting" },
      guides: ["credit-control", "double-sell"],
    },
  },

  {
    slug: "double-sell",
    title: "The double-sell problem",
    description:
      "Two salesmen, one block, two promises. Why it happens, what it costs, and how to make selling the same stone twice structurally impossible.",
    updated: AUTHORED,
    category: "Sales & credit",
    body: `Every yard that has grown past one salesperson has felt it: a buyer is promised a block, arrives to collect it, and it's already gone — sold that morning by someone else, from the same register, with no way for either seller to have known.

The double-sell is a small operational glitch with an outsized cost, because it lands on the two things a yard runs on: cash and relationships.

## Why it happens

It isn't carelessness. It's structure. A paper register — or a shared spreadsheet — records what you *have*. It has no concept of what's been *promised but not yet collected*. So between the promise and the pickup, a block sits in a blind spot: available on the page, spoken for in reality, and nothing bridges the two.

Add a second salesperson, a busy Saturday, and a hot block that several buyers want, and the collision isn't bad luck. It's inevitable.

## What it actually costs

- **The lost sale, twice over.** One buyer leaves empty-handed; sometimes both, if the substitute doesn't satisfy either.
- **The relationship.** A buyer who was promised something and didn't get it remembers. In a trade where buyers and sellers know each other for decades, that memory is expensive.
- **The scramble.** Staff time spent apologising, finding a substitute, and smoothing it over — none of which was necessary.

## The fix isn't "be more careful"

You can't solve a structural gap with individual carefulness, because the gap is between people, not inside any one of them. The fix is to make the register itself understand reservation.

The principle: when a block is committed to an order, it should be **reserved** — removed from what everyone else can sell — the instant that commitment is made. And the reservation has to be *atomic*: if two salespeople reach for the same block at the same moment, exactly one succeeds, and the other is told, cleanly and immediately, that it's gone. Never both. Never half.

That "never both" is the whole game. It's the difference between a system that reduces double-sells and one where they are simply impossible.

## Quotes are different — on purpose

There's a subtlety worth getting right: a *quote* is not a commitment, and shouldn't lock stock. You want to be able to pitch the same attractive block to five different buyers — the one who confirms first wins it. If quoting reserved stock, you'd freeze your best inventory behind tyre-kickers.

So the healthy rule is: **quotes hold no stock; orders reserve atomically.** Pitch freely, commit safely. The block is only locked at the moment someone actually converts a quote into a real, committed order — and from that instant, no one else can promise it.

Get that one rule right and a whole category of embarrassment, lost sales, and damaged trust simply stops happening.`,
    related: {
      pillar: { label: "Sales, payments & GST", href: "/product/sales-gst" },
      comparison: { label: "vs Excel & WhatsApp", href: "/why/vs-excel-whatsapp" },
      guides: ["credit-control", "going-online"],
    },
  },

  {
    slug: "pricing-blocks",
    title: "Pricing a block honestly",
    description:
      "How to price stone so you never sell below cost by accident — true cost basis, wastage from cutting, and why an unknown cost should stay unknown, not become a fake margin.",
    updated: AUTHORED,
    category: "Cutting",
    body: `The most dangerous number in a stone yard is a margin that looks healthy and isn't. It doesn't feel like a loss — the invoice is fine, the customer is happy — but the profit you thought you made was never really there. Honest pricing is mostly about refusing to let that happen.

## Start with a true cost basis

You can't price honestly if you don't know what a block actually cost you. That number should attach to the block the moment it enters the yard — from the purchase order it came in on — and travel with it for its whole life. A block whose cost is a guess is a block you can only price by guess.

This is why capturing cost *at intake* matters so much. If the cost basis is set when goods are received, every downstream number — margin, per-block profit, the true cost of a slab — has something real to stand on.

## Cutting changes the cost

If a block is sold whole, its cost is straightforward. If it's cut, everything shifts — because cutting has wastage, and wastage isn't free (see the gangsaw recovery guide for the full maths). The short version: the block's whole cost has to be spread over the slabs that actually survived the cut, not over the theoretical output. A low-recovery cut makes each surviving slab genuinely more expensive, and pricing has to reflect that or you'll quote below cost without knowing.

## Add the processing, honestly

Cutting and finishing have their own costs — the saw, the labour, the consumables. Whatever your processing cost per square foot, it belongs in the slab's cost before you decide a selling price. Leaving it out is the same mistake as ignoring wastage: a margin that looks fine and isn't.

## The most important rule: unknown means unknown

Here is the discipline that separates honest books from flattering ones. When a cost is genuinely not known, it should show as **not known** — never quietly treated as zero.

Why does this matter? Because a cost of zero produces a margin of 100%. A block with an unknown cost, if you let the unknown become a zero, looks like pure profit. It's the most seductive lie in the trade — and a yard that believes its own fake margins prices too low, buys the wrong stone, and wonders at year-end where the money went.

So: if you don't know what something cost, say so. An "N/A" on a margin is honest and useful. A fabricated 100% is neither.

## Price from truth, then negotiate

Once a block or slab carries its true, wastage-adjusted, processing-included cost, you finally have solid ground. You know the floor you must not cross. You can discount an aging block deliberately, knowing exactly what you're giving up. You can negotiate hard on a fresh, high-recovery slab, knowing your room.

Honest pricing doesn't mean pricing high. It means pricing *knowingly* — so that every rupee you give away in a negotiation is a rupee you chose to give, not one that leaked out while you weren't looking.`,
    related: {
      pillar: { label: "Inventory & QR identity", href: "/product/inventory-qr" },
      comparison: { label: "vs accounting software", href: "/why/vs-tally-accounting" },
      guides: ["gangsaw-recovery", "dead-capital"],
    },
  },

  {
    slug: "going-online",
    title: "Taking your yard online — safely",
    description:
      "A showroom buyers can browse, without exposing your prices to competitors. What to show, what to keep private, and how web enquiries become real leads.",
    updated: AUTHORED,
    category: "Going digital",
    body: `Buyers of stone increasingly start on their phones. They browse, compare, and shortlist before they ever call — and a yard they can't see online is a yard that isn't on the shortlist. But every stone-yard owner who considers going online hits the same wall of worry: *if I put my stock on the web, do I hand my prices to my competitors?*

The answer is that you can be visible without being exposed — if you're deliberate about what's public and what isn't.

## Show the stone, gate the price

The instinct to protect pricing is correct. The mistake is thinking the only way to protect it is to stay invisible. There's a middle path: show the stone, and control the price disclosure block by block.

For each block you make public, you decide whether to show a price or simply mark it *"On request."* Commodity stock where a public price helps buyers self-qualify? Show it. Premium pieces where you'd rather they call and talk? "On request." The choice is per block, and it's yours — and "On request" is itself a gentle prompt to make contact.

## What should never be public

Being online safely means drawing a hard line around your commercial secrets. The public should see presentable details of *available* stock — the variety, grade, size, a general sense of where you are. The public should **never** see:

- What you paid for anything (your cost).
- Who you bought it from (your supplier).
- Your margins or any financial data.
- Exact stock locations, or stone that's already reserved, sold, or damaged.

Done properly, the gating happens at the data level — the private information is never sent to a public page at all, not merely hidden on screen. That distinction matters: hidden-on-screen can be uncovered; never-sent cannot.

## Turn browsing into leads

A showroom that only displays stock is a brochure. A showroom that *captures interest* is a sales channel. The difference is a simple path from "I like this block" to "here's how to reach me": a short enquiry — a name, a phone number, the block they're asking about — that lands with you as a lead, with the specific stone attached.

From there, the fastest reply wins. Meeting the enquiry on WhatsApp — the channel the buyer already uses — turns a cold web visit into a warm conversation in one message.

## Your paperwork is already marketing

The quiet advantage most yards miss: every document you already send is a chance to drive traffic to your showroom. A catalog link or QR on your invoices and quotes turns routine paperwork into a standing invitation. The customer you're billing today becomes the browser who comes back tomorrow — at no extra cost and no extra effort.

Going online isn't a leap of faith that exposes your business. Done with control, it's the opposite: a way to be found by more buyers while keeping exactly the things that should stay private, private.`,
    related: {
      pillar: { label: "Showroom & leads", href: "/product/showroom" },
      comparison: { label: "vs Excel & WhatsApp", href: "/why/vs-excel-whatsapp" },
      guides: ["worker-adoption", "double-sell"],
    },
  },

  {
    slug: "worker-adoption",
    title: "Getting the shop floor to actually use software",
    description:
      "The best system is worthless if the cutter won't touch it. What actually drives adoption on a low-literacy, phone-only shop floor — and what quietly kills it.",
    updated: AUTHORED,
    category: "Going digital",
    body: `Most yard software fails at the same place: not in the office, but on the floor. The owner is convinced, the supervisor is trained, and then the cutter takes one look at an English screen full of forms and goes back to chalk. The data layer starves, the reports become fiction, and within a month the software is a screen nobody opens.

Adoption on the shop floor isn't a training problem. It's a design-and-respect problem. Get a few things right and workers use it without being asked; get them wrong and no amount of insistence helps.

## Meet the worker where he is

The realities of a stone-yard floor are specific, and software that ignores them will be ignored back:

- **Language.** A worker who reads Hindi more comfortably than English needs the app in Hindi. Not translated as an afterthought — genuinely his language, front and centre.
- **Literacy.** Icons and numbers carry meaning that dense text doesn't. A screen a worker can operate by recognising shapes and figures beats one that requires careful reading, every time.
- **The phone in his pocket.** He has a mid-range Android, not a desktop. The tool has to be excellent on that phone, in bright sun, with one hand often busy.
- **The dead zone.** Sheds have thick walls; yards have no signal in patches. Software that stops working when the signal drops teaches the worker not to rely on it — which is the same as teaching him not to use it.

## Remove the friction of getting in

The first barrier is often the smallest-seeming one: login. Ask a worker to remember an email and a complex password and you've lost a fraction of your floor before they've done anything. A username alone — created for him by his admin, nothing to memorise, no self-signup ritual — removes that barrier entirely.

## Give something back

Here is the part most systems miss. A worker asked to enter data into a system that gives him nothing in return will do it grudgingly, if at all. It feels like surveillance.

Flip it. If the same app that logs his cutting also shows him **his own pay** — his attendance, his earnings, what he's owed — and lets him request an advance from his phone, the app is suddenly *for him*, not just about him. Transparency into his own pay is the single most powerful adoption driver on a shop floor, because it turns the tool from something done to him into something that serves him.

## Prove the work is safe

A worker who can't see whether his effort was captured won't trust the tool. A simple, unmissable signal — is my work saved, yes or no — earns that trust. When he can log a full shift in a dead zone and watch a clear indicator confirm it synced when the signal returned, he stops worrying and starts relying.

## What quietly kills adoption

- Showing him prices and margins he has no business seeing (and doesn't want the responsibility of).
- English-only anything.
- A tool that punishes a dropped connection by losing his work.
- Anything that feels like it exists to watch him rather than help him.

Adoption isn't won with a training session. It's won by respect — building a tool the worker would choose to use because it speaks his language, works where he works, and treats him as a person whose time and pay matter.`,
    related: {
      pillar: { label: "The worker app", href: "/product/worker-app" },
      comparison: { label: "vs generic ERP", href: "/why/vs-erp" },
      guides: ["going-online", "gangsaw-recovery"],
    },
  },
];

export function getGuide(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}

/** Reading time in minutes, from body word count (~200 wpm). */
export function readingTime(body: string): number {
  const words = body.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}
