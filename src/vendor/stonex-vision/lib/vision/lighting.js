// VisionLighting — the room's light, carried onto the new stone. A pasted texture looks pasted
// because the room's light is missing: the sunny patch, the dim corner, the shadow under the sofa,
// the dark line where a cabinet stands on the floor.
//
//   original floor (linear light, clipped to its own 2–98.5 % range)
//     → thin marks of the OLD floor removed first (grout, cracks, terrazzo chips: grey closing
//       and opening, both polarities)
//     → broad light: smoothed in log space over a wide window measured ON THE FLOOR
//       (perspective-aware), so the old floor's tile tones and stains average away at every
//       distance while the room's light — a bright side, a dim corner — stays
//     → sharp light structure on top, from a narrow window, kept only where it is STRONG: a sun
//       patch's edge, a sofa's cast shadow, a chair leg's shadow; weak structure (the old floor's
//       own tones and blotches) is dropped (non-negative garrote in log units)
//     → next to furniture and walls much weaker darkening is kept too: the contact shadow that
//       keeps a cabinet standing on the floor instead of floating over it
//     → relative to the floor's typical light (1 = typical).
// A strongly patterned old floor (a checkerboard) can't be told apart from light at the pattern's
// scale: then only the broad light is used.
// The renderer multiplies the actual stone by it. Scalar luminance only — the room's light colour
// is not transferred (no lighting simulator), so the stone keeps its true colour.

export const LIGHTING_DEFAULTS = Object.freeze({
  cleanRadius: 1, // px at the light size: thin dark AND bright marks of the old floor go first
  baseCm: 45, // broad light: Gaussian σ on the floor
  fineCm: 1.5, // sharp light structure: σ on the floor …
  detailThreshold: 0.25, // … kept where stronger than this (log units ≈ 22 %): light, not the old floor's tones and stains
  nearCm: 22, // within this distance of furniture and walls …
  nearThreshold: 0.03, // … darkening down to ~3 % is kept (contact shadows)
  castMin: 0.12, // a darkening of > ~11 % attached to an object (its cast shadow) …
  castThreshold: 0.08, // … is kept down to this, along its whole length …
  castMaxShare: 0.15, // … unless it spreads over more than this share of the floor (broad light)
  baseFrac: 0.05, // without floor geometry: σ as a share of the photo's long side
  fineFrac: 0.004,
  // Patterned old floor? Structure at a ~10 cm scale shows up next to EVERY tile edge of a
  // pattern, but only along the edge of a sun patch or a shadow: its median over the floor (log).
  patternCm: 10,
  patternFrac: 0.012,
  pattern: [0.035, 0.09],
  clipLo: 0.02,
  clipHi: 0.985,
  minShade: 0.12,
  maxShade: 2.2, // the light's cap; darkening applies below it (see floorLighting)
  exposureMin: 0.5,
  exposureMax: 1.1,
  maxSigmaPx: 96,
})

const SRGB_LIN = new Float32Array(256)
for (let i = 0; i < 256; i++) {
  const c = i / 255
  SRGB_LIN[i] = c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}

/**
 * One separable max/min filter over the floor pixels only (others neither vote nor change): along
 * the rows, then along the columns — both walked row by row (a max doesn't depend on the order it
 * is taken in; walking down the columns missed the cache on every pixel).
 */
function maskedRank(src, on, w, h, r, pickMax) {
  const tmp = new Float32Array(src.length), out = new Float32Array(src.length)
  const sign = pickMax ? 1 : -1 // max of sign·v: one comparison for both filters
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x
      if (!on[i]) { tmp[i] = src[i]; continue }
      let v = src[i]
      for (let j = y * w + Math.max(0, x - r), end = y * w + Math.min(w - 1, x + r); j <= end; j++) if (on[j] && sign * src[j] > sign * v) v = src[j]
      tmp[i] = v
    }
  }
  for (let y = 0; y < h; y++) {
    const k0 = Math.max(0, y - r), k1 = Math.min(h - 1, y + r)
    for (let x = 0; x < w; x++) {
      const i = y * w + x
      if (!on[i]) { out[i] = tmp[i]; continue }
      let v = tmp[i]
      for (let j = k0 * w + x; j <= k1 * w + x; j += w) if (on[j] && sign * tmp[j] > sign * v) v = tmp[j]
      out[i] = v
    }
  }
  return out
}

