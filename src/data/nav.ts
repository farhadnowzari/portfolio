// nav.ts — MINE. Bottom-bar / top-bar tab labels + icon refs (design v4 §3, §7.4).
import type { RouteKey } from './links'

export interface NavItem {
  label: string
  route: RouteKey
  /** Matches an icon component name in components/icons/. */
  icon: 'story' | 'work' | 'skills' | 'community'
}

/** The four route tabs — desktop top bar (middle) and mobile bottom bar (all four items). R68: Skills in slot 3. */
export const navItems: NavItem[] = [
  { label: 'Story', route: 'story', icon: 'story' },
  { label: 'Work', route: 'work', icon: 'work' },
  { label: 'Skills', route: 'skills', icon: 'skills' },
  { label: 'Community', route: 'community', icon: 'community' },
]
