/**
 * The Register's WebGL2 renderer: the crumpling paper and its contact shadow,
 * drawn on a transparent canvas over the (non-WebGL) stone layer. No
 * dependencies. Created only on explicit visitor intent.
 *
 * PAPER — a grid mesh deformed in the vertex shader. Creases are sums of
 * bounded "tent" functions along random fold lines (piecewise-flat facets,
 * like real crumpled paper); the sheet then gathers toward the grab point and
 * wraps onto a ball. Facet normals come from screen-space derivatives, so
 * lighting is flat per facet with crisp creases.
 *
 * Everything is in CSS pixels of the stage (y down); the perspective camera is
 * placed so the z = 0 plane maps 1:1 onto the stage. The single `p` input is
 * the crumple progress — a future pre-rendered frame sequence can replace this
 * renderer behind the same interface.
 */

export type PaperRect = { cx: number; cy: number; w: number; h: number; rot: number };

export type FrameState = {
  p: number; // crumple 0..1
  lift: number; // 0..1
  grabX: number; // paper-local px, centre origin
  grabY: number;
  offX: number; // throw offset, stage px
  offY: number;
  spin: number; // radians
  alpha: number; // paper opacity
};

export type Engine = {
  resize(cssW: number, cssH: number, dpr: number): void;
  setPaper(texture: HTMLCanvasElement, rect: PaperRect): void;
  setPaperRect(rect: PaperRect): void;
  /** Draws the paper, or clears the canvas when given null. */
  draw(s: FrameState | null): void;
  dispose(): void;
};

const FOLDS = 14;
const GRID_X = 72;
const GRID_Y = 90;
const TAN_HALF_FOV = 0.2679; // tan(15°)

