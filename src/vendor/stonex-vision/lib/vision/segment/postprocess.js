// StoneX mask post-processing, measured against the raw model mask (it must EARN its place):
//   soft union-minus probabilities → fast guided filter with the photo's luma as guide
//   (edge snapping, He & Sun 2015) → threshold 0.5 → 1–2 px feather for compositing.
// Metrics use the thresholded mask; the feathered alpha is for display/compositing only.

/** Mean over a (2r+1)² window, clipped at the borders — integral image, O(N). */
export function boxMean(src, w, h, r) {
  const W = w + 1
  const sat = new Float64Array(W * (h + 1))
  for (let y = 0; y < h; y++) {
    let row = 0
    for (let x = 0; x < w; x++) {
      row += src[y * w + x]
      sat[(y + 1) * W + x + 1] = sat[y * W + x + 1] + row
    }
  }
  const out = new Float32Array(w * h)
  for (let y = 0; y < h; y++) {
    const y0 = Math.max(0, y - r), y1 = Math.min(h - 1, y + r)
    for (let x = 0; x < w; x++) {
      const x0 = Math.max(0, x - r), x1 = Math.min(w - 1, x + r)
      const s = sat[(y1 + 1) * W + x1 + 1] - sat[y0 * W + x1 + 1] - sat[(y1 + 1) * W + x0] + sat[y0 * W + x0]
      out[y * w + x] = s / ((x1 - x0 + 1) * (y1 - y0 + 1))
    }
  }
  return out
}

/** Grey-guide guided filter (He et al.). I: guide 0–1, p: input. */
export function guidedFilter(I, p, w, h, r, eps) {
  const n = w * h
  const II = new Float32Array(n), Ip = new Float32Array(n)
  for (let i = 0; i < n; i++) { II[i] = I[i] * I[i]; Ip[i] = I[i] * p[i] }
  const mI = boxMean(I, w, h, r), mp = boxMean(p, w, h, r), mII = boxMean(II, w, h, r), mIp = boxMean(Ip, w, h, r)
  const a = new Float32Array(n), b = new Float32Array(n)
  for (let i = 0; i < n; i++) {
    const v = mII[i] - mI[i] * mI[i]
    a[i] = (mIp[i] - mI[i] * mp[i]) / (v + eps)
    b[i] = mp[i] - a[i] * mI[i]
  }
  const ma = boxMean(a, w, h, r), mb = boxMean(b, w, h, r)
  const q = new Float32Array(n)
  for (let i = 0; i < n; i++) q[i] = ma[i] * I[i] + mb[i]
  return q
}

function downsample(src, w, h, s) {
  const dw = Math.max(1, Math.ceil(w / s)), dh = Math.max(1, Math.ceil(h / s))
  const out = new Float32Array(dw * dh), cnt = new Float32Array(dw * dh)
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const j = ((y / s) | 0) * dw + ((x / s) | 0)
    out[j] += src[y * w + x]; cnt[j]++
  }
  for (let j = 0; j < out.length; j++) out[j] /= cnt[j]
  return { data: out, w: dw, h: dh }
}

/** Fast guided filter: coefficients on an s× subsampled grid, applied at full resolution. */
export function fastGuidedFilter(I, p, w, h, r, eps, s = 4) {
  if (s <= 1) return guidedFilter(I, p, w, h, r, eps)
  const Is = downsample(I, w, h, s), ps = downsample(p, w, h, s)
  const rs = Math.max(1, Math.round(r / s))
  const n = Is.w * Is.h
  const II = new Float32Array(n), Ip = new Float32Array(n)
  for (let i = 0; i < n; i++) { II[i] = Is.data[i] * Is.data[i]; Ip[i] = Is.data[i] * ps.data[i] }
  const mI = boxMean(Is.data, Is.w, Is.h, rs), mp = boxMean(ps.data, Is.w, Is.h, rs)
  const mII = boxMean(II, Is.w, Is.h, rs), mIp = boxMean(Ip, Is.w, Is.h, rs)
  const a = new Float32Array(n), b = new Float32Array(n)
  for (let i = 0; i < n; i++) {
    const v = mII[i] - mI[i] * mI[i]
    a[i] = (mIp[i] - mI[i] * mp[i]) / (v + eps)
    b[i] = mp[i] - a[i] * mI[i]
  }
  const ma = boxMean(a, Is.w, Is.h, rs), mb = boxMean(b, Is.w, Is.h, rs)
  // bilinear upsampling of the coefficients with taps precomputed per column (hot loop)
  const sw = Is.w, sh = Is.h
  const x0s = new Int32Array(w), x1s = new Int32Array(w), fxs = new Float32Array(w)
  for (let x = 0; x < w; x++) {
    const fx = Math.min(sw - 1, Math.max(0, (x + 0.5) / s - 0.5))
    x0s[x] = Math.floor(fx)
    x1s[x] = Math.min(sw - 1, x0s[x] + 1)
    fxs[x] = fx - x0s[x]
  }
  const q = new Float32Array(w * h)
  for (let y = 0; y < h; y++) {
    const fy = Math.min(sh - 1, Math.max(0, (y + 0.5) / s - 0.5))
    const y0 = Math.floor(fy), y1 = Math.min(sh - 1, y0 + 1), ty = fy - y0
    const r0 = y0 * sw, r1 = y1 * sw, row = y * w
    for (let x = 0; x < w; x++) {
      const i0 = r0 + x0s[x], i1 = r0 + x1s[x], j0 = r1 + x0s[x], j1 = r1 + x1s[x], t = fxs[x]
      const aTop = ma[i0] + (ma[i1] - ma[i0]) * t, aBot = ma[j0] + (ma[j1] - ma[j0]) * t
      const bTop = mb[i0] + (mb[i1] - mb[i0]) * t, bBot = mb[j0] + (mb[j1] - mb[j0]) * t
      q[row + x] = (aTop + (aBot - aTop) * ty) * I[row + x] + (bTop + (bBot - bTop) * ty)
    }
  }
  return q
}

