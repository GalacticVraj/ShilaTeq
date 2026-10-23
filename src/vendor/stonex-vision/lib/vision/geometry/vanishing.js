// The floor's perspective from the photo itself. A room is a box: floor lines (grout, tile edges,
// the wall–floor seam, furniture bases), wall corners, door frames and the sides of furniture all
// run along three perpendicular directions — two across the floor, one vertical. The camera pose
// that makes the most line length point at those three vanishing points is the room's pose
// ("Manhattan frame": RANSAC hypotheses from three lines, then a local refinement). With the lens
// known (EXIF) or a typical phone lens, that gives pitch, roll and the floor's direction; the lens
// itself is refined only when the lines really pin it down. Too few straight lines → a typical
// phone pose, reported with low confidence — it never pretends.
import { cameraRotation, transpose3, mulVec3, cross3, dot3 } from './camera.js'
import { defaultFocal } from './floor.js'

const DEG = Math.PI / 180

/** Deterministic PRNG (mulberry32) — the same photo always gets the same geometry. */
function rng(seed) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const lineOf = (s) => {
  const l = cross3([s.x1, s.y1, 1], [s.x2, s.y2, 1])
  const n = Math.hypot(l[0], l[1]) || 1
  return [l[0] / n, l[1] / n, l[2] / n]
}

/** Angle (radians) between a segment and the direction from its middle to a homogeneous point. */
function misfit(s, vp) {
  const dx = s.x2 - s.x1, dy = s.y2 - s.y1
  const tx = vp[0] - 0.5 * (s.x1 + s.x2) * vp[2], ty = vp[1] - 0.5 * (s.y1 + s.y2) * vp[2]
  const c = Math.abs(dx * tx + dy * ty) / ((Math.hypot(dx, dy) * Math.hypot(tx, ty)) || 1)
  return Math.acos(Math.min(1, c))
}

const unit = (v) => { const n = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / n, v[1] / n, v[2] / n] }
/** Unit camera-frame direction of a homogeneous image point. */
const dirOf = (v, f, cx, cy) => unit([(v[0] - cx * v[2]) / f, (v[1] - cy * v[2]) / f, v[2]])
/** Homogeneous image point of a camera-frame direction. */
const vpOf = (d, f, cx, cy) => [f * d[0] + cx * d[2], f * d[1] + cy * d[2], d[2]]
/** Vanishing line of the planes perpendicular to camera direction n (the horizon when n is "up"). */
const lineOfNormal = (n, f, cx, cy) => [n[0] / f, n[1] / f, n[2] - (cx * n[0] + cy * n[1]) / f]

/** Pitch and roll of a camera whose world "up" is the camera-frame direction u (either sign). */
function poseFromUp(u) {
  const k = u[1] > 0 ? -1 : 1 // up points up in the photo (y down)
  return { pitch: Math.asin(Math.max(-1, Math.min(1, -k * u[2]))), roll: Math.atan2(k * u[0], -k * u[1]) }
}

/** A floor grid looks the same turned by 90°: fold a direction into (−45°, 45°]. */
function foldYaw(yaw) {
  let y = yaw
  while (y > Math.PI / 4) y -= Math.PI / 2
  while (y <= -Math.PI / 4) y += Math.PI / 2
  return y
}

/** Floor direction (yaw) of a horizontal camera-frame direction, for a pose. */
function yawOf(d, pitch, roll) {
  const w = mulVec3(transpose3(cameraRotation(pitch, roll)), d)
  return foldYaw(Math.atan2(w[0], w[1]))
}

/** The three vanishing points of a room pose: vertical, forward, across. */
function frameVps({ pitch, roll, yaw }, f, cx, cy) {
  const R = cameraRotation(pitch, roll)
  const s = Math.sin(yaw), c = Math.cos(yaw)
  const fwd = [s * R[0] + c * R[1], s * R[3] + c * R[4], s * R[6] + c * R[7]]
  const across = [c * R[0] - s * R[1], c * R[3] - s * R[4], c * R[6] - s * R[7]]
  return [vpOf([R[2], R[5], R[8]], f, cx, cy), vpOf(fwd, f, cx, cy), vpOf(across, f, cx, cy)]
}

