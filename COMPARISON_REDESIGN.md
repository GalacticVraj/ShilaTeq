# Comparison Experience — Design Refactor

> A first-principles redesign of the **/why** comparison experience.
> Content is preserved to the letter. Only the *verb changes*: from **explain** to **show**.

**Scope reviewed:** `src/app/why/page.tsx`, `src/app/why/[slug]/page.tsx`, `src/components/why/ComparisonPage.tsx`, `src/content/comparisons.ts`, the design tokens and motion law in `src/app/globals.css`, and the existing choreography engine (`SceneRunner`, `RevealRunner`, `Reveal`, `usePrefersReducedMotion`).

**Non-negotiables carried forward, unchanged:** product messaging, business positioning, copy hierarchy, SEO strategy, comparison facts, the honest trade-offs, accessibility, and engineering quality. The *content model* (`comparisons.ts`) is not edited by this proposal. The **content laws** — respect-first, concessions styled at equal weight, no attacks, no invented numbers — are treated as binding.

---

## 1. Problems with the current implementation

Brutally honest, with the receipts from the code.

1. **The comparison is never actually placed side-by-side.** Each page carries a `workflow` (the yard *today*) and a `change` (the same yard *on ShilaTeq*) with perfectly parallel stations — *Stock arrives · A buyer asks · A block is cut · Credit is given · Month-end*. But in `ComparisonPage.tsx` the "today" list is **section 2** and the "on ShilaTeq" list is **section 5** — roughly 1,500px of scroll apart. The reader must hold five "before" states in working memory to feel the "after." **The content is comparative; the layout is sequential.** That single decision is the root failure.

2. **Four separate URLs read as four separate articles.** `/why/vs-paper`, `/why/vs-excel-whatsapp`, `/why/vs-tally-accounting`, `/why/vs-erp` each render the same 8-section template top-to-bottom. There is no way to feel "the same yard, four starting points." The experience is fragmented by construction.

3. **The differentiator is buried and inert.** The one genuinely *visual* asset — the ✓/~/✗ canonical matrix — lives only on the `/why` hub (`page.tsx`), never on the comparison pages themselves, and it is a static table. The strongest 3-second "get it" object on the whole route is hidden from the pages that most need it.

4. **It tells you a demo exists instead of being one.** Each comparison ends with a `demoMicroline` — *"find a block in seconds — with a typo," "watch an order refuse to double-sell," "see an invoice born correct"* — that merely **links out** to `/demo`. The proof is described, then deferred. Meanwhile the codebase already contains working, motion-law-compliant demonstrations of exactly these moments (S3 identity, S4 payment gate, S5 offline sync) that the comparison never uses.

5. **Visual monotony erases memory.** Every section is the same rhythm: `font-display` heading → hairline-ruled list of `[bold term, muted line]`. Respect(2) → workflow(5) → hiddenCosts(5) → wins(3) → breaks(4) → change(5) → tradeoffs(3) → bridge → faq(3) ≈ **30 text blocks per page**. There is no anchor image, no state change, no moment. Nothing to remember it *by*.

6. **The payload is a report, not a comparison.** ~30 blocks × 4 pages. The writing is genuinely excellent — respectful, specific, honest — which makes the delivery failure more painful, not less: **A-grade content in a D-grade container.**

---

## 2. Why users become confused

The buyer is a stone-yard owner (Rajesh) or the sharp son/supervisor who built the Excel sheet — proud of the current way, skeptical of software, reading on a cheap Android phone in the sun.

- **They can't self-select fast.** Landing on `/why`, they meet a question and four look-alike cards. Nothing lets them say "I'm the Excel guy" and immediately *see* their world. The cards all look and read the same.
- **They lose the thread across the scroll.** By the time "The same yard, on ShilaTeq" appears, the "today" workflow has scrolled off. The brain can't diff two things it can't see at once, so the transformation — the entire point — never lands as a *contrast*.
- **They can't tell what's different from what's just *said* differently.** Prose comparisons force the reader to construct the delta themselves. A tired buyer won't; they'll skim, miss the payload, and leave with "nice words."
- **"Compared to what?" stays ambiguous on the deep pages.** Inside `/why/vs-paper` there's no persistent frame showing this is one of four honest comparisons, so the page feels like an isolated argument rather than one honest instrument with four settings.

---

## 3. Why the current experience feels documentation-heavy

