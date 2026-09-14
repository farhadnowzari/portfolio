// roles.ts — MINE (tech-spec §3: CV-derived, no prose). Months not years (design v4 §5) so the
// `/work` BOM grid is a 180-month bar, not a lying year-granularity one.
// Section ids match design v4 §3 / §4.3 `/work/:section` anchors exactly.
import type { PartId } from './story'
import type { SkillId } from './skills'

export type RoleId = 'kaufland' | 'gis' | 'gis-fullstack' | 'navatec' | 'freelance'

/**
 * R91 (design v9): bullets + stack live in `./roles/<id>.ts`, one chunk per role, fetched when the role is
 * about to be shown (panels/work.ts). `roles` below is the INDEX the rail and the deck need.
 */
export interface RoleContent {
  bullets: string[]
  stack: SkillId[]
}

export interface Role {
  id: RoleId
  title: string
  employer: string
  location: string
  /** YYYY-MM */
  from: string
  /** YYYY-MM, omitted = present */
  to?: string
  /** `/story` parts this role's chapter maps to. */
  parts: PartId[]
}

export const roles: Role[] = [
  {
    id: 'kaufland',
    title: 'Senior Full-Stack Engineer',
    employer: 'Kaufland e-commerce',
    location: 'Remote, Germany',
    from: '2025-03',
    parts: ['millions'],
  },
  {
    id: 'gis',
    title: 'Software Architect',
    employer: 'gis-consulting GmbH',
    location: 'Trossingen, Germany (hybrid)',
    from: '2023-01',
    to: '2025-02',
    parts: ['forty'],
  },
  {
    id: 'gis-fullstack',
    title: 'Full-Stack Engineer',
    employer: 'gis-consulting GmbH',
    location: 'Trossingen, Germany (hybrid)',
    from: '2020-06',
    to: '2022-12',
    parts: ['prove-it'],
  },
  {
    id: 'navatec',
    title: 'Web Developer',
    employer: 'NavaTec GmbH',
    location: 'Remote from Iran / on-site Heilbronn, Germany',
    from: '2016-08',
    to: '2020-05',
    parts: ['old-stuff'],
  },
  {
    id: 'freelance',
    title: 'Full-Stack Developer',
    employer: 'Freelancer',
    location: 'Iran',
    from: '2012-08',
    to: '2016-09',
    parts: ['friend'],
  },
]
