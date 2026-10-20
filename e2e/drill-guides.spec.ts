import { test, expect } from "@playwright/test";
import guides from "../lib/drill-guides.json";

async function openTraining(page: import("@playwright/test").Page) {
  await page.goto("/");
  await page.getByRole("button", { name: "Build your player’s plan" }).click();
  await page.getByLabel("Player nickname").fill("Riley");
  await page.getByRole("button", { name: "I’m the parent or guardian setting this up" }).click();
  await page.getByRole("button", { name: "Create my plan" }).click();
  await page.getByRole("tab", { name: "Training", exact: true }).click();
}

test("guides credit sources, open the correct references, and never preload external media or award practice credit", async ({ page, context }, testInfo) => {
  const externalRequests: string[] = [];
  const providers = new Set(guides.map(g => new URL(g.resource.url).hostname));
  context.on("request", r => { if (providers.has(new URL(r.url()).hostname)) externalRequests.push(r.url()); });
  // Test link behavior deterministically without relying on provider uptime in CI.
  await context.route(url => providers.has(url.hostname), route => route.fulfill({ contentType: "text/html", body: "<h1>External coaching reference test fixture</h1>" }));
  await openTraining(page);
  for (const guide of guides) {
    await page.getByRole("button", { name: `Open guide: ${guide.title}`, exact: true }).click();
    await expect(page.getByText(guide.steps[0].cue, { exact: true })).toBeVisible();
    await expect(page.getByText(`${guide.resource.kind === "video" ? "Video by" : "Written guide by"} ${guide.resource.provider}`, { exact: true })).toBeVisible();
    await expect(page.locator("video, iframe")).toHaveCount(0);
    const link = page.getByRole("link", { name: `${guide.resource.kind === "video" ? "Watch" : "Read"} on ${guide.resource.provider} (opens a new tab)`, exact: true });
    await expect(link).toHaveAttribute("href", guide.resource.url);
    await expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(externalRequests).toHaveLength(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    if (guide.id === "tee-contact") await page.screenshot({ path: testInfo.outputPath("coaching-reference-guide.png") });
    const popupPromise = page.waitForEvent("popup");
    await link.click();
    const popup = await popupPromise;
    await popup.waitForLoadState();
    expect(popup.url()).toBe(guide.resource.url);
    expect(await popup.evaluate(() => window.opener === null)).toBe(true);
    await popup.close();
    externalRequests.length = 0;
    await expect(page.getByRole("button", { name: "Close guide", exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Close guide", exact: true }).click();
  }
  const state = await page.evaluate(() => JSON.parse(localStorage.getItem("practicepal-storage")!).state);
  expect(state.logs).toHaveLength(0);
  expect(state.practiceSessions).toHaveLength(0);
});

test("practice cues work offline and closing a nested guide preserves the active timer", async ({ page, context }) => {
  await openTraining(page);
  await context.setOffline(true);
  await page.getByRole("button", { name: "Open guide: Tee contact ladder", exact: true }).click();
  await expect(page.getByText(guides[0].steps[0].cue, { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Close guide", exact: true }).click();
  await context.setOffline(false);
  await page.getByRole("button", { name: "Practice: Tee contact ladder", exact: true }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Open guide: Tee contact ladder", exact: true }).click();
  await expect(page.getByText("Your practice cues", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Close guide", exact: true }).click();
  await page.getByRole("button", { name: "Start timer", exact: true }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Open guide: Tee contact ladder", exact: true }).click();
  await expect(page.getByText("Your practice cues", { exact: true })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByText("Your practice cues", { exact: true })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Pause timer", exact: true })).toBeVisible();
});
