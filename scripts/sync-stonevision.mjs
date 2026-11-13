// StoneVision's engine, vendored from the StoneX app (GalacticVraj/stonevl) into src/vendor/stonex-vision.
//
//   node scripts/sync-stonevision.mjs <StoneX checkout>   copy the engine from that checkout (its committed
//                                                         state), re-apply the website's edits, write MANIFEST.json
//   node scripts/sync-stonevision.mjs --check             (npm run vendor:check, in CI) fail if any vendored
//                                                         file differs from MANIFEST.json, or one is added/missing
//
// Every vendored file is StoneX's own, byte for byte, except the edits below ("SHILATEQ EDIT" in the file):
// a hand edit anywhere else changes a hash and fails the check — re-sync from StoneX instead.
// Hashes are of the text with CRLF read as LF, so a Windows checkout (autocrlf) and CI's Linux one agree.
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, posix, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const VENDOR = join(ROOT, "src/vendor/stonex-vision");
const MANIFEST = join(VENDOR, "MANIFEST.json");

// The engine's files, by their path under StoneX's src/ (the demo's imports and everything they import).
const FILES = [
  "components/vision/visionText.js",
  "lib/vision/capabilities.js",
  "lib/vision/client.js",
  "lib/vision/config.js",
  "lib/vision/core.js",
  "lib/vision/exif.js",
  "lib/vision/floorDepth.js",
  "lib/vision/floorPlan.js",
  "lib/vision/geometry/camera.js",
  "lib/vision/geometry/floor.js",
  "lib/vision/geometry/lines.js",
  "lib/vision/geometry/vanishing.js",
  "lib/vision/image.js",
  "lib/vision/layout.js",
  "lib/vision/lighting.js",
  "lib/vision/mask.js",
  "lib/vision/renderer/VisionRenderer.js",
  "lib/vision/renderer/shaders.js",
  "lib/vision/segment/assets.js",
  "lib/vision/segment/magicTouch.js",
  "lib/vision/segment/models.json",
  "lib/vision/segment/postprocess.js",
  "lib/vision/segment/regionGrow.js",
  "lib/vision/segment/sam.js",
  "lib/vision/segment/samOrt.js",
  "lib/vision/session.js",
  "lib/vision/stroke.js",
  "lib/vision/vision.worker.js",
  "lib/visualizer/engine.js",
  "lib/visualizer/twin.js",
  "utils/image.js",
];

// The website's edits: Vite-only imports a Next build can't take. Each `from` must be found exactly once.
const EDITS = {
  "lib/vision/config.js": [
    [
      "export const VISION_ASSET_BASE = import.meta.env?.VITE_VISION_ASSET_BASE || '/vision-assets/'",
      "// SHILATEQ EDIT: the website serves them from its own public/vision-assets (see its NOTICE)\n" +
        "export const VISION_ASSET_BASE = '/vision-assets/'",
    ],
  ],
  "lib/vision/core.js": [
    [
      "import ortWasmUrl from 'onnxruntime-web/ort-wasm-simd-threaded.wasm?url'",
      "// SHILATEQ EDIT: no Vite `?url` import here: the website serves the pinned copy beside the models\n" +
        "const ortWasmUrl = `${VISION_ASSET_BASE}ort/@ORT_VERSION@/ort-wasm-simd-threaded.wasm`", // (StoneX's, from samOrt.js)
    ],
  ],
  "lib/vision/segment/samOrt.js": [
    ["/* global __VISION_WEBGPU__ */\n", ""],
    [
      "import { fetchAsset, downloadFailed } from './assets.js'\n",
      "import { fetchAsset, downloadFailed } from './assets.js'\nimport { VISION_ASSET_BASE } from '../config.js'\n",
    ],
    [
      "const loadOrt = (backend) => (backend !== 'webgpu' ? import('onnxruntime-web/wasm').catch((err) => { throw downloadFailed('onnxruntime-web/wasm', err) })\n" +
        "  : __VISION_WEBGPU__ ? import('onnxruntime-web/webgpu')\n" +
        "    : Promise.reject(",
      "// SHILATEQ EDIT: ORT's own self-contained ES module (ort.wasm.bundle.min.mjs, MIT), served beside the\n" +
        "// models and imported at run time (no npm package, nothing bundled); the WebGPU build is not shipped.\n" +
        "const ORT_URL = `${VISION_ASSET_BASE}ort/${ORT_VERSION}/ort.wasm.bundle.min.mjs`\n" +
        "const loadOrt = (backend) => (backend !== 'webgpu'\n" +
        "  ? import(/* webpackIgnore: true */ /* turbopackIgnore: true */ new URL(ORT_URL, self.location.origin).href).catch((err) => { throw downloadFailed('onnxruntime-web/wasm', err) })\n" +
        "  : Promise.reject(",
    ],
  ],
};

const fail = (msg) => {
  console.error(`sync-stonevision: ${msg}`);
  process.exit(1);
};
const sha256 = (text) => createHash("sha256").update(text.replace(/\r\n/g, "\n")).digest("hex");
const listVendor = (dir = VENDOR) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory()
      ? listVendor(join(dir, e.name))
      : [relative(VENDOR, join(dir, e.name)).replaceAll("\\", "/")],
  );

