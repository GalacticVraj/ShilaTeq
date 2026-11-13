// What this device can do for StoneX Vision — tested, never guessed from the phone's name or GPU
// string. Tier A: a GPU model + WebGL2 rendering. Tier B: a CPU model + WebGL2. Tier C: no model
// (colour-region taps) + WebGL2. Without WebGL2 there is no preview at all, and the screen says so.
// iOS hides its memory (no deviceMemory) and closes a tab that holds too much, with nothing the page can catch.
// Reading a photo with the original SlimSAM encoder took about 1.75 GB, and a real iPhone reloaded and showed
// "can't open this page", so iPhones ran without a model. The encoder customers get now computes its global
// attention one head at a time (models.json slimsam77-int8-heads): the same result in about 340 MB, so iOS
// gets the model like every other phone. iOS still uses the smaller working photo (renderEdgeFor).
import { webgl2Available } from './renderer/VisionRenderer.js'

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

/** Pick a tier and say why. `override` (dev only) forces one. */
export function chooseTier(caps, override = null) {
  const reasons = []
  if (!caps.webgl2?.ok) return { tier: 'none', reasons: ['no WebGL2 — the preview cannot be drawn on this device'] }
  if (override && ['A', 'B', 'C'].includes(override)) return { tier: override, reasons: ['forced (dev override)'] }
  if (caps.saveData) { reasons.push('Save-Data is on — no model download'); return { tier: 'C', reasons } }
  if (caps.deviceMemoryGB != null && caps.deviceMemoryGB < 3) { reasons.push(`${caps.deviceMemoryGB} GB device memory — too little for a model`); return { tier: 'C', reasons } }
  if (caps.webgpu?.usable && !caps.webgpu.fallbackAdapter) { reasons.push('WebGPU usable'); return { tier: 'A', reasons } }
  reasons.push(caps.webgpu?.usable ? 'WebGPU is a software fallback — CPU model instead' : `no WebGPU (${caps.webgpu?.reason || 'unavailable'})`)
  return { tier: 'B', reasons }
}

/** Long edge for the working photo: smaller on low-memory phones. */
export const renderEdgeFor = (caps, edges) => (caps.ios || (caps.deviceMemoryGB != null && caps.deviceMemoryGB <= 4) ? edges.lowMemory : edges.normal)
