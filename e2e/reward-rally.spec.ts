import { test, expect } from "@playwright/test";
test.use({ reducedMotion: "reduce" });

test("chosen reward persists, practice moves its meter, and a parent approves the earned request", async ({
  page,
}, testInfo) => {
  await page.clock.install({ time: new Date("2026-10-20T12:00:00") });
  await page.goto("/");
  await page.getByRole("button", { name: "Build your player’s plan" }).click();
  await page.getByLabel("Player nickname").fill("Riley");
  await page
    .getByRole("button", { name: "I’m the parent or guardian setting this up" })
    .click();
  await page.getByRole("button", { name: "Create my plan" }).click();
  await page
    .getByRole("button", { name: "Choose my reward", exact: true })
    .click();
  await page
    .getByRole("button", {
      name: "Set goal: Pick a favorite treat",
      exact: true,
    })
    .click();
  await page.getByRole("tab", { name: "Today", exact: true }).click();
  await page.reload();
  await expect(page.getByTestId("reward-goal")).toContainText(
    "Pick a favorite treat",
  );
  await expect(page.getByTestId("reward-goal")).toContainText("0 / 20 points");
  await page.screenshot({ path: testInfo.outputPath("reward-home.png") });
  for (let day = 0; day < 2; day++) {
    if (day) {
      await page.clock.setSystemTime(new Date("2026-10-21T12:00:00"));
      await page.reload();
    }
    await page.getByRole("button", { name: "Let’s play", exact: true }).click();
    await page
      .getByRole("button", { name: "Start timer", exact: true })
      .click();
    await page.clock.fastForward("00:01:10");
    await page
      .getByRole("button", { name: "Finish practice", exact: true })
      .click();
    await expect(
      page.getByRole("heading", { name: "YOU SHOWED UP!", exact: true }),
    ).toBeVisible();
    await expect(page.getByTestId("celebration-still")).toBeVisible();
    await expect(page.getByText("+10 POINTS", { exact: true })).toBeVisible();
    await expect(
      page.getByRole("dialog").getByTestId("reward-goal"),
    ).toContainText(`${(day + 1) * 10} / 20 points`);
    if (!day) {
      await page
        .getByRole("button", { name: "Back to today", exact: true })
        .click();
    }
  }
  await page.screenshot({
    path: testInfo.outputPath("reward-celebration.png"),
  });
  await page
    .getByRole("button", { name: "See my reward — it’s ready!", exact: true })
    .click();
  await page
    .getByRole("button", {
      name: "Request: Pick a favorite treat",
      exact: true,
    })
    .click();
  await expect(
    page.getByTestId("rewards-overview").getByTestId("reward-goal"),
  ).toContainText("Points reserved");
  await expect(
    page.getByText("0 points to use", { exact: true }),
  ).toBeVisible();
  await page.getByRole("tab", { name: "Parent", exact: true }).click();
  const field = page.getByRole("textbox", { name: /What is/ });
  const label = await field.getAttribute("aria-label");
  const [, a, b] = label!.match(/(\d+) × (\d+)/)!;
  await field.fill(String(Number(a) * Number(b)));
  await page.getByRole("button", { name: "Open parent space" }).click();
  await page
    .getByRole("button", { name: "Approve Pick a favorite treat", exact: true })
    .click();
  await page.getByRole("tab", { name: "Rewards", exact: true }).click();
  await expect(
    page.getByTestId("rewards-overview").getByTestId("reward-goal"),
  ).toContainText("Parent approved");
  await page
    .getByRole("button", {
      name: "Set goal: Pick a favorite treat",
      exact: true,
    })
    .click();
  await expect(
    page.getByTestId("rewards-overview").getByTestId("reward-goal"),
  ).toContainText("0 / 20 points");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("a second same-day session celebrates effort without promising extra points", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate(() =>
    localStorage.setItem(
      "practicepal-storage",
      JSON.stringify({
        version: 1,
        state: {
          onboardingComplete: true,
          child: { id: "older", name: "Sam", avatar: "⚾", goalPerWeek: 3 },
          totalPoints: 10,
          logs: [
            {
              id: "one",
              childId: "older",
              date: [
                new Date().getFullYear(),
                String(new Date().getMonth() + 1).padStart(2, "0"),
                String(new Date().getDate()).padStart(2, "0"),
              ].join("-"),
              types: ["Hitting"],
              loggedAt: new Date().toISOString(),
            },
          ],
        },
      }),
    ),
  );
  await page.reload();
  await expect(page.getByTestId("reward-goal")).toContainText("10 / 30 points");
  await page.getByRole("button", { name: "Play again", exact: true }).click();
  await expect(
    page.getByText("Today’s 10 points are already yours.", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Already practiced? Quick log", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Save completed practice", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "NICE WORK!", exact: true }),
  ).toBeVisible();
  await expect(page.getByText("+10 POINTS", { exact: true })).toHaveCount(0);
  const data = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("practicepal-storage")!),
  );
  expect(data.version).toBe(2);
  expect(data.state.totalPoints).toBe(10);
  expect(data.state.logs).toHaveLength(1);
});