/** Grey closing (max, then min) restricted to the floor: removes thin dark lines and specks, keeps wide shadows. */
export function closeOnFloor(Y, on, w, h, r) {
  if (!(r > 0)) return Y
  return maskedRank(maskedRank(Y, on, w, h, r, true), on, w, h, r, false)
}

/** Grey opening (min, then max) restricted to the floor: the same for thin BRIGHT marks (chips, glints). */
function openOnFloor(Y, on, w, h, r) {
  if (!(r > 0)) return Y
  return maskedRank(maskedRank(Y, on, w, h, r, false), on, w, h, r, true)
}

/** Linear-light luminance plane of an RGBA image. */
export function linearLuma({ width, height, data }) {
  const Y = new Float32Array(width * height)
  for (let i = 0, j = 0; i < Y.length; i++, j += 4) Y[i] = 0.2126 * SRGB_LIN[data[j]] + 0.7152 * SRGB_LIN[data[j + 1]] + 0.0722 * SRGB_LIN[data[j + 2]]
  return Y
}

function quantiles(values, qs) {
  if (!values.length) return qs.map(() => 0)
  const s = Float32Array.from(values).sort()
  return qs.map((q) => s[Math.min(s.length - 1, Math.max(0, Math.round(q * (s.length - 1))))])
}

/** 5-tap binomial blur (σ ≈ 1 px), separable, clamped at the borders. */
function binomial(src, w, h) {
  const tmp = new Float32Array(src.length), out = new Float32Array(src.length)
  for (let y = 0; y < h; y++) {
    const r = y * w
    for (let x = 0; x < w; x++) {
      const a = src[r + Math.max(0, x - 2)], b = src[r + Math.max(0, x - 1)], c = src[r + x], d = src[r + Math.min(w - 1, x + 1)], e = src[r + Math.min(w - 1, x + 2)]
      tmp[r + x] = (a + 4 * b + 6 * c + 4 * d + e) / 16
    }
  }
  for (let y = 0; y < h; y++) {
    const r0 = Math.max(0, y - 2) * w, r1 = Math.max(0, y - 1) * w, r2 = y * w, r3 = Math.min(h - 1, y + 1) * w, r4 = Math.min(h - 1, y + 2) * w
    for (let x = 0; x < w; x++) out[r2 + x] = (tmp[r0 + x] + 4 * tmp[r1 + x] + 6 * tmp[r2 + x] + 4 * tmp[r3 + x] + tmp[r4 + x]) / 16
  }
  return out
}

/** Halve a plane (2×2 sums averaged). */
function halve(src, w, h) {
  const w2 = Math.max(1, Math.ceil(w / 2)), h2 = Math.max(1, Math.ceil(h / 2))
  const out = new Float32Array(w2 * h2)
  for (let y = 0; y < h2; y++) {
    for (let x = 0; x < w2; x++) {
      const x0 = 2 * x, y0 = 2 * y, x1 = Math.min(w - 1, x0 + 1), y1 = Math.min(h - 1, y0 + 1)
      out[y * w2 + x] = (src[y0 * w + x0] + src[y0 * w + x1] + src[y1 * w + x0] + src[y1 * w + x1]) / 4
    }
  }
  return { data: out, w: w2, h: h2 }
}

/**
 * Masked normalised convolution at many scales at once: level k ≈ a Gaussian of σ ≈ 2^k px
 * over the floor pixels only (sums and weights blurred and halved together).
 */
function ncPyramid(values, on, w, h, maxSigma) {
  let num = new Float32Array(w * h), den = new Float32Array(w * h)
  for (let i = 0; i < num.length; i++) if (on[i]) { num[i] = values[i]; den[i] = 1 }
  const levels = []
  let lw = w, lh = h, variance = 0
  for (let k = 0; ; k++) {
    num = binomial(num, lw, lh)
    den = binomial(den, lw, lh)
    // the blur so far, in input pixels: each binomial adds (2^k)², each halving 0.25·4^(k−1)
    variance += 4 ** k + (k > 0 ? 0.25 * 4 ** (k - 1) : 0)
    levels.push({ num, den, w: lw, h: lh, scale: 2 ** k, sigma: Math.sqrt(variance) })
    if (Math.sqrt(variance) >= maxSigma || (lw <= 2 && lh <= 2)) break
    const n2 = halve(num, lw, lh), d2 = halve(den, lw, lh)
    num = n2.data
    den = d2.data
    lw = n2.w
    lh = n2.h
  }
  return levels
}

