// panels/story.ts — the nine /story panels as lazy chunks (R91). Content per chapter from
// `data/story/<id>.ts`; the renderer (StoryPanel) is one shared chunk; the ending is its own component.
import { parts, type PartContent, type PartId } from '../data/story'
import { lazyComponent, lazyPanel, type LazyPanel } from './lazy'

export const ENDING = 'ending'
export type StoryPanelId = PartId | typeof ENDING

const renderer = () => import('../components/StoryPanel.vue')

// Written out (not `import(\`./story/${id}\`)`) so each chunk keeps its chapter name in the build output.
const content: Record<PartId, () => Promise<{ default: PartContent }>> = {
  radio: () => import('../data/story/radio'),
  friend: () => import('../data/story/friend'),
  'old-stuff': () => import('../data/story/old-stuff'),
  'prove-it': () => import('../data/story/prove-it'),
  forty: () => import('../data/story/forty'),
  millions: () => import('../data/story/millions'),
  quiet: () => import('../data/story/quiet'),
  together: () => import('../data/story/together'),
}

const panels = new Map<StoryPanelId, LazyPanel>()

export function storyPanel(id: StoryPanelId): LazyPanel {
  let panel = panels.get(id)
  if (!panel) {
    panel =
      id === ENDING
        ? lazyComponent(() => import('../components/EndingPanel.vue'))
        : lazyPanel(renderer, content[id], (body, props) => ({
            ...props,
            part: parts.find((p) => p.id === id),
            content: body,
          }))
    panels.set(id, panel)
  }
  return panel
}
