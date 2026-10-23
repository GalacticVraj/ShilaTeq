// Pinhole camera ↔ plane homographies for StoneX Vision. 3×3 matrices are row-major arrays,
// the same layout as engine.js's squareToQuad()/invert3(), which this file builds on.
//
// World frame: X right, Y forward (horizontal), Z up; the floor is Z = 0 and the camera sits at
// (0, 0, heightCm). Camera frame: x right, y down, z forward. Pitch > 0 = looking down,
// roll = the horizon's angle in the image (y down, so > 0 tilts it down to the right).
import { invert3 } from '../../visualizer/engine.js'

export const mul3 = (a, b) => {
  const o = new Array(9)
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) o[r * 3 + c] = a[r * 3] * b[c] + a[r * 3 + 1] * b[3 + c] + a[r * 3 + 2] * b[6 + c]
  }
  return o
}
export const apply3 = (m, x, y) => {
  const w = m[6] * x + m[7] * y + m[8]
  return [(m[0] * x + m[1] * y + m[2]) / w, (m[3] * x + m[4] * y + m[5]) / w, w]
}
export const mulVec3 = (m, v) => [
  m[0] * v[0] + m[1] * v[1] + m[2] * v[2],
  m[3] * v[0] + m[4] * v[1] + m[5] * v[2],
  m[6] * v[0] + m[7] * v[1] + m[8] * v[2],
]
export const transpose3 = (m) => [m[0], m[3], m[6], m[1], m[4], m[7], m[2], m[5], m[8]]
export const cross3 = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
export const dot3 = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
export const scale3 = (m, k) => m.map((v) => v * k)
export { invert3 }

export const intrinsics = ({ f, cx, cy }) => [f, 0, cx, 0, f, cy, 0, 0, 1]

/** World → camera rotation for a pitch and roll (radians). Rows = camera axes in world coords. */
export function cameraRotation(pitch, roll = 0) {
  const sp = Math.sin(pitch), cp = Math.cos(pitch)
  const R = [1, 0, 0, 0, -sp, -cp, 0, cp, -sp]
  if (!roll) return R
  const cr = Math.cos(roll), sr = Math.sin(roll)
  return mul3([cr, -sr, 0, sr, cr, 0, 0, 0, 1], R)
}

/**
 * Floor homography: floor point (X cm, Y cm) → image pixel, for a camera of focal length f
 * (px), principal point (cx, cy), pitch, roll and height above the floor.
 */
export function floorHomography({ f, cx, cy, pitch, roll = 0, heightCm }) {
  const R = cameraRotation(pitch, roll)
  // columns: R·X̂, R·Ŷ and −h·R·Ẑ (the camera sits h above the floor)
  const M = [R[0], R[1], -heightCm * R[2], R[3], R[4], -heightCm * R[5], R[6], R[7], -heightCm * R[8]]
  return mul3(intrinsics({ f, cx, cy }), M)
}

/** Normalise a homography's inverse so floor points come out with w > 0 (the shader relies on it). */
export function floorInverse(H, probe) {
  const Hi = invert3(H)
  const [px, py] = probe
  const w = Hi[6] * px + Hi[7] * py + Hi[8]
  return w < 0 ? scale3(Hi, -1) : Hi
}

/** The horizon (vanishing line of the floor) as [a, b, c] with a² + b² = 1 and ax + by + c = 0. */
export function horizonOf(H) {
  const l = cross3([H[0], H[3], H[6]], [H[1], H[4], H[7]])
  const n = Math.hypot(l[0], l[1]) || 1
  return [l[0] / n, l[1] / n, l[2] / n]
}

/** "Up" in an image rolled by `roll` (unit vector, y down). */
export const upVector = (roll) => [Math.sin(roll), -Math.cos(roll)]

/**
 * Pitch and roll from a horizon line, focal length and principal point. The roll is the
 * horizon's own angle; the pitch comes from how far above the principal point it runs.
 */
export function cameraFromHorizon(line, { f, cx, cy }) {
  let [a, b, c] = line
  // direction (b, −a); keep it pointing right so the angle is in (−90°, 90°]
  let dx = b, dy = -a
  if (dx < 0 || (dx === 0 && dy < 0)) { dx = -dx; dy = -dy; a = -a; b = -b; c = -c }
  const roll = Math.atan2(dy, dx)
  const dist = a * cx + b * cy + c // signed distance of the principal point to the line
  const up = upVector(roll)
  // move from the principal point to the line along the normal; measure that along "up"
  const toLine = [-dist * a, -dist * b]
  const dUp = toLine[0] * up[0] + toLine[1] * up[1]
  return { pitch: Math.atan2(dUp, f), roll }
}

/**
 * Camera pose from a homography of a floor RECTANGLE (unit-square coords scaled by `aspect`):
 * planar pose decomposition with known intrinsics. Returns the camera height in units of the
 * rectangle's depth, plus pitch/roll — used to give a hand-placed perspective quad the same
 * approximate scale as the automatic estimate.
 */
export function poseFromPlaneHomography(Hplane, { f, cx, cy }) {
  const Ki = invert3(intrinsics({ f, cx, cy }))
  const M = mul3(Ki, Hplane)
  const c1 = [M[0], M[3], M[6]], c2 = [M[1], M[4], M[7]], c3 = [M[2], M[5], M[8]]
  const lam = 2 / (Math.hypot(...c1) + Math.hypot(...c2))
  let r1 = c1.map((v) => v * lam), r2 = c2.map((v) => v * lam), t = c3.map((v) => v * lam)
  if (t[2] < 0) { r1 = r1.map((v) => -v); r2 = r2.map((v) => -v); t = t.map((v) => -v) } // plane in front of the camera
  const r3 = cross3(r1, r2)
  // camera centre in plane coords: C = −Rᵀ t; its distance from the plane is |C·ẑ| = |r3·t|
  const height = Math.abs(dot3(r3, t))
  return { height, normal: r3, orthogonality: dot3(r1, r2) / (Math.hypot(...r1) * Math.hypot(...r2)) }
}