/**
 * Fast guided filter with a COLOUR guide (He et al., 3×3 covariance per window): edges are
 * snapped to colour boundaries too, not only brightness ones — a brown table leg standing in the
 * dark contact shadow on a grey floor has the same brightness as the shadow but not its colour.
 * rgba: the photo (RGBA bytes) at w×h; p: input 0–1.
 */
export function fastGuidedFilterColor(rgba, p, w, h, r, eps, s = 4) {
  const dw = Math.max(1, Math.ceil(w / s)), dh = Math.max(1, Math.ceil(h / s)), n = dw * dh
  const I = [new Float32Array(n), new Float32Array(n), new Float32Array(n)], P = new Float32Array(n), cnt = new Float32Array(n)
  for (let y = 0; y < h; y++) {
    const row = ((y / s) | 0) * dw
    for (let x = 0; x < w; x++) {
      const j = row + ((x / s) | 0), i = y * w + x
      I[0][j] += rgba[i * 4] / 255; I[1][j] += rgba[i * 4 + 1] / 255; I[2][j] += rgba[i * 4 + 2] / 255
      P[j] += p[i]; cnt[j]++
    }
  }
  for (let j = 0; j < n; j++) { I[0][j] /= cnt[j]; I[1][j] /= cnt[j]; I[2][j] /= cnt[j]; P[j] /= cnt[j] }
  const rs = Math.max(1, Math.round(r / s))
  const mean = (a) => boxMean(a, dw, dh, rs)
  const prod = (a, b) => { const o = new Float32Array(n); for (let j = 0; j < n; j++) o[j] = a[j] * b[j]; return mean(o) }
  const mI = I.map(mean), mP = mean(P)
  const v00 = prod(I[0], I[0]), v01 = prod(I[0], I[1]), v02 = prod(I[0], I[2]), v11 = prod(I[1], I[1]), v12 = prod(I[1], I[2]), v22 = prod(I[2], I[2])
  const c0 = prod(I[0], P), c1 = prod(I[1], P), c2 = prod(I[2], P)
  const a0 = new Float32Array(n), a1 = new Float32Array(n), a2 = new Float32Array(n), b = new Float32Array(n)
  for (let j = 0; j < n; j++) {
    const m0 = mI[0][j], m1 = mI[1][j], m2 = mI[2][j], mp = mP[j]
    const s00 = v00[j] - m0 * m0 + eps, s01 = v01[j] - m0 * m1, s02 = v02[j] - m0 * m2
    const s11 = v11[j] - m1 * m1 + eps, s12 = v12[j] - m1 * m2, s22 = v22[j] - m2 * m2 + eps
    const q0 = c0[j] - m0 * mp, q1 = c1[j] - m1 * mp, q2 = c2[j] - m2 * mp
    // (Σ + εI)⁻¹ · cov(I, p) by cofactors (Σ is symmetric)
    const i00 = s11 * s22 - s12 * s12, i01 = s02 * s12 - s01 * s22, i02 = s01 * s12 - s02 * s11
    const i11 = s00 * s22 - s02 * s02, i12 = s01 * s02 - s00 * s12, i22 = s00 * s11 - s01 * s01
    const det = s00 * i00 + s01 * i01 + s02 * i02
    a0[j] = (i00 * q0 + i01 * q1 + i02 * q2) / det
    a1[j] = (i01 * q0 + i11 * q1 + i12 * q2) / det
    a2[j] = (i02 * q0 + i12 * q1 + i22 * q2) / det
    b[j] = mp - a0[j] * m0 - a1[j] * m1 - a2[j] * m2
  }
  const A0 = mean(a0), A1 = mean(a1), A2 = mean(a2), B = mean(b)
  const x0s = new Int32Array(w), x1s = new Int32Array(w), fxs = new Float32Array(w)
  for (let x = 0; x < w; x++) {
    const fx = Math.min(dw - 1, Math.max(0, (x + 0.5) / s - 0.5))
    x0s[x] = Math.floor(fx)
    x1s[x] = Math.min(dw - 1, x0s[x] + 1)
    fxs[x] = fx - x0s[x]
  }
  const q = new Float32Array(w * h)
  const lerp2 = (M, i0, i1, j0, j1, t, ty) => { const top = M[i0] + (M[i1] - M[i0]) * t, bot = M[j0] + (M[j1] - M[j0]) * t; return top + (bot - top) * ty }
  for (let y = 0; y < h; y++) {
    const fy = Math.min(dh - 1, Math.max(0, (y + 0.5) / s - 0.5))
    const y0 = Math.floor(fy), y1 = Math.min(dh - 1, y0 + 1), ty = fy - y0
    const r0 = y0 * dw, r1 = y1 * dw
    for (let x = 0; x < w; x++) {
      const i0 = r0 + x0s[x], i1 = r0 + x1s[x], j0 = r1 + x0s[x], j1 = r1 + x1s[x], t = fxs[x], i = y * w + x
      q[i] = lerp2(A0, i0, i1, j0, j1, t, ty) * (rgba[i * 4] / 255) + lerp2(A1, i0, i1, j0, j1, t, ty) * (rgba[i * 4 + 1] / 255) +
        lerp2(A2, i0, i1, j0, j1, t, ty) * (rgba[i * 4 + 2] / 255) + lerp2(B, i0, i1, j0, j1, t, ty)
    }
  }
  return q
}

