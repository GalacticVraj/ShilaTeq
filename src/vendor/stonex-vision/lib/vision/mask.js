// The editable surface mask behind "tap the floor": an ordered list of taps, each ADDING or
// REMOVING the region the segmenter proposed for the point under the finger. Later taps win —
// an "add" after a "remove" brings the area back — so one over-large "remove" can never veto every
// later "add" (the failure the bake-off measured with plain union(adds) − union(removes)).
//
// Regions are kept at the mask resolution as 0–255 soft values (≈1 byte per pixel per tap);
// the composition goes through StoneX cleanup: edges snapped to the photo (guided filter), stray
// specks and pin-holes removed, 1 px feather for compositing. The photo itself is never touched.
import { stonexPostprocess, featherAlpha, boxMean } from './segment/postprocess.js'

export { featherAlpha }

export const MASK_LIMITS = Object.freeze({
  maxOps: 40, // older taps are folded into the base (undo stops there)
  minComponentFrac: 0.0005, // a separate blob smaller than this share of the photo is noise …
  maxHoleFrac: 0.00003, // … and so is a pin-hole this small (chair legs are much bigger: kept)
  // a slightly larger hole is filled only when it LOOKS like the floor around it (a segmenter's slip
  // in a shadow); a chair leg or anything that differs from the floor stays out of the mask
  maxFloorLikeHoleFrac: 0.0008,
  floorLikeLuma: 0.06,
  minPositiveArea: 0.002, // a floor proposal must cover at least this share of the photo …
  maxPositiveArea: 0.85, // … and not (nearly) all of it
  minNookArea: 0.0002, // a left-out spot added by a later tap can be this small
  // A THIN strip the segmenter left out inside the floor (along a sun patch's edge, a shadow
  // line) is filled when it has the floor's own colour and its brightness lies within the floor's
  // around it — light changes brightness, not colour. Anything else stays out (safe default).
  thinGapFrac: 0.018, // half-width ≤ this share of the photo's long side
  maxThinGapFrac: 0.02, // area ≤ this share of the photo
  gapChroma: 0.025, // normalised r,g distance to the floor around it
  // The first tap must find FLOOR: some open area at least 2 × this share of the long side across.
  // A rope, a chair's frame or a cable is thin everywhere (real photos: a tap on a museum rope).
  openRadiusFrac: 0.01,
  minOpenShare: 0.15, // … over at least this share of the proposal
  widening: 1.1, // a floor's lower half is at least this much wider than its upper half (perspective)
  // a proposal reaching the photo's top edge is floor AND wall when another, at least this share of
  // its size and this share of the photo, doesn't reach it (that one is the floor)
  floorOnlyShare: 0.25,
  floorOnlyMin: 0.1,
  // A selection no bigger than this share of the photo is a tile or two, not a floor yet: the next
  // tap is judged like a first tap (the whole floor, not one more tile — real phone, tiled floor)
  floorSized: 0.05,
  // The floor continues into its own contact shadow (extendIntoShadows): at most this share of the
  // long side, where the segmenter gave it at least this probability, within this colour distance
  shadowBandFrac: 0.012,
  shadowMinSoft: 0.4,
  shadowChroma: 0.04,
  // A separate blob lying wholly above the tapped floor, by more than this share of the photo's
  // height and in its upper half, is a wall of the floor's colour (a beige carpet and a beige wall)
  aboveGapFrac: 0.08,
  // A proposal reaching the photo's top edge that, across most of its columns, stops at least this
  // share of the height above the bottom edge is a wall (or a door, a window, a curtain) — even when
  // one corner of it reaches the bottom (a side wall in a corridor photo)
  wallGap: 0.15,
  // A first tap is laid WITHOUT ASKING only when its proposal meets the photo's bottom edge across at
  // least this share of the photo's width: the floor in front of the camera. A bed, a sofa, a table
  // top or a rug is a flat surface like a floor; standing on the floor, it doesn't meet the bottom
  // edge, or meets it only beside the floor (177 labelled first taps in 23 real rooms: stone was laid
  // on a non-floor surface without asking for 75 of 111 such taps before, 0 with this; 13 of 66 floor
  // taps — floors partly hidden by furniture — are now asked about too). Anything less is shown and
  // the customer is asked.
  floorContact: 0.5,
  // An ADD once the floor is selected is laid at once only when this share of what it adds lies within
  // this share of the long side of the floor already selected (and isn't a wall) — else it is asked
  // about (addVerdict)
  addNearFrac: 0.015,
  addNearShare: 0.5,
})

