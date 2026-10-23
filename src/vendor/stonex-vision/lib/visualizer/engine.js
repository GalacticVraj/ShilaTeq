/* =====================================================================
   stone-visualizer engine  —  perspective slab/tile mapping on photos
   No dependencies. Works in any browser (Canvas2D only, no WebGL).

   Pipeline per surface:
     1. build a "surface texture" = the slab image tiled at real-world
        scale (cm), with grout, rotation and layout pattern
     2. build a mip chain of that texture (kills shimmer in the distance)
     3. solve the homography unit-square -> user's 4 corner points
     4. for every pixel in the quad: inverse-map to (u,v), sample the
        texture trilinearly, then MULTIPLY by the original photo's
        local luminance so real shadows / highlights / reflections
        survive. That luminance transfer is what makes it look real.
   ===================================================================== */

/* ---- homography: unit square -> quad ------------------------------ */
/* quad = [x0,y0, x1,y1, x2,y2, x3,y3] in this corner order:
      p0 = texture (0,0)  top-left
      p1 = texture (1,0)  top-right
      p2 = texture (1,1)  bottom-right
      p3 = texture (0,1)  bottom-left                                   */
export function squareToQuad(q) {
  const [x0, y0, x1, y1, x2, y2, x3, y3] = q;
  const sx = x0 - x1 + x2 - x3;
  const sy = y0 - y1 + y2 - y3;
  if (Math.abs(sx) < 1e-9 && Math.abs(sy) < 1e-9) {
    // affine special case (quad is a parallelogram)
    return [x1 - x0, x3 - x0, x0, y1 - y0, y3 - y0, y0, 0, 0, 1];
  }
  const dx1 = x1 - x2, dx2 = x3 - x2, dy1 = y1 - y2, dy2 = y3 - y2;
  const den = dx1 * dy2 - dy1 * dx2;
  const g = (sx * dy2 - sy * dx2) / den;
  const h = (sy * dx1 - sx * dy1) / den;
  return [
    x1 - x0 + g * x1, x3 - x0 + h * x3, x0,
    y1 - y0 + g * y1, y3 - y0 + h * y3, y0,
    g, h, 1,
  ];
}

export function invert3(m) {
  const [a, b, c, d, e, f, g, h, i] = m;
  const A = e * i - f * h, B = f * g - d * i, C = d * h - e * g;
  const det = a * A + b * B + c * C;
  const s = 1 / (det || 1e-12);
  return [
    A * s, (c * h - b * i) * s, (b * f - c * e) * s,
    B * s, (a * i - c * g) * s, (c * d - a * f) * s,
    C * s, (b * g - a * h) * s, (a * e - b * d) * s,
  ];
}

/* ---- surface texture: tile a slab at real-world scale -------------- */
/* layout: 'grid' | 'brick' | 'mirror' | 'random'                       */
export function buildSurfaceTexture(opts) {
  const {
    image,                 // HTMLImageElement / canvas of the slab
    surfaceW, surfaceH,    // real size of the surface, cm
    tileW = 60, tileH = 60,// real size of one slab/tile, cm
    groutMm = 0,
    groutColor = '#bdb8b0',
    layout = 'grid',
    rotate = 0,            // 0 | 90 | 180 | 270 applied to each tile
    maxPixels = 4.2e6,
  } = opts;

  let ppc = 1024 / Math.max(tileW, tileH);            // px per cm target
  ppc = Math.min(ppc, Math.sqrt(maxPixels / (surfaceW * surfaceH)));
  ppc = Math.max(ppc, 0.6);

  const W = Math.max(8, Math.round(surfaceW * ppc));
  const H = Math.max(8, Math.round(surfaceH * ppc));
  const cv = document.createElement('canvas');
  cv.width = W; cv.height = H;
  const ctx = cv.getContext('2d');

  const g = (groutMm / 10) * ppc;                      // grout in px
  ctx.fillStyle = groutColor;
  ctx.fillRect(0, 0, W, H);

  const tw = tileW * ppc, th = tileH * ppc;
  const cols = Math.ceil(W / tw) + 1;
  const rows = Math.ceil(H / th) + 1;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let ox = c * tw, oy = r * th;
      if (layout === 'brick') ox += (r % 2) * tw * 0.5;
      ctx.save();
      ctx.beginPath();
      ctx.rect(ox + g / 2, oy + g / 2, tw - g, th - g);
      ctx.clip();
      ctx.translate(ox + tw / 2, oy + th / 2);
      let rot = rotate;
      if (layout === 'random') rot += 90 * ((r * 7 + c * 13) % 4);
      if (rot) ctx.rotate((rot * Math.PI) / 180);
      let sx = 1, sy = 1;
      if (layout === 'mirror') { sx = c % 2 ? -1 : 1; sy = r % 2 ? -1 : 1; }
      ctx.scale(sx, sy);
      const d = Math.max(tw, th);
      ctx.drawImage(image, -d / 2, -d / 2, d, d);
      ctx.restore();
    }
  }
  return { canvas: cv, pxPerCm: ppc };
}

