import { test, expect } from "@playwright/test";

/** StoneVision's page alone is cross-origin isolated (next.config.ts), so its floor model gets
 *  Wasm threads; its workers must still start, and other pages stay as they were. */

test("/stonevision is cross-origin isolated and its floor model runs on threads", async ({
  page,
}) => {
  // ORT starts its thread workers from inside the engine's worker: both scripts passed COEP
  const threads = page.waitForEvent("worker", {
    predicate: (w) => w.url().includes("/vision-assets/ort/"),
    timeout: 60_000,
  });
  const res = await page.goto("/stonevision");
  expect(res?.headers()["cross-origin-embedder-policy"]).toBe("require-corp");
  expect(await page.evaluate(() => self.crossOriginIsolated)).toBe(true);
  await threads;
});

test("other pages are not isolated", async ({ page }) => {
  const res = await page.goto("/");
  expect(res?.headers()["cross-origin-embedder-policy"]).toBeUndefined();
  expect(await page.evaluate(() => self.crossOriginIsolated)).toBe(false);
});
