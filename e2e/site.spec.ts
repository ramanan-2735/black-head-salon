import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const pages = [
  { path: "/", heading: /Sharp is a/ },
  { path: "/services", heading: /Services/ },
  { path: "/lookbook", heading: /lookbook/ },
];

for (const { path, heading } of pages) {
  test(`${path} has one h1 and no WCAG 2.x A/AA violations`, async ({ page }) => {
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(heading);

    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
    expect(results.violations).toEqual([]);
  });
}

for (const { path } of pages) {
  test(`${path} does not scroll horizontally`, async ({ page }) => {
    await page.goto(path);
    const overflows = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(overflows).toBe(false);
  });
}

test("home shows the booking CTA and services preview", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: "Book an appointment" }).first()).toHaveAttribute(
    "href",
    "/book",
  );
  await expect(page.getByRole("heading", { name: "Classic Cut" })).toBeVisible();
});

test("services page lists each category with its prices", async ({ page }) => {
  await page.goto("/services");
  await expect(page.getByRole("heading", { name: "Haircuts" })).toBeVisible();
  await expect(page.getByText("₹300")).toBeVisible();
  await expect(page.getByRole("link", { name: "Book Classic Cut" })).toHaveAttribute(
    "href",
    "/book?service=classic-cut",
  );
});

test("lookbook filter narrows the gallery and the lightbox opens", async ({ page }) => {
  await page.goto("/lookbook");
  const looks = page.getByRole("button", { name: /^View:/ });
  await expect(looks).toHaveCount(3);

  await page.getByRole("button", { name: "Fades", exact: true }).click();
  await expect(looks).toHaveCount(1);
  await expect(page.getByRole("button", { name: "Fades", exact: true })).toHaveAttribute(
    "aria-pressed",
    "true",
  );

  await page.getByRole("button", { name: "All", exact: true }).click();
  await looks.first().click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("link", { name: "Book this look" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
});

test("skip link moves focus to main content", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main")).toBeVisible();
});

test("lookbook credits each cut to a barber and links the Instagram handle", async ({ page }) => {
  await page.goto("/lookbook");
  await expect(
    page.getByText("Cut by Sample barber 1 · Fade & Beard Sculpt").first(),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: /@blackheadsalon/ }).first()).toHaveAttribute(
    "href",
    "https://www.instagram.com/blackheadsalon/",
  );
});
