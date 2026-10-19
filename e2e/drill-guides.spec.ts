import { test, expect } from "@playwright/test";
import guides from "../lib/drill-guides.json";

async function openTraining(page: import("@playwright/test").Page) {
  await page.goto("/");
  await page.getByRole("button", { name: "Build your player’s plan" }).click();
  await page.getByLabel("Player nickname").fill("Riley");
  await page
    .getByRole("button", { name: "I’m the parent or guardian setting this up" })
    .click();
  await page.getByRole("button", { name: "Create my plan" }).click();
  await page.getByRole("tab", { name: "Training", exact: true }).click();
}

test("every original guide plays, slows down, replays, and closes without credit", async ({
  page,
}, testInfo) => {
  const mediaRequests: string[] = [];
  page.on("request", (r) => {
    if (/\.(mp4|webm)(\?|$)/.test(r.url())) mediaRequests.push(r.url());
  });
  await openTraining(page);
  // Thumbnails don't preload six videos or start motion while browsing.
  expect(mediaRequests).toHaveLength(0);
  for (const guide of guides) {
    await page
      .getByRole("button", { name: `Watch guide: ${guide.title}`, exact: true })
      .click();
    const video = page.locator("video");
    await expect(video).toBeVisible();
    await expect
      .poll(() => video.evaluate((v: HTMLVideoElement) => v.readyState))
      .toBeGreaterThanOrEqual(1);
    expect(await video.evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
    expect(
      await video.evaluate((v: HTMLVideoElement) => v.duration),
    ).toBeCloseTo(18, 0);
    await expect(
      page.getByText(guide.steps[0].cue, { exact: true }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Play guide", exact: true }).click();
    await expect
      .poll(() => video.evaluate((v: HTMLVideoElement) => v.currentTime))
      .toBeGreaterThan(0.2);
    await page
      .getByRole("button", { name: "Slow motion", exact: true })
      .click();
    expect(await video.evaluate((v: HTMLVideoElement) => v.playbackRate)).toBe(
      0.5,
    );
    await page
      .getByRole("button", { name: "Pause guide", exact: true })
      .click();
    expect(await video.evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
    if (guide.id === "tee-contact") {
      await video.evaluate((v: HTMLVideoElement) => {
        v.playbackRate = 1;
        v.currentTime = v.duration - 0.12;
      });
      await page
        .getByRole("button", { name: "Play guide", exact: true })
        .click();
      await expect(
        page.getByRole("button", { name: "Replay guide", exact: true }),
      ).toBeVisible();
      await page
        .getByRole("button", { name: "Replay guide", exact: true })
        .click();
      await expect
        .poll(() => video.evaluate((v: HTMLVideoElement) => v.currentTime))
        .toBeLessThan(2);
      await page
        .getByRole("button", { name: "Pause guide", exact: true })
        .click();
      await page.screenshot({
        path: testInfo.outputPath("original-guide.png"),
      });
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page
      .getByRole("button", { name: "Close guide", exact: true })
      .click();
    await expect(page.locator("video")).toHaveCount(0);
  }
  await page.getByRole("tab", { name: "Today", exact: true }).click();
  const state = await page.evaluate(
    () => JSON.parse(localStorage.getItem("practicepal-storage")!).state,
  );
  expect(state.logs).toHaveLength(0);
  expect(state.practiceSessions).toHaveLength(0);
});

test("failed video keeps instructions available and a guide works inside practice setup", async ({
  page,
}) => {
  await openTraining(page);
  await page.route("**/drills/v1/*.mp4", (r) => r.abort());
  await page
    .getByRole("button", {
      name: "Watch guide: Tee contact ladder",
      exact: true,
    })
    .click();
  await expect(page.getByRole("alert")).toContainText("couldn’t load");
  await expect(
    page.getByText(guides[0].steps[0].cue, { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Close guide", exact: true }).click();
  await page.unroute("**/drills/v1/*.mp4");
  await page
    .getByRole("button", { name: "Practice: Tee contact ladder", exact: true })
    .click();
  await page
    .getByRole("dialog")
    .getByRole("button", {
      name: "Watch guide: Tee contact ladder",
      exact: true,
    })
    .click();
  await expect(page.locator("video")).toBeVisible();
  await page.getByRole("button", { name: "Close guide", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Start timer", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Start timer", exact: true }).click();
  await page
    .getByRole("dialog")
    .getByRole("button", {
      name: "Watch guide: Tee contact ladder",
      exact: true,
    })
    .click();
  await expect(page.locator("video")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator("video")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Pause timer", exact: true }),
  ).toBeVisible();
});
