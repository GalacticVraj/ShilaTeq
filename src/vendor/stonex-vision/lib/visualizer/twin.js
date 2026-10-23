// SHILATEQ EDIT: StoneX's twin.js is the slab-capture pipeline (2,700 lines); the floor geometry
// needs only estimateAspect, copied here verbatim (StoneX src/lib/visualizer/twin.js, eb9a0d8).
const round = (v, d = 3) => Math.round(v * 10 ** d) / 10 ** d

/**
 * Width : height of the real rectangle behind a perspective quad (Zhang & He,
 * whiteboard rectification). The camera's focal length is recovered from the two
 * vanishing points when the view is oblique enough; otherwise a typical phone
 * main-camera focal length (≈0.75 × the long side) is assumed. Near-frontal shots
 * don't depend on it much, so the estimate stays close either way.
 * @returns {{ aspect: number, focal: number, focalFromImage: boolean }}
 */
export function estimateAspect(corners, width, height, opts = {}) {
  const u0 = width / 2, v0 = height / 2
  const m1 = [corners[0], corners[1], 1], m2 = [corners[2], corners[3], 1] // TL, TR
  const m3 = [corners[6], corners[7], 1], m4 = [corners[4], corners[5], 1] // BL, BR
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
  const c14 = cross(m1, m4)
  const k2 = dot(c14, m3) / dot(cross(m2, m4), m3)
  const k3 = dot(c14, m2) / dot(cross(m3, m4), m2)
  const n2 = m2.map((v, i) => k2 * v - m1[i]), n3 = m3.map((v, i) => k3 * v - m1[i])
  const L = Math.max(width, height)
  let f = null
  const den = n2[2] * n3[2]
  if (Math.abs(den) > 1e-12) {
    const f2 = -((n2[0] * n3[0] - (n2[0] * n3[2] + n2[2] * n3[0]) * u0 + den * u0 * u0)
      + (n2[1] * n3[1] - (n2[1] * n3[2] + n2[2] * n3[1]) * v0 + den * v0 * v0)) / den
    if (f2 > 0) f = Math.sqrt(f2)
  }
  const fromImage = f !== null && f > 0.45 * L && f < 2.5 * L
  const fu = fromImage ? f : opts.focal || 0.75 * L
  const q = (n) => ((n[0] - u0 * n[2]) / fu) ** 2 + ((n[1] - v0 * n[2]) / fu) ** 2 + n[2] ** 2
  return { aspect: Math.sqrt(q(n2) / q(n3)), focal: round(fu, 1), focalFromImage: fromImage }
}
