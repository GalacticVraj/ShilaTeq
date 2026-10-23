// SAM-family pre/post-processing for the ONNX candidates, written against the pinned exports'
// own configs (.vision-bench/assets/models/*/preprocessor_config.json):
//   SlimSAM-77 (SamImageProcessor):  longest edge → 1024 (bilinear), ×1/255, ImageNet mean/std,
//                                    pad bottom/right to 1024² with 0 (after normalising)
//   SAM 2.1  (Sam2ImageProcessor):   resize to 1024×1024 (no aspect keep, no pad), ×1/255, mean/std
// Both decoders return 3 candidate masks as 256×256 logits over the 1024² model input.
import { rgbaToPlanes, resizePlane } from '../image.js'

const MEAN = [0.485, 0.456, 0.406]
const STD = [0.229, 0.224, 0.225]

const pointTensors = (ort, points, labels) => ({
  input_points: new ort.Tensor('float32', Float32Array.from(points.flat()), [1, 1, points.length, 2]),
  input_labels: new ort.Tensor('int64', BigInt64Array.from(labels, (l) => BigInt(l)), [1, 1, labels.length]),
})

export const SAM_FAMILIES = {
  slimsam: {
    size: 1024,
    letterbox: true,
    encoderInput: 'pixel_values',
    encoderOutputs: ['image_embeddings', 'image_positional_embeddings'],
    scoresOutput: 'iou_scores',
    masksOutput: 'pred_masks',
    decoderFeeds: (ort, enc, points, labels) => ({
      ...pointTensors(ort, points, labels),
      image_embeddings: enc.image_embeddings,
      image_positional_embeddings: enc.image_positional_embeddings,
    }),
  },
  sam21: {
    size: 1024,
    letterbox: false,
    encoderInput: 'pixel_values',
    encoderOutputs: ['image_embeddings.0', 'image_embeddings.1', 'image_embeddings.2'],
    scoresOutput: 'iou_scores',
    masksOutput: 'pred_masks',
    decoderFeeds: (ort, enc, points, labels) => ({
      ...pointTensors(ort, points, labels),
      // the export requires a boxes input; zero boxes = point prompts only
      input_boxes: new ort.Tensor('float32', new Float32Array(0), [1, 0, 4]),
      'image_embeddings.0': enc['image_embeddings.0'],
      'image_embeddings.1': enc['image_embeddings.1'],
      'image_embeddings.2': enc['image_embeddings.2'],
    }),
  },
}

/** RGBA image → normalised CHW float32 [1,3,1024,1024] plus the geometry to map taps and masks. */
export function preprocessSam(family, img) {
  const { size } = family
  let rw = size, rh = size
  if (family.letterbox) {
    const s = size / Math.max(img.width, img.height)
    rw = Math.floor(img.width * s + 0.5)
    rh = Math.floor(img.height * s + 0.5)
  }
  const { R, G, B } = rgbaToPlanes(img)
  const data = new Float32Array(3 * size * size) // zero = padding in normalised space
  ;[R, G, B].forEach((plane, c) => {
    const r = resizePlane(plane, img.width, img.height, rw, rh)
    const base = c * size * size
    for (let y = 0; y < rh; y++) {
      for (let x = 0; x < rw; x++) data[base + y * size + x] = (r[y * rw + x] / 255 - MEAN[c]) / STD[c]
    }
  })
  return { data, rw, rh, scaleX: rw / img.width, scaleY: rh / img.height, width: img.width, height: img.height }
}

/** A tap in image pixels → the model's 1024-space point. */
export const tapToModelPoint = (family, pre, x, y) => [x * pre.scaleX, y * pre.scaleY]

/**
 * One 256×256 logit map → logits at outW×outH over the original image (crop + resize in one
 * bilinear pass). Column taps are precomputed once: this runs on every tap at the render size.
 */
export function upsampleLogits(family, pre, logits, lw, lh, outW, outH) {
  const out = new Float32Array(outW * outH)
  const sx = (pre.rw / outW) * (lw / family.size)
  const sy = (pre.rh / outH) * (lh / family.size)
  const x0s = new Int32Array(outW), x1s = new Int32Array(outW), fxs = new Float32Array(outW)
  for (let x = 0; x < outW; x++) {
    const fx = Math.min(lw - 1, Math.max(0, (x + 0.5) * sx - 0.5))
    x0s[x] = Math.floor(fx)
    x1s[x] = Math.min(lw - 1, x0s[x] + 1)
    fxs[x] = fx - x0s[x]
  }
  for (let y = 0; y < outH; y++) {
    const fy = Math.min(lh - 1, Math.max(0, (y + 0.5) * sy - 0.5))
    const y0 = Math.floor(fy), y1 = Math.min(lh - 1, y0 + 1), ty = fy - y0
    const r0 = y0 * lw, r1 = y1 * lw, row = y * outW
    for (let x = 0; x < outW; x++) {
      const a = logits[r0 + x0s[x]] + (logits[r0 + x1s[x]] - logits[r0 + x0s[x]]) * fxs[x]
      const b = logits[r1 + x0s[x]] + (logits[r1 + x1s[x]] - logits[r1 + x0s[x]]) * fxs[x]
      out[row + x] = a + (b - a) * ty
    }
  }
  return out
}

/** Binary mask (logit > 0) at outW×outH — the "raw" model mask. */
export function sampleLowResLogits(family, pre, logits, lw, lh, outW, outH) {
  const up = upsampleLogits(family, pre, logits, lw, lh, outW, outH)
  return Uint8Array.from(up, (v) => (v > 0 ? 1 : 0))
}

export const sigmoid = (v) => 1 / (1 + Math.exp(-v))
