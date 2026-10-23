// SAM-family segmenter adapter for StoneX Vision (and the bake-off, which measures this same code):
// SlimSAM-77 / SAM 2.1 ONNX models through ONNX Runtime Web 1.30.0 —
//   onnxruntime-web/wasm   (CPU, single thread: StoneX has no cross-origin isolation)
//   onnxruntime-web/webgpu (native WebGPU EP; WE create the GPUDevice so we control its features:
//                           never `subgroups`, `shader-f16` only when available and the variant
//                           carries fp16 weights)
// The Wasm binary and every model file are fetched by us from our own origin (measured), then
// handed to ORT (env.wasm.wasmBinary / Uint8Array / externalData) — ORT fetches nothing itself.
import { SAM_FAMILIES, preprocessSam, tapToModelPoint, upsampleLogits } from './sam.js'
import { fetchAsset, downloadFailed } from './assets.js'
import { VISION_ASSET_BASE } from '../config.js'

const ORT_VERSION = '1.30.0'
const WASM_FILE = { wasm: 'ort-wasm-simd-threaded.wasm', webgpu: 'ort-wasm-simd-threaded.asyncify.wasm' }
// The WebGPU build of ORT (and its 26 MB Asyncify Wasm) is compiled into dev servers and the bake-off
// only (__VISION_WEBGPU__, set by their Vite configs): no customer segmenter uses WebGPU (config.js),
// so a customer build ships the CPU runtime alone. (Its code is a chunk fetched now: offline, a download
// that didn't arrive — an asset error, as for the model files.)
// SHILATEQ EDIT: ORT's own self-contained ES module (ort.wasm.bundle.min.mjs, MIT), served beside the
// models and imported at run time (no npm package, nothing bundled); the WebGPU build is not shipped.
const ORT_URL = `${VISION_ASSET_BASE}ort/${ORT_VERSION}/ort.wasm.bundle.min.mjs`
const loadOrt = (backend) => (backend !== 'webgpu'
  ? import(/* webpackIgnore: true */ /* turbopackIgnore: true */ new URL(ORT_URL, self.location.origin).href).catch((err) => { throw downloadFailed('onnxruntime-web/wasm', err) })
  : Promise.reject(Object.assign(new Error('the WebGPU runtime is not in this build'), { kind: 'no-webgpu' })))
const GPU_LIMITS = ['maxComputeWorkgroupStorageSize', 'maxComputeInvocationsPerWorkgroup', 'maxComputeWorkgroupSizeX', 'maxComputeWorkgroupSizeY', 'maxComputeWorkgroupSizeZ', 'maxStorageBufferBindingSize', 'maxBufferSize', 'maxStorageBuffersPerShaderStage']

export const adapterInfo = (a) => {
  const i = a.info || {}
  return { vendor: i.vendor || '', architecture: i.architecture || '', device: i.device || '', description: i.description || '', isFallbackAdapter: !!(i.isFallbackAdapter ?? a.isFallbackAdapter) }
}

