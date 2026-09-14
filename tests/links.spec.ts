// links.spec.ts — R116: every off-site link opens in a new tab. On every route, desktop and mobile, each
// `<a>` whose href is an absolute http(s) URL (YouTube, GitHub, Medium, LinkedIn) carries
// `target="_blank" rel="noopener noreferrer"`; every same-origin link (hash routes, the CV PDF, `mailto:`)
// carries NO target. Runs against `yarn preview` (playwright.config.ts).
import { test, expect } from '@playwright/test'
import { links } from '../src/data/links'

const routes = [
  '/',
  ...['radio', 'friend', 'old-stuff', 'prove-it', 'forty', 'millions', 'quiet', 'together', 'ending'].map((p) => `/#/story/${p}`),
  ...['kaufland', 'gis', 'gis-fullstack', 'navatec', 'freelance'].map((r) => `/#/work/${r}`),
  '/#/skills',
  '/#/community',
]

const external = Object.values(links).filter((l) => /^https?:\/\//.test(l.href)).map((l) => l.href)

for (const vp of [
  { width: 1400, height: 900, label: 'desktop' },
  { width: 400, height: 667, label: 'mobile' },
]) {
  test(`R116 (${vp.label}): external links open in a new tab, internal ones do not, on every route`, async ({ page }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height })
    let externalSeen = 0
    for (const path of routes) {
      await page.goto(path)
      await page.waitForTimeout(150)
      const anchors = await page.evaluate(() =>
        [...document.querySelectorAll('a[href]')].map((a) => ({
          href: a.getAttribute('href') ?? '',
          target: a.getAttribute('target'),
          rel: a.getAttribute('rel'),
          text: (a.textContent ?? '').trim().slice(0, 40),
        })),
      )
      expect(anchors.length, `${path}: anchors`).toBeGreaterThan(0)
      for (const a of anchors) {
        const isExternal = /^https?:\/\//.test(a.href)
        if (isExternal) {
          externalSeen++
          expect(external, `${path}: ${a.href} is in the registry`).toContain(a.href)
          expect(a.target, `${path}: ${a.text} (${a.href}) target`).toBe('_blank')
          expect(a.rel, `${path}: ${a.text} (${a.href}) rel`).toBe('noopener noreferrer')
        } else {
          expect(a.href, `${path}: ${a.text} is same-origin, a hash route or mailto`).toMatch(/^(#|\/|mailto:)/)
          expect(a.target, `${path}: ${a.text} (${a.href}) stays in the tab`).toBeNull()
        }
      }
    }
    // the suite saw the real thing: the card's four external buttons, the chapters' rows, the ledger
    expect(externalSeen).toBeGreaterThan(20)
  })
}