function check() {
  if (!existsSync(MANIFEST)) fail("no MANIFEST.json: run the sync first");
  const { files } = JSON.parse(readFileSync(MANIFEST, "utf8"));
  const bad = [];
  for (const f of listVendor().filter((f) => f !== "MANIFEST.json"))
    if (!files[f]) bad.push(`${f}: not in the manifest`);
    else if (sha256(readFileSync(join(VENDOR, f), "utf8")) !== files[f])
      bad.push(`${f}: edited by hand`);
  for (const f of Object.keys(files)) if (!existsSync(join(VENDOR, f))) bad.push(`${f}: missing`);
  if (bad.length)
    fail(
      `src/vendor/stonex-vision differs from its manifest:\n  ${bad.join("\n  ")}\n` +
        "Change the engine in StoneX and re-sync (node scripts/sync-stonevision.mjs <StoneX checkout>).",
    );
  console.log(`sync-stonevision: ${Object.keys(files).length} vendored files match the manifest`);
}

/** StoneX's twin.js is the slab-capture pipeline (2,800 lines); the floor geometry needs only estimateAspect. */
function twinExtract(src, eol) {
  const lines = src.split(eol);
  const round = lines.find((l) => l.startsWith("const round = "));
  const at = lines.findIndex((l) => l.startsWith("export function estimateAspect("));
  const doc = lines.slice(0, at).findLastIndex((l) => l === "/**");
  const end = lines.findIndex((l, i) => i > at && l === "}");
  if (!round || at < 0 || doc < 0 || end < 0)
    fail("lib/visualizer/twin.js: estimateAspect not found");
  return [
    "// SHILATEQ EDIT: StoneX's twin.js is the slab-capture pipeline (2,800 lines); the floor geometry",
    "// needs only estimateAspect, copied here verbatim by scripts/sync-stonevision.mjs.",
    round,
    "",
    ...lines.slice(doc, end + 1),
    "",
  ].join(eol);
}

function sync(app) {
  const git = (...a) => execFileSync("git", ["-C", app, ...a], { encoding: "utf8" }).trim();
  const commit = git("rev-parse", "HEAD");
  const dirty = git("status", "--porcelain", "--", ...FILES.map((f) => `src/${f}`));
  if (dirty) fail(`${app} has uncommitted changes to the engine:\n${dirty}`);
  const ortVersion = /const ORT_VERSION = '([^']+)'/.exec(
    readFileSync(join(app, "src/lib/vision/segment/samOrt.js"), "utf8"),
  )?.[1];
  for (const f of ["ort-wasm-simd-threaded.wasm", "ort.wasm.bundle.min.mjs"])
    if (!existsSync(join(ROOT, "public/vision-assets/ort", ortVersion || "?", f)))
      fail(
        `StoneX runs ONNX Runtime Web ${ortVersion}: public/vision-assets/ort/${ortVersion}/${f} is missing`,
      );

  // everything is made and checked first: a failed sync writes nothing
  const out = new Map();
  for (const f of FILES) {
    let text = readFileSync(join(app, "src", f), "utf8");
    const eol = text.includes("\r\n") ? "\r\n" : "\n"; // each file keeps StoneX's line endings
    for (const [from, to] of EDITS[f] || []) {
      const a = from.replaceAll("\n", eol);
      if (text.split(a).length !== 2)
        fail(`${f}: the edit's anchor is not found exactly once:\n${from}`);
      text = text.replace(a, () =>
        to.replaceAll("\n", eol).replaceAll("@ORT_VERSION@", ortVersion),
      );
    }
    if (f === "lib/visualizer/twin.js") text = twinExtract(text, eol);
    // every relative import a vendored file makes must itself be vendored
    for (const [, spec] of text.matchAll(/(?:from|import\()\s*'(\.{1,2}\/[^']+)'/g)) {
      const dep = posix.normalize(posix.join(posix.dirname(f), spec.replace(/\?.*$/, "")));
      if (!FILES.includes(dep))
        fail(`${f} imports ${spec}, which is not vendored: add it to FILES`);
    }
    out.set(f, text);
  }
  for (const f of listVendor())
    if (f !== "MANIFEST.json" && !FILES.includes(f)) fail(`${f} is vendored but not in FILES`);
  const files = {};
  for (const [f, text] of out) {
    mkdirSync(dirname(join(VENDOR, f)), { recursive: true });
    writeFileSync(join(VENDOR, f), text);
    files[f] = sha256(text);
  }
  const manifest = {
    upstream: { repo: "GalacticVraj/stonevl", commit },
    edits: Object.keys(EDITS).concat("lib/visualizer/twin.js"),
    files,
  };
  writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
  console.log(
    `sync-stonevision: ${FILES.length} files from ${commit.slice(0, 7)}, manifest written`,
  );
}

const arg = process.argv[2];
if (arg === "--check") check();
else if (arg) sync(resolve(arg));
else fail("usage: node scripts/sync-stonevision.mjs <StoneX checkout> | --check");
