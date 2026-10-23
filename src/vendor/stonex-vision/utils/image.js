// Downscale + compress an image File to a small JPEG data URL, in the browser.
//
// Block photos were being stored as FULL-resolution base64 (5MB+ each) directly in the
// DB, which made every photo query crawl. This caps the longest edge at `maxDim` and
// re-encodes as JPEG, so a phone photo drops from ~5MB to ~100-250KB with no visible
// quality loss at display sizes. Falls back to the raw data URL if the canvas path fails.
export function downscaleImage(file, maxDim = 1280, quality = 0.72) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = reject
    reader.onload = (e) => {
      const img = new Image()
      img.onerror = reject
      img.onload = () => {
        let { width, height } = img
        if (Math.max(width, height) > maxDim) {
          const scale = maxDim / Math.max(width, height)
          width = Math.round(width * scale)
          height = Math.round(height * scale)
        }
        try {
          const canvas = document.createElement('canvas')
          canvas.width = width
          canvas.height = height
          canvas.getContext('2d').drawImage(img, 0, 0, width, height)
          resolve(canvas.toDataURL('image/jpeg', quality))
        } catch {
          resolve(e.target?.result) // canvas blocked (rare) → keep original
        }
      }
      img.src = e.target?.result
    }
    reader.readAsDataURL(file)
  })
}

// A phone photo File → a canvas at most `maxDim` on its long side, upright (EXIF
// orientation applied). For photos that get uploaded as files, not stored inline.
// `willReadFrequently`: a CPU canvas for pixels that are read back (no GPU upload of the full-size
// photo and no GPU readback — measured several times faster for a 12–108 MP photo).
export async function imageFileToCanvas(file, maxDim = 2000, { willReadFrequently = false } = {}) {
  let src
  try {
    src = await createImageBitmap(file, { imageOrientation: 'from-image' })
  } catch {
    src = await new Promise((resolve, reject) => {
      const img = new Image()
      const url = URL.createObjectURL(file)
      img.onload = () => { URL.revokeObjectURL(url); resolve(img) }
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('IMAGE_DECODE_FAILED')) }
      img.src = url
    })
  }
  const w = src.width, h = src.height
  const k = Math.min(1, maxDim / Math.max(w, h))
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(w * k))
  canvas.height = Math.max(1, Math.round(h * k))
  const ctx = canvas.getContext('2d', willReadFrequently ? { willReadFrequently } : undefined)
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(src, 0, 0, canvas.width, canvas.height)
  if (src.close) src.close()
  return canvas
}
