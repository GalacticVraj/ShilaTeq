// FloorPlan — a floor laid with REAL slabs of ONE block (or one lot): every stone region the
// customer sees is one actual slab record, from its own twin, at its own size. Nothing is cloned,
// mirrored, rotated for looks or invented; when the photographed, available slabs run out, the
// rest of the floor stays uncovered and is counted.
//
// What StoneX actually records about a block's slabs (and what this file relies on):
//  • slabs.block_id — the slabs cut from that block (or bought together as one lot, blocks.is_lot);
//  • the slab number written on each slab's edge: the -S<n> of slab_code (SQL stonex_slab_no),
//    given at entry, 1 standing at the back of the bundle. That is rack order — usually, but not
//    provably, the order the saw cut them — so it decides placement but never claims that veins
//    continue from one slab to the next;
//  • length_ft / width_ft as measured, status (available · reserved · sold · damaged), and the
//    slab's own twin (stone_twins.slab_id).
// No cutting sequence, face or orientation per slab exists in the data, and none is assumed.
import { slabRectangle, DEFAULT_JOINT_MM, LAYOUT_LIMITS, FT_TO_CM } from './layout.js'

export const PLAN_LIMITS = Object.freeze({
  maxSlabs: 32, // slabs rendered at once (texture layers, shader table)
  pieceRatio: 0.6, // a piece under 60 % of the block's typical length or width isn't laid as a floor slab
})

/** A recorded size no slab can have (a typo like 95 ft): it can't be laid believably. */
const impossibleSize = (s) => {
  const v = [Number(s.lengthFt), Number(s.widthFt)].filter((x) => x > 0).map((x) => x * FT_TO_CM)
  return v.some((x) => x > LAYOUT_LIMITS.maxSideCm || x < LAYOUT_LIMITS.minSideCm)
}

/** The number written on a slab's edge: the -S<n> of its code (same rule as SQL stonex_slab_no). */
export function slabNumber(code) {
  const m = /-S(\d+)$/.exec(String(code || ''))
  return m ? Number(m[1]) : null
}

const byCode = (a, b) => String(a.slabCode || '').localeCompare(String(b.slabCode || ''), 'en', { numeric: true }) || String(a.slabId).localeCompare(String(b.slabId))

/**
 * The block's slabs in the strongest order StoneX records: the slab numbers on their edges when
 * every slab has a distinct one; otherwise entry time; otherwise the codes (approximate).
 * @returns {{ ordered: Array, source: 'slab-numbers'|'entry-time'|'codes' }}
 */
export function orderSlabs(slabs) {
  const nums = slabs.map((s) => s.slabNo ?? slabNumber(s.slabCode))
  if (slabs.length && nums.every((n) => Number.isInteger(n)) && new Set(nums).size === nums.length) {
    const no = new Map(slabs.map((s, i) => [s, nums[i]]))
    return { ordered: [...slabs].sort((a, b) => no.get(a) - no.get(b)), source: 'slab-numbers' }
  }
  const t = slabs.map((s) => Date.parse(s.cutAt))
  if (slabs.length && t.every(Number.isFinite) && new Set(t).size === t.length) {
    return { ordered: [...slabs].sort((a, b) => Date.parse(a.cutAt) - Date.parse(b.cutAt) || byCode(a, b)), source: 'entry-time' }
  }
  return { ordered: [...slabs].sort(byCode), source: 'codes' }
}

/**
 * Which of the block's slabs can be laid. The slab the customer picked always (it is their choice;
 * its status stays attached to it). The others only when available, with their own twin, and slab-
 * sized. Everything else is listed with the reason — never replaced by another slab's picture.
 * @returns {{ usable: Array, excluded: Array<{ slab, reason: 'no-twin'|'twin-retake'|'reserved'|'sold'|'damaged'|'not-available'|'small-piece'|'bad-size' }> }}
 */
