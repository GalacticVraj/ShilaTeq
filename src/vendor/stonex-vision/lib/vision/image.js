// Pure image helpers shared by the bench worker, the page and Node scripts (no DOM).
// An image is { width, height, data: Uint8ClampedArray RGBA }; a plane is a Float32Array w×h.

/** Width/height scaled so the long edge is at most `maxEdge` (never upscaled). */
export function fitLongEdge(width, height, maxEdge) {
  const k = Math.min(1, maxEdge / Math.max(width, height))
  return { width: Math.max(1, Math.round(width * k)), height: Math.max(1, Math.round(height * k)) }
}

/** RGBA bytes → three float planes (0–255). */
export function rgbaToPlanes({ width, height, data }) {
  const n = width * height
  const R = new Float32Array(n), G = new Float32Array(n), B = new Float32Array(n)
  for (let i = 0, j = 0; i < n; i++, j += 4) { R[i] = data[j]; G[i] = data[j + 1]; B[i] = data[j + 2] }
  return { R, G, B }
}

/** Rec. 709 luma of an RGBA image, 0–1 — the guide for edge-aware mask refinement. */
export function lumaPlane({ width, height, data }) {
  const n = width * height
  const Y = new Float32Array(n)
  for (let i = 0, j = 0; i < n; i++, j += 4) Y[i] = (0.2126 * data[j] + 0.7152 * data[j + 1] + 0.0722 * data[j + 2]) / 255
  return Y
}

// Tent-kernel weights, widened when shrinking (antialiased bilinear, like PIL BILINEAR).
function weights(src, dst) {
  const scale = src / dst
  const support = Math.max(1, scale)
  const out = new Array(dst)
  for (let i = 0; i < dst; i++) {
    const center = (i + 0.5) * scale - 0.5
    const start = Math.max(0, Math.ceil(center - support))
    const end = Math.min(src - 1, Math.floor(center + support))
    const w = []
    let sum = 0
    for (let j = start; j <= end; j++) {
      const v = Math.max(0, 1 - Math.abs(j - center) / support)
      w.push(v)
      sum += v
    }
    if (sum === 0) out[i] = { start: Math.min(src - 1, Math.max(0, Math.round(center))), w: Float32Array.of(1) }
    else out[i] = { start, w: Float32Array.from(w, (v) => v / sum) }
  }
  return out
}

/** Separable resample of one plane (any size → any size). */
export function resizePlane(plane, w, h, dw, dh) {
  if (w === dw && h === dh) return Float32Array.from(plane)
  const hx = weights(w, dw)
  const tmp = new Float32Array(h * dw)
  for (let y = 0; y < h; y++) {
    const row = y * w
    for (let x = 0; x < dw; x++) {
      const { start, w: k } = hx[x]
      let s = 0
      for (let i = 0; i < k.length; i++) s += plane[row + start + i] * k[i]
      tmp[y * dw + x] = s
    }
  }
  const vy = weights(h, dh)
  const out = new Float32Array(dw * dh)
  for (let y = 0; y < dh; y++) {
    const { start, w: k } = vy[y]
    for (let x = 0; x < dw; x++) {
      let s = 0
      for (let i = 0; i < k.length; i++) s += tmp[(start + i) * dw + x] * k[i]
      out[y * dw + x] = s
    }
  }
  return out
}

/** Resize an RGBA image (antialiased). */
export function resizeImage(img, dw, dh) {
  if (img.width === dw && img.height === dh) return img
  const { R, G, B } = rgbaToPlanes(img)
  const r = resizePlane(R, img.width, img.height, dw, dh)
  const g = resizePlane(G, img.width, img.height, dw, dh)
  const b = resizePlane(B, img.width, img.height, dw, dh)
  const data = new Uint8ClampedArray(dw * dh * 4)
  for (let i = 0, j = 0; i < dw * dh; i++, j += 4) { data[j] = r[i]; data[j + 1] = g[i]; data[j + 2] = b[i]; data[j + 3] = 255 }
  return { width: dw, height: dh, data }
}

/** Resize a binary mask (area-weighted, then ≥ 0.5). */
export function resizeMask(mask, w, h, dw, dh) {
  if (w === dw && h === dh) return Uint8Array.from(mask)
  const src = new Float32Array(w * h)
  for (let i = 0; i < src.length; i++) src[i] = mask[i] ? 1 : 0 // plain loops: TypedArray.from(…, fn) is slow on phones
  const f = resizePlane(src, w, h, dw, dh)
  const out = new Uint8Array(dw * dh)
  for (let i = 0; i < out.length; i++) out[i] = f[i] >= 0.5 ? 1 : 0
  return out
}

/** Clamped bilinear sample of a plane at continuous pixel-centre coordinates. */
export function bilinear(plane, w, h, x, y) {
  x = x < 0 ? 0 : x > w - 1 ? w - 1 : x
  y = y < 0 ? 0 : y > h - 1 ? h - 1 : y
  const x0 = Math.floor(x), y0 = Math.floor(y)
  const x1 = x0 + 1 < w ? x0 + 1 : x0, y1 = y0 + 1 < h ? y0 + 1 : y0
  const fx = x - x0, fy = y - y0
  const a = plane[y0 * w + x0] + (plane[y0 * w + x1] - plane[y0 * w + x0]) * fx
  const b = plane[y1 * w + x0] + (plane[y1 * w + x1] - plane[y1 * w + x0]) * fx
  return a + (b - a) * fy
}

/** RGBA image with a coloured mask overlay (for previews). */
export function overlay(img, mask, rgb = [255, 64, 32], alpha = 0.45) {
  const data = Uint8ClampedArray.from(img.data)
  for (let i = 0, j = 0; i < mask.length; i++, j += 4) {
    const a = (mask[i] > 1 ? mask[i] / 255 : mask[i]) * alpha
    if (!a) continue
    data[j] += (rgb[0] - data[j]) * a
    data[j + 1] += (rgb[1] - data[j + 1]) * a
    data[j + 2] += (rgb[2] - data[j + 2]) * a
  }
  return { width: img.width, height: img.height, data }
}
