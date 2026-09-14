// playwright.config.ts — Playwright suites for tests/fit.spec.ts, tests/a11y.spec.ts, tests/deck.spec.ts and tests/links.spec.ts
// (tech-spec §6 steps 6/10/11's verification gates). Runs against a production build+preview,
// not dev, so what's measured is what ships.
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  testMatch: ['fit.spec.ts', 'a11y.spec.ts', 'deck.spec.ts', 'links.spec.ts'],
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:5195',
    trace: 'off',
  },
  webServer: {
    command: 'yarn preview --port 5195 --strictPort',
    url: 'http://localhost:5195',
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
})
