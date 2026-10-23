// VisionSession — one customer's visualisation, start to finish, framework-free:
//   photo → segmenter (worker) → editable mask → floor plane → the block's REAL slabs → floor plan
//   → light → WebGL2 render → before/after → export.
// Every step that can fail has an honest state; a segmenter that fails drops one device tier
// (GPU model → CPU model → no model) and replays the customer's taps, so the screen never dead-ends.
// Every stone region on screen is one real slab (id, block, twin, status — see state.plan); when
// the photographed, available slabs run out, the rest of the floor stays the room's own, and the
// customer is told (counted only with their measurement).
import { VisionClient } from './client.js'
import { VisionRenderer, MAX_SLABS } from './renderer/VisionRenderer.js'
import { createFloorSurface, floorFromQuad, withReferenceLength, withApproximateScale, imageToFloor, floorToImage, SCALE_MODES, DEFAULT_CAMERA_HEIGHT_CM } from './geometry/floor.js'
import { DEFAULT_JOINT_MM } from './layout.js'
import { classifySlabs, orderSlabs, planFloor, sampleFloor, layerSize, fromFrame, slabNumber } from './floorPlan.js'
import { exposureFor } from './lighting.js'
import { photoHeadOfFile, focalPixels } from './exif.js'
import { imageFileToCanvas } from '../../utils/image.js'
import { segmenterForTier, segmenterLicensed, NEXT_TIER, SEGMENTERS, RENDER_MAX_EDGE, ANALYSIS_MAX_EDGE, PHOTO_LIMITS } from './config.js'
import { detectCapabilities, chooseTier, renderEdgeFor } from './capabilities.js'
import { fitLongEdge } from './image.js'

const RUNTIME_FAILURES = new Set(['oom', 'device-lost', 'worker-crash', 'timeout', 'no-webgpu'])
const DEV_VIEWS = ['light', 'layout'] // developer panel only: the room's light, the floor grid
const now = () => (typeof performance !== 'undefined' ? performance.now() : Date.now())
// GPU memory for the slab twins (mipmaps included): budget phones get less, at lower resolution
const SLAB_BUDGET = Object.freeze({ normal: 72 * 1048576, lowMemory: 32 * 1048576 })
const BITMAPS_KEPT = 4 // decoded twins kept for quick re-uploads; the GPU layers hold the rest
const TWIN_MAX_SIDE = 2560 // a twin is decoded no larger than this (a layer never needs more)
const GPU_RESTORE_WAIT_MS = 8000 // a lost WebGL context not back by then: the screen says to reload

const INITIAL = Object.freeze({
  phase: 'starting', // starting | no-webgl | idle | preparing | ready | working | error
  // what the long steps are doing right now (the screen names it; no invented percentages):
  // photo (decoding) · model (the model still downloading — its bytes are real progress) ·
  // analyse (the model reads the room) · floor (a tap) · room (perspective and light) · stone
  stage: null,
  tier: null, tierReasons: [], caps: null, downgrades: [],
  segmenter: null, // { id, variant, info, load }
  photo: null, // { url, width, height, lens, focalPx, focalSource, format, file (the File/Blob shown — the page may keep it) }
  mask: null, // { coverage, bbox, taps }
  surface: null, geometry: null, manualGeometry: false, reference: null,
  stone: null, stoneTexture: null, lighting: null,
  block: null, // { id, code, isLot, source } — the block (or lot) the picked slab belongs to
  siblings: null, // { status: 'loading'|'ready'|'unavailable', total, usable, excluded: [{ slabId, slabCode, status, reason }], orderSource }
  plan: null, // the floor as laid: placements (one per real slab, with identity), coverage, order — see #publishPlan
  view: 'after', turn: false, jointMm: DEFAULT_JOINT_MM, shadeMix: 1, exposureOverride: null,
  // the floor no real slab covers is filled with repeats of the placed slabs (a preview, said so); off =
  // only the real slabs, the rest stays the room's own floor
  fill: true,
  // the customer's optional "stone size" (Adjust appearance) for the estimated scale: 1 = the default
  // estimate, 2 = stone drawn twice as large; a measurement replaces it
  stoneSize: 1,
  // the floor was found without a tap (findFloor): the screen says so, with how to put it right
  autoFound: false,
  timings: {}, warnings: [], error: null, pendingTap: false,
  gpuLost: false, // the WebGL context is gone for now (the preview is being restored)
  modelLoad: null, // { loaded, total } bytes of the model's first download, until it is ready
  decoding: false, // a newly chosen photo is being checked and decoded (the one on screen stays meanwhile)
  taps: [], // the customer's taps as the photo shows them: { label, x, y } — done, running or waiting
  // a first tap found a flat surface that may not be the floor (a bed, a sofa, a table top, a rug):
  // it is shown, nothing is laid, until the customer says it is the floor — { ask: 'RAISED' | 'PARTLY', at }
  // (`at`: that tap's place in the tap log)
  floorCheck: null,
})

/**
 * True scale needs the customer's measurement AND every slab on screen at its recorded size;
 * anything else is approximate.
 */
export const isTrueScale = (st) => st?.surface?.scale?.mode === SCALE_MODES.entered && st?.plan?.exactSizes === true

/**
 * The rest of the floor as repeats of the slabs on screen (the renderer's setFill). Every placed slab of the
 * course depth repeats — not just the picked one — so the floor reads as the block's slabs, not one slab
 * copied: a cell is as long as the SHORTEST of them (each cell crops its slab's own twin, never stretches it)
 * and starts at the picked slab's corner, in line with the real courses. null without placements.
 */
export function fillOf(placements) {
  const a = placements.find((p) => p.featured) || placements[0]
  if (!a) return null
  const depth = a.rect[3] - a.rect[1]
  const rows = placements.flatMap((p, i) => (Math.abs(p.rect[3] - p.rect[1] - depth) <= 1e-3 ? [i] : []))
  const len = Math.min(...rows.map((i) => placements[i].rect[2] - placements[i].rect[0]))
  return { rows, origin: [a.rect[0], a.rect[1]], size: [len, depth] }
}

/**
 * Why a room photo can't be used, or null — from its header before it is decoded (pixel count),
 * then from the decoded working copy's size and shape. Codes are VT.errors keys. (HEIC is tried:
 * Safari decodes it; where the browser can't — Chrome — the decode fails and says PHOTO_HEIC.)
 * @param {{ format?: string, width?: number|null, height?: number|null }} head readPhotoHeader()
 * @param {{ width: number, height: number }|null} [decoded] the working copy (≤ the render edge)
 */
export function photoRefusal(head, decoded = null) {
  if (head?.width * head?.height > PHOTO_LIMITS.maxPixels) return 'PHOTO_TOO_LARGE'
  if (!decoded) return null
  // the photo's own size when its header says (the working copy may have been made smaller)
  const [w, h] = head?.width > 0 && head?.height > 0 ? [head.width, head.height] : [decoded.width, decoded.height]
  const long = Math.max(w, h), short = Math.min(w, h)
  if (long / short > PHOTO_LIMITS.maxAspect) return 'PHOTO_TOO_WIDE'
  if (short < PHOTO_LIMITS.minShortSide || long < PHOTO_LIMITS.minLongSide) return 'PHOTO_TOO_SMALL'
  return null
}

/**
 * A twin as one texture-array layer: resampled to the layer size, long side along u. A portrait
 * twin is turned a quarter turn clockwise — a rotation, never a mirror.
 */
