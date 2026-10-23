// Tier C segmenter — no model, nothing to download. A region grown from the tapped point over
// pixels of similar colour (CIELAB, lightly smoothed so grout and pores don't stop it), held back
// by strong edges (a skirting line, a furniture leg). Good on plain cement, tiles and rugs; on a
// busy pattern it may take a tap more. Same contract as the model adapters, so the product
// treats it exactly like them.
import { fitLongEdge, resizePlane, bilinear } from '../image.js'

const WORK_EDGE = 384
/**
 * Tuned on synthetic interiors (cement, terrazzo, tiles, kota — .vision-bench/region-tune.mjs):
 * colour edges stop the region at brown furniture on grey floors, and brightness counts fully in
 * the drift from the tapped colour so it never climbs a wall. A sunlit patch now needs its own tap.
 */
export const REGION_DEFAULTS = Object.freeze({ edgeSmooth: 1, chromaEdge: 1.5, globalLWeight: 1 })

const SRGB_LIN = new Float32Array(256)
for (let i = 0; i < 256; i++) {
  const c = i / 255
  SRGB_LIN[i] = c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}
const fLab = (t) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116)

/** RGBA → three CIELAB planes (D65). */
export function toLab({ width, height, data }) {
  const n = width * height
  const L = new Float32Array(n), A = new Float32Array(n), B = new Float32Array(n)
  for (let i = 0, j = 0; i < n; i++, j += 4) {
    const r = SRGB_LIN[data[j]], g = SRGB_LIN[data[j + 1]], b = SRGB_LIN[data[j + 2]]
    const X = (0.4124 * r + 0.3576 * g + 0.1805 * b) / 0.95047
    const Y = 0.2126 * r + 0.7152 * g + 0.0722 * b
    const Z = (0.0193 * r + 0.1192 * g + 0.9505 * b) / 1.08883
    const fx = fLab(X), fy = fLab(Y), fz = fLab(Z)
    L[i] = 116 * fy - 16
    A[i] = 500 * (fx - fy)
    B[i] = 200 * (fy - fz)
  }
  return { L, A, B }
}

function blur3(plane, w, h) {
  const tmp = new Float32Array(plane.length), out = new Float32Array(plane.length)
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x
      tmp[i] = (plane[y * w + Math.max(0, x - 1)] + 2 * plane[i] + plane[y * w + Math.min(w - 1, x + 1)]) / 4
    }
  }
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x
      out[i] = (tmp[Math.max(0, y - 1) * w + x] + 2 * tmp[i] + tmp[Math.min(h - 1, y + 1) * w + x]) / 4
    }
  }
  return out
}

/**
 * Grow a region from (sx, sy) on (smoothed) Lab planes of size w×h. Returns a 0/1 Uint8Array.
 * Exported for tests; `opts.tolerance` overrides the per-pixel lightness step limit.
 */