const VS_FULL = `#version 300 es
void main(){
  vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

/** A soft rounded-rect shadow; it rounds into a disc as the sheet becomes a ball. */
const FS_SHADOW = `#version 300 es
precision highp float;
uniform vec4 u_sh;      // centre (device px, y up), half size (device px)
uniform vec2 u_shRot;   // cos, sin
uniform vec3 u_shSoft;  // blur (device px), strength, corner radius (device px)
out vec4 o;
void main(){
  vec2 d = gl_FragCoord.xy - u_sh.xy;
  d = vec2(u_shRot.x * d.x + u_shRot.y * d.y, -u_shRot.y * d.x + u_shRot.x * d.y);
  vec2 k = abs(d) - (u_sh.zw - u_shSoft.z);
  float sdf = length(max(k, 0.0)) + min(max(k.x, k.y), 0.0) - u_shSoft.z;
  float a = (1.0 - smoothstep(-u_shSoft.x, u_shSoft.x, sdf)) * u_shSoft.y;
  o = vec4(vec3(0.07, 0.06, 0.04) * a, a);
}`;

const VS_PAPER = `#version 300 es
precision highp float;
in vec2 a_uv;
uniform vec2 u_view;
uniform vec2 u_size;
uniform vec2 u_center;
uniform float u_rot;
uniform float u_p;
uniform float u_lift;
uniform vec2 u_grab;
uniform vec2 u_off;
uniform float u_spin;
uniform vec4 u_fold[${FOLDS}];
uniform vec2 u_foldR[${FOLDS}];
out vec3 v_pos;
out vec2 v_uv;
void main(){
  vec2 q = (a_uv - 0.5) * u_size;
  float p = u_p;
  float e = p * p * (3.0 - 2.0 * p);
  float h = 0.0;
  for (int i = 0; i < ${FOLDS}; i++) {
    vec4 f = u_fold[i];
    vec2 r = u_foldR[i];
    float w = smoothstep(r.y, r.y + 0.35, p);
    float s = dot(q, f.xy) - f.z;
    h += w * f.w * max(0.0, r.x - abs(s));
  }
  vec2 rel = q - u_grab;
  float dist = length(rel);
  vec2 dir = dist > 0.001 ? rel / dist : vec2(0.0);
  // gather toward the grab point, with a little asymmetric buckling
  float gather = mix(1.0, 0.42, e);
  vec2 g = u_grab + rel * gather;
  g += vec2(sin(q.y * 0.031 + 1.3), cos(q.x * 0.027 + 0.7)) * 9.0 * e;
  // wrap onto a ball
  float maxRel = length(u_size) * 0.5 + length(u_grab);
  float R = min(u_size.x, u_size.y) * 0.13;
  float wrap = smoothstep(0.42, 1.0, p);
  float ang = clamp(dist / maxRel, 0.0, 1.0) * 2.55;
  vec2 ball = u_grab + dir * R * sin(ang);
  float ballZ = R * (1.0 - cos(ang));
  vec3 pos;
  pos.xy = mix(g, ball, wrap);
  pos.z = h * (0.22 + 0.95 * e) * (1.0 - 0.5 * wrap) + ballZ * wrap;
  pos.z += u_lift * 16.0 + e * 60.0;
  float cs = cos(u_spin), sn = sin(u_spin);
  vec2 rp = pos.xy - u_grab;
  pos.xy = u_grab + vec2(cs * rp.x - sn * rp.y, sn * rp.x + cs * rp.y);
  float cr = cos(u_rot), sr = sin(u_rot);
  vec2 wp = vec2(cr * pos.x - sr * pos.y, sr * pos.x + cr * pos.y) + u_center + u_off;
  vec3 world = vec3(wp, pos.z);
  v_pos = world;
  v_uv = a_uv;
  float D = (u_view.y * 0.5) / ${TAN_HALF_FOV};
  vec3 vv = vec3(world.x - u_view.x * 0.5, u_view.y * 0.5 - world.y, world.z - D);
  float f = 1.0 / ${TAN_HALF_FOV};
  float n = 1.0, fa = D + 2000.0;
  gl_Position = vec4(vv.x * f * (u_view.y / u_view.x), vv.y * f,
    ((fa + n) / (n - fa)) * vv.z + (2.0 * fa * n / (n - fa)), -vv.z);
}`;

const FS_PAPER = `#version 300 es
precision highp float;
in vec3 v_pos;
in vec2 v_uv;
uniform sampler2D u_tex;
uniform float u_alpha;
uniform float u_p;
out vec4 o;
void main(){
  vec4 t = texture(u_tex, v_uv);
  if (t.a < 0.5) discard;
  vec3 n = normalize(cross(dFdx(v_pos), dFdy(v_pos)));
  if (n.z < 0.0) n = -n;
  // light from the upper left of the stage (y down, z toward the viewer)
  vec3 L = normalize(vec3(-0.45, -0.55, 0.7));
  float ndl = max(dot(n, L), 0.0);
  float diffuse = (0.45 + 0.55 * ndl) / (0.45 + 0.55 * L.z);
  vec3 base = gl_FrontFacing ? t.rgb : vec3(0.925, 0.9, 0.835);
  float ao = mix(1.0, 0.86 + 0.14 * smoothstep(0.0, 140.0, v_pos.z), u_p);
  vec3 c = base * min(diffuse, 1.12) * ao;
  float spec = pow(max(dot(reflect(-L, n), vec3(0.0, 0.0, 1.0)), 0.0), 28.0) * 0.05 * u_p;
  o = vec4((c + spec) * u_alpha, u_alpha);
}`;

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/**
 * Compiles and links without blocking the main thread where the browser
 * supports KHR_parallel_shader_compile: status is only queried once the GPU
 * process reports completion (querying earlier forces a synchronous wait).
 */
async function compile(gl: WebGL2RenderingContext, vs: string, fs: string) {
  const parallel = gl.getExtension("KHR_parallel_shader_compile");
  const prog = gl.createProgram();
  const shaders = (
    [
      [gl.VERTEX_SHADER, vs],
      [gl.FRAGMENT_SHADER, fs],
    ] as const
  ).map(([type, src]) => {
    const sh = gl.createShader(type)!;
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    gl.attachShader(prog, sh);
    return sh;
  });
  gl.linkProgram(prog);
  if (parallel) {
    while (!gl.getProgramParameter(prog, parallel.COMPLETION_STATUS_KHR)) {
      await new Promise((r) => setTimeout(r, 16));
    }
  }
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    const log = shaders.map((s) => gl.getShaderInfoLog(s)).join("\n");
    throw new Error(`${gl.getProgramInfoLog(prog)}\n${log}`);
  }
  shaders.forEach((s) => gl.deleteShader(s));
  return prog;
}

function uniforms(gl: WebGL2RenderingContext, prog: WebGLProgram, names: string[]) {
  return Object.fromEntries(names.map((n) => [n, gl.getUniformLocation(prog, n)])) as Record<
    string,
    WebGLUniformLocation | null
  >;
}

/** Resolves null when WebGL2 is unavailable or would be software-rendered. */
export async function createEngine(canvas: HTMLCanvasElement): Promise<Engine | null> {
  const gl = canvas.getContext("webgl2", {
    alpha: true,
    antialias: true,
    depth: true,
    premultipliedAlpha: true,
    powerPreference: "low-power",
    failIfMajorPerformanceCaveat: true,
  });
  if (!gl) return null;

  let shadowProg: WebGLProgram, paperProg: WebGLProgram;
  try {
    [shadowProg, paperProg] = await Promise.all([
      compile(gl, VS_FULL, FS_SHADOW),
      compile(gl, VS_PAPER, FS_PAPER),
    ]);
  } catch {
    return null;
  }
  const uShadow = uniforms(gl, shadowProg, ["u_sh", "u_shRot", "u_shSoft"]);
  const uPaper = uniforms(gl, paperProg, [
    "u_view",
    "u_size",
    "u_center",
    "u_rot",
    "u_p",
    "u_lift",
    "u_grab",
    "u_off",
    "u_spin",
    "u_fold",
    "u_foldR",
    "u_tex",
    "u_alpha",
  ]);

  const emptyVao = gl.createVertexArray();

  // Paper grid mesh
  const uvs = new Float32Array((GRID_X + 1) * (GRID_Y + 1) * 2);
  for (let y = 0, k = 0; y <= GRID_Y; y++) {
    for (let x = 0; x <= GRID_X; x++) {
      uvs[k++] = x / GRID_X;
      uvs[k++] = y / GRID_Y;
    }
  }
  const idx = new Uint16Array(GRID_X * GRID_Y * 6);
  for (let y = 0, k = 0; y < GRID_Y; y++) {
    for (let x = 0; x < GRID_X; x++) {
      const a = y * (GRID_X + 1) + x;
      const b = a + 1;
      const c = a + GRID_X + 1;
      const d = c + 1;
      idx.set([a, b, c, b, d, c], k);
      k += 6;
    }
  }
  const paperVao = gl.createVertexArray();
  gl.bindVertexArray(paperVao);
  const uvBuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, uvBuf);
  gl.bufferData(gl.ARRAY_BUFFER, uvs, gl.STATIC_DRAW);
  const aUv = gl.getAttribLocation(paperProg, "a_uv");
  gl.enableVertexAttribArray(aUv);
  gl.vertexAttribPointer(aUv, 2, gl.FLOAT, false, 0, 0);
  const idxBuf = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idxBuf);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, idx, gl.STATIC_DRAW);
  gl.bindVertexArray(null);

  // Fold lines (deterministic): staggered thresholds so creases arrive progressively.
  const folds = new Float32Array(FOLDS * 4);
  const foldR = new Float32Array(FOLDS * 2);
  const buildFolds = (w: number, h: number) => {
    const foldScale = Math.min(w, h) / 470;
    const r = seeded(1147);
    for (let i = 0; i < FOLDS; i++) {
      const a = r() * Math.PI;
      folds[i * 4] = Math.cos(a);
      folds[i * 4 + 1] = Math.sin(a);
      folds[i * 4 + 2] = (r() - 0.5) * 0.9 * Math.min(w, h);
      folds[i * 4 + 3] = (r() < 0.5 ? -1 : 1) * (0.32 + r() * 0.5);
      foldR[i * 2] = (55 + r() * 110) * foldScale;
      foldR[i * 2 + 1] = (i / FOLDS) * 0.5;
    }
  };

  let paperTex: WebGLTexture | null = null;
  let rect: PaperRect = { cx: 0, cy: 0, w: 1, h: 1, rot: 0 };
  let cssW = 1;
  let cssH = 1;
  let dpr = 1;
  const setPaperRect = (r: PaperRect) => {
    rect = r;
    buildFolds(r.w, r.h);
  };

  return {
    resize(w, h, ratio) {
      cssW = Math.max(1, w);
      cssH = Math.max(1, h);
      dpr = ratio;
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
    },

    setPaper(texture, r) {
      if (!paperTex) paperTex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, paperTex);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture);
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      setPaperRect(r);
    },

    setPaperRect,

    draw(s) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      if (!s || !paperTex) return;

      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

      // Contact shadow
      gl.disable(gl.DEPTH_TEST);
      gl.useProgram(shadowProg);
      const e = s.p * s.p * (3 - 2 * s.p);
      const ballR = Math.min(rect.w, rect.h) * 0.13;
      const hw = rect.w / 2 + (ballR * 1.25 - rect.w / 2) * e;
      const hh = rect.h / 2 + (ballR * 1.25 - rect.h / 2) * e;
      const lightOff = 5 + s.lift * 5 + e * 12;
      // the ball forms around the grab point
      const gx =
        rect.cx + s.offX + (Math.cos(rect.rot) * s.grabX - Math.sin(rect.rot) * s.grabY) * e;
      const gy =
        rect.cy + s.offY + (Math.sin(rect.rot) * s.grabX + Math.cos(rect.rot) * s.grabY) * e;
      gl.uniform4f(
        uShadow.u_sh,
        (gx + lightOff) * dpr,
        (cssH - (gy + lightOff * 1.3)) * dpr,
        hw * dpr,
        hh * dpr,
      );
      gl.uniform2f(uShadow.u_shRot, Math.cos(-rect.rot), Math.sin(-rect.rot));
      gl.uniform3f(
        uShadow.u_shSoft,
        (8 + 16 * e) * dpr,
        (0.22 + 0.08 * e) * s.alpha,
        Math.min(hw, hh) * e * dpr,
      );
      gl.bindVertexArray(emptyVao);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      // Paper
      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LEQUAL);
      gl.frontFace(gl.CW);
      gl.useProgram(paperProg);
      gl.uniform2f(uPaper.u_view, cssW, cssH);
      gl.uniform2f(uPaper.u_size, rect.w, rect.h);
      gl.uniform2f(uPaper.u_center, rect.cx, rect.cy);
      gl.uniform1f(uPaper.u_rot, rect.rot);
      gl.uniform1f(uPaper.u_p, s.p);
      gl.uniform1f(uPaper.u_lift, s.lift);
      gl.uniform2f(uPaper.u_grab, s.grabX, s.grabY);
      gl.uniform2f(uPaper.u_off, s.offX, s.offY);
      gl.uniform1f(uPaper.u_spin, s.spin);
      gl.uniform4fv(uPaper.u_fold, folds);
      gl.uniform2fv(uPaper.u_foldR, foldR);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, paperTex);
      gl.uniform1i(uPaper.u_tex, 0);
      gl.uniform1f(uPaper.u_alpha, s.alpha);
      gl.bindVertexArray(paperVao);
      gl.drawElements(gl.TRIANGLES, idx.length, gl.UNSIGNED_SHORT, 0);
      gl.bindVertexArray(null);
    },

    dispose() {
      gl.deleteProgram(shadowProg);
      gl.deleteProgram(paperProg);
      gl.deleteBuffer(uvBuf);
      gl.deleteBuffer(idxBuf);
      gl.deleteVertexArray(paperVao);
      gl.deleteVertexArray(emptyVao);
      if (paperTex) gl.deleteTexture(paperTex);
    },
  };
}
