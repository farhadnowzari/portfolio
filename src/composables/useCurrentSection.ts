// useCurrentSection.ts — scroll-sync (tech-spec §4): one IntersectionObserver over a route's
// section elements. On change: router.replace (not push, `fromScroll` state so scrollBehavior
// doesn't fight it), expose `current` (drives the mobile PART header / progress bar). Generalised
// from the /story-only `useCurrentPart` (design v7 §3) so /work runs the exact same IO with
// `{ routeName: 'work', param: 'section' }`.
//
// Design v8 §1 / R123: MOBILE ONLY (the plain document scroll). On desktop the deck (useDeck) owns `current` and the page never scrolls,
// so the IO is connected only while `active` is true (the view passes its `!isDesktop`), and
// reconnects when the breakpoint flips and the mobile DOM mounts.
import { nextTick, onMounted, onUnmounted, ref, watch, type Ref } from 'vue'
import { useRouter } from 'vue-router'

export interface CurrentSectionOptions {
  routeName: string
  param: string
  /** Connect the observer only while true (default: always). */
  active?: Ref<boolean>
  /** R91: the sections are lazy chunks; (re)connect when this flips true and they are in the DOM. */
  ready?: Ref<boolean>
}

export function useCurrentSection(ids: readonly string[], options: CurrentSectionOptions) {
  const router = useRouter()
  const current = ref(ids[0] ?? '')
  let observer: IntersectionObserver | undefined

  function disconnect() {
    observer?.disconnect()
    observer = undefined
  }

  function connect() {
    disconnect()
    if (typeof IntersectionObserver === 'undefined') return
    if (options.active && !options.active.value) return
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const id = entry.target.id
          if (!id || id === current.value) continue
          current.value = id
          // `state.fromScroll` travels WITH the replace (as useDeck.normalise does), so it is in
          // `history.state` before scrollBehavior runs; the post-hoc replaceState raced it by one
          // microtask, and on R123's plain scroll a lost race is a visible jump after the finger lifts.
          router.replace({ name: options.routeName, params: { [options.param]: id }, state: { fromScroll: true } })
        }
      },
      // R124: a ~1px band at 40% of the viewport. The panels are contiguous (no margins), so exactly
      // one intersects it at any scroll position: no head offset, no order dependence, no two panels
      // reporting at once.
      { rootMargin: '-40% 0px -59.9% 0px' },
    )
    for (const id of ids) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }
  }

  onMounted(connect)
  if (options.active) {
    watch(options.active, () => nextTick(connect))
  }
  if (options.ready) {
    watch(options.ready, () => nextTick(connect))
  }
  onUnmounted(disconnect)

  return { current }
}