/**
 * Could a first tap's proposal be the FLOOR? Refused only on strong evidence:
 *  • 'THIN'     — no open area: a rope, a chair's frame, a cable (isOpenRegion);
 *  • 'STANDING' — taller than it is wide, and not reaching the photo's bottom edge, or reaching it
 *                 with less than half its width — unless it meets it broadly (≥ 30 %) and widens
 *                 towards it: a chair, a person, an animal, a cupboard (real photo: a tap on a dog
 *                 at the edge took it and a chair). A floor seen in perspective widens towards the
 *                 camera — so a strip of floor between two beds, whose bottom corners a pillow and
 *                 a blanket hide, is still floor (real phone: refusing it left ONE tile selected);
 *  • 'WALL'     — touching the photo's top edge but not its bottom one, or only at a corner (across
 *                 most of its width it stops well above the bottom edge): a wall, a window, a door,
 *                 a curtain (a floor reaches the bottom edge — even seen straight from above).
 * A bed's top, a sofa's seat or a table's top is a flat surface like a floor and is not refused:
 * the customer is asked instead (chooseFirstTap).
 * @returns {null | 'THIN' | 'STANDING' | 'WALL'}
 */
export function notFloorReason(region, w, h) {
  return proposalFacts(region, w, h).reason
}

/**
 * notFloorReason's answer, plus what the first-tap decision weighs: whether the proposal's body
 * reaches the photo's top edge (a floor doesn't — floor and wall taken as one does), how much of the
 * photo's bottom edge it meets (`contactShare`, of the photo's width) and how far above the bottom
 * edge it typically stops (`gap`: the median over its columns, of the photo's height).
 * @returns {{ reason: null | 'THIN' | 'STANDING' | 'WALL', top: boolean, contactShare: number, gap: number }}
 */
export function proposalFacts(region, w, h) {
  // judged on the proposal's body: a few stray specks of it far up the photo stretched its outline
  // into a "tall thing on a narrow base" (real phone: the floor was refused, one tile was laid)
  const body = proposalBody(region, w, h)
  let x0 = w, y0 = h, x1 = -1, y1 = -1
  const rowCount = new Int32Array(h)
  const low = new Int32Array(w).fill(-1) // each column's lowest pixel of the body
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (!body[y * w + x]) continue
      rowCount[y]++
      low[x] = y
      if (x < x0) x0 = x
      if (x > x1) x1 = x
      if (y < y0) y0 = y
      if (y > y1) y1 = y
    }
  }
  if (x1 < 0) return { reason: 'THIN', top: false, contactShare: 0, gap: 1 }
  const band = Math.max(1, Math.round(0.02 * h))
  const bottom = y1 >= h - band, top = y0 < band
  // how wide the proposal meets the bottom edge (columns with any of it in the bottom band), and how
  // far above it the proposal stops in the middle of its columns (a floor: 0)
  let contact = 0
  const gaps = []
  for (let x = x0; x <= x1; x++) {
    if (low[x] < 0) continue
    gaps.push(h - 1 - low[x])
    if (low[x] >= h - band) contact++
  }
  gaps.sort((a, b) => a - b)
  const facts = { top, contactShare: contact / w, gap: gaps[gaps.length >> 1] / h }
  if (top && (!bottom || facts.gap >= MASK_LIMITS.wallGap)) return { reason: 'WALL', ...facts }
  const bw = x1 - x0 + 1
  // a chair cut off by the bottom edge meets it with a leg (2–9 % of its width on real photos), a
  // strip of floor with 30–50 %; an armchair widens towards its seat but doesn't meet it at all
  if (y1 - y0 + 1 > 1.2 * bw && contact < 0.5 * bw && !(contact >= 0.3 * bw && widensDownward(rowCount, y0, y1))) return { reason: 'STANDING', ...facts }
  return { reason: isOpenRegion(body, w, h) ? null : 'THIN', ...facts }
}

/** A proposal (0–1 floats or 0–255 bytes) as 0/255 bytes without its specks: parts under 5 % of its largest part. */
function proposalBody(region, w, h) {
  const thr = region instanceof Float32Array || region instanceof Float64Array ? 0.5 : 128
  const body = new Uint8Array(w * h)
  for (let i = 0; i < body.length; i++) body[i] = region[i] >= thr ? 255 : 0
  const parts = components(body, w, h, 255)
  const largest = parts.sizes.reduce((a, b) => Math.max(a, b), 0)
  for (let i = 0; i < body.length; i++) if (body[i] && parts.sizes[parts.labels[i]] < 0.05 * largest) body[i] = 0
  return body
}

/** Is a region clearly wider (pixels per row) in its lower half than in its upper half? */
function widensDownward(rowCount, y0, y1) {
  const mid = (y0 + y1 + 1) / 2
  let up = 0, nu = 0, low = 0, nl = 0
  for (let y = y0; y <= y1; y++) {
    if (y < mid) { up += rowCount[y]; nu++ } else { low += rowCount[y]; nl++ }
  }
  return nu > 0 && nl > 0 && low / nl >= MASK_LIMITS.widening * (up / nu)
}

/**
 * Does a proposal have OPEN area (see MASK_LIMITS.openRadiusFrac), or is it a thin thing — a rope,
 * a chair's frame, a cable? The photo's border is not an edge: the floor goes on beyond it.
 * `region`: Float32Array 0–1 (or 0–255 bytes) at w × h.
 */
