// FloorSurface — the floor of the customer's photo as a real plane: a camera-consistent
// homography between floor centimetres and photo pixels, so the stone is laid in true perspective
// instead of a stretched square. The first of the VisionSurface kinds (walls, stairs and
// countertops will add their own plane models; layout, lighting and rendering take any of them).
//
// Scale is never invented: a single photo does not know how big the room is. Without a measurement
// the plane assumes a phone held ~1.45 m above the floor and says scale.mode = 'approximate'. A
// tapped reference length makes it 'entered'. Quantities are never derived from either.
import { squareToQuad } from '../../visualizer/engine.js'
import { estimateAspect } from '../../visualizer/twin.js'
import { floorHomography, floorInverse, horizonOf, apply3, mul3, poseFromPlaneHomography, cameraFromHorizon } from './camera.js'

export const DEFAULT_CAMERA_HEIGHT_CM = 145
export const SCALE_MODES = Object.freeze({ approximate: 'approximate', entered: 'entered' })
const DEG = Math.PI / 180

/** A typical phone main camera when the photo carries no lens data (≈26 mm equivalent). */
export const defaultFocal = (width, height) => 0.75 * Math.max(width, height)

/**
 * @typedef {object} FloorSurface
 * @property {'floor'} kind
 * @property {number} width photo width (px) the homography refers to
 * @property {number} height
 * @property {{ f: number, cx: number, cy: number, pitch: number, roll: number, heightCm: number, focalSource: string }} camera
 * @property {number[]} H floor (cm) → image (px)
 * @property {number[]} Hinv image (px) → floor (cm), normalised so floor points have w > 0
 * @property {number[]} horizon [a, b, c]
 * @property {number} yaw slab-grid direction on the floor (radians)
 * @property {{ mode: 'approximate'|'entered', heightCm: number, reference?: object }} scale
 * @property {number[]} quad image corners (TL, TR, BR, BL) of a 2 m reference square — for the manual editor
 * @property {'lines'|'default'|'manual'} source
 * @property {number} confidence 0–1
 * @property {string[]} warnings machine codes
 */

/** Build a FloorSurface from a camera model. */
export function createFloorSurface({
  width, height, focalPx, focalSource = 'default', pitch, roll = 0, yaw = 0,
  cameraHeightCm = DEFAULT_CAMERA_HEIGHT_CM, scale = null, source = 'default', confidence = 0.2, warnings = [], details = null,
}) {
  if (!(width > 0 && height > 0)) throw new Error('BAD_SIZE')
  const f = focalPx > 0 ? focalPx : defaultFocal(width, height)
  // a level or slightly up-tilted phone is fine (real rooms: estate-agent shots, a camera near the
  // floor) as long as the photo's bottom edge still looks down at the floor
  if (!(pitch > -20 * DEG && pitch < 89 * DEG && pitch + Math.atan(height / 2 / f) > 2 * DEG)) throw new Error('BAD_PITCH')
  if (!(cameraHeightCm > 1)) throw new Error('BAD_HEIGHT')
  const camera = { f, cx: width / 2, cy: height / 2, pitch, roll, heightCm: cameraHeightCm, focalSource: focalPx > 0 ? focalSource : 'default' }
  const H = floorHomography(camera)
  const near = nearFloorPoint(camera)
  const Hinv = floorInverse(H, apply3(H, near[0], near[1]))
  return {
    kind: 'floor', width, height, camera, H, Hinv,
    horizon: horizonOf(H),
    yaw,
    scale: scale || { mode: SCALE_MODES.approximate, heightCm: cameraHeightCm },
    quad: referenceQuad(H, near),
    source, confidence, warnings, details,
  }
}

/** A floor point straight ahead, where the bottom-centre of the photo looks (or 1 m in front). */
function nearFloorPoint({ pitch, heightCm, f, cy }) {
  // the ray through the bottom edge leaves the camera at pitch + atan(cy / f) below horizontal
  const down = Math.min(80 * DEG, pitch + Math.atan(cy / f))
  const dist = heightCm / Math.tan(down)
  return [0, Math.max(30, dist + 60)]
}

