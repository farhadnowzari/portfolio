// skills-copy.ts — copied from content/skills-copy.ts unchanged (R73). Consumed by SkillsView / WorkView foot rows.
// skills-copy.ts — Ravi. R68 (/skills is its own route) + R73 (chip-only shorts, header, cross-links).
// Voice R23 first-person playful; R46 no job-seeking signal. No framework imports.
//
// Cross-links follow the site's row grammar `label · source →` (story.ts LinkRow), so they read as the
// same kind of row the chapters already end with. `→` is in the string; drop it if the component appends its own.

export const skillsCopy = {
  /** `/skills` header line under the "Skills" title. 9 words. */
  header: 'Every chip I’ve soldered in, grouped like my CV.',
  /** `/skills` foot → /work. */
  toWork: 'Where I used them · /work →',
  /** `/work` foot → /skills. */
  toSkills: 'Every chip, one sheet · /skills →',
}

/**
 * Chip-only short labels, keyed by the exact `skills.ts` label. ≤18 chars each.
 * Used ONLY where the label sits inside a `.chip`; the long label stays the truth everywhere else
 * (title attr / aria-label / CV). Chips not listed here render their label verbatim.
 * Grammar matches the sibling chips (`C# (.NET)`, `PHP (Laravel)`): name, then the qualifier in parens.
 */
export const skillShort: Record<string, string> = {
  'Node.js (TypeScript, NestJS)': 'Node (TS, NestJS)', // 17
  'Security (authentication, authorization, penetration-tested systems)': 'Security (pentest)', // 18 — "Security" carries authn/authz; "pentest" is the part worth keeping
  'TDD with xUnit': 'xUnit', // 5. R109: chip text is the tool name
  'Kubernetes (cloud and bare metal)': 'K8s (cloud, metal)', // 18 — "metal" = bare metal, the way infra people say it
  'Claude Code and coding agents': 'Claude Code & co.', // 17 — "& co." = the other coding agents; parens form would be 20
}
