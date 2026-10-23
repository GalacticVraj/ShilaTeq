// GLSL for the StoneX Vision compositor (WebGL2 / GLSL ES 3.00).
//
// Per pixel: inverse-project the photo pixel onto the floor plane (cm) → the layout frame → which
// REAL slab's rectangle holds it (one table row per slab: rectangle, twin mapping, texture layer) →
// sample THAT slab's own twin (texture-array layer, mip level from the true screen footprint) →
// thin joints at the slab's edges → the room's own light (linear) → blend over the untouched photo
// through the feathered mask, so anything not in the mask (furniture, people, walls) stays exactly
// as photographed. Floor that no photographed slab covers is, by default, the same real slabs repeated
// (u_fillCount > 0): cells as long as the shortest placed slab, each showing one of the placed slabs' own
// twins at its own scale — cropped, never stretched — in turn (neighbours differ), every other cell turned
// 180°, each course offset by half a cell.
// It is a preview of the stone, said so on screen; with the fill off that floor keeps the room's own
// floor (the developer layout view stripes it either way). Derivatives are taken at the top level.

export const MAX_SLABS = 32

export const VERTEX = `#version 300 es
const vec2 P[3] = vec2[3](vec2(-1.0, -1.0), vec2(3.0, -1.0), vec2(-1.0, 3.0));
void main() { gl_Position = vec4(P[gl_VertexID], 0.0, 1.0); }
`