function levelValue(lv, x, y) {
  const fx = Math.min(lv.w - 1, Math.max(0, (x + 0.5) / lv.scale - 0.5)), fy = Math.min(lv.h - 1, Math.max(0, (y + 0.5) / lv.scale - 0.5))
  const x0 = Math.floor(fx), y0 = Math.floor(fy), x1 = Math.min(lv.w - 1, x0 + 1), y1 = Math.min(lv.h - 1, y0 + 1)
  const tx = fx - x0, ty = fy - y0
  const i00 = y0 * lv.w + x0, i01 = y0 * lv.w + x1, i10 = y1 * lv.w + x0, i11 = y1 * lv.w + x1
  const n = (lv.num[i00] * (1 - tx) + lv.num[i01] * tx) * (1 - ty) + (lv.num[i10] * (1 - tx) + lv.num[i11] * tx) * ty
  const d = (lv.den[i00] * (1 - tx) + lv.den[i01] * tx) * (1 - ty) + (lv.den[i10] * (1 - tx) + lv.den[i11] * tx) * ty
  return d > 0.02 ? n / d : NaN
}

/** The pyramid read at σ px (between levels, log-interpolated); coarser where a level has no floor nearby. */
function sampleAt(levels, x, y, sigma) {
  let k = 0
  while (k + 1 < levels.length && levels[k + 1].sigma <= sigma) k++
  const frac = k + 1 < levels.length && sigma > levels[k].sigma ? Math.log(sigma / levels[k].sigma) / Math.log(levels[k + 1].sigma / levels[k].sigma) : 0
  let a = levelValue(levels[k], x, y)
  while (Number.isNaN(a) && k < levels.length - 1) a = levelValue(levels[++k], x, y)
  if (Number.isNaN(a)) return NaN
  if (frac > 0 && k + 1 < levels.length) {
    const b = levelValue(levels[k + 1], x, y)
    if (!Number.isNaN(b)) return a + (b - a) * frac
  }
  return a
}

/** Distance (px, chessboard) from each pixel to the nearest NON-floor pixel inside the photo, capped. */
function distanceToObjects(on, w, h, cap) {
  const d = new Uint16Array(w * h).fill(cap)
  let frontier = []
  for (let i = 0; i < on.length; i++) if (!on[i]) { d[i] = 0; frontier.push(i) }
  for (let k = 1; k < cap && frontier.length; k++) {
    const next = []
    for (const i of frontier) {
      const x = i % w, y = (i / w) | 0
      for (let dy = -1; dy <= 1; dy++) {
        const yy = y + dy
        if (yy < 0 || yy >= h) continue
        for (let dx = -1; dx <= 1; dx++) {
          const xx = x + dx
          if (xx < 0 || xx >= w) continue
          const j = yy * w + xx
          if (d[j] > k) { d[j] = k; next.push(j) }
        }
      }
    }
    frontier = next
  }
  return d
}

/**
 * Darkening attached to an object: connected floor pixels darker than their broad light by more
 * than `castMin` (log), in a region that touches a non-floor pixel inside the photo and covers
 * at most `castMaxShare` of the floor (a whole dim side of the room is broad light, not a shadow).
 */
function attachedDarkening(detail, on, dist, w, h, o) {
  const n = w * h
  const dark = new Uint8Array(n)
  let floorPx = 0
  for (let i = 0; i < n; i++) if (on[i]) { floorPx++; if (detail[i] < -o.castMin) dark[i] = 1 }
  const out = new Uint8Array(n), queue = new Int32Array(n), seen = new Uint8Array(n)
  for (let s = 0; s < n; s++) {
    if (!dark[s] || seen[s]) continue
    let head = 0, tail = 0, touches = false
    queue[tail++] = s
    seen[s] = 1
    while (head < tail) {
      const i = queue[head++], x = i % w
      if (dist[i] <= 1) touches = true
      for (const j of [x > 0 ? i - 1 : -1, x < w - 1 ? i + 1 : -1, i - w, i + w]) {
        if (j < 0 || j >= n || seen[j] || !dark[j]) continue
        seen[j] = 1
        queue[tail++] = j
      }
    }
    if (touches && tail <= o.castMaxShare * floorPx) for (let k = 0; k < tail; k++) out[queue[k]] = 1
  }
  return out
}

