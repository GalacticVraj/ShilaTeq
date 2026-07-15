import { test, expect } from "@playwright/test";

/** Demo flow: the funnel's keystone. Overview → steps → completion, with
 *  deep-links, progress, and resume. */

test("overview lists all six steps and a start CTA", async ({ page }) => {
  await page.goto("/demo");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/A full yard/i);
  await expect(page.getByRole("link", { name: /Start the walkthrough/i })).toBeVisible();
  // the static overview lists all 6 step titles (crawlable)
  await expect(page.getByText(/Find a block — with a typo/i)).toBeVisible();
  await expect(page.getByText(/See the public showroom/i)).toBeVisible();
});

test("walkthrough advances and shows honest progress", async ({ page }) => {
  await page.goto("/demo");
  await page.getByRole("link", { name: /Start the walkthrough/i }).click();
  await expect(page).toHaveURL(/step=1/);
  await expect(page.getByText(/Step 1 of 6/i).first()).toBeVisible();
  await page.getByRole("link", { name: /Next step/i }).click();
  await expect(page).toHaveURL(/step=2/);
  await expect(page.getByText(/Step 2 of 6/i).first()).toBeVisible();
});

test("deep-links to a specific step (the offline-cut key beat)", async ({ page }) => {
  await page.goto("/demo?step=4");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/Hindi, offline/i);
  await expect(page.getByText(/Step 4 of 6/i).first()).toBeVisible();
});

test("completion shows the qualification and the real-yard line", async ({ page }) => {
  await page.goto("/demo?step=done");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/Real yard\. Real stone/i);
  await expect(page.getByText(/make it about/i)).toBeVisible();
});

test("resume offer appears after visiting a step", async ({ page }) => {
  await page.goto("/demo?step=3");
  await page.goto("/demo");
  await expect(page.getByRole("link", { name: /Continue at step 3/i })).toBeVisible();
});
