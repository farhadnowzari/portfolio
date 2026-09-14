// story/quiet.ts — Ch 7 "The quiet part", the panel's content (R91: one chunk per panel, fetched when the
// panel is about to be shown). Strings verbatim from plot v4 §2; the index row (id, title, callout, meta,
// nextLabel) stays in ../story.ts so Home / the rail never load a body.
import type { PartContent } from '../story'

export default {
  body:
    'In meetings I sometimes go quiet first. Quiet means I’m processing. Then everything clicks and the implementation starts. That moment is why I do this. It’s the closest thing to art I know. I love brainstorming with a team. Ideas should fight. People shouldn’t.',
  stack: [],
  links: [
    { label: 'Here’s what I do with the clicks', source: '/community', to: { route: 'community' } },
  ],
} satisfies PartContent
