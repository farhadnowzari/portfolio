// community.ts — `/community` ledger. Order, labels, counters and the "At home" row from plot v4 §5.
// The one-line "why" per row (≤ 12 words) is new copy this round — v4 asked for it but did not write it.
// Copied from content/community.ts unchanged.
import type { LinkKey } from './links'
import type { PartId } from './story'

export type LedgerKind = 'repo' | 'video' | 'article' | 'channel' | 'profile'

export interface LedgerRow {
  id: string
  kind: LedgerKind
  /** Row label — same text as the link registry label. */
  label: string
  source: string
  link: LinkKey
  /** ≤ 12 words. */
  why: string
  /** The story part this belongs to. */
  part: PartId
}

export interface Counter {
  label: string
  value: string
  source: 'cv'
}

export const ledger: LedgerRow[] = [
  { id: 'ogm-repo', kind: 'repo', label: 'Neo4j.Berries.OGM', source: 'GitHub', link: 'ogmRepo', part: 'forty',
    why: 'Neo4j for people who already know EF Core. MIT, 41 stars.' },
  { id: 'flux-video', kind: 'video', label: 'Enjoy being a Devops with Flux CI/CD', source: 'YouTube', link: 'fluxVideo', part: 'together',
    why: 'GitOps on your own cluster. Push, and it deploys.' },
  { id: 'gitlab-video', kind: 'video', label: 'How to install Gitlab on Kubernetes? here is how!', source: 'YouTube', link: 'gitlabVideo', part: 'together',
    why: 'Your own GitLab, on your own cluster, step by step.' },
  { id: 'keycloak-video', kind: 'video', label: 'Authorization simplified | Keycloak edition', source: 'YouTube', link: 'keycloakVideo', part: 'prove-it',
    why: 'Keycloak, learned after the hand-built one. Authorization, explained.' }, // R108
  { id: 'ogm-video', kind: 'video', label: 'OGM, C# loves neo4j', source: 'YouTube', link: 'ogmVideo', part: 'forty',
    why: 'The OGM, live: C# talking to a graph.' },
  { id: 'keycloak-repo', kind: 'repo', label: 'Keycloak.Authz.Net', source: 'GitHub', link: 'keycloakRepo', part: 'prove-it',
    why: 'Fine-grained Keycloak authorization for C#. The library behind the video.' },
  { id: 'camera-repo', kind: 'repo', label: 'easy-vue-camera', source: 'GitHub', link: 'cameraRepo', part: 'together',
    why: 'Camera access in the browser, one Vue component.' },
  { id: 'ogm-article', kind: 'article', label: 'Neo4j with C#, Part 1: Intro', source: 'Medium', link: 'ogmArticle', part: 'forty',
    why: 'Same OGM, in writing. Start here if you read.' },
  { id: 'channel', kind: 'channel', label: 'The whole channel', source: 'YouTube', link: 'channel', part: 'together',
    why: '47 videos. Bare-metal Kubernetes to micro-frontends.' },
  { id: 'all-repos', kind: 'profile', label: 'All repos', source: 'GitHub', link: 'github', part: 'together',
    why: 'The rest: libraries, experiments, the odd tool.' },
]

/** No "53 repos" (R42). */
export const counters: Counter[] = [
  { label: 'videos', value: '47', source: 'cv' },
  { label: 'views', value: '126k', source: 'cv' },
  { label: 'stars', value: '41', source: 'cv' },
  { label: 'downloads / yr', value: '21k', source: 'cv' },
]

/** R44. Text only, no links — nothing on the allowed list points at these. Last label is the ruled wording. */
export const atHome = {
  heading: 'At home',
  items: ['Camunda saga', 'Node-RED', 'self-hosted AI', 'Devlog voice assistant', 'productivity tool tuned for ADHD'],
}