- **One column, top to bottom, forever.** `max-w-3xl` / `max-w-2xl` single-column stacks are the shape of documentation (indeed the site's own `/docs` uses the same rhythm). The comparison inherited the docs skeleton.
- **Reading is the only interaction.** Apart from the FAQ `<details>`, nothing responds to the user. There is no state to change, nothing to try, nothing that *does* something. Reading is the whole job.
- **Headings-as-chapters.** Eight `font-display` H2s per page frame the content as an essay with chapters, not an interface with a task.
- **The proof is textual.** "Recovery and wastage computed on every cut" is a *claim in prose*. The product's superpower is that it can **show** this; the page chooses to **describe** it.
- **No focal object.** Great product pages have one thing your eye lands on. This page has thirty things of equal weight, which is the same as having none.

The diagnosis is not "the content is wrong." It is: **the content is trapped in a documentation container, and comparison is the one job documentation is worst at.**

---

## 4. Three completely different redesign concepts

Three genuinely different philosophies — not three skins of one idea.

---

### Concept A — "The Switch"
*A single state-toggle transformation engine. You watch your own yard gain sight.*

**UX philosophy.** The comparison is a **demonstration of transformation the user triggers**. The product thesis is already written: *"Keep the discipline of your register. Give it eyes."* So build the moment sight is switched on. One page, four settings; pick your world, watch it transform, then prove it with one live moment.

**User journey.**
1. Land on `/why` → the question + a segmented selector (Paper · Excel+WhatsApp · Accounting · ERP). Pick one (or arrive on `/why/vs-paper` pre-selected).
2. Read the respect-first opener (unchanged copy).
3. Meet **the split stage**: *Your yard today* (left, blind) beside *The same yard, seeing* (right) across a single seam. Tap **"Give it eyes."** The blind ledger transforms into the seeing yard, station by station.
4. The hidden costs surface from the "today" side; the concession stands at equal weight; the structural breaks are named.
5. **One live micro-proof** matched to the incumbent (typo-search / double-sell refusal / invoice-born-correct / the Hindi offline cut) — the real thing, in place.
6. Honest trade-offs → the bridge line → the whole-picture matrix (switch incumbents here without leaving) → FAQ → doors.

**Visual direction.** A two-column split divided by a single kiln-ochre seam. *Today* is the **ledger voice** — JetBrains Mono, `ink-500`, flat hairlines, a chalk-mark motif — dignified, not mocked. *Seeing* is warm — `paper-2` surfaces, `ink-900`, `ok-600` confirmations, a single `accent-600` QR spark. The signature moment: a chalk mark **strokes into a scannable QR** (the existing `qr-draw` keyframe).

**Interaction model.** Segmented selector (real links, soft-navigating) · a master **switch** built on the proven `[data-s4]` dual-state pattern · optional desktop **seam-scrub** (progressive enhancement) · per-cost progressive disclosure · one reused live demo · an interactive matrix that cross-links the other three.

**Pros.** Instant understanding (<10s from the split alone) · one coherent engine, kills fragmentation · 1:1 content reuse · brand-true · **respects the site's motion law and reuses `SceneRunner`** · four SEO front doors preserved · accessible by construction (dual-state DOM).
**Cons.** The split must stack carefully on mobile · the "switch" must feel like an instrument, not a toy — demands restraint · one new section component to build well.

---

### Concept B — "Follow the Block"
*Scrollytelling. One block travels the yard; scrolling is the comparison.*

**UX philosophy.** Make **scroll itself the comparison**. A single block — the QR protagonist — travels five stations down a pinned rail. At each station the incumbent's world is shown handling it (and failing), then the ShilaTeq world resolves it. The narrative *is* the argument.

**User journey.** Choose an incumbent up top → a block appears at *Intake* → as you scroll, the block moves station to station; each station pins, plays the "today vs seeing" beat, then releases to the next. Ends at month-end with the ledger reconciled.

**Visual direction.** A cinematic yard-map / vertical rail; the block sprite animates along a path; station cards slide in; heavy atmosphere. The most "Awwwards" of the three.

**Interaction model.** Scroll-scrubbed, pinned sections; sprite path animation; scroll drives every reveal.

**Pros.** The most memorable and most cinematic · a genuinely single, coherent journey · the block-as-hero is strongly on-brand.
**Cons — disqualifying.** It **violates the site's own motion law**: phase-4/05 rule 1, encoded in `RevealRunner`'s comment — *"subpages get narrative-grade reveals only, once, no scrubbing, no scenes."* It targets the **wrong device/network**: the audience is cheap Androids on patchy 4G, where scroll-pinning is jankiest and heaviest. It is the **worst for SEO** (content gated behind scroll state) and the **worst for a11y** (scroll-hijack + motion). It is the concept most likely to read as "AI-generated maximalism." Honest verdict: wrong for *this* product, however tempting.

---

### Concept C — "The Register, Given Eyes"
*One interactive ledger. The matrix becomes the instrument; rows expand into honest detail.*

**UX philosophy.** The comparison as **one honest instrument**. The canonical 5-column matrix stops being a footnote and becomes the centerpiece *and* the navigation. Rows are the yard's real needs; columns are the tools; tapping a need expands it into the workflow/break/change detail with an inline "what's lost / what's gained" diff. Progressive disclosure from a single object.

**User journey.** Meet the matrix immediately → the two concession rows are visible and against us (credibility up front) → tap "Find one block fast" → it expands into the honest detail for your chosen tool, with a red-line/green-line diff → collapse, try another row, or switch the highlighted column.

**Visual direction.** Minimal, Attio/Linear/editorial. Hairlines, the mono **ledger voice**, `ok-600`/restrained `danger-600` diff marks kept strictly within the functional-color law. Dense but scannable.

**Interaction model.** Row expand/collapse · column focus/highlight · inline diff reveal · column headers switch the active incumbent.

**Pros.** Lowest risk · closest to the brand's own "register" motif · excellent a11y and SEO (it's a *real* semantic table) · fast on poor networks · concessions visible in-grid.
**Cons.** Still leans **explain over demonstrate** — no live product moment · a matrix, however good, flirts with exactly the *"comparison table from 2015"* the brief rejects · under-delivers "memorable" and "delight."