export function classifySlabs(slabs, featuredId) {
  const usable = [], excluded = []
  for (const s of slabs) {
    if (s.slabId === featuredId) { usable.push(s); continue }
    if (s.status !== 'available') excluded.push({ slab: s, reason: ['reserved', 'sold', 'damaged'].includes(s.status) ? s.status : 'not-available' })
    else if (!s.twin?.url) excluded.push({ slab: s, reason: s.twinRetake ? 'twin-retake' : 'no-twin' }) // a rejected photo is never laid
    else if (impossibleSize(s)) excluded.push({ slab: s, reason: 'bad-size' })
    else usable.push(s)
  }
  // a broken piece among full slabs would make every course as narrow as itself: not laid
  if (usable.length >= 3) {
    const med = (k) => { const v = usable.map((s) => Number(s[k])).filter((x) => x > 0).sort((a, b) => a - b); return v.length ? v[v.length >> 1] : null }
    const mL = med('lengthFt'), mW = med('widthFt')
    for (let i = usable.length - 1; i >= 0; i--) {
      const s = usable[i]
      if (s.slabId === featuredId) continue
      const small = (mL && Number(s.lengthFt) > 0 && Number(s.lengthFt) < PLAN_LIMITS.pieceRatio * mL) || (mW && Number(s.widthFt) > 0 && Number(s.widthFt) < PLAN_LIMITS.pieceRatio * mW)
      if (small) { excluded.push({ slab: s, reason: 'small-piece' }); usable.splice(i, 1) }
    }
  }
  return { usable, excluded }
}

/**
 * The floor area one slab covers, long side along the course (cm). Measured length; the other side
 * from the twin's own shape (never stretched; a gap to the measured width is flagged) — the same
 * rule as a single slab. A portrait twin is turned a quarter turn (a rotation, never a mirror) so its
 * long side runs along the course too. Without a twin size yet: the measured width.
 */
export function slabFootprint(slab) {
  const [tw, th] = slab.twin?.size || []
  // the picked slab with a typo'd size: typical size, labelled approximate (siblings are excluded instead)
  const dims = impossibleSize(slab) ? { lengthFt: null, widthFt: null } : { lengthFt: slab.lengthFt, widthFt: slab.widthFt }
  if (tw > 0 && th > 0) {
    const r = slabRectangle({ twinWidth: tw, twinHeight: th, ...dims })
    const rot90 = th > tw
    return { longCm: rot90 ? r.heightCm : r.widthCm, shortCm: rot90 ? r.widthCm : r.heightCm, sizeSource: r.sizeSource, mismatch: r.mismatch, rot90, shapeFrom: 'twin' }
  }
  const L = Number(dims.lengthFt), Wd = Number(dims.widthFt)
  if (L > 0 && Wd > 0) {
    const a = Math.max(L, Wd) * FT_TO_CM, b = Math.min(L, Wd) * FT_TO_CM
    return { longCm: a, shortCm: b, sizeSource: 'inventory', mismatch: null, rot90: false, shapeFrom: 'record' }
  }
  const r = slabRectangle({ twinWidth: 1.8, twinHeight: 1, lengthFt: L > 0 ? L : null, widthFt: Wd > 0 ? Wd : null })
  return { longCm: r.widthCm, shortCm: r.heightCm, sizeSource: 'approximate', mismatch: null, rot90: false, shapeFrom: 'typical' }
}

/** Layout frame ↔ floor cm: g = R·(P − origin), as in the shader. */
export const toFrame = (f, x, y) => {
  const dx = x - f.origin[0], dy = y - f.origin[1]
  return [f.cos * dx + f.sin * dy, -f.sin * dx + f.cos * dy]
}
export const fromFrame = (f, gx, gy) => [f.origin[0] + f.cos * gx - f.sin * gy, f.origin[1] + f.sin * gx + f.cos * gy]

/**
 * Floor samples in the layout frame: every `step`-th selected pixel's floor point (cm) and the floor
 * area it stands for (cm², from the homography's Jacobian). Pure: surface + mask at any size.
 * @returns {{ pts: Float32Array (x, y, area)…, n, extent: { x0, x1, y0, y1 }|null, areaCm2 }}
 */
export function sampleFloor(surface, alpha, mw, mh, frame, { step = 6 } = {}) {
  const hi = surface.Hinv
  const det = Math.abs(hi[0] * (hi[4] * hi[8] - hi[5] * hi[7]) - hi[1] * (hi[3] * hi[8] - hi[5] * hi[6]) + hi[2] * (hi[3] * hi[7] - hi[4] * hi[6]))
  const kx = surface.width / mw, ky = surface.height / mh
  const out = []
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity, total = 0
  for (let y = step >> 1; y < mh; y += step) {
    for (let x = step >> 1; x < mw; x += step) {
      if (alpha[y * mw + x] < 128) continue
      const X = (x + 0.5) * kx, Y = (y + 0.5) * ky
      const w = hi[6] * X + hi[7] * Y + hi[8]
      if (!(w > 0)) continue
      const [gx, gy] = toFrame(frame, (hi[0] * X + hi[1] * Y + hi[2]) / w, (hi[3] * X + hi[4] * Y + hi[5]) / w)
      const area = (det / (w * w * w)) * step * kx * step * ky
      out.push(gx, gy, area)
      total += area
      if (gx < x0) x0 = gx
      if (gx > x1) x1 = gx
      if (gy < y0) y0 = gy
      if (gy > y1) y1 = gy
    }
  }
  return { pts: Float32Array.from(out), n: out.length / 3, extent: out.length ? { x0, x1, y0, y1 } : null, areaCm2: total }
}