/** Weighted line support of a pose; `smooth` gives the refinement a basin to climb. */
function support(segs, pose, f, cx, cy, tol, smooth = false) {
  const vps = frameVps(pose, f, cx, cy)
  let score = 0
  const families = [0, 0, 0]
  for (const s of segs) {
    let best = tol, k = -1
    for (let j = 0; j < 3; j++) {
      const e = misfit(s, vps[j])
      if (e < best) { best = e; k = j }
    }
    if (k < 0) continue
    const q = best / tol
    score += s.w * (smooth ? 1 - q * q : 1 - q)
    families[k] += s.len
  }
  return { score, families, vps }
}

// a phone held level (estate-agent style) or low and tilted slightly UP is common in real rooms: a
// lower bound above 0° clipped those to it, or (camera near the floor) left only a wrong 85° pose
const plausible = ({ pitch, roll }) => pitch > -15 * DEG && pitch < 85 * DEG && Math.abs(roll) <= 25 * DEG

/** RANSAC over room poses: two lines give one direction, a third line its perpendicular partner. */
function searchFrame(segs, { f, cx, cy, random, iterations = 600, tol = 2 * DEG }) {
  const total = segs.reduce((t, s) => t + s.w, 0)
  const pick = () => {
    let r = random() * total
    for (let i = 0; i < segs.length; i++) { r -= segs[i].w; if (r <= 0) return i }
    return segs.length - 1
  }
  let best = null
  const consider = (pose) => {
    if (!plausible(pose)) return
    const sc = support(segs, pose, f, cx, cy, tol)
    if (!best || sc.score > best.score) best = { pose, ...sc }
  }
  for (let it = 0; it < iterations; it++) {
    const i = pick(), j = pick(), k = pick()
    if (i === j || i === k || j === k) continue
    const v1 = cross3(lineOf(segs[i]), lineOf(segs[j]))
    if (!(Math.hypot(...v1) > 1e-12)) continue
    const d1 = dirOf(v1, f, cx, cy)
    const v3 = cross3(lineOf(segs[k]), lineOfNormal(d1, f, cx, cy))
    if (!(Math.hypot(...v3) > 1e-12)) continue
    let d3 = dirOf(v3, f, cx, cy)
    const p = dot3(d3, d1)
    d3 = unit([d3[0] - p * d1[0], d3[1] - p * d1[1], d3[2] - p * d1[2]])
    const d2 = cross3(d1, d3)
    // any of the three can be the vertical
    for (const [up, h] of [[d1, d3], [d3, d1], [d2, d1]]) {
      const pose = poseFromUp(up)
      if (plausible(pose)) consider({ ...pose, yaw: yawOf(h, pose.pitch, pose.roll) })
    }
    // one floor direction and a level camera (roll 0) — enough for a frontal view of tiles
    if (Math.abs(d1[2]) > 1e-6) {
      const pitch = Math.atan(-d1[1] / d1[2])
      if (pitch > 0) consider({ pitch, roll: 0, yaw: yawOf(d1, pitch, 0) })
    }
  }
  return best
}

