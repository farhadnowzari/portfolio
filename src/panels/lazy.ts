// panels/lazy.ts — R91 (design v9): every deck panel is fetched when it is about to be shown, never
// bundled into the route chunk. A panel = one shared RENDERER chunk (StoryPanel / RolePanel + PartArt,
// chips, link rows: loaded once per route) + one CONTENT chunk per panel (`data/story/<id>.ts`,
// `data/roles/<id>.ts`: the body, ~0.4 KB gz each). `defineAsyncComponent` binds the two into a
// component the deck can key, ref and transition like a plain one.
//
// `prefetch` runs the async wrapper's OWN loader (not just the imports): once it has resolved, the
// wrapper renders its inner component synchronously on first render, so a prefetched panel mounts
// in the same patch as the outgoing one leaves (both sheets on the same push, §1c) and a deep link
// lands with no enter animation. The views prefetch the next panel on arrival and a rail item on
// hover, and gate the deck's first render on the landing panel. A panel that was NOT prefetched
// (a rail jump without hover, `End`) mounts a placeholder first: the outgoing sheet leaves, the
// stage is board colour, the incoming sheet pushes in when its chunk lands. A failed fetch retries
// twice, then fails quietly: nothing half-drawn.
import { defineAsyncComponent, defineComponent, h, type Component } from 'vue'

type Loader<T> = () => Promise<{ default: T }>

export interface LazyPanel {
  component: Component
  prefetch: () => Promise<unknown>
}

/**
 * @param renderer  the shared panel component's import
 * @param content   this panel's content import
 * @param bind      maps the loaded content + the deck's props (`total`, `nextTo`, `index`…) to the
 *                  renderer's props
 */
export function lazyPanel<R extends Component, C>(
  renderer: Loader<R>,
  content: Loader<C>,
  bind: (content: C, props: Record<string, unknown>) => Record<string, unknown>,
): LazyPanel {
  return wrap(async () => {
    const [{ default: Renderer }, { default: body }] = await Promise.all([renderer(), content()])
    return defineComponent({
      inheritAttrs: false,
      setup: (_, { attrs }) => () => h(Renderer as Component, bind(body, attrs)),
    })
  })
}

/** A panel with no per-panel content (the /story ending): the component chunk alone. */
export function lazyComponent(loader: Loader<Component>): LazyPanel {
  return wrap(loader)
}

/** The async wrapper's loader is what `prefetch` must run: it is deduplicated and marks the wrapper resolved. */
type AsyncWrapper = Component & { __asyncLoader?: () => Promise<unknown> }

function wrap(loader: () => Promise<Component | { default: Component }>): LazyPanel {
  const component: AsyncWrapper = defineAsyncComponent({
    loader: loader as () => Promise<Component>,
    onError(_error, retry, fail, attempts) {
      if (attempts <= 2) retry()
      else fail()
    },
  })
  return {
    component,
    prefetch: () => (component.__asyncLoader?.() ?? Promise.resolve()).catch(() => undefined),
  }
}