/* ---- mip chain ---------------------------------------------------- */
export function buildMips(canvas, levels = 5) {
  const mips = [];
  let cur = canvas;
  for (let i = 0; i < levels; i++) {
    const ctx = cur.getContext('2d');
    mips.push({
      data: ctx.getImageData(0, 0, cur.width, cur.height).data,
      w: cur.width, h: cur.height,
    });
    if (cur.width <= 8 || cur.height <= 8) break;
    const nx = Math.max(1, cur.width >> 1), ny = Math.max(1, cur.height >> 1);
    const nc = document.createElement('canvas');
    nc.width = nx; nc.height = ny;
    const nctx = nc.getContext('2d');
    nctx.imageSmoothingEnabled = true;
    nctx.imageSmoothingQuality = 'high';
    nctx.drawImage(cur, 0, 0, nx, ny);
    cur = nc;
  }
  return mips;
}

function sampleBilinear(mip, u, v, out) {
  const { data, w, h } = mip;
  let x = u * w - 0.5, y = v * h - 0.5;
  let x0 = Math.floor(x), y0 = Math.floor(y);
  const fx = x - x0, fy = y - y0;
  const cl = (a, m) => (a < 0 ? 0 : a > m ? m : a);
  const x1 = cl(x0 + 1, w - 1), y1 = cl(y0 + 1, h - 1);
  x0 = cl(x0, w - 1); y0 = cl(y0, h - 1);
  const i00 = (y0 * w + x0) * 4, i10 = (y0 * w + x1) * 4;
  const i01 = (y1 * w + x0) * 4, i11 = (y1 * w + x1) * 4;
  const w00 = (1 - fx) * (1 - fy), w10 = fx * (1 - fy);
  const w01 = (1 - fx) * fy, w11 = fx * fy;
  out[0] = data[i00] * w00 + data[i10] * w10 + data[i01] * w01 + data[i11] * w11;
  out[1] = data[i00 + 1] * w00 + data[i10 + 1] * w10 + data[i01 + 1] * w01 + data[i11 + 1] * w11;
  out[2] = data[i00 + 2] * w00 + data[i10 + 2] * w10 + data[i01 + 2] * w01 + data[i11 + 2] * w11;
}

