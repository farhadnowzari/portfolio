// deck.spec.ts — the one-panel-at-a-time deck (design v8 §1, R76/R80). Runs against `yarn preview`
// (playwright.config.ts). Desktop: wheel / keys / rail / Next / back-forward, the 560ms lock, deep
// links without animation, reduced motion = instant swap, the ending as `/story/ending`, the rail's
// spine fill. Mobile (R123): a plain document scroll, every block readable, the hash tracking the 40% band.
import { test, expect, type Page } from '@playwright/test'
import { readdirSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { parts } from '../src/data/story'
import { roles } from '../src/data/roles'
import { skillShort } from '../src/data/skills-copy'
import { bareLabel, skills } from '../src/data/skills'
import type { RoleContent } from '../src/data/roles'
import kaufland from '../src/data/roles/kaufland'
import gis from '../src/data/roles/gis'
import gisFullstack from '../src/data/roles/gis-fullstack'
import navatec from '../src/data/roles/navatec'
import freelance from '../src/data/roles/freelance'

const DESKTOP = { width: 1400, height: 900 }
const LOCK_MS = 560

/** Put the pointer on the stage so wheel events reach `.deck`. */
async function overDeck(page: Page) {
  const deck = await page.locator('.deck').boundingBox()
  await page.mouse.move(deck!.x + deck!.width / 2, deck!.y + deck!.height / 2)
}

async function panelIds(page: Page) {
  return page.locator('.deck .panel').evaluateAll((els) => els.map((el) => el.id))
}

test.describe('desktop deck: /story', () => {
  test.use({ viewport: DESKTOP })

  test('bare /story lands on /story/radio with one panel on stage, no animation classes', async ({ page }) => {
    await page.goto('/#/story')
    await expect(page).toHaveURL(/#\/story\/radio$/)
    await expect(page.locator('.deck .panel')).toHaveCount(1)
    await expect(page.locator('#radio')).toBeVisible()
    // the page itself never scrolls
    const scroll = await page.evaluate(() => ({ sh: document.documentElement.scrollHeight, ch: document.documentElement.clientHeight }))
    expect(scroll.sh).toBeLessThanOrEqual(scroll.ch)
  })

  test('deep link lands on its panel without animation', async ({ page }) => {
    await page.goto('/#/story/forty')
    const panel = page.locator('.deck .panel')
    await expect(panel).toHaveCount(1)
    await expect(panel).toHaveId('forty')
    const cls = await panel.getAttribute('class')
    expect(cls).not.toMatch(/push-|swap-/)
    await expect(panel).toHaveCSS('transform', 'none')
    await expect(page.locator('.story__rail [aria-current="true"]')).toHaveAttribute('href', '#/story/forty')
  })

  test('wheel steps exactly one panel per gesture; the lock swallows a second notch', async ({ page }) => {
    await page.goto('/#/story/radio')
    await overDeck(page)
    // one mouse notch = 100 units → one step
    await page.mouse.wheel(0, 100)
    await expect(page).toHaveURL(/#\/story\/friend$/)
    // three more notches inside the lock window → still one step
    await page.mouse.wheel(0, 100)
    await page.mouse.wheel(0, 100)
    await page.mouse.wheel(0, 100)
    await page.waitForTimeout(LOCK_MS + 100)
    await expect(page).toHaveURL(/#\/story\/friend$/)
    await expect(page.locator('.deck .panel')).toHaveCount(1)
    await expect(page.locator('#friend')).toBeVisible()
    // a fresh gesture after the lock steps again
    await page.mouse.wheel(0, 100)
    await expect(page).toHaveURL(/#\/story\/old-stuff$/)
    await page.waitForTimeout(LOCK_MS + 100)
    // and back up
    await page.mouse.wheel(0, -100)
    await expect(page).toHaveURL(/#\/story\/friend$/)
  })

  test('trackpad inertia tail: 1s of decaying deltas = one step', async ({ page }) => {
    await page.goto('/#/story/radio')
    await overDeck(page)
    // no quiet gap ≥120ms anywhere in the tail, so it is one gesture
    let delta = 30
    for (let i = 0; i < 40; i++) {
      await page.mouse.wheel(0, Math.max(1, Math.round(delta)))
      delta *= 0.92
      await page.waitForTimeout(25)
    }
    await page.waitForTimeout(LOCK_MS)
    await expect(page).toHaveURL(/#\/story\/friend$/)
  })

  test('keys: ArrowDown / ArrowUp / End / Home, one step per press under the lock', async ({ page }) => {
    await page.goto('/#/story/radio')
    await expect(page.locator('#radio')).toBeVisible() // the view (and its key listener) is mounted
    await page.keyboard.press('ArrowDown')
    await expect(page).toHaveURL(/#\/story\/friend$/)
    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('ArrowDown')
    await page.waitForTimeout(LOCK_MS + 100)
    await expect(page).toHaveURL(/#\/story\/friend$/)
    await page.keyboard.press('PageDown')
    await expect(page).toHaveURL(/#\/story\/old-stuff$/)
    await page.waitForTimeout(LOCK_MS + 100)
    await page.keyboard.press('ArrowUp')
    await expect(page).toHaveURL(/#\/story\/friend$/)
    await page.waitForTimeout(LOCK_MS + 100)
    await page.keyboard.press('End')
    await expect(page).toHaveURL(/#\/story\/ending$/)
    await page.waitForTimeout(LOCK_MS + 100)
    await page.keyboard.press('Home')
    await expect(page).toHaveURL(/#\/story\/radio$/)
  })

  test('the push: both sheets on stage during the run, one after; focus lands on the new panel', async ({ page }) => {
    await page.goto('/#/story/radio')
    await expect(page.locator('#radio')).toBeVisible()
    await page.waitForTimeout(100) // R91: let the next panel's prefetch land so the push is one patch
    await page.keyboard.press('ArrowDown')
    // mid-push: incoming + outgoing
    await expect(page.locator('.deck .panel')).toHaveCount(2)
    await expect(page.locator('.deck')).toHaveAttribute('style', /--dir:\s*1/)
    await page.waitForTimeout(LOCK_MS + 100)
    await expect(page.locator('.deck .panel')).toHaveCount(1)
    expect(await panelIds(page)).toEqual(['friend'])
    const focused = await page.evaluate(() => document.activeElement?.id)
    expect(focused).toBe('friend')
    await page.keyboard.press('ArrowUp')
    await expect(page.locator('.deck')).toHaveAttribute('style', /--dir:\s*-1/)
  })

  test('history: wheel/keys replace, rail and Next push; back returns to where you were', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Story' }).first().click()
    await expect(page).toHaveURL(/#\/story\/radio$/)
    await page.keyboard.press('ArrowDown')
    await page.waitForTimeout(LOCK_MS + 100)
    await page.keyboard.press('ArrowDown')
    await expect(page).toHaveURL(/#\/story\/old-stuff$/)
    await page.waitForTimeout(LOCK_MS + 100)
    // rail click → push
    await page.locator('.story__rail .rail__item[href="#/story/quiet"]').click()
    await expect(page).toHaveURL(/#\/story\/quiet$/)
    await page.waitForTimeout(LOCK_MS + 100)
    await page.goBack()
    // popstate pushes backwards
    await expect(page).toHaveURL(/#\/story\/old-stuff$/)
    await expect(page.locator('.deck')).toHaveAttribute('style', /--dir:\s*-1/)
    await page.waitForTimeout(LOCK_MS + 100)
    expect(await panelIds(page)).toEqual(['old-stuff'])
    // the two wheel/key steps were replaces: one more back leaves /story entirely
    await page.goBack()
    await expect(page).toHaveURL(/\/(#\/)?$/)
    await page.goForward()
    await expect(page).toHaveURL(/#\/story\/old-stuff$/)
    await page.waitForTimeout(LOCK_MS + 100)
    // Next → push
    await page.locator('#old-stuff .panel__next').click()
    await expect(page).toHaveURL(/#\/story\/prove-it$/)
    await expect(page.locator('#prove-it .panel__next')).toHaveText(/Next chapter/)
  })

  test('Next labels: Ch 3 custom, Ch 8 into the ending, none on the ending', async ({ page }) => {
    await page.goto('/#/story/old-stuff')
    await expect(page.locator('#old-stuff .panel__next')).toHaveText(/What I did about the scripts/)
    await page.goto('/#/story/together')
    await expect(page.locator('#together .panel__next')).toHaveText(/One sentence left/)
    await expect(page.locator('#together .panel__next')).toHaveAttribute('href', '#/story/ending')
    await page.goto('/#/story/ending')
    await page.waitForTimeout(LOCK_MS + 100)
    await expect(page.locator('.deck .panel')).toHaveCount(1)
    await expect(page.locator('.deck .panel__next')).toHaveCount(0)
    await expect(page.locator('.deck .part-art')).toHaveCount(0)
    await expect(page.locator('.deck .part__index')).toHaveCount(0)
  })

  test('rail: active = route, spine fills to the active tick, 100% past the last chapter', async ({ page }) => {
    await page.goto('/#/story/forty')
    const rail = page.locator('.story__rail')
    await expect(rail.locator('[aria-current="true"]')).toHaveAttribute('href', '#/story/forty')
    // deep link: the fill is seated instantly, not animated from 0
    await page.waitForTimeout(100)
    // no blank rows: 8 ticks, Ch 7 reads `· The quiet part`
    await expect(rail.locator('.rail__item')).toHaveCount(parts.length)
    // R98: the spine starts at the first tick, so the fill is measured from there (0 at ch1)
    const active = await rail.locator('[aria-current="true"]').boundingBox()
    const first = await rail.locator('.rail__item').first().boundingBox()
    const fill = await rail.evaluate((el) => parseFloat(getComputedStyle(el).getPropertyValue('--fill')))
    expect(Math.abs(fill - (active!.y - first!.y))).toBeLessThanOrEqual(1)
    await page.goto('/#/story/radio')
    await page.waitForTimeout(LOCK_MS + 100) // an in-page hash change animates the fill
    expect(await rail.evaluate((el) => parseFloat(getComputedStyle(el).getPropertyValue('--fill')))).toBeLessThanOrEqual(1)
    await page.goto('/#/story/ending')
    await expect(rail.locator('[aria-current="true"]')).toHaveCount(0)
    await page.waitForTimeout(LOCK_MS)
    const endFill = await rail.evaluate((el) => getComputedStyle(el).getPropertyValue('--fill').trim())
    expect(endFill).toBe('100%')
  })

  test('v10 §2: the part is a 128 figure in the numeral row, right on the column edge; the counter is the foot row\'s right cell', async ({ page }) => {
    await page.goto('/#/story/forty')
    await expect(page.locator('.deck .panel__art')).toHaveCount(0)
    const art = page.locator('#forty .part__head .part-art')
    await expect(art).toBeVisible()
    const box = await art.boundingBox()
    const col = await page.locator('#forty .panel__col').boundingBox()
    expect(Math.abs(box!.width - 128)).toBeLessThanOrEqual(1)
    expect(Math.abs(box!.height - 128)).toBeLessThanOrEqual(1)
    expect(Math.abs(box!.x + box!.width - (col!.x + col!.width)), 'art right = column right').toBeLessThanOrEqual(1)
    // no spine, no tick: the bare figure
    await expect(page.locator('#forty .part-art path.part-art__tick')).toHaveCount(0)
    const index = page.locator('#forty .panel__foot .part__index')
    await expect(index).toHaveText('05 / 08')
    await expect(index).toHaveCSS('color', 'rgb(91, 95, 107)')
    const ib = await index.boundingBox()
    expect(Math.abs(ib!.x + ib!.width - (col!.x + col!.width)), 'counter right = column right').toBeLessThanOrEqual(1)
    // compact: the 80 box
    await page.setViewportSize({ width: 1280, height: 720 })
    const small = await art.boundingBox()
    expect(Math.abs(small!.width - 80)).toBeLessThanOrEqual(1)
  })
})

test.describe('desktop deck: reduced motion', () => {
  test.use({ viewport: DESKTOP, reducedMotion: 'reduce' })

  test('instant swap: one panel on stage the frame after the step, no transform', async ({ page }) => {
    await page.goto('/#/story/radio')
    await page.keyboard.press('ArrowDown')
    await expect(page).toHaveURL(/#\/story\/friend$/)
    await page.waitForTimeout(50)
    await expect(page.locator('.deck .panel')).toHaveCount(1)
    await expect(page.locator('#friend')).toHaveCSS('transform', 'none')
    // the lock is shorter (200ms) so one gesture still equals one step
    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('ArrowDown')
    await page.waitForTimeout(250)
    await expect(page).toHaveURL(/#\/story\/friend$/)
    await page.keyboard.press('ArrowDown')
    await expect(page).toHaveURL(/#\/story\/old-stuff$/)
  })
})

test.describe('desktop deck: /work', () => {
  test.use({ viewport: DESKTOP })

  test('bare /work → /work/kaufland; wheel steps roles; last panel carries the /skills row', async ({ page }) => {
    await page.goto('/#/work')
    await expect(page).toHaveURL(/#\/work\/kaufland$/)
    await expect(page.locator('.deck .panel')).toHaveCount(1)
    await expect(page.locator('.deck .panel__next')).toHaveText(/Next role/)
    await overDeck(page)
    await page.mouse.wheel(0, 100)
    await expect(page).toHaveURL(/#\/work\/gis$/)
    await page.waitForTimeout(LOCK_MS + 100)
    expect(await panelIds(page)).toEqual(['gis'])
    await page.keyboard.press('End')
    await expect(page).toHaveURL(/#\/work\/freelance$/)
    await page.waitForTimeout(LOCK_MS + 100)
    await expect(page.locator('.deck .work__foot')).toHaveAttribute('href', '#/skills')
    // the page never scrolls
    const scroll = await page.evaluate(() => ({ sh: document.documentElement.scrollHeight, ch: document.documentElement.clientHeight }))
    expect(scroll.sh).toBeLessThanOrEqual(scroll.ch)
  })

  test('R105: no art on /work; the foot row carries ↓ Next role left and ↳ Part 0N right, at 1400 and 1860', async ({ page }) => {
    await page.goto('/#/work/kaufland')
    for (const width of [1400, 1860]) {
      await page.setViewportSize({ width, height: 900 })
      await expect(page.locator('.deck .panel__art')).toHaveCount(0)
      await expect(page.locator('.deck .part-art')).toHaveCount(0)
      const foot = page.locator('#kaufland .panel__foot')
      await expect(foot).toBeVisible()
      const link = foot.locator('.role__chapter')
      await expect(link).toHaveText('↳ Part 06')
      await expect(link).toHaveAttribute('href', '#/story/millions')
      const col = await page.locator('#kaufland .panel__col').boundingBox()
      const next = await foot.locator('.panel__next').boundingBox()
      const box = await link.boundingBox()
      expect(box!.height).toBeGreaterThanOrEqual(44)
      expect(next!.height).toBeGreaterThanOrEqual(44)
      // one row: Next on the column's left edge, the Part link's right edge on the column's right edge
      expect(Math.abs(next!.x - col!.x), `${width} Next x`).toBeLessThanOrEqual(1)
      expect(Math.abs(box!.x + box!.width - (col!.x + col!.width)), `${width} Part right edge`).toBeLessThanOrEqual(1)
      expect(Math.abs(next!.y + next!.height / 2 - (box!.y + box!.height / 2)), `${width} one row`).toBeLessThanOrEqual(1)
    }
    // the last panel: the /skills row left, ↳ Part 02 (the freelance chapter) right
    await page.goto('/#/work/freelance')
    await page.waitForTimeout(LOCK_MS + 100)
    const foot = page.locator('#freelance .panel__foot')
    await expect(foot.locator('.work__foot')).toHaveAttribute('href', '#/skills')
    await expect(foot.locator('.role__chapter')).toHaveText('↳ Part 02')
    await expect(foot.locator('.role__chapter')).toHaveAttribute('href', '#/story/friend')
  })

  test('R104/R111: a role\'s chips are the bare skill names, never the /skills-only skillShort form', async ({ page }) => {
    await page.goto('/#/work/kaufland')
    const chips = await page.locator('#kaufland .chip').allTextContents()
    expect(chips).toContain('Kubernetes')
    expect(chips).toContain('Node.js')
    // a short that coincides with the bare name (`xUnit`) is not a leak
    const shortOnly = Object.entries(skillShort).filter(([label, short]) => short !== bareLabel(label)).map(([, short]) => short)
    for (const text of chips) {
      expect(text, text).not.toMatch(/\(/)
      expect(shortOnly, text).not.toContain(text)
    }
    // no tooltip re-claims the qualifier; the two non-parenthetical labels are bare too
    await expect(page.locator('#kaufland .chip[title]')).toHaveCount(0)
    expect(chips).toContain('Claude Code')
    await page.goto('/#/work/navatec')
    await page.waitForTimeout(LOCK_MS + 100)
    expect(await page.locator('#navatec .chip').allTextContents()).toContain('Vue')
  })

  // R109/R114 + the host's r18 overrides: Event sourcing on Kaufland only; Security on the gis Architect
  // only; the Architect also carries Microservices and xUnit; gis Full-Stack keeps xUnit; NavaTec has no
  // test chip; Freelance has none.
  test('r18 chip sets per role, rendered bare, in data order', async ({ page }) => {
    const expected: Record<string, RoleContent> = { kaufland, gis, 'gis-fullstack': gisFullstack, navatec, freelance }
    const chipOf = (id: string) => bareLabel(skills.find((s) => s.id === id)!.label)
    for (const id of Object.keys(expected)) {
      await page.goto(`/#/work/${id}`)
      await expect(page.locator(`#${id}`)).toBeVisible()
      await page.waitForTimeout(LOCK_MS + 100)
      expect(await page.locator(`#${id} .chip`).allTextContents(), id).toEqual(expected[id]!.stack.map(chipOf))
    }
    expect(kaufland.stack).toContain('event-sourcing')
    expect(gis.stack).not.toContain('event-sourcing')
    expect(gisFullstack.stack).not.toContain('event-sourcing')
    expect(gis.stack).toEqual(expect.arrayContaining(['security', 'microservices', 'tdd-xunit']))
    expect(gisFullstack.stack).toContain('tdd-xunit')
    expect(gisFullstack.stack).not.toContain('security')
    expect(kaufland.stack).not.toContain('security')
    expect(navatec.stack).not.toContain('tdd-xunit')
    expect(freelance.stack).toEqual([])
    expect(chipOf('tdd-xunit')).toBe('xUnit')
    expect(chipOf('security')).toBe('Security')
    // the /work header: German (B1)
    await expect(page.locator('.work__head')).toContainText('German (B1)')
    await expect(page.locator('.work__head')).not.toContainText('Intermediate')
  })

  test('every role reachable by keys, aria-label carries the position', async ({ page }) => {
    await page.goto('/#/work/kaufland')
    await expect(page.locator('#kaufland')).toBeVisible()
    for (let i = 1; i < roles.length; i++) {
      await page.keyboard.press('ArrowDown')
      await expect(page).toHaveURL(new RegExp(`#/work/${roles[i]!.id}$`))
      await expect(page.locator(`#${roles[i]!.id}`)).toHaveAttribute('aria-label', `Role ${i + 1} of ${roles.length}`)
      await page.waitForTimeout(LOCK_MS + 100)
    }
  })
})

// ── R123/R124/R125: mobile is a plain document scroll ──
// Runs on the phone matrix in playwright.config.ts (`@mobile`), never on Desktop Chrome. The two
// landscape projects are ≥769 wide, i.e. the desktop deck on a phone: the mobile assertions are
// skipped there and `landscape` covers what that breakpoint must still do.
test.describe('mobile @mobile: plain document scroll (R123)', () => {
  const MOBILE_ROUTES = [
    { view: 'story', ids: [...parts.map((p) => p.id), 'ending'] },
    { view: 'work', ids: roles.map((r) => r.id) },
  ] as const
  const WHEEL_STEP = 100

  /** The reading window: below the sticky chrome (topbar + the PART header on /story), above the bottom bar. */
  async function readingWindow(page: Page) {
    return page.evaluate(() => {
      const top = document.querySelector('.topbar')!.getBoundingClientRect().bottom
      const head = document.querySelector('.story__header')?.getBoundingClientRect().bottom ?? 0
      const bottom = document.querySelector('.bottombar')!.getBoundingClientRect().top
      return { top: Math.max(top, head), bottom }
    })
  }

  /** Wait until scrollY has not moved across ~150ms of frames. */
  async function settled(page: Page) {
    await page.evaluate(
      () =>
        new Promise<void>((resolve) => {
          let last = scrollY
          let still = 0
          const tick = () => {
            if (scrollY === last) still++
            else {
              still = 0
              last = scrollY
            }
            if (still >= 9) resolve()
            else requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }),
    )
  }

  /**
   * Ids of the panels crossing the 40% band (R124's rootMargin: 40% … 40.1% of the viewport, ±1px:
   * the engine snaps the IO root rect to whole pixels). Usually one; two for the moment a panel
   * boundary sits inside the band; none in the /work head.
   */
  async function panelsAtBand(page: Page) {
    return page.evaluate(() => {
      const top = innerHeight * 0.4 - 1
      const bottom = innerHeight * 0.401 + 1
      return [...document.querySelectorAll<HTMLElement>('.panel')]
        .filter((el) => {
          const r = el.getBoundingClientRect()
          return r.bottom > top && r.top < bottom
        })
        .map((el) => el.id)
    })
  }

  function mobileOnly(width: number) {
    test.skip(width >= 769, '≥769 wide is the desktop deck (see `landscape`)')
  }

  test('(1) no scroll-snap anywhere below 769; panels keep natural heights', async ({ page, viewport }) => {
    mobileOnly(viewport!.width)
    for (const { view, ids } of MOBILE_ROUTES) {
      await page.goto(`/#/${view}`)
      await expect(page).toHaveURL(new RegExp(`#/${view}/${ids[0]}$`))
      await expect(page.locator('.panel')).toHaveCount(ids.length)
      const css = await page.evaluate(() => {
        const html = getComputedStyle(document.documentElement)
        const body = getComputedStyle(document.body)
        const panels = [...document.querySelectorAll<HTMLElement>('.panel')].map((el) => {
          const cs = getComputedStyle(el)
          return { id: el.id, align: cs.scrollSnapAlign, stop: cs.scrollSnapStop, minHeight: cs.minHeight, marginTop: cs.scrollMarginTop, padding: cs.padding }
        })
        return { htmlSnap: html.scrollSnapType, bodySnap: body.scrollSnapType, padTop: html.scrollPaddingTop, padBottom: html.scrollPaddingBottom, panels }
      })
      expect(css.htmlSnap).toBe('none')
      expect(css.bodySnap).toBe('none')
      expect(css.padTop).toBe('auto')
      expect(css.padBottom).toBe('auto')
      for (const p of css.panels) {
        expect(p.align, `${view}/${p.id} scroll-snap-align`).toBe('none')
        expect(p.stop, `${view}/${p.id} scroll-snap-stop`).toBe('normal')
        expect(p.padding, `${view}/${p.id} padding`).toBe('32px 16px 40px')
        // R123: the ending (and the last role, for the same reason) keep a floor; nothing else does
        if (p.id !== 'ending' && p.id !== roles[roles.length - 1]!.id) expect(['0px', 'auto'], `${view}/${p.id} min-height ${p.minHeight}`).toContain(p.minHeight)
        expect(p.marginTop, `${view}/${p.id} scroll-margin-top`).toBe(view === 'story' ? '88px' : '48px')
      }
    }
  })

  for (const { view, ids } of MOBILE_ROUTES) {
    test(`(2) /${view}: every li / p / foot is fully readable at some 100px wheel step; the hash tracks the 40% band`, async ({ page, viewport }) => {
      mobileOnly(viewport!.width)
      await page.goto(`/#/${view}/${ids[0]}`)
      await expect(page).toHaveURL(new RegExp(`#/${view}/${ids[0]}$`))
      await page.locator('.panel').last().waitFor()
      // every readable block, keyed `panel:index`
      const keys: string[] = await page.evaluate(() =>
        [...document.querySelectorAll<HTMLElement>('.panel')].flatMap((panel) =>
          [...panel.querySelectorAll<HTMLElement>('li, p, .panel__foot')]
            .filter((el) => el.getClientRects().length > 0 && el.offsetHeight > 0)
            .map((el, i) => `${panel.id}:${i}`),
        ),
      )
      expect(keys.length).toBeGreaterThan(20)
      const seen = new Set<string>()
      const mismatches: string[] = []
      await page.mouse.move(viewport!.width / 2, viewport!.height / 2)
      await page.evaluate(() => scrollTo(0, 0))
      await settled(page)
      let lastY = -1
      for (let step = 0; step < 200; step++) {
        const { top, bottom } = await readingWindow(page)
        const visible: string[] = await page.evaluate(
          ({ top, bottom }) =>
            [...document.querySelectorAll<HTMLElement>('.panel')].flatMap((panel) =>
              [...panel.querySelectorAll<HTMLElement>('li, p, .panel__foot')]
                .filter((el) => el.getClientRects().length > 0 && el.offsetHeight > 0)
                .map((el, i) => ({ key: `${panel.id}:${i}`, r: el.getBoundingClientRect() }))
                .filter(({ r }) => r.top >= top - 0.5 && r.bottom <= bottom + 0.5)
                .map(({ key }) => key),
            ),
          { top, bottom },
        )
        for (const k of visible) seen.add(k)
        const band = await panelsAtBand(page)
        const hash = await page.evaluate(() => location.hash)
        if (band.length && !band.some((id) => hash === `#/${view}/${id}`)) mismatches.push(`y=${await page.evaluate(() => scrollY)}: band=${band.join('|')} hash=${hash}`)
        const y = await page.evaluate(() => scrollY)
        if (y === lastY) break // the end of the document
        lastY = y
        await page.mouse.wheel(0, WHEEL_STEP)
        await settled(page)
      }
      const missing = keys.filter((k) => !seen.has(k))
      expect(missing, `never fully inside the reading window on /${view}`).toEqual([])
      expect(mismatches, 'hash ≠ the panel at the 40% band').toEqual([])
    })
  }

  test('(3) a 200px touch drag stops where the finger lifts: no drift, no hash change', async ({ page, viewport }) => {
    mobileOnly(viewport!.width)
    // Input.dispatchTouchEvent is CDP: every project is Chromium (R129)
    const cdp = await page.context().newCDPSession(page)
    const x = viewport!.width / 2
    for (const [view, id] of [['work', 'kaufland'], ['work', 'gis'], ['story', 'forty'], ['story', 'prove-it']] as const) {
      await page.goto(`/#/${view}/${id}`)
      await expect(page).toHaveURL(new RegExp(`#/${view}/${id}$`))
      await settled(page)
      const before = await page.evaluate(() => scrollY)
      // 20 × 10px, a held finger before the lift: a drag, not a fling
      const y0 = viewport!.height * 0.75
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y: y0 }] })
      for (let i = 1; i <= 20; i++) {
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: y0 - i * 10 }] })
        await page.waitForTimeout(30)
      }
      await page.waitForTimeout(150)
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
      const release = await page.evaluate(() => ({ y: scrollY, hash: location.hash }))
      expect(release.y - before, `${view}/${id}: the drag scrolled`).toBeGreaterThan(150)
      await page.waitForTimeout(1000)
      const settle = await page.evaluate(() => ({ y: scrollY, hash: location.hash }))
      expect(Math.abs(settle.y - release.y), `${view}/${id}: drift after release`).toBeLessThanOrEqual(2)
      expect(settle.hash, `${view}/${id}: hash changed after release`).toBe(release.hash)
      // the designer's rule: two screenshots 1s apart are pixel-identical
      const a = await page.screenshot({ animations: 'disabled' })
      await page.waitForTimeout(1000)
      const b = await page.screenshot({ animations: 'disabled' })
      expect(a.equals(b), `${view}/${id}: the page moved between two screenshots 1s apart`).toBe(true)
    }
  })

  test('(4) regression: /story/forty + one 100px wheel step keeps forty and PART 05 / 08', async ({ page, viewport }) => {
    mobileOnly(viewport!.width)
    await page.goto('/#/story/forty')
    await expect(page).toHaveURL(/#\/story\/forty$/)
    await settled(page)
    const top = await page.locator('#forty').evaluate((el) => el.getBoundingClientRect().top)
    expect(Math.abs(top - 88)).toBeLessThanOrEqual(1)
    await expect(page.locator('.story__header')).toContainText('PART 05 / 08')
    await page.mouse.move(viewport!.width / 2, viewport!.height / 2)
    await page.mouse.wheel(0, 100)
    await settled(page)
    await page.waitForTimeout(200)
    await expect(page).toHaveURL(/#\/story\/forty$/)
    await expect(page.locator('.story__header')).toContainText('PART 05 / 08')
  })

  test('(5) every Next control and ↳ Part link is ≥ 44px tall', async ({ page, viewport }) => {
    mobileOnly(viewport!.width)
    for (const { view, ids } of MOBILE_ROUTES) {
      await page.goto(`/#/${view}`)
      await expect(page).toHaveURL(new RegExp(`#/${view}/${ids[0]}$`))
      // the previous view's panels are still in the DOM while the next chunk loads: wait for THIS view's
      const stack = view === 'story' ? '.story__parts' : '.work__main'
      await expect(page.locator(`${stack} .panel`)).toHaveCount(ids.length)
      const heights = await page.locator(`${stack} .panel__next, ${stack} .role__chapter`).evaluateAll((els) =>
        els.map((el) => ({ text: el.textContent!.trim(), h: el.getBoundingClientRect().height })),
      )
      expect(heights.length).toBeGreaterThan(0)
      for (const { text, h } of heights) expect(h, `${view}: "${text}"`).toBeGreaterThanOrEqual(44)
    }
  })

  test('deep links land the panel under the sticky chrome; Next pushes to the next one', async ({ page, viewport }) => {
    mobileOnly(viewport!.width)
    for (const [view, id] of [['work', 'kaufland'], ['work', 'gis'], ['work', roles[roles.length - 1]!.id], ['story', 'forty'], ['story', 'prove-it'], ['story', 'ending']] as const) {
      await page.goto(`/#/${view}/${id}`)
      await expect(page).toHaveURL(new RegExp(`#/${view}/${id}$`))
      await settled(page)
      await page.waitForTimeout(200)
      const { top } = await readingWindow(page)
      const panelTop = await page.locator(`#${id}`).evaluate((el) => el.getBoundingClientRect().top)
      expect(Math.abs(panelTop - top), `${view}/${id} lands at ${panelTop}, chrome ends at ${top}`).toBeLessThanOrEqual(1)
      await expect(page, `${view}/${id}: the IO rewrote the landing`).toHaveURL(new RegExp(`#/${view}/${id}$`))
    }
    await page.goto('/#/story/forty')
    await settled(page)
    await page.locator('#forty .panel__next').click()
    await expect(page).toHaveURL(/#\/story\/millions$/)
    await settled(page)
    const next = await page.locator('#millions').evaluate((el) => el.getBoundingClientRect().top)
    expect(Math.abs(next - 88)).toBeLessThanOrEqual(1)
    await expect(page.locator('.story__header')).toContainText('PART 06 / 08')
    // /work: the header block is the in-flow page head, no longer a snap area
    await page.goto('/#/work')
    await expect(page.locator('.work__head')).toBeInViewport()
    await expect(page.locator('.work__head')).toHaveCSS('scroll-snap-align', 'none')
  })

  test('landscape (≥769 wide): the desktop deck, the page does not scroll', async ({ page, viewport }) => {
    test.skip(viewport!.width < 769, 'portrait phones are the mobile scroll')
    await page.goto('/#/story/forty')
    await expect(page).toHaveURL(/#\/story\/forty$/)
    await expect(page.locator('.deck .panel')).toHaveCount(1)
    await expect(page.locator('.story__parts')).toHaveCount(0)
    expect(await page.evaluate(() => document.documentElement.scrollHeight - innerHeight)).toBeLessThanOrEqual(0)
  })
})

// ── design v9 §1–§3 (R91/R96–R98): the panel grid, lazy panel chunks, the favicon ──
const TOL = 2

/** y of a rail item's tick = the item's vertical centre. */
async function firstTickY(page: Page, rail: string) {
  const box = await page.locator(`${rail} .rail__item`).first().boundingBox()
  return box!.y + box!.height / 2
}

test.describe('v10 panel grid: /story on the /work skeleton', () => {
  for (const vp of [
    { width: 1860, height: 990, x: 792 },
    { width: 1400, height: 900, x: 562 },
  ]) {
    test(`/story ${vp.width}×${vp.height}: numeral cap = art top = rail first tick (±${TOL}); title row constant; foot row = Next + counter`, async ({ page }) => {
      await page.setViewportSize(vp)
      const titleYs: number[] = []
      for (const id of ['radio', 'forty', 'millions', 'quiet']) {
        await page.goto(`/#/story/${id}`)
        await expect(page.locator(`#${id}`)).toBeVisible()
        await page.waitForTimeout(LOCK_MS + 100) // the second goto is an in-page push
        await expect(page.locator('.deck .panel')).toHaveCount(1)
        const tick = await firstTickY(page, '.story__rail')
        const col = await page.locator(`#${id} .panel__col`).boundingBox()
        const head = await page.locator(`#${id} .part__head`).boundingBox()
        const art = await page.locator(`#${id} .part__art`).boundingBox()
        // R120: the column at the same x as /work's (rail track 300 + 64), 640 wide
        expect(Math.abs(col!.x - vp.x), `${id} column x`).toBeLessThanOrEqual(1)
        expect(Math.abs(col!.width - 640), `${id} column width`).toBeLessThanOrEqual(1)
        expect(Math.abs(col!.y - tick), `${id} block top vs rail tick`).toBeLessThanOrEqual(TOL)
        expect(Math.abs(art!.y - tick), `${id} art top vs rail tick`).toBeLessThanOrEqual(TOL)
        expect(Math.abs(art!.width - 128), `${id} art box`).toBeLessThanOrEqual(1)
        expect(Math.abs(art!.x + art!.width - (col!.x + col!.width)), `${id} art on the column's right edge`).toBeLessThanOrEqual(1)
        // §2b: the head row is always 128, ch7 included, so the title's y is the same on every chapter
        expect(Math.abs(head!.height - 128), `${id} head row`).toBeLessThanOrEqual(1)
        if (id !== 'quiet') {
          // §1b: line-height 0.72 puts the Plex Mono cap on the numeral box's top edge
          const numeral = await page.locator(`#${id} .part__callout`).boundingBox()
          expect(Math.abs(numeral!.y - tick), `${id} numeral cap vs rail tick`).toBeLessThanOrEqual(TOL)
          expect(Math.abs(numeral!.x - col!.x), `${id} numeral on the column's left edge`).toBeLessThanOrEqual(1)
          // §2c: the numeral's budget is the row minus the art and the gap (480)
          expect(numeral!.x + numeral!.width, `${id} numeral inside its cell`).toBeLessThanOrEqual(col!.x + 480 + 1)
          const fs = await page.locator(`#${id} .part__callout`).evaluate((el) => parseFloat(getComputedStyle(el).fontSize))
          expect(Math.abs(fs - (id === 'millions' ? 100 : 104)), `${id} numeral size`).toBeLessThanOrEqual(0.5)
        }
        const title = await page.locator(`#${id} .part__title`).boundingBox()
        expect(Math.abs(title!.x - col!.x), `${id} title x`).toBeLessThanOrEqual(1)
        expect(Math.abs(title!.width - 640), `${id} title full width`).toBeLessThanOrEqual(1)
        titleYs.push(title!.y)
        expect(Math.abs((await page.locator(`#${id} .part__body`).boundingBox())!.x - col!.x), `${id} body x`).toBeLessThanOrEqual(1)
        // the foot row: one 44px row, Next on the column's left edge, the counter's right edge on the column's right edge
        const foot = await page.locator(`#${id} .panel__foot`).boundingBox()
        const next = await page.locator(`#${id} .panel__next`).boundingBox()
        const counter = await page.locator(`#${id} .part__index`).boundingBox()
        expect(Math.abs(next!.y + next!.height / 2 - (counter!.y + counter!.height / 2)), `${id} Next row vs counter row`).toBeLessThanOrEqual(TOL)
        expect(next!.height).toBeGreaterThanOrEqual(44)
        expect(counter!.height).toBeGreaterThanOrEqual(44)
        expect(Math.abs(next!.x - col!.x)).toBeLessThanOrEqual(1)
        expect(Math.abs(counter!.x + counter!.width - (col!.x + col!.width)), `${id} counter right edge`).toBeLessThanOrEqual(1)
        // R97: directly under the content (content bottom + the 40 gap), never on the stage floor
        expect(Math.abs(foot!.y - (col!.y + col!.height + 40)), `${id} foot row`).toBeLessThanOrEqual(TOL)
        // no inner scroll on any chapter
        expect(await page.locator(`#${id}`).evaluate((el) => el.scrollHeight - el.clientHeight), `${id} inner scroll`).toBeLessThanOrEqual(0)
      }
      expect(new Set(titleYs.map((y) => Math.round(y))).size, 'one title y on every chapter').toBe(1)
    })
  }

  test('/story and /work share the column x and the numeral-row / role-head register at 1860, 1400 and 1280', async ({ page }) => {
    for (const vp of [
      { width: 1860, height: 990, x: 792 },
      { width: 1400, height: 900, x: 562 },
      { width: 1280, height: 720, x: 502 },
    ]) {
      await page.setViewportSize({ width: vp.width, height: vp.height })
      await page.goto('/#/story/radio')
      await expect(page.locator('#radio')).toBeVisible()
      await page.waitForTimeout(LOCK_MS + 100)
      const sCol = await page.locator('#radio .panel__col').boundingBox()
      const sRail = await page.locator('.story__rail').boundingBox()
      const sHead = await page.locator('#radio .part__head').boundingBox()
      const sDeck = await page.locator('.story__deck').boundingBox()
      const sTick = await firstTickY(page, '.story__rail')
      await page.goto('/#/work/kaufland')
      await expect(page.locator('#kaufland')).toBeVisible()
      await page.waitForTimeout(LOCK_MS + 100)
      const wCol = await page.locator('#kaufland .panel__col').boundingBox()
      const wRail = await page.locator('.work__rail').boundingBox()
      const wHead = await page.locator('#kaufland .role__row').first().boundingBox()
      const wTick = await firstTickY(page, '.work__rail')
      expect(Math.abs(sCol!.x - vp.x), `${vp.width} story column x`).toBeLessThanOrEqual(1)
      expect(Math.abs(wCol!.x - vp.x), `${vp.width} work column x`).toBeLessThanOrEqual(1)
      expect(Math.abs(sCol!.width - wCol!.width), `${vp.width} column width`).toBeLessThanOrEqual(1)
      // R120: the rail track is 300 on both routes
      expect(Math.abs(sRail!.width - 300), `${vp.width} story rail track`).toBeLessThanOrEqual(1)
      expect(Math.abs(wRail!.width - 300), `${vp.width} work rail track`).toBeLessThanOrEqual(1)
      expect(Math.abs(sRail!.x - wRail!.x), `${vp.width} rail x`).toBeLessThanOrEqual(1)
      // the top register: the first row's top = the rail's first tick = 22 under the deck, on both routes
      expect(Math.abs(sHead!.y - sTick), `${vp.width} story register`).toBeLessThanOrEqual(TOL)
      expect(Math.abs(wHead!.y - wTick), `${vp.width} work register`).toBeLessThanOrEqual(4)
      const wDeck = await page.locator('.work__deck').boundingBox()
      expect(Math.abs(wHead!.y - (wDeck!.y + 22)), `${vp.width} work head 22 under the deck`).toBeLessThanOrEqual(1)
      expect(Math.abs(sHead!.y - (sDeck!.y + 22)), `${vp.width} story head 22 under the deck`).toBeLessThanOrEqual(1)
    }
  })

  test('/story 1280×720: compact register (22 under the stage top), 80 art, Next under the content, no inner scroll on ch5', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.goto('/#/story/forty')
    const stage = await page.locator('.story__stage').boundingBox()
    const col = await page.locator('#forty .panel__col').boundingBox()
    expect(Math.abs(col!.y - (stage!.y + 22))).toBeLessThanOrEqual(TOL)
    // R102: the rail's first tick is the register
    expect(Math.abs(col!.y - (await firstTickY(page, '.story__rail')))).toBeLessThanOrEqual(TOL)
    const art = await page.locator('#forty .part__art').boundingBox()
    expect(Math.abs(art!.width - 80)).toBeLessThanOrEqual(1)
    expect(Math.abs(art!.y - col!.y)).toBeLessThanOrEqual(TOL)
    const fs = await page.locator('#forty .part__callout').evaluate((el) => parseFloat(getComputedStyle(el).fontSize))
    expect(Math.abs(fs - 72)).toBeLessThanOrEqual(0.5)
    const next = await page.locator('#forty .panel__next').boundingBox()
    expect(Math.abs(next!.y - (col!.y + col!.height + 24))).toBeLessThanOrEqual(TOL)
    expect(next!.y + next!.height).toBeLessThanOrEqual(720)
    expect(next!.height).toBeGreaterThanOrEqual(36)
    const scrolls = await page.locator('#forty').evaluate((el) => el.scrollHeight > el.clientHeight + 1)
    expect(scrolls).toBe(false)
    // §5.4: never a one-word widow. v10 gives the title the full 640 row, so "Forty services. One me."
    // is one line at 40px (and at 48px on the regular stage); `text-wrap: balance` stays for the day it wraps.
    const lines = await page.locator('#forty .part__title').evaluate((el) => {
      const range = document.createRange()
      range.selectNodeContents(el)
      return [...range.getClientRects()].map((r) => Math.round(r.top)).filter((v, i, a) => a.indexOf(v) === i).length
    })
    expect(lines).toBe(1)
  })

  test('/work 1860 and 1400: employer top = rail first tick (±4), the foot row 40 under the content, no art', async ({ page }) => {
    for (const width of [1860, 1400]) {
      await page.setViewportSize({ width, height: width === 1860 ? 990 : 900 })
      await page.goto('/#/work/kaufland')
      await expect(page.locator('#kaufland')).toBeVisible()
      await expect(page.locator('#kaufland .panel__art')).toHaveCount(0)
      const tick = await firstTickY(page, '.work__rail')
      const col = await page.locator('#kaufland .panel__col').boundingBox()
      const employer = await page.locator('#kaufland .role__employer').boundingBox()
      expect(Math.abs(col!.y - tick), `${width} block top`).toBeLessThanOrEqual(4)
      expect(Math.abs(employer!.y - tick), `${width} employer top`).toBeLessThanOrEqual(4)
      const foot = await page.locator('#kaufland .panel__foot').boundingBox()
      expect(Math.abs(foot!.y - (col!.y + col!.height + 40)), `${width} foot row`).toBeLessThanOrEqual(TOL)
      // the header sits in the deck's column, 40 above the sheet, over a dashed rule
      const head = await page.locator('.work__head').boundingBox()
      const deck = await page.locator('.work__deck').boundingBox()
      expect(Math.abs(head!.x - deck!.x), `${width} header x`).toBeLessThanOrEqual(1)
      expect(Math.abs(head!.width - 640), `${width} header width`).toBeLessThanOrEqual(1)
      expect(Math.abs(deck!.y - (head!.y + head!.height + 40)), `${width} header → sheet`).toBeLessThanOrEqual(1)
      // the bullets: 16 / 1.5 on a 580 measure, gap 10
      const li = page.locator('#kaufland .role__bullets li').first()
      expect(await li.evaluate((el) => [getComputedStyle(el).fontSize, getComputedStyle(el).lineHeight])).toEqual(['16px', '24px'])
      expect((await page.locator('#kaufland .role__bullets').boundingBox())!.width).toBeLessThanOrEqual(580)
    }
  })

  // r18: gis's third chip row (R114 override) is 28px over the compact sheet; it takes the §1h inner-scroll
  // fallback at this one size (pending a ruling), kaufland still fits.
  test('/work 1280×720: compact register, kaufland fits the sheet without inner scroll, gis by ≤ 30', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 })
    for (const id of ['kaufland', 'gis']) {
      await page.goto(`/#/work/${id}`)
      await expect(page.locator(`#${id}`)).toBeVisible()
      await page.waitForTimeout(LOCK_MS + 100)
      expect(await page.locator(`#${id}`).evaluate((el) => el.scrollHeight - el.clientHeight), `${id} inner scroll`).toBeLessThanOrEqual(id === 'gis' ? 30 : 0)
      expect(Math.abs((await page.locator(`#${id} .panel__col`).boundingBox())!.y - (await firstTickY(page, '.work__rail')))).toBeLessThanOrEqual(4)
      const li = page.locator(`#${id} .role__bullets li`).first()
      expect(await li.evaluate((el) => getComputedStyle(el).fontSize)).toBe('15px')
      // the foot row is reachable: on the sheet (kaufland) or after the inner scroll (gis)
      await page.locator(`#${id}`).evaluate((el) => el.scrollTo(0, el.scrollHeight))
      const foot = await page.locator(`#${id} .panel__foot`).boundingBox()
      expect(foot!.y + foot!.height).toBeLessThanOrEqual(720)
      expect(foot!.height).toBeGreaterThanOrEqual(36)
    }
  })

  test('R98: the rail spine starts at the first tick (no copper nub above ch1)', async ({ page }) => {
    await page.setViewportSize({ width: 1860, height: 990 })
    await page.goto('/#/story/radio')
    await page.waitForTimeout(100)
    const { spineTop, fill } = await page.locator('.story__rail').evaluate((el) => ({
      spineTop: parseFloat(getComputedStyle(el).getPropertyValue('--spine-top')),
      fill: parseFloat(getComputedStyle(el).getPropertyValue('--fill')),
    }))
    const first = await page.locator('.story__rail .rail__item').first().boundingBox()
    const rail = await page.locator('.story__rail').boundingBox()
    expect(Math.abs(spineTop - (first!.y + first!.height / 2 - rail!.y))).toBeLessThanOrEqual(1)
    expect(fill).toBeLessThanOrEqual(1)
  })
})

// ── R102: /story and /work are one block (rail + deck + Next row), centred both ways below the top bar ──
test.describe('R102: the centred stage', () => {
  const SIZES = [
    { width: 1860, height: 990 },
    { width: 1400, height: 900 },
    { width: 1280, height: 720 },
  ]

  async function stageRect(page: Page, sel: string) {
    return page.locator(sel).evaluate((el) => {
      const r = el.getBoundingClientRect()
      return { top: r.top - 56, bottom: innerHeight - r.bottom, left: r.left, right: innerWidth - r.right, width: r.width, height: r.height }
    })
  }

  for (const vp of SIZES) {
    test(`/story ${vp.width}×${vp.height}: block centred, same box on ch1 / ch5 / ending, ch5 fits without inner scroll`, async ({ page }) => {
      await page.setViewportSize(vp)
      const boxes: Awaited<ReturnType<typeof stageRect>>[] = []
      for (const id of ['radio', 'forty', 'ending']) {
        await page.goto(`/#/story/${id}`)
        await expect(page.locator(`#${id}`)).toBeVisible()
        await page.waitForTimeout(LOCK_MS + 100)
        const box = await stageRect(page, '.story__stage')
        expect(Math.abs(box.top - box.bottom), `${id} vertical`).toBeLessThanOrEqual(1)
        expect(Math.abs(box.left - box.right), `${id} horizontal`).toBeLessThanOrEqual(1)
        expect(box.left, `${id} keeps the 48 gutter`).toBeGreaterThanOrEqual(48)
        // the block is rail + 64 + deck, nothing else: the deck's right edge is the block's
        const rail = await page.locator('.story__rail').boundingBox()
        const deck = await page.locator('.story__deck').boundingBox()
        expect(Math.abs(rail!.x - (box.left))).toBeLessThanOrEqual(1)
        expect(Math.abs(deck!.x - (rail!.x + rail!.width + 64))).toBeLessThanOrEqual(1)
        expect(Math.abs(deck!.x + deck!.width - (vp.width - box.right))).toBeLessThanOrEqual(1)
        // v10: no art cell; the column is 640 at every desktop size, the block 300 + 64 + 640 = 1004
        const col = await page.locator(`#${id} .panel__col`).boundingBox()
        expect(Math.abs(col!.width - 640)).toBeLessThanOrEqual(1)
        expect(Math.abs(box.width - 1004)).toBeLessThanOrEqual(1)
        await expect(page.locator('.deck .panel__art')).toHaveCount(0)
        // no inner scroll on any of them (ch5 is the stage's height reference)
        expect(await page.locator(`#${id}`).evaluate((el) => el.scrollHeight - el.clientHeight)).toBeLessThanOrEqual(0)
        // the registers hold inside the block: numeral cap = rail first tick
        if (id !== 'ending') {
          const numeral = await page.locator(`#${id} .part__callout`).boundingBox()
          expect(Math.abs(numeral!.y - (await firstTickY(page, '.story__rail')))).toBeLessThanOrEqual(TOL)
        }
        boxes.push(box)
      }
      // the stage is one fixed box: it does not move or resize between chapters
      for (const b of boxes.slice(1)) {
        expect(b).toEqual(boxes[0])
      }
    })

    test(`/work ${vp.width}×${vp.height}: ledger (header + rail + deck) centred, same box on every role, no inner scroll (kaufland, gis)`, async ({ page }) => {
      await page.setViewportSize(vp)
      const boxes: Awaited<ReturnType<typeof stageRect>>[] = []
      for (const id of ['kaufland', 'gis', 'freelance']) {
        await page.goto(`/#/work/${id}`)
        await expect(page.locator(`#${id}`)).toBeVisible()
        await page.waitForTimeout(LOCK_MS + 100)
        const box = await stageRect(page, '.work__stage')
        expect(Math.abs(box.top - box.bottom), `${id} vertical`).toBeLessThanOrEqual(1)
        expect(Math.abs(box.left - box.right), `${id} horizontal`).toBeLessThanOrEqual(1)
        expect(box.left).toBeGreaterThanOrEqual(48)
        const head = await page.locator('.work__head').boundingBox()
        const rail = await page.locator('.work__rail').boundingBox()
        const deck = await page.locator('.work__deck').boundingBox()
        // R105: the header is in the deck's column (its top = the block's top), the rail beside the sheet
        expect(Math.abs(head!.x - deck!.x)).toBeLessThanOrEqual(1)
        expect(Math.abs(head!.y - (box.top + 56))).toBeLessThanOrEqual(1)
        expect(Math.abs(rail!.x - box.left)).toBeLessThanOrEqual(1)
        expect(Math.abs(rail!.y - deck!.y)).toBeLessThanOrEqual(1)
        expect(Math.abs(deck!.x - (rail!.x + rail!.width + 64))).toBeLessThanOrEqual(1)
        expect(Math.abs(deck!.x + deck!.width - (vp.width - box.right))).toBeLessThanOrEqual(1)
        expect(Math.abs(deck!.y + deck!.height - (vp.height - box.bottom))).toBeLessThanOrEqual(1)
        const col = await page.locator(`#${id} .panel__col`).boundingBox()
        expect(Math.abs(col!.width - 640)).toBeLessThanOrEqual(1)
        expect(Math.abs(box.width - 1004)).toBeLessThanOrEqual(1)
        // r18: gis takes the §1h inner-scroll fallback at 1280×720 only (its third chip row, see above)
        expect(await page.locator(`#${id}`).evaluate((el) => el.scrollHeight - el.clientHeight)).toBeLessThanOrEqual(id === 'gis' && vp.height < 800 ? 30 : 0)
        expect(Math.abs(col!.y - (await firstTickY(page, '.work__rail')))).toBeLessThanOrEqual(4)
        boxes.push(box)
      }
      for (const b of boxes.slice(1)) {
        expect(b).toEqual(boxes[0])
      }
    })
  }

  test('the rail is the same width whichever item is active (the active 16px number is reserved)', async ({ page }) => {
    await page.setViewportSize({ width: 1860, height: 990 })
    const widths: number[] = []
    for (const id of ['radio', 'millions', 'quiet']) {
      await page.goto(`/#/story/${id}`)
      await expect(page.locator(`#${id}`)).toBeVisible()
      await page.waitForTimeout(LOCK_MS + 100)
      widths.push((await page.locator('.story__rail').boundingBox())!.width)
      // the visible row is untouched: number → caption stays the 8px gap on every row
      const gaps = await page.locator('.story__rail .rail__item').evaluateAll((els) =>
        els.map((el) => el.querySelector('.rail__caption')!.getBoundingClientRect().left - el.querySelector('.rail__num')!.getBoundingClientRect().right),
      )
      for (const g of gaps) expect(Math.abs(g - 8)).toBeLessThanOrEqual(0.5)
    }
    expect(new Set(widths).size).toBe(1)
  })
})

test.describe('R91: lazy panel chunks', () => {
  test.use({ viewport: DESKTOP })

  test('the build lists one chunk per panel, and the route chunks carry no panel', async () => {
    const files = readdirSync(resolve(process.cwd(), 'dist', 'assets'))
    for (const p of parts) expect(files.some((f) => new RegExp(`^${p.id}-[\\w-]{8}\\.js$`).test(f)), p.id).toBe(true)
    for (const r of roles) expect(files.some((f) => new RegExp(`^${r.id}-[\\w-]{8}\\.js$`).test(f)), r.id).toBe(true)
    for (const c of ['StoryPanel', 'RolePanel', 'EndingPanel']) expect(files.some((f) => f.startsWith(`${c}-`) && f.endsWith('.js')), c).toBe(true)
    const story = files.find((f) => /^StoryView-.*\.js$/.test(f))!
    const work = files.find((f) => /^WorkView-.*\.js$/.test(f))!
    for (const p of parts) expect(readFileSync(resolve(process.cwd(), 'dist', 'assets', story), 'utf-8')).not.toContain(p.title)
    expect(readFileSync(resolve(process.cwd(), 'dist', 'assets', work), 'utf-8')).not.toContain('Built a Go backend')
  })

  test('the next panel is fetched on arrival, before the gesture; the push then makes no request', async ({ page }) => {
    const requests: string[] = []
    page.on('request', (req) => requests.push(req.url()))
    await page.goto('/#/story/radio')
    await expect(page.locator('#radio')).toBeVisible()
    await page.waitForTimeout(300)
    const beforeGesture = requests.filter((u) => /\/assets\/friend-[\w-]{8}\.js$/.test(u))
    expect(beforeGesture, 'friend chunk prefetched on arrival').toHaveLength(1)
    // nothing else was fetched ahead: one step of lookahead, not the whole deck
    expect(requests.some((u) => /\/assets\/old-stuff-[\w-]{8}\.js$/.test(u))).toBe(false)
    const n = requests.length
    await page.keyboard.press('ArrowDown')
    await expect(page).toHaveURL(/#\/story\/friend$/)
    // both sheets on stage at once: the incoming one did not wait on the network
    await expect(page.locator('.deck .panel')).toHaveCount(2)
    await page.waitForTimeout(LOCK_MS + 100)
    expect(requests.slice(n).filter((u) => /\/assets\/friend-/.test(u))).toHaveLength(0)
    // and on arrival at ch2, ch3 is warmed
    expect(requests.some((u) => /\/assets\/old-stuff-[\w-]{8}\.js$/.test(u))).toBe(true)
  })

  test('/work: the next role is prefetched on arrival; hovering a rail item warms its chunk', async ({ page }) => {
    const requests: string[] = []
    page.on('request', (req) => requests.push(req.url()))
    await page.goto('/#/work/kaufland')
    await expect(page.locator('#kaufland')).toBeVisible()
    await page.waitForTimeout(300)
    expect(requests.some((u) => /\/assets\/gis-[\w-]{8}\.js$/.test(u))).toBe(true)
    expect(requests.some((u) => /\/assets\/freelance-[\w-]{8}\.js$/.test(u))).toBe(false)
    await page.locator('.work__rail .rail__item[href="#/work/freelance"]').hover()
    await page.waitForTimeout(300)
    expect(requests.some((u) => /\/assets\/freelance-[\w-]{8}\.js$/.test(u))).toBe(true)
  })
})

test.describe('R96 favicon', () => {
  test.use({ viewport: DESKTOP })

  test('favicon: the Part 01 speaker on the cream tile; apple-touch icon served', async ({ page, request }) => {
    await page.goto('/')
    const href = await page.locator('link[rel="icon"]').getAttribute('href')
    expect(href).toMatch(/^data:image\/svg\+xml,/)
    const svg = decodeURIComponent(href!.replace(/^data:image\/svg\+xml,/, ''))
    expect(svg).toContain("rx='6' fill='#F6F3EC'")
    expect(svg).toContain("x='4' y='4.5' width='24' height='23' rx='2.5'")
    expect(svg).toContain("r='6.5'")
    expect(svg).toContain("r='2.2' fill='#A84A22'")
    const touch = await request.get('/apple-touch-icon.png')
    expect(touch.ok()).toBe(true)
    expect(touch.headers()['content-type']).toContain('image/png')
  })
})