---

## 5. Choose ONE concept

**Chosen: Concept A — "The Switch."** With the matrix from **C** folded in as the zoom-out "whole picture" section, and the live moment from the product (the impulse behind **B**) embedded **without** scroll-hijack.

**Why A wins, measured against the brief's own goals:**

| Goal | How "The Switch" delivers |
| --- | --- |
| **Instant understanding (<10s)** | The split stage states the entire thesis in one glance — blind ledger vs seeing yard — before a word is read. |
| **Not fragmented** | One engine, four settings. You change your *world*, not your *page*. |
| **Demonstrate, not explain** | The transformation is triggered by the user; one real product moment plays in place. |
| **Memorable** | A single signature: the chalk-mark→QR mint on the seam. One thing to remember it by. |
| **Premium / trust** | Restraint within a mature system; concessions kept at equal weight; the buyer's current way is honored, never mocked. |
| **Conversion** | The proof moment sits right before the doors; the matrix cross-sells the other three comparisons. |

**Why not B:** it breaks a written engineering law (`no scrubbing, no scenes` on subpages), and it's aimed at the wrong device and network. Cinematic on a MacBook, broken on a ₹6,000 Android in a dusty yard — the literal user.

**Why not C as the lead:** it's the safe choice and I'm harvesting its best part, but on its own it keeps the experience in *explain* mode. It becomes a supporting section, not the hero.

**The decisive factor:** A is the only concept that reuses the architecture already in the repo — the `[data-s4]` dual-state toggle, `.reveal`, `.rule-draw`, `.qr-draw`, and the live S3/S4/S5 scene mechanics — so it satisfies "keep engineering quality" and "reuse instead of rewrite" *by construction*, while still being the boldest experience the motion law permits.

**Answering the brief's provocations directly:**

- *Should comparisons be separate pages?* **No — one engine.** But keep four URLs as honest front doors (SEO + deep links); each SSR-renders the engine pre-set to its incumbent.
- *Switch incumbents without changing pages?* **Yes** — the selector and the matrix columns both re-set the engine in place.
- *Should the workflow transform visually?* **Yes — that is the signature.** The paired `workflow`/`change` data is built for it.
- *Should scrolling be the comparison?* **No.** It violates the motion law and the device reality. Scroll *reveals*; it does not *scrub*.
- *Side-by-side? Cards morph? Timelines transform?* **Side-by-side, yes; the ledger transforms, yes; morph with discipline** (transform/opacity only).
- *Should the product prove itself live?* **Yes — once, in place, reusing the demos that already exist.**

**A note on the AI-default trap (per the design method).** The established ShilaTeq brand — warm paper, a Fraunces serif, an ochre accent — is close to the most common AI-generated "look." But that palette is the *brand*, mandated by the brief, and the method says follow a pinned direction exactly. So I spend the differentiation where it's honestly mine to spend: on the **interaction** (a yard being given sight) and on the **ledger-mono treatment of the blind side**, both of which are specific to *this* subject and could not be lifted onto another product. No token changes, no new palette — the memorability is in the verb, not the veneer.

---

## 6. Complete information architecture

