// roles/kaufland.ts — Senior Full-Stack Engineer · Kaufland e-commerce, the panel's content (R91: one chunk per panel). CV-derived,
// verbatim from the former roles.ts entry; the index row (title, employer, dates, parts) stays in ../roles.ts.
import type { RoleContent } from '../roles'

export default {
  bullets: [
    'Built a Go backend service from scratch, following the company conventions and standards: it serves B2C users with millions of requests at the year-end peak, plus B2B and internal users',
    'The same service feeds systems of other teams through Kafka and event sourcing; a second backend in NestJS (TypeScript) pushes events to millions of user devices on the B2C side',
    'Lead complex initiatives that need technical judgment and communication across teams; responsible for the design and architecture decisions inside the team',
    'Deployments on Kubernetes with Helm and GitLab CI/CD on Google Cloud, MySQL, Redis and Kafka behind the services; Claude Code and coding agents are part of the daily toolchain',
  ],
  // R114 (host override): Event sourcing on Kaufland only (CV L38 "through Kafka and event sourcing").
  stack: ['go', 'nodejs-typescript-nestjs', 'kafka', 'event-sourcing', 'mysql', 'redis', 'kubernetes', 'helm', 'gitlab-cicd', 'google-cloud', 'claude-code'],
} satisfies RoleContent
