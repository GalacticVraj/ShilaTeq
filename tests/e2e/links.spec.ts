import { test, expect } from "@playwright/test";

/** Broken-link guard: gather every internal link from key hub pages (which
 *  include the footer) and assert each resolves. Catches dangling routes. */

const seeds = ["/", "/product", "/why", "/resources", "/legal", "/about"];

test("no broken internal links across hub pages + footer", async ({ page, request }) => {
  const targets = new Set<string>();
  for (const seed of seeds) {
    await page.goto(seed);
    const hrefs = await page
      .locator("a[href^='/']")
      .evaluateAll((els) => els.map((e) => (e as HTMLAnchorElement).getAttribute("href") || ""));
    for (const h of hrefs) {
      const clean = h.split("#")[0].split("?")[0];
      if (clean && !clean.startsWith("/_next")) targets.add(clean);
    }
  }

  const broken: string[] = [];
  for (const t of targets) {
    const res = await request.get(t);
    if (res.status() >= 400) broken.push(`${t} → ${res.status()}`);
  }
  expect(broken, broken.join("\n")).toEqual([]);
});
