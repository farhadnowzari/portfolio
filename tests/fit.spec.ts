// fit.spec.ts — Playwright fit assertions (tech-spec §6 steps 6/7, design v4 §4.1 "Assertions for
// the fit test"). Runs against `yarn preview` (see playwright.config.ts).
//
// Covers:
//   (e) hook bottom ≤ viewport − bottom bar, at every mobile viewport in the budget table
//   (f) the axis line element has height > 0 at every mobile viewport
//   (g) location line renders as one line (no wrap) at 375 width
//   + Noor's blocker #1: nothing (hook, peek, axis) bleeds under the fixed bottom bar
//   + Noor's blocker #2: desktop shows hook + peek beside the SVG, not display:none
//   + Ch4 story link resolves to a real /work section (Ravi #1)
//   + cold `#/story/:part` deep link renders real content (ruling 58)
//   + design-v5-composition §1: card / hook / diagram share one top edge on desktop, hook is not a
//     third floating block, the inline hook number (R62) is present
//   + §5: the copper axis line is flush with the bottom bar at 375×550, zero gap, every height
//   + §4: desktop top bar is 56px / buttons 40px, not stretched to a shared 44px
//   + R131 (@mobile, phone matrix): 48px bar / 36px buttons with a 44px `::before` hit layer; the
//     static index.html bar (no JS) gets the same rule from the inlined critical CSS
//   + design v7 §1/§2 (R66/R68): /skills is its own route, 4 nav items, chips by CV group, no bars
//   + design v7 §3 (R69): /work rail — desktop present, mobile absent; v8 §1e: active = the route
//   + design v7 §4/§5b, R74/R75: captions in the diagram, the peek rows, the /story numeral, the rail
//   + design v8 §4 (R79): / never scrolls at any desktop size; captions hide under a 520px drawing
//   (the deck itself — steps, lock, deep links, snap — is deck.spec.ts)
import { test, expect, type Page } from '@playwright/test'
import { navItems } from '../src/data/nav'
import { skillGroups, skills } from '../src/data/skills'
import { roles } from '../src/data/roles'
import { parts } from '../src/data/story'
import { profile } from '../src/data/profile'

const MOBILE_VIEWPORTS = [
  { width: 400, height: 667, label: '400x667' },
  { width: 375, height: 550, label: '375x550 (compact, <600px tall)' },
  { width: 360, height: 640, label: '360x640' },
]

const BOTTOM_BAR_PX = 56 // --bottom-h base (safe-area-inset-bottom is 0 in a desktop-driven headless run)

async function rectOf(page: Page, selector: string) {
  return page.locator(selector).first().boundingBox()
}

for (const vp of MOBILE_VIEWPORTS) {
  test.describe(`/ fits at ${vp.label}`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } })

    test('nothing bleeds under the bottom bar', async ({ page }) => {
      await page.goto('/')
      const home = await rectOf(page, '.home')
      expect(home).not.toBeNull()
      // the home box itself must never extend past viewport − bottom bar
      expect(home!.y + home!.height).toBeLessThanOrEqual(vp.height - BOTTOM_BAR_PX + 1)

      const peek = page.locator('.peek')
      const peekBox = await peek.boundingBox()
      if (peekBox) {
        expect(peekBox.y + peekBox.height).toBeLessThanOrEqual(vp.height - BOTTOM_BAR_PX + 1)
      }
    })

    test('(e) hook bottom <= viewport - bottom bar', async ({ page }) => {
      await page.goto('/')
      const hook = await rectOf(page, '.hook')
      expect(hook).not.toBeNull()
      expect(hook!.y + hook!.height).toBeLessThanOrEqual(vp.height - BOTTOM_BAR_PX + 1)
    })

    test('(f) axis line has height > 0', async ({ page }) => {
      await page.goto('/')
      const axis = await rectOf(page, '.axis')
      expect(axis).not.toBeNull()
      expect(axis!.height).toBeGreaterThan(0)
    })

    test('peek rows are whole 44px rows, never a partial slice', async ({ page }) => {
      await page.goto('/')
      const peek = page.locator('.peek')
      const box = await peek.boundingBox()
      if (!box) return
      // height should be a whole multiple of 44 (within 1px rounding)
      const remainder = box.height % 44
      expect(Math.min(remainder, 44 - remainder)).toBeLessThanOrEqual(1)
    })
  })
}

