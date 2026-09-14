// panels/work.ts — the five /work panels as lazy chunks (R91). Content per role from `data/roles/<id>.ts`;
// the renderer (RolePanel) is one shared chunk.
import { roles, type RoleContent, type RoleId } from '../data/roles'
import { lazyPanel, type LazyPanel } from './lazy'

const renderer = () => import('../components/RolePanel.vue')

const content: Record<RoleId, () => Promise<{ default: RoleContent }>> = {
  kaufland: () => import('../data/roles/kaufland'),
  gis: () => import('../data/roles/gis'),
  'gis-fullstack': () => import('../data/roles/gis-fullstack'),
  navatec: () => import('../data/roles/navatec'),
  freelance: () => import('../data/roles/freelance'),
}

const panels = new Map<RoleId, LazyPanel>()

export function workPanel(id: RoleId): LazyPanel {
  let panel = panels.get(id)
  if (!panel) {
    panel = lazyPanel(renderer, content[id], (body, props) => ({
      ...props,
      role: roles.find((r) => r.id === id),
      content: body,
    }))
    panels.set(id, panel)
  }
  return panel
}