/**
 * Where the picked slab (L × D cm) shows the most in the photo: its centre in the frame. The frame's
 * own origin (the floor in front of the camera) wins unless another spot shows clearly more of the
 * slab (`gain`) — in a level, real-estate-style photo that point lies metres away, under the dining
 * table, while the floor nearest the camera stays empty. Pixels are counted (samples), not cm².
 * @returns {[number, number]} the centre (frame cm)
 */
export function bestAnchor(floor, L, D, { gain = 1.1 } = {}) {
  const P = floor.pts, n = P.length / 3
  if (!n) return [0, 0]
  const inRect = (cx, cy) => {
    let k = 0
    for (let i = 0; i < P.length; i += 3) if (Math.abs(P[i] - cx) < L / 2 && Math.abs(P[i + 1] - cy) < D / 2) k++
    return k
  }
  const here = inRect(0, 0)
  // the samples' bulk (far-off strays near the horizon left out), on a grid of slab-sixths
  const q = (arr, f) => arr[Math.min(arr.length - 1, Math.max(0, Math.round(f * (arr.length - 1))))]
  const xs = new Float64Array(n), ys = new Float64Array(n)
  for (let i = 0; i < n; i++) { xs[i] = P[3 * i]; ys[i] = P[3 * i + 1] }
  xs.sort(); ys.sort()
  const x0 = q(xs, 0.01) - L, x1 = q(xs, 0.99) + L, y0 = q(ys, 0.01) - D, y1 = q(ys, 0.98) + D
  const cx = Math.max(L / 6, (x1 - x0) / 300), cy = Math.max(D / 6, (y1 - y0) / 300)
  const gw = Math.max(1, Math.ceil((x1 - x0) / cx)), gh = Math.max(1, Math.ceil((y1 - y0) / cy))
  const S = new Float64Array((gw + 1) * (gh + 1)) // integral image of sample counts
  for (let i = 0; i < P.length; i += 3) {
    const gx = Math.floor((P[i] - x0) / cx), gy = Math.floor((P[i + 1] - y0) / cy)
    if (gx >= 0 && gy >= 0 && gx < gw && gy < gh) S[(gy + 1) * (gw + 1) + gx + 1]++
  }
  for (let y = 1; y <= gh; y++) for (let x = 1; x <= gw; x++) S[y * (gw + 1) + x] += S[(y - 1) * (gw + 1) + x] + S[y * (gw + 1) + x - 1] - S[(y - 1) * (gw + 1) + x - 1]
  const wx = Math.max(1, Math.round(L / cx)), wy = Math.max(1, Math.round(D / cy))
  let best = null
  for (let y = 0; y + wy <= gh; y++) {
    for (let x = 0; x + wx <= gw; x++) {
      const k = S[(y + wy) * (gw + 1) + x + wx] - S[y * (gw + 1) + x + wx] - S[(y + wy) * (gw + 1) + x] + S[y * (gw + 1) + x]
      const c = [x0 + (x + wx / 2) * cx, y0 + (y + wy / 2) * cy]
      if (!best || k > best.k || (k === best.k && Math.hypot(...c) < Math.hypot(...best.c))) best = { k, c }
    }
  }
  if (!best || best.k <= gain * here) return [0, 0]
  return inRect(...best.c) > gain * here ? best.c : [0, 0]
}

/** A course's samples inside [x0, x1): their floor area (cm²) and how many (∝ photo pixels). */
function slotIn(row, x0, x1) {
  let a = 0, n = 0
  for (let i = 0; i < row.length; i += 2) if (row[i] >= x0 && row[i] < x1) { a += row[i + 1]; n++ }
  return [a, n]
}

