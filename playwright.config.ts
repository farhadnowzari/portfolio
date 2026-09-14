// playwright.config.ts — Playwright suites for tests/fit.spec.ts, tests/a11y.spec.ts, tests/deck.spec.ts and tests/links.spec.ts
// (tech-spec §6 steps 6/10/11's verification gates). Runs against a production build+preview,
// not dev, so what's measured is what ships.
//
// R125/R129: the mobile deck block (`@mobile` in its describe title, tests/deck.spec.ts) runs on a phone
// matrix instead of Desktop Chrome; everything else (the desktop deck, fit, a11y, links) stays on the
// one `chromium` project, which is also the "desktop did not change" gate. Every project is Chromium
// (R129: no WebKit; the iPhone profiles are the iPhone 13 descriptor on Chromium, so the UA, DPR,
// touch and viewport are covered without a WebKit binary).
import { defineConfig, devices, type PlaywrightTestProject } from '@playwright/test'

const MOBILE = /@mobile/

/** A Samsung S22-class phone: Android Chrome UA, DPR 3 (no stock descriptor at this size). */
const S22_UA =
  'Mozilla/5.0 (Linux; Android 13; SM-S901B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.8010.12 Mobile Safari/537.36'

type Phone = { name: string; width: number; height: number; base: 'iphone' | 'android' }

const phones: Phone[] = [
  { name: 'iphone-13', width: 390, height: 844, base: 'iphone' },
  { name: 'iphone-13-collapsed', width: 390, height: 750, base: 'iphone' }, // Safari toolbar collapsed
  { name: 'iphone-13-stock', width: 390, height: 664, base: 'iphone' }, // devices['iPhone 13'] as shipped
  { name: 'samsung-s22-360', width: 360, height: 780, base: 'android' },
  { name: 'samsung-s22-384', width: 384, height: 854, base: 'android' },
  { name: 'pixel-7', width: 412, height: 839, base: 'android' },
  { name: 'small-360x640', width: 360, height: 640, base: 'android' },
  { name: 'tall-375x812', width: 375, height: 812, base: 'iphone' },
  // landscape: ≥769 wide, so the DESKTOP breakpoint on a phone
  { name: 'landscape-844x390', width: 844, height: 390, base: 'iphone' },
  { name: 'landscape-780x360', width: 780, height: 360, base: 'android' },
]

function phoneProjects(p: Phone): PlaywrightTestProject[] {
  const viewport = { width: p.width, height: p.height }
  if (p.base === 'android') {
    const use = p.name === 'pixel-7'
      ? { ...devices['Pixel 7'], viewport }
      : { userAgent: S22_UA, viewport, deviceScaleFactor: 3, isMobile: true, hasTouch: true, defaultBrowserType: 'chromium' as const }
    return [{ name: p.name, use, grep: MOBILE }]
  }
  return [{ name: p.name, use: { ...devices['iPhone 13'], viewport, defaultBrowserType: 'chromium' as const }, grep: MOBILE }]
}

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
    { name: 'chromium', use: { ...devices['Desktop Chrome'] }, grepInvert: MOBILE },
    ...phones.flatMap(phoneProjects),
  ],
})