/**
 * How many light-image pixels one floor centimetre spans, per pixel (null without geometry).
 * hinv maps render pixels → floor cm; the light image is `k` times the render size.
 */
function pixelsPerCm(hinv, k, w, h) {
  if (!hinv) return null
  const det = Math.abs(
    hinv[0] * (hinv[4] * hinv[8] - hinv[5] * hinv[7]) - hinv[1] * (hinv[3] * hinv[8] - hinv[5] * hinv[6]) + hinv[2] * (hinv[3] * hinv[7] - hinv[4] * hinv[6]),
  )
  if (!(det > 0)) return null
  const out = new Float32Array(w * h)
  for (let y = 0; y < h; y++) {
    const Y = (y + 0.5) / k
    for (let x = 0; x < w; x++) {
      const X = (x + 0.5) / k
      const p2 = hinv[6] * X + hinv[7] * Y + hinv[8]
      // |J| of a homography = det / w³ (cm² per render px²) → render px per cm → light px per cm
      out[y * w + x] = p2 > 0 ? k * Math.sqrt((p2 * p2 * p2) / det) : 0
    }
  }
  return out
}

/**
 * @param {{ width, height, data }} img the room photo (any working size)
 * @param {Uint8Array|Uint8ClampedArray} mask floor mask at the same size (0/1 or 0–255)
 * @param {object} [opts] LIGHTING_DEFAULTS overrides, plus `hinv` (render px → floor cm) and
 *   `renderWidth` — the floor geometry, for sizes measured on the floor
 * @returns {{ field: Float32Array, fw, fh, meanLin, p10, p90, coverage, pattern }}
 *   field = light relative to the floor's typical light (1 = typical), fw×fh = the image size.
 */
