// story.ts — the eight parts of `/story`. Plot v4 §2, every string verbatim.
// Bodies ≤ 50 words (meta line, sidebar and lead-in are not counted). No framework imports.
//
// Copied from content/story.ts with tech-spec §3's fix 2: Ch4's `/work` link row now targets
// `workGisFullstack` (2020–2022, Full-Stack Engineer) instead of `workGis` (2023–2025, Software
// Architect, which is Ch5's role) — a target fix only, row label text is untouched.
//
// Ruling 55: the `stack` list below IS the "stack of this part" data — the storyteller's from-text
// lists are authoritative. StackChips renders these strings directly; a skills.ts lookup may enrich
// them (cross-linking to /work) but never replaces or re-derives the list.
import type { LinkKey, RouteKey } from './links'

export type PartId =
  | 'radio'
  | 'friend'
  | 'old-stuff'
  | 'prove-it'
  | 'forty'
  | 'millions'
  | 'quiet'
  | 'together'

export interface Callout {
  /** Typography, not a graphic. */
  display: string
  /** Read by screen readers instead of `display`. */
  aria: string
  /** ≤4 words under/beside `display` for sighted readers (callouts-v2, R70). `aria` still carries the sentence. */
  caption?: string
}

export type LinkRow =
  | { label: string; source: string; to: { link: LinkKey } }
  | { label: string; source: string; to: { route: RouteKey } }

/**
 * R91 (design v9): the panel's body lives in its own module, `./story/<id>.ts`, one chunk per chapter,
 * fetched when the chapter is about to be shown (panels/story.ts). `parts` below is the INDEX: what the
 * Home peek, the exploded view, the rail and the counter need without loading a single body.
 */
export interface PartContent {
  /** ≤ 50 words. */
  body: string
  /** Ch 5 only. Separate from the body, not counted. */
  sidebar?: string
  /** Ch 4 only. Sits above the link rows. */
  leadIn?: string
  /** "Stack of this part" — names only, no years. Engineer maps labels to SkillId. */
  stack: string[]
  /** Outbound / cross-route rows, in this order. Do not add more. Rendered `label · source →`. */
  links: LinkRow[]
}

export interface Part {
  id: PartId
  /** 1-based, shown as `04/08`. */
  index: number
  title: string
  /** `role · employer · years`, CV wording. Ch 2–6 only. One mono line; may wrap at ` · ` on narrow screens. */
  meta?: string
  callout?: Callout
  /** Label for the next-chapter control. Ch 3 and Ch 8 carry their own; others use `nextLabels.chapter`. No arrow in the string, the component adds the glyph. */
  nextLabel?: string
}

/**
 * Next-control strings (R71/80, R86). Engineer: read `part.nextLabel ?? nextLabels.chapter` on `/story`,
 * `nextLabels.workRole` for the control between roles on `/work`. The component adds the glyph.
 */
export const nextLabels = {
  /** `/story` default, one chapter per screen. */
  chapter: 'Next chapter',
  /** `/work`, between roles. Mono. Order-neutral on purpose (works newest-first or oldest-first). */
  workRole: 'Next role',
} as const

/** @deprecated Use `nextLabels.chapter`. Kept so an existing import does not break. */
export const nextLabelDefault = nextLabels.chapter

export const parts: Part[] = [
  {
    id: 'radio',
    index: 1,
    title: 'The radio',
    callout: { display: '7', aria: 'Seven years old', caption: 'age 7' },
  },
  {
    id: 'friend',
    index: 2,
    title: 'My friend was code',
    meta: 'Full-Stack Developer · Freelancer, Iran · 2012 – 2016',
    callout: { display: '2009', aria: 'Bachelor, 2009 to 2015', caption: 'started university' },
  },
  {
    id: 'old-stuff',
    index: 3,
    title: 'Very old stuff :D',
    meta: 'Web Developer · NavaTec GmbH · 2016 – 2020',
    callout: { display: '19', aria: '19 months of military service', caption: 'months in service' },
    nextLabel: 'What I did about the scripts',
  },
  {
    id: 'prove-it',
    index: 4,
    title: 'Prove it',
    meta: 'Full-Stack Engineer · gis-consulting GmbH · 2020 – 2022',
    callout: { display: '>95', aria: 'Pen-test score above 95 out of 100', caption: 'pen-test score' },
  },
  {
    id: 'forty',
    index: 5,
    title: 'Forty services. One me.',
    meta: 'Software Architect · gis-consulting GmbH · 2023 – 2025',
    callout: { display: '40→10', aria: 'Forty services became ten', caption: 'services, before → after' },
  },
  {
    id: 'millions',
    index: 6,
    title: 'Millions at the year-end peak',
    meta: 'Senior Full-Stack Engineer · Kaufland e-commerce · 2025 – present',
    callout: { display: 'millions', aria: 'Millions of requests at the year-end peak', caption: 'requests at peak' },
  },
  {
    id: 'quiet',
    index: 7,
    title: 'The quiet part',
    // No callout on purpose. Whitespace.
  },
  {
    id: 'together',
    index: 8,
    title: 'Push the limits together',
    callout: { display: '47', aria: '47 videos', caption: 'videos' },
    /** R86: leads into the ending panel (the open sentence + cursor). */
    nextLabel: 'One sentence left',
  },
]
