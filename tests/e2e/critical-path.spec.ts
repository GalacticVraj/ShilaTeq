import { test, expect } from "@playwright/test";

/** Critical paths: the homepage register (paper → stone → identity), the
 *  simulated StoneX preview, and the contact form's accessible validation. */

test("the register button replaces the paper with a block identity, and back", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Crumple the register" }).click();
  // Gesture path (~2s) or reduced-motion/no-WebGL swap: either way, the identity arrives.
  await expect(page.getByText(/now lives on as KSH-B0001/)).toBeVisible({ timeout: 6000 });
  const scan = page.getByRole("link", { name: "See what a scan shows" });
  await expect(scan).toHaveAttribute("href", "/b/ksh-b0001");
  await page.getByRole("button", { name: "Restore the register" }).click();
  await expect(page.getByRole("button", { name: "Crumple the register" })).toBeVisible();
});

test("the QR target is a real sample block card", async ({ page }) => {
  const res = await page.goto("/b/ksh-b0001");
  expect(res?.status()).toBe(200);
  await expect(page.getByText(/Sample · what a scanned StoneX label opens/i)).toBeVisible();
  // Safe fields only: never the price the yard paid.
  await expect(page.getByText(/₹/)).toHaveCount(0);
});

test("simulated StoneX search forgives typos and matches codes exactly", async ({ page }) => {
  await page.goto("/");
  const search = page.getByLabel("Find a block");
  const rows = page.getByRole("list", { name: "Sample stock" }).getByRole("button");
  await search.fill("makrna");
  await expect(rows.filter({ hasText: "KSH-B0001" })).toHaveCount(1);
  await search.fill("marbel");
  await expect(rows).toHaveCount(3);
  await search.fill("b0019");
  await expect(rows).toHaveCount(1);
  await expect(page.getByText(/Simulated · sample data · not live/i)).toBeVisible();
});

test("contact form validates required fields (Zod)", async ({ page }) => {
  await page.goto("/contact");
  // form is lazy-loaded; wait for the submit control
  const submit = page.getByRole("button", { name: /Send message/i });
  await submit.waitFor();
  await submit.click();
  await expect(page.getByText(/Please tell us your name/i)).toBeVisible();
  await expect(page.getByText(/Please add a short message/i)).toBeVisible();
});

test("comparison page concedes rows honestly", async ({ page }) => {
  await page.goto("/why");
  // Desktop grid and mobile cards both render the rows; check whichever is visible.
  await expect(
    page
      .getByText(/honestly wins/i)
      .filter({ visible: true })
      .first(),
  ).toBeVisible();
  await expect(
    page
      .getByText(/Keep your accountant/i)
      .filter({ visible: true })
      .first(),
  ).toBeVisible();
});
