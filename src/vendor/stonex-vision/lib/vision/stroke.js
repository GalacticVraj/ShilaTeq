// A brush stroke on the photo: the customer's own correction, for what a tap can't reach. It needs no model, so it
// works on every device and photo.

/**
 * The area a brush stroke means, edge-aware: what the finger passed over (a capsule of `radius` px around
 * the stroke), grown from the stroke's middle and stopped at the photo's edges — a stroke along a sofa's
 * foot doesn't take the sofa. Colours are compared on a 3×3 mean (a marble vein or wood grain isn't an
 * edge). The stroke's own middle is always in. → Uint8ClampedArray W×H, 0 or 255.
 * @param {Array<[number, number]>} points the stroke in render px
 * @param {Uint8ClampedArray} rgb the photo's RGBA at W×H
 */
export function strokeRegion(points, radius, rgb, W, H, { edge = 0.07, spread = 0.3 } = {}) {
  const out = new Uint8ClampedArray(W * H)
  if (!points.length || !(radius > 0)) return out
  const r = Math.max(1, radius)
  const xs = points.map((p) => p[0]), ys = points.map((p) => p[1])
  const x0 = Math.max(0, Math.floor(Math.min(...xs) - r)), x1 = Math.min(W - 1, Math.ceil(Math.max(...xs) + r))
  const y0 = Math.max(0, Math.floor(Math.min(...ys) - r)), y1 = Math.min(H - 1, Math.ceil(Math.max(...ys) + r))
  if (x0 > x1 || y0 > y1) return out
  const bw = x1 - x0 + 1, bh = y1 - y0 + 1
  // distance from each box pixel to the stroke (polyline), squared
  const segs = points.length === 1 ? [[points[0], points[0]]] : points.slice(1).map((p, i) => [points[i], p])
  const near = new Float32Array(bw * bh).fill(Infinity)
  for (const [[ax, ay], [bx, by]] of segs) {
    const dx = bx - ax, dy = by - ay, L = dx * dx + dy * dy
    const sx0 = Math.max(x0, Math.floor(Math.min(ax, bx) - r)), sx1 = Math.min(x1, Math.ceil(Math.max(ax, bx) + r))
    const sy0 = Math.max(y0, Math.floor(Math.min(ay, by) - r)), sy1 = Math.min(y1, Math.ceil(Math.max(ay, by) + r))
    for (let y = sy0; y <= sy1; y++) {
      for (let x = sx0; x <= sx1; x++) {
        const t = L ? Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / L)) : 0
        const ex = x - ax - t * dx, ey = y - ay - t * dy, d2 = ex * ex + ey * ey
        const j = (y - y0) * bw + (x - x0)
        if (d2 < near[j]) near[j] = d2
      }
    }
  }
  // 3×3-mean colour: luma and chromaticity (light changes brightness, not colour)
  const col = new Float32Array(bw * bh * 3)
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      let R = 0, G = 0, B = 0, n = 0
      for (let yy = Math.max(0, y - 1); yy <= Math.min(H - 1, y + 1); yy++) {
        for (let xx = Math.max(0, x - 1); xx <= Math.min(W - 1, x + 1); xx++) { const i = (yy * W + xx) * 4; R += rgb[i]; G += rgb[i + 1]; B += rgb[i + 2]; n++ }
      }
      const s = R + G + B + 3, j = ((y - y0) * bw + (x - x0)) * 3
      col[j] = (0.2126 * R + 0.7152 * G + 0.0722 * B) / (255 * n)
      col[j + 1] = (R + 1) / s
      col[j + 2] = (G + 1) / s
    }
  }
  const diff = (a, b) => Math.abs(col[a * 3] - col[b * 3]) + 2 * (Math.abs(col[a * 3 + 1] - col[b * 3 + 1]) + Math.abs(col[a * 3 + 2] - col[b * 3 + 2]))
  // seeds: the stroke's middle third; their mean colour bounds how far the growth may drift
  const core2 = (r / 3) ** 2, r2 = r * r
  const seen = new Uint8Array(bw * bh), queue = new Int32Array(bw * bh)
  let head = 0, tail = 0
  const mean = [0, 0, 0]
  for (let j = 0; j < near.length; j++) {
    if (near[j] > core2) continue
    seen[j] = 1
    queue[tail++] = j
    mean[0] += col[j * 3]; mean[1] += col[j * 3 + 1]; mean[2] += col[j * 3 + 2]
  }
  if (!tail) return out
  for (let k = 0; k < 3; k++) mean[k] /= tail
  const fromMean = (j) => Math.abs(col[j * 3] - mean[0]) + 2 * (Math.abs(col[j * 3 + 1] - mean[1]) + Math.abs(col[j * 3 + 2] - mean[2]))
  while (head < tail) {
    const j = queue[head++]
    out[(y0 + ((j / bw) | 0)) * W + x0 + (j % bw)] = 255
    const x = j % bw, y = (j / bw) | 0
    for (const k of [x > 0 ? j - 1 : -1, x < bw - 1 ? j + 1 : -1, y > 0 ? j - bw : -1, y < bh - 1 ? j + bw : -1]) {
      if (k < 0 || seen[k] || near[k] > r2) continue
      if (diff(j, k) > edge || fromMean(k) > spread) continue
      seen[k] = 1
      queue[tail++] = k
    }
  }
  return out
}