export function growRegion({ L, A, B }, w, h, sx, sy, opts = {}) {
  const x0 = Math.min(w - 1, Math.max(0, Math.round(sx))), y0 = Math.min(h - 1, Math.max(0, Math.round(sy)))
  // seed colour + local variation from a small window
  let n = 0, mL = 0, mA = 0, mB = 0
  for (let y = Math.max(0, y0 - 3); y <= Math.min(h - 1, y0 + 3); y++) {
    for (let x = Math.max(0, x0 - 3); x <= Math.min(w - 1, x0 + 3); x++) {
      const i = y * w + x
      mL += L[i]; mA += A[i]; mB += B[i]; n++
    }
  }
  mL /= n; mA /= n; mB /= n
  let v = 0
  for (let y = Math.max(0, y0 - 3); y <= Math.min(h - 1, y0 + 3); y++) {
    for (let x = Math.max(0, x0 - 3); x <= Math.min(w - 1, x0 + 3); x++) {
      const i = y * w + x
      v += (L[i] - mL) ** 2 + (A[i] - mA) ** 2 + (B[i] - mB) ** 2
    }
  }
  const spread = Math.sqrt(v / n)
  // Light changes brightness gradually and barely touches colour; a different material changes
  // colour or jumps in brightness. So each step must continue smoothly from the pixel it came
  // from, and the region must stay near the seed's COLOUR (brightness counts little there) —
  // sunlit patches and soft shadows join, a wall, a cabinet or a rug does not. Per-pixel steps on
  // the smoothed photo: light moves < 1 L/px, a thin tile joint ~3–4, a real edge ≥ 7.
  const stepL = opts.tolerance ?? Math.min(6, Math.max(4.5, 3 + spread))
  const stepC = Math.min(6, Math.max(3, 2 + spread))
  const tolGlobal = Math.min(26, Math.max(12, 10 + 2 * spread))
  const tol = stepL
  const wL = opts.globalLWeight ?? 0.25

  // Strong edges are walls the region can't cross (skirting, furniture outlines). Measured on a
  // further-smoothed copy — a floor's own grain (terrazzo chips, cracks, pores) averages out there
  // while a furniture outline, long and continuous, stays — and in colour as well as brightness.
  const es = opts.edgeSmooth ?? 0
  const sm = (p) => { let q = p; for (let k = 0; k < es; k++) q = blur3(q, w, h); return q }
  const eL = sm(L), eA = sm(A), eB = sm(B)
  const kc = opts.chromaEdge ?? 0
  const gm = new Float32Array(w * h)
  const samples = []
  const sobel = (P, i) => {
    const gx = P[i + 1 - w] + 2 * P[i + 1] + P[i + 1 + w] - P[i - 1 - w] - 2 * P[i - 1] - P[i - 1 + w]
    const gy = P[i - 1 + w] + 2 * P[i + w] + P[i + 1 + w] - P[i - 1 - w] - 2 * P[i - w] - P[i + 1 - w]
    return (gx * gx + gy * gy) / 64
  }
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const i = y * w + x
      gm[i] = Math.sqrt(sobel(eL, i) + (kc ? kc * kc * (sobel(eA, i) + sobel(eB, i)) : 0))
      if ((i & 7) === 0) samples.push(gm[i])
    }
  }
  samples.sort((a, b) => a - b)
  // An edge clearly stronger than the floor's own texture around the tap (its joints, pores,
  // veins) is a boundary: a cabinet, a skirting, a rug. Gradual light has almost no edge at all.
  const rad = Math.max(8, Math.round(0.04 * Math.max(w, h)))
  const near = []
  for (let y = Math.max(1, y0 - rad); y <= Math.min(h - 2, y0 + rad); y++) {
    for (let x = Math.max(1, x0 - rad); x <= Math.min(w - 2, x0 + rad); x++) near.push(gm[y * w + x])
  }
  near.sort((a, b) => a - b)
  const texture = near.length ? near[Math.floor(near.length * 0.9)] : 0
  const barrier = opts.barrier ?? Math.min(samples[Math.floor(samples.length * 0.995)] || Infinity, Math.max(opts.minBarrier ?? 2.5, 2.2 * texture))

  const region = new Uint8Array(w * h)
  const queue = new Int32Array(w * h)
  let head = 0, tail = 0, cnt = 0
  const start = y0 * w + x0
  region[start] = 1
  queue[tail++] = start
  while (head < tail) {
    const i = queue[head++]
    cnt++
    const x = i % w, y = (i / w) | 0
    const nbrs = [x > 0 ? i - 1 : -1, x < w - 1 ? i + 1 : -1, y > 0 ? i - w : -1, y < h - 1 ? i + w : -1]
    for (const j of nbrs) {
      if (j < 0 || region[j]) continue
      if (gm[j] > barrier) continue
      if (Math.abs(L[j] - L[i]) > stepL) continue
      if (Math.hypot(A[j] - A[i], B[j] - B[i]) > stepC) continue
      const global = Math.sqrt((wL * (L[j] - mL)) ** 2 + (A[j] - mA) ** 2 + (B[j] - mB) ** 2)
      if (global > tolGlobal) continue
      region[j] = 1
      queue[tail++] = j
    }
  }
  return { region, tolerance: tol, tolGlobal, barrier, area: cnt / (w * h) }
}

/** The Tier C adapter (same shape as the model adapters in this folder). `grow`: growRegion options. */
export function createRegionAdapter({ grow = REGION_DEFAULTS } = {}) {
  let lab = null, w = 0, h = 0, srcW = 0, srcH = 0
  return {
    info: { kind: 'region', runtime: 'none', backend: 'cpu', biggerSmaller: false },
    load: { totalMs: 0, fetchMs: 0, initMs: 0, downloads: [] },
    async setImage(img) {
      const t0 = performance.now()
      srcW = img.width
      srcH = img.height
      ;({ width: w, height: h } = fitLongEdge(srcW, srcH, WORK_EDGE))
      const small = w === srcW ? img : (() => {
        const data = new Uint8ClampedArray(w * h * 4)
        const planes = [0, 1, 2].map((c) => {
          const p = new Float32Array(srcW * srcH)
          for (let i = 0; i < p.length; i++) p[i] = img.data[i * 4 + c]
          return resizePlane(p, srcW, srcH, w, h)
        })
        for (let i = 0; i < w * h; i++) {
          data[i * 4] = planes[0][i]; data[i * 4 + 1] = planes[1][i]; data[i * 4 + 2] = planes[2][i]; data[i * 4 + 3] = 255
        }
        return { width: w, height: h, data }
      })()
      const raw = toLab(small)
      lab = { L: blur3(raw.L, w, h), A: blur3(raw.A, w, h), B: blur3(raw.B, w, h) }
      return { preprocessMs: performance.now() - t0, encodeMs: 0 }
    },
    async decode(x, y) {
      if (!lab) throw new Error('setImage first')
      const t0 = performance.now()
      const { region, tolerance, area } = growRegion(lab, w, h, (x * w) / srcW, (y * h) / srcH, grow)
      const probAt = (W, H) => {
        const out = new Float32Array(W * H)
        const sx = w / W, sy = h / H
        for (let yy = 0; yy < H; yy++) {
          for (let xx = 0; xx < W; xx++) out[yy * W + xx] = bilinear(region, w, h, (xx + 0.5) * sx - 0.5, (yy + 0.5) * sy - 0.5)
        }
        return out
      }
      return {
        candidates: [{ score: 1, area, prob: () => probAt(srcW, srcH), probAt }],
        extra: { tolerance: Math.round(tolerance * 10) / 10, growMs: performance.now() - t0 },
      }
    },
    dispose() { lab = null },
  }
}
