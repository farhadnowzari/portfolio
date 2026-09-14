// profile.ts — the card (`/`) and the plot-owned header lines of `/work`. Plot v4 §1 and §4, verbatim.
// Copied from content/profile.ts unchanged (tech-spec §3).
import type { LinkKey } from './links'

export interface CardButton {
  label: string
  link: LinkKey
}

export interface Profile {
  name: string
  /** CV title, verbatim. */
  title: string
  /** Smaller than the title, directly under it, no blank line between. */
  employerLine: string
  /** 9 words. The one card line allowed to wrap to two. */
  promise: string
  /** 38 chars. Card only. */
  location: string
  /** Long CV form. `/work` header only. */
  locationLong: string
  /** 37 chars. Names only; parentheticals live in /work skills. */
  stackLine: string
  /** Card buttons, in card order. CV first. */
  buttons: CardButton[]
  /**
   * The arrow is a separate token: Fraunces has no `↓` (engineer: mono span or SVG).
   * `num` is the inline chapter-1 callout digit (R62) — real content (`story.ts` `radio.callout.display`),
   * not a separate invented value. Sentence reads `{arrow} {pre}{num}{post}`.
   */
  hook: { arrow: string; pre: string; num: string; post: string }
  /** `/work` header, four text lines in this order, then [ Download CV ], then ROLES. */
  workHeader: {
    lead: string
    location: string
    authorization: string
    languages: string
    downloadLabel: string
  }
}

export const profile: Profile = {
  name: 'Farhad Nowzari',
  title: 'Senior Backend / Full-Stack Engineer',
  employerLine: 'at Kaufland e-commerce',
  promise: 'I build systems that survive traffic and pen tests.',
  location: 'Stuttgart · in German teams since 2016',
  locationLong: 'Stuttgart, Germany · working with German companies since 2016',
  stackLine: 'Go · NestJS · C# · Kafka · Kubernetes',
  buttons: [
    { label: 'CV', link: 'cv' },
    { label: 'Email', link: 'email' },
    { label: 'LinkedIn', link: 'linkedin' },
    { label: 'GitHub', link: 'github' },
    { label: 'YouTube', link: 'channel' },
  ],
  // R62: number inlined into the sentence, copper mono — ch1's real callout (story.ts `radio.callout.display`).
  hook: { arrow: '↓', pre: 'How I got here. At ', num: '7', post: ', it started with a radio.' },
  workHeader: {
    lead: 'Senior Backend / Full-Stack Engineer. I build systems that survive traffic and pen tests.',
    location: 'Stuttgart, Germany · working with German companies since 2016',
    authorization: 'Authorized to work in Germany',
    languages: 'English (Fluent) · German (B1) · Persian (Native)',
    downloadLabel: 'Download CV',
  },
}
