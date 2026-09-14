// story/friend.ts — Ch 2 "My friend was code", the panel's content (R91: one chunk per panel, fetched when the
// panel is about to be shown). Strings verbatim from plot v4 §2; the index row (id, title, callout, meta,
// nextLabel) stays in ../story.ts so Home / the rail never load a body.
import type { PartContent } from '../story'

export default {
  body:
    'Math in high school. Software engineering at Jahrom University. Not many friends. Fine, code was my friend. I started in Visual Basic, not the C/C++ they taught. Robotics gave me the best feeling in this job: watching my code move. Then a friend’s startup pulled me into C#. I stayed.',
  stack: ['Visual Basic', 'C#'],
  links: [
    { label: 'The freelance years', source: '/work', to: { route: 'workFreelance' } },
  ],
} satisfies PartContent
