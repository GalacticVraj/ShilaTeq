// The CPU side of StoneX Vision — everything that must stay off the main thread: the segmenter
// (behind one adapter contract, so models can be swapped), the editable mask, the floor-geometry
// analysis and the lighting measurement. vision.worker.js hosts it in a Web Worker; tests (and
// browsers without module workers) run it in-process. Plain data in, plain data out.
//
// VisionSegmenter contract every adapter implements (segment/*.js):
//   setImage(ImageDataLike) → { preprocessMs, encodeMs }
//   decode(x, y)            → { candidates: [{ score, area, probAt(w, h) → Float32Array 0–1 }], extra }
//   dispose()
// plus `info` and `load`. The mask, geometry, layout and renderer never see which model ran.
import { SEGMENTERS, MODEL_VARIANTS, RUNTIME_FILES, VISION_ASSET_BASE, assertSegmenterAllowed } from './config.js'
import { createRegionAdapter } from './segment/regionGrow.js'
import { downloadFailed } from './segment/assets.js'
import { MaskEditor, chooseCandidate, chooseFirstTap, chooseAddCandidate, addVerdict, MaskError, MASK_LIMITS } from './mask.js'
import { lumaPlane, resizeMask, resizeImage, fitLongEdge } from './image.js'
// the CPU runtime's Wasm, as the build emits it: ONE content-hashed copy beside the app (the same file
// ORT's own bundle points at), still checked against its pin before ORT sees it
// SHILATEQ EDIT: no Vite `?url` import here: the website serves the pinned copy beside the models
const ortWasmUrl = `${VISION_ASSET_BASE}ort/1.30.0/ort-wasm-simd-threaded.wasm`

const LIGHT_EDGE = 640 // light is low-frequency: measured on a small copy (fast on phones)
import { analysisGray, detectSegments } from './geometry/lines.js'
import { estimateFloorCamera } from './geometry/vanishing.js'
import { floorLighting } from './lighting.js'

