import { test, expect } from "@playwright/test";

/** Critical paths: the homepage → demo funnel, and the contact form's
 *  accessible validation (RHF + Zod). */

test("homepage demo CTA reaches the demo", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("link", { name: /Try the full demo/i })
    .first()
    .click();
  await expect(page).toHaveURL(/\/demo/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/A full yard/i);
});

test("homepage honesty section is present and plain", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /doesn.t do\. Yet/i })).toBeVisible();
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
  await expect(page.getByText(/concessions included/i)).toBeVisible();
  await expect(page.getByText(/Keep your accounting software/i)).toBeVisible();
});
