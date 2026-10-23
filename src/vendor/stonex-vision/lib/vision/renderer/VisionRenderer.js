// VisionRenderer — the WebGL2 compositor. GPU textures for the photo, the surface mask, the room's
// light and the REAL slabs: one texture-array layer per slab's own twin, plus a small table of where
// each slab lies on the floor and how its twin maps onto it. One full-screen pass per render (on
// demand, no animation loop). Works on ordinary Android GPUs: 8-bit sRGB textures, one R16F light
// map, no float render targets.
import { VERTEX, FRAGMENT, MAX_SLABS } from './shaders.js'

export class RendererError extends Error {
  constructor(code, detail) { super(code); this.name = 'RendererError'; this.code = code; this.detail = detail }
}

/** Is WebGL2 available here at all? (Tier "unsupported" when not.) */
export function webgl2Available(canvas = typeof document !== 'undefined' ? document.createElement('canvas') : null) {
  try {
    const gl = canvas?.getContext('webgl2')
    if (!gl) return { ok: false, reason: 'no WebGL2 context' }
    const dbg = gl.getExtension('WEBGL_debug_renderer_info')
    const info = { ok: true, maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE), renderer: dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER) }
    gl.getExtension('WEBGL_lose_context')?.loseContext()
    return info
  } catch (e) {
    return { ok: false, reason: String(e?.message || e) }
  }
}

const colMajor = (m) => [m[0], m[3], m[6], m[1], m[4], m[7], m[2], m[5], m[8]]
/** Raw RGBA bytes of an ImageData-like ({ width, height, data }); null for canvases/bitmaps/images. */
const pixelsOf = (s) => (s && ArrayBuffer.isView(s.data) ? new Uint8Array(s.data.buffer, s.data.byteOffset, s.data.length) : null)

export { MAX_SLABS }

