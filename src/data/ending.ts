// ending.ts — the block after Ch 8. Plot v4 §3, verbatim. No image, lots of air.
// Copied from content/ending.ts unchanged.
import type { LinkKey } from './links'

export interface Ending {
  /** No period. One space, then the cursor. The cursor is a CSS box (no `▮` glyph in either font), `aria-hidden`. */
  sentence: string
  /** Screen-reader text for the whole line: sentence + what the cursor means. */
  sentenceAria: string
  /** 8 words. Smaller, one line, directly under. Contact, not a job ask (R46). */
  subline: string
  /** Plain text, both clickable. */
  contact: { label: string; link: LinkKey }[]
  /** Ending order: Email leads because the story ends on a conversation. */
  buttons: { label: string; link: LinkKey }[]
}

export const ending: Ending = {
  sentence: 'My life is engineering software which serves',
  sentenceAria: 'My life is engineering software which serves. Unfinished sentence, still typing.',
  subline: 'Still typing. Say hi and I’ll finish it.',
  contact: [
    { label: 'fdn.sharp@gmail.com', link: 'email' },
    { label: 'linkedin.com/in/farhad-nowzari-94060699', link: 'linkedin' },
  ],
  buttons: [
    { label: 'Email', link: 'email' },
    { label: 'LinkedIn', link: 'linkedin' },
    { label: 'GitHub', link: 'github' },
    { label: 'YouTube', link: 'channel' },
    { label: 'CV', link: 'cv' },
  ],
}