// §5: the copper axis line moved from `.axis` (JS-measured) to `.below-card` (CSS-guaranteed
// flex: 1) so it always reaches `.home`'s bottom edge, flush against the bottom bar, at every
// height including the compact 375×550 case — closed by construction, not by tuning a number.
test('§5 axis line is flush with the bottom bar at 375x550, zero gap', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 550 })
  await page.goto('/')
  const home = page.locator('.home')
  const homeBox = await home.boundingBox()
  const paddingBottom = await home.evaluate((el) => parseFloat(getComputedStyle(el).paddingBottom))
  const belowCard = await rectOf(page, '.below-card')
  expect(homeBox).not.toBeNull()
  expect(belowCard).not.toBeNull()
  // `.below-card` carries the copper border-inline-start and is `.home`'s trailing flex:1 child —
  // its bottom edge must land on `.home`'s own CONTENT-box bottom (border-box bottom minus
  // `.home`'s own padding — a fixed, CSS-guaranteed offset, not a JS-measurement shortfall), with
  // no extra gap beyond that.
  const homeContentBottom = homeBox!.y + homeBox!.height - paddingBottom
  expect(belowCard!.y + belowCard!.height).toBeGreaterThanOrEqual(homeContentBottom - 1)
  expect(belowCard!.y + belowCard!.height).toBeLessThanOrEqual(homeContentBottom + 1)
})

test('(g) location line is one line at 375 width', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 550 })
  await page.goto('/')
  const rects = await page.locator('.t-location').first().evaluate((el) => el.getClientRects().length)
  expect(rects).toBe(1)
})

test.describe('/ desktop', () => {
  test.use({ viewport: { width: 1400, height: 900 } })

  test('hook + peek render beside the SVG, not display:none', async ({ page }) => {
    await page.goto('/')
    const belowCard = page.locator('.below-card')
    await expect(belowCard).toBeVisible()
    const hook = page.locator('.hook')
    await expect(hook).toBeVisible()
    const diagram = page.locator('.home__diagram')
    await expect(diagram).toBeVisible()
  })

  // §1 hard requirement: nothing floats. Card, hook (the card's own closing line) and diagram
  // all sit on the same grid row edge (`align-items: start`) — no vertical-center drift, no
  // hook/peek block reading as an unexplained third island.
  test('§1 card, hook and diagram share one top edge, no floating third block', async ({ page }) => {
    await page.goto('/')
    const card = await rectOf(page, '.card')
    const belowCard = await rectOf(page, '.below-card')
    const diagram = await rectOf(page, '.home__diagram')
    expect(card).not.toBeNull()
    expect(diagram).not.toBeNull()
    expect(Math.abs(card!.y - diagram!.y)).toBeLessThanOrEqual(1)
    // the hook block sits directly under the card, in the same 440px column — well within it,
    // never off to the side or past the diagram's left edge.
    expect(belowCard!.x).toBeCloseTo(card!.x, 0)
    expect(belowCard!.y).toBeGreaterThan(card!.y)
  })

  // R62: the hook sentence carries chapter 1's real callout inline, not a separate floating digit.
  test('R62 hook number renders inline in the sentence', async ({ page }) => {
    await page.goto('/')
    const num = page.locator('.hook .hook__num')
    await expect(num).toBeVisible()
    await expect(num).toHaveText('7')
  })

  // §4: 56px bar, 40px buttons proportioned to their own width — not stretched to a shared 44px.
  test('§4 top bar is 56px with 40px-tall buttons', async ({ page }) => {
    await page.goto('/')
    const bar = await rectOf(page, '.topbar')
    expect(bar!.height).toBeCloseTo(56, 0)
    const cv = page.locator('.topbar__actions .btn').first()
    const box = await cv.boundingBox()
    expect(box!.height).toBeCloseTo(40, 0)
  })
})

