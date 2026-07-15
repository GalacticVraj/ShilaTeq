import { test, expect } from "@playwright/test";

/** Responsive: the mobile drawer works, and no page overflows horizontally. */

test("mobile nav drawer opens and navigates", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "mobile only");
  await page.goto("/");
  await page.getByRole("button", { name: /open menu/i }).click();
  const drawer = page.locator("#mobile-drawer");
  await expect(drawer).toBeVisible();
  await drawer.getByRole("link", { name: "Pricing", exact: true }).click();
  await expect(page).toHaveURL(/\/pricing$/);
});

const routes = [
  "/",
  "/product/sales-gst",
  "/why/vs-erp",
  "/pricing",
  "/demo?step=4",
  "/docs/features",
];

for (const route of routes) {
  test(`no horizontal overflow: ${route}`, async ({ page }) => {
    await page.goto(route);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    // allow 1px rounding
    expect(overflow, `horizontal overflow on ${route}`).toBeLessThanOrEqual(1);
  });
}
