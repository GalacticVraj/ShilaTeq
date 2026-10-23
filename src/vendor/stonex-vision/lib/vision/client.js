// Main-thread handle on the Vision core: one module Web Worker, request/response with per-op
// timeouts, crash detection and GPU-loss events. Without module workers (very old browsers) the
// same core runs in-process — slower screen, same results. Implements the VisionSegmenter
// interface the product uses: initialize · setImage · addPositiveTap · addNegativeTap · undo ·
// reset · getMask · dispose — plus the analysis calls (geometry, lighting) on the same image.
import { createVisionCore, failureKind } from './core.js'

// ms an op may run (from when the worker starts it, not while it waits its turn); init's 180 s count
// from its last piece of download — a model still arriving never times out, a stalled one is a
// download that didn't arrive (ASSET_STALLED)
export const TIMEOUTS = Object.freeze({
  init: 180000, setImage: 180000, tap: 60000, undo: 20000, reset: 20000, geometry: 30000, lighting: 30000, status: 10000, lines: 10000, dispose: 20000,
})

export class VisionClient {
  /**
   * @param {{ onEvent?: (e) => void, inProcess?: boolean }} [opts]
   */
  constructor({ onEvent = () => {}, inProcess = false } = {}) {
    this.onEvent = onEvent
    this.seq = 0
    this.pending = new Map()
    this.dead = null
    this.mask = null
    this.worker = null
    if (!inProcess) {
      try {
        this.worker = new Worker(new URL('./vision.worker.js', import.meta.url), { type: 'module' })
      } catch {
        this.worker = null
      }
    }
    if (this.worker) {
      this.worker.onmessage = ({ data }) => {
        if (data.event) {
          // more of the model arrived: the op running (the init) gets its full time again — its clock
          // counts silence, not the whole download (a slow link needs minutes for ~28 MB)
          const run = data.event === 'load' && this.#running()
          if (run) { run.progressed = true; run.arm() }
          this.onEvent({ ...data, at: Date.now() })
          return
        }
        const p = this.pending.get(data.id)
        if (!p) return
        this.pending.delete(data.id)
        clearTimeout(p.timer)
        const next = this.#running()
        if (next && next.timer === null) next.arm() // the next op in line runs now: its clock starts
        if (data.ok) p.resolve(data.result)
        else p.reject(Object.assign(new Error(data.error.message), { kind: data.error.kind, code: data.error.code, op: p.op }))
      }
      this.worker.onerror = (e) => { e.preventDefault?.(); this.#crash('worker-crash', e.message || 'the worker stopped') }
      this.worker.onmessageerror = () => this.#crash('worker-crash', 'unreadable message from the worker')
    } else {
      this.core = createVisionCore({ emit: (e) => this.onEvent({ ...e, at: Date.now() }) })
    }
  }

  get inProcess() { return !this.worker }

  /** The call the worker is running: the oldest waiting (it runs them one at a time, in order). */
  #running() { return this.pending.values().next().value }

  #crash(kind, message, code = null) {
    if (this.dead) return
    this.dead = { kind, message }
    for (const p of this.pending.values()) {
      clearTimeout(p.timer)
      p.reject(Object.assign(new Error(message), { kind, op: p.op, ...(code ? { code } : {}) }))
    }
    this.pending.clear()
    try { this.worker?.terminate() } catch { /* already gone */ }
    this.onEvent({ event: kind, message, at: Date.now() })
  }

  #call(op, args = {}, transfer = []) {
    if (this.dead) return Promise.reject(Object.assign(new Error(`vision engine is down (${this.dead.kind})`), { kind: this.dead.kind, op }))
    if (!this.worker) {
      // in order, one at a time — as the worker runs them
      const run = (this.chain || Promise.resolve())
        .then(() => this.core[op](args))
        .catch((err) => { throw Object.assign(err instanceof Error ? err : new Error(String(err)), { kind: failureKind(err), op }) })
      this.chain = run.catch(() => {})
      return run
    }
    const id = ++this.seq
    const timeout = TIMEOUTS[op] ?? 30000
    return new Promise((resolve, reject) => {
      const s = Math.round(timeout / 1000)
      // silence for the whole timeout: once some of the model had arrived (`progressed`), the download
      // stalled — an asset error like the connection dropping (no tier is dropped for it, the next try
      // downloads again); with nothing from the worker at all, a timeout as ever (the tier rules decide)
      const expire = () => (p.progressed
        ? this.#crash('asset', `the model download stalled: nothing arrived for ${s} s`, 'ASSET_STALLED')
        : this.#crash('timeout', `${op} took longer than ${s} s`))
      const p = {
        op, timer: null, progressed: false, resolve, reject,
        arm: () => { clearTimeout(p.timer); p.timer = setTimeout(expire, timeout) },
      }
      // an op's clock starts when the worker runs it — not while it waits behind another (a photo queued
      // behind a replaced photo's long reading); the one running is on its own clock meanwhile
      if (!this.pending.size) p.arm()
      this.pending.set(id, p)
      this.worker.postMessage({ id, op, args }, transfer)
    })
  }

  /** Load the segmenter (a model, or none for Tier C). */
  initialize(segmenter, opts = {}) { return this.#call('init', { segmenter, ...opts }) }

  /**
   * @param {{ width, height, data }} analysis ≤1024 px copy (copied to the worker)
   * @param {{ width, height, data }} guide the photo at the render size (transferred — pass a copy)
   */
  setImage(analysis, guide) {
    this.mask = null
    return this.#call('setImage', { analysis, guide }, this.worker ? [guide.data.buffer] : [])
  }

  async #mask(promise) {
    const r = await promise
    this.mask = r
    return r
  }

  addPositiveTap({ x, y }) { return this.#mask(this.#call('tap', { label: 'pos', x, y })) }
  addNegativeTap({ x, y }) { return this.#mask(this.#call('tap', { label: 'neg', x, y })) }
  undo() { return this.#mask(this.#call('undo')) }
  reset() { return this.#mask(this.#call('reset')) }
  /** The last mask result (alpha 0–255 at the render size, coverage, bbox) or null. */
  getMask() { return this.mask }

  estimateGeometry(opts) { return this.#call('geometry', opts) }
  computeLighting(opts) { return this.#call('lighting', opts) }
  status() { return this.#call('status') }
  lines() { return this.#call('lines') }

  /**
   * Stop the engine. A worker is terminated at once (that frees all its memory — no need to wait for
   * a long encode to finish first); every call still waiting is REJECTED, so nothing waits forever.
   */
  async dispose() {
    if (this.dead) return
    if (!this.worker) {
      try { await this.#call('dispose') } catch { /* already down */ }
    }
    this.dead = { kind: 'disposed', message: 'disposed' }
    for (const p of this.pending.values()) {
      clearTimeout(p.timer)
      p.reject(Object.assign(new Error('vision engine was stopped'), { kind: 'disposed', op: p.op }))
    }
    this.pending.clear()
    try { this.worker?.terminate() } catch { /* already gone */ }
  }
}