export function isOpenRegion(region, w, h, { radiusFrac = MASK_LIMITS.openRadiusFrac, minShare = MASK_LIMITS.minOpenShare } = {}) {
  const thr = region instanceof Float32Array || region instanceof Float64Array ? 0.5 : 128
  const r = Math.max(2, Math.round(radiusFrac * Math.max(w, h)))
  const BIG = 1 << 30
  const d = new Int32Array(w * h)
  let on = 0
  // chessboard distance to the nearest pixel outside the region (two passes)
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x
      if (!(region[i] >= thr)) continue
      on++
      let v = BIG
      if (x > 0) v = Math.min(v, d[i - 1] + 1)
      if (y > 0) {
        v = Math.min(v, d[i - w] + 1)
        if (x > 0) v = Math.min(v, d[i - w - 1] + 1)
        if (x < w - 1) v = Math.min(v, d[i - w + 1] + 1)
      }
      d[i] = Math.min(v, BIG)
    }
  }
  let open = 0
  for (let y = h - 1; y >= 0; y--) {
    for (let x = w - 1; x >= 0; x--) {
      const i = y * w + x
      if (!d[i]) continue
      let v = d[i]
      if (x < w - 1) v = Math.min(v, d[i + 1] + 1)
      if (y < h - 1) {
        v = Math.min(v, d[i + w] + 1)
        if (x < w - 1) v = Math.min(v, d[i + w + 1] + 1)
        if (x > 0) v = Math.min(v, d[i + w - 1] + 1)
      }
      d[i] = v
      if (v >= r) open++
    }
  }
  return on > 0 && open >= minShare * on
}

/**
 * The selected floor continues into its own contact shadow — the dark band where it meets a bed or
 * a sofa — up to the object's real edge. The colour-snapped edge stops on the shadow's bright side
 * (dark floor is "different" in brightness), leaving a jagged strip of old floor (real phone, under
 * a bed: 3–5 px). Grown from the selection, in place, one 4-connected pixel at a time, at most
 * `shadowBandFrac` of the long side, through pixels that:
 *   • the segmenter itself gave at least `shadowMinSoft` (on the real photo: 0.40 on the last shadow
 *     pixel, 0.28 on the bed's wood — a black shoe or a dark cabinet are near 0),
 *   • are no brighter than the floor beside them (a shadow, not a lighter object),
 *   • have the floor's colour (brightness-free, regularised so a dark pixel's colour noise is
 *     damped): the brown wood of the bed stops it.
 * Kept short on purpose: further out it climbed walls of the floor's own grey and dark armchairs
 * (synthetic rooms with ground truth). Removed areas never come back: a "remove" tap leaves the
 * probability near 0 there.
 * @returns {number} pixels added
 */
export function extendIntoShadows(mask, soft, rgb, luma, w, h, limits = MASK_LIMITS) {
  const R = Math.max(3, Math.round(limits.shadowBandFrac * Math.max(w, h)))
  const K = 16 // colour regularisation: (c + K) / (r + g + b + 3K)
  const cr = (i) => (rgb[i * 4] + K) / (rgb[i * 4] + rgb[i * 4 + 1] + rgb[i * 4 + 2] + 3 * K)
  const cg = (i) => (rgb[i * 4 + 1] + K) / (rgb[i * 4] + rgb[i * 4 + 1] + rgb[i * 4 + 2] + 3 * K)
  // the selected floor's brightness and colour around every spot: means over the selection within
  // R, on a 4× coarser grid (smooth by nature)
  const s = 4, gw = Math.ceil(w / s), gh = Math.ceil(h / s), gn = gw * gh
  const M = new Float32Array(gn), L = new Float32Array(gn), CR = new Float32Array(gn), CG = new Float32Array(gn)
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x
      if (!mask[i]) continue
      const j = ((y / s) | 0) * gw + ((x / s) | 0)
      M[j]++; L[j] += luma[i]; CR[j] += cr(i); CG[j] += cg(i)
    }
  }
  const rs = Math.max(1, Math.round(R / s))
  const bM = boxMean(M, gw, gh, rs), bL = boxMean(L, gw, gh, rs), bR = boxMean(CR, gw, gh, rs), bG = boxMean(CG, gw, gh, rs)
  const n = w * h
  const steps = new Uint16Array(n) // 4-steps from the original selection
  const seen = new Uint8Array(n)
  const queue = new Int32Array(n)
  let head = 0, tail = 0, added = 0
  for (let i = 0; i < n; i++) {
    if (!mask[i]) continue
    const x = i % w
    if ((x > 0 && !mask[i - 1]) || (x < w - 1 && !mask[i + 1]) || (i >= w && !mask[i - w]) || (i + w < n && !mask[i + w])) queue[tail++] = i
  }
  const take = (j, from) => {
    if (mask[j] || seen[j]) return
    seen[j] = 1
    if (soft[j] < limits.shadowMinSoft) return
    const x = j % w, y = (j / w) | 0, c = ((y / s) | 0) * gw + ((x / s) | 0), m = bM[c]
    if (!(m > 0)) return
    if (luma[j] > (bL[c] / m) * 1.08 + 0.02) return // brighter than the floor here: not its shadow
    if (Math.abs(cr(j) - bR[c] / m) + Math.abs(cg(j) - bG[c] / m) > limits.shadowChroma) return
    mask[j] = 1
    steps[j] = steps[from] + 1
    added++
    if (steps[j] < R) queue[tail++] = j
  }
  while (head < tail) {
    const i = queue[head++], x = i % w
    if (x > 0) take(i - 1, i)
    if (x < w - 1) take(i + 1, i)
    if (i >= w) take(i - w, i)
    if (i + w < n) take(i + w, i)
  }
  return added
}

