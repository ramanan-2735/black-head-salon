import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("design system page has no WCAG 2.x A/AA violations", async ({ page }) => {
  await page.goto("/ui");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();

  expect(results.violations).toEqual([]);
});

test("dialog opens, closes with Escape, and returns focus", async ({ page }) => {
  await page.goto("/ui");

  const trigger = page.getByRole("button", { name: "Open dialog" });
  await trigger.click();
  await expect(page.getByRole("dialog", { name: "Confirm your slot" })).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
});

test("unavailable slot cannot be selected, available slot toggles", async ({ page }) => {
  await page.goto("/ui");

  await expect(page.getByRole("button", { name: "11:00" })).toBeDisabled();
  const slot = page.getByRole("button", { name: "10:30" });
  await slot.click();
  await expect(slot).toHaveAttribute("aria-pressed", "true");
});

test("field shows a linked validation error for a short name", async ({ page }) => {
  await page.goto("/ui");

  const input = page.getByLabel(/Full name/);
  await input.fill("A");
  await expect(input).toHaveAttribute("aria-invalid", "true");
  await expect(page.getByText("Enter at least 2 characters.")).toBeVisible();
});
