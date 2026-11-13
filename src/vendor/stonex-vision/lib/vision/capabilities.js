// What this device can do for StoneX Vision — tested, never guessed from the phone's name or GPU
// string. Tier A: a GPU model + WebGL2 rendering. Tier B: a CPU model + WebGL2. Tier C: no model
// (colour-region taps) + WebGL2. Without WebGL2 there is no preview at all, and the screen says so.
// iOS hides its memory (no deviceMemory) and closes a tab that holds too much, with nothing the page can catch.
// Reading a photo with the original SlimSAM encoder took about 1.75 GB, and a real iPhone reloaded and showed
// "can't open this page", so iPhones ran without a model. The encoder customers get now computes its global
// attention one head at a time (models.json slimsam77-int8-heads): the same result in about 340 MB, so iOS
// gets the model like every other phone. iOS still uses the smaller working photo (renderEdgeFor).
import { webgl2Available } from './renderer/VisionRenderer.js'
import { SEGMENTERS, TIER_SEGMENTER } from './config.js'

/** Every browser on iOS is WebKit, Chrome included. An iPad asking for desktop pages says "Macintosh", with touch. */
export function isIOS(nav = globalThis.navigator || {}) {
  return /iPhone|iPad|iPod/.test(nav.userAgent || '') || (/Macintosh/.test(nav.userAgent || '') && (nav.maxTouchPoints || 0) > 1)
}

async function webgpuUsable() {
  const gpu = globalThis.navigator?.gpu
  if (!gpu) return { usable: false, reason: 'no navigator.gpu' }
  try {
    const adapter = await gpu.requestAdapter()
    if (!adapter) return { usable: false, reason: 'no adapter' }
    const device = await adapter.requestDevice() // no optional features (never `subgroups`)
    device.destroy()
    return { usable: true, shaderF16: adapter.features.has('shader-f16'), fallbackAdapter: !!(adapter.info?.isFallbackAdapter ?? adapter.isFallbackAdapter) }
  } catch (e) {
    return { usable: false, reason: String(e?.message || e) }
  }
}

export async function detectCapabilities() {
  const nav = globalThis.navigator || {}
  return {
    webgl2: webgl2Available(),
    webgpu: await webgpuUsable(),
    deviceMemoryGB: nav.deviceMemory ?? null,
    cores: nav.hardwareConcurrency ?? null,
    saveData: !!nav.connection?.saveData,
    connection: nav.connection?.effectiveType || null,
    moduleWorkers: typeof Worker !== 'undefined',
    ios: isIOS(nav),
  }
}

// The crash safety net. A phone that still runs out of memory reading a photo loses the tab with nothing the page
// can catch, so the session marks each model read in localStorage (startModelRead) and clears the mark when the
// read ends. A mark found at the next start, from another page load and recent, means that read never ended: from
// then on this device runs without a model (Tier C) for MODEL_OFF_MS — or until the model changes (CRASH_NET.version).
// No storage (private mode, blocked): no net, never an error. Not taken for a crash: a page closed, reloaded or left
// mid-read (pagehide clears its mark; a killed tab gets no pagehide), nor a page killed while hidden (hiding the page
// clears the mark and showing it writes it again: phones kill background tabs with no event, and only a death in the
// foreground is the model's doing), nor another tab still reading (each page that reads holds a Web Lock named after
// it while it lives; without Web Locks it is taken for one — the cost is a device without the model for a while).
export const CRASH_NET = Object.freeze({
  reading: 'stonex.vision.reading', modelOff: 'stonex.vision.modelOff',
  version: `${SEGMENTERS[TIER_SEGMENTER.B].variant.any}+${SEGMENTERS[TIER_SEGMENTER.B].depth || ''}`,
})
const CRASH_WINDOW_MS = 15 * 60e3 // a mark older than this proves nothing (a phone left for the night)
const MODEL_OFF_MS = 30 * 86400e3
const PAGE = Math.random().toString(36).slice(2) // this page load: its own marks are never a crash
const storage = () => { try { return globalThis.localStorage || null } catch { return null } }
const clearMark = () => { try { storage()?.removeItem(CRASH_NET.reading) } catch { /* no storage */ } }
const writeMark = () => { try { storage()?.setItem(CRASH_NET.reading, JSON.stringify({ at: Date.now(), page: PAGE, v: CRASH_NET.version })) } catch { /* no storage: no net */ } }
const hidden = () => globalThis.document?.visibilityState === 'hidden'
const onVisibility = () => { if (hidden()) clearMark(); else if (reads > 0) writeMark() }
const readJson = (s, key) => { try { return JSON.parse(s.getItem(key)) } catch { return null } }
let reads = 0, alive = false

