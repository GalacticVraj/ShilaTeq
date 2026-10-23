// Asset fetching inside the Vision Worker, with honest cold/warm semantics:
//   cold → unique query string + cache: 'no-store'  (a real network download, nothing reused)
//   warm → plain URL + cache: 'force-cache'          (whatever the browser kept from a previous load)
// The same rule is applied to every candidate so their numbers compare.

let nonce = 0

export function assetUrl(base, path, cold) {
  const url = new URL(path, new URL(base, self.location.href))
  if (cold) url.searchParams.set('bench-cold', `${Date.now().toString(36)}-${++nonce}`)
  return url.href
}

const assetError = (code, path, why) => Object.assign(new Error(`${path}: ${why}`), { kind: 'asset', code })

/**
 * The connection failing on the way (offline, a dropped or switched network, a name that won't resolve):
 * the file didn't arrive — an asset error like a missing file (ASSET_NETWORK: no tier is dropped for it,
 * and the next try downloads it again), never taken for the engine crashing. Running out of memory for
 * the bytes (a RangeError) stays what it is. Also for the code chunks the model needs (core.js, samOrt.js).
 */
export const downloadFailed = (path, err) => (err instanceof RangeError ? err : assetError('ASSET_NETWORK', path, `the download stopped (${String(err?.message || err)})`))

/**
 * → { bytes: Uint8Array, ms, transferBytes|null, fromCache, verified }. `onBytes(n)` is told each piece
 * as it arrives (a real download's progress — a phone on mobile data waits for ~28 MB the first time).
 * `expect` { bytes, sha256 } (the pinned file, models.json): anything else is refused before it is
 * used — a missing file (ASSET_MISSING), an HTML page in its place (a site answering every unknown
 * path with its app page), the wrong size or hash (ASSET_INVALID). The SHA-256 needs a secure context
 * (https, localhost); without one the file is unverified — refused when `requireHash` (ASSET_UNVERIFIED).
 * The connection failing before or while it arrives: ASSET_NETWORK (downloadFailed).
 * `reload`: past the HTTP cache (a retry after a bad copy, or a download that stopped).
 */
export async function fetchAsset(base, path, { cold, reload = false, onBytes = null, expect = null, requireHash = false }) {
  const url = assetUrl(base, path, cold)
  const t0 = performance.now()
  let res
  try {
    res = await fetch(url, { cache: cold ? 'no-store' : reload ? 'reload' : 'force-cache' })
  } catch (err) {
    throw downloadFailed(path, err)
  }
  if (!res.ok) throw assetError('ASSET_MISSING', path, `HTTP ${res.status}`)
  if (/text\/html/i.test(res.headers.get('content-type') || '')) {
    try { await res.body?.cancel() } catch { /* nothing left to read */ }
    throw assetError('ASSET_INVALID', path, 'a web page came back instead of the file')
  }
  let bytes
  if (onBytes && res.body) {
    // a size the server states for the bytes as they arrive (not compressed): read straight into one
    // buffer of that size — not pieces copied into a second one at the end (twice the model's ~28 MB
    // held at once on a phone). Otherwise, or if more arrives than stated, collect pieces as before.
    const stated = Number(res.headers.get('content-length')) || 0
    let buf = stated > 0 && !res.headers.get('content-encoding') ? new Uint8Array(stated) : null
    let parts = buf ? null : [], size = 0
    const reader = res.body.getReader()
    for (;;) {
      let piece
      try { piece = await reader.read() } catch (err) { throw downloadFailed(path, err) } // the connection went mid-way
      const { done, value } = piece
      if (done) break
      if (buf && size + value.length <= buf.length) buf.set(value, size)
      else {
        if (buf) { parts = [buf.subarray(0, size)]; buf = null }
        parts.push(value)
      }
      size += value.length
      onBytes(value.length)
    }
    if (buf) bytes = size === buf.length ? buf : buf.slice(0, size)
    else {
      bytes = new Uint8Array(size)
      let at = 0
      for (const p of parts) { bytes.set(p, at); at += p.length }
    }
  } else {
    try { bytes = new Uint8Array(await res.arrayBuffer()) } catch (err) { throw downloadFailed(path, err) }
  }
  if (expect?.bytes != null && bytes.length !== expect.bytes) throw assetError('ASSET_INVALID', path, `${bytes.length} bytes, the pinned file has ${expect.bytes}`)
  let verified = false
  if (expect?.sha256) {
    const subtle = globalThis.crypto?.subtle
    if (subtle) {
      const hex = Array.from(new Uint8Array(await subtle.digest('SHA-256', bytes)), (b) => b.toString(16).padStart(2, '0')).join('')
      if (hex !== expect.sha256) throw assetError('ASSET_INVALID', path, 'SHA-256 differs from the pinned file')
      verified = true
    } else if (requireHash) {
      throw assetError('ASSET_UNVERIFIED', path, 'this page can\'t check the file (not a secure context)')
    }
  }
  const ms = performance.now() - t0
  const entry = performance.getEntriesByName(url).pop()
  const transferBytes = entry && Number.isFinite(entry.transferSize) ? entry.transferSize : null
  return { bytes, ms, transferBytes, fromCache: transferBytes === 0 && bytes.length > 0, url, verified }
}

/** Resource-timing summary for files a runtime fetched itself (MediaPipe's Wasm). */
export function resourceTiming(urlPrefix) {
  return performance.getEntriesByType('resource')
    .filter((e) => e.name.startsWith(urlPrefix))
    .map((e) => ({ name: e.name.split('?')[0].split('/').pop(), ms: e.duration, transferBytes: e.transferSize, bodyBytes: e.decodedBodySize }))
}
