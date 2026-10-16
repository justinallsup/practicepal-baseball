import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: "list",
  use: {
    baseURL: process.env.BASE_URL || "http://127.0.0.1:4173",
    trace: "retain-on-failure",
    launchOptions: process.env.PLAYWRIGHT_EXECUTABLE_PATH
      ? {
          executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH,
          args: ["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu"],
        }
      : undefined,
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    {
      name: "phone",
      use: { ...devices["iPhone 13"], defaultBrowserType: "chromium" },
    },
  ],
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: "npm run serve:test",
        url: "http://127.0.0.1:4173",
        reuseExistingServer: !process.env.CI,
      },
});
