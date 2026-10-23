// Straight-edge detector for room photos (a compact take on LSD, von Gioi et al.): pixels with a
// strong gradient are grouped into regions that share one level-line direction; a region long and
// thin enough becomes a segment. Floor grout, skirting, the wall–floor seam and furniture bases are
// what the floor geometry needs. Pure, deterministic, ~O(pixels).
import { fitLongEdge, resizePlane } from '../image.js'

const ANALYSIS_EDGE = 640

/** RGBA image → luma 0–1 at most `maxEdge` on its long side; returns { gray, w, h, k } (k = full / analysis). */
export function analysisGray(img, maxEdge = ANALYSIS_EDGE) {
  const { width: w, height: h } = fitLongEdge(img.width, img.height, maxEdge)
  const full = new Float32Array(img.width * img.height)
  for (let i = 0, j = 0; i < full.length; i++, j += 4) full[i] = (0.2126 * img.data[j] + 0.7152 * img.data[j + 1] + 0.0722 * img.data[j + 2]) / 255
  const gray = w === img.width ? full : resizePlane(full, img.width, img.height, w, h)
  return { gray, w, h, k: img.width / w }
}

/**
 * @returns {Array<{ x1: number, y1: number, x2: number, y2: number, len: number, angle: number, strength: number }>}
 *   in the coordinates of `gray` (multiply by k for the full photo).
 */
// minMag ≈ a 6/255 step (LSD's quantisation-noise bound): faint tile joints still count; noise
// is rejected by the length, thinness and one-direction density tests below.
export function detectSegments(gray, w, h, { minMag = 0.012, angleTol = 22.5, minLenFrac = 0.025, minDensity = 0.55 } = {}) {
  const n = w * h
  const gx = new Float32Array(n), gy = new Float32Array(n), mag = new Float32Array(n)
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const i = y * w + x
      const a = gray[i - w - 1], b = gray[i - w], c = gray[i - w + 1], d = gray[i - 1], f = gray[i + 1], g = gray[i + w - 1], hh = gray[i + w], k = gray[i + w + 1]
      gx[i] = (c + 2 * f + k - a - 2 * d - g) / 8
      gy[i] = (g + 2 * hh + k - a - 2 * b - c) / 8
      mag[i] = Math.hypot(gx[i], gy[i])
    }
  }
  // seeds in decreasing gradient order (bucket sort)
  const BINS = 1024
  let maxMag = 0
  for (let i = 0; i < n; i++) if (mag[i] > maxMag) maxMag = mag[i]
  if (maxMag <= minMag) return []
  const counts = new Int32Array(BINS)
  const binOf = (v) => Math.min(BINS - 1, Math.floor((v / maxMag) * (BINS - 1)))
  for (let i = 0; i < n; i++) if (mag[i] > minMag) counts[binOf(mag[i])]++
  const starts = new Int32Array(BINS)
  for (let b = BINS - 2, acc = counts[BINS - 1]; b >= 0; b--) { starts[b] = acc; acc += counts[b] }
  const order = new Int32Array(starts[0] + counts[0])
  const fill = Int32Array.from(starts)
  for (let i = 0; i < n; i++) if (mag[i] > minMag) order[fill[binOf(mag[i])]++] = i

  const used = new Uint8Array(n)
  const tol = (angleTol * Math.PI) / 180
  const minLen = minLenFrac * Math.max(w, h)
  const segments = []
  const region = new Int32Array(n)
  // level-line angle: along the edge, oriented by the gradient (keeps opposite edges apart)
  const ang = (i) => Math.atan2(gx[i], -gy[i])
  const diff = (a, b) => { let d = Math.abs(a - b) % (2 * Math.PI); return d > Math.PI ? 2 * Math.PI - d : d }

  for (const seed of order) {
    if (used[seed]) continue
    let size = 0
    region[size++] = seed
    used[seed] = 1
    let sc = Math.cos(ang(seed)), ss = Math.sin(ang(seed))
    let theta = ang(seed)
    for (let r = 0; r < size; r++) {
      const i = region[r]
      const x = i % w, y = (i / w) | 0
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (!dx && !dy) continue
          const xx = x + dx, yy = y + dy
          if (xx < 1 || yy < 1 || xx >= w - 1 || yy >= h - 1) continue
          const j = yy * w + xx
          if (used[j] || mag[j] <= minMag) continue
          const a = ang(j)
          if (diff(a, theta) > tol) continue
          used[j] = 1
          region[size++] = j
          sc += Math.cos(a)
          ss += Math.sin(a)
          theta = Math.atan2(ss, sc)
        }
      }
    }
    if (size < 8) continue
    // weighted centroid; the line's direction is the region's principal axis (as in LSD) — the
    // mean gradient angle is biased by the pixel grid (≈3° on a 29° edge), which over a long line
    // made a clean diagonal edge look 20+ px wide and fail the density test
    let sw = 0, mx = 0, my = 0
    for (let r = 0; r < size; r++) { const i = region[r], m = mag[i]; sw += m; mx += m * (i % w); my += m * ((i / w) | 0) }
    mx /= sw; my /= sw
    let ixx = 0, iyy = 0, ixy = 0
    for (let r = 0; r < size; r++) {
      const i = region[r], m = mag[i], dx = (i % w) - mx, dy = ((i / w) | 0) - my
      ixx += m * dx * dx; iyy += m * dy * dy; ixy += m * dx * dy
    }
    let axis = 0.5 * Math.atan2(2 * ixy, ixx - iyy)
    if (Math.cos(axis - theta) < 0) axis += Math.PI // keep the level-line orientation
    const ux = Math.cos(axis), uy = Math.sin(axis)
    let lo = Infinity, hi = -Infinity, wlo = Infinity, whi = -Infinity
    for (let r = 0; r < size; r++) {
      const i = region[r]
      const px = (i % w) - mx, py = ((i / w) | 0) - my
      const along = px * ux + py * uy, across = -px * uy + py * ux
      if (along < lo) lo = along
      if (along > hi) hi = along
      if (across < wlo) wlo = across
      if (across > whi) whi = across
    }
    const len = hi - lo + 1, width = whi - wlo + 1
    if (len < minLen || len < 4 * width) continue
    if (size / (len * Math.max(1, width)) < minDensity) continue
    segments.push({
      x1: mx + lo * ux, y1: my + lo * uy, x2: mx + hi * ux, y2: my + hi * uy,
      len, angle: Math.atan2(uy, ux), strength: sw / size,
    })
  }
  return segments
}