/** Normalised r and g of an RGBA pixel (brightness-free colour); two functions, no allocation per pixel. */
const chromaR = (rgb, i) => (rgb[i * 4] + 1) / (rgb[i * 4] + rgb[i * 4 + 1] + rgb[i * 4 + 2] + 3)
const chromaG = (rgb, i) => (rgb[i * 4 + 1] + 1) / (rgb[i * 4] + rgb[i * 4 + 1] + rgb[i * 4 + 2] + 3)

export class MaskError extends Error {
  constructor(code, detail) {
    super(code)
    this.name = 'MaskError'
    this.code = code
    if (detail !== undefined) this.detail = detail
  }
}

/**
 * Which of a segmenter's proposals a tap means. Candidates: [{ score, area (share of photo) }].
 * Add on a floor → the largest plausible proposal (floors are big; the bake-off saw SAM's own
 * top-scored mask pick one tile or one stair step). Add on a spot the selection left out (the
 * floor under a table, a corner) → the most confident proposal that covers that spot — the largest
 * one is usually the floor already selected, and the tap would change nothing. Remove → the most
 * confident proposal that cannot wipe out most of the current selection; else the smallest.
 * `covers[i]`: does candidate i contain the tapped point (only needed for a tap outside the selection).
 */
export function chooseCandidate(candidates, { label, currentArea = 0, tapInside = true, covers = null } = {}) {
  if (!Array.isArray(candidates) || !candidates.length) throw new MaskError('NO_REGION')
  if (candidates.length === 1) return 0
  const all = candidates.map((_, i) => i)
  const by = (key, better) => (best, i) => (better(candidates[i][key], candidates[best][key]) ? i : best)
  if (label === 'pos' && currentArea > 0 && !tapInside && covers) {
    const pool = all.filter((i) => covers[i] && candidates[i].area >= MASK_LIMITS.minNookArea && candidates[i].area <= MASK_LIMITS.maxPositiveArea)
    if (pool.length) return pool.reduce(by('score', (a, b) => a > b), pool[0])
  }
  if (label === 'pos') {
    const ok = all.filter((i) => candidates[i].area >= MASK_LIMITS.minPositiveArea && candidates[i].area <= MASK_LIMITS.maxPositiveArea)
    const pool = ok.length ? ok : all
    return pool.reduce(by('area', (a, b) => a > b), pool[0])
  }
  const cap = Math.max(0.5 * currentArea, 0.01)
  const ok = all.filter((i) => candidates[i].area <= cap)
  if (!ok.length) return all.reduce(by('area', (a, b) => a < b), 0)
  return ok.reduce(by('score', (a, b) => a > b), ok[0])
}

/**
 * A first tap's proposal (or a tap judged like one). The largest plausible one — unless it can't be
 * the floor (proposalFacts): then the largest that can, else nothing is laid (NOT_FLOOR). Floor and
 * wall as ONE proposal (an empty room, a plain wall of the floor's tone — the production model does
 * this) reaches the photo's top edge, a floor doesn't: a big enough proposal that doesn't is the floor
 * (real photos: 19 taps in 3 rooms laid stone up the walls; the floor-only proposal was always there).
 * `candidates`: [{ score, area, probAt(w, h) }]; the shape tests run at ow × oh.
 *
 * `ask`: whether the customer must confirm it before stone is laid — unless it meets the photo's
 * bottom edge broadly (MASK_LIMITS.floorContact) it may be a bed, a sofa, a table top or a rug:
 * 'RAISED' (it doesn't meet the bottom edge at all) or 'PARTLY' (only part of it).
 * @returns {{ choice: number, ask: null | 'RAISED' | 'PARTLY' }}
 */
