import { test, expect } from "@playwright/test";

test("editorial assets, fonts, and core screens render within the viewport", async ({
  page,
}, testInfo) => {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  expect(
    await page.evaluate(() => document.fonts.check("700 60px BarlowCondensed")),
  ).toBe(true);
  await expect(
    page.getByRole("heading", { name: /Great habits/ }),
  ).toBeVisible();
  const photos = page.locator('img[src*="editorial"]');
  expect(await photos.count()).toBeGreaterThan(0);
  for (const photo of await photos.all())
    expect(
      await photo.evaluate(
        (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
      ),
    ).toBe(true);
  for (const photo of await photos.all())
    expect(
      await photo.evaluate(
        (img) => img.getBoundingClientRect().width <= window.innerWidth,
      ),
    ).toBe(true);
  await page.screenshot({ path: testInfo.outputPath("welcome-ready.png") });
  await page.getByRole("button", { name: "Build your player’s plan" }).click();
  await page.getByLabel("Player nickname").fill("Riley");
  await page
    .getByRole("button", { name: "I’m the parent or guardian setting this up" })
    .click();
  await page.getByRole("button", { name: "Create my plan" }).click();
  await page.getByRole("heading", { name: "Let’s go, Riley." }).waitFor();
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: testInfo.outputPath("today-ready.png") });
  for (const name of ["Today", "Training", "Progress", "Rewards"]) {
    await page.getByRole("tab", { name, exact: true }).click();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: testInfo.outputPath(`${name.toLowerCase()}-screen.png`),
    });
  }
});