function pointInPoly(px, py, pts) {
  let inside = false;
  for (let i = 0, j = pts.length - 2; i < pts.length; j = i, i += 2) {
    const xi = pts[i], yi = pts[i + 1], xj = pts[j], yj = pts[j + 1];
    if ((yi > py) !== (yj > py) &&
        px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

/* ---- the actual render -------------------------------------------- */
/* base / out : ImageData of the full canvas (out is mutated)
   surface    : { quad, mips, shading, gloss, opacity, exclude[] }      */
export function renderSurface(base, out, surface) {
  const {
    quad, mips,
    shading = 0.95,   // how much of the photo's light is transferred
    gloss = 0.35,     // polished-stone specular pickup
    opacity = 1,
    exclude = [],     // screen-space polygons drawn *in front* of it
  } = surface;

  const W = base.width, H = base.height;
  const B = base.data, O = out.data;
  const Hi = invert3(squareToQuad(quad));
  const [a, b, c, d, e, f, g, h] = Hi;

  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (let i = 0; i < 8; i += 2) {
    x0 = Math.min(x0, quad[i]); x1 = Math.max(x1, quad[i]);
    y0 = Math.min(y0, quad[i + 1]); y1 = Math.max(y1, quad[i + 1]);
  }
  x0 = Math.max(0, Math.floor(x0)); y0 = Math.max(0, Math.floor(y0));
  x1 = Math.min(W - 1, Math.ceil(x1)); y1 = Math.min(H - 1, Math.ceil(y1));
  if (x1 <= x0 || y1 <= y0) return;

  const uv = (x, y, o) => {
    const w = g * x + h * y + 1;
    o[0] = (a * x + b * y + c) / w;
    o[1] = (d * x + e * y + f) / w;
    o[2] = w;
  };

  // pass 1 — mean luminance of the original photo inside the quad
  const t = [0, 0, 0];
  let sum = 0, n = 0;
  for (let y = y0; y <= y1; y += 3) {
    for (let x = x0; x <= x1; x += 3) {
      uv(x + 0.5, y + 0.5, t);
      if (t[2] <= 0 || t[0] < 0 || t[0] > 1 || t[1] < 0 || t[1] > 1) continue;
      const i = (y * W + x) * 4;
      sum += 0.2126 * B[i] + 0.7152 * B[i + 1] + 0.0722 * B[i + 2];
      n++;
    }
  }
  if (!n) return;
  const Lm = Math.max(12, sum / n);

  // pass 2 — map, shade, composite
  const px = [0, 0, 0], du = [0, 0, 0], dv = [0, 0, 0], col = [0, 0, 0];
  const top = mips[0];
  const maxLod = mips.length - 1;

  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      // 2x2 coverage for clean anti-aliased edges
      let cov = 0;
      for (let sy = 0; sy < 2; sy++) {
        for (let sx = 0; sx < 2; sx++) {
          uv(x + 0.25 + sx * 0.5, y + 0.25 + sy * 0.5, t);
          if (t[2] > 0 && t[0] >= 0 && t[0] <= 1 && t[1] >= 0 && t[1] <= 1) cov++;
        }
      }
      if (!cov) continue;
      if (exclude.length) {
        let skip = false;
        for (const poly of exclude) if (pointInPoly(x + 0.5, y + 0.5, poly)) { skip = true; break; }
        if (skip) continue;
      }

      uv(x + 0.5, y + 0.5, px);
      const u = Math.min(1, Math.max(0, px[0]));
      const v = Math.min(1, Math.max(0, px[1]));

      // screen-space derivative -> mip level (anti-aliasing in depth)
      uv(x + 1.5, y + 0.5, du);
      uv(x + 0.5, y + 1.5, dv);
      const fp = Math.max(
        Math.abs(du[0] - px[0]) * top.w, Math.abs(du[1] - px[1]) * top.h,
        Math.abs(dv[0] - px[0]) * top.w, Math.abs(dv[1] - px[1]) * top.h
      );
      let lod = Math.log2(Math.max(fp, 1));
      lod = Math.min(maxLod, Math.max(0, lod));
      const l0 = Math.floor(lod), l1 = Math.min(maxLod, l0 + 1), fl = lod - l0;

      sampleBilinear(mips[l0], u, v, col);
      if (fl > 0.001) {
        const c2 = [0, 0, 0];
        sampleBilinear(mips[l1], u, v, c2);
        col[0] += (c2[0] - col[0]) * fl;
        col[1] += (c2[1] - col[1]) * fl;
        col[2] += (c2[2] - col[2]) * fl;
      }

      const i = (y * W + x) * 4;
      const L = 0.2126 * B[i] + 0.7152 * B[i + 1] + 0.0722 * B[i + 2];
      const shade = 1 + shading * (L / Lm - 1);
      const spec = gloss * Math.max(0, L - Lm * 1.28);

      const alpha = (cov / 4) * opacity;
      for (let k = 0; k < 3; k++) {
        let vcol = col[k] * shade + spec;
        vcol = vcol < 0 ? 0 : vcol > 255 ? 255 : vcol;
        O[i + k] = O[i + k] + (vcol - O[i + k]) * alpha;
      }
      O[i + 3] = 255;
    }
  }
}

/* ---- convenience: full compose ------------------------------------ */
export function compose(baseCanvas, outCanvas, surfaces) {
  const bctx = baseCanvas.getContext('2d', { willReadFrequently: true });
  const octx = outCanvas.getContext('2d', { willReadFrequently: true });
  const base = bctx.getImageData(0, 0, baseCanvas.width, baseCanvas.height);
  const out = octx.createImageData(base.width, base.height);
  out.data.set(base.data);
  for (const s of surfaces) if (s && s.mips) renderSurface(base, out, s);
  octx.putImageData(out, 0, 0);
}