// `runtimeFile` / each variant file: { bytes, sha256 } pinned in models.json — checked before ORT sees a
// byte (fetchAsset); `requireHash`: refuse a file this browser can't hash (production builds).
// `runtimeUrl`: the runtime Wasm the app's build emitted beside its code (core.js); else the pinned copy
// under `base` (the bake-off, the dev-only WebGPU runtime)
export async function createAdapter({ base, candidate, variant, cold, reload = false, backend, onDeviceLost, onBytes = null, runtimeFile = null, runtimeUrl = null, requireHash = false }) {
  const family = SAM_FAMILIES[candidate]
  const t0 = performance.now()
  const ort = await loadOrt(backend)
  const downloads = []
  const runtime = await fetchAsset(runtimeUrl ? self.location.href : base, runtimeUrl || `ort/${ORT_VERSION}/${WASM_FILE[backend]}`, { cold, reload, onBytes, expect: runtimeFile, requireHash })
  downloads.push({ file: WASM_FILE[backend], bytes: runtime.bytes.length, ms: runtime.ms, transferBytes: runtime.transferBytes })
  ort.env.wasm.wasmBinary = runtime.bytes
  // StoneX production has no cross-origin isolation → 1 thread. The opt-in isolated preview
  // (VISION_BENCH_COI=1) measures what threads would buy before anyone changes production headers.
  const threads = self.crossOriginIsolated ? Math.min(4, self.navigator.hardwareConcurrency || 1) : 1
  ort.env.wasm.numThreads = threads
  ort.env.wasm.proxy = false
  ort.env.logLevel = 'error'
  const files = {}
  for (const [role, f] of Object.entries(variant.files)) {
    const r = await fetchAsset(base, f.to, { cold, reload, onBytes, expect: f, requireHash })
    files[role] = r.bytes
    downloads.push({ file: f.to.split('/').pop(), bytes: r.bytes.length, ms: r.ms, transferBytes: r.transferBytes })
  }
  const fetchMs = performance.now() - t0

  let device = null, gpu = null
  const providers = []
  if (backend === 'webgpu') {
    const adapter = await self.navigator.gpu?.requestAdapter()
    if (!adapter) throw Object.assign(new Error('WebGPU adapter unavailable in this browser/device'), { kind: 'no-webgpu' })
    const wantsF16 = /f16/.test(variant.precision)
    const f16 = wantsF16 && adapter.features.has('shader-f16')
    const requiredLimits = {}
    for (const k of GPU_LIMITS) if (adapter.limits[k]) requiredLimits[k] = adapter.limits[k]
    device = await adapter.requestDevice({ requiredFeatures: f16 ? ['shader-f16'] : [], requiredLimits })
    device.lost.then((info) => onDeviceLost?.({ reason: info.reason, message: info.message }))
    // ORT's WebGPU EP takes the device from env.webgpu.device (set before the first session; each
    // Vision worker loads ORT fresh) — otherwise it makes its own, without our feature choice.
    try { ort.env.webgpu.device = device } catch { /* older runtimes: the per-session option below */ }
    gpu = { adapter: adapterInfo(adapter), requestedFeatures: f16 ? ['shader-f16'] : [], shaderF16Available: adapter.features.has('shader-f16'), variantNeedsF16: wantsF16 }
    providers.push({ name: 'webgpu', device })
  } else {
    providers.push('wasm')
  }

  const t1 = performance.now()
  const opts = (role) => {
    const data = variant.files[`${role}Data`]
    return {
      executionProviders: providers,
      graphOptimizationLevel: 'all',
      ...(data ? { externalData: [{ path: data.to.split('/').pop(), data: files[`${role}Data`] }] } : {}),
    }
  }
  const encoder = await ort.InferenceSession.create(files.encoder, { ...opts('encoder'), ...(device ? { preferredOutputLocation: 'gpu-buffer' } : {}) })
  const decoder = await ort.InferenceSession.create(files.decoder, opts('decoder'))
  const initMs = performance.now() - t1

  let enc = null, pre = null
  const disposeEnc = () => {
    if (enc) for (const t of Object.values(enc)) t.dispose?.()
    enc = null
  }

  return {
    info: { runtime: `onnxruntime-web@${ORT_VERSION}`, backend, family: candidate, precision: variant.precision, biggerSmaller: true, wasmThreads: threads, crossOriginIsolated: !!self.crossOriginIsolated, gpu },
    load: { totalMs: performance.now() - t0, fetchMs, initMs, downloads },
    async setImage(img) {
      disposeEnc()
      let t = performance.now()
      pre = preprocessSam(family, img)
      const preprocessMs = performance.now() - t
      t = performance.now()
      enc = await encoder.run({ [family.encoderInput]: new ort.Tensor('float32', pre.data, [1, 3, family.size, family.size]) })
      if (device) await device.queue.onSubmittedWorkDone() // count the GPU work, not just its submission
      return { preprocessMs, encodeMs: performance.now() - t }
    },
    async decode(x, y) {
      const [px, py] = tapToModelPoint(family, pre, x, y)
      const out = await decoder.run(family.decoderFeeds(ort, enc, [[px, py]], [1]))
      const scores = Array.from(out[family.scoresOutput].data)
      const masks = out[family.masksOutput]
      const [, , k, lh, lw] = masks.dims
      const all = masks.data
      const per = lh * lw
      // area at low resolution, inside the part of the 1024² input the image occupies
      const cw = Math.round((pre.rw * lw) / family.size), ch = Math.round((pre.rh * lh) / family.size)
      const candidates = Array.from({ length: k }, (_, i) => {
        const logits = all.slice(i * per, (i + 1) * per)
        let on = 0
        for (let y = 0; y < ch; y++) for (let x = 0; x < cw; x++) if (logits[y * lw + x] > 0) on++
        let cache = null
        // probabilities over the photo at any size (StoneX Vision asks at its render size)
        const probAt = (W, H) => {
          const p = upsampleLogits(family, pre, logits, lw, lh, W, H)
          for (let j = 0; j < p.length; j++) p[j] = 1 / (1 + Math.exp(-p[j]))
          return p
        }
        return {
          score: scores[i],
          area: on / (cw * ch),
          prob: () => {
            if (!cache) cache = probAt(pre.width, pre.height)
            return cache
          },
          probAt,
        }
      })
      const objectScore = out.object_score_logits ? out.object_score_logits.data[0] : null
      for (const t of Object.values(out)) t.dispose?.()
      return { candidates, extra: { objectScore } }
    },
    dispose() {
      disposeEnc()
      encoder.release?.()
      decoder.release?.()
      device?.destroy()
    },
  }
}
