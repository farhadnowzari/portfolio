// story/prove-it.ts — Ch 4 "Prove it", the panel's content (R91: one chunk per panel, fetched when the
// panel is about to be shown). Strings verbatim from content/story.ts (R108/R107 rewrite); the index row
// (id, title, callout, meta, nextLabel) stays in ../story.ts so Home / the rail never load a body.
import type { PartContent } from '../story'

export default {
  // R108: the 2020 system was NOT Keycloak. Hand-built identity server, five services, a partner's image
  // processing (biography + interview). Score per CV L49 (R32). 49 words.
  body:
    'At NavaTec I coded. At gis-consulting I wanted the whole system. Six months in, I designed one: five services, a partner’s image processing, a hand-built identity server. Turingpoint pen-tested it: above 95 out of 100. My boss, a colleague and I celebrated. I’ve built radios. I can build this.',
  // R108: Keycloak rows stay, labelled honestly as what came later. The lead-in is the label.
  leadIn: 'Later I learned Keycloak, then taught it: a video and a library.',
  // R108: chips = what Ch 4 actually used. C# per CV L55; Security per CV L16–17 and L49–51. No Keycloak here (Ch 8 keeps it).
  stack: ['Microservices', 'Identity server', 'C#', 'Security'],
  links: [
    // R107: the pen-test line lives on the Architect panel (CV L49–51), so the row targets /work/gis.
    { label: 'The pen-test line', source: '/work', to: { route: 'workGis' } },
    { label: 'Authorization simplified | Keycloak edition', source: 'YouTube', to: { link: 'keycloakVideo' } },
    { label: 'Keycloak.Authz.Net', source: 'GitHub', to: { link: 'keycloakRepo' } },
  ],
} satisfies PartContent