**Route model — one experience, four honest front doors.**

```
/why                     → the engine, no incumbent pre-selected:
                           question + "which are you?" chooser + canonical matrix
/why/vs-paper            → the engine, SSR pre-set to Paper
/why/vs-excel-whatsapp   → the engine, SSR pre-set to Excel + WhatsApp
/why/vs-tally-accounting → the engine, SSR pre-set to Accounting
/why/vs-erp              → the engine, SSR pre-set to Generic ERP
```

`generateStaticParams` + `dynamicParams=false` stay exactly as they are. Each URL statically renders the full, unique content for its incumbent (metadata, FAQ JSON-LD, everything). With JS, moving between incumbents soft-navigates (`history.pushState` to the real URL) so the shared engine chunk is reused and bookmarks/shares always resolve to a real SSR page.

**Section order for a selected incumbent** (data source in code-brackets):

```
┌ Persistent engine chrome ─────────────────────────────────────┐
│ 0  The question + incumbent selector        [nav / site copy]  │
├───────────────────────────────────────────────────────────────┤
│ 1  Respect-first opener                     [c.h1, c.respect]  │
│ 2  ▣ THE SWITCH — split stage (signature)   [c.workflow ↔ c.change]
│ 3  The hidden costs                          [c.hiddenCosts]   │
│ 4  The concession (equal weight, binding)    [c.wins]         │
│ 5  Where it breaks — structurally            [c.breaks]       │
│ 6  Proof, not claims — one live micro-demo   [c.demoMicroline/Href + reused scene]
│ 7  The honest trade-offs                      [c.tradeoffs]   │
│ 8  The bridge line                            [c.bridge]      │
│ 9  The whole picture — canonical matrix       [shared TABLE, col highlighted]
│ 10 FAQ                                         [c.faq]        │
│ 11 Accountant share (vs-tally only)            [c.accountantShare]
│ 12 Related reading                             [c.related]    │
│ 13 Doors — decide on evidence                  [DoorsBlock]   │
└───────────────────────────────────────────────────────────────┘
```

**The only genuinely new UI is sections 0 (selector), 2 (the switch), and the *treatment* of 3 and 6.** Everything else is existing content re-flowed. Sections 9–13 are lifted almost verbatim from today's components.

**Desktop wireframe — the split stage (§2), the heart of the redesign:**

```
┌──────────────────────────────────────────────────────────────────┐
│  WHY SHILATEQ                                                       │
│  “Why not keep doing what I do?”                                    │
│  [ Paper ] [ Excel + WhatsApp ] [ Accounting ] [ Generic ERP ]     │ ← selector (mono, paper-sm)
├──────────────────────────────────────────────────────────────────┤
│  The register built your business. It just can’t see.              │ ← c.h1 (Fraunces)
│  Let’s say it plainly: the paper register is a serious system…     │ ← c.respect
├────────────────────────────────┬─────────────────────────────────┤
│  YOUR YARD TODAY        (blind) │ THE SAME YARD, SEEING            │
│  ── ledger · mono · ink-500 ─── │ ── warm · paper-2 · ink-900 ──── │
│  01 Stock arrives   chalk mark  │ 01 Stock arrives   [▣]→QR, costed│
│  02 A buyer asks    walk the row│ 02 A buyer asks    type “marbel” │
│  03 A block is cut  slabs counted│03 A block is cut  recovery + rem│
│  04 Credit given    in his head │ 04 Credit given    exposure, live│
│  05 Month-end       “probably”  │ 05 Month-end       one-tap GST   │
│                    ╎                                               │
│           [ ◉─ Give it eyes ▸ ] ╎  ← the switch, sitting on the seam│
└────────────────────────────────┴─────────────────────────────────┘
```

**Mobile wireframe (<640px) — the split stacks:**

```
┌─────────────────────┐
│ ‹ Paper  Excel  … ›  │ ← selector: horizontal scroll-snap
│ The register built…  │ ← c.h1
│ (respect line)       │
│ ┌─────────────────┐  │
│ │ TODAY   (blind) │  │ ← ledger card, mono
│ │ 01…05           │  │
│ └─────────────────┘  │
│ [   Give it eyes   ] │ ← full-width switch (≥44px)
│ ┌─────────────────┐  │
│ │ SEEING  (warm)  │  │ ← revealed card, QR spark
│ │ 01…05           │  │
│ └─────────────────┘  │
└─────────────────────┘
```

---

## 7. Describe every section

