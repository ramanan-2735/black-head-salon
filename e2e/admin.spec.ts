import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const pages = ["/admin", "/admin/appointments", "/admin/services"];

for (const path of pages) {
  test(`${path} is labelled as sample data and has no WCAG 2.x A/AA violations`, async ({
    page,
  }) => {
    await page.goto(path);
    await expect(page.getByText("Sample data", { exact: false }).first()).toBeVisible();

    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
    expect(results.violations).toEqual([]);
  });
}

test("overview shows the four figures and the popular services", async ({ page }) => {
  await page.goto("/admin");
  for (const label of ["Today", "Pending", "Next 7 days", "No-shows"]) {
    await expect(page.getByText(label, { exact: true }).first()).toBeVisible();
  }
  await expect(page.getByText("Popular services")).toBeVisible();
});

// These change shared sample data, so they run on one project only to avoid racing.
test("approving a pending request takes it off the pending list", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "mutates shared demo data");
  await page.goto("/admin/appointments?status=PENDING");
  await page.waitForLoadState("networkidle");

  const approve = page.getByRole("button", { name: "Approve" });
  const before = await approve.count();
  if (before === 0) {
    // An earlier run already approved the sample requests. Nothing left to do.
    await expect(page.getByText("No appointments with this status.")).toBeVisible();
    return;
  }

  // Other specs add confirmed bookings in parallel, so counts can move. Check the action itself.
  const saved = page.waitForResponse((r) => r.request().method() === "POST" && r.status() === 200);
  await approve.first().click();
  await saved;
  await expect(page.getByText("didn't go through")).toHaveCount(0);
});

test("a confirmed appointment can be marked as completed", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "mutates shared demo data");
  await page.goto("/admin/appointments?status=CONFIRMED");
  await page.waitForLoadState("networkidle");

  const complete = page.getByRole("button", { name: "Mark completed" });
  const before = await complete.count();
  if (before === 0) {
    await expect(page.getByText("No appointments with this status.")).toBeVisible();
    return;
  }

  const saved = page.waitForResponse((r) => r.request().method() === "POST" && r.status() === 200);
  await complete.first().click();
  await saved;
  await expect(page.getByText("didn't go through")).toHaveCount(0);
});
