# Comparison Engine — Redesign & Build Spec

> One premium, tabbed comparison engine that replaces the four documentation-style comparison pages.
> Same facts, same SEO, same honesty law — a completely new presentation.

This spec is the build contract for the implementation shipped alongside it. It supersedes the *presentation* recommended in `COMPARISON_REDESIGN.md` (which analysed the problem in depth) with the concrete engine the product owner asked for: an instant tab switcher with a feature-by-feature comparison.

---

## 1. Objective

Turn `/why` from *four essays* into **one comparison instrument**. A stone-yard owner should understand why StoneX is better — and, honestly, where it isn't — **within 10 seconds**, on a phone, without reading paragraphs.

**Kept, unchanged:** every comparison fact, every honest concession, every SEO URL, the FAQ + JSON-LD schemas, internal linking, the design tokens, and the motion law. **Replaced:** how the information is presented.

---

## 2. The experience

```
┌───────────────────────────────────────────────────────────────┐
│  Compare StoneX with                                           │  ← sticky
│  [ Paper Register ] [ Excel ] [ WhatsApp ] [ Accounting ] [ ERP ]│    tablist
│  ─────────────────────────────────────────────────────────────│
│  Feature            {Selected tool}          StoneX            │  ← column header
├───────────────────────────────────────────────────────────────┤
│  QR block identity                                             │
│  Scan any stone…    ✕ Manual — a chalk mark   ✓ Included ·⟡    │  ← StoneX advantage
│                     on the stone               permanent QR    │
├───────────────────────────────────────────────────────────────┤
│  GST invoicing                                                 │
│  Compliance in a tap ✓ Included — books it    ✓ Included       │  ← honest tie
│                       after the fact          at sale time     │
├───────────────────────────────────────────────────────────────┤
│  Statutory books & filing                                      │
│  Keep your CA happy  ✓ Included ·◆ wins here  △ Exports to it  │  ← incumbent wins
└───────────────────────────────────────────────────────────────┘
        Where the Paper Register honestly wins →  (concessions)
```

- **Switching tabs is instant** — client state, **no route change, no reload**. Only the changed cells animate; the feature names and the StoneX column hold still (zero CLS).
- **Each incumbent still has its own URL** (`/why/vs-paper`, `/why/vs-excel-whatsapp`, `/why/vs-whatsapp`, `/why/vs-tally-accounting`, `/why/vs-erp`) which SSR-renders the engine with that tab preselected — the tabs are the UX, the URLs are the SEO.

---

## 3. Information architecture

| Layer | Decision |
| --- | --- |
| **Engine** | One client component, `CompareEngine`, driven by a static typed dataset (`src/content/compare.ts`). |
| **Tabs** | Five incumbents: Paper Register · Excel · WhatsApp · Accounting · Generic ERP. *(Excel and WhatsApp split into separate tabs per the brief; Accounting kept so no existing comparison point or URL is dropped.)* |
| **Rows** | ~14 feature rows grouped in four sections: **Inventory · Sales & Money · Floor & People · Growth**. |
| **Row anatomy** | Feature name · business benefit · *Current method* (per incumbent) · *StoneX* · winner emphasis + status indicator. |
| **Honesty panel** | Below the grid: **"Where {incumbent} honestly wins"** — the real advantages of the current tool (from `comparisons.ts` `wins`). |
| **Retained SEO/trust** | Per-incumbent respect intro, honest trade-offs, FAQ (+ FAQPage JSON-LD), related links, and the doors — kept below the engine. |

**Route map** (`compare.ts` → `compareRoutes`): each URL sets the initial tab and reuses the matching `comparisons.ts` object for the narrative/FAQ/metadata; `vs-whatsapp` is added (additive — no existing URL removed) with WhatsApp-focused metadata.

---

## 4. Visual & color system

Built entirely from existing tokens (`globals.css`) — no new palette, no gaming UI.

