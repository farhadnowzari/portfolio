// story/forty.ts — Ch 5 "Forty services. One me.", the panel's content (R91: one chunk per panel, fetched when the
// panel is about to be shown). Strings verbatim from plot v4 §2; the index row (id, title, callout, meta,
// nextLabel) stays in ../story.ts so Home / the rail never load a body.
import type { PartContent } from '../story'

export default {
  body:
    'As Software Architect I led the carve-up: one monolith, ~40 microservices. It worked. Also chaos: I maintained all forty while my team of seven coded. One customer’s network was locked down. Deploy without touching code. We went generic: 10 services, Kubernetes CRDs, Neo4j for our graph. Coding dropped roughly 90%.',
  sidebar:
    'No C# OGM for Neo4j felt right. So we wrote one, for anyone who already knows EF Core. Neo4j.Berries.OGM, MIT, 41 stars.',
  stack: ['.NET', 'Kubernetes', 'Neo4j', 'PostgreSQL'],
  links: [
    { label: 'Neo4j.Berries.OGM', source: 'GitHub', to: { link: 'ogmRepo' } },
    { label: 'OGM, C# loves neo4j', source: 'YouTube', to: { link: 'ogmVideo' } },
    { label: 'Neo4j with C#, Part 1: Intro', source: 'Medium', to: { link: 'ogmArticle' } },
    { label: 'gis-consulting, 2020 – 2025', source: '/work', to: { route: 'workGis' } },
  ],
} satisfies PartContent