export const POST_DEFAULTS = Object.freeze({ radiusFrac: 0.008, eps: 1e-3, subsample: 4, featherPx: 1 })

/**
 * Binary mask → 0–255 compositing alpha: the mean over a (2·px+1)² window, clipped at the borders
 * (exactly boxMean's numbers, from integer counts — this runs at the render size on every tap).
 */
export function featherAlpha(mask, w, h, px = 1) {
  const r = Math.round(px)
  const out = new Uint8ClampedArray(w * h)
  if (!(r > 0)) {
    for (let i = 0; i < out.length; i++) out[i] = mask[i] * 255
    return out
  }
  // column sums over the window rows, slid down the photo; then a sliding row sum
  const col = new Int32Array(w)
  for (let y = 0; y <= Math.min(h - 1, r); y++) for (let x = 0; x < w; x++) col[x] += mask[y * w + x]
  for (let y = 0; y < h; y++) {
    const y0 = Math.max(0, y - r), y1 = Math.min(h - 1, y + r), rows = y1 - y0 + 1
    let s = 0
    for (let x = 0; x <= Math.min(w - 1, r); x++) s += col[x]
    for (let x = 0; x < w; x++) {
      const x0 = Math.max(0, x - r), x1 = Math.min(w - 1, x + r)
      // Math.fround: boxMean stores the mean in a Float32Array before the ×255
      out[y * w + x] = Math.fround(s / ((x1 - x0 + 1) * rows)) * 255
      if (x + r + 1 < w) s += col[x + r + 1]
      if (x - r >= 0) s -= col[x - r]
    }
    if (y + r + 1 < h) for (let x = 0, o = (y + r + 1) * w; x < w; x++) col[x] += mask[o + x]
    if (y - r >= 0) for (let x = 0, o = (y - r) * w; x < w; x++) col[x] -= mask[o + x]
  }
  return out
}

/**
 * soft (0–1) → { mask (0/1), alpha (0–255, feathered; null with `alpha: false`), params }.
 * `opts.rgb` (the photo's RGBA bytes at w×h) switches the edge snapping to the colour guided filter.
 */
export function stonexPostprocess(soft, guide, w, h, opts = {}) {
  const o = { ...POST_DEFAULTS, ...opts }
  const r = Math.max(2, Math.round(o.radiusFrac * Math.max(w, h)))
  const q = o.rgb ? fastGuidedFilterColor(o.rgb, soft, w, h, r, o.eps, o.subsample) : fastGuidedFilter(guide, soft, w, h, r, o.eps, o.subsample)
  const mask = new Uint8Array(w * h)
  for (let i = 0; i < mask.length; i++) {
    let v = q[i]
    // where the filter is unsure (a contact shadow, a soft edge) the photo's pixel noise flips the
    // answer pixel by pixel — a sawtooth edge (real phone, under a bed): there, decide on the 3×3
    // mean. A crisp edge (q near 0 or 1) is left exactly where it is.
    if (v > 0.25 && v < 0.75) {
      const x = i % w, y = (i / w) | 0
      let s = 0, n = 0
      for (let yy = Math.max(0, y - 1); yy <= Math.min(h - 1, y + 1); yy++) for (let xx = Math.max(0, x - 1); xx <= Math.min(w - 1, x + 1); xx++) { s += q[yy * w + xx]; n++ }
      v = s / n
    }
    mask[i] = v >= 0.5 ? 1 : 0
  }
  const alpha = o.alpha === false ? null : featherAlpha(mask, w, h, o.featherPx)
  return { mask, alpha, params: { radius: r, eps: o.eps, subsample: o.subsample, featherPx: o.featherPx, guide: o.rgb ? 'colour' : 'luma' } }
}
