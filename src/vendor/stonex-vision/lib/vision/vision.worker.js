// StoneX Vision worker: hosts the Vision core (segmenter, mask, geometry analysis, lighting) so
// the screen never waits on inference. Messages: { id, op, args } → { id, ok, result } or
// { id, ok: false, error: { kind, message } }; unsolicited { event } for GPU loss.
import { createVisionCore, failureKind } from './core.js'

const core = createVisionCore({ emit: (e) => self.postMessage(e) })

function transferables(v, out = new Set()) {
  if (!v || typeof v !== 'object') return out
  if (ArrayBuffer.isView(v)) { out.add(v.buffer); return out }
  for (const x of Array.isArray(v) ? v : Object.values(v)) transferables(x, out)
  return out
}

// One op at a time, in the order sent: the model can't run two at once (ONNX Runtime's wasm runs
// aren't reentrant — two photos read together could mix one's encoding with the other's taps)
let chain = Promise.resolve()

self.onmessage = ({ data }) => {
  chain = chain.then(async () => {
    const { id, op, args } = data
    try {
      if (typeof core[op] !== 'function') throw new Error(`unknown op ${op}`)
      const result = await core[op](args || {})
      self.postMessage({ id, ok: true, result }, [...transferables(result)])
    } catch (err) {
      self.postMessage({ id, ok: false, error: { kind: failureKind(err), code: err?.code || null, message: String(err?.message || err).slice(0, 600) } })
    }
  })
}
