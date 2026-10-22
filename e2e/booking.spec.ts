import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

/** Picks the first date that has a free time. Sundays are closed in the demo. */
async function pickFirstAvailableSlot(page: Page) {
  const dateButtons = page.getByRole("group", { name: "Dates" }).getByRole("button");
  const count = await dateButtons.count();
  const slot = page.getByRole("button", { name: /^\d{2}:\d{2}$/ }).first();
  for (let index = 0; index < count; index += 1) {
    await dateButtons.nth(index).click();
    // Wait for the times to load, or for the empty-day message, before deciding.
    const found = await slot.waitFor({ state: "visible", timeout: 4000 }).then(
      () => true,
      () => false,
    );
    if (found) {
      await slot.click();
      return;
    }
  }
  throw new Error("No available slot in the next 14 days");
}

/** Each test gets its own number, so the demo repository never sees a duplicate. */
function uniqueMobile(): string {
  return `9${String(Math.floor(Math.random() * 1e9)).padStart(9, "0")}`;
}

async function fillDetails(page: Page, phone: string) {
  await page.getByLabel(/Full name/).fill("Test Customer");
  await page.getByLabel(/Mobile number/).fill(phone);
  await page.getByRole("checkbox").check();
}

test("booking page has no WCAG 2.x A/AA violations on the first step", async ({ page }) => {
  await page.goto("/book");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("appointment");

  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
  expect(results.violations).toEqual([]);
});

test("a service from the menu preselects it and offers barbers with Any available chosen", async ({
  page,
}) => {
  await page.goto("/book?service=beard-trim");
  const barbers = page.getByRole("group", { name: "Choose a barber" });
  await expect(barbers).toBeVisible();
  await expect(barbers.getByRole("button", { name: "Any available" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );

  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByRole("heading", { name: "Choose a date" })).toBeVisible();
});

test("a customer can complete a demo booking in three stages", async ({ page }) => {
  await page.goto("/book?service=classic-cut");
  await page.getByRole("button", { name: "Continue" }).click(); // service & barber

  await pickFirstAvailableSlot(page);
  await page.getByRole("button", { name: "Continue" }).click(); // date & time
  await fillDetails(page, uniqueMobile());

  await page.getByRole("button", { name: "Confirm booking" }).click();

  await expect(page.getByRole("status")).toContainText(/You're booked|Request received/);
  await expect(page.getByRole("status")).toContainText("Demo booking");
});

test("the server rejects a number that isn't an Indian mobile", async ({ page }) => {
  await page.goto("/book?service=classic-cut");
  await page.getByRole("button", { name: "Continue" }).click();
  await pickFirstAvailableSlot(page);
  await page.getByRole("button", { name: "Continue" }).click();
  await fillDetails(page, "1234567890");

  await page.getByRole("button", { name: "Confirm booking" }).click();

  await expect(
    page.getByRole("alert").filter({ hasText: "valid 10-digit mobile number" }),
  ).toBeVisible();
});

test("booking flow does not scroll horizontally on a phone", async ({ page }) => {
  await page.goto("/book?service=classic-cut");
  await page.getByRole("button", { name: "Continue" }).click();
  await pickFirstAvailableSlot(page);

  const overflows = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(overflows).toBe(false);
});
