// static-card.spec.ts — drift guard (R49 / tech-spec §2): every static-card string in index.html
// must equal its profile.ts counterpart. Hand-typed, not templated (host ruling); this test is what
// keeps the two copies honest. Runs against the source index.html — the strings don't change at
// build time (no transformIndexHtml templating, per the ruling).
import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { profile } from '../src/data/profile'
import { links, routes } from '../src/data/links'
import { navItems } from '../src/data/nav'
import { parts } from '../src/data/story'

const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf-8')
const homeView = readFileSync(resolve(process.cwd(), 'src/views/HomeView.vue'), 'utf-8')

describe('static card matches profile.ts (drift guard)', () => {
  it('contains the name', () => {
    expect(html).toContain(profile.name)
  })

  it('contains the title', () => {
    expect(html).toContain(profile.title)
  })

  it('contains the employer line', () => {
    expect(html).toContain(profile.employerLine)
  })

  it('contains the promise', () => {
    expect(html).toContain(profile.promise)
  })

  it('contains the location', () => {
    expect(html).toContain(profile.location)
  })

  it('contains every stack item as a chip (Noor #7: chips, not the plain mono line)', () => {
    for (const item of profile.stackLine.split(' · ')) {
      expect(html).toContain(`<span class="chip">${item}</span>`)
    }
  })

  it('contains the hook arrow, sentence and inline chapter-1 number (R62)', () => {
    expect(html).toContain(profile.hook.arrow)
    expect(html).toContain(profile.hook.pre)
    expect(html).toContain(profile.hook.post)
    expect(html).toContain(`<span class="hook__num">${profile.hook.num}</span>`)
  })

  it('every card button label and href/download appears', () => {
    for (const button of profile.buttons) {
      const link = links[button.link]
      expect(html).toContain(button.label)
      expect(html).toContain(link.href)
      if (link.download) expect(html).toContain(link.download)
    }
  })

  it('the CV button uses the R52 saved filename', () => {
    expect(html).toContain('Farhad Nowzari - 2026-CV.pdf')
  })

  // R116: the hand-typed card's off-site anchors open in a new tab; same-origin / mailto ones do not.
  it('external anchors carry target=_blank rel=noopener noreferrer, internal ones carry no target', () => {
    const anchors = [...html.matchAll(/<a\s[^>]*>/g)].map((m) => m[0])
    expect(anchors.length).toBeGreaterThan(10)
    let external = 0
    for (const tag of anchors) {
      const href = tag.match(/href="([^"]+)"/)![1]!
      if (/^https?:\/\//.test(href)) {
        external++
        expect(tag, tag).toContain('target="_blank"')
        expect(tag, tag).toContain('rel="noopener noreferrer"')
      } else {
        expect(href, tag).toMatch(/^(#|\/|mailto:)/)
        expect(tag, tag).not.toContain('target=')
      }
    }
    expect(external).toBe(4)
  })

  it('has no twitter:* meta (R51)', () => {
    expect(html).not.toMatch(/twitter:/i)
  })

  it('has viewport-fit=cover', () => {
    expect(html).toContain('viewport-fit=cover')
  })

  // R68: the hand-typed bottom bar and top-bar tabs mirror nav.ts — same items, same order.
  it('static bottom bar and top-bar tabs carry every nav.ts item, in order', () => {
    const bottomHrefs = [...html.matchAll(/<a class="bottombar__item" href="#([^"]+)">/g)].map((m) => m[1])
    expect(bottomHrefs).toEqual(navItems.map((n) => routes[n.route]))
    const bottomLabels = [...html.matchAll(/<a class="bottombar__item"[\s\S]*?<span>([^<]+)<\/span>/g)].map((m) => m[1])
    expect(bottomLabels).toEqual(navItems.map((n) => n.label))
    const tabs = html.match(/<nav class="topbar__tabs"[\s\S]*?<\/nav>/)![0]
    const tabHrefs = [...tabs.matchAll(/<a href="#([^"]+)">([^<]+)<\/a>/g)]
    expect(tabHrefs.map((m) => m[1])).toEqual(navItems.map((n) => routes[n.route]))
    expect(tabHrefs.map((m) => m[2])).toEqual(navItems.map((n) => n.label))
  })

  // R70: the two static peek rows carry the same number / title / caption as story.ts.
  it('static peek rows match story.ts number, title and caption', () => {
    for (const part of parts.slice(0, 2)) {
      expect(html).toContain(`<span class="peek__num t-mono" aria-hidden="true">${part.callout!.display}</span>`)
      expect(html).toContain(`<span class="peek__title">${part.title}</span>`)
      expect(html).toContain(`<span class="peek__caption" aria-hidden="true">${part.callout!.caption}</span>`)
      expect(html).toContain(`<span class="sr-only">${part.callout!.aria}</span>`)
    }
  })

  // R99 (supersedes R95): no image of the host ships. The id block is hand-typed in both files with the
  // same three lines and no <picture>/<img>/preload anywhere; the card column is 440 (design v5 §1).
  it('no portrait: identical id block in index.html and HomeView.vue, no <picture>, no image preload', () => {
    const pick = (src: string) => src.match(/<div class="card__head">[\s\S]*?<\/div>/)![0]
    const norm = (s: string) => s.replace(/\s+/g, ' ').replace(/\s*>\s*/g, '>').replace(/\s*</g, '<').trim()
    const templated = pick(homeView)
      .replace('{{ profile.name }}', profile.name)
      .replace('{{ profile.title }}', profile.title)
      .replace('{{ profile.employerLine }}', profile.employerLine)
    expect(norm(pick(html))).toBe(norm(templated))
    for (const src of [html, homeView]) {
      expect(src).not.toMatch(/<picture|<img|portrait|imagesrcset/)
    }
    const shell = readFileSync(resolve(process.cwd(), 'src/styles/shell.scss'), 'utf-8')
    expect(shell).toContain('grid-template-columns: 440px 1fr;')
    expect(shell).not.toMatch(/portrait/)
  })

  // R96 (design v9 §7): the speaker, Part 01, on the cream tile; the old bare ring is gone.
  it('favicon is the Part 01 speaker; apple-touch icon linked', () => {
    const icon = html.match(/<link rel="icon"[^>]*href="([^"]+)"/)![1]!
    const svg = decodeURIComponent(icon.replace(/^data:image\/svg\+xml,/, ''))
    expect(svg).toContain("rx='6' fill='#F6F3EC'")
    expect(svg).toContain("x='4' y='4.5' width='24' height='23' rx='2.5'")
    expect(svg).toContain("r='6.5'")
    expect(svg).toContain("r='2.2' fill='#A84A22'")
    expect(svg).not.toContain("r='9'")
    expect(html).toContain('<link rel="apple-touch-icon" href="/apple-touch-icon.png" />')
  })
})