export function chooseFirstTap(candidates, ow, oh) {
  let choice = chooseCandidate(candidates, { label: 'pos', currentArea: 0 })
  const known = new Map()
  const facts = (i) => { if (!known.has(i)) known.set(i, proposalFacts(candidates[i].probAt(ow, oh), ow, oh)); return known.get(i) }
  const plausible = (i) => candidates[i].area >= MASK_LIMITS.minPositiveArea && candidates[i].area <= MASK_LIMITS.maxPositiveArea
  const bySize = (a, b) => candidates[b].area - candidates[a].area
  const reason = facts(choice).reason
  if (reason) {
    const alt = candidates.map((_, i) => i).filter((i) => i !== choice && plausible(i)).sort(bySize).find((i) => !facts(i).reason)
    if (alt === undefined) throw Object.assign(new MaskError('NOT_FLOOR', reason), { kind: 'error' })
    choice = alt
  }
  if (facts(choice).top) {
    const big = candidates[choice].area
    const floorOnly = candidates.map((_, i) => i)
      .filter((i) => i !== choice && plausible(i) && candidates[i].area >= MASK_LIMITS.floorOnlyShare * big && candidates[i].area >= MASK_LIMITS.floorOnlyMin)
      .sort(bySize).find((i) => !facts(i).top && !facts(i).reason)
    if (floorOnly !== undefined) choice = floorOnly
  }
  const { contactShare } = facts(choice)
  return { choice, ask: contactShare >= MASK_LIMITS.floorContact ? null : contactShare > 0 ? 'PARTLY' : 'RAISED' }
}

/**
 * Which proposal an ADD means once the floor is selected: chooseCandidate's — unless it climbs to the
 * photo's top edge while the selected floor doesn't. The model proposes floor and wall as one (see
 * chooseFirstTap) and an add took the largest proposal: stone up the wall (real phone: the selection
 * went from 8 % to 63 % of the photo with one tap). Then, as for a first tap, a proposal that doesn't
 * reach the top edge — the largest (a tap on the selection) or the most confident one holding the
 * tapped spot (`covers`, a tap off it) — when there is one; else the pick stands and addVerdict asks.
 * The shape tests run at ow × oh. (23 real rooms: added parts reaching the top edge 49 → 29.)
 */
export function chooseAddCandidate(candidates, { currentArea, tapInside, covers = null, floorTop = false, ow, oh }) {
  const choice = chooseCandidate(candidates, { label: 'pos', currentArea, tapInside, covers })
  if (floorTop) return choice // the floor itself reaches the top edge (seen from above): nothing to tell
  const top = (i) => proposalFacts(candidates[i].probAt(ow, oh), ow, oh).top
  if (!top(choice)) return choice
  const pool = candidates.map((_, i) => i)
    .filter((i) => i !== choice && candidates[i].area >= MASK_LIMITS.minNookArea && candidates[i].area <= MASK_LIMITS.maxPositiveArea && (tapInside || !covers || covers[i]))
    .filter((i) => !top(i))
  if (!pool.length) return choice
  const better = tapInside ? (a, b) => candidates[a].area > candidates[b].area : (a, b) => candidates[a].score > candidates[b].score
  return pool.reduce((b, i) => (better(i, b) ? i : b), pool[0])
}

/**
 * Lay an ADD at once, or show it and ask first? `before` / `after`: the cleaned selection (0/1 at
 * w × h) without and with it. Laid at once only when what it added lies mostly (addNearShare) within
 * addNearFrac of the long side of the floor already selected, and isn't a wall (proposalFacts): the
 * strip along a bed, a corner the first tap missed, a spot under a table that the floor surrounds.
 * Anything else — a spot apart from the floor (real phone: a switch plate on the wall got stone), a
 * big new area (a bed, a table top, a wall, the floor beyond a sofa) — the model can't tell apart, so
 * the customer is asked. Production model, 23 real rooms + the phone's (local .vision-bench/add-eval.mjs):
 * adds putting stone on non-floor laid without asking 388/388 before (213 over 1 % of the photo) → 74/376,
 * none over 1 % (slivers at furniture's feet); taps on the floor: 91 laid at once (≤ 2 % of the photo),
 * 29 asked (23 of them ≥ 2 %). On a ≈ 320 px grid (phones).
 * @returns {null | 'ADDED'}
 */
export function addVerdict(before, after, w, h) {
  const s = Math.max(1, Math.round(w / 320)), sw = Math.ceil(w / s), sh = Math.ceil(h / s), n = sw * sh
  const R = Math.max(2, Math.round(MASK_LIMITS.addNearFrac * Math.max(sw, sh)))
  const A = new Uint8Array(n), dist = new Uint8Array(n).fill(R + 1)
  let front = [], added = 0
  for (let y = 0; y < sh; y++) {
    for (let x = 0; x < sw; x++) {
      const i = Math.min(h - 1, y * s) * w + Math.min(w - 1, x * s), j = y * sw + x
      if (before[i]) { dist[j] = 0; front.push(j) } else if (after[i]) { A[j] = 255; added++ }
    }
  }
  if (!added) return null // nothing new on the floor: nothing to ask
  // chessboard steps from the selected floor, up to R
  for (let k = 1; k <= R && front.length; k++) {
    const next = []
    for (const j of front) {
      const x = j % sw, y = (j / sw) | 0
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const xx = x + dx, yy = y + dy, q = yy * sw + xx
          if (xx >= 0 && yy >= 0 && xx < sw && yy < sh && dist[q] > k) { dist[q] = k; next.push(q) }
        }
      }
    }
    front = next
  }
  let near = 0
  for (let j = 0; j < n; j++) if (A[j] && dist[j] <= R) near++
  return near >= MASK_LIMITS.addNearShare * added && proposalFacts(A, sw, sh).reason !== 'WALL' ? null : 'ADDED'
}