/** Classify a failure so the caller can drop a tier (out of memory, GPU lost) or just retry. */
export function failureKind(err) {
  if (err?.kind) return err.kind
  const msg = String(err?.message || err)
  if (/out of memory|oom|allocation failed|Array buffer allocation|could not allocate|memory access out of bounds|failed to grow|Aborted\(OOM/i.test(msg)) return 'oom'
  if (/device (was |is )?lost|DeviceLost|GPUDevice.*(destroyed|lost)/i.test(msg)) return 'device-lost'
  if (/webgpu adapter unavailable|no-webgpu/i.test(msg)) return 'no-webgpu'
  return 'error'
}

/**
 * `verify`: every file must match its pinned size and SHA-256 (models.json) before it is used — a
 * missing file, an HTML page in its place or a damaged one is an `asset` error, never a model.
 * `reload`: fetch past the browser's HTTP cache (after such an error, so a bad copy isn't reused).
 */
async function openSegmenter(id, { assetBase, onDeviceLost, onProgress = () => {}, verify = false, reload = false }) {
  const spec = SEGMENTERS[id]
  if (!spec) throw Object.assign(new Error(`unknown segmenter ${id}`), { kind: 'error' })
  if (spec.kind === 'region') return createRegionAdapter()
  const variantId = spec.variant.any
  const variant = { id: variantId, ...MODEL_VARIANTS[variantId] }
  const runtimeFile = RUNTIME_FILES[spec.backend === 'webgpu' ? 'ort-wasm-simd-threaded.asyncify.wasm' : 'ort-wasm-simd-threaded.wasm']
  // the download's real progress against the pinned files' known sizes, told every 2 % or so — and at
  // least every 10 s while bytes still arrive: the client's init timeout counts silence (client.js), so
  // a very slow link that is still downloading is never taken for a stalled one
  const total = (runtimeFile?.bytes || 0) + Object.values(variant.files).reduce((t, f) => t + (f.bytes || 0), 0)
  let loaded = 0, told = 0, toldAt = performance.now()
  const onBytes = (n) => {
    loaded += n
    const t = performance.now()
    if (loaded - told >= total / 50 || loaded >= total || t - toldAt >= 10000) { told = loaded; toldAt = t; onProgress(Math.min(loaded, total), total) }
  }
  // the adapter's code is a chunk of its own, fetched now: offline, that is a download that didn't arrive
  const { createAdapter } = await import('./segment/samOrt.js').catch((err) => { throw downloadFailed('segment/samOrt.js', err) })
  const adapter = await createAdapter({ base: assetBase, candidate: spec.family, variant, cold: false, reload, backend: spec.backend, onDeviceLost, onBytes: total > 0 ? onBytes : null, runtimeFile, runtimeUrl: spec.backend === 'wasm' ? ortWasmUrl : null, requireHash: verify })
  return Object.assign(adapter, { variantId })
}

/**
 * A tap that ADDS a left-out spot (under a table, a corner) may come with a proposal that also
 * takes in the bottom of a table leg. Keep only what has the tapped floor's colour (normalised
 * r,g on a 3×3 average — brightness is free, so shadowed floor still passes). In place.
 */
export function gateToTappedColour(region, rgb, W, H, x, y, tol = 0.03) {
  const at = (cx, cy) => {
    let r = 0, g = 0, b = 0
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const i = (Math.min(H - 1, Math.max(0, cy + dy)) * W + Math.min(W - 1, Math.max(0, cx + dx))) * 4
        r += rgb[i]; g += rgb[i + 1]; b += rgb[i + 2]
      }
    }
    const s = r + g + b + 27
    return [(r + 9) / s, (g + 9) / s]
  }
  let r0 = 0, g0 = 0, k = 0
  for (let dy = -4; dy <= 4; dy += 2) for (let dx = -4; dx <= 4; dx += 2) { const c = at(Math.round(x) + dx, Math.round(y) + dy); r0 += c[0]; g0 += c[1]; k++ }
  r0 /= k; g0 /= k
  for (let i = 0; i < region.length; i++) {
    if (region[i] <= 0.05) continue
    const c = at(i % W, (i / W) | 0)
    const d = Math.abs(c[0] - r0) + Math.abs(c[1] - g0)
    if (d > tol) region[i] *= Math.max(0, 2 - d / tol)
  }
  return region
}

/** Nearest-neighbour shrink of a 0/1 (or 0–255) mask. */
function shrinkMask(mask, w, h, dw, dh) {
  if (w === dw && h === dh) return mask
  const out = new Uint8Array(dw * dh)
  for (let y = 0; y < dh; y++) {
    const sy = Math.min(h - 1, Math.floor(((y + 0.5) * h) / dh))
    for (let x = 0; x < dw; x++) out[y * dw + x] = mask[sy * w + Math.min(w - 1, Math.floor(((x + 0.5) * w) / dw))] ? 1 : 0
  }
  return out
}

/**
 * `open` (tests only) stands in for the segmenter loader: (id, opts) → adapter. `production` (a
 * production build: always): an unlicensed segmenter is refused before anything is fetched, and
 * every model file must pass its SHA-256 check (a browser that can't hash it can't use it).
 */