async function layerSource(bitmap, w, h) {
  if (!(bitmap.height > bitmap.width)) return createImageBitmap(bitmap, { resizeWidth: w, resizeHeight: h, resizeQuality: 'high' })
  const c = typeof OffscreenCanvas !== 'undefined' ? new OffscreenCanvas(w, h) : Object.assign(document.createElement('canvas'), { width: w, height: h })
  const ctx = c.getContext('2d')
  ctx.imageSmoothingQuality = 'high'
  ctx.setTransform(0, 1, -1, 0, w, 0) // (x, y) → (w − y, x): clockwise, determinant +1
  ctx.drawImage(bitmap, 0, 0, h, w)
  return c
}

export class VisionSession {
  /**
   * @param {object} p
   * @param {HTMLCanvasElement} p.canvas the WebGL2 canvas the result is drawn on
   * @param {(state) => void} [p.onChange]
   * @param {'A'|'B'|'C'|null} [p.tierOverride] dev only
   * @param {string|null} [p.segmenterOverride] dev only (e.g. 'sam21-gpu')
   * @param {(stone) => Promise<{ block, slabs }>} [p.loadSiblings] every slab of the stone's block
   *   (stones.listBlockSlabs through the page's own, permission-respecting client)
   * @param {boolean} [p.production] a production build (the default there): no unlicensed segmenter
   *   is chosen — an override naming one is dropped — and the worker refuses one anyway (core.init)
   */
  constructor({ canvas, onChange = () => {}, tierOverride = null, segmenterOverride = null, loadSiblings = null, clientFactory = (o) => new VisionClient(o), rendererFactory = (c, o) => new VisionRenderer(c, o), capabilities = detectCapabilities, production = !import.meta.env?.DEV, autoFloor = false }) {
    this.canvas = canvas
    this.onChange = onChange
    this.autoFloor = autoFloor // look for the floor by itself once a photo is read (findFloor)
    this.tierOverride = tierOverride
    this.production = production
    this.overrideRefused = !!segmenterOverride && production && !segmenterLicensed(segmenterOverride)
    this.segmenterOverride = this.overrideRefused ? null : segmenterOverride
    this.loadSiblings = loadSiblings
    this.clientFactory = clientFactory
    this.rendererFactory = rendererFactory
    this.capabilities = capabilities
    this.state = { ...INITIAL }
    this.queue = Promise.resolve()
    this.client = null
    this.renderer = null
    this.photoCanvas = null
    this.segmenterLoaded = false // the model is downloaded and ready (until then a photo waits: stage 'model')
    this.photoGen = 0 // bumped by every photo shown: an older photo's analysis stops mattering
    this.stoneAsk = 0 // bumped by every stone asked for: an older stone still waiting is never laid
    this.photoUrlFor = null // the canvas the compare-view JPEG was made from
    this.tapLog = [] // the customer's taps, replayed after a tier drop
    this.pendingTaps = [] // taps made while the photo was still being prepared
    this.waiting = [] // taps in the session's queue, not done yet
    this.stoneMean = null
    this.disposed = false
    this.listeners = new Set()
    this.slabSet = null // { block, ordered usable slabs, excluded, orderSource }
    this.planRaw = null // planFloor() output for the current floor
    this.planGen = 0 // bumped by every new plan: an older texture sync stops
    this.layerSet = null // { capacity, width, height, layers: Map slabId → layer, loaded: Set slabId }
    this.twinMeta = new Map() // url → { naturalWidth, naturalHeight, meanLin }
    this.bitmaps = new Map() // url → bitmap (the last few, LRU)
    this.failedTwins = new Set() // slab ids whose twin would not load or upload (until the stone is chosen again)
  }

