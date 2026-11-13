// The floor from a depth model (Depth Anything V2 Small): which flat surfaces face up, and which of them is
// the floor. For a horizontal surface a distance h below the camera, the model's inverse depth is
// d = s·(v − v_h)/(f·h) + t, so its vertical gradient gy = s/(f·h) is the SAME everywhere on that surface,
// whatever the model's unknown scale s and shift t. The floor is the lowest horizontal surface: the
// smallest gy. A table top or a bed (h smaller) rises more steeply; walls barely change or change sideways.
// It only ever helps SlimSAM choose (mask.js chooseFirstTap, session findFloor): it never lays stone itself.
import { resizeImage } from './image.js'

// the model's input: long edge, a multiple of its 14 px patches. 392 rather than the model's 518: on one Wasm
// thread (uint8) 1.8 s instead of about 3 s on a desktop; the floor area agrees 81 % with 518's.
export const DEPTH_EDGE = 392
const MEAN = [0.485, 0.456, 0.406], STD = [0.229, 0.224, 0.225]
export const FLOOR = 1, RAISED = 2 // the map's values (0: anything else)

/** The model's input from an RGBA image: { data: Float32Array CHW, w, h }. */
export function preprocessDepth(img) {
  const k = DEPTH_EDGE / Math.max(img.width, img.height)
  const w = Math.max(14, Math.round((img.width * k) / 14) * 14), h = Math.max(14, Math.round((img.height * k) / 14) * 14)
  const px = resizeImage(img, w, h).data, n = w * h, data = new Float32Array(3 * n)
  for (let i = 0; i < n; i++) for (let c = 0; c < 3; c++) data[c * n + i] = (px[i * 4 + c] / 255 - MEAN[c]) / STD[c]
  return { data, w, h }
}

function boxBlur(a, W, H, r) {
  const t = new Float32Array(W * H), o = new Float32Array(W * H)
  for (let y = 0; y < H; y++) {
    let s = 0, n = 0
    for (let x = -r; x < W + r; x++) {
      if (x + r < W) { s += a[y * W + x + r]; n++ }
      if (x - r - 1 >= 0) { s -= a[y * W + x - r - 1]; n-- }
      if (x >= 0 && x < W) t[y * W + x] = s / n
    }
  }
  for (let x = 0; x < W; x++) {
    let s = 0, n = 0
    for (let y = -r; y < H + r; y++) {
      if (y + r < H) { s += t[(y + r) * W + x]; n++ }
      if (y - r - 1 >= 0) { s -= t[(y - r - 1) * W + x]; n-- }
      if (y >= 0 && y < H) o[y * W + x] = s / n
    }
  }
  return o
}

/**
 * The model's inverse depth (W×H) → a map: FLOOR, RAISED (a flat surface above the floor: a table, a bed)
 * or 0. `floor` false when no flat surface was found.
 * ponytail: thresholds tuned by eye on 20 open-licence rooms (no labels yet); tune on outlined photos.
 */