export function floorLighting(img, mask, opts = {}) {
  const o = { ...LIGHTING_DEFAULTS, ...opts }
  const { width: w, height: h } = img
  if (!mask || mask.length !== w * h) throw new Error('BAD_MASK')
  const n = w * h
  const Y = linearLuma(img)
  const on = new Uint8Array(n)
  const samples = []
  const cut = mask instanceof Uint8ClampedArray ? 127 : 0 // a 0–255 alpha, or a 0/1 mask
  for (let i = 0; i < n; i++) {
    if (mask[i] > cut) {
      on[i] = 1
      if (i % 7 === 0) samples.push(Y[i])
    }
  }
  if (!samples.length) return { field: new Float32Array(n).fill(1), fw: w, fh: h, meanLin: 0, p10: 1, p90: 1, coverage: 0, pattern: 0 }
  const [lo, hi] = quantiles(samples, [o.clipLo, o.clipHi])
  const L = new Float32Array(n)
  for (let i = 0; i < n; i++) L[i] = Math.log(Math.max(1e-4, Y[i] < lo ? lo : Y[i] > hi ? hi : Y[i]))
  const clean = openOnFloor(closeOnFloor(L, on, w, h, o.cleanRadius), on, w, h, o.cleanRadius)

  // σ per pixel: a size on the floor (perspective-aware) or, without geometry, a share of the photo
  const ppc = o.hinv && o.renderWidth ? pixelsPerCm(o.hinv, w / o.renderWidth, w, h) : null
  const L0 = Math.max(w, h)
  const sigmaAt = (i, cm, frac) => {
    const s = ppc && ppc[i] > 0 ? cm * ppc[i] : frac * L0
    return Math.min(o.maxSigmaPx, Math.max(1, s))
  }
  const levels = ncPyramid(clean, on, w, h, o.maxSigmaPx)

  // two layers: broad light, and the sharp structure on top of it
  const base = new Float32Array(n), detail = new Float32Array(n)
  const strength = []
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x
      let b = sampleAt(levels, x, y, sigmaAt(i, o.baseCm, o.baseFrac))
      if (Number.isNaN(b)) b = sampleAt(levels, x, y, o.maxSigmaPx)
      const f = sampleAt(levels, x, y, sigmaAt(i, o.fineCm, o.fineFrac))
      base[i] = b
      detail[i] = Number.isNaN(f) || Number.isNaN(b) ? 0 : f - b
      if (on[i] && i % 9 === 0 && !Number.isNaN(f)) {
        const m = sampleAt(levels, x, y, sigmaAt(i, o.patternCm, o.patternFrac))
        if (!Number.isNaN(m)) strength.push(Math.abs(f - m))
      }
    }
  }
  const [med] = quantiles(strength.length ? strength : [0], [0.5])
  const [m0, m1] = o.pattern
  const t = Math.min(1, Math.max(0, (med - m0) / (m1 - m0)))
  const pattern = t * t * (3 - 2 * t)

  // contact shadows: near objects (not the photo's own border) weaker darkening counts too
  const nearPx = (i) => (ppc && ppc[i] > 0 ? o.nearCm * ppc[i] : 0.04 * L0)
  let maxPpc = 0
  if (ppc) for (let i = 0; i < n; i++) if (ppc[i] > maxPpc) maxPpc = ppc[i]
  const cap = Math.min(200, Math.ceil(Math.max(8, maxPpc ? o.nearCm * maxPpc : 0.04 * L0))) + 1
  const dist = pattern < 0.99 ? distanceToObjects(on, w, h, cap) : null

  // cast shadows: a darkening ATTACHED to furniture (a chair's or a table's shadow running out from
  // its foot) is light all along its length, not only within nearCm of the foot. A darker patch of
  // the old floor that touches nothing stays out (real dining room: long chair shadows came out faint)
  const cast = dist ? attachedDarkening(detail, on, dist, w, h, o) : null

  const logField = new Float32Array(n), keptLog = new Float32Array(n)
  const floorLog = []
  for (let i = 0; i < n; i++) {
    const d = detail[i]
    let tau = o.detailThreshold
    if (d < 0 && dist && dist[i] < cap) tau += (o.nearThreshold - tau) * Math.max(0, 1 - dist[i] / nearPx(i)) ** 2
    if (d < 0 && cast && cast[i] && tau > o.castThreshold) tau = o.castThreshold
    // non-negative garrote: strong structure passes almost unchanged, weak structure is dropped
    const kept = Math.abs(d) > tau ? d * (1 - (tau * tau) / (d * d)) : 0
    keptLog[i] = kept * (1 - pattern)
    const v = base[i] + keptLog[i]
    logField[i] = v
    if (on[i] && i % 7 === 0 && !Number.isNaN(v)) floorLog.push(v)
  }
  const [ref] = quantiles(floorLog, [0.5])
  // the light is capped (a glossy floor's mirrored window stays a glow, not a blaze), but darkening
  // applies BELOW the cap: a chair's shadow inside a sunlit side brighter than the cap keeps its
  // contrast (real dining room by a window: capping the whole field flattened those shadows)
  const logCap = Math.log(o.maxShade)
  const field = new Float32Array(n)
  for (let i = 0; i < n; i++) {
    const k = keptLog[i]
    const v = Number.isNaN(logField[i]) ? 1 : Math.exp(Math.min(base[i] - ref + Math.max(k, 0), logCap) + Math.min(k, 0))
    field[i] = v < o.minShade ? o.minShade : v
  }
  const inMask = []
  let floorPx = 0
  for (let i = 0; i < n; i++) {
    if (!on[i]) continue
    floorPx++
    if (i % 7 === 0) inMask.push(field[i])
  }
  const [p10, p90] = quantiles(inMask, [0.1, 0.9])
  return { field, fw: w, fh: h, meanLin: Math.exp(ref), p10, p90, coverage: floorPx / n, pattern: Math.round(pattern * 100) / 100 }
}

/** Mean linear luminance of the stone twin (sampled). */
export function stoneMeanLin(img, step = 7) {
  let s = 0, n = 0
  for (let i = 0; i < img.width * img.height; i += step) {
    const j = i * 4
    s += 0.2126 * SRGB_LIN[img.data[j]] + 0.7152 * SRGB_LIN[img.data[j + 1]] + 0.0722 * SRGB_LIN[img.data[j + 2]]
    n++
  }
  return n ? s / n : 0
}

/**
 * How bright the stone is shown in THIS photo: part-way from its catalogue exposure towards the
 * photo's floor level (geometric mean), clamped — a dim photo dims a white marble, a bright one
 * barely lifts a dark granite. The stone's own pattern and colour are untouched.
 */
export function exposureFor(floorMeanLin, stoneMean, opts = {}) {
  const o = { ...LIGHTING_DEFAULTS, ...opts }
  if (!(floorMeanLin > 0) || !(stoneMean > 0)) return 1
  const k = Math.sqrt(floorMeanLin / stoneMean)
  return Math.round(Math.min(o.exposureMax, Math.max(o.exposureMin, k)) * 1000) / 1000
}
