// roles/gis-fullstack.ts — Full-Stack Engineer · gis-consulting GmbH, the panel's content (R91: one chunk per panel). CV-derived,
// verbatim from the former roles.ts entry; the index row (title, employer, dates, parts) stays in ../roles.ts.
import type { RoleContent } from '../roles'

export default {
  bullets: [
    'Backend services in C# (.NET) and Node.js (TypeScript), some Go: GraphQL, SQL Server, Kafka, Elasticsearch, Redis, xUnit tests',
    'Built the new frontend in Vue 2 and 3 with single-spa micro-frontends, TypeScript and SCSS',
    'Kubernetes deployments with Helm and GitLab CI/CD on Azure, Open Telekom Cloud and on-premise',
  ],
  stack: ['csharp-dotnet', 'nodejs-typescript-nestjs', 'go', 'graphql', 'sql-server', 'kafka', 'elasticsearch', 'redis', 'tdd-xunit', 'vue', 'single-spa', 'scss', 'kubernetes', 'helm', 'gitlab-cicd', 'azure', 'open-telekom-cloud'],
} satisfies RoleContent