| Meaning | Treatment |
| --- | --- |
| **StoneX advantage** | Soft green cell — `bg-ok-100` (#e4eddf) tint, `ok-600` (#3e6b3f) check + a small "StoneX advantage" label. |
| **Incumbent wins / partial** | Soft amber — `bg-warn-100` (#f3e7cb) tint, `warn-700` text, honest "{tool} wins here". |
| **Neutral / manual** | Paper — `paper-2` surface, `ink-500` glyph. No red, ever. |
| **Cards** | `rounded-paper` (6px), `border-line-100`, `shadow-desk` on hover. Generous spacing; large type (`text-heading-3` feature names, `text-body` methods). |
| **Type** | Fraunces for section headers, Mukta for feature/body, JetBrains Mono for the eyebrow, status labels, and the legend. |

**Status indicators** (glyph + always a text label, never color-alone):

| Glyph | Status | Use |
| --- | --- | --- |
| `✓` | **Included** | native capability |
| `△` | **Partial** | possible with effort |
| `✕` | **Manual** | only by hand / not modelled |
| `⚠` | **Depends** | depends on config/setup |
| `🔒` | **Planned** | on the StoneX roadmap (StoneX column only) |

**No scores, no ratings, no stars.** Emphasis is carried by the soft-green cell + a subtle "StoneX advantage" label, nothing louder.

---

## 5. Honesty (load-bearing)

StoneX must **not** win every row. Encoded in the data:

- **GST invoicing** — Accounting and ERP are `Included` too → honest **tie**.
- **Statutory books & filing** — Accounting/ERP **win**; StoneX exports to them and says so.
- **Multi-branch rollups** — Generic ERP **wins**; StoneX is `Planned` (🔒), stated plainly.
- **Offline on the floor** — Paper ties (a register needs no signal).
- **Reports & analytics** — ERP is strong; marked honestly.
- **The concession panel** gives each tool its real due: Paper *"no training,"* Excel *"infinitely flexible,"* WhatsApp *"every customer already uses it,"* ERP *"more configurable,"* Accounting *"the system of record for money."*

No invented numbers, no exaggerated claims — trust is the conversion mechanism.

---

## 6. Interactions & motion

- **Tab switch:** `useState`; the incumbent-dependent cells carry `key={incumbentId}` so only they remount and replay a gentle **`cmp-swap`** (opacity 0→1, `translateY(6px)→0`, ~240ms `ease-standard`, light per-row stagger capped at 5). Feature names + StoneX column never remount → **no layout shift, no whole-page animation**.
- **Hover:** rows lift one `shadow-desk` step; tabs highlight. Transitions ~180ms.
- **Keyboard:** proper **ARIA tabs** — `role="tablist"`/`tab`/`tabpanel`, `aria-selected`, roving `tabindex`, Left/Right/Home/End to move, Enter/Space to select. Visible focus via the global accent ring.
- **Reduced motion:** `cmp-swap` disabled — cells swap instantly. **No-JS:** the SSR tab renders fully; tabs simply don't switch (each is reachable by its own URL).
- **Implementation of "Motion":** delivered with CSS transitions/keyframes + one small client island — *not* a JS animation library. This honors the site's transform/opacity motion law and the performance budget for cheap Android phones on patchy 4G (the literal audience), while still giving gentle, CLS-free row transitions.

---

## 7. Responsive behavior

| Breakpoint | Layout |
| --- | --- |
| **≥ 1024** | Three-column grid per row: Feature+benefit · Current method · StoneX. Sticky tab bar + column header. |
| **640–1024** | Same grid, tighter gutters. |
| **< 640** | **Stacked cards, never horizontal scroll.** Each feature is a card: name + benefit, then two labelled blocks — *{Tool}* and *StoneX* (green-tinted) — with the winner badge. Tabs become a horizontal scroll-snap row. Text stays ≥ the 17px reading floor. |

---

## 8. Accessibility

- Full ARIA tabs pattern, keyboard-operable, visible focus.
- Every status is glyph **+ text label** + `sr-only` where needed — never color-only.
- Contrast holds: green/amber tints use AA-verified `ok-600`/`warn-700` text; "current method" text stays `ink-700`/`ink-500` (never the stone material tokens).
- SSR renders the active tab's full content → assistive tech and no-JS users get a complete comparison; tab switching is enhancement.
- `prefers-reduced-motion` and `prefers-contrast` respected (existing global rules).

---

## 9. Performance

- One small client island (the engine). All data is static and serializable; passed as props, no fetch.
- CSS/SVG motion only; no animation library, no canvas, no layout thrash.
- Stable grid + reserved cell min-heights → **CLS ≈ 0**.
- SSR of the initial tab keeps LCP text server-rendered; stays within the existing Lighthouse CI budgets.

---

## 10. SEO

- **All five incumbent URLs are preserved/added** and SSR-render the engine with a unique, focused, indexable comparison + its own `metaTitle`/`metaDescription`.
- FAQ + FAQPage JSON-LD retained per incumbent; add `BreadcrumbList`.
- Tabs are client state (no route change) but every incumbent is independently reachable and crawlable via its URL, the `/why` hub, and internal links — a denser internal graph than the old one-way cards.
- No duplicate-content bloat: each URL SSRs **its own** incumbent as the primary content, not all five.

---

## 11. Engineering / migration — reuse, not rewrite

**New:**
- `src/content/compare.ts` — the feature dataset, incumbents, concessions, and route map (derived from existing content; **no invented facts**).
- `src/components/why/CompareEngine.tsx` — the client engine (tablist + rows + mobile cards + indicators + legend + concession panel).
- A small namespaced `.cmp-*` block in `globals.css` (one keyframe).

**Reused unchanged:** `comparisons.ts` (facts, FAQ, tradeoffs, metadata, related, JSON-LD), `Breadcrumbs`, `HonestyStrip`, `DoorsBlock`, `Badge`, `JsonLd`, `Button`, the tokens, and `RevealRunner`.

**Rewired:** `/why/page.tsx` (hub → engine, default tab Paper) and `/why/[slug]/page.tsx` (engine preselected + retained narrative). The old `ComparisonPage.tsx` is retired.

**Risk control:** no token or motion-primitive changes (which would require a written amendment) — only compositions of existing ones. Existing Playwright specs keep passing because URLs and metadata are preserved.

---

## 12. Definition of done

- [x] One tabbed engine; instant switching; no reload; no route change.
- [x] ~14 honest feature rows; StoneX does **not** win everything.
- [x] Premium light-theme UI; soft-green/amber semantics; five status indicators.
- [x] Desktop table → mobile cards; no horizontal scroll.
- [x] Keyboard + reduced-motion + no-JS support.
- [x] All comparison URLs preserved; metadata + FAQ JSON-LD intact.
- [x] Reuses existing data/schemas; `typecheck` + `lint` + `build` green.

---

*Ships with the implementation in the same change. The result should be one of the strongest sections of the site — a world-class SaaS comparison, not a documentation page.*
