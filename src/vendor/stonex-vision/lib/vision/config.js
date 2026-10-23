// StoneX Vision — the few settings that are genuinely decisions, in one place.
import models from './segment/models.json'

/** Where model files and runtime Wasm are served from (same origin; dev: the Vite dev server). */
// SHILATEQ EDIT: the website serves them from its own public/vision-assets (see its NOTICE)
export const VISION_ASSET_BASE = '/vision-assets/'

/**
 * Segmenters. PROVISIONAL (2026-10-07): the bake-off has no real photos or target phones yet, so
 * these are development defaults behind one interface, not the final decision. Measured on a
 * desktop iGPU (Intel Arc 130V) in this repo:
 *  - SAM 2.1 Hiera-Tiny q4f16 on WebGPU: photo ready ≈ 1 s, tap ≈ 0.3 s — the only fast GPU
 *    option, but its ONNX export is BLOCKED — LICENCE UNRESOLVED (fix: re-export from
 *    facebook/sam2.1-hiera-tiny, Apache-2.0). Dev builds only; production never selects it.
 *  - SlimSAM-77 int8 on WASM: licence-clean (Apache-2.0), photo ready ≈ 13 s on that desktop.
 *  - SlimSAM-77 on WebGPU with ORT 1.30: fp16 fails ("requires f16 but the device does not
 *    support it" even with shader-f16 requested), fp32 encodes slower than WASM (≈ 18 s) —
 *    kept only as a labelled experiment, dev builds only (customer builds carry no WebGPU runtime).
 *  - 'region' needs no model at all (Tier C).
 */
export const SEGMENTERS = Object.freeze({
  'sam21-gpu': { kind: 'sam', family: 'sam21', variant: { any: 'sam21tiny-q4f16' }, backend: 'webgpu', tier: 'A', licence: 'BLOCKED — LICENCE UNRESOLVED', devOnly: true },
  'slimsam-cpu': { kind: 'sam', family: 'slimsam', variant: { any: 'slimsam77-int8' }, backend: 'wasm', tier: 'B', licence: 'verified' },
  'slimsam-gpu': { kind: 'sam', family: 'slimsam', variant: { any: 'slimsam77-fp32' }, backend: 'webgpu', tier: 'A', licence: 'verified (experiment: dev builds only)', experimental: true, devOnly: true },
  region: { kind: 'region', tier: 'C', licence: 'none (no model)' },
})

/** Default segmenter per device tier: A = GPU model, B = CPU model, C = no model. */
export const TIER_SEGMENTER = Object.freeze({ A: 'sam21-gpu', B: 'slimsam-cpu', C: 'region' })

/**
 * May this segmenter run in a customer (production) session? Only when its model family's licence is
 * VERIFIED in the pinned artifact manifest (models.json candidates[family].licence.status) and it
 * isn't marked dev-only — or when it needs no model at all. Unknown ids never.
 */
export function segmenterLicensed(id) {
  const s = Object.hasOwn(SEGMENTERS, id) ? SEGMENTERS[id] : null
  if (!s) return false
  if (s.kind === 'region') return true
  return !s.devOnly && models.candidates[s.family]?.licence?.status === 'verified'
}

/**
 * The last word before a model is opened (core.init, in the worker): an unlicensed segmenter in a
 * production build is refused — whoever asked for it, a tier, a default or an override. Development
 * builds may open it (the bake-off measures it); they never ship.
 */
export function assertSegmenterAllowed(id, { production = !import.meta.env?.DEV } = {}) {
  if (!Object.hasOwn(SEGMENTERS, id)) throw Object.assign(new Error(`unknown segmenter "${id}"`), { kind: 'licence', code: 'SEGMENTER_UNKNOWN' })
  if (production && !segmenterLicensed(id)) {
    throw Object.assign(new Error(`segmenter "${id}" is not cleared for customers (${SEGMENTERS[id].licence})`), { kind: 'licence', code: 'SEGMENTER_UNLICENSED' })
  }
}

/** The segmenter a tier runs. A production build never runs an unlicensed one: the CPU model instead. */
export function segmenterForTier(tier, { production = !import.meta.env?.DEV } = {}) {
  const id = TIER_SEGMENTER[tier]
  return production && !segmenterLicensed(id) ? TIER_SEGMENTER.B : id
}
/** When a tier's segmenter fails (load error, out of memory, GPU lost, timeout), drop to this one. */
export const NEXT_TIER = Object.freeze({ A: 'B', B: 'C', C: null })

/** Long edge of the working photo the customer sees and exports (lower on low-memory phones). */
export const RENDER_MAX_EDGE = Object.freeze({ normal: 1600, lowMemory: 1280 })
/** Long edge of the copy the segmenter and geometry analyse. */
export const ANALYSIS_MAX_EDGE = 1024

/**
 * Room photos Vision takes. Above `maxPixels` a phone may not hold the decoded photo at all (a
 * 200 MP "hi-res" shot is 800 MB of pixels); 108 MP is still accepted. Below the minimum sizes, or
 * wider than `maxAspect` (a panorama — curved, not a single camera's view), the floor can't be
 * found or laid honestly.
 */
export const PHOTO_LIMITS = Object.freeze({ maxPixels: 120e6, largePixels: 30e6, minShortSide: 360, minLongSide: 480, maxAspect: 4 })

export const MODEL_VARIANTS = models.variants
export const MODEL_CANDIDATES = models.candidates
/** Each pinned runtime file by file name: { to, bytes, sha256 } — its size (download progress) and hash (checked before use). */
export const RUNTIME_FILES = Object.fromEntries(models.runtimes['onnxruntime-web'].files.map((f) => [f.to.split('/').pop(), { to: f.to, bytes: f.bytes, sha256: f.sha256 }]))
