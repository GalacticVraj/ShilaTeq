import { test, expect } from "@playwright/test";

/** Navigation: the primary paths resolve and render their h1. */

const pages = [
  { path: "/", h1: /whole yard/i },
  { path: "/product", h1: /one system/i },
  { path: "/product/worker-app", h1: /workers/i },
  { path: "/why", h1: /why not/i },
  { path: "/why/vs-tally-accounting", h1: /Tally keeps your books/i },
  { path: "/industries/granite", h1: /gangsaw/i },
  { path: "/pricing", h1: /what ShilaTeq costs/i },
  { path: "/resources", h1: /Learn the trade/i },
  { path: "/guides", h1: /Run your yard better/i },
  { path: "/guides/gangsaw-recovery", h1: /maths of cutting/i },
  { path: "/faq", h1: /Honest answers/i },
  { path: "/docs", h1: /Everything the product does/i },
  { path: "/about", h1: /Stone technology/i },
  { path: "/security", h1: /how it/i },
  { path: "/contact", h1: /A human answers/i },
  { path: "/legal/privacy", h1: /Privacy Policy/i },
];

for (const p of pages) {
  test(`loads ${p.path} with a single h1`, async ({ page }) => {
    const res = await page.goto(p.path);
    expect(res?.status(), `status for ${p.path}`).toBeLessThan(400);
    const h1s = page.locator("h1");
    await expect(h1s).toHaveCount(1);
    await expect(h1s.first()).toContainText(p.h1);
  });
}

test("header nav links navigate", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "mobile", "desktop nav only");
  await page.goto("/");
  await page.getByRole("link", { name: "Product", exact: true }).first().click();
  await expect(page).toHaveURL(/\/product$/);
});

test("404 shows the branded not-found", async ({ page }) => {
  const res = await page.goto("/this-route-does-not-exist");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/isn.t in the yard/i);
});
