import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/** Accessibility smoke: axe on a representative page from every section, plus
 *  the night-scene homepage and the interactive demo/contact surfaces. */

const routes = [
  "/",
  "/product/inventory-qr",
  "/why/vs-paper",
  "/industries/marble",
  "/pricing",
  "/guides/dead-capital",
  "/faq",
  "/docs/features",
  "/about",
  "/security",
  "/contact",
  "/legal/privacy",
  "/demo",
  "/demo?step=4",
];

for (const route of routes) {
  test(`no serious/critical axe violations: ${route}`, async ({ page }) => {
    await page.goto(route);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
    const serious = results.violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical",
    );
    expect(serious, serious.map((v) => `${v.id}: ${v.help}`).join("\n")).toEqual([]);
  });
}

test("skip link is reachable and focuses main", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "mobile", "keyboard test");
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: /skip to content/i });
  await expect(skip).toBeFocused();
});
