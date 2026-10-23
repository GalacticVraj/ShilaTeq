// VisionLayout — how real slabs are laid on a surface plane. The first layout is the simplest
// true one: the actual slab, at its real size and its photographed shape, repeated in a grid on the
// floor plane with thin joints, every slab the same way round. No mirroring, no bookmatching, no
// rotation per slab, no stretching: the twin's own aspect ratio decides the slab's shape.
//
// The renderer evaluates the same arithmetic per pixel on the GPU; slabAt() mirrors it for tests
// and the debug panel.

export const FT_TO_CM = 30.48
/** Used only when a slab has no recorded size; the render then says "Preview scale". */
export const TYPICAL_SLAB_LONG_CM = 270
export const DEFAULT_JOINT_MM = 2
export const LAYOUT_LIMITS = Object.freeze({ minSideCm: 10, maxSideCm: 600, minAspect: 0.15, maxAspect: 6.5, maxMismatch: 0.08 })

export class LayoutError extends Error {
  constructor(code) { super(code); this.name = 'LayoutError'; this.code = code }
}

/**
 * The physical rectangle one slab covers, in the twin image's own axes.
 * @param {{ twinWidth: number, twinHeight: number, lengthFt?: number|null, widthFt?: number|null }} p
 * @returns {{ widthCm: number, heightCm: number, aspect: number, sizeSource: 'inventory'|'approximate', mismatch: number|null }}
 *   widthCm runs along the twin's x axis, heightCm along its y axis.
 */
export function slabRectangle({ twinWidth, twinHeight, lengthFt = null, widthFt = null }) {
  if (!(twinWidth > 0 && twinHeight > 0)) throw new LayoutError('BAD_TWIN')
  const aspect = twinWidth / twinHeight // the photographed slab's shape — never changed
  if (!(aspect >= LAYOUT_LIMITS.minAspect && aspect <= LAYOUT_LIMITS.maxAspect)) throw new LayoutError('BAD_TWIN_SHAPE')
  const sides = [Number(lengthFt), Number(widthFt)].filter((v) => Number.isFinite(v) && v > 0)
  const longTwin = Math.max(aspect, 1 / aspect)
  let longCm, sizeSource, mismatch = null
  if (sides.length === 2) {
    longCm = Math.max(...sides) * FT_TO_CM
    sizeSource = 'inventory'
    const longInv = Math.max(...sides) / Math.min(...sides)
    mismatch = Math.round((Math.abs(longInv - longTwin) / longTwin) * 1000) / 1000
  } else if (sides.length === 1) {
    longCm = sides[0] * FT_TO_CM // one recorded side: take it as the long side, shape from the photo
    sizeSource = 'inventory'
  } else {
    longCm = TYPICAL_SLAB_LONG_CM
    sizeSource = 'approximate'
  }
  const shortCm = longCm / longTwin
  if (!(longCm <= LAYOUT_LIMITS.maxSideCm && shortCm >= LAYOUT_LIMITS.minSideCm)) throw new LayoutError('IMPOSSIBLE_SIZE')
  const landscape = aspect >= 1
  return {
    widthCm: landscape ? longCm : shortCm,
    heightCm: landscape ? shortCm : longCm,
    aspect,
    sizeSource,
    mismatch,
  }
}

/**
 * Grid parameters for the renderer. `origin` = a floor point (cm) where a slab corner sits — or
 * `centre` = a floor point a slab is centred on (the one in front of the camera: a whole slab,
 * not a joint cross, where the eye looks first); `rotation` = the grid's direction on the floor
 * (radians, from the surface's yaw plus any turn).
 */
export function gridLayout(rect, { origin = [0, 0], centre = null, rotation = 0, jointMm = DEFAULT_JOINT_MM, turn = 0 } = {}) {
  if (!rect || !(rect.widthCm > 0 && rect.heightCm > 0)) throw new LayoutError('BAD_RECT')
  if (!(jointMm >= 0 && jointMm <= 20)) throw new LayoutError('BAD_JOINT')
  const angle = rotation + (turn ? Math.PI / 2 : 0)
  const cos = Math.cos(angle), sin = Math.sin(angle)
  const hx = rect.widthCm / 2, hy = rect.heightCm / 2
  // grid frame g = R·(P − origin); a centred slab has g(centre) = half its size
  const o = centre ? [centre[0] - (cos * hx - sin * hy), centre[1] - (sin * hx + cos * hy)] : [origin[0], origin[1]]
  return { sizeCm: [rect.widthCm, rect.heightCm], origin: o, cos, sin, jointCm: jointMm / 10, angle }
}

/** Which slab (col, row) and where inside it (u, v ∈ [0, 1), twin coords) a floor point lands. */
export function slabAt(grid, X, Y) {
  const dx = X - grid.origin[0], dy = Y - grid.origin[1]
  // rotate the floor point into the grid frame
  const gx = grid.cos * dx + grid.sin * dy
  const gy = -grid.sin * dx + grid.cos * dy
  const cx = gx / grid.sizeCm[0], cy = gy / grid.sizeCm[1]
  const col = Math.floor(cx), row = Math.floor(cy)
  const u = cx - col, v = cy - row
  const edge = Math.min(u, 1 - u) * grid.sizeCm[0], edgeY = Math.min(v, 1 - v) * grid.sizeCm[1]
  return { col, row, u, v, inJoint: Math.min(edge, edgeY) < grid.jointCm / 2 }
}
