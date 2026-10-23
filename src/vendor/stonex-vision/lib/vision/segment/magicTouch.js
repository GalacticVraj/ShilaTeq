// Candidate 1 — MediaPipe MagicTouch v2 through @mediapipe/tasks-vision 1.1.0 (split API:
// setImage() runs the encoder once, segment(strokes) runs the decoder per tap).
// Self-hosted: the ES-module Wasm loader (useModule — works inside our module worker) and the
// .task model come from our own origin; nothing is fetched from a CDN.
import { InteractiveSegmenter } from '@mediapipe/tasks-vision'
import { assetUrl, fetchAsset, resourceTiming } from './assets.js'
import { resizePlane } from '../image.js'

const MP_DIR = 'mediapipe/1.1.0/'
// vision.d.ts declares `enum BrushMode { UNSPECIFIED, POSITIVE, NEGATIVE, LASSO }`, but the 1.1.0
// runtime bundle does not export it — use the value.
const BRUSH_POSITIVE = 1

export async function createAdapter({ base, variant, cold, options = {} }) {
  const delegate = options.mediapipeDelegate === 'GPU' ? 'GPU' : 'CPU'
  const t0 = performance.now()
  const model = await fetchAsset(base, variant.files.model.to, { cold })
  const fileset = {
    wasmLoaderPath: assetUrl(base, `${MP_DIR}vision_wasm_module_internal.js`, cold),
    wasmBinaryPath: assetUrl(base, `${MP_DIR}vision_wasm_module_internal.wasm`, cold),
  }
  const t1 = performance.now()
  const canvas = delegate === 'GPU' ? new OffscreenCanvas(1, 1) : undefined
  const seg = await InteractiveSegmenter.createFromOptions(fileset, {
    baseOptions: { modelAssetBuffer: model.bytes, delegate },
    ...(canvas ? { canvas } : {}),
  })
  const initMs = performance.now() - t1
  const runtimeFiles = resourceTiming(new URL(MP_DIR, new URL(base, self.location.href)).href)

  let w = 0, h = 0
  return {
    info: { runtime: '@mediapipe/tasks-vision@1.1.0', backend: `mediapipe-${delegate.toLowerCase()}`, delegate, biggerSmaller: false },
    load: {
      totalMs: performance.now() - t0,
      fetchMs: model.ms,
      initMs, // includes the Wasm loader import, Wasm download + compile and model init (MediaPipe does these itself)
      downloads: [
        { file: 'interactive_segmentation.task', bytes: model.bytes.length, ms: model.ms, transferBytes: model.transferBytes },
        ...runtimeFiles.map((f) => ({ file: f.name, bytes: f.bodyBytes, ms: f.ms, transferBytes: f.transferBytes })),
      ],
    },
    async setImage(img) {
      w = img.width; h = img.height
      const t = performance.now()
      seg.setImage(new ImageData(new Uint8ClampedArray(img.data), w, h)) // preprocessing + encoder, inside MediaPipe
      return { preprocessMs: null, encodeMs: performance.now() - t, note: 'MediaPipe resizes/normalises inside setImage; encodeMs includes it' }
    },
    async decode(x, y) {
      let t = performance.now()
      const mask = seg.segment([{ brushMode: BRUSH_POSITIVE, point: [{ x: x / w, y: y / h }], isCompleted: true }])
      const segmentMs = performance.now() - t
      t = performance.now()
      let conf = Float32Array.from(mask.getAsFloat32Array())
      const mw = mask.width, mh = mask.height
      mask.close()
      let max = 0, sum = 0
      for (let i = 0; i < conf.length; i++) { if (conf[i] > max) max = conf[i]; sum += conf[i] }
      if (max > 1.0001) for (let i = 0; i < conf.length; i++) conf[i] /= 255
      const confStats = { max: max > 1.0001 ? max / 255 : max, mean: (max > 1.0001 ? sum / 255 : sum) / conf.length }
      if (mw !== w || mh !== h) conf = resizePlane(conf, mw, mh, w, h)
      let area = 0
      for (let i = 0; i < conf.length; i++) if (conf[i] >= 0.5) area++
      const probAt = (W, H) => (W === w && H === h ? conf : resizePlane(conf, w, h, W, H))
      return { candidates: [{ score: 1, area: area / conf.length, prob: () => conf, probAt }], extra: { maskSize: [mw, mh], segmentMs, readResizeMs: performance.now() - t, conf: confStats } }
    },
    dispose() { seg.close() },
  }
}