/**
 * Lay the block's usable slabs on the visible floor.
 *  • Courses run along the slabs' length (frame x) and are stacked front to back. Every course is as
 *    deep as the narrowest slab laid; a wider slab is trimmed along its far edge, as an installer
 *    would — no slab is stretched or squashed, and every slab keeps its real length.
 *  • The slab the customer picked goes where the photo shows it best (`bestAnchor`: the floor in
 *    front of the camera, unless clearly more of it shows elsewhere). Every course grows outward
 *    from that centre line, one slab at a time; each next slab of the block (in the recorded order,
 *    from the picked one on, then wrapping) goes to the open position that fills the most of the
 *    photo — so with few slabs, they are where the customer looks; with enough, the floor is full.
 *  • A position with no visible floor in it uses no slab. When the slabs run out, the remaining
 *    visible floor is left uncovered and counted (typical-size positions) — never filled with repeats.
 * @param {{ slabs: Array (usable, in order), featuredId, floor: ReturnType<sampleFloor>, maxSlabs?, minInViewCm2? }} p
 */
export function planFloor({ slabs, featuredId, floor, maxSlabs = PLAN_LIMITS.maxSlabs, minInViewCm2 = 40, anchor = null }) {
  if (!slabs.length || !floor?.extent) return null
  const fIdx = Math.max(0, slabs.findIndex((s) => s.slabId === featuredId))
  // the picked slab first, then the recorded order on from it, wrapping
  const sequence = [...slabs.slice(fIdx), ...slabs.slice(0, fIdx)].map((s) => ({ slab: s, fp: slabFootprint(s) }))
  const depth = Math.min(...sequence.map((q) => q.fp.shortCm))
  const lengths = sequence.map((q) => q.fp.longCm).sort((a, b) => a - b)
  const typical = lengths[lengths.length >> 1]
  const lenF = sequence[0].fp.longCm
  // the picked slab where the photo shows it best; every course lines up with it
  const [ax, ay] = anchor || bestAnchor(floor, lenF, depth)
  const band = (c) => [ay - depth / 2 + c * depth, ay + depth / 2 + c * depth]
  // the floor samples of each course (x, area), and the course's visible width
  const rows = new Map(), span = new Map()
  for (let i = 0; i < floor.pts.length; i += 3) {
    const c = Math.floor((floor.pts[i + 1] - ay + depth / 2) / depth)
    if (!rows.has(c)) { rows.set(c, []); span.set(c, [Infinity, -Infinity]) }
    rows.get(c).push(floor.pts[i], floor.pts[i + 2])
    const s = span.get(c)
    if (floor.pts[i] < s[0]) s[0] = floor.pts[i]
    if (floor.pts[i] > s[1]) s[1] = floor.pts[i]
  }
  if (!rows.has(0)) { rows.set(0, []); span.set(0, [0, 0]) }
  let next = 0
  const placements = [], phantoms = []
  const upcoming = () => (next < sequence.length && placements.length < maxSlabs ? sequence[next] : null)
  const take = (rect, c, seen, featured = false) => {
    const q = upcoming()
    if (!q) { phantoms.push({ rect, course: c, floorCm2: seen, reason: next < sequence.length ? 'limit' : 'no-slabs' }); return }
    next++
    placements.push({ q, rect, course: c, featured, floorCm2: seen })
  }
  // every course has an open end on the right and on the left; course 0 starts with the picked slab
  const front = new Map()
  for (const c of rows.keys()) front.set(c, { started: false, right: ax, left: ax })
  const [b0, b1] = band(0)
  take([ax - lenF / 2, b0, ax + lenF / 2, b1], 0, slotIn(rows.get(0), ax - lenF / 2, ax + lenF / 2)[0], true)
  Object.assign(front.get(0), { started: true, right: ax + lenF / 2, left: ax - lenF / 2 })
  const order = [...rows.keys()].sort((a, b) => Math.abs(a) - Math.abs(b) || a - b)
  for (let guard = 0; guard < 4000; guard++) {
    const len = upcoming()?.fp.longCm ?? typical
    // the open positions: a course's centre (not started yet), or its right / left end, while the
    // course still has visible floor beyond it. Ranked by how much of the PHOTO each fills (samples
    // ∝ pixels), not floor area: a far pixel is much more floor, but the customer looks at the near
    // ones — so a short block leaves its gap at the back, not a wedge in the foreground.
    let best = null
    for (const c of order) {
      const f = front.get(c), sp = span.get(c), row = rows.get(c)
      const slots = f.started
        ? [f.right < sp[1] ? ['right', f.right, f.right + len] : null, f.left > sp[0] ? ['left', f.left - len, f.left] : null]
        : [['centre', ax - len / 2, ax + len / 2]]
      for (const s of slots) {
        if (!s) continue
        const [seen, px] = slotIn(row, s[1], s[2])
        if (!best || px > best.px || (px === best.px && seen > best.seen + 1e-6)) best = { c, side: s[0], x0: s[1], x1: s[2], seen, px }
      }
    }
    if (!best) break
    const f = front.get(best.c)
    if (best.side === 'centre') Object.assign(f, { started: true, right: best.x1, left: best.x0 })
    else if (best.side === 'right') f.right = best.x1
    else f.left = best.x0
    // no visible floor there: the position is passed over, no slab spent
    if (best.seen < minInViewCm2) continue
    const [y0, y1] = band(best.c)
    take([best.x0, y0, best.x1, y1], best.c, best.seen)
  }
  // coverage: what the photographed slabs cover, what is left — and why
  let covered = 0
  for (const p of placements) covered += p.floorCm2
  const shown = placements.filter((p) => p.floorCm2 >= minInViewCm2 || p.featured).length
  const missing = phantoms.filter((p) => p.reason === 'no-slabs' && p.floorCm2 >= minInViewCm2).length // the block ran out
  const beyond = phantoms.filter((p) => p.reason === 'limit' && p.floorCm2 >= minInViewCm2).length // more than can be drawn at once
  const out = placements.map((p, i) => {
    const { slab, fp } = p.q
    const trim = Math.max(0, fp.shortCm - depth)
    return {
      i, layer: i, slabId: slab.slabId, slabCode: slab.slabCode || null, slabNo: slab.slabNo ?? slabNumber(slab.slabCode),
      blockId: slab.blockId || null, twinId: slab.twin?.id || null, twinUrl: slab.twin?.url || null, twinGrade: slab.twin?.grade || null, status: slab.status || null,
      lengthFt: slab.lengthFt ?? null, widthFt: slab.widthFt ?? null, // as recorded (the laid size is longCm × depth)
      featured: p.featured, course: p.course, rect: p.rect,
      longCm: fp.longCm, shortCm: fp.shortCm, trimCm: Math.round(trim * 10) / 10, sizeSource: fp.sizeSource, mismatch: fp.mismatch, rot90: fp.rot90,
      // twin uv: its stored image runs long side along u (portrait twins stored a quarter turn round),
      // so local x → u over the whole length, local y → v over the part kept after the trim
      uv: { o: [0, 0], ax: [1, 0], ay: [0, depth / fp.shortCm] },
      floorCm2: Math.round(p.floorCm2), inView: p.floorCm2 >= minInViewCm2 || p.featured,
    }
  })
  const visible = out.filter((p) => p.inView)
  visible.forEach((p, k) => { p.layer = k })
  for (const p of out) if (!p.inView) p.layer = -1
  return {
    depthCm: depth, typicalLengthCm: typical, anchor: [ax, ay],
    placements: out, phantoms,
    coverage: {
      floorCm2: Math.round(floor.areaCm2), coveredCm2: Math.round(covered), uncoveredCm2: Math.max(0, Math.round(floor.areaCm2 - covered)),
      shown, needed: shown + missing + beyond, missing, beyond,
      spare: sequence.length - next, // usable slabs this floor did not need (or could not show)
    },
    exactSizes: visible.every((p) => p.sizeSource === 'inventory'),
  }
}

/**
 * Texture-array layer size for the slabs on screen: every twin stored long side along u, at one
 * shared size whose aspect is the slabs' typical one, sized to a memory budget (mipmaps included),
 * never above the GPU limit or the twins' own resolution.
 */
export function layerSize(twinSizes, { maxTexture = 4096, budgetBytes = 72 * 1048576 } = {}) {
  const n = Math.max(1, twinSizes.length)
  const aspects = twinSizes.map(([w, h]) => Math.max(w, h) / Math.max(1, Math.min(w, h))).sort((a, b) => a - b)
  const aspect = aspects.length ? aspects[aspects.length >> 1] : 1.8
  const longest = twinSizes.length ? Math.max(...twinSizes.map(([w, h]) => Math.max(w, h))) : 2048
  const byBudget = Math.sqrt((budgetBytes * aspect) / (n * 4 * 1.34))
  const lw = Math.max(256, Math.floor(Math.min(byBudget, maxTexture, longest, 4096)))
  return { width: lw, height: Math.max(64, Math.round(lw / aspect)), aspect }
}

export { DEFAULT_JOINT_MM }
