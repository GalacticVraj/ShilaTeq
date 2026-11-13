import { test, expect } from "@playwright/test";

/** StoneVision's page alone is cross-origin isolated (next.config.ts), so its floor model gets
 *  Wasm threads; its workers must still start, and other pages stay as they were. */

test("/stonevision is cross-origin isolated and its floor model runs on threads", async ({
  page,
}) => {
  const workers: string[] = [];
  page.on("worker", (w) => workers.push(new URL(w.url()).pathname + new URL(w.url()).search));
  // ORT starts its thread workers from inside the engine's worker: both scripts passed COEP
  const threads = page.waitForEvent("worker", {
    predicate: (w) => w.url().includes("/vision-assets/ort/"),
    timeout: 60_000,
  });
  const res = await page.goto("/stonevision");
  expect(res?.headers()["cross-origin-embedder-policy"]).toBe("require-corp");
  expect(await page.evaluate(() => self.crossOriginIsolated)).toBe(true);
  await threads;
  // A returning visitor's browser keeps, for a year and without COEP, the worker scripts the site served
  // before this page was isolated, and an isolated page can't start a worker from them: the page must use
  // other URLs (next.config.ts outputHashSalt; samOrt.js ORT_URL's ?coi).
  const cachedBeforeIsolation = [
    "/_next/static/chunks/turbopack-worker-1hrsqshz0gfey.js",
    "/vision-assets/ort/1.30.0/ort.wasm.bundle.min.mjs",
  ];
  expect(workers.filter((u) => cachedBeforeIsolation.includes(u))).toEqual([]);
});

test("other pages are not isolated", async ({ page }) => {
  const res = await page.goto("/");
  expect(res?.headers()["cross-origin-embedder-policy"]).toBeUndefined();
  expect(await page.evaluate(() => self.crossOriginIsolated)).toBe(false);
});
