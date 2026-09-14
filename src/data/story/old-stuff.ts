// story/old-stuff.ts — Ch 3 "Very old stuff :D", the panel's content (R91: one chunk per panel, fetched when the
// panel is about to be shown). Strings verbatim from plot v4 §2; the index row (id, title, callout, meta,
// nextLabel) stays in ../story.ts so Home / the rail never load a body.
import type { PartContent } from '../story'

export default {
  body:
    'Military service, 19 months. Meanwhile, keyvent: ticketing for a startup in Germany. C# and PHP Laravel. Very old stuff. Then Heilbronn. Investor trouble, a pivot, two of us left. We rebuilt it on AWS. I ran deploy scripts I didn’t yet understand. Customers came. Then Covid closed the chapter.',
  stack: ['C#', 'PHP Laravel', 'AWS'],
  links: [
    { label: 'NavaTec, 2016 – 2020', source: '/work', to: { route: 'workNavatec' } },
  ],
} satisfies PartContent
