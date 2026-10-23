// The lens of a room photo, from its JPEG EXIF — only what perspective needs (no GPS, no
// identifiers). A 35 mm-equivalent focal length turns into a focal length in pixels; without it
// the floor geometry falls back to a typical phone main camera (and says so).
//
// Pure: bytes in, numbers out. Reads the first APP1 "Exif" segment only.

const TAG_EXIF_IFD = 0x8769
const TAG_MODEL = 0x0110
const TAG_ORIENTATION = 0x0112
const TAG_FOCAL_35 = 0xa405 // FocalLengthIn35mmFilm (SHORT)
const TAG_FOCAL = 0x920a // FocalLength (RATIONAL, mm — needs the sensor size, so only reported)

/** 35 mm film diagonal — "equivalent focal length" is defined against it. */
export const FILM_DIAGONAL_MM = 43.2666

function readIfd(view, tiff, offset, little, wanted) {
  const out = {}
  if (offset + 2 > view.byteLength) return out
  const n = view.getUint16(offset, little)
  for (let i = 0; i < n; i++) {
    const e = offset + 2 + i * 12
    if (e + 12 > view.byteLength) break
    const tag = view.getUint16(e, little)
    if (!wanted.has(tag)) continue
    const type = view.getUint16(e + 2, little)
    const count = view.getUint32(e + 4, little)
    const valueAt = e + 8
    if (type === 3) out[tag] = view.getUint16(valueAt, little) // SHORT
    else if (type === 4) out[tag] = view.getUint32(valueAt, little) // LONG
    else if (type === 5) { // RATIONAL: stored at an offset from the TIFF header
      const at = tiff + view.getUint32(valueAt, little)
      if (at + 8 <= view.byteLength) {
        const den = view.getUint32(at + 4, little)
        out[tag] = den ? view.getUint32(at, little) / den : null
      }
    } else if (type === 2) { // ASCII
      const at = count > 4 ? tiff + view.getUint32(valueAt, little) : valueAt
      let s = ''
      for (let k = 0; k < count - 1 && at + k < view.byteLength; k++) s += String.fromCharCode(view.getUint8(at + k))
      out[tag] = s.trim()
    }
  }
  return out
}

/**
 * @param {ArrayBuffer} buffer the start of a photo file (64 KB is plenty)
 * @returns {{ focal35: number|null, focalMm: number|null, model: string|null }}
 */
export function readLens(buffer) {
  const none = { focal35: null, focalMm: null, model: null }
  if (!buffer || buffer.byteLength < 4) return none
  const view = new DataView(buffer)
  if (view.getUint16(0) !== 0xffd8) return none // not a JPEG (PNG, WebP, HEIC → no lens info)
  let p = 2
  while (p + 4 <= view.byteLength) {
    const marker = view.getUint16(p)
    if ((marker & 0xff00) !== 0xff00) return none
    const len = view.getUint16(p + 2)
    if (marker === 0xffe1 && p + 10 <= view.byteLength && view.getUint32(p + 4) === 0x45786966 && view.getUint16(p + 8) === 0) {
      const tiff = p + 10
      if (tiff + 8 > view.byteLength) return none
      const little = view.getUint16(tiff) === 0x4949
      const ifd0 = readIfd(view, tiff, tiff + view.getUint32(tiff + 4, little), little, new Set([TAG_EXIF_IFD, TAG_MODEL]))
      const exif = ifd0[TAG_EXIF_IFD] ? readIfd(view, tiff, tiff + ifd0[TAG_EXIF_IFD], little, new Set([TAG_FOCAL_35, TAG_FOCAL])) : {}
      const f35 = exif[TAG_FOCAL_35]
      return {
        focal35: f35 >= 8 && f35 <= 300 ? f35 : null,
        focalMm: exif[TAG_FOCAL] > 0 ? Math.round(exif[TAG_FOCAL] * 100) / 100 : null,
        model: typeof ifd0[TAG_MODEL] === 'string' ? ifd0[TAG_MODEL] : null,
      }
    }
    if (marker === 0xffda || len < 2) return none // image data started: no EXIF before it
    p += 2 + len
  }
  return none
}

/**
 * What a photo file is, from its first bytes — before anything is decoded, so an impossible photo
 * (a format the browser can't open, a 200 MP image a phone can't hold) gets a clear answer.
 * width/height are as the photo is SEEN (EXIF orientation 5–8 turns it a quarter); null when the
 * header doesn't say within these bytes.
 * @param {ArrayBuffer} buffer the start of the file (64 KB is usually enough)
 * @returns {{ format: 'jpeg'|'png'|'webp'|'gif'|'avif'|'heic'|'unknown', width: number|null, height: number|null, orientation: number }}
 */