/** 4-connected components of value `on`; returns { labels, sizes, touchesBorder }. */
function components(mask, w, h, on) {
  const labels = new Int32Array(w * h).fill(-1)
  const sizes = [], border = []
  const queue = new Int32Array(w * h)
  for (let start = 0; start < mask.length; start++) {
    if (labels[start] !== -1 || mask[start] !== on) continue
    const id = sizes.length
    let head = 0, tail = 0, size = 0, edge = false
    queue[tail++] = start
    labels[start] = id
    while (head < tail) {
      const i = queue[head++]
      size++
      const x = i % w, y = (i / w) | 0
      if (x === 0 || y === 0 || x === w - 1 || y === h - 1) edge = true
      if (x > 0 && labels[i - 1] === -1 && mask[i - 1] === on) { labels[i - 1] = id; queue[tail++] = i - 1 }
      if (x < w - 1 && labels[i + 1] === -1 && mask[i + 1] === on) { labels[i + 1] = id; queue[tail++] = i + 1 }
      if (y > 0 && labels[i - w] === -1 && mask[i - w] === on) { labels[i - w] = id; queue[tail++] = i - w }
      if (y < h - 1 && labels[i + w] === -1 && mask[i + w] === on) { labels[i + w] = id; queue[tail++] = i + w }
    }
    sizes.push(size)
    border.push(edge)
  }
  return { labels, sizes, touchesBorder: border }
}

/** Fill thin enclosed strips that look like the floor around them (see MASK_LIMITS); returns the count. */
function fillThinGaps(mask, w, h, guide, rgb, limits) {
  const n = w * h
  const thin = Math.max(2, Math.round(limits.thinGapFrac * Math.max(w, h)))
  // distance from every left-out pixel to the selection (chessboard), capped just above `thin`
  const dist = new Uint16Array(n).fill(thin + 1)
  let frontier = new Int32Array(n), next = new Int32Array(n), fn = 0
  for (let i = 0; i < n; i++) if (mask[i]) { dist[i] = 0; frontier[fn++] = i }
  for (let k = 1; k <= thin && fn; k++) {
    let nn = 0
    for (let q = 0; q < fn; q++) {
      const i = frontier[q], x = i % w, y = (i / w) | 0
      for (let dy = -1; dy <= 1; dy++) {
        const yy = y + dy
        if (yy < 0 || yy >= h) continue
        for (let dx = -1; dx <= 1; dx++) {
          const xx = x + dx
          if (xx < 0 || xx >= w) continue
          const j = yy * w + xx
          if (dist[j] > k) { dist[j] = k; next[nn++] = j }
        }
      }
    }
    const done = frontier
    frontier = next
    next = done
    fn = nn
  }
  const bg = components(mask, w, h, 0)
  const m = bg.sizes.length
  const thick = new Uint16Array(m), ok = new Uint8Array(m)
  for (let i = 0; i < n; i++) { const l = bg.labels[i]; if (l >= 0 && dist[i] > thick[l]) thick[l] = dist[i] }
  // thin is the test (a crack running out of the photo is still a crack); anything thick stays out
  for (let l = 0; l < m; l++) ok[l] = thick[l] <= thin && bg.sizes[l] <= limits.maxThinGapFrac * n ? 1 : 0
  if (!ok.some(Boolean)) return 0
  // colour and brightness of each candidate strip and of the floor right around it
  const st = Array.from({ length: m }, () => null)
  for (let l = 0; l < m; l++) if (ok[l]) st[l] = { r: 0, g: 0, n: 0, lum: [], rr: 0, rg: 0, rn: 0, ring: [] }
  const L = bg.labels
  const strip = (j) => (L[j] >= 0 && ok[L[j]] ? L[j] : -1)
  for (let i = 0; i < n; i++) {
    const l = L[i]
    if (l >= 0) {
      if (!ok[l]) continue
      const s = st[l]
      s.r += chromaR(rgb, i); s.g += chromaG(rgb, i); s.n++
      if ((s.n & 3) === 1) s.lum.push(guide[i])
      continue
    }
    // a selected pixel next to a candidate strip (left, right, above, below — the first one counts)
    const x = i % w
    let lj = x > 0 ? strip(i - 1) : -1
    if (lj < 0 && x < w - 1) lj = strip(i + 1)
    if (lj < 0 && i - w >= 0) lj = strip(i - w)
    if (lj < 0 && i + w < n) lj = strip(i + w)
    if (lj < 0) continue
    const s = st[lj]
    s.rr += chromaR(rgb, i); s.rg += chromaG(rgb, i); s.rn++
    s.ring.push(guide[i])
  }
  let filled = 0
  for (let l = 0; l < m; l++) {
    const s = st[l]
    if (!s || !s.rn || !s.n) continue
    const dc = Math.abs(s.r / s.n - s.rr / s.rn) + Math.abs(s.g / s.n - s.rg / s.rn)
    if (dc > limits.gapChroma) continue
    s.ring.sort((a, b) => a - b)
    s.lum.sort((a, b) => a - b)
    const lo = s.ring[Math.floor(0.05 * (s.ring.length - 1))], hi = s.ring[Math.ceil(0.95 * (s.ring.length - 1))]
    const mid = s.lum[s.lum.length >> 1]
    // a very thin strip may be much darker than the floor: a crack, a grout line — still floor
    const floorLo = thick[l] <= Math.max(2, thin / 3) ? 0.3 * lo : 0.7 * lo
    if (!(mid >= floorLo && mid <= Math.min(1, 1.35 * hi))) continue
    ok[l] = 2
  }
  for (let i = 0; i < n; i++) { const l = bg.labels[i]; if (l >= 0 && ok[l] === 2) { mask[i] = 1; filled++ } }
  return filled
}

