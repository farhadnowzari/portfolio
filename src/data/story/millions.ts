// story/millions.ts — Ch 6 "Millions at the year-end peak", the panel's content (R91: one chunk per panel, fetched when the
// panel is about to be shown). Strings verbatim from plot v4 §2; the index row (id, title, callout, meta,
// nextLabel) stays in ../story.ts so Home / the rail never load a body.
import type { PartContent } from '../story'

export default {
  body:
    'Then it was time to explore more in the industry. March 2025: Kaufland e-commerce. A Go service from scratch: millions of requests at the year-end peak. Kafka and event sourcing feed other teams. NestJS pushes events to millions of devices. I own the design and architecture decisions in the team.',
  stack: ['Go', 'NestJS', 'Kafka', 'MySQL', 'Redis', 'Kubernetes', 'Helm', 'GitLab CI/CD', 'Google Cloud', 'Claude Code'],
  links: [
    { label: 'Kaufland e-commerce, 2025 – present', source: '/work', to: { route: 'workKaufland' } },
    { label: 'The CV says it shorter', source: 'PDF', to: { link: 'cv' } },
  ],
} satisfies PartContent