**§0 — The question + incumbent selector (persistent chrome).**
Eyebrow `Why ShilaTeq` (mono) + the constant question *"Why not keep doing what I do?"* + a segmented selector of the four incumbents. On `/why` (no selection) this sits above the "which are you?" framing; on a `/why/vs-*` page the selector shows the active incumbent. Labels use `c.eyebrow` verbatim (*"vs the paper register," "vs Excel & WhatsApp,"* …). Radius `--radius-paper-sm` (segments, never pills).

**§1 — Respect-first opener.**
Unchanged. `c.h1` in Fraunces `text-display-2`; `c.respect[]` paragraphs in `text-body-lg / ink-700`. This is load-bearing: the buyer's current way is honored *before* anything transforms. The switch that follows must never contradict this tone.

**§2 — The Switch (split stage). NEW — the signature.**
Two columns across a seam. **Left = "Your yard today"** renders `c.workflow[]` in the ledger voice (mono station numbers `01–05`, `ink-500`, hairline rows, a chalk-mark glyph per station). **Right = "The same yard, seeing"** renders `c.change[]` — the *same five stations*, warm, with a single QR/`accent-600` spark and `ok-600` confirmations. A labeled **switch** ("Give it eyes") transforms left→right. The station rows are aligned so the *n*th "today" line sits opposite the *n*th "seeing" line — the parallelism the data always had, finally visible. Heading remains a real `<h2>` for AT/SEO.

**§3 — The hidden costs.**
`c.hiddenCosts[]` presented as costs the *blind* side pays. Each is a `<details>`: summary = the named cost (*"The unfound block," "The invisible wastage"*), body = the line. `danger-600` used only as a small labeled tag ("hidden cost"), never color-alone. Progressive disclosure keeps the section short until the buyer probes.

**§4 — The concession (binding, equal weight).**
`c.wins` in a bordered `paper-2` card with `shadow-desk` — **identical visual weight to a wins block**, per content law. Title `c.wins.title` (*"Where paper honestly wins"*), items with a neutral `✓`. This section is *never* visually diminished; its credibility is the whole site's credibility.

**§5 — Where it breaks — structurally.**
`c.breaks[]` as `[term, line]` hairline rows. Framed as "why the today side can't reach the seeing side even with effort" — structural, not a jab.

**§6 — Proof, not claims (one live micro-demo). NEW treatment.**
One embedded, working demonstration matched to the incumbent, reusing an existing scene mechanic:

| Incumbent | `demoMicroline` | Reused live moment |
| --- | --- | --- |
| Paper | *find a block in seconds — with a typo* | S3-style identity + typo-search: type `marbel` → a block card resolves |
| Excel + WhatsApp | *watch an order refuse to double-sell* | S4 gate: attempt to reserve a taken block → refused |
| Accounting | *see an invoice born correct* | S4 invoice moment: CGST/SGST split renders at sale time |
| Generic ERP | *the Hindi, offline cut* | S5 offline sync: a cut logged with no signal, syncs on reconnect |

The `demoHref` still links to the full `/demo` for the deep experience; the difference is the buyer now *sees it work here first*. At most **one** such moment per page (the typing flourish, if used, is the page's single typing moment — matching the home page's discipline).

**§7 — The honest trade-offs.**
Unchanged `HonestyStrip` over `c.tradeoffs[]`; roadmap items keep their flag.

**§8 — The bridge line.**
`c.bridge` alone, Fraunces `text-display-2` — the emotional close (*"Keep the discipline of your register. Give it eyes."*).

**§9 — The whole picture (canonical matrix). Harvested from Concept C.**
The 5-column register (Paper · Excel · Accounting · Generic ERP · ShilaTeq) with the two **against-us concession rows** intact, and the active incumbent's column highlighted. This is the zoom-out after the deep dive and the cross-sell: tap another column header to switch the engine. Promoted from `/why/page.tsx` into a shared component so hub and engine share one source.

**§10 — FAQ.** Unchanged `<details name>` exclusive-open accordion over `c.faq[]`.

**§11 — Accountant share.** Unchanged; renders only when `c.accountantShare` (vs-tally).

**§12 — Related reading.** Unchanged `c.related` pillar + guides links.

**§13 — Doors.** Unchanged `DoorsBlock` — *"Decide on evidence, not on our words."*

---

## 8. Describe every interaction