/** A model read starts (the photo's reading, the depth helper). Returns its end() — call it once the read is over. */
export function startModelRead() {
  if (reads++ === 0) {
    try {
      if (!hidden()) writeMark() // hidden: written when the page is shown again (onVisibility)
      if (!alive) {
        alive = true
        globalThis.addEventListener?.('pagehide', clearMark)
        globalThis.document?.addEventListener?.('visibilitychange', onVisibility)
        globalThis.navigator?.locks?.request(`${CRASH_NET.reading}:${PAGE}`, () => new Promise(() => {})).catch(() => {})
      }
    } catch { /* no storage: no net */ }
  }
  let open = true
  return () => {
    if (!open) return
    open = false
    if (--reads === 0) clearMark()
  }
}

/**
 * Must this device run without a model, because a model read closed the tab? Turns a mark left by a dead page into
 * that decision (stored with its expiry and the model's version), then reads the decision. `now` for tests.
 */
export async function modelOffAfterCrash(now = Date.now()) {
  const s = storage()
  if (!s) return false
  try {
    const mark = readJson(s, CRASH_NET.reading)
    if (mark && mark.page !== PAGE) {
      const live = await globalThis.navigator?.locks?.query?.().then((q) => q.held?.some((l) => l.name === `${CRASH_NET.reading}:${mark.page}`)).catch(() => false)
      if (!live) {
        s.removeItem(CRASH_NET.reading)
        if (mark.v === CRASH_NET.version && now - mark.at >= 0 && now - mark.at < CRASH_WINDOW_MS) {
          s.setItem(CRASH_NET.modelOff, JSON.stringify({ at: now, until: now + MODEL_OFF_MS, v: CRASH_NET.version }))
        }
      }
    }
    const off = readJson(s, CRASH_NET.modelOff)
    if (off && off.v === CRASH_NET.version && now < off.until) return true
    if (off) s.removeItem(CRASH_NET.modelOff) // expired, or another model: it gets its own chance
  } catch { /* storage refused mid-way: no net */ }
  return false
}

/** Pick a tier and say why. `override` (dev only) forces one. `caps.modelOffAfterCrash`: see modelOffAfterCrash. */
export function chooseTier(caps, override = null) {
  const reasons = []
  if (!caps.webgl2?.ok) return { tier: 'none', reasons: ['no WebGL2 — the preview cannot be drawn on this device'] }
  if (override && ['A', 'B', 'C'].includes(override)) return { tier: override, reasons: ['forced (dev override)'] }
  if (caps.modelOffAfterCrash) return { tier: 'C', reasons: ['the model closed this tab while reading a photo — no model on this device for now'], warning: 'MODEL_OFF_AFTER_CRASH' }
  if (caps.saveData) { reasons.push('Save-Data is on — no model download'); return { tier: 'C', reasons } }
  if (caps.deviceMemoryGB != null && caps.deviceMemoryGB < 3) { reasons.push(`${caps.deviceMemoryGB} GB device memory — too little for a model`); return { tier: 'C', reasons } }
  if (caps.webgpu?.usable && !caps.webgpu.fallbackAdapter) { reasons.push('WebGPU usable'); return { tier: 'A', reasons } }
  reasons.push(caps.webgpu?.usable ? 'WebGPU is a software fallback — CPU model instead' : `no WebGPU (${caps.webgpu?.reason || 'unavailable'})`)
  return { tier: 'B', reasons }
}

/** Long edge for the working photo: smaller on low-memory phones. */
export const renderEdgeFor = (caps, edges) => (caps.ios || (caps.deviceMemoryGB != null && caps.deviceMemoryGB <= 4) ? edges.lowMemory : edges.normal)
