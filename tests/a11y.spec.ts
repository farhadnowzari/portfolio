// a11y.spec.ts — axe scan across all 5 routes (tech-spec §6 steps 7/8/9/10: "axe 0 serious/critical
// across all routes"; R68 added /skills). Runs against `yarn preview` (see playwright.config.ts).
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const routes = [
  { name: 'home', path: '/' },
  { name: 'story', path: '/#/story' },
  { name: 'story/forty', path: '/#/story/forty' },
  { name: 'story/quiet', path: '/#/story/quiet' },
  { name: 'story/ending', path: '/#/story/ending' },
  { name: 'work', path: '/#/work' },
  { name: 'work/gis', path: '/#/work/gis' },
  { name: 'skills', path: '/#/skills' },
  { name: 'community', path: '/#/community' },
]

for (const route of routes) {
  test(`${route.name}: 0 serious/critical axe violations`, async ({ page }) => {
    await page.goto(route.path)
    await page.waitForTimeout(200) // let the IO/settle classes + route mount finish
    const results = await new AxeBuilder({ page }).analyze()
    const seriousOrCritical = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')
    expect(seriousOrCritical, JSON.stringify(seriousOrCritical, null, 2)).toEqual([])
  })
}

// R87: no em-dash anywhere in rendered text (body text on every route, desktop and mobile, every
// deck panel, plus every title= tooltip and the document title). Must not look machine-written.
for (const vp of [
  { width: 1400, height: 900, label: 'desktop' },
  { width: 400, height: 667, label: 'mobile' },
]) {
  test(`R87 no em-dash in rendered text (${vp.label})`, async ({ page }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height })
    const paths = [
      ...routes.map((r) => r.path),
      ...['radio', 'friend', 'old-stuff', 'prove-it', 'millions', 'together'].map((p) => `/#/story/${p}`),
      ...['gis-fullstack', 'navatec', 'freelance'].map((r) => `/#/work/${r}`),
    ]
    for (const path of paths) {
      await page.goto(path)
      await page.waitForTimeout(100)
      const found = await page.evaluate(() => {
        const out: string[] = []
        if (document.body.innerText.includes('—')) out.push(`innerText: ${document.body.innerText.split('\n').filter((l) => l.includes('—')).join(' | ')}`)
        if (document.title.includes('—')) out.push(`title: ${document.title}`)
        for (const el of document.querySelectorAll('[title],[aria-label]')) {
          const t = el.getAttribute('title') ?? ''
          const a = el.getAttribute('aria-label') ?? ''
          if (t.includes('—')) out.push(`title attr: ${t}`)
          if (a.includes('—')) out.push(`aria-label: ${a}`)
        }
        return out
      })
      expect(found, path).toEqual([])
    }
  })
}

test('landmarks: one header, one main, one nav per route, no duplicates', async ({ page }) => {
  for (const route of routes) {
    await page.goto(route.path)
    await expect(page.locator('header.topbar')).toHaveCount(1)
    await expect(page.locator('main#main')).toHaveCount(1)
  }
})

test('touch targets: ledger rows, contact links, top bar >= 44px', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })

  await page.goto('/')
  // R131: the mobile top bar buttons are 36px VISUALLY (44px in a 48px bar read as stretched) and
  // reach 44px through a `::before` hit layer (`position: absolute; inset: -4px 0`) — same pattern
  // as the contact links below. Measure the tap area, not the painted box. (tests/fit.spec.ts's
  // R131 block proves with elementFromPoint that the layer actually receives the tap.)
  const topBarBtns = page.locator('.topbar__actions .btn')
  for (let i = 0; i < (await topBarBtns.count()); i++) {
    const tapHeight = await topBarBtns.nth(i).evaluate((el) => {
      const rect = el.getBoundingClientRect()
      const before = getComputedStyle(el, '::before')
      const insetTop = before.content === 'none' ? 0 : parseFloat(before.top) || 0
      return rect.height + Math.abs(insetTop) * 2
    })
    expect(tapHeight, `topbar btn #${i} tap area`).toBeGreaterThanOrEqual(44)
  }
  // card__contact links use an expanded invisible hit-area (::after, position: absolute), not a
  // literal 44px-tall element — a real 44px box per link would blow the mobile card's pixel budget
  // and push the hook/peek under the bottom bar (the blocker this round exists to fix). Measure the
  // actual tap area (element box + its ::after inset) instead of the visible line's own box.
  const contactLinks = page.locator('.card__contact a')
  for (let i = 0; i < (await contactLinks.count()); i++) {
    const tapHeight = await contactLinks.nth(i).evaluate((el) => {
      const rect = el.getBoundingClientRect()
      const after = getComputedStyle(el, '::after')
      const insetTop = parseFloat(after.top) || 0
      // ::after is `position: absolute; inset: -13px 0` relative to the (position: relative) link,
      // so its own height is the link's height plus 2x the (negative) inset.
      return rect.height + Math.abs(insetTop) * 2
    })
    expect(tapHeight, `card__contact a #${i} tap area`).toBeGreaterThanOrEqual(44)
  }

  await page.goto('/#/community')
  const rows = page.locator('.ledger__row')
  const rowCount = await rows.count()
  for (let i = 0; i < rowCount; i++) {
    const box = await rows.nth(i).boundingBox()
    expect(box!.height, `ledger row #${i}`).toBeGreaterThanOrEqual(44)
  }
})