/** Coordinate ascent on the smooth support (and the focal length when it is free). */
function refine(segs, start, { f0, cx, cy, freeFocal, L }) {
  const tol = 2.5 * DEG
  let pose = { ...start }, logf = 0
  const objective = (p, lf) => {
    const f = f0 * Math.exp(lf)
    if (!plausible(p) || f < 0.45 * L || f > 2.5 * L) return -Infinity
    return support(segs, p, f, cx, cy, tol, true).score
  }
  const s0 = objective(pose, 0)
  // a weak pull towards the expected lens: the lines move it only when they really constrain it
  const prior = (lf) => 0.02 * s0 * (lf / Math.log(1.25)) ** 2
  let best = s0
  const keys = freeFocal ? ['pitch', 'roll', 'yaw', 'logf'] : ['pitch', 'roll', 'yaw']
  for (const step of [0.6, 0.25, 0.1, 0.04]) {
    for (let guard = 0, improved = true; improved && guard < 60; guard++) {
      improved = false
      for (const key of keys) {
        for (const sign of [1, -1]) {
          const p = { ...pose }
          let lf = logf
          if (key === 'logf') lf += sign * step * 0.02
          else p[key] += sign * step * DEG
          const v = objective(p, lf) - (freeFocal ? prior(lf) : 0)
          if (v > best + 1e-9) { best = v; pose = p; logf = lf; improved = true }
        }
      }
    }
  }
  return { pose: { ...pose, yaw: foldYaw(pose.yaw) }, f: f0 * Math.exp(logf), logf }
}

/**
 * Estimate the floor plane's camera from line segments (full-photo pixels) and the floor mask.
 * @param {object} p
 * @param {Array} p.segments from lines.detectSegments, scaled to photo pixels
 * @param {Uint8Array} p.mask floor mask (0/1) at maskW × maskH (any size; scaled to the photo)
 * @param {number} p.width photo width (px)  @param {number} p.height photo height (px)
 * @param {number|null} [p.focalPx] from EXIF when known
 * @returns {{ pitch, roll, yaw, focalPx, focalSource, horizon, source: 'lines'|'default', confidence, vps, inlierCount, reason?, floorTop, support? }}
 */