1. **Incumbent selector.** Rendered as four real `<a>` segments (work with no JS as four pages). With JS, clicks soft-navigate and animate the swap (§9 curtain re-stage). Keyboard: native link tabbing; as an enhancement, arrow-key roving between segments with `Home`/`End`. The active segment carries `aria-current="page"`.
2. **The Switch.** A real `<button>` with `aria-pressed`, accessible name *"Show the same yard on ShilaTeq."* Built on the `[data-s4]`-proven dual-state pattern: **both** columns are server-rendered; the button toggles `.is-seeing` on the stage; CSS owns the transition. On activation, focus moves to the seeing column's heading (mirroring how `SceneRunner` moves focus to `[data-gate-paid]`), so keyboard/AT users land on the outcome.
3. **Seam-scrub (desktop enhancement — the one risk).** On fine-pointer viewports, the seam can be dragged to wipe blind→seeing. Implemented as a labeled `role="slider"` (`aria-valuemin/max/now`, arrow-key operable) — **never the only affordance.** The button is canonical; the scrub is sugar. Disabled on coarse pointers and under reduced motion.
4. **Hidden-cost disclosure.** Native `<details>/<summary>` — accessible, no-JS friendly, zero hydration.
5. **Live micro-demo.** The existing scene interaction: tap-anywhere completes instantly (S3), the gate button records payment (S4), the sync resolves on dwell/scroll (S5). Reused, not rebuilt.
6. **Matrix column switch.** Hover/focus highlights a column; the active incumbent's column is pre-highlighted; clicking a tool's header re-sets the engine to that incumbent (same soft-nav as the selector).
7. **FAQ accordion.** Unchanged exclusive-open behavior via shared `name`.
8. **Doors / CTAs.** Unchanged demo + WhatsApp affordances.

---

## 9. Describe every animation

All within the site's motion law: **transform/opacity only**, plus the two sanctioned draws (the single typing flourish and SVG stroke draws); every effect plays **once**; `prefers-reduced-motion` and `no-js` resolve to the end-state; the only permitted loop is the S5 chip-breath, which pauses offscreen.

| Moment | Technique | Tokens |
| --- | --- | --- |
| **Selector / incumbent swap** | Curtain re-stage (reuse `.s6-stage-l/-r` slide ±16px + `.s6-frame` fade) as content swaps | `--t-narrative` / `ease-standard` |
| **The Switch → seeing** | Blind mono rows `translateY`+fade out; seeing rows rise+fade in, staggered ≤5 @ 40ms (reuse `.stagger`) | `--t-slow` |
| **Chalk-mark → QR mint** (signature) | The sanctioned SVG stroke draw — chalk glyph strokes into a QR grid via the existing `qr-draw` keyframe | `--t-base` |
| **The seam** | Draws in with `rule-draw` (`scaleX(0→1)`, left origin) | `--t-slow` |
| **Section reveals** | Existing `.reveal` rise+fade, once, via `RevealRunner` (IntersectionObserver @ 20%) | `--t-slow` |
| **Typo-search proof** | S3 typing flourish (clip-path steps + caret blink×2) — the page's *one* typing moment | existing `type-in` |
| **Gate proof** | S4 gate tick (SVG `s4-tick` stroke draw) on record | `--t-base` |
| **Offline proof** | S5 `chip-breath` (the only loop; `chip-paused` offscreen) → resolution tick | 2s ease-in-out |
| **Bridge line** | Rise+fade once | `--t-slow` |

**Reduced motion / no-JS:** the stage renders **both columns fully resolved side-by-side** (the "seeing" state legible without any toggle), every draw at its end-state, no scrub, no cross-fade. The experience degrades to an honest static split — which is *still* a better comparison than today's stacked lists.

---

## 10. Desktop and mobile behavior

**Mobile-first — because the literal user is on a cheap Android in the sun.**

| Breakpoint | Split stage | Selector | Matrix | Scrub |
| --- | --- | --- | --- | --- |
| **< 640** | **Stacks:** Today card → full-width switch → Seeing card. Transform is a vertical recede/rise, not a horizontal wipe. | Horizontal scroll-snap row (or native `<select>` fallback) | Horizontal scroll (existing `min-w-[640px]` + `overflow-x-auto`) | Off (coarse pointer) |
| **640–1024** | Side-by-side, tighter gutters; seam present | Segmented, full row | Horizontal scroll | Off |
| **≥ 1024** | True side-by-side across the seam | Segmented, full row | Full 5-column table | On (enhancement) |

Touch targets ≥44px. The switch is thumb-reachable on mobile (between the two cards). No horizontal page scroll ever (only the matrix scrolls, inside its own container). The split's height is reserved (`contain-intrinsic-size`) so toggling causes **zero layout shift**.

---

## 11. Accessibility considerations

