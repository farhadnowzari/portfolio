// links.ts — the allowed-URL registry. Plot v4 §5: "Nothing else may appear on the site."
// Every href anywhere in the app is `links[key]`. No framework imports.
// `title` = the real title of the target (YouTube oEmbed / GitHub API, fetched 2026-09-14);
// `label` = the row text from plot v4, verbatim (`label · source →` is split into label + source).
//
// Copied from content/links.ts with tech-spec §3's two fixes:
//   1. cv.href moved to public/assets (R52) — served from /assets, not /cv.
//   2. routes gets `workGisFullstack` (Ch4's target, split from `workGis`/Ch5) plus
//      `workLanguages` / `workParts`, the two non-role /work anchors design v4 §3 lists.

export type LinkKind = 'channel' | 'video' | 'repo' | 'profile' | 'article' | 'email' | 'linkedin' | 'pdf'

export interface Link {
  href: string
  kind: LinkKind
  /** Row label as it appears on the site — plot v4 §5 wording. */
  label: string
  /** Source shown after the ` · ` in a row. */
  source: string
  /** Real title of the destination (for aria-label / title attr). */
  title: string
  /** Where plot v4 allows it to appear. Documentation only. */
  where: string
  /** Optional saved-file name for the browser's download attribute. */
  download?: string
}

export const links = {
  channel: {
    href: 'https://www.youtube.com/@nowzarifarhad',
    kind: 'channel',
    label: 'The whole channel',
    source: 'YouTube',
    title: 'Farhad Nowzari, YouTube channel (@nowzarifarhad)',
    where: 'Card, Ch 8, /community, ending',
  },
  fluxVideo: {
    href: 'https://www.youtube.com/watch?v=X-5hH03XHgk',
    kind: 'video',
    label: 'Enjoy being a Devops with Flux CI/CD',
    source: 'YouTube',
    // Real title carries a trailing 🍹 emoji; the row label omits it (no emoji glyph in either font).
    title: 'Enjoy being a Devops with Flux CI/CD 🍹',
    where: 'Ch 8, /community',
  },
  gitlabVideo: {
    href: 'https://www.youtube.com/watch?v=4yIIqQczAXY',
    kind: 'video',
    label: 'How to install Gitlab on Kubernetes? here is how!',
    source: 'YouTube',
    title: 'How to install Gitlab on Kubernetes? here is how!',
    where: 'Ch 8, /community',
  },
  keycloakVideo: {
    href: 'https://www.youtube.com/watch?v=E5g50CVRGv8',
    kind: 'video',
    label: 'Authorization simplified | Keycloak edition',
    source: 'YouTube',
    title: 'Authorization simplified | Keycloak edition',
    where: 'Ch 4, /community',
  },
  ogmVideo: {
    href: 'https://www.youtube.com/watch?v=14SVhbEFQpM',
    kind: 'video',
    label: 'OGM, C# loves neo4j',
    source: 'YouTube',
    title: 'OGM, C# loves neo4j',
    where: 'Ch 5, /community',
  },
  ogmArticle: {
    href: 'https://fdn-sharp.medium.com/neo4j-with-c-part-1-intro-f43eba15e75c',
    kind: 'article',
    label: 'Neo4j with C#, Part 1: Intro',
    source: 'Medium',
    title: 'Neo4j with C#, Part 1: Intro',
    where: 'Ch 5, /community',
  },
  github: {
    href: 'https://github.com/farhadnowzari',
    kind: 'profile',
    label: 'All repos',
    source: 'GitHub',
    title: 'Farhad Nowzari (farhadnowzari) on GitHub',
    where: 'Card, Ch 8, /community, ending',
  },
  ogmRepo: {
    href: 'https://github.com/berrybeat/Neo4j.Berries.OGM',
    kind: 'repo',
    label: 'Neo4j.Berries.OGM',
    source: 'GitHub',
    title: 'berrybeat/Neo4j.Berries.OGM: This repository adds an OGM functionality for csharp',
    where: 'Ch 5, /community #1',
  },
  keycloakRepo: {
    href: 'https://github.com/farhadnowzari/Keycloak.Authz.Net',
    kind: 'repo',
    label: 'Keycloak.Authz.Net',
    source: 'GitHub',
    title: 'farhadnowzari/Keycloak.Authz.Net: This library is designed to give C# the power of fine-grained authorization from keycloak',
    where: 'Ch 4, /community',
  },
  cameraRepo: {
    href: 'https://github.com/farhadnowzari/easy-vue-camera',
    kind: 'repo',
    label: 'easy-vue-camera',
    source: 'GitHub',
    title: 'farhadnowzari/easy-vue-camera',
    where: 'Ch 8, /community',
  },
  email: {
    href: 'mailto:fdn.sharp@gmail.com',
    kind: 'email',
    label: 'fdn.sharp@gmail.com',
    source: 'Email',
    title: 'Email Farhad Nowzari',
    where: 'Card, ending',
  },
  linkedin: {
    href: 'https://linkedin.com/in/farhad-nowzari-94060699',
    kind: 'linkedin',
    label: 'linkedin.com/in/farhad-nowzari-94060699',
    source: 'LinkedIn',
    title: 'Farhad Nowzari on LinkedIn',
    where: 'Card, ending',
  },
  // Ruling 52: the CV file is "Farhad Nowzari - 2026-CV.pdf", served from public/assets/.
  cv: {
    href: '/assets/Farhad Nowzari - 2026-CV.pdf',
    kind: 'pdf',
    label: 'CV',
    source: 'PDF',
    title: 'Farhad Nowzari, CV (PDF, 2026)',
    where: 'Card button, top of /work, end of Ch 6, ending',
    download: 'Farhad Nowzari - 2026-CV.pdf',
  },
} as const satisfies Record<string, Link>