export function createVisionCore({ emit = () => {}, open = openSegmenter, production = !import.meta.env?.DEV } = {}) {
  let segmenter = null, segmenterId = null
  let analysis = null // { img (≤1024 RGBA), w, h }
  let maskSize = null // { width, height } — the render resolution
  let editor = null
  let segments = [] // photo-pixel line segments at the render resolution
  let last = null // last mask result
  let lightImg = null // ≤640 px copy for the lighting measurement
  let photoRgb = null // the photo's RGBA at the render size (edge snapping, colour checks)

  const requireImage = () => { if (!editor) throw Object.assign(new MaskError('NO_IMAGE'), { kind: 'error' }) }
  const summary = (r, extra = {}) => ({
    alpha: r.alpha, coverage: r.coverage, bbox: r.bbox, taps: r.taps.length, width: maskSize.width, height: maskSize.height, ...extra,
  })

  return {
    async init({ segmenter: id, assetBase = VISION_ASSET_BASE, reload = false }) {
      assertSegmenterAllowed(id, { production }) // the licence boundary: nothing is fetched for a refused model
      if (segmenter) { segmenter.dispose(); segmenter = null }
      const t0 = performance.now()
      segmenter = await open(id, {
        assetBase, reload, verify: production,
        onDeviceLost: (info) => emit({ event: 'device-lost', info }),
        onProgress: (loaded, total) => emit({ event: 'load', loaded, total }),
      })
      segmenterId = id
      return { segmenter: id, variant: segmenter.variantId || null, info: segmenter.info, load: { ...segmenter.load, totalMs: performance.now() - t0 } }
    },

    /**
     * analysis: the ≤1024 px copy for the model + lines; guide: the photo at the render size (its
     * pixels only steer the mask edges, they are not kept).
     */
    async setImage({ analysis: img, guide }) {
      if (!segmenter) throw Object.assign(new Error('init first'), { kind: 'error' })
      if (!img?.data || !guide?.data) throw Object.assign(new Error('BAD_IMAGE'), { kind: 'error' })
      // the previous photo goes first: if this one can't be read, a tap must find no photo — never the
      // previous one's (its floor was laid on the new photo)
      analysis = null
      editor = null
      last = null
      lightImg = null
      photoRgb = null
      const t0 = performance.now()
      const timings = await segmenter.setImage(img)
      analysis = { img, w: img.width, h: img.height }
      lightImg = null
      maskSize = { width: guide.width, height: guide.height }
      photoRgb = guide.data
      editor = new MaskEditor(guide.width, guide.height, { guide: lumaPlane(guide), rgb: photoRgb })
      last = null
      const t1 = performance.now()
      const g = analysisGray(img)
      const k = guide.width / g.w
      segments = detectSegments(g.gray, g.w, g.h).map((s) => ({ ...s, x1: s.x1 * k, y1: s.y1 * k, x2: s.x2 * k, y2: s.y2 * k, len: s.len * k }))
      return { ...timings, totalMs: performance.now() - t0, linesMs: performance.now() - t1, lineCount: segments.length }
    },

    /** A tap in render-resolution pixels. label 'pos' adds, 'neg' removes. */
    async tap({ label, x, y }) {
      requireImage()
      const { width: W, height: H } = maskSize
      if (!Number.isFinite(x) || !Number.isFinite(y)) throw Object.assign(new MaskError('BAD_TAP'), { kind: 'error' })
      if (x < 0 || y < 0 || x >= W || y >= H) throw Object.assign(new MaskError('TAP_OUTSIDE'), { kind: 'error' })
      const t0 = performance.now()
      const { candidates, extra } = await segmenter.decode((x * analysis.w) / W, (y * analysis.h) / H)
      const decodeMs = performance.now() - t0
      // until the selection is floor-sized (nothing yet, or a tile or two), an "add" is judged like
      // the first tap: the whole floor, and nothing that isn't floor — never one more tile
      const firstLike = label === 'pos' && !(last?.coverage >= MASK_LIMITS.floorSized)
      // a tap on a spot the selection left out: which proposals contain that spot (checked small)
      const tapInside = firstLike || !last?.coverage || !!last.mask[Math.min(H - 1, Math.round(y)) * W + Math.min(W - 1, Math.round(x))]
      let covers = null
      if (label === 'pos' && !tapInside && candidates.length > 1) {
        const cw = 96, ch = Math.max(1, Math.round((96 * H) / W))
        const k = Math.min(ch - 1, Math.floor((y * ch) / H)) * cw + Math.min(cw - 1, Math.floor((x * cw) / W))
        covers = candidates.map((c) => c.probAt(cw, ch)[k] >= 0.5)
      }
      // the first tap must find FLOOR — not a thin thing on it, something standing on it or a wall
      // (chooseFirstTap): else nothing is laid and the customer is asked to tap the open floor; a flat
      // surface that may not be the floor (a bed, a table top) comes back with `ask`. A later add never
      // climbs the wall with the floor (chooseAddCandidate).
      const oh = Math.max(1, Math.round((640 * H) / W))
      const { choice, ask } = firstLike
        ? chooseFirstTap(candidates, 640, oh)
        : label === 'pos'
          // (its top-edge check at 320 px: an Add shouldn't wait for the first tap's 640 px shape tests)
          ? { choice: chooseAddCandidate(candidates, { currentArea: last.coverage, tapInside, covers, floorTop: last.bbox[1] < Math.max(1, Math.round(0.02 * H)), ow: 320, oh: Math.max(1, Math.round((320 * H) / W)) }), ask: null }
          : { choice: chooseCandidate(candidates, { label, currentArea: last?.coverage || 0, tapInside, covers }), ask: null }
      const t1 = performance.now()
      const region = candidates[choice].probAt(W, H)
      if (label === 'pos' && !tapInside) gateToTappedColour(region, photoRgb, W, H, x, y)
      editor.apply(label, region, [x, y], { choice, score: candidates[choice].score, area: candidates[choice].area })
      const regionMs = performance.now() - t1
      const t2 = performance.now()
      const before = last
      last = editor.result()
      return summary(last, {
        timing: { decodeMs, regionMs, cleanupMs: performance.now() - t2, totalMs: performance.now() - t0 },
        choice: { index: choice, count: candidates.length, scores: candidates.map((c) => c.score), areas: candidates.map((c) => c.area) },
        // an add that isn't more of the same floor (a spot apart from it, a bed, a wall) is shown and
        // asked about like a first tap's doubtful surface (addVerdict)
        ask: ask || (label === 'pos' && !firstLike ? addVerdict(before.mask, last.mask, W, H) : null),
        extra: extra || null,
      })
    },

    undo() {
      requireImage()
      editor.undo()
      last = editor.result()
      return summary(last)
    },

    reset() {
      requireImage()
      editor.reset()
      last = editor.result()
      return summary(last)
    },

    /** Floor camera from the photo's lines + the current mask (lens from EXIF when known). */
    geometry({ focalPx = null, focalSource = 'exif' } = {}) {
      requireImage()
      const { width: W, height: H } = maskSize
      const mw = Math.min(W, 320), mh = Math.max(1, Math.round((mw * H) / W))
      const small = last ? shrinkMask(last.mask, W, H, mw, mh) : new Uint8Array(mw * mh)
      return { ...estimateFloorCamera({ segments, mask: small, maskW: mw, maskH: mh, width: W, height: H, focalPx, focalSource }), lineCount: segments.length }
    },

    /**
     * The original floor's light, relative to its typical level (measured on a ≤640 px copy).
     * `hinv` (render px → floor cm) lets the smoothing work in sizes on the floor.
     */
    lighting({ hinv = null, ...opts } = {}) {
      requireImage()
      const { width: W, height: H } = maskSize
      if (!lightImg) {
        const { width: lw, height: lh } = fitLongEdge(analysis.w, analysis.h, LIGHT_EDGE)
        lightImg = resizeImage(analysis.img, lw, lh)
      }
      const mask = last ? resizeMask(last.mask, W, H, lightImg.width, lightImg.height) : new Uint8Array(lightImg.width * lightImg.height)
      return floorLighting(lightImg, mask, { ...opts, hinv, renderWidth: W })
    },

    status() {
      return { segmenter: segmenterId, info: segmenter?.info || null, hasImage: !!editor, taps: editor?.count || 0, coverage: last?.coverage || 0 }
    },

    /** Line segments (render px) for the debug overlay. */
    lines() { return segments.map(({ x1, y1, x2, y2 }) => [x1, y1, x2, y2]) },

    dispose() {
      segmenter?.dispose()
      segmenter = null
      editor = null
      analysis = null
      last = null
      photoRgb = null
      return { ok: true }
    },
  }
}
