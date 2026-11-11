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