export function floorMap(D, W, H) {
  let mx = 0
  for (const d of D) if (d > mx) mx = d
  const map = new Uint8Array(W * H)
  if (!(mx > 0)) return { map, w: W, h: H, floor: false }
  const d = boxBlur(Float32Array.from(D, (x) => x / mx), W, H, 2)
  const k = 4 // gradient over ±k px
  const gx = new Float32Array(W * H), gy = new Float32Array(W * H)
  for (let y = k; y < H - k; y++) {
    for (let x = k; x < W - k; x++) {
      const i = y * W + x
      gx[i] = (d[i + k] - d[i - k]) / (2 * k)
      gy[i] = (d[i + k * W] - d[i - k * W]) / (2 * k)
    }
  }
  // horizontal: rises downward, mostly vertically, at a locally steady rate (a plane, not a cushion)
  const sgy = boxBlur(gy, W, H, 4), sgy2 = boxBlur(gy.map((g) => g * g), W, H, 4)
  const horiz = new Uint8Array(W * H)
  for (let i = 0; i < W * H; i++) {
    const g = sgy[i]
    if (g > 1e-4 && Math.abs(gx[i]) < 0.35 * g && Math.sqrt(Math.max(0, sgy2[i] - g * g)) < 0.35 * g) horiz[i] = 1
  }
  // the horizontal surfaces' slopes (log gy) in the lower 60 % of the photo, nearer rows weighing more
  const BINS = 80, lo = Math.log(1e-4), hi = Math.log(0.05), hist = new Float32Array(BINS)
  const bin = (g) => Math.max(0, Math.min(BINS - 1, Math.floor(((Math.log(g) - lo) / (hi - lo)) * BINS)))
  for (let y = Math.floor(H * 0.4); y < H; y++) for (let x = 0; x < W; x++) if (horiz[y * W + x]) hist[bin(sgy[y * W + x])] += y / H
  const sm = hist.map((_, b) => (hist[b - 1] || 0) * 0.25 + hist[b] * 0.5 + (hist[b + 1] || 0) * 0.25)
  let total = 0
  for (const v of sm) total += v
  // each surface is a peak; the floor = the gentlest one with at least 12 % of the flat area
  let floorBin = -1
  for (let b = 0; b < BINS && floorBin < 0; b++) {
    if (!(sm[b] > 0 && sm[b] >= (sm[b - 1] || 0) && sm[b] >= (sm[b + 1] || 0))) continue
    let mass = 0
    for (let j = Math.max(0, b - 4); j <= Math.min(BINS - 1, b + 4); j++) mass += sm[j]
    if (mass >= 0.12 * total) floorBin = b
  }
  if (floorBin < 0) return { map, w: W, h: H, floor: false }
  const gyFloor = Math.exp(lo + ((floorBin + 0.5) / BINS) * (hi - lo))
  for (let i = 0; i < W * H; i++) {
    if (!horiz[i]) continue
    const r = Math.log(sgy[i] / gyFloor)
    map[i] = Math.abs(r) < 0.3 ? FLOOR : r > 0.3 ? RAISED : 0
  }
  // the floor: its parts reaching the lower quarter of the photo, or large ones
  const lab = new Int32Array(W * H), keep = new Set()
  let id = 0, any = false
  for (let i = 0; i < W * H; i++) {
    if (map[i] !== FLOOR || lab[i]) continue
    id++
    const st = [i]
    lab[i] = id
    let low = false, size = 0
    while (st.length) {
      const j = st.pop(), x = j % W, y = (j / W) | 0
      size++
      if (y > H * 0.75) low = true
      for (const q of [x > 0 ? j - 1 : -1, x < W - 1 ? j + 1 : -1, y > 0 ? j - W : -1, y < H - 1 ? j + W : -1]) {
        if (q >= 0 && map[q] === FLOOR && !lab[q]) { lab[q] = id; st.push(q) }
      }
    }
    if ((low && size > W * H * 0.005) || size > W * H * 0.05) { keep.add(id); any = true }
  }
  for (let i = 0; i < W * H; i++) if (map[i] === FLOOR && !keep.has(lab[i])) map[i] = 0
  return { map, w: W, h: H, floor: any }
}

/**
 * Where to look for the floor first: the point of the depth floor farthest inside it, in its lower part —
 * as shares of the photo's width and height, or null.
 */
export function floorSpot(fm) {
  if (!fm?.floor) return null
  const { map, w, h } = fm
  // distance inside the floor (chessboard), capped: a coarse distance transform in two passes
  const dist = new Float32Array(w * h)
  for (let i = 0; i < w * h; i++) dist[i] = map[i] === FLOOR ? 1e9 : 0
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = y * w + x
    if (!dist[i]) continue
    dist[i] = Math.min(dist[i], x ? dist[i - 1] + 1 : 1, y ? dist[i - w] + 1 : 1, x && y ? dist[i - w - 1] + 1 : 1, y && x < w - 1 ? dist[i - w + 1] + 1 : 1)
  }
  for (let y = h - 1; y >= 0; y--) for (let x = w - 1; x >= 0; x--) {
    const i = y * w + x
    if (!dist[i]) continue
    dist[i] = Math.min(dist[i], x < w - 1 ? dist[i + 1] + 1 : 1, y < h - 1 ? dist[i + w] + 1 : 1, x < w - 1 && y < h - 1 ? dist[i + w + 1] + 1 : 1, y < h - 1 && x ? dist[i + w - 1] + 1 : 1)
  }
  let best = -1, bi = -1
  for (let y = Math.floor(h * 0.45); y < h; y++) for (let x = 0; x < w; x++) {
    const i = y * w + x, score = dist[i] * (0.5 + y / h) // nearer the camera: the floor is surer there
    if (score > best) { best = score; bi = i }
  }
  return best > 2 ? [((bi % w) + 0.5) / w, (((bi / w) | 0) + 0.5) / h] : null
}

/** How a proposal (0–1 at fm.w × fm.h) sits on the depth floor: IoU with it, its share on the floor, and on raised surfaces. */
export function depthFacts(region, fm) {
  let inter = 0, area = 0, floor = 0, raised = 0
  for (let i = 0; i < fm.map.length; i++) {
    const p = region[i] >= 0.5, m = fm.map[i]
    if (m === FLOOR) floor++
    if (!p) continue
    area++
    if (m === FLOOR) inter++
    else if (m === RAISED) raised++
  }
  return { iou: inter / Math.max(1, area + floor - inter), floorShare: inter / Math.max(1, area), raisedShare: raised / Math.max(1, area) }
}
