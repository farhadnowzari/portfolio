// roles/gis.ts — Software Architect · gis-consulting GmbH, the panel's content (R91: one chunk per panel). CV-derived,
// verbatim from the former roles.ts entry; the index row (title, employer, dates, parts) stays in ../roles.ts.
import type { RoleContent } from '../roles'

export default {
  bullets: [
    'Led the migration of a monolithic application to microservices: architecture, development and deployment of the new services in C# (.NET) and Node.js, with GraphQL, Neo4j, PostgreSQL, Kafka, Elasticsearch and Redis',
    'Team lead of 6 to 7 developers (3 remote in Ukraine, 3 to 4 in Germany), mentored them along the way; about 40 services carved out at first, later stripped down to 10 with a more generic system design',
    'Services I designed at gis passed 4 penetration tests by Turingpoint between 2020 and 2025, scores above 95 out of 100, on on-premise networks and on Azure and Open Telekom Cloud (the first while still Full-Stack Engineer, the rest as architect)',
    'Managed the GitLab CI/CD pipeline and the Kubernetes deployments (Helm) on Azure, Open Telekom Cloud and on-premise clusters',
  ],
  // R109/R114 (host override): Microservices (L45), Security (L49–51, this role only), TDD with xUnit (C# role); no Event sourcing.
  stack: ['csharp-dotnet', 'nodejs-typescript-nestjs', 'graphql', 'neo4j', 'postgresql', 'kafka', 'elasticsearch', 'redis', 'microservices', 'security', 'tdd-xunit', 'kubernetes', 'helm', 'gitlab-cicd', 'azure', 'open-telekom-cloud'],
} satisfies RoleContent