export function estimateFloorCamera({ segments, mask, maskW, maskH, width, height, focalPx = null, focalSource = 'exif' }) {
  const L = Math.max(width, height)
  const cx = width / 2, cy = height / 2
  const kx = width / maskW, ky = height / maskH

  // the floor region: its top edge, and a dilated version to weigh segments with
  let floorTop = Infinity, floorPx = 0
  const rows = new Float32Array(maskH)
  for (let y = 0; y < maskH; y++) {
    let c = 0
    for (let x = 0; x < maskW; x++) c += mask[y * maskW + x] ? 1 : 0
    rows[y] = c
    floorPx += c
  }
  if (floorPx) {
    let acc = 0
    for (let y = 0; y < maskH; y++) { acc += rows[y]; if (acc >= 0.01 * floorPx) { floorTop = y * ky; break } }
  }
  const near = (x, y, r) => {
    const mx = Math.round(x / kx), my = Math.round(y / ky), rr = Math.max(1, Math.round(r / kx))
    for (let yy = Math.max(0, my - rr); yy <= Math.min(maskH - 1, my + rr); yy += Math.max(1, rr >> 1)) {
      for (let xx = Math.max(0, mx - rr); xx <= Math.min(maskW - 1, mx + rr); xx += Math.max(1, rr >> 1)) if (mask[yy * maskW + xx]) return true
    }
    return false
  }
  const fallback = (reason) => {
    const f = focalPx > 0 ? focalPx : defaultFocal(width, height)
    // horizon a little above the floor's far edge (or a typical 20° look-down without a mask)
    const yh = Number.isFinite(floorTop) ? Math.min(floorTop - 0.08 * height, cy - f * Math.tan(10 * DEG)) : cy - f * Math.tan(20 * DEG)
    const pitch = Math.min(60 * DEG, Math.max(8 * DEG, Math.atan2(cy - yh, f)))
    return {
      pitch, roll: 0, yaw: 0, focalPx: f, focalSource: focalPx > 0 ? focalSource : 'default',
      horizon: [0, 1, -(cy - f * Math.tan(pitch))], source: 'default', confidence: 0.2, vps: [], inlierCount: 0, reason, floorTop,
    }
  }
  if (!floorPx) return fallback('NO_FLOOR')

  // every straight edge votes — floor lines, walls, furniture — those touching the floor a bit more
  const segs = segments
    .filter((s) => s.len >= 0.02 * L)
    .map((s) => ({ ...s, w: s.len * (near((s.x1 + s.x2) / 2, (s.y1 + s.y2) / 2, 0.025 * L) ? 1.5 : 1) }))
  if (segs.length < 4) return fallback('FEW_LINES')

  // lens unknown (no EXIF — e.g. a forwarded photo): try the usual phone lenses, a little in
  // favour of the typical one; a wrong lens makes the three directions disagree
  let f0 = focalPx > 0 ? focalPx : defaultFocal(width, height), found = null
  for (const k of focalPx > 0 ? [1] : [1, 0.82, 0.9, 1.11, 1.25]) {
    const cand = searchFrame(segs, { f: f0 * k, cx, cy, random: rng(0x5713) })
    if (cand && (!found || cand.score * (k === 1 ? 1.04 : 1) > found.score * (found.k === 1 ? 1.04 : 1))) found = { ...cand, k }
  }
  if (!found) return fallback('NO_VANISHING_POINT')
  f0 *= found.k
  const fams = found.families
  const familiesWithLines = fams.filter((v) => v >= 0.12 * L).length
  if (familiesWithLines < 2 && fams[1] + fams[2] < 0.25 * L) return fallback('NO_VANISHING_POINT')

  const freeFocal = !(focalPx > 0)
  const r = refine(segs, found.pose, { f0, cx, cy, freeFocal, L })
  let f = freeFocal ? r.f : f0, pose = r.pose, fSource = freeFocal ? 'vanishing' : focalSource
  if (freeFocal && found.k === 1 && Math.abs(r.logf) < 0.02) {
    // the lines did not move the lens: keep the typical one and say so
    f = f0
    pose = refine(segs, found.pose, { f0, cx, cy, freeFocal: false, L }).pose
    fSource = 'default'
  }
  const { pitch, roll } = pose
  let { yaw } = pose
  const final = support(segs, pose, f, cx, cy, 2 * DEG)
  // no line along the floor at all: the floor's direction is unknown — straight ahead, said so
  const floorLines = final.families[1] + final.families[2]
  if (floorLines < 0.1 * L) yaw = 0

  const R = cameraRotation(pitch, roll)
  const horizonRaw = lineOfNormal([R[2], R[5], R[8]], f, cx, cy)
  const hn = Math.hypot(horizonRaw[0], horizonRaw[1]) || 1
  const horizon = horizonRaw.map((v) => v / hn)

  // nearly every floor pixel must be below the horizon
  let below = 0, seen = 0
  const side = (x, y) => horizon[0] * x + horizon[1] * y + horizon[2]
  const sFloor = Math.sign(side(cx, height)) || 1
  for (let y = 0; y < maskH; y += 2) {
    for (let x = 0; x < maskW; x += 2) {
      if (!mask[y * maskW + x]) continue
      seen++
      if (Math.sign(side((x + 0.5) * kx, (y + 0.5) * ky)) === sFloor) below++
    }
  }
  if (!seen || below / seen < 0.97) return fallback('FLOOR_ABOVE_HORIZON')

  const strength = (final.families[0] + floorLines) / L
  const confidence = Math.min(0.95, (0.35 + 0.3 * Math.log2(1 + strength)) * (final.families.filter((v) => v >= 0.12 * L).length >= 2 ? 1 : 0.8))
  const point = (v) => (Math.abs(v[2]) > 1e-9 ? [v[0] / v[2], v[1] / v[2]] : { direction: [v[0], v[1]] })
  return {
    pitch, roll, yaw, focalPx: f, focalSource: fSource, horizon,
    source: 'lines', confidence: Math.round(confidence * 100) / 100,
    vps: [point(final.vps[1]), point(final.vps[2]), point(final.vps[0])],
    inlierCount: segs.filter((s) => final.vps.some((vp) => misfit(s, vp) < 2 * DEG)).length,
    support: { vertical: Math.round(final.families[0]), forward: Math.round(final.families[1]), across: Math.round(final.families[2]) },
    floorTop,
  }
}
