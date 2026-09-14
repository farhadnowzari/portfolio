// skills.ts — MINE (tech-spec §3: not delivered by the storyteller, CV-derived, no prose).
// Groups verbatim from the CV's own skill-group labels (plot v4 §5: "/work = CV skill groups
// verbatim"). `id` is a stable kebab-case slug used by roles.ts `stack: SkillId[]`.
//
// Ruling 55 (binding): `story.ts`'s per-part `stack: string[]` is the authoritative "stack of this
// part" data on its own — StackChips renders those strings directly, it does NOT look them up here.
// This file exists for `/work`'s skills grid and for `roles.ts` cross-linking only.

export type SkillGroup = 'Backend' | 'Architecture and testing' | 'Data and messaging' | 'Platform and SRE' | 'Frontend'

export interface Skill {
  id: string
  label: string
  group: SkillGroup
}

export const skills: Skill[] = [
  // Backend
  { id: 'go', label: 'Go', group: 'Backend' },
  { id: 'nodejs-typescript-nestjs', label: 'Node.js (TypeScript, NestJS)', group: 'Backend' },
  { id: 'csharp-dotnet', label: 'C# (.NET)', group: 'Backend' },
  { id: 'php-laravel', label: 'PHP (Laravel)', group: 'Backend' },
  { id: 'graphql', label: 'GraphQL', group: 'Backend' },
  { id: 'keycloak', label: 'Keycloak (authorization)', group: 'Backend' },
  { id: 'node-red', label: 'Node-RED', group: 'Backend' },
  { id: 'n8n', label: 'n8n', group: 'Backend' },
  // Architecture and testing
  { id: 'microservices', label: 'Microservices', group: 'Architecture and testing' },
  { id: 'event-sourcing', label: 'Event sourcing', group: 'Architecture and testing' },
  { id: 'cqrs', label: 'CQRS', group: 'Architecture and testing' },
  { id: 'ddd', label: 'DDD', group: 'Architecture and testing' },
  { id: 'security', label: 'Security (authentication, authorization, penetration-tested systems)', group: 'Architecture and testing' },
  { id: 'micro-frontends', label: 'Micro-frontends', group: 'Architecture and testing' },
  { id: 'tdd-xunit', label: 'TDD with xUnit', group: 'Architecture and testing' },
  // Data and messaging
  { id: 'kafka', label: 'Kafka', group: 'Data and messaging' },
  { id: 'postgresql', label: 'PostgreSQL', group: 'Data and messaging' },
  { id: 'mysql', label: 'MySQL', group: 'Data and messaging' },
  { id: 'redis', label: 'Redis', group: 'Data and messaging' },
  { id: 'neo4j', label: 'Neo4j', group: 'Data and messaging' },
  { id: 'sql-server', label: 'SQL Server', group: 'Data and messaging' },
  { id: 'elasticsearch', label: 'Elasticsearch', group: 'Data and messaging' },
  { id: 'mqtt', label: 'MQTT (Mosquitto)', group: 'Data and messaging' },
  // Platform and SRE
  { id: 'kubernetes', label: 'Kubernetes (cloud and bare metal)', group: 'Platform and SRE' },
  { id: 'helm', label: 'Helm', group: 'Platform and SRE' },
  { id: 'gitlab-cicd', label: 'GitLab CI/CD', group: 'Platform and SRE' },
  { id: 'github-actions', label: 'GitHub Actions', group: 'Platform and SRE' },
  { id: 'flux', label: 'Flux', group: 'Platform and SRE' },
  { id: 'datadog', label: 'Datadog', group: 'Platform and SRE' },
  { id: 'google-cloud', label: 'Google Cloud', group: 'Platform and SRE' },
  { id: 'azure', label: 'Azure', group: 'Platform and SRE' },
  { id: 'open-telekom-cloud', label: 'Open Telekom Cloud', group: 'Platform and SRE' },
  { id: 'claude-code', label: 'Claude Code and coding agents', group: 'Platform and SRE' },
  // Frontend
  { id: 'vue', label: 'Vue 2 and 3 (TypeScript)', group: 'Frontend' },
  { id: 'react', label: 'React', group: 'Frontend' },
  { id: 'single-spa', label: 'single-spa (micro-frontends)', group: 'Frontend' },
  { id: 'scss', label: 'SCSS', group: 'Frontend' },
]

export type SkillId = (typeof skills)[number]['id']

export const skillGroups: SkillGroup[] = [
  'Backend',
  'Architecture and testing',
  'Data and messaging',
  'Platform and SRE',
  'Frontend',
]

/**
 * R104/R111 (bare-name rule): a /work role's chip is the BARE skill name ("Kubernetes", "Node.js"), never the
 * /skills-only `skillShort` form ("K8s (cloud, metal)") and never the global label's qualifier, which sums
 * every role; no tooltip re-claims it. Bare = the label minus its trailing `(…)`, plus the labels whose
 * qualifier is not in parentheses. R109: "TDD with xUnit" is the tool's name on a role, `xUnit`.
 */
const BARE: Record<string, string> = {
  'Vue 2 and 3 (TypeScript)': 'Vue',
  'Claude Code and coding agents': 'Claude Code',
  'TDD with xUnit': 'xUnit',
}

export function bareLabel(label: string): string {
  return BARE[label] ?? label.replace(/\s*\([^)]*\)\s*$/, '')
}

/** The chip text for a role's `stack` entry. */
export function skillChip(id: SkillId): string {
  return bareLabel(skills.find((s) => s.id === id)?.label ?? id)
}