/**
 * Remove specks (unless a positive tap is in them) and fill pin-holes, in place. With the photo's
 * luma (`guide`), small holes that look like the floor around them are filled too; with its
 * colour (`rgb`), thin left-out strips of floor as well.
 */
export function cleanMask(mask, w, h, { keepPoints = [], guide = null, rgb = null, limits = MASK_LIMITS } = {}) {
  const n = w * h
  const fg = components(mask, w, h, 1)
  const keep = new Set(keepPoints.map(([x, y]) => fg.labels[Math.min(h - 1, Math.max(0, Math.round(y))) * w + Math.min(w - 1, Math.max(0, Math.round(x)))]).filter((l) => l >= 0))
  let removed = 0, filled = 0, removedAbove = 0
  for (let i = 0; i < n; i++) {
    const l = fg.labels[i]
    if (l >= 0 && fg.sizes[l] < limits.minComponentFrac * n && !keep.has(l)) { mask[i] = 0; removed++ }
  }
  // the floor recedes UP the photo, it doesn't jump: a separate blob wholly above every tapped part
  // of it, by a clear gap and in the photo's upper half, is a wall of the floor's colour
  if (keep.size && limits.aboveGapFrac) {
    const m = fg.sizes.length
    const minY = new Int32Array(m).fill(h), maxY = new Int32Array(m).fill(-1)
    for (let i = 0; i < n; i++) {
      const l = fg.labels[i]
      if (l < 0) continue
      const y = (i / w) | 0
      if (y < minY[l]) minY[l] = y
      if (y > maxY[l]) maxY[l] = y
    }
    let top = h
    for (const l of keep) top = Math.min(top, minY[l])
    const cut = Math.min(top - limits.aboveGapFrac * h, 0.5 * h)
    for (let i = 0; i < n; i++) {
      const l = fg.labels[i]
      if (l >= 0 && mask[i] && !keep.has(l) && maxY[l] < cut) { mask[i] = 0; removedAbove++ }
    }
  }
  const bg = components(mask, w, h, 0)
  const fill = new Uint8Array(bg.sizes.length)
  for (let l = 0; l < bg.sizes.length; l++) {
    if (bg.touchesBorder[l]) continue
    if (bg.sizes[l] <= limits.maxHoleFrac * n) fill[l] = 1
  }
  if (guide) {
    // compare each candidate hole's luma with the floor pixels right around it
    const inSum = new Float64Array(bg.sizes.length), ringSum = new Float64Array(bg.sizes.length), ringN = new Uint32Array(bg.sizes.length)
    const small = (l) => l >= 0 && !bg.touchesBorder[l] && !fill[l] && bg.sizes[l] <= limits.maxFloorLikeHoleFrac * n
    const L = bg.labels
    for (let i = 0; i < n; i++) {
      const l = L[i]
      if (small(l)) { inSum[l] += guide[i]; continue }
      if (!mask[i]) continue
      // the first neighbouring candidate hole (left, right, above, below) gets this floor pixel
      const x = i % w
      let lj = x > 0 && small(L[i - 1]) ? L[i - 1] : -1
      if (lj < 0 && x < w - 1 && small(L[i + 1])) lj = L[i + 1]
      if (lj < 0 && i - w >= 0 && small(L[i - w])) lj = L[i - w]
      if (lj < 0 && i + w < n && small(L[i + w])) lj = L[i + w]
      if (lj >= 0) { ringSum[lj] += guide[i]; ringN[lj]++ }
    }
    for (let l = 0; l < bg.sizes.length; l++) {
      if (!small(l) || !ringN[l]) continue
      if (Math.abs(inSum[l] / bg.sizes[l] - ringSum[l] / ringN[l]) < limits.floorLikeLuma) fill[l] = 1
    }
  }
  for (let i = 0; i < n; i++) {
    const l = bg.labels[i]
    if (l >= 0 && fill[l]) { mask[i] = 1; filled++ }
  }
  const thinFilled = guide && rgb ? fillThinGaps(mask, w, h, guide, rgb, limits) : 0
  return { removed, removedAbove, filled: filled + thinFilled, thinFilled }
}

