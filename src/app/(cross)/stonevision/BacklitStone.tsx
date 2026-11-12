"use client";

import { useEffect, useRef, useState } from "react";

export type GlowStone = { name: string; src: string };

// The light passing through the stone (WebGL 1, so it runs on any phone that can show the page):
//   · it spreads inside the slab at several depths: the slab's own photo, sharp, and its mip levels
//     (the GPU's own smaller copies, so the blur costs nothing) mixed by how far the light has gone;
//   · denser, darker veins let much less through (stone^2), so they stand dark against the glow;
//   · the further from the lamp, the more the stone has absorbed: pale gold at the core, deep amber out;
//   · the polished face catches a little of the room light, more toward the top;
//   · tone-mapped, and dithered so the dark falloff never bands.
const VERT = `attribute vec2 p; varying vec2 uv;
void main(){ uv = p * 0.5 + 0.5; uv.y = 1.0 - uv.y; gl_Position = vec4(p, 0.0, 1.0); }`;
const FRAG = `precision mediump float; varying vec2 uv;
uniform sampler2D slab; uniform vec2 lamp; uniform vec2 crop; uniform vec2 off; uniform float aspect, power;
vec3 lin(vec3 c){ return pow(c, vec3(2.2)); }
void main(){
  vec2 t = off + uv * crop;
  vec3 s  = lin(texture2D(slab, t).rgb);
  vec3 m1 = lin(texture2D(slab, t, 2.0).rgb);
  vec3 m2 = lin(texture2D(slab, t, 4.0).rgb);
  vec2 d = (uv - lamp) * vec2(aspect, 1.0);
  float r = length(d);
  float core = exp(-r * r / 0.02), halo = exp(-r * r / 0.1), wide = exp(-r * r / 0.45);
  vec3 through = s * 0.72 + m1 * 0.2 + m2 * 0.08;
  vec3 tint = mix(vec3(1.0, 0.88, 0.68), vec3(1.0, 0.52, 0.2), smoothstep(0.05, 0.55, r));
  vec3 lit = pow(through, vec3(2.0)) * tint * power * (2.6 * core + 0.75 * halo + 0.1 * wide) * 2.6;
  float face = 0.002 + 0.005 * (1.0 - uv.y);
  vec3 c = s * 0.005 + lit + face * vec3(0.85, 0.9, 1.0);
  c = c / (1.0 + c * 0.6);
  float n = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
  gl_FragColor = vec4(pow(c, vec3(1.0 / 2.2)) + (n - 0.5) / 255.0, 1.0);
}`;

/**
 * Backlit stone: a thin slab in the dark, a lamp behind it that follows the pointer (a finger drags it
 * on a phone); the stone glows through, its veins dark against the light. The lamp switches on when the
 * section comes into view, and drifts by itself when nobody moves it. Without WebGL: the slab, lit flat.
 */
export default function BacklitStone({ stones }: { stones: GlowStone[] }) {
  const box = useRef<HTMLDivElement>(null);
  const cvs = useRef<HTMLCanvasElement>(null);
  const [at, setAt] = useState(0);
  const [failed, setFailed] = useState(false);
  const setStone = useRef<((src: string) => void) | null>(null);

  useEffect(() => {
    const c = cvs.current!,
      el = box.current!;
    const gl = c.getContext("webgl", { antialias: false, premultipliedAlpha: false });
    if (!gl) {
      queueMicrotask(() => setFailed(true));
      return;
    }
    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      queueMicrotask(() => setFailed(true));
      return;
    }
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const u = (n: string) => gl.getUniformLocation(prog, n);
    const slab = gl.createTexture()!;
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, slab);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.uniform1i(u("slab"), 0);
    let imgAspect = 1;

    // a slab: its photo, drawn to 2048 × 1024 (a power of two, so the GPU makes its mip levels; the
    // stretch is undone when it's drawn, from the photo's own shape)
    setStone.current = (src) => {
      const img = new Image();
      img.src = src;
      img.decode().then(() => {
        const pot = document.createElement("canvas");
        pot.width = 2048;
        pot.height = 1024;
        pot.getContext("2d")!.drawImage(img, 0, 0, pot.width, pot.height);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, slab);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, pot);
        gl.generateMipmap(gl.TEXTURE_2D);
        imgAspect = img.naturalWidth / img.naturalHeight;
      });
    };
    setStone.current(stones[0].src);

    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lamp = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, at: -1e9 };
    let power = still ? 1 : 0,
      on = false,
      raf = 0;
    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      if (!on && power <= 0.001) return;
      const dpr = Math.min(2, devicePixelRatio || 1);
      const w = Math.round(c.clientWidth * dpr),
        h = Math.round(c.clientHeight * dpr);
      if (c.width !== w || c.height !== h) {
        c.width = w;
        c.height = h;
        gl.viewport(0, 0, w, h);
      }
      if (!still && now - lamp.at > 4000) {
        lamp.tx = 0.5 + 0.34 * Math.sin(now / 2300);
        lamp.ty = 0.5 + 0.22 * Math.sin(now / 1700);
      }
      lamp.x += (lamp.tx - lamp.x) * 0.1;
      lamp.y += (lamp.ty - lamp.y) * 0.1;
      if (!still) power += ((on ? 1 : 0) - power) * 0.035; // the lamp warms up, and dims when away
      const frameAspect = w / h;
      // cover: show the middle of the slab at the frame's shape
      const sx = frameAspect > imgAspect ? 1 : frameAspect / imgAspect;
      const sy = frameAspect > imgAspect ? imgAspect / frameAspect : 1;
      gl.uniform2f(u("crop"), sx, sy);
      gl.uniform2f(u("off"), (1 - sx) / 2, (1 - sy) / 2);
      gl.uniform2f(u("lamp"), lamp.x, lamp.y);
      gl.uniform1f(u("aspect"), frameAspect);
      gl.uniform1f(u("power"), power * (1 + 0.03 * Math.sin(now / 900)));
      el.style.setProperty("--lx", lamp.x.toFixed(3));
      el.style.setProperty("--ly", lamp.y.toFixed(3));
      el.style.setProperty("--lp", power.toFixed(3));
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    raf = requestAnimationFrame(draw);
    const io = new IntersectionObserver(([e]) => (on = e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" && !e.buttons) return;
      const r = c.getBoundingClientRect();
      lamp.tx = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
      lamp.ty = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
      lamp.at = performance.now();
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerdown", move);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerdown", move);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- once; stones change through setStone
  }, []);

  return (
    <div ref={box} className="v-glow">
      <span className="v-glow__spill" aria-hidden="true" />
      <div className="v-glow__panel">
        {failed ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={stones[at].src} alt={`${stones[at].name} slab`} className="v-glow__flat" />
        ) : (
          <canvas
            ref={cvs}
            className="v-glow__canvas"
            role="img"
            aria-label={`${stones[at].name}, lit from behind`}
          />
        )}
        <span className="v-glow__tag" aria-hidden="true">
          {stones[at].name} · lit from behind
        </span>
      </div>
      {stones.length > 1 && (
        <div className="v-glow__stones" role="group" aria-label="The stone">
          {stones.map((s, i) => (
            <button
              key={s.name}
              type="button"
              aria-pressed={i === at}
              onClick={() => {
                setAt(i);
                setStone.current?.(s.src);
              }}
            >
              {s.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