- **Content is never gated behind JS or motion.** Both "today" and "seeing" columns are always in the DOM (the `[data-s4]` dual-state contract). Screen readers, crawlers, and no-JS users get the complete "after." The switch is enhancement, not a content gate.
- **The switch** is a real `<button aria-pressed>` with a descriptive name; state changes are announced; focus moves to the outcome heading on activation.
- **The selector** is real links with `aria-current`; keyboard-operable with visible focus (the global `:focus-visible` accent ring, 2px offset, never suppressed).
- **The scrub**, if shipped, is a properly labeled `role="slider"` with keyboard support — and is redundant to the button, so nothing is slider-only.
- **Never color-alone.** Every ✓/~/✗ keeps its `sr-only` text (existing `CellMark`); cost/loss and confirm states pair `danger-600`/`ok-600` with an icon **and** a label (functional-color law).
- **Contrast holds on the blind side.** "Today" text stays `ink-500` (AA — 5.31:1 on paper-0 per A-007), **not** `stone-grey` (stone tokens are material-only, never text). The desaturated feel comes from layout and mono, not from illegible color.
- **Motion.** `prefers-reduced-motion` resolves all states, disables the one loop, removes the scrub. `prefers-contrast: more` promotes hairlines and muted text (existing rules).
- **Structure.** Every section keeps a real heading; the matrix keeps `<caption>`, `scope`, and the sr-only legend. Heading order is preserved for AT navigation.
- **Bilingual.** Mukta's Latin+Devanagari pairing is untouched; Hindi micro-copy in the proofs uses the existing font stack.

---

## 12. Performance considerations

- **The audience defines the budget:** cheap Androids, patchy 4G. Every decision optimizes for that.
- **Server-first.** All content stays in server components (like `Reveal`). The engine adds **one** small client island — an extension of `SceneRunner` — operating on server-rendered dual-state DOM via `data-*` attributes. No new framework, no scroll library, no canvas/WebGL, no Lottie/video.
- **Proofs are CSS/SVG** (transform/opacity + inline SVG), not media. The QR is inline SVG, a few hundred bytes.
- **`content-visibility: auto`** (`cv-scene`) on below-fold sections so first paint is only the question + split stage. LCP stays the Fraunces `h1` (already preloaded).
- **Zero layout shift** from the toggle (reserved stage height).
- **Soft-nav between incumbents** ships no new HTML framework cost — the content objects are static and tiny; the engine chunk is cached; prefetch on hover/focus.
- **Stays inside the existing Lighthouse CI budgets** (`lighthouserc.json`) — the redesign is a view-layer change plus one small island, not new weight.
- **The scrub** (if shipped) throttles `pointermove` via `rAF`, transforms only, fine-pointer only — and is absent everywhere it would cost.

---

## 13. SEO implications

**The crux: collapse the *experience*, not the *URLs*.**

- **Keep all four `/why/vs-*` routes** with their distinct `metaTitle` / `metaDescription` and per-incumbent **FAQPage JSON-LD**. These are four query-matched ranking pages (*"ShilaTeq vs the paper register," "ShilaTeq and Tally"*…); losing them would be an SEO regression, so the engine SSRs full unique content at each URL. `generateStaticParams` + `dynamicParams=false` stay; static export per URL is preserved.
- **No content is JS-gated.** Dual-state DOM means both the blind and seeing text — and every station, cost, break, and FAQ — is in the served HTML. Crawlers get everything.
- **`/why` stays the hub** with the matrix and the chooser and its own metadata; add `ItemList` + `BreadcrumbList` JSON-LD tying the four together.
- **Internal linking improves.** Today the hub cards link *out* one-way. The matrix column headers + the selector now cross-link **all four** comparisons from **every** comparison — a denser, more crawlable internal graph.
- **Canonicals.** Each `vs-*` self-canonicals; soft-nav uses `pushState` to the real URL so shares/bookmarks resolve to the SSR page.
- **Net:** equal-or-better SEO surface — same four indexable pages, richer interlinking, unchanged facts and metadata.

---

## 14. Migration strategy — reuse, not rewrite

This redesign is deliberately a **view-layer swap**. Nothing in the content or SEO layer changes.

**Unchanged (0 edits):**
- **`src/content/comparisons.ts`** — the typed `Comparison` model already carries every field the engine needs (`respect`, `workflow`, `hiddenCosts`, `wins`, `breaks`, `change`, `tradeoffs`, `bridge`, `faq`, `related`, `demoHref`, `demoMicroline`, `waPrefix`, `accountantShare`). **No copy, fact, or SEO edit.**
- **`src/app/why/[slug]/page.tsx`** routing, `generateStaticParams`, `generateMetadata`, JSON-LD wiring — untouched; it simply renders `<ComparisonEngine c={c}/>` instead of `<ComparisonPage c={c}/>`.