/** Image corners of a 200 cm square on the floor, centred ahead of the camera (TL, TR, BR, BL). */
function referenceQuad(H, [x0, y0]) {
  const s = 100
  const pts = [[x0 - s, y0 + 2 * s], [x0 + s, y0 + 2 * s], [x0 + s, y0], [x0 - s, y0]]
  return pts.flatMap(([x, y]) => apply3(H, x, y).slice(0, 2))
}

/** Image px → floor cm (null above the horizon). */
export function imageToFloor(surface, x, y) {
  const [X, Y, w] = apply3(surface.Hinv, x, y)
  return w > 0 ? [X, Y] : null
}

/** Floor cm → image px. */
export function floorToImage(surface, X, Y) {
  const [x, y, w] = apply3(surface.H, X, Y)
  return w > 0 ? [x, y] : null
}

/**
 * Scale the plane so the distance between two tapped floor points equals `lengthCm`
 * (the customer's own measurement) → scale.mode 'entered'. Only the camera height changes.
 */
export function withReferenceLength(surface, p1, p2, lengthCm) {
  if (!(lengthCm >= 5 && lengthCm <= 10000)) throw new Error('BAD_LENGTH')
  const a = imageToFloor(surface, p1[0], p1[1]), b = imageToFloor(surface, p2[0], p2[1])
  if (!a || !b) throw new Error('POINT_NOT_ON_FLOOR')
  const d = Math.hypot(a[0] - b[0], a[1] - b[1])
  if (!(d > 1e-6)) throw new Error('POINTS_TOO_CLOSE')
  const heightCm = surface.camera.heightCm * (lengthCm / d)
  if (surface.source === 'manual') return scaleManual(surface, lengthCm / d, { mode: SCALE_MODES.entered, heightCm, reference: { p1, p2, lengthCm } })
  return createFloorSurface({
    ...surfaceArgs(surface),
    cameraHeightCm: heightCm,
    scale: { mode: SCALE_MODES.entered, heightCm, reference: { p1: [...p1], p2: [...p2], lengthCm } },
  })
}

/**
 * Back to the approximate scale (the measurement was removed) — at the default camera height, or at
 * `heightCm` (the customer's "stone size": a lower camera draws the stone larger). Still approximate.
 */
export function withApproximateScale(surface, heightCm = DEFAULT_CAMERA_HEIGHT_CM) {
  if (!(heightCm > 1)) throw new Error('BAD_HEIGHT')
  if (surface.source === 'manual') return scaleManual(surface, heightCm / surface.camera.heightCm, { mode: SCALE_MODES.approximate, heightCm })
  return createFloorSurface({ ...surfaceArgs(surface), cameraHeightCm: heightCm, scale: null })
}

const surfaceArgs = (s) => ({
  width: s.width, height: s.height, focalPx: s.camera.f, focalSource: s.camera.focalSource, pitch: s.camera.pitch, roll: s.camera.roll,
  yaw: s.yaw, source: s.source, confidence: s.confidence, warnings: s.warnings, details: s.details,
})

/** Same orientation, different scale: image point (X·k, Y·k) ↔ old (X, Y). */
function scaleManual(surface, k, scale) {
  const S = [1 / k, 0, 0, 0, 1 / k, 0, 0, 0, 1]
  const H = mul3(surface.H, S)
  const Hinv = mul3([k, 0, 0, 0, k, 0, 0, 0, 1], surface.Hinv)
  return { ...surface, H, Hinv, camera: { ...surface.camera, heightCm: surface.camera.heightCm * k }, scale }
}

/**
 * A FloorSurface from a hand-placed perspective quad (TL, TR, BR, BL image corners of any
 * rectangle lying on the floor — tile lines, a rug's edge…). The rectangle's true shape comes
 * from estimateAspect (twin.js); its size is unknown, so the scale is the same approximate
 * camera-height assumption as the automatic estimate until the customer enters a length.
 */
