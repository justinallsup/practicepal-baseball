import { test, expect, type Page } from "@playwright/test";
async function setup(page: Page) {
  await page.goto("/");
  await page.getByRole("button", { name: "Build your player’s plan" }).click();
  await page.getByLabel("Player nickname").fill("Riley");
  await page
    .getByRole("button", { name: "I’m the parent or guardian setting this up" })
    .click();
  await page.getByRole("button", { name: "Create my plan" }).click();
  await expect(
    page.getByRole("heading", { name: "Let’s go, Riley." }),
  ).toBeVisible();
}
async function parent(page: Page) {
  await page.getByRole("tab", { name: "Parent" }).click();
  const field = page.getByRole("textbox", { name: /What is/ });
  const label = await field.getAttribute("aria-label");
  const [, a, b] = label!.match(/(\d+) × (\d+)/)!;
  await field.fill(String(Number(a) * Number(b)));
  await page.getByRole("button", { name: "Open parent space" }).click();
  await expect(
    page.getByRole("heading", { name: "The parent dugout." }),
  ).toBeVisible();
}
test("complete family flow persists records, benchmarks, export and deletion", async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /Great habits/ }),
  ).toBeVisible();
  await page.screenshot({
    path: testInfo.outputPath("welcome.png"),
    fullPage: true,
  });
  await setup(page);
  await page.screenshot({
    path: testInfo.outputPath("today.png"),
    fullPage: true,
  });
  await page.getByRole("button", { name: "Let’s play", exact: true }).click();
  await page
    .getByRole("button", { name: "Already practiced? Quick log" })
    .click();
  await page.getByRole("button", { name: "Save completed practice" }).click();
  await expect(
    page.getByRole("heading", { name: "YOU SHOWED UP!" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Back to today" }).click();
  await page.reload();
  await expect(
    page.getByText("You showed up today.", { exact: false }),
  ).toBeVisible();
  await page.getByRole("tab", { name: "Progress" }).click();
  await expect(page.getByText("First step", { exact: true })).toBeVisible();
  await expect(page.getByText("Earned", { exact: true })).toHaveCount(1);
  await parent(page);
  await page.getByLabel("Successful attempts (0–10)").fill("7");
  await page.getByLabel("Setup note (optional)").fill("Same tee and bat");
  await page
    .getByRole("button", { name: "Save benchmark", exact: true })
    .click();
  await expect(
    page.getByText("Benchmark saved.", { exact: false }),
  ).toBeVisible();
  await page.getByRole("tab", { name: "Progress" }).click();
  await expect(page.getByText("Same tee and bat")).toBeVisible();
  await page.screenshot({
    path: testInfo.outputPath("progress.png"),
    fullPage: true,
  });
  await parent(page);
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export practice records" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("practicepal-records.json");
  await page.getByRole("button", { name: "Delete local data…" }).click();
  await expect(
    page.getByRole("button", { name: "Delete all local data", exact: true }),
  ).toBeDisabled();
  await page.getByLabel("Type DELETE to confirm").fill("DELETE");
  await page
    .getByRole("button", { name: "Delete all local data", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: /Great habits/ }),
  ).toBeVisible();
  const persisted = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("practicepal-storage")!),
  );
  expect(persisted.state.logs).toEqual([]);
  expect(persisted.state.benchmarks).toEqual([]);
  expect(errors).toEqual([]);
});
test("timer resumes after reload, honors pause, and saves real elapsed time", async ({
  page,
}) => {
  await setup(page);
  await page.clock.install();
  await page.getByRole("button", { name: "Let’s play", exact: true }).click();
  await page.getByRole("button", { name: "Start timer", exact: true }).click();
  await page.clock.fastForward("00:01:10");
  await page.getByRole("button", { name: "Pause timer" }).click();
  const paused = await page.getByLabel("Time remaining").textContent();
  await page.clock.fastForward("00:02:00");
  expect(await page.getByLabel("Time remaining").textContent()).toBe(paused);
  await page.getByRole("button", { name: "Save timer & close" }).click();
  await page.reload();
  await page
    .getByRole("button", { name: "Resume practice", exact: true })
    .click();
  await page.getByRole("button", { name: "Resume timer" }).click();
  await page.clock.fastForward("00:00:05");
  await page.getByRole("button", { name: "Finish practice" }).click();
  await expect(
    page.getByRole("heading", { name: "YOU SHOWED UP!" }),
  ).toBeVisible();
  const persisted = await page.evaluate(
    () => JSON.parse(localStorage.getItem("practicepal-storage")!).state,
  );
  expect(persisted.totalPoints).toBe(10);
  expect(persisted.logs).toHaveLength(1);
  expect(persisted.practiceSessions[0].elapsedSeconds).toBeGreaterThanOrEqual(
    70,
  );
  expect(persisted.practiceSessions[0].elapsedSeconds).toBeLessThan(90);
});
test("legacy records migrate, rewards require parents, and payments stay disabled", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate(() =>
    localStorage.setItem(
      "practicepal-storage",
      JSON.stringify({
        version: 0,
        state: {
          onboardingComplete: true,
          child: { id: "legacy", name: "Morgan", goalPerWeek: 3, avatar: "⚾" },
          totalPoints: 50,
          logs: [],
          subscriptionStatus: "active",
          leaderboard: [{ name: "Fake", practices: 20 }],
        },
      }),
    ),
  );
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Let’s go, Morgan." }),
  ).toBeVisible();
  await page.getByRole("tab", { name: "Rewards" }).click();
  await page
    .getByRole("button", {
      name: "Request: Choose family game night",
      exact: true,
    })
    .click();
  await expect(page.getByText("20 points to use")).toBeVisible();
  await parent(page);
  await page
    .getByRole("button", { name: "Decline Choose family game night" })
    .click();
  await page.getByRole("tab", { name: "Rewards" }).click();
  await expect(page.getByText("50 points to use")).toBeVisible();
  await page.goto("/paywall");
  await expect(
    page.getByRole("heading", { name: "PracticePal is free to use." }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () =>
        JSON.parse(localStorage.getItem("practicepal-storage")!).state
          .subscriptionStatus,
    ),
  ).toBe("free");
});
test("training library, privacy, and mobile layout work", async ({
  page,
}, testInfo) => {
  await setup(page);
  await page.getByRole("tab", { name: "Play" }).click();
  await page.getByRole("button", { name: "Fielding", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Practice: Ground-ball fundamentals" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Practice: Tee contact ladder" }),
  ).toHaveCount(0);
  await page
    .getByRole("button", { name: "Practice: Ground-ball fundamentals" })
    .click();
  await page
    .getByRole("button", { name: "Show drill details", exact: true })
    .click();
  await expect(
    page
      .getByText("Field 3 sets of 8 gentle ground balls.", { exact: false })
      .last(),
  ).toBeVisible();
  await page.getByRole("button", { name: "Close", exact: true }).click();
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(overflow).toBe(false);
  await page.screenshot({
    path: testInfo.outputPath("training.png"),
    fullPage: true,
  });
  await page.goto("/privacy");
  await expect(
    page.getByRole("heading", { name: "Your family’s records." }),
  ).toBeVisible();
});