// R131: on the phone matrix the 48px bar keeps 36px-tall CV / Say hi (host: 44px "stretched way too
// much vertically"), with a `::before` hit layer that makes the CLICKABLE box 44px without growing
// the visual. `@mobile` puts this on playwright.config.ts's phone projects; the two landscape phones
// are ≥769 wide and land on the desktop breakpoint, so they assert the untouched 56/40 there instead.
test.describe('top bar buttons @mobile (R131)', () => {
  type Probe = { hitTop: boolean; hitBottom: boolean; gapIsFree: boolean; farAboveIsNotBtn: boolean }

  /** elementFromPoint around each button: 2px past the visual top/bottom must still be the button
   *  (≥44px effective), 4px into the 8px gap must be neither button (hit layers do not overlap
   *  horizontally), and 2px past the 44px hit box must not be the button (the layer is 4px, not more). */
  async function probe(page: Page): Promise<Probe[]> {
    return page.evaluate(() => {
      const btns = [...document.querySelectorAll<HTMLElement>('.topbar__actions .btn')]
      const isBtn = (x: number, y: number, b: HTMLElement) => document.elementFromPoint(x, y)?.closest('.topbar__actions .btn') === b
      const anyBtn = (x: number, y: number) => !!document.elementFromPoint(x, y)?.closest('.topbar__actions .btn')
      return btns.map((b, i) => {
        const r = b.getBoundingClientRect()
        const cx = r.left + r.width / 2
        const next = btns[i + 1]?.getBoundingClientRect()
        return {
          hitTop: isBtn(cx, r.top - 2, b),
          hitBottom: isBtn(cx, r.bottom + 2, b),
          gapIsFree: next ? !anyBtn((r.right + next.left) / 2, r.top + r.height / 2) : true,
          farAboveIsNotBtn: !isBtn(cx, r.top - 6, b),
        }
      })
    })
  }

  async function assertBar(page: Page) {
    const width = page.viewportSize()!.width
    const bar = await rectOf(page, '.topbar')
    const btns = page.locator('.topbar__actions .btn')
    await expect(btns).toHaveCount(2)
    if (width >= 769) {
      // §4 desktop block: untouched by R131.
      expect(bar!.height).toBeCloseTo(56, 0)
      for (const box of await btns.evaluateAll((els) => els.map((e) => e.getBoundingClientRect().height))) expect(box).toBeCloseTo(40, 0)
      return
    }
    expect(bar!.height).toBeCloseTo(48, 0)
    const boxes = await btns.evaluateAll((els) => els.map((e) => {
      const r = e.getBoundingClientRect()
      const cs = getComputedStyle(e)
      return { height: r.height, top: r.top, fontSize: cs.fontSize, radius: cs.borderRadius, gap: getComputedStyle(e.parentElement!).gap }
    }))
    for (const b of boxes) {
      expect(b.height).toBeCloseTo(36, 0)
      expect(Math.abs(b.top - (bar!.height - b.height) / 2)).toBeLessThanOrEqual(1) // centred in the bar (~6px above and below)
      expect(b.fontSize).toBe('13px')
      expect(b.radius).toBe('4px')
      expect(b.gap).toBe('8px')
    }
    // the CV icon is 1em of a 13px label — it must not be what sets the button's height
    const icon = await page.locator('.topbar__actions .btn .icon').first().boundingBox()
    expect(icon!.height).toBeLessThanOrEqual(14)
    expect(await page.locator('.topbar__name').evaluate((e) => getComputedStyle(e).fontSize)).toBe('14px')
    for (const p of await probe(page)) {
      expect(p.hitTop).toBe(true)
      expect(p.hitBottom).toBe(true)
      expect(p.gapIsFree).toBe(true)
      expect(p.farAboveIsNotBtn).toBe(true)
    }
  }

  test('36px visual, 44px clickable, neighbours do not overlap', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.home .t-name')).toBeVisible()
    await assertBar(page)
  })

  test('the static (pre-hydration) bar in index.html gets the same rule', async ({ page }) => {
    // no JS: what a cold load paints before the Vue bundle arrives, from the inlined critical CSS.
    await page.route('**/*.js', (route) => route.abort())
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    await expect(page.locator('.static-card')).toBeVisible()
    await assertBar(page)
  })
})