export class VisionRenderer {
  /**
   * @param {HTMLCanvasElement|OffscreenCanvas} canvas
   * @param {{ onContextLost?: () => void, onContextRestored?: () => void, gl?: WebGL2RenderingContext }} [opts]
   *   `gl` lets tests pass a fake context.
   */
  constructor(canvas, { onContextLost, onContextRestored, gl = null } = {}) {
    this.canvas = canvas
    this.gl = gl || canvas.getContext('webgl2', { alpha: false, antialias: false, premultipliedAlpha: false, preserveDrawingBuffer: false, powerPreference: 'default' })
    if (!this.gl) throw new RendererError('NO_WEBGL2')
    this.tex = { room: null, mask: null, slabs: null, shade: null }
    this.size = null
    this.layers = { count: 0, width: 0, height: 0, loaded: new Uint8Array(0) }
    this.placements = []
    this.lost = false
    this.state = {
      hinv: [1, 0, 0, 0, 1, 0, 0, 0, 1], origin: [0, 0], rot: [1, 0], joint: 0.2, jointDark: 0.3, inset: 0.003,
      exposure: 1, shadeMix: 1, mode: 0, tint: [0.85, 0.55, 0.12],
    }
    this.table = { rect: new Float32Array(MAX_SLABS * 4), uvA: new Float32Array(MAX_SLABS * 4), uvB: new Float32Array(MAX_SLABS * 4), count: 0 }
    this.fill = { rows: new Int32Array(MAX_SLABS), count: 0, origin: [0, 0], size: [1, 1] }
    this.onLost = (e) => { e.preventDefault?.(); this.lost = true; onContextLost?.() }
    this.onRestored = () => { this.lost = false; this.#init(); onContextRestored?.() }
    canvas.addEventListener?.('webglcontextlost', this.onLost)
    canvas.addEventListener?.('webglcontextrestored', this.onRestored)
    this.#init()
  }

  #init() {
    const gl = this.gl
    const compile = (type, src) => {
      const s = gl.createShader(type)
      gl.shaderSource(s, src)
      gl.compileShader(s)
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new RendererError('SHADER_COMPILE', gl.getShaderInfoLog(s))
      return s
    }
    const vs = compile(gl.VERTEX_SHADER, VERTEX), fs = compile(gl.FRAGMENT_SHADER, FRAGMENT)
    const prog = gl.createProgram()
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new RendererError('PROGRAM_LINK', gl.getProgramInfoLog(prog))
    gl.deleteShader(vs)
    gl.deleteShader(fs)
    this.prog = prog
    this.vao = gl.createVertexArray()
    this.loc = {}
    for (const n of ['u_room', 'u_mask', 'u_slabs', 'u_shade', 'u_size', 'u_hinv', 'u_origin', 'u_rot', 'u_rect', 'u_uvA', 'u_uvB', 'u_count', 'u_fillCount', 'u_fillRow', 'u_fillOrigin', 'u_fillSize', 'u_joint', 'u_jointDark', 'u_inset', 'u_exposure', 'u_shadeMix', 'u_mode', 'u_tint']) {
      this.loc[n] = gl.getUniformLocation(prog, n)
    }
    this.aniso = gl.getExtension('EXT_texture_filter_anisotropic')
    this.maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE)
    // a 1×1 neutral light map until the room's light is measured; an empty mask; no slabs yet
    this.tex = { room: null, mask: null, slabs: null, shade: null }
    this.setShading({ field: new Float32Array([1]), width: 1, height: 1 })
    this.#texture('mask', (t) => {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8, 1, 1, 0, gl.RED, gl.UNSIGNED_BYTE, new Uint8Array([0]))
      return t
    })
    this.clearSlabs()
  }

  #texture(slot, upload, { mipmaps = false } = {}) {
    const gl = this.gl
    if (this.tex[slot]) gl.deleteTexture(this.tex[slot])
    const t = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, t)
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1)
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false)
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false)
    upload(t)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    if (mipmaps) {
      gl.generateMipmap(gl.TEXTURE_2D)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
    } else {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    }
    this.tex[slot] = t
    return t
  }

  /** The customer's photo (canvas / ImageBitmap / ImageData) — also sets the render size. */
  uploadRoom(source) {
    const gl = this.gl
    const w = source.width, h = source.height
    if (!(w > 0 && h > 0)) throw new RendererError('BAD_ROOM')
    if (w > this.maxTextureSize || h > this.maxTextureSize) throw new RendererError('ROOM_TOO_LARGE', { w, h, max: this.maxTextureSize })
    this.#texture('room', () => {
      const px = pixelsOf(source)
      if (px) gl.texImage2D(gl.TEXTURE_2D, 0, gl.SRGB8_ALPHA8, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, px)
      else gl.texImage2D(gl.TEXTURE_2D, 0, gl.SRGB8_ALPHA8, gl.RGBA, gl.UNSIGNED_BYTE, source)
    })
    this.size = [w, h]
    if (this.canvas.width !== w || this.canvas.height !== h) { this.canvas.width = w; this.canvas.height = h }
  }

  /** Surface mask, 0–255 at the render size (or any size: sampled bilinearly). */
  uploadMask(alpha, width, height) {
    const gl = this.gl
    if (!alpha || alpha.length !== width * height) throw new RendererError('BAD_MASK')
    this.#texture('mask', () => gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8, width, height, 0, gl.RED, gl.UNSIGNED_BYTE, new Uint8Array(alpha.buffer, alpha.byteOffset, alpha.length)))
  }

  clearMask() {
    this.uploadMask(new Uint8Array([0]), 1, 1)
  }

  /**
   * Room for `count` slab twins, each stored at width × height (sRGB, mipmapped, anisotropic).
   * Every layer starts "not loaded": its slab shows a neutral grey until uploadSlabLayer().
   */
  allocateSlabLayers(count, width, height) {
    const gl = this.gl
    if (!(count >= 1 && count <= MAX_SLABS)) throw new RendererError('BAD_SLAB_COUNT', { count, max: MAX_SLABS })
    if (!(width > 0 && height > 0) || width > this.maxTextureSize || height > this.maxTextureSize) throw new RendererError('SLAB_LAYER_TOO_LARGE', { width, height, max: this.maxTextureSize })
    if (this.tex.slabs) gl.deleteTexture(this.tex.slabs)
    const t = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D_ARRAY, t)
    const levels = Math.floor(Math.log2(Math.max(width, height))) + 1
    gl.texStorage3D(gl.TEXTURE_2D_ARRAY, levels, gl.SRGB8_ALPHA8, width, height, count)
    gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
    if (this.aniso) gl.texParameterf(gl.TEXTURE_2D_ARRAY, this.aniso.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(8, gl.getParameter(this.aniso.MAX_TEXTURE_MAX_ANISOTROPY_EXT)))
    this.tex.slabs = t
    this.layers = { count, width, height, loaded: new Uint8Array(count) }
    this.#writeTable()
  }

  /** One slab's twin into its layer. `source` must be the layer size (the caller resamples). */
  uploadSlabLayer(index, source) {
    const gl = this.gl
    const L = this.layers
    if (!(index >= 0 && index < L.count)) throw new RendererError('BAD_SLAB_LAYER', { index, count: L.count })
    if (source.width !== L.width || source.height !== L.height) throw new RendererError('SLAB_LAYER_SIZE', { want: [L.width, L.height], got: [source.width, source.height] })
    gl.bindTexture(gl.TEXTURE_2D_ARRAY, this.tex.slabs)
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1)
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false)
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false)
    const px = pixelsOf(source)
    if (px) gl.texSubImage3D(gl.TEXTURE_2D_ARRAY, 0, 0, 0, index, L.width, L.height, 1, gl.RGBA, gl.UNSIGNED_BYTE, px)
    else gl.texSubImage3D(gl.TEXTURE_2D_ARRAY, 0, 0, 0, index, L.width, L.height, 1, gl.RGBA, gl.UNSIGNED_BYTE, source)
    gl.generateMipmap(gl.TEXTURE_2D_ARRAY)
    L.loaded[index] = 1
    this.#writeTable()
  }

  /** A layer handed to another slab: not loaded again until its new twin is uploaded (never shows the old one). */
  releaseSlabLayer(index) {
    if (index >= 0 && index < this.layers.count) this.layers.loaded[index] = 0
    this.#writeTable()
  }

  /** No slabs: a 1×1×1 placeholder keeps the sampler complete; the table is emptied. */
  clearSlabs() {
    const gl = this.gl
    if (this.tex.slabs) gl.deleteTexture(this.tex.slabs)
    const t = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D_ARRAY, t)
    gl.texStorage3D(gl.TEXTURE_2D_ARRAY, 1, gl.SRGB8_ALPHA8, 1, 1, 1)
    gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    this.tex.slabs = t
    this.layers = { count: 0, width: 0, height: 0, loaded: new Uint8Array(0) }
    this.placements = []
    if (this.fill) this.fill.count = 0
    this.#writeTable()
  }

  /**
   * Where each real slab lies (layout frame, cm) and how its twin maps onto it:
   * [{ rect: [x0, y0, x1, y1], uv: { o: [u, v], ax: [du, dv], ay: [du, dv] }, layer }].
   * A mapping that would mirror the stone (det(ax, ay) ≤ 0) is refused.
   */
  setPlacements(placements) {
    if (!Array.isArray(placements) || placements.length > MAX_SLABS) throw new RendererError('BAD_PLACEMENTS', { count: placements?.length, max: MAX_SLABS })
    for (const p of placements) {
      const [x0, y0, x1, y1] = p.rect || []
      if (![x0, y0, x1, y1].every(Number.isFinite) || !(x1 > x0 && y1 > y0)) throw new RendererError('BAD_PLACEMENT_RECT', p.rect)
      const { ax, ay } = p.uv || {}
      if (!(ax && ay) || !(ax[0] * ay[1] - ax[1] * ay[0] > 0)) throw new RendererError('MIRRORED_SLAB', p.slabId)
      if (!(Number.isInteger(p.layer) && p.layer >= 0)) throw new RendererError('BAD_SLAB_LAYER', p.layer)
    }
    this.placements = placements
    this.fill.count = 0 // a new table: the fill must be set again for it
    this.#writeTable()
  }

  /**
   * The rest of the floor as repeats of placed slabs (null = real slabs only): `rows` index this table's
   * placements, each at least as long as a cell and as deep (the cell crops it, never stretches it);
   * `origin`/`size` = one cell, the picked slab's rectangle, in the layout frame (cm).
   */
  setFill(fill) {
    if (!fill) { this.fill.count = 0; return }
    const { rows, origin, size } = fill
    const n = this.placements.length
    if (!Array.isArray(rows) || !rows.length || rows.length > MAX_SLABS || !rows.every((i) => Number.isInteger(i) && i >= 0 && i < n)) throw new RendererError('BAD_FILL', rows)
    if (!(origin?.length === 2 && origin.every(Number.isFinite) && size?.length === 2 && size[0] > 0 && size[1] > 0)) throw new RendererError('BAD_FILL', { origin, size })
    for (const i of rows) {
      const [x0, y0, x1, y1] = this.placements[i].rect
      if (x1 - x0 < size[0] - 1e-3 || Math.abs(y1 - y0 - size[1]) > 1e-3) throw new RendererError('FILL_WOULD_STRETCH', i)
    }
    this.fill.rows.fill(0)
    this.fill.rows.set(rows)
    this.fill.count = rows.length
    this.fill.origin = [...origin]
    this.fill.size = [...size]
  }

  #writeTable() {
    const T = this.table
    T.rect.fill(0); T.uvA.fill(0); T.uvB.fill(0)
    const list = this.placements.slice(0, MAX_SLABS)
    list.forEach((p, i) => {
      T.rect.set(p.rect, i * 4)
      T.uvA.set([p.uv.o[0], p.uv.o[1], p.uv.ax[0], p.uv.ax[1]], i * 4)
      const ready = p.layer < this.layers.count && this.layers.loaded[p.layer] ? 1 : 0
      T.uvB.set([p.uv.ay[0], p.uv.ay[1], p.layer, ready], i * 4)
    })
    T.count = list.length
  }

  /** Room light relative to the floor's typical light (Float32, any small size). */
  setShading({ field, width, height, exposure, shadeMix }) {
    const gl = this.gl
    if (field) {
      if (field.length !== width * height) throw new RendererError('BAD_SHADING')
      this.#texture('shade', () => gl.texImage2D(gl.TEXTURE_2D, 0, gl.R16F, width, height, 0, gl.RED, gl.FLOAT, field))
    }
    if (Number.isFinite(exposure)) this.state.exposure = exposure
    if (Number.isFinite(shadeMix)) this.state.shadeMix = shadeMix
  }

  /** hinv = image px → plane cm (row-major 3×3, w > 0 on the plane). */
  setGeometry({ hinv }) {
    if (!Array.isArray(hinv) || hinv.length !== 9 || !hinv.every(Number.isFinite)) throw new RendererError('BAD_GEOMETRY')
    this.state.hinv = hinv
  }

  /** The layout frame on the floor (origin cm, direction) and the joints. */
  setFrame({ origin, cos, sin, jointCm, jointDark }) {
    if (!(Array.isArray(origin) && origin.length === 2 && origin.every(Number.isFinite) && Number.isFinite(cos) && Number.isFinite(sin))) throw new RendererError('BAD_FRAME')
    this.state.origin = origin
    this.state.rot = [cos, sin]
    if (Number.isFinite(jointCm)) this.state.joint = jointCm
    if (Number.isFinite(jointDark)) this.state.jointDark = jointDark
  }

  /** @param {'after'|'before'|'selection'|'light'|'layout'} view — the last two are developer views */
  render(view = 'after') {
    const gl = this.gl
    if (this.lost || !this.size || !this.tex.room) return false
    const s = this.state
    const t0 = typeof performance !== 'undefined' ? performance.now() : 0
    gl.viewport(0, 0, this.size[0], this.size[1])
    gl.useProgram(this.prog)
    gl.bindVertexArray(this.vao)
    const bind = (unit, slot, name, target = gl.TEXTURE_2D) => {
      gl.activeTexture(gl.TEXTURE0 + unit)
      gl.bindTexture(target, this.tex[slot])
      gl.uniform1i(this.loc[name], unit)
    }
    bind(0, 'room', 'u_room')
    bind(1, 'mask', 'u_mask')
    bind(2, 'slabs', 'u_slabs', gl.TEXTURE_2D_ARRAY)
    bind(3, 'shade', 'u_shade')
    gl.uniform2f(this.loc.u_size, this.size[0], this.size[1])
    gl.uniformMatrix3fv(this.loc.u_hinv, false, colMajor(s.hinv))
    gl.uniform2f(this.loc.u_origin, s.origin[0], s.origin[1])
    gl.uniform2f(this.loc.u_rot, s.rot[0], s.rot[1])
    gl.uniform4fv(this.loc.u_rect, this.table.rect)
    gl.uniform4fv(this.loc.u_uvA, this.table.uvA)
    gl.uniform4fv(this.loc.u_uvB, this.table.uvB)
    gl.uniform1i(this.loc.u_count, this.table.count)
    gl.uniform1i(this.loc.u_fillCount, this.fill.count)
    gl.uniform1iv(this.loc.u_fillRow, this.fill.rows)
    gl.uniform2f(this.loc.u_fillOrigin, this.fill.origin[0], this.fill.origin[1])
    gl.uniform2f(this.loc.u_fillSize, this.fill.size[0], this.fill.size[1])
    gl.uniform1f(this.loc.u_joint, s.joint)
    gl.uniform1f(this.loc.u_jointDark, s.jointDark)
    gl.uniform1f(this.loc.u_inset, s.inset)
    gl.uniform1f(this.loc.u_exposure, s.exposure)
    gl.uniform1f(this.loc.u_shadeMix, s.shadeMix)
    gl.uniform1i(this.loc.u_mode, { after: 0, before: 1, selection: 2, light: 3, layout: 4 }[view] ?? 0)
    gl.uniform3f(this.loc.u_tint, s.tint[0], s.tint[1], s.tint[2])
    gl.drawArrays(gl.TRIANGLES, 0, 3)
    this.lastRenderMs = typeof performance !== 'undefined' ? performance.now() - t0 : 0
    return true
  }

  /** Render and read back the full-resolution result as ImageData-like RGBA (top row first). */
  readPixels(view = 'after') {
    const gl = this.gl
    if (!this.render(view)) throw new RendererError('NOTHING_TO_EXPORT')
    const [w, h] = this.size
    const buf = new Uint8Array(w * h * 4)
    gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, buf)
    const out = new Uint8ClampedArray(w * h * 4)
    const row = w * 4
    for (let y = 0; y < h; y++) out.set(buf.subarray((h - 1 - y) * row, (h - y) * row), y * row)
    return { width: w, height: h, data: out }
  }

  /** Free every GPU resource now (don't wait for garbage collection on a phone). */
  dispose() {
    const gl = this.gl
    for (const k of Object.keys(this.tex)) { if (this.tex[k]) gl.deleteTexture(this.tex[k]); this.tex[k] = null }
    if (this.vao) gl.deleteVertexArray(this.vao)
    if (this.prog) gl.deleteProgram(this.prog)
    this.vao = null
    this.prog = null
    this.placements = []
    this.canvas.removeEventListener?.('webglcontextlost', this.onLost)
    this.canvas.removeEventListener?.('webglcontextrestored', this.onRestored)
    gl.getExtension('WEBGL_lose_context')?.loseContext()
    this.disposed = true
  }
}
