import { expect, test } from "@playwright/test";

test("home shows the static razor image with a meaningful description", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("img", {
      name: "Straight razor with a polished steel blade and a black horn handle",
    }),
  ).toBeVisible();
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("never mounts the 3D canvas, so the static image is the whole hero", async ({ page }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));

    await page.goto("/");
    await expect(page.getByRole("img", { name: /Straight razor/ })).toBeVisible();
    await page.waitForTimeout(1000);

    await expect(page.locator("canvas")).toHaveCount(0);
    expect(pageErrors).toEqual([]);
  });
});
