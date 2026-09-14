// story/radio.ts — Ch 1 "The radio", the panel's content (R91: one chunk per panel, fetched when the
// panel is about to be shown). Strings verbatim from plot v4 §2; the index row (id, title, callout, meta,
// nextLabel) stays in ../story.ts so Home / the rail never load a body.
import type { PartContent } from '../story'

export default {
  body:
    'I was seven when I soldered my first board. A radio. Nobody told me how it worked, so I took it apart until I knew. That habit never left. I don’t memorize the formula. I understand it. Everything that follows is that habit, repeated.',
  stack: [],
  links: [],
} satisfies PartContent