  #set(patch) {
    if (this.disposed) return
    // the preview is gone for good (the browser didn't give the GPU back): no later step may hide that
    if (this.gpuDead && 'error' in patch) patch = { ...patch, error: this.state.error }
    this.state = { ...this.state, ...patch }
    this.onChange(this.state)
    for (const fn of this.listeners) fn(this.state)
  }

  /** Watch the state (the dev panel does); returns the unsubscribe function. */
  subscribe(fn) {
    this.listeners.add(fn)
    fn(this.state)
    return () => this.listeners.delete(fn)
  }

  /** Run one step after the previous one; a failure is recorded, never left unhandled. */
  #serial(fn) {
    const run = this.queue.then(fn, fn)
    this.queue = run.catch(() => {})
    return run
  }

  /** Probe the device, create the renderer, start loading the segmenter. Every later step waits for this. */
  start() {
    return this.#serial(() => this.#start())
  }

  async #start() {
    const caps = await this.capabilities()
    if (this.disposed) return this.state // unmounted meanwhile (React StrictMode does this in dev)
    const { tier, reasons } = chooseTier(caps, this.tierOverride)
    this.#set({ caps, tier, tierReasons: reasons, ...(this.overrideRefused ? { warnings: [...this.state.warnings, 'SEGMENTER_OVERRIDE_REFUSED'] } : {}) })
    if (tier === 'none') { this.#set({ phase: 'no-webgl', error: { code: 'NO_WEBGL2', message: reasons[0] } }); return this.state }
    try {
      this.renderer = this.rendererFactory(this.canvas, {
        onContextLost: () => this.#gpuLost(),
        onContextRestored: () => this.#restoreGpu(),
      })
    } catch (e) {
      this.#set({ phase: 'no-webgl', error: { code: e.code || 'RENDERER_FAILED', message: String(e.detail || e.message) } })
      return this.state
    }
    this.#set({ phase: 'idle' })
    this.segmenterReady = this.#openSegmenter()
    this.segmenterReady.catch(() => {})
    return this.state
  }

  #segmenterFor(tier) {
    if (this.segmenterOverride && SEGMENTERS[this.segmenterOverride]) return this.segmenterOverride
    return segmenterForTier(tier, { production: this.production })
  }

  /** `reload`: fetch the model files past the HTTP cache (a retry after a bad copy). */
  async #openSegmenter(reload = false) {
    for (;;) {
      if (this.disposed) throw Object.assign(new Error('disposed'), { kind: 'disposed' })
      const tier = this.state.tier
      const id = this.#segmenterFor(tier)
      // a new download: no model until it is ready, and no percentage left from one that stopped
      this.segmenterLoaded = false
      this.#set({ modelLoad: null })
      this.client = this.clientFactory({ onEvent: (e) => this.#onEngineEvent(e) })
      try {
        const t0 = now()
        const r = await this.client.initialize(id, reload ? { reload: true } : undefined)
        this.segmenterLoaded = true
        this.#set({ segmenter: { id, variant: r.variant, info: r.info, load: r.load, ms: Math.round(now() - t0) }, modelLoad: null })
        return r
      } catch (err) {
        await this.client.dispose()
        // a file that didn't arrive whole (missing, damaged, the connection gone): the next photo downloads
        // it again, past the HTTP cache — also when this was the download started before any photo
        if (err.kind === 'asset') this.reloadModel = true
        const next = NEXT_TIER[tier]
        // a model file missing or damaged (asset), or a model this build may not run (licence): said
        // plainly — never a quiet drop to a lesser tier (the colour-only one in the end)
        if (!next || this.segmenterOverride || err.kind === 'asset' || err.kind === 'licence') throw Object.assign(err, { kind: err.kind || 'error' })
        this.#set({ tier: next, downgrades: [...this.state.downgrades, { from: tier, to: next, reason: err.kind || 'error', message: String(err.message).slice(0, 160) }] })
      }
    }
  }

  #onEngineEvent(e) {
    if (e.event === 'device-lost') this.gpuLost = true
    // the model's first download (bytes so far / its known size): real progress, shown while a photo waits on it
    if (e.event === 'load' && !this.segmenterLoaded) this.#set({ modelLoad: { loaded: e.loaded, total: e.total } })
  }

  /**
   * The engine failed at runtime: the next tier, with the photo and the taps given to it again.
   * One drop at a time — a second failure meanwhile waits for it instead of starting another engine
   * (two drops at once left a whole worker running). `resend: false` when the failed step was the
   * photo's reading itself: it is retried anyway, and a phone shouldn't read the photo twice.
   */
  #dropTier(reason, message, { resend = true } = {}) {
    this.dropping ||= this.#dropTierNow(reason, message, resend).finally(() => { this.dropping = null })
    return this.dropping
  }

  async #dropTierNow(reason, message, resend) {
    const next = NEXT_TIER[this.state.tier]
    if (!next) throw Object.assign(new Error(message || reason), { kind: reason })
    await this.client?.dispose()
    this.#set({ tier: next, downgrades: [...this.state.downgrades, { from: this.state.tier, to: next, reason, message: String(message || '').slice(0, 160) }] })
    this.gpuLost = false
    this.segmenterReady = this.#openSegmenter()
    await this.segmenterReady
    if (!resend) return
    if (this.photoCanvas) await this.#sendImage()
    for (const t of this.tapLog) await this.#rawTap(t.label, t.x, t.y)
  }

  /**
   * The phone took the GPU back (backgrounded under memory pressure, a driver reset): the screen says
   * the preview is coming back; if the browser doesn't give it back, it says so instead of waiting.
   */
  #gpuLost() {
    clearTimeout(this.gpuTimer)
    this.gpuTimer = setTimeout(() => {
      if (!this.state.gpuLost) return
      // not given back: no more "Bringing the preview back…" — the advice to reload, kept on screen
      // (later steps don't clear it) until the browser does give it back
      this.#set({ gpuLost: false, error: { code: 'GPU_LOST', message: 'the WebGL context was not restored' } })
      this.gpuDead = true
    }, GPU_RESTORE_WAIT_MS)
    this.#set({ gpuLost: true, warnings: [...new Set([...this.state.warnings, 'GPU_CONTEXT_LOST'])] })
  }

  /** Everything on the GPU went with the context: the room, the floor, the light and every slab's twin go back up. */
  #restoreGpu() {
    clearTimeout(this.gpuTimer)
    this.gpuDead = false
    try {
      if (this.photoCanvas) {
        this.renderer.uploadRoom(this.photoCanvas)
        const m = this.client?.getMask()
        if (m) this.renderer.uploadMask(m.alpha, m.width, m.height)
        this.layerSet = null // #applyAll allocates the slab layers again and uploads the twins
        this.#applyAll()
        this.#render()
      }
      this.#set({ gpuLost: false, warnings: this.state.warnings.filter((w) => w !== 'GPU_CONTEXT_LOST'), error: this.state.error?.code === 'GPU_LOST' ? null : this.state.error })
    } catch (err) {
      this.#set({ gpuLost: false, error: { code: 'GPU_LOST', cause: err?.code || null, message: String(err?.message || err) } })
      this.gpuDead = true
    }
  }

  /** A failed step leaves an honest, usable screen (never a stuck "preparing"/"working"). */
  #fail(code, err) {
    this.pendingTaps = []
    this.#syncTaps()
    this.#set({ phase: this.photoCanvas ? 'ready' : 'idle', stage: null, pendingTap: false, error: { code, cause: err?.code || err?.kind || null, message: String(err?.message || err || code) } })
    return this.state
  }

  /** The taps as the photo shows them: done, then running or queued — in order. */
  #syncTaps() {
    this.#set({ taps: [...this.tapLog, ...this.waiting, ...this.pendingTaps].map(({ label, x, y }) => ({ label, x, y })) })
  }

  /**
   * The customer's photo (File/Blob). Resolves when the photo is ready for taps. Only decoding and
   * showing it hold the session's queue: the model's long read of the room runs beside it (#analyse),
   * so the customer can change the stone — or the photo — meanwhile.
   */
  loadPhoto(file) {
    let shown = null
    return this.#serial(async () => {
      shown = await this.#showPhoto(file)
      return this.state
    }).then((st) => shown?.analysis || st)
  }

  /**
   * Decode and show a photo. Returns `{ analysis }` — wrapped, because an async function returning
   * the promise itself would make the queue wait for it (and a tap queued meanwhile would wait
   * for the queue: a deadlock) — or null when the photo is refused.
   */
  async #showPhoto(file) {
    if (!this.renderer) return null // no WebGL2 here: the screen already says so
    // While it is checked and decoded (`decoding`), the photo on screen — and its reading, if it is
    // still being read — goes on as it was: a refused photo changes nothing but the message. (Saving
    // and restoring the phase instead froze the screen when the previous reading ended meanwhile.)
    const refuse = (code, err) => {
      this.#set({ decoding: false, error: { code, cause: err?.code || err?.kind || null, message: String(err?.message || err || code) } })
      return null
    }
    this.#set({ decoding: true, error: null })
    const t0 = now()
    // what the file is, before decoding it: a format this browser can't open, or more pixels than
    // a phone can hold, is answered at once
    const head = await photoHeadOfFile(file)
    const early = photoRefusal(head)
    if (early) return refuse(early)
    const edge = renderEdgeFor(this.state.caps || {}, RENDER_MAX_EDGE)
    let canvas
    try {
      // decoded upright (EXIF), straight onto a CPU canvas: its pixels are read back
      canvas = await imageFileToCanvas(file, edge, { willReadFrequently: true })
    } catch (err) {
      // a HEIC this browser can't open (Chrome) is said as such, not as "unreadable"
      return refuse(head.format === 'heic' ? 'PHOTO_HEIC' : head.width * head.height > PHOTO_LIMITS.largePixels ? 'PHOTO_TOO_LARGE' : 'PHOTO_UNREADABLE', err)
    }
    const late = photoRefusal(head, canvas)
    if (late) return refuse(late)
    const tDecoded = now()
    const gen = ++this.photoGen
    this.photoCanvas = canvas
    this.lightField = null
    this.tapLog = []
    this.pendingTaps = [] // taps on the previous photo, if it was still being read
    if (this.state.photo?.url) URL.revokeObjectURL(this.state.photo.url)
    const focalPx = focalPixels(head.lens.focal35, canvas.width, canvas.height)
    this.renderer.uploadRoom(canvas) // ≤ RENDER_MAX_EDGE, always inside WebGL2's 2048 minimum
    this.renderer.clearMask()
    this.planRaw = null // a new room: the floor plan waits for its floor (the slabs' layers stay)
    this.planGen++
    this.renderer.setPlacements([])
    this.renderer.render('before')
    this.#set({
      // this photo is now the one being read: 'model' while the floor finder still downloads
      phase: 'preparing', stage: this.segmenterLoaded ? 'analyse' : 'model', decoding: false,
      // url: the compare view's picture of this photo, made while the model works (#photoUrl)
      photo: { url: null, width: canvas.width, height: canvas.height, lens: head.lens, focalPx, focalSource: focalPx ? 'exif' : 'default', format: head.format, file },
      mask: null, surface: null, geometry: null, manualGeometry: false, reference: null, plan: null, lighting: null, pendingTap: false, floorCheck: null,
      stoneSize: 1, autoFound: false, // another room, another estimate
      view: this.state.stone ? 'after' : 'selection',
      timings: { ...this.state.timings, photoDecodeMs: Math.round(tDecoded - t0), photoShownMs: Math.round(now() - t0) },
    })
    this.#syncTaps()
    return { analysis: this.#analyse(gen, t0) }
  }

  /**
   * The model reads the photo (the long step), then the taps made meanwhile run in order. The engine
   * reads one photo at a time, in order (vision.worker.js): a newer photo's reading starts when the
   * previous one is over, and the previous one's result is then dropped.
   */
  async #analyse(gen, t0) {
    const current = () => gen === this.photoGen && !this.disposed // a newer photo makes this one moot
    if (this.reloadModel) { // the last download failed (its checks, the connection): this photo fetches the files afresh
      this.reloadModel = false
      this.segmenterReady = this.#openSegmenter(true)
      this.segmenterReady.catch(() => {})
    }
    try {
      await this.segmenterReady
    } catch (err) {
      if (!current()) return this.state
      this.pendingTaps = []
      this.#syncTaps()
      // (an asset error has already marked the next photo to download again: #openSegmenter)
      const code = err.kind === 'asset' ? 'MODEL_UNAVAILABLE' : 'SEGMENTER_UNAVAILABLE'
      this.#set({ phase: 'error', stage: null, pendingTap: false, error: { code, cause: err.code || err.kind || null, message: String(err.message) } })
      return this.state
    }
    if (!current()) return this.state
    this.#set({ stage: 'analyse' })
    try {
      // a reading nobody looks at any more never drops the engine to a lower tier (that stopped the
      // engine under the newer photo's own reading, which then never ended)
      await this.#withRecovery(() => (current() ? this.#sendImage() : null), { wanted: current, resend: false })
    } catch (err) {
      return current() ? this.#fail('PHOTO_FAILED', err) : this.state
    }
    if (!current()) return this.state
    this.#set({ phase: 'ready', stage: null, pendingTap: false, timings: { ...this.state.timings, photoMs: Math.round(now() - t0) } })
    const queued = this.pendingTaps
    this.pendingTaps = []
    // all into the queue at once (they still run in order): their marks stay on the photo meanwhile
    await Promise.all(queued.map((p) => this.tap(p.label, p.x, p.y)))
    // nobody tapped yet: try to find the floor without a tap
    if (!queued.length && this.autoFloor) await this.findFloor()
    return this.state
  }

  async #sendImage() {
    const c = this.photoCanvas
    const t0 = now()
    const ctx = c.getContext('2d', { willReadFrequently: true })
    const guide = ctx.getImageData(0, 0, c.width, c.height)
    const { width: aw, height: ah } = fitLongEdge(c.width, c.height, ANALYSIS_MAX_EDGE)
    let analysis = guide
    if (aw !== c.width) {
      const a = document.createElement('canvas')
      a.width = aw
      a.height = ah
      const actx = a.getContext('2d', { willReadFrequently: true })
      actx.imageSmoothingQuality = 'high'
      actx.drawImage(c, 0, 0, aw, ah)
      analysis = actx.getImageData(0, 0, aw, ah)
    }
    const t1 = now()
    const sent = this.client.setImage({ width: analysis.width, height: analysis.height, data: analysis.data }, { width: guide.width, height: guide.height, data: guide.data })
    this.#photoUrl(c) // while the worker encodes: nothing waits for this JPEG
    const r = await sent
    if (c !== this.photoCanvas) return // a newer photo is on screen; its own numbers will come
    const ms = (v) => (v != null ? Math.round(v) : null)
    this.#set({
      timings: {
        ...this.state.timings, sendMs: Math.round(t1 - t0), setImageMs: Math.round(now() - t1),
        preprocessMs: ms(r.preprocessMs), encodeMs: ms(r.encodeMs), linesMs: ms(r.linesMs), lines: r.lineCount,
      },
    })
  }

  /** The photo as a JPEG URL for the Original | Visualized view — once per photo, never awaited. */
  #photoUrl(canvas) {
    if (this.photoUrlFor === canvas) return // a tier drop sends the same photo again
    this.photoUrlFor = canvas
    canvas.toBlob((b) => {
      if (!b) return
      const url = URL.createObjectURL(b)
      if (this.disposed || this.photoCanvas !== canvas || !this.state.photo) { URL.revokeObjectURL(url); return }
      this.#set({ photo: { ...this.state.photo, url } })
    }, 'image/jpeg', 0.9)
  }

  /**
   * Run an engine step; when the engine fails at runtime, drop a tier and try again. `wanted`: is the
   * step still wanted (a stale photo's reading is not worth a tier); `resend`: see #dropTier.
   */
  async #withRecovery(fn, { wanted = () => true, resend = true } = {}) {
    for (;;) {
      try {
        if (this.gpuLost) await this.#dropTier('device-lost', 'the GPU was lost', { resend })
        return await fn()
      } catch (err) {
        if (!wanted() || !RUNTIME_FAILURES.has(err.kind) || !NEXT_TIER[this.state.tier] || this.segmenterOverride) throw err
        await this.#dropTier(err.kind, err.message, { resend })
      }
    }
  }

  /** A tap on the photo in render pixels. `label`: 'pos' adds, 'neg' removes. */
  tap(label, x, y) {
    const t = { label, x, y, gen: this.photoGen } // made on the photo on screen now
    if (this.state.phase === 'preparing') {
      // the photo is still being prepared: keep the taps and run them, in order, as soon as it can
      this.pendingTaps.push(t)
      this.#set({ pendingTap: true })
      this.#syncTaps()
      return Promise.resolve(this.state)
    }
    this.waiting.push(t)
    this.#syncTaps()
    return this.#serial(() => this.#tapStep(t))
  }

  async #tapStep(t) {
    try {
      // a tap made on a photo that has been replaced since is dropped — never run on the new photo
      if (!this.photoCanvas || t.gen !== this.photoGen) return this.state
      this.#set({ phase: 'working', stage: t.label === 'neg' ? 'remove' : 'floor', error: null })
      let replaced = null // the marked area this tap replaces (its question and taps), until this tap is done
      try {
        const t0 = now()
        // an "add" while the customer is asked whether the marked area is the floor answers "no":
        // that area goes and this tap takes its place
        if (t.label === 'pos' && this.state.floorCheck) {
          replaced = { check: this.state.floorCheck, taps: this.tapLog.slice(this.state.floorCheck.at) }
          await this.#dropSince(replaced.check.at)
        }
        const r = await this.#withRecovery(() => this.#rawTap(t.label, t.x, t.y))
        this.tapLog.push(t)
        replaced = null // this tap now holds the place: a later failure doesn't bring the old area back over it
        if (r?.ask) this.#set({ floorCheck: { ask: r.ask, at: this.tapLog.length - 1 } })
        await this.#afterMaskChange({ tapMs: Math.round(now() - t0) })
      } catch (err) {
        // the replacing tap was refused (a wall, a chair) or failed: the marked area comes back, still asked about
        const kept = replaced ? await this.#putBack(replaced) : false
        if (replaced) await this.#afterMaskChange({}).catch(() => {})
        this.#set({ phase: 'ready', stage: null, error: { code: err.code || err.kind || 'TAP_FAILED', message: String(err.message), ...(kept ? { kept: true } : {}) } })
      }
      return this.state
    } finally {
      const k = this.waiting.indexOf(t)
      if (k >= 0) this.waiting.splice(k, 1)
      this.#syncTaps()
    }
  }

  /**
   * The floor without a tap: one try where photos show the floor (the bottom centre — the same spot as
   * "Select the floor at the bottom of the photo"), kept only if the engine lays it without a question.
   * Unsure (it would ask "Is this the floor?") or refused (a rug, a chair): nothing is marked and nothing
   * is said — the screen asks for a tap as before. Never runs over a tap the customer made.
   */
  findFloor() {
    const gen = this.photoGen
    return this.#serial(async () => {
      const photo = this.state.photo
      if (!this.photoCanvas || !photo || gen !== this.photoGen || this.tapLog.length || this.waiting.length || this.state.phase !== 'ready') return this.state
      const t = { label: 'pos', x: 0.5 * photo.width, y: 0.9 * photo.height, gen }
      this.#set({ phase: 'working', stage: 'floor', error: null })
      try {
        const t0 = now()
        const r = await this.#withRecovery(() => this.#rawTap(t.label, t.x, t.y))
        if (r?.ask) {
          await this.client.undo() // not sure it is the floor: leave the choice to the customer
          this.#set({ phase: 'ready', stage: null })
          return this.state
        }
        this.tapLog.push(t)
        this.#syncTaps()
        this.#set({ autoFound: true })
        await this.#afterMaskChange({ tapMs: Math.round(now() - t0) })
      } catch {
        this.#set({ phase: 'ready', stage: null })
      }
      return this.state
    })
  }

  /** Take back every tap from the tap log's index `at` on (an area the customer said isn't the floor). */
  async #dropSince(at) {
    while (this.tapLog.length > at) {
      await this.client.undo()
      this.tapLog.pop()
    }
    this.#set({ floorCheck: null })
  }

  /**
   * A tap meant to replace the marked area failed: the area's own taps run again (the same photo, the
   * same engine: the same area) and its question with them — the customer still decides about it.
   * If that fails too, nothing is left half put back (it would be laid unasked): all of it goes.
   */
  async #putBack({ check, taps }) {
    try {
      for (const p of taps) {
        await this.#rawTap(p.label, p.x, p.y)
        this.tapLog.push(p)
      }
      this.#set({ floorCheck: check })
      return true
    } catch {
      await this.#dropSince(check.at).catch(() => {})
      return false
    }
  }

  /** The customer says the marked area IS the floor: the stone is laid on it. */
  confirmFloor() {
    return this.#serial(async () => {
      if (!this.state.floorCheck) return this.state
      this.#set({ floorCheck: null, error: null })
      this.#applyAll()
      if (!DEV_VIEWS.includes(this.state.view)) this.#set({ view: this.state.stone ? 'after' : 'selection' })
      this.#render()
      return this.state
    })
  }

  /** The customer says it isn't the floor: the marked area goes, and they tap the floor instead. */
  rejectFloor() {
    return this.#serial(async () => {
      const check = this.state.floorCheck
      if (!check) return this.state
      this.#set({ phase: 'working', stage: 'room', error: null })
      try {
        await this.#dropSince(check.at)
        await this.#afterMaskChange({})
      } catch (err) {
        return this.#fail('UNDO_FAILED', err)
      } finally {
        this.#syncTaps()
      }
      return this.state
    })
  }

  async #rawTap(label, x, y) {
    const r = label === 'neg' ? await this.client.addNegativeTap({ x, y }) : await this.client.addPositiveTap({ x, y })
    this.lastTap = r
    if (r.timing) {
      const t = r.timing
      this.#set({ timings: { ...this.state.timings, decodeMs: Math.round(t.decodeMs), regionMs: Math.round(t.regionMs), cleanupMs: Math.round(t.cleanupMs) } })
    }
    return r
  }

  undo() {
    return this.#serial(async () => {
      if (!this.tapLog.length) return this.state
      this.#set({ phase: 'working', stage: 'room', error: null })
      try {
        await this.client.undo()
        this.tapLog.pop()
        // the tap the customer was asked about is gone: so is the question
        if (this.state.floorCheck && this.tapLog.length <= this.state.floorCheck.at) this.#set({ floorCheck: null })
        if (!this.tapLog.length) this.#set({ autoFound: false }) // the floor found by itself is gone too
        await this.#afterMaskChange({})
      } catch (err) {
        return this.#fail('UNDO_FAILED', err)
      } finally {
        this.#syncTaps()
      }
      return this.state
    })
  }

  reset() {
    return this.#serial(async () => {
      if (!this.photoCanvas) return this.state
      this.#set({ phase: 'working', stage: 'room', error: null })
      try {
        await this.client.reset()
        this.tapLog = []
        this.#set({ geometry: null, surface: this.state.manualGeometry ? this.state.surface : null, lighting: null, floorCheck: null, autoFound: false })
        await this.#afterMaskChange({})
      } catch (err) {
        return this.#fail('RESET_FAILED', err)
      } finally {
        this.#syncTaps()
      }
      return this.state
    })
  }

  async #afterMaskChange(timing) {
    const m = this.client.getMask()
    this.renderer.uploadMask(m.alpha, m.width, m.height)
    const mask = { coverage: m.coverage, bbox: m.bbox, taps: m.taps, choice: this.lastTap?.choice || null }
    this.#set({ mask, stage: m.coverage > 0 ? 'room' : null })
    if (m.coverage > 0) {
      const tg = now()
      if (!this.state.manualGeometry) {
        const est = await this.client.estimateGeometry({ focalPx: this.state.photo.focalPx, focalSource: this.state.photo.focalSource })
        const surface = this.#withReference(createFloorSurface({
          width: this.photoCanvas.width, height: this.photoCanvas.height, focalPx: est.focalPx, focalSource: est.focalSource,
          pitch: est.pitch, roll: est.roll, yaw: est.yaw, source: est.source, confidence: est.confidence,
          warnings: est.source === 'default' ? ['PERSPECTIVE_ESTIMATED'] : [], details: { reason: est.reason || null, vps: est.vps, inliers: est.inlierCount, lines: est.lineCount },
        }))
        this.#set({ surface, geometry: est })
      }
      const tl = now()
      const light = await this.client.computeLighting({ hinv: this.state.surface?.Hinv || null })
      this.#set({ lighting: { ...light, field: undefined }, timings: { ...this.state.timings, ...timing, geometryMs: Math.round(tl - tg), lightingMs: Math.round(now() - tl) } })
      this.lightField = light
    } else {
      this.lightField = null
      this.#set({ lighting: null, timings: { ...this.state.timings, ...timing } })
    }
    this.#applyAll()
    const devView = DEV_VIEWS.includes(this.state.view) // the developer panel's view stays put
    // while the customer is asked whether it is the floor, the marked area is shown — not laid
    this.#set({ phase: 'ready', stage: null, view: devView ? this.state.view : this.state.stone && m.coverage > 0 && !this.state.floorCheck ? 'after' : 'selection' })
    this.#render()
  }

  /** The customer's measurement if there is one, else their stone size on the estimated scale. */
  #withReference(surface) {
    const ref = this.state.reference
    if (!ref) return this.state.stoneSize === 1 ? surface : withApproximateScale(surface, DEFAULT_CAMERA_HEIGHT_CM / this.state.stoneSize)
    try { return withReferenceLength(surface, ref.p1, ref.p2, ref.lengthCm) } catch { return surface }
  }

  /** Push surface, light and the floor plan (the block's real slabs) into the renderer. */
  #applyAll() {
    const { surface } = this.state
    const r = this.renderer
    if (!r) return
    if (this.lightField) {
      const exposure = this.state.exposureOverride ?? (this.stoneMean != null ? exposureFor(this.lightField.meanLin, this.stoneMean) : 1)
      r.setShading({ field: this.lightField.field, width: this.lightField.fw, height: this.lightField.fh, exposure, shadeMix: this.state.shadeMix })
      this.#set({ lighting: { ...(this.state.lighting || {}), exposure } })
    }
    if (!surface || !this.state.stone || !this.slabSet) return
    const m = this.client?.getMask()
    if (!m || !(m.coverage > 0) || this.state.floorCheck) { // nothing laid until the customer says it is the floor
      this.planRaw = null
      this.planGen++
      r.setPlacements([])
      this.#set({ plan: null })
      return
    }
    // the layout frame: centred on the floor point in front of the camera, along the room
    const front = imageToFloor(surface, surface.width / 2, 0.8 * surface.height) || imageToFloor(surface, surface.width / 2, surface.height - 1) || [0, 150]
    const angle = -(surface.yaw || 0) + (this.state.turn ? Math.PI / 2 : 0)
    const frame = { origin: front, angle, cos: Math.cos(angle), sin: Math.sin(angle) }
    const floor = sampleFloor(surface, m.alpha, m.width, m.height, frame, { step: 6 })
    let plan = null
    try {
      plan = planFloor({ slabs: this.slabSet.ordered, featuredId: this.state.stone.slabId, floor, maxSlabs: MAX_SLABS })
    } catch (err) {
      // a slab shape no plan can use (e.g. a twin far from a slab's proportions): say so, draw nothing wrong
      this.#set({ error: { code: 'PLAN_FAILED', cause: err.code || null, message: String(err.message) } })
    }
    this.planRaw = plan ? { ...plan, frame } : null
    this.planGen++
    r.setGeometry({ hinv: surface.Hinv })
    r.setFrame({ origin: frame.origin, cos: frame.cos, sin: frame.sin, jointCm: this.state.jointMm / 10 })
    if (!plan) { r.setPlacements([]); this.#set({ plan: null }); return }
    this.#assignLayers(plan.placements.filter((p) => p.inView))
    this.#bindPlacements()
    this.#publishPlan()
    this.#syncTextures(this.planGen).catch((err) => this.#set({ error: { code: 'SLABS_FAILED', cause: err?.code || null, message: String(err?.message || err) } }))
  }

  /** The twins' shapes the GPU layers are sized for (decoded ones first, then the records). */
  #twinShape(p) {
    const m = p.twinUrl && this.twinMeta.get(p.twinUrl)
    if (m) return [m.naturalWidth, m.naturalHeight]
    return [Math.max(1, p.longCm), Math.max(1, p.shortCm)]
  }

  /** A texture layer for every slab on screen: kept when it is already there, else freed or reallocated. */
  #assignLayers(vis) {
    const r = this.renderer
    const ids = vis.map((p) => p.slabId)
    let L = this.layerSet
    if (L) {
      const missing = ids.filter((id) => !L.layers.has(id))
      const used = new Set(L.layers.values())
      const free = []
      for (let k = 0; k < L.capacity; k++) if (!used.has(k)) free.push(k)
      const stale = [...L.layers.entries()].filter(([id]) => !ids.includes(id))
      if (missing.length > free.length + stale.length) L = null
      else {
        for (const id of missing) {
          let k = free.shift()
          if (k === undefined) {
            const [old, kk] = stale.shift()
            L.layers.delete(old)
            L.loaded.delete(old)
            r.releaseSlabLayer(kk)
            k = kk
          }
          L.layers.set(id, k)
        }
      }
    }
    if (!L) {
      const capacity = Math.min(MAX_SLABS, Math.max(ids.length, Math.ceil(ids.length / 4) * 4))
      const budget = renderEdgeFor(this.state.caps || {}, RENDER_MAX_EDGE) < RENDER_MAX_EDGE.normal ? SLAB_BUDGET.lowMemory : SLAB_BUDGET.normal
      const size = layerSize(vis.map((p) => this.#twinShape(p)), { maxTexture: r.maxTextureSize || 4096, budgetBytes: budget * (ids.length / capacity) })
      r.allocateSlabLayers(capacity, size.width, size.height)
      L = { capacity, width: size.width, height: size.height, layers: new Map(ids.map((id, k) => [id, k])), loaded: new Set() }
    }
    this.layerSet = L
  }

  /** The renderer's table: each slab on screen with its own layer (grey until its twin is uploaded). */
  #bindPlacements() {
    const L = this.layerSet
    const vis = (this.planRaw?.placements || []).filter((p) => p.inView && L?.layers.has(p.slabId))
    this.renderer.setPlacements(vis.map((p) => ({ slabId: p.slabId, rect: p.rect, uv: p.uv, layer: L.layers.get(p.slabId) })))
    this.renderer.setFill(this.state.fill ? fillOf(vis) : null)
  }

  /** The plan as the screen and the dev panel see it: one row per real slab, with its identity. */
  #publishPlan() {
    const p = this.planRaw
    if (!p) { this.#set({ plan: null }); return }
    const L = this.layerSet, surface = this.state.surface
    const placements = p.placements.filter((q) => q.inView).map((q) => {
      const P = fromFrame(p.frame, (q.rect[0] + q.rect[2]) / 2, (q.rect[1] + q.rect[3]) / 2)
      const c = surface ? floorToImage(surface, P[0], P[1]) : null
      const onImage = c && c[0] >= 0 && c[1] >= 0 && c[0] < surface.width && c[1] < surface.height
      return { ...q, layer: L?.layers.get(q.slabId) ?? -1, loaded: !!L?.loaded.has(q.slabId), failed: this.failedTwins.has(q.slabId), imageCentre: onImage ? [Math.round(c[0]), Math.round(c[1])] : null }
    })
    const warnings = new Set(this.state.warnings.filter((w) => !w.startsWith('SLAB_SIZE_')))
    if (placements.some((q) => q.mismatch != null && q.mismatch > 0.08)) warnings.add('SLAB_SIZE_MISMATCH')
    if (placements.some((q) => q.sizeSource === 'approximate')) warnings.add('SLAB_SIZE_UNKNOWN')
    this.#set({
      plan: {
        frame: { origin: p.frame.origin, angle: p.frame.angle }, depthCm: Math.round(p.depthCm * 10) / 10,
        orderSource: this.slabSet?.orderSource || null, exactSizes: p.exactSizes,
        scale: surface?.scale?.mode === SCALE_MODES.entered && p.exactSizes ? 'entered' : 'approximate',
        coverage: p.coverage, placements, phantoms: p.phantoms.length, loaded: placements.filter((q) => q.loaded).length,
        // floor the real slabs don't reach is drawn as their repeats (the screen says it is a preview)
        // (a sliver under 1% of the floor isn't worth the words: "repeats" is said only when they show)
        filled: !!this.state.fill && placements.length > 0 && (p.coverage.missing > 0 || p.coverage.beyond > 0 || p.coverage.uncoveredCm2 > 0.01 * p.coverage.floorCm2),
        loading: placements.filter((q) => !q.loaded && !q.failed).length, // still coming (a failed twin isn't)
        layer: L ? { capacity: L.capacity, width: L.width, height: L.height } : null,
      },
      warnings: [...warnings],
    })
  }

  /** A twin, decoded (the last few kept; the GPU layers hold the rest). */
  async #twin(url, maxSide) {
    const hit = this.bitmaps.get(url)
    if (hit && hit.maxSide >= maxSide) { this.bitmaps.delete(url); this.bitmaps.set(url, hit); return hit }
    const img = await this.loadImage(url, { maxSide })
    this.twinMeta.set(url, { naturalWidth: img.naturalWidth, naturalHeight: img.naturalHeight, meanLin: img.meanLin })
    if (hit) hit.bitmap?.close?.()
    this.bitmaps.delete(url)
    this.bitmaps.set(url, { ...img, maxSide })
    while (this.bitmaps.size > BITMAPS_KEPT) {
      const [oldUrl, old] = this.bitmaps.entries().next().value
      this.bitmaps.delete(oldUrl)
      old.bitmap?.close?.()
    }
    return img
  }

  /**
   * Load and upload the twins the current plan shows, nearest the eye first, one slab at a time
   * (each appears as soon as its own twin is on the GPU). A newer plan stops this one.
   */
  async #syncTextures(gen) {
    const L = this.layerSet, plan = this.planRaw
    if (!L || !plan) return
    const mid = (q) => Math.abs((q.rect[0] + q.rect[2]) / 2)
    const todo = plan.placements.filter((q) => q.inView && !L.loaded.has(q.slabId))
      .sort((a, b) => (b.featured - a.featured) || Math.abs(a.course) - Math.abs(b.course) || mid(a) - mid(b))
    let reshaped = false
    for (const q of todo) {
      const stale = () => gen !== this.planGen || this.layerSet !== L || this.disposed
      let img
      try {
        img = await this.#twin(q.twinUrl, Math.max(L.width, L.height))
      } catch (err) {
        if (stale()) return
        this.#twinFailed(q, err)
        continue
      }
      if (stale()) return
      const k = L.layers.get(q.slabId)
      if (k === undefined) continue
      let src
      try {
        src = await layerSource(img.bitmap, L.width, L.height)
      } catch {
        continue // the bitmap was released by a newer sync; that one uploads it
      }
      if (stale()) { src.close?.(); return }
      try {
        this.renderer.uploadSlabLayer(k, src)
      } catch (err) {
        src.close?.()
        if (this.renderer.lost) return // the context's restore uploads every twin again
        this.#twinFailed(q, err) // never grey "loading" for ever: the slab leaves the plan, with the reason
        continue
      }
      src.close?.()
      L.loaded.add(q.slabId)
      // the twin's real shape is known now (the catalogue doesn't list it): re-plan if it differs
      const slab = this.slabSet?.ordered.find((s) => s.slabId === q.slabId)
      if (slab) {
        const was = slab.twin?.size
        const shape = [img.naturalWidth, img.naturalHeight]
        if (!was || Math.abs(was[0] / was[1] - shape[0] / shape[1]) > 0.005) { slab.twin = { ...slab.twin, size: shape }; reshaped = true }
      }
      this.#bindPlacements()
      this.#publishPlan()
      this.#render()
    }
    if (reshaped && gen === this.planGen && !this.disposed) {
      this.#applyAll()
      this.#render()
    }
  }

  /** A sibling's twin that won't load: it leaves the plan (never drawn from another slab's picture). */
  #twinFailed(q, err) {
    if (!this.slabSet) return
    const slab = this.slabSet.ordered.find((s) => s.slabId === q.slabId)
    if (!slab) return
    // the picked slab itself: said on screen (it is never swapped for another slab's picture), and no
    // longer counted as still loading
    if (q.featured) {
      this.failedTwins.add(q.slabId)
      this.#set({ error: { code: 'STONE_IMAGE_FAILED', message: String(err?.message || err) } })
      this.#publishPlan()
      return
    }
    this.slabSet.ordered = this.slabSet.ordered.filter((s) => s !== slab)
    this.slabSet.excluded.push({ slab, reason: 'twin-failed' })
    this.#set({ siblings: { ...this.state.siblings, usable: this.slabSet.ordered.length, excluded: this.#excludedView(), lastError: String(err?.message || err) } })
    this.#applyAll()
    this.#render()
  }

  #excludedView() {
    return (this.slabSet?.excluded || []).map(({ slab, reason }) => ({ slabId: slab.slabId, slabCode: slab.slabCode || null, status: slab.status || null, reason }))
  }

  /** The block's slabs, sorted and sifted: what can be laid, what can't (and why). */
  #useSiblings(stone, img, fetched, err) {
    const asSlab = {
      slabId: stone.slabId, slabCode: stone.slabCode || null, slabNo: stone.slabNo ?? slabNumber(stone.slabCode), blockId: stone.blockId || null,
      lengthFt: stone.lengthFt, widthFt: stone.widthFt, thicknessIn: stone.thicknessIn, finish: stone.finish, grade: stone.grade,
      status: stone.availability || 'unknown', cutAt: null, bundleId: null, twin: null,
    }
    const listed = (fetched?.slabs || []).find((s) => s.slabId === stone.slabId)
    const featured = { ...(listed || asSlab), twin: { ...(listed?.twin || {}), id: listed?.twin?.id ?? stone.twinId ?? null, url: stone.twinUrl, size: [img.naturalWidth, img.naturalHeight] } }
    const all = (fetched?.slabs || []).map((s) => (s.slabId === featured.slabId ? featured : { ...s, twin: s.twin ? { ...s.twin } : null }))
    if (!all.some((s) => s.slabId === featured.slabId)) all.push(featured)
    // shapes of twins decoded earlier beat the database's numbers
    for (const s of all) {
      const m = s.twin?.url && this.twinMeta.get(s.twin.url)
      if (m) s.twin.size = [m.naturalWidth, m.naturalHeight]
    }
    const { usable, excluded } = classifySlabs(all, featured.slabId)
    const { ordered, source } = orderSlabs(usable)
    const block = fetched?.block || { id: stone.blockId || null, code: stone.blockCode || (stone.slabCode || '').replace(/-S\d+$/, '') || null, isLot: stone.isLot ?? null, source: stone.source || null }
    this.slabSet = { block, ordered, excluded, orderSource: source }
    this.#set({
      block,
      siblings: { status: fetched ? 'ready' : 'unavailable', total: all.length, usable: usable.length, excluded: this.#excludedView(), orderSource: source, error: err ? String(err.message || err) : null },
    })
  }

  #render() {
    if (!this.renderer) return
    const t0 = now()
    const v = this.state.view
    this.renderer.render(v === 'before' || DEV_VIEWS.includes(v) ? v : v === 'selection' || !this.state.stone ? 'selection' : 'after')
    this.#set({ timings: { ...this.state.timings, renderMs: Math.round((now() - t0) * 10) / 10 } })
  }

  /**
   * Choose the actual stone: the slab the customer picked (a VisionStone with its twin). Its block's
   * other real slabs are fetched through `loadSiblings` and laid next to it.
   */
  setStone(stone, loadImage) {
    // Each stone asked for supersedes the ones still waiting their turn: a quick A → B → C lays C, and the floor never
    // trails the label through A and B (each would download its photo and its block's slabs first)
    const ask = ++this.stoneAsk
    return this.#serial(async () => {
      if (ask !== this.stoneAsk) return this.state
      if (!this.renderer) return this.state // no WebGL2: the True Colour card still shows the stone
      this.loadImage = loadImage
      this.failedTwins.clear() // choosing the stone (again) tries every twin again
      // the floor finder didn't start or download (phase 'error'): that stays said — with its way to try again — while the
      // stone changes; nothing about the stone may hide it
      const finderFailed = this.state.phase === 'error'
      // while the model is still reading the photo, the screen keeps saying so (that step decides
      // when taps can run); the stone loads meanwhile
      const settle = () => {
        if (finderFailed) return
        if (this.state.phase !== 'preparing') this.#set({ stage: null, phase: this.photoCanvas ? 'ready' : this.state.phase === 'working' ? 'idle' : this.state.phase })
      }
      if (!finderFailed) {
        if (this.state.phase !== 'preparing') this.#set({ phase: this.photoCanvas ? 'working' : this.state.phase, stage: 'stone' })
        this.#set({ error: null })
      }
      let img
      try {
        img = await this.#twin(stone.twinUrl, TWIN_MAX_SIDE)
      } catch (err) {
        // (a newer stone asked for meanwhile: its turn — this one's failure no longer matters)
        // `slabId`: whose photo didn't load — the floor still shows the stone before it, and the page says so
        if (ask === this.stoneAsk && !finderFailed) this.#set({ error: { code: 'STONE_IMAGE_FAILED', slabId: stone.slabId, message: String(err.message) } })
        settle()
        return this.state
      }
      if (ask !== this.stoneAsk) { settle(); return this.state } // superseded while its photo loaded: nothing touched
      if (this.slabSet?.block?.id !== stone.blockId) {
        // another block: its slabs' layers go (same block, other slab picked: they stay)
        this.renderer.clearSlabs()
        this.layerSet = null
      }
      this.stoneMean = img.meanLin
      this.#set({
        stone, stoneTexture: { width: img.width, height: img.height, naturalWidth: img.naturalWidth, naturalHeight: img.naturalHeight, resampled: img.resampled, meanLin: img.meanLin },
        siblings: { status: 'loading' },
      })
      let fetched = null, sibErr = null
      if (this.loadSiblings) {
        try { fetched = await this.loadSiblings(stone) } catch (err) { sibErr = err }
      }
      if (this.disposed) return this.state
      if (ask !== this.stoneAsk) { settle(); return this.state } // superseded while its slabs were asked for: the newer one lays
      this.#useSiblings(stone, img, fetched, sibErr)
      this.#applyAll()
      // (while the customer is asked whether the marked area is the floor, it stays shown as marked)
      if (this.state.mask?.coverage > 0 && !this.state.floorCheck) this.#set({ view: 'after' })
      this.#render()
      settle()
      return this.state
    })
  }

  /** The customer's own measurement: two floor points and the real distance between them. */
  setReferenceLength(p1, p2, lengthCm) {
    return this.#serial(async () => {
      try {
        if (!this.state.surface) throw new Error('NO_FLOOR_YET')
        this.#set({ surface: withReferenceLength(this.state.surface, p1, p2, lengthCm), reference: { p1, p2, lengthCm }, error: null })
      } catch (err) {
        // a point above the floor's horizon, a zero/absurd length…: say so, keep the old scale
        this.#set({ error: { code: 'MEASURE_FAILED', cause: err.message, message: String(err.message) } })
        return this.state
      }
      this.#applyAll()
      this.#render()
      return this.state
    })
  }

  clearReference() {
    return this.#serial(async () => {
      this.#set({ reference: null })
      if (this.state.surface) {
        this.#set({ surface: withApproximateScale(this.state.surface, DEFAULT_CAMERA_HEIGHT_CM / this.state.stoneSize) })
        this.#applyAll()
        this.#render()
      }
      return this.state
    })
  }

  /**
   * Adjust appearance → stone size on the estimated scale (0.5–2, 1 = the estimate). Never needed for a
   * picture; ignored once the customer has measured (the measurement is the scale).
   */
  setStoneSize(k) {
    return this.#serial(async () => {
      const stoneSize = Math.min(2, Math.max(0.5, Number(k) || 1))
      this.#set({ stoneSize })
      if (this.state.surface && !this.state.reference) {
        this.#set({ surface: withApproximateScale(this.state.surface, DEFAULT_CAMERA_HEIGHT_CM / stoneSize) })
        this.#applyAll()
        this.#render()
      }
      return this.state
    })
  }

  /** Adjust appearance → fill the whole floor with repeats of the real slabs (on), or only the real slabs. */
  setFill(on) {
    this.#set({ fill: !!on })
    this.#applyAll()
    this.#render()
  }

  /** Dev: a hand-placed perspective quad (any rectangle on the floor), or null to go back to automatic. */
  setPerspectiveQuad(quad) {
    return this.#serial(async () => {
      if (!this.photoCanvas) return this.state
      if (!quad) {
        this.#set({ manualGeometry: false, surface: null, geometry: null })
        if (this.state.mask?.coverage > 0) await this.#afterMaskChange({})
        return this.state
      }
      const surface = this.#withReference(floorFromQuad(quad, { width: this.photoCanvas.width, height: this.photoCanvas.height, focalPx: this.state.photo?.focalPx, yaw: 0 }))
      this.#set({ surface, manualGeometry: true })
      this.#applyAll()
      this.#render()
      return this.state
    })
  }

  setView(view) {
    this.#set({ view })
    this.#render()
  }

  /** Dev tuning: { turn, jointMm, shadeMix, exposureOverride }. */
  setLook(patch) {
    this.#set(patch)
    this.#applyAll()
    this.#render()
  }

  /** The caption's two lines: the stone and its block; the real slabs shown, the scale, any shortage. */
  captionLines() {
    const s = this.state.stone, plan = this.state.plan, block = this.state.block
    const shown = plan?.placements || []
    const codes = [...shown].sort((a, b) => (a.slabNo ?? Infinity) - (b.slabNo ?? Infinity))
      .map((q) => (q.slabNo != null ? `S${String(q.slabNo).padStart(2, '0')}` : q.slabCode)).filter(Boolean)
    const missing = (plan?.coverage?.missing || 0) + (plan?.coverage?.beyond || 0)
    return [
      ['StoneX visualisation', s?.name || null, block?.code ? [block.isLot ? 'lot' : block.isLot === false ? 'block' : null, block.code].filter(Boolean).join(' ') : null].filter(Boolean).join('   ·   '),
      [
        shown.length ? `${shown.length} real slab${shown.length === 1 ? '' : 's'}${codes.length ? `: ${codes.join(' ')}` : ''}` : s?.slabCode ? `slab ${s.slabCode}` : null,
        isTrueScale(this.state) ? 'Scaled to your measurement' : 'Preview scale',
        // the floor beyond the real slabs: their repeats (said so), or how many more it would take — a count
        // only with the customer's measurement (and said as an estimate from it)
        plan?.filled ? `rest of the floor repeats ${shown.length === 1 ? 'this slab' : 'these slabs'} (preview)`
          : missing ? (plan.scale === 'entered' ? `about ${missing} more slab${missing === 1 ? '' : 's'} for the floor in this photo (from your measurement)` : 'more slabs needed for the whole floor') : null,
      ].filter(Boolean).join('   ·   '),
    ]
  }

  /** The visualisation as a JPEG Blob, with an honest caption band (stone, block, slabs, scale). */
  async exportImage({ caption = true } = {}) {
    if (!this.renderer || !this.photoCanvas) throw new Error('NOTHING_TO_EXPORT')
    try {
      const px = this.renderer.readPixels(this.state.stone && this.state.mask?.coverage > 0 ? 'after' : 'before')
      this.#render() // the screen goes back to what the customer was looking at
      const lines = caption ? this.captionLines() : []
      const line = Math.round(Math.max(26, px.height * 0.04))
      const band = caption ? line * lines.length + Math.round(line * 0.3) : 0
      const c = document.createElement('canvas')
      c.width = px.width
      c.height = px.height + band
      const ctx = c.getContext('2d')
      ctx.putImageData(new ImageData(px.data, px.width, px.height), 0, 0)
      if (caption) {
        ctx.fillStyle = '#1A1917'
        ctx.fillRect(0, px.height, c.width, band)
        ctx.fillStyle = '#F5EDD8'
        ctx.textBaseline = 'middle'
        lines.forEach((t, i) => {
          let size = Math.round(line * 0.46)
          ctx.font = `${size}px "DM Sans", system-ui, sans-serif`
          while (size > 10 && ctx.measureText(t).width > c.width - line) ctx.font = `${--size}px "DM Sans", system-ui, sans-serif`
          ctx.fillText(t, Math.round(line * 0.4), px.height + Math.round(line * 0.15) + line * (i + 0.5))
        })
      }
      const blob = await new Promise((resolve, reject) => c.toBlob((b) => (b ? resolve(b) : reject(new Error('EXPORT_FAILED'))), 'image/jpeg', 0.92))
      if (this.state.error?.code === 'EXPORT_FAILED') this.#set({ error: null }) // saved after all: only our own message goes
      return blob
    } catch (err) {
      this.#set({ error: { code: 'EXPORT_FAILED', cause: err.code || null, message: String(err.message) } })
      throw err
    }
  }

  async dispose() {
    this.disposed = true
    clearTimeout(this.gpuTimer)
    try { await this.client?.dispose() } catch { /* already gone */ }
    this.renderer?.dispose()
    for (const { bitmap } of this.bitmaps.values()) bitmap?.close?.()
    this.bitmaps.clear()
    if (this.state.photo?.url) URL.revokeObjectURL(this.state.photo.url)
    this.photoCanvas = null
  }
}
