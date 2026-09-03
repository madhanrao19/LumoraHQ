import { defineConfig, devices } from "@playwright/test";
import { WEB_URL } from "./e2e/support/env";

// Full E2E + accessibility (axe-core) suite against a real running
// lumora-api + lumora-academy — see e2e/global-setup.ts for how both are
// started. Not wired into CI (see PR description) — run locally via
// `npm run test:e2e`.
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  // Single worker: lumora-api runs here via `php artisan serve`, a
  // single-threaded dev server — concurrent requests against it are
  // unreliable, so tests run serially rather than fighting over it.
  workers: 1,
  retries: 0,
  reporter: [["list"], ["html", { open: "never" }]],
  globalSetup: require.resolve("./e2e/global-setup"),
  globalTeardown: require.resolve("./e2e/global-teardown"),
  use: {
    baseURL: WEB_URL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