export function floorFromQuad(quad, { width, height, focalPx = null, focalSource = 'default', yaw = 0 }) {
  if (!Array.isArray(quad) || quad.length !== 8 || !quad.every(Number.isFinite)) throw new Error('BAD_QUAD')
  const est = estimateAspect(quad, width, height, focalPx > 0 ? { focal: focalPx } : {})
  const f = focalPx > 0 ? focalPx : est.focal
  // unit square → image; plane coords (x ∈ [0, aspect], y ∈ [0, 1]) in "rectangle depths"
  const Hunit = squareToQuad(quad)
  const Hrect = mul3(Hunit, [1 / est.aspect, 0, 0, 0, 1, 0, 0, 0, 1])
  const pose = poseFromPlaneHomography(Hrect, { f, cx: width / 2, cy: height / 2 })
  if (!(pose.height > 1e-6)) throw new Error('BAD_QUAD')
  // make the camera DEFAULT_CAMERA_HEIGHT_CM above the plane → centimetres
  const k = DEFAULT_CAMERA_HEIGHT_CM / pose.height // cm per rectangle-depth unit
  // plane coords: x right across the rectangle, y from its TL→BL edge; flip y so +Y points away
  // from the camera like the automatic plane (the quad's top edge is the far one)
  const H = mul3(Hrect, [1 / k, 0, 0, 0, -1 / k, 1, 0, 0, 1])
  const probe = apply3(H, 0.5 * est.aspect * k, 0.5 * k) // the rectangle's centre is on the floor
  const Hinv = floorInverse(H, probe)
  const horizon = horizonOf(H)
  const { pitch, roll } = cameraFromHorizon(horizon, { f, cx: width / 2, cy: height / 2 })
  return {
    kind: 'floor', width, height,
    camera: { f, cx: width / 2, cy: height / 2, pitch, roll, heightCm: DEFAULT_CAMERA_HEIGHT_CM, focalSource: focalPx > 0 ? focalSource : est.focalFromImage ? 'quad' : 'default' },
    H, Hinv, horizon, yaw,
    scale: { mode: SCALE_MODES.approximate, heightCm: DEFAULT_CAMERA_HEIGHT_CM },
    quad: [...quad],
    source: 'manual',
    confidence: Math.min(0.9, 0.6 + 0.3 * Math.max(0, 1 - Math.abs(pose.orthogonality) * 10)),
    warnings: Math.abs(pose.orthogonality) > 0.1 ? ['QUAD_NOT_RECTANGLE'] : [],
    details: { aspect: est.aspect, focalFromImage: est.focalFromImage, orthogonality: pose.orthogonality },
  }
}

/**
 * Visible floor extent in plane centimetres along the slab-grid axes (2nd–98th percentile of the
 * masked pixels) — for the debug panel only. Never a quantity: a photo shows part of a room.
 */
export function floorExtent(surface, mask, mw, mh, step = 4) {
  const kx = surface.width / mw, ky = surface.height / mh
  const c = Math.cos(surface.yaw), s = Math.sin(surface.yaw)
  const us = [], vs = []
  for (let y = 0; y < mh; y += step) {
    for (let x = 0; x < mw; x += step) {
      if (!mask[y * mw + x]) continue
      const p = imageToFloor(surface, (x + 0.5) * kx, (y + 0.5) * ky)
      if (!p) continue
      us.push(c * p[0] - s * p[1])
      vs.push(s * p[0] + c * p[1])
    }
  }
  if (us.length < 10) return null
  const span = (a) => {
    a.sort((p, q) => p - q)
    return a[Math.floor(a.length * 0.98)] - a[Math.floor(a.length * 0.02)]
  }
  return { widthCm: Math.round(span(us)), depthCm: Math.round(span(vs)) }
}