export type LinkKey = keyof typeof links

/** Typed accessor for generic lookups (`links[someVariableKey]`) — the literal `as const` map
 * gives each key its own narrow type, so a variable key needs this to widen back to `Link`. */
export function getLink(key: LinkKey): Link {
  return links[key]
}

/**
 * Internal routes the copy points at (hash mode; `/work#x` → `/work/x` per the engineer).
 * `workGisFullstack` / `workLanguages` / `workParts` added per tech-spec §3 fix 2: design v4 §3
 * splits gis-consulting into two role sections (Architect `gis`, Full-Stack `gis-fullstack`) and
 * lists two non-role anchors (`languages`, `parts`) that /work's own nav needs even though nothing
 * in story.ts links to them yet.
 */
export const routes = {
  home: '/',
  story: '/story',
  work: '/work',
  workFreelance: '/work/freelance',
  workNavatec: '/work/navatec',
  workGis: '/work/gis',
  workGisFullstack: '/work/gis-fullstack',
  workKaufland: '/work/kaufland',
  workLanguages: '/work/languages',
  // R68: skills left /work for their own route; `workParts` (`/work/parts`) had no consumer and no
  // anchor any more — dropped, not retargeted.
  skills: '/skills',
  community: '/community',
} as const

export type RouteKey = keyof typeof routes

/**
 * R116: every off-site link opens in a new tab. External = an absolute `http(s)` href (YouTube, GitHub,
 * Medium, LinkedIn); same-origin (`/assets/…`), hash routes and `mailto:` stay in the tab. Spread onto
 * the `<a>` (`v-bind="externalAttrs(link)"`); index.html's hand-typed card carries the same two attributes.
 */
export function isExternal(href: string): boolean {
  return /^https?:\/\//.test(href)
}

export function externalAttrs(link: Pick<Link, 'href'>): { target?: '_blank'; rel?: 'noopener noreferrer' } {
  return isExternal(link.href) ? { target: '_blank', rel: 'noopener noreferrer' } : {}
}