export function readPhotoHeader(buffer) {
  const out = { format: 'unknown', width: null, height: null, orientation: 1 }
  if (!buffer || buffer.byteLength < 16) return out
  const v = new DataView(buffer)
  const ascii = (at, n) => { let s = ''; for (let k = 0; k < n && at + k < v.byteLength; k++) s += String.fromCharCode(v.getUint8(at + k)); return s }
  if (v.getUint16(0) === 0xffd8) {
    out.format = 'jpeg'
    let p = 2
    while (p + 4 <= v.byteLength) {
      if (v.getUint8(p) !== 0xff) break
      const m = v.getUint8(p + 1)
      if (m === 0xff) { p++; continue } // fill byte
      const len = v.getUint16(p + 2)
      if (m === 0xe1 && p + 10 <= v.byteLength && v.getUint32(p + 4) === 0x45786966) {
        const tiff = p + 10
        if (tiff + 8 <= v.byteLength) {
          const little = v.getUint16(tiff) === 0x4949
          const o = readIfd(v, tiff, tiff + v.getUint32(tiff + 4, little), little, new Set([TAG_ORIENTATION]))[TAG_ORIENTATION]
          if (o >= 1 && o <= 8) out.orientation = o
        }
      }
      // SOF0–15 except DHT (C4), JPG (C8), DAC (CC): the frame's size
      if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc && p + 9 <= v.byteLength) {
        out.height = v.getUint16(p + 5)
        out.width = v.getUint16(p + 7)
        break
      }
      if (m === 0xda || len < 2) break // image data: no frame header before it
      p += 2 + len
    }
  } else if (v.getUint32(0) === 0x89504e47) {
    out.format = 'png'
    if (ascii(12, 4) === 'IHDR') { out.width = v.getUint32(16); out.height = v.getUint32(20) }
  } else if (ascii(0, 4) === 'RIFF' && ascii(8, 4) === 'WEBP') {
    out.format = 'webp'
    const chunk = ascii(12, 4)
    if (chunk === 'VP8 ' && v.byteLength >= 30) { out.width = v.getUint16(26, true) & 0x3fff; out.height = v.getUint16(28, true) & 0x3fff }
    else if (chunk === 'VP8L' && v.byteLength >= 25) { const b = v.getUint32(21, true); out.width = (b & 0x3fff) + 1; out.height = ((b >>> 14) & 0x3fff) + 1 }
    else if (chunk === 'VP8X' && v.byteLength >= 30) { out.width = (v.getUint32(24, true) & 0xffffff) + 1; out.height = (v.getUint32(27, true) & 0xffffff) + 1 }
  } else if (ascii(0, 4) === 'GIF8') {
    out.format = 'gif'
    out.width = v.getUint16(6, true)
    out.height = v.getUint16(8, true)
  } else if (ascii(4, 4) === 'ftyp') {
    // ISO media (HEIF family): AVIF opens in Chrome, HEIC/HEIF (an iPhone's or some phones' default) does not
    const size = Math.min(v.getUint32(0), v.byteLength)
    const brands = [ascii(8, 4)]
    for (let at = 16; at + 4 <= size; at += 4) brands.push(ascii(at, 4))
    if (brands.some((b) => b === 'avif' || b === 'avis')) out.format = 'avif'
    else if (brands.some((b) => ['heic', 'heix', 'hevc', 'hevx', 'heim', 'heis', 'mif1', 'msf1'].includes(b))) out.format = 'heic'
  }
  if (out.orientation >= 5 && out.width && out.height) [out.width, out.height] = [out.height, out.width]
  return out
}

/** The lens and the header of a photo File/Blob (reads its first 128 KB once). */
export async function photoHeadOfFile(file) {
  try {
    const head = await file.slice(0, 131072).arrayBuffer()
    return { lens: readLens(head), ...readPhotoHeader(head) }
  } catch {
    return { lens: { focal35: null, focalMm: null, model: null }, format: 'unknown', width: null, height: null, orientation: 1 }
  }
}

/** 35 mm-equivalent focal length → focal length in pixels for an image of this size. */
export function focalPixels(focal35, width, height) {
  if (!(focal35 > 0) || !(width > 0) || !(height > 0)) return null
  return (focal35 / FILM_DIAGONAL_MM) * Math.hypot(width, height)
}