export class MaskEditor {
  /**
   * @param {number} width mask width (px) — the render resolution
   * @param {number} height
   * @param {{ guide?: Float32Array|null, rgb?: Uint8ClampedArray|null }} [opts] photo luma 0–1 and
   *   (optionally) its RGBA bytes at the same size — edges snap to colour, thin gaps get filled
   */
  constructor(width, height, { guide = null, rgb = null } = {}) {
    if (!(width > 0 && height > 0) || !Number.isInteger(width) || !Number.isInteger(height)) throw new MaskError('BAD_SIZE')
    if (guide && guide.length !== width * height) throw new MaskError('BAD_GUIDE')
    if (rgb && rgb.length !== width * height * 4) throw new MaskError('BAD_GUIDE')
    this.width = width
    this.height = height
    this.guide = guide
    this.rgb = rgb
    this.base = null // folded old taps (Float32 0–1) once the history is long
    this.ops = []
    this.soft = new Float32Array(width * height)
  }

  get count() { return this.ops.length }

  /**
   * Add (`pos`) or remove (`neg`) one region. `region` = Uint8Array/Uint8ClampedArray (0–255) or
   * Float32Array (0–1) at the mask size. `point` = the tap [x, y] in mask pixels.
   */
  apply(label, region, point, meta = {}) {
    if (label !== 'pos' && label !== 'neg') throw new MaskError('BAD_LABEL', label)
    if (!region || region.length !== this.width * this.height) throw new MaskError('BAD_REGION')
    if (!Array.isArray(point) || !Number.isFinite(point[0]) || !Number.isFinite(point[1])) throw new MaskError('BAD_TAP')
    let r8 = region
    if (region instanceof Float32Array) {
      r8 = new Uint8ClampedArray(region.length) // a plain loop: TypedArray.from(…, fn) is slow on phones
      for (let i = 0; i < region.length; i++) r8[i] = region[i] * 255
    }
    const op = { label, region: r8, point: [point[0], point[1]], meta }
    this.ops.push(op)
    this.#applyOp(this.soft, op)
    if (this.ops.length > MASK_LIMITS.maxOps) this.#fold()
    return this
  }

  undo() {
    if (!this.ops.length) return false
    this.ops.pop()
    this.#recompose()
    return true
  }

  reset() {
    this.ops = []
    this.base = null
    this.soft.fill(0)
  }

  #applyOp(soft, { label, region }) {
    if (label === 'pos') for (let i = 0; i < soft.length; i++) { const v = region[i] / 255; if (v > soft[i]) soft[i] = v }
    else for (let i = 0; i < soft.length; i++) { const v = 1 - region[i] / 255; if (v < soft[i]) soft[i] = v }
  }

  #recompose() {
    if (this.base) this.soft.set(this.base)
    else this.soft.fill(0)
    for (const op of this.ops) this.#applyOp(this.soft, op)
  }

  #fold() {
    const oldest = this.ops.shift()
    if (!this.base) this.base = new Float32Array(this.soft.length)
    this.#applyOp(this.base, oldest)
  }

  /**
   * The cleaned mask: { mask (0/1), alpha (0–255, feathered), coverage, bbox, cleanup }.
   * An empty selection is a valid result (coverage 0) — callers decide what to show.
   */
  result() {
    const { width: w, height: h } = this
    let mask, cleanupParams = null, shadowAdded = 0
    if (this.guide) {
      // the alpha is feathered once, after the cleanup below
      const p = stonexPostprocess(this.soft, this.guide, w, h, { rgb: this.rgb, alpha: false })
      mask = p.mask
      cleanupParams = p.params
      if (this.rgb) shadowAdded = extendIntoShadows(mask, this.soft, this.rgb, this.guide, w, h)
    } else {
      mask = new Uint8Array(w * h)
      for (let i = 0; i < mask.length; i++) mask[i] = this.soft[i] >= 0.5 ? 1 : 0
    }
    const keepPoints = this.ops.filter((o) => o.label === 'pos').map((o) => o.point)
    const cleanup = { ...cleanMask(mask, w, h, { keepPoints, guide: this.guide, rgb: this.rgb }), shadowAdded, ...(cleanupParams || {}) }
    let on = 0, x0 = w, y0 = h, x1 = -1, y1 = -1
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        if (!mask[y * w + x]) continue
        on++
        if (x < x0) x0 = x
        if (x > x1) x1 = x
        if (y < y0) y0 = y
        if (y > y1) y1 = y
      }
    }
    return {
      mask,
      alpha: featherAlpha(mask, w, h, 1),
      coverage: on / (w * h),
      bbox: on ? [x0, y0, x1 + 1, y1 + 1] : null,
      taps: this.ops.map((o) => ({ label: o.label, point: o.point, ...o.meta })),
      cleanup,
    }
  }
}