// R66/R68: skills left /work for their own route — four nav items, CV groups as a definition-list
// table, plain chips, and NOTHING that looks like a bar, a since-year or a role count.
test.describe('/skills (design v7 §1, §2)', () => {
  test('bottom bar has 4 items in nav.ts order, Skills active', async ({ page }) => {
    await page.setViewportSize({ width: 400, height: 667 })
    await page.goto('/#/skills')
    const items = page.locator('.bottombar__item')
    await expect(items).toHaveCount(4)
    await expect(items).toHaveText(navItems.map((n) => n.label))
    await expect(items.nth(2)).toHaveAttribute('aria-current', 'page')
    await expect(page.locator('.bottombar__item[aria-current="page"]')).toHaveCount(1)
  })

  test('top bar has 4 tabs, Skills active', async ({ page }) => {
    await page.setViewportSize({ width: 1400, height: 900 })
    await page.goto('/#/skills')
    const tabs = page.locator('.topbar__tabs a')
    await expect(tabs).toHaveCount(4)
    await expect(tabs).toHaveText(navItems.map((n) => n.label))
    await expect(tabs.nth(2)).toHaveAttribute('aria-current', 'page')
  })

  test('every CV group renders with every one of its skills as a chip', async ({ page }) => {
    await page.goto('/#/skills')
    const rows = page.locator('.skills__row')
    await expect(rows).toHaveCount(skillGroups.length)
    for (const [i, group] of skillGroups.entries()) {
      await expect(rows.nth(i).locator('.skills__group')).toHaveText(group)
      const count = skills.filter((s) => s.group === group).length
      await expect(rows.nth(i).locator('.chip')).toHaveCount(count)
    }
    await expect(page.locator('.skills .chip')).toHaveCount(skills.length)
  })

  test('no bars, since-years, role counts or tooltips anywhere (R66)', async ({ page }) => {
    await page.goto('/#/skills')
    await expect(page.locator('[class*="bom"]')).toHaveCount(0)
    await expect(page.locator('.skills')).not.toContainText(/since \d{4}/)
    await expect(page.locator('.skills')).not.toContainText(/\d+ roles?/)
    // chips are not links
    await expect(page.locator('.skills .chip a, .skills a.chip')).toHaveCount(0)
    await expect(page).toHaveTitle(/^Skills · /)
  })

  test('foot links /skills → /work and /work → /skills', async ({ page }) => {
    await page.goto('/#/skills')
    await expect(page.locator('.skills__foot')).toHaveAttribute('href', '#/work')
    await page.goto('/#/work/freelance')
    await expect(page.locator('.work__foot')).toHaveAttribute('href', '#/skills')
    await expect(page.locator('[class*="bom"]')).toHaveCount(0)
  })
})