**Refactor (mostly lift-and-reflow existing JSX):**
- `ComparisonPage.tsx` → **`ComparisonEngine`** composed of section components:
  - `RespectOpener`, `HiddenCosts`, `Concession`, `Breaks`, `BridgeLine`, `Faq`, `Related` — **near-verbatim** extractions of today's JSX blocks.
  - `HonestyStrip`, `DoorsBlock`, `Breadcrumbs`, `JsonLd` — **reused as-is.**
  - **`SwitchStage`** (new) — the only substantial new component; its two columns are literally today's `c.workflow` and `c.change` ordered lists, placed side-by-side with the toggle wrapper.
  - **`CanonicalMatrix`** — promote the inline `TABLE`/`CellMark`/`COLS` from `why/page.tsx` into a shared component with a `highlightCol` prop; hub and engine both consume it.
  - **`IncumbentSelector`** — promote the hub `CARDS` into a shared segmented-links component.
- **Motion:** extend `SceneRunner` with two handlers that mirror the existing S4 pattern exactly — `data-vs` (selector state) and `data-switch` (stage toggle). Reuse `.reveal`, `.rule-draw`, `.qr-draw`, `.stagger`, `.s4-*`, `.s6-*`. Add a small `.vs-*` CSS block (transform/opacity only) for the split.
- **Live proofs:** extract the S3/S4/S5 scene bodies from the home components (`S3Identity`, `S4Pipeline`, `S5NightShed`) into reusable `IdentityProof` / `GateProof` / `OfflineProof` modules and mount the matched one per incumbent — **lift-and-parameterize, not new invention.**

**Governance:** token and motion changes "require a written amendment first" (globals.css header; phase-4/14 rule 1). This design is engineered to need **no token changes and no new motion primitives** — only compositions of existing ones — so it stays inside the amendment rules. Flag any deviation for amendment before coding.

**Tests:** existing Playwright specs (navigation, links, a11y, responsive) largely pass unchanged because URLs and metadata are preserved. Add: switch-toggle shows the seeing state and dual-state content is present without JS; selector soft-nav; reduced-motion resolves the split; axe on the new components. CI quality gates stay green.

**Incremental rollout (each step shippable):**
1. `SwitchStage` replaces the two stacked `workflow`/`change` lists. *(80% of the value, one component.)*
2. Fold `CanonicalMatrix` into the engine + add `IncumbentSelector`. *(Kills fragmentation.)*
3. Embed the matched live proof. *(Delivers "demonstrate.")*
4. Optional desktop seam-scrub. *(Delight, last, behind flags.)*

---

## 15. Final recommendation

**As a creative director sitting in the chair of Apple, Stripe, Linear, and Pentagram — would I approve the current comparison experience?**

**No.** I'd approve the *writing* on the spot — it's honest, specific, respectful, and rare. Then I'd reject the *experience*, because it commits the one unforgivable sin for a comparison: **it makes the reader assemble the comparison in their own head.** The single most comparative dataset on the site — five stations, before and after — is printed as two lists a thousand pixels apart, across four pages that look identical, ending in a promise of a demo instead of a demo. It's an essay wearing a product page's clothes. A stone-yard owner skimming on a sunlit phone will never do the assembly work, so the payload never detonates.

**And I'd reject the obvious over-correction just as fast.** No scroll-hijacked, pinned, cinematic set piece — it fights the product's own motion law, chokes the exact devices the product is built for, and reads as spectacle, not trust. Spectacle is the wrong currency for a buyer being asked to run a multi-crore business on your software.

**What I'd build is "The Switch."** One honest engine. Four front doors. The buyer picks their own world, sees it rendered without insult in the old ledger voice, taps once, and **watches the same yard gain sight** — the register line becoming a QR-tagged block, the walk-the-rows becoming type-three-letters — then watches one real product moment prove it, right there. Keep every word. Keep every concession at full weight. Keep the four URLs and the SEO. Change only the verb: **from *explain* to *show*.**

That is the smallest change that turns the weakest-performing part of the site into the strongest — and, because it's built from the `SceneRunner` dual-state pattern, the `qr-draw` and `reveal` primitives, and the live S3/S4/S5 moments already in this repo, it ships as a **refactor, not a rewrite.**

Approve **The Switch.** Ship it in four increments. Let the register, at last, be given eyes.

---

*Prepared as a design proposal. No product copy, comparison facts, positioning, or metadata are altered by this document; it changes the container, not the content.*
