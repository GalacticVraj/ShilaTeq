// Homography helpers: the unit square onto a 4-point quad, and a 3×3 inverse.
// Used by the vision floor geometry (src/lib/vision/geometry).

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