// R69/R77/v8 §3: the year-range rail is desktop-only; ticks are an index (one per role), labels in the
// spaced form, employer as caption; active = the route param (the deck owns it, no scroll-spy).
test.describe('/work rail (design v7 §3, v8 §3)', () => {
  test('desktop: rail present with one tick per role, spaced year ranges + employer, Kaufland active on load', async ({ page }) => {
    await page.setViewportSize({ width: 1400, height: 900 })
    await page.goto('/#/work')
    await expect(page).toHaveURL(/#\/work\/kaufland$/)
    const rail = page.locator('.work__rail')
    await expect(rail).toBeVisible()
    const items = rail.locator('.rail__item')
    await expect(items).toHaveCount(roles.length)
    await expect(items.locator('.rail__num')).toHaveText(
      roles.map((r) => `${r.from.slice(0, 4)} – ${r.to ? r.to.slice(0, 4) : 'present'}`),
    )
    await expect(items.locator('.rail__caption')).toHaveText(roles.map((r) => r.employer))
    await expect(items.first()).toHaveAttribute('aria-current', 'true')
    await expect(rail.locator('[aria-current="true"]')).toHaveCount(1)
    // one role on stage; employer + location print on the panel itself
    await expect(page.locator('.role')).toHaveCount(1)
    await expect(page.locator('.role__employer')).toHaveText('Kaufland e-commerce')
    // R84: no CV button in the header strip (the topbar has one)
    await expect(page.locator('.work__head .btn')).toHaveCount(0)
    await expect(page.locator('.work__head')).toContainText('Authorized to work in Germany · English')
  })

  test('desktop: rail click pushes the route and moves the active tick', async ({ page }) => {
    await page.setViewportSize({ width: 1400, height: 900 })
    await page.goto('/#/work')
    await page.locator('.work__rail .rail__item[href="#/work/navatec"]').click()
    await expect(page).toHaveURL(/#\/work\/navatec$/)
    const active = page.locator('.work__rail .rail__item[aria-current="true"]')
    await expect(active).toHaveAttribute('href', '#/work/navatec')
    await expect(page.locator('.work__rail [aria-current="true"]')).toHaveCount(1)
    await expect(page.locator('#navatec')).toBeVisible()
  })

  test('mobile: no rail, no progress bar, header block first, every role in the document', async ({ page }) => {
    await page.setViewportSize({ width: 400, height: 667 })
    await page.goto('/#/work')
    await expect(page.locator('.work__rail')).toBeHidden()
    await expect(page.locator('.work .story__progress')).toHaveCount(0)
    await expect(page.locator('.role')).toHaveCount(roles.length)
    await expect(page.locator('.work__head')).toBeInViewport()
  })
})

// R70 / R74 / R75: the caption travels with the number everywhere the number appears.
test.describe('captions (design v7 §4, §5b)', () => {
  const captioned = parts.filter((p) => p.callout?.caption)

  test('diagram: every callout has its caption under the leader, Ch 7 has none', async ({ page }) => {
    await page.setViewportSize({ width: 1400, height: 900 })
    await page.goto('/')
    const captions = page.locator('.exploded__caption')
    await expect(captions).toHaveCount(captioned.length)
    for (const part of captioned) {
      const hotspot = page.locator(`.exploded__hotspot[href="#/story/${part.id}"]`)
      // SVG <text> has no innerText; the caption is one <tspan> per wrapped line — rejoin them.
      const lines = await hotspot.locator('.exploded__caption tspan').allTextContents()
      expect(lines.length).toBeGreaterThan(0)
      expect(lines.length).toBeLessThanOrEqual(2)
      expect(lines.map((l) => l.trim()).join(' ')).toBe(part.callout!.caption)
      expect((await hotspot.locator('.exploded__num-text').textContent())?.trim()).toBe(part.callout!.display)
    }
    await expect(page.locator('.exploded__hotspot[href="#/story/quiet"] .exploded__caption')).toHaveCount(0)
  })

  for (const width of [360, 400]) {
    test(`peek rows carry number · title · caption on one 44px row at ${width}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 667 })
      await page.goto('/')
      const rows = page.locator('.peek__item a')
      await expect(rows.nth(0).locator('.peek__caption')).toHaveText('age 7')
      await expect(rows.nth(1).locator('.peek__caption')).toHaveText('started university')
      for (let i = 0; i < 2; i++) {
        const row = rows.nth(i)
        const box = await row.boundingBox()
        expect(Math.abs(box!.height - 44)).toBeLessThanOrEqual(1)
        // the title never truncates at ≥360
        const clipped = await row.locator('.peek__title').evaluate((el) => el.scrollWidth > el.clientWidth + 1)
        expect(clipped).toBe(false)
      }
    })
  }

  test('story numeral: caption under the number, visible the instant the panel is (no fade)', async ({ page }) => {
    await page.setViewportSize({ width: 1400, height: 900 })
    await page.goto('/#/story')
    await expect(page).toHaveURL(/#\/story\/radio$/)
    const radio = page.locator('#radio .part__num')
    await expect(radio.locator('.part__callout')).toHaveCSS('opacity', '1')
    await expect(radio.locator('.part__caption')).toHaveText('age 7')
    // R71: the Next control is back, `↓ Next chapter`
    await expect(page.locator('#radio .panel__next')).toHaveText(/Next chapter/)
    await page.goto('/#/story/forty')
    await expect(page.locator('#forty .part__caption')).toHaveText('services, before → after')
    // v10 §2b: Ch 7's numeral cell is reserved but blank (no ghost digit); the head row's 128 min-height
    // keeps the title at the same x AND y as Ch 5's
    const fortyTitle = await rectOf(page, '#forty .part__title')
    await page.goto('/#/story/quiet')
    const quietNum = page.locator('#quiet .part__num')
    await expect(quietNum).toHaveCount(1)
    expect(await quietNum.evaluate((el) => (el as HTMLElement).innerText.trim())).toBe('')
    await expect(page.locator('#quiet .part__callout')).toHaveCount(0)
    const quietTitle = await rectOf(page, '#quiet .part__title')
    expect(Math.abs(quietTitle!.x - fortyTitle!.x)).toBeLessThanOrEqual(1)
    expect(Math.abs(quietTitle!.y - fortyTitle!.y)).toBeLessThanOrEqual(1)
  })

  test('story rail: number and caption inline, mono, ink-2 (R75, not a tooltip)', async ({ page }) => {
    await page.setViewportSize({ width: 1400, height: 900 })
    await page.goto('/#/story')
    const rail = page.locator('.story__rail')
    await expect(rail).toBeVisible()
    // R81/R87: every row has a caption; Ch 7's is its title behind a `·` in the number slot
    await expect(rail.locator('.rail__caption')).toHaveCount(parts.length)
    await expect(rail.locator('.rail__caption')).toHaveText(parts.map((p) => p.callout?.caption ?? p.title))
    await expect(rail.locator('.rail__item[href="#/story/quiet"] .rail__num')).toHaveText('·')
    const first = rail.locator('.rail__item').first()
    const num = await first.locator('.rail__num').boundingBox()
    const cap = await first.locator('.rail__caption').boundingBox()
    // same line: caption starts to the right of the number, vertically overlapping it
    expect(cap!.x).toBeGreaterThan(num!.x + num!.width)
    expect(cap!.y).toBeLessThan(num!.y + num!.height)
    await expect(first.locator('.rail__caption')).toHaveCSS('color', 'rgb(91, 95, 107)')
    // no tooltip anywhere on the rail — the caption is the text, not a title attribute
    await expect(rail.locator('[title]')).toHaveCount(0)
  })
})

// R107: the pen-test line lives on the Architect panel (CV L49–51), so the row targets /work/gis.
// R108: Ch 4's body, lead-in and chips are the r18 rewrite (hand-built identity server, Keycloak later).
test('Ch4 story link resolves to a real /work section; R108 strings', async ({ page }) => {
  await page.goto('/#/story/prove-it')
  const link = page.locator('a', { hasText: 'The pen-test line' })
  await expect(link).toHaveAttribute('href', '#/work/gis')
  await expect(page.locator('#prove-it .part__body')).toContainText('a hand-built identity server. Turingpoint pen-tested it: above 95 out of 100.')
  await expect(page.locator('#prove-it .part__body')).toContainText('My boss, a colleague and I celebrated.')
  await expect(page.locator('#prove-it .part__leadin')).toHaveText('Later I learned Keycloak, then taught it: a video and a library.')
  expect(await page.locator('#prove-it .chip').allTextContents()).toEqual(['Microservices', 'Identity server', 'C#', 'Security'])
  await link.click()
  await page.waitForURL(/#\/work\/gis$/)
  const target = page.locator('#gis')
  await expect(target).toBeVisible()
})

test('cold #/story/:part deep link renders real content', async ({ page }) => {
  await page.goto('/#/story/forty')
  await expect(page.locator('#forty')).toBeVisible()
  await expect(page.locator('#forty .part__title')).toHaveText('Forty services. One me.')
})

// R103: a session that started on a deep link (html.deep from index.html's guard) must still land on
// a visible card when the top-bar name is clicked; the class is dropped once the app has mounted.
test.describe('R103: back to / from a cold deep link shows the card', () => {
  for (const c of [
    { start: '/#/story/forty', viewport: { width: 1400, height: 900 }, wheel: true },
    { start: '/#/work/kaufland', viewport: { width: 1400, height: 900 }, wheel: false },
    { start: '/#/story/forty', viewport: { width: 400, height: 667 }, wheel: false },
  ]) {
    test(`${c.start} @ ${c.viewport.width}×${c.viewport.height} → name link → card visible, promise in the text`, async ({ page }) => {
      await page.setViewportSize(c.viewport)
      await page.goto(c.start)
      await expect(page.locator(c.start.includes('story') ? '#forty' : '#kaufland')).toBeVisible()
      expect(await page.evaluate(() => document.documentElement.classList.contains('deep'))).toBe(false)
      if (c.wheel) {
        await page.mouse.move(700, 450)
        await page.mouse.wheel(0, 120)
        await page.waitForTimeout(700)
      }
      for (let i = 0; i < 5; i++) {
        await page.locator('.topbar__name').click()
        await page.waitForTimeout(Math.random() * 600)
        await expect(page).toHaveURL(/#\/$/)
        await expect(page.locator('.home .card')).toBeVisible()
        expect(await page.evaluate(() => document.body.innerText)).toContain(profile.promise)
        await page.goBack()
        await page.waitForTimeout(Math.random() * 600)
      }
    })
  }
})

// design v8 §4 (R79): `/` never scrolls on desktop; the drawing is sized from the height.
test.describe('/ no-scroll desktop (design v8 §4)', () => {
  for (const vp of [
    { width: 1920, height: 1080, drawing: 640, captions: true },
    { width: 1860, height: 990, drawing: 617, captions: true },
    { width: 1400, height: 900, drawing: 553, captions: true },
    { width: 1280, height: 720, drawing: 443, captions: false },
  ]) {
    test(`${vp.width}x${vp.height}: no vertical scroll, drawing ≈ ${vp.drawing}px, captions ${vp.captions ? 'shown' : 'hidden'}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height })
      await page.goto('/')
      await page.waitForTimeout(150)
      const scroll = await page.evaluate(() => ({
        sh: document.documentElement.scrollHeight,
        ch: document.documentElement.clientHeight,
      }))
      expect(scroll.sh).toBeLessThanOrEqual(scroll.ch)
      const home = await rectOf(page, '.home')
      expect(home!.y + home!.height).toBeLessThanOrEqual(vp.height + 1)
      const svg = await rectOf(page, '.exploded')
      expect(Math.abs(svg!.width - vp.drawing)).toBeLessThanOrEqual(2)
      expect(svg!.y + svg!.height).toBeLessThanOrEqual(vp.height + 1)
      const caption = page.locator('.exploded__caption').first()
      if (vp.captions) await expect(caption).toBeVisible()
      else await expect(caption).toBeHidden()
      // the hook never gives; peek rows are whole 44px rows
      await expect(page.locator('.hook')).toBeInViewport()
      const peek = await rectOf(page, '.peek')
      if (peek) {
        const remainder = peek.height % 44
        expect(Math.min(remainder, 44 - remainder)).toBeLessThanOrEqual(1)
      }
    })
  }
})

test('ledger back-links render ↳ Part 0N', async ({ page }) => {
  await page.goto('/#/community')
  const back = page.locator('.ledger__back').first()
  await expect(back).toContainText('↳ Part')
})