export const FRAGMENT = `#version 300 es
precision highp float;
precision highp int;
precision highp sampler2DArray;
#define MAX_SLABS ${MAX_SLABS}
uniform sampler2D u_room;        // the photo, SRGB8_ALPHA8 (sampled as linear)
uniform sampler2D u_mask;        // R8 feathered surface mask
uniform sampler2DArray u_slabs;  // one layer per real slab's twin, SRGB8_ALPHA8 + mipmaps
uniform sampler2D u_shade;       // R16F light relative to the floor's typical light
uniform vec2 u_size;             // render size (px)
uniform mat3 u_hinv;             // image px -> plane cm (w > 0 on the plane)
uniform vec2 u_origin;           // layout frame origin (floor cm)
uniform vec2 u_rot;              // layout frame direction (cos, sin)
uniform vec4 u_rect[MAX_SLABS];  // each slab's rectangle in the frame (x0, y0, x1, y1), cm
uniform vec4 u_uvA[MAX_SLABS];   // its twin uv at (x0, y0), and per unit of local x
uniform vec4 u_uvB[MAX_SLABS];   // its twin uv per unit of local y; texture layer; 1 = twin loaded
uniform int u_count;             // slabs in the table
uniform int u_fillCount;         // table rows the rest of the floor repeats (0 = real slabs only)
uniform int u_fillRow[MAX_SLABS];// those rows
uniform vec2 u_fillOrigin;       // a repeat cell's corner (the picked slab's), frame cm
uniform vec2 u_fillSize;         // a repeat cell (the picked slab's size), cm
uniform float u_joint;           // joint width (cm)
uniform float u_jointDark;       // how dark a joint reads (0–1)
uniform float u_inset;           // share of each slab edge hidden under the joint (twin edge artefacts)
uniform float u_exposure;        // stone brightness in this photo
uniform float u_shadeMix;        // 0 = flat light … 1 = the room's light fully
uniform int u_mode;              // 0 visualisation, 1 original photo, 2 selection preview; dev: 3 light map, 4 layout
uniform vec3 u_tint;             // selection preview colour (linear)
out vec4 outColor;

vec3 encodeSRGB(vec3 c) {
  c = clamp(c, 0.0, 1.0);
  vec3 lo = c * 12.92;
  vec3 hi = 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055;
  return mix(lo, hi, step(vec3(0.0031308), c));
}

void main() {
  vec2 px = vec2(gl_FragCoord.x, u_size.y - gl_FragCoord.y);
  vec2 uv = px / u_size;
  vec3 room = texture(u_room, uv).rgb;
  float a = texture(u_mask, uv).r;
  float s = texture(u_shade, uv).r;

  vec3 p = u_hinv * vec3(px, 1.0);
  float onPlane = step(1e-6, p.z);
  vec2 f = p.xy / max(p.z, 1e-6);
  vec2 d = f - u_origin;
  vec2 g = vec2(u_rot.x * d.x + u_rot.y * d.y, -u_rot.y * d.x + u_rot.x * d.y);
  vec2 dgx = dFdx(g), dgy = dFdy(g); // the pixel's footprint on the floor (top level)

  // which real slab covers this floor point
  int hit = -1;
  vec4 R = vec4(0.0), A = vec4(0.0), B = vec4(0.0);
  for (int i = 0; i < MAX_SLABS; i++) {
    if (i >= u_count) break;
    vec4 r = u_rect[i];
    if (g.x >= r.x && g.x < r.z && g.y >= r.y && g.y < r.w) { hit = i; R = r; A = u_uvA[i]; B = u_uvB[i]; break; }
  }

  // floor no real slab covers: a repeat cell, showing one placed slab's own twin at that slab's scale
  bool filled = false;
  bool turned = false;
  vec2 own = vec2(1.0);
  if (hit < 0 && u_fillCount > 0) {
    vec2 q = g - u_fillOrigin;
    float cy = floor(q.y / u_fillSize.y);
    float shift = mod(cy, 2.0) * 0.5 * u_fillSize.x;
    float cx = floor((q.x - shift) / u_fillSize.x);
    vec2 c0 = u_fillOrigin + vec2(cx * u_fillSize.x + shift, cy * u_fillSize.y);
    // which slab: cx + 2·cy (mod n) — side by side always differ, and with three or more slabs a cell also
    // differs from the two it is offset over in the course before (deterministic: no hash clumps)
    int row = u_fillRow[min(int(mod(cx + 2.0 * cy, float(u_fillCount))), u_fillCount - 1)];
    R = vec4(c0, c0 + u_fillSize); A = u_uvA[row]; B = u_uvB[row];
    own = u_rect[row].zw - u_rect[row].xy;
    turned = mod(cx + cy, 2.0) > 0.5;
    filled = true;
  }

  vec3 stone = vec3(0.0);
  float joint = 0.0;
  if (hit >= 0 || filled) {
    vec2 sz = R.zw - R.xy;
    vec2 l = (g - R.xy) / sz;
    // a repeat cell: turned (or not), then that slab's own scale — the cell crops it, never stretches it
    if (filled) { l = turned ? 1.0 - l : l; l *= sz / own; sz = own; }
    vec2 tuv = A.xy + l.x * A.zw + l.y * B.xy;
    vec2 gx = (dgx.x / sz.x) * A.zw + (dgx.y / sz.y) * B.xy;
    vec2 gy = (dgy.x / sz.x) * A.zw + (dgy.y / sz.y) * B.xy;
    float k = 1.0 - 2.0 * u_inset;
    // that slab's own twin; a neutral grey for the moment its picture is still loading
    stone = B.w > 0.5 ? textureGrad(u_slabs, vec3(u_inset + tuv * k, B.z), gx * k, gy * k).rgb : vec3(0.42);
    // joint coverage at this slab's edges (box filter): far joints fade instead of drawing a grid
    vec2 e = min(g - R.xy, R.zw - g);
    float de = min(e.x, e.y);
    float fw = max(e.x < e.y ? abs(dgx.x) + abs(dgy.x) : abs(dgx.y) + abs(dgy.y), 1e-4);
    float lo = max(de - 0.5 * fw, -0.5 * u_joint), hi = min(de + 0.5 * fw, 0.5 * u_joint);
    joint = clamp((hi - lo) / fw, 0.0, 1.0);
    stone *= 1.0 - u_jointDark * joint;
  }
  vec3 lit = stone * u_exposure * mix(1.0, s, u_shadeMix);

  // dev layout view: floor no photographed slab covers, as light diagonal stripes over a faded photo
  float t = fract((g.x + g.y) / 18.0);
  float sw = max((abs(dgx.x + dgx.y) + abs(dgy.x + dgy.y)) / 18.0, 1e-3);
  float stripe = clamp((0.25 - abs(t - 0.5)) / sw + 0.5, 0.0, 1.0);
  float grey = dot(room, vec3(0.2126, 0.7152, 0.0722));
  vec3 bare = mix(vec3(grey * 0.6 + 0.25), vec3(0.93, 0.92, 0.9), 0.65 * stripe);

  vec3 result = room;
  if (u_mode == 2) {
    result = mix(room, u_tint, 0.45 * a);
  } else if (u_mode == 0 && u_count > 0 && (hit >= 0 || filled)) {
    // the real slabs, and (fill on) their repeats; with the fill off the rest stays the room's own floor
    result = mix(room, lit, a * onPlane);
  } else if (u_mode == 3) {
    // the room's light as applied (0.5 = typical), over a dimmed photo
    result = mix(room * 0.25, vec3(clamp(0.5 * s, 0.0, 1.0)), a);
  } else if (u_mode == 4) {
    // the slabs as placed, each its own colour (by layer), joints red, uncovered floor striped
    float h = fract(B.z * 0.618034);
    vec3 tag = clamp(abs(fract(vec3(h) + vec3(0.0, 0.667, 0.333)) * 6.0 - 3.0) - 1.0, 0.0, 1.0);
    vec3 grid = hit >= 0 ? mix(tag * 0.8 + 0.1, vec3(1.0, 0.0, 0.0), clamp(joint * 4.0, 0.0, 1.0)) : bare;
    result = mix(room, grid, onPlane * (0.3 + 0.4 * a));
  }
  outColor = vec4(encodeSRGB(result), 1.0);
}
`
