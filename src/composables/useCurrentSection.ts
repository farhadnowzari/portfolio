// useCurrentSection.ts — scroll-sync (tech-spec §4): one IntersectionObserver over a route's
// section elements. On change: router.replace (not push, `fromScroll` state so scrollBehavior
// doesn't fight it), expose `current` (drives the mobile PART header / progress bar). Generalised
// from the /story-only `useCurrentPart` (design v7 §3) so /work runs the exact same IO with
// `{ routeName: 'work', param: 'section' }`.
//
// Design v8 §1: MOBILE ONLY. On desktop the deck (useDeck) owns `current` and the page never scrolls,
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
          router.replace({ name: options.routeName, params: { [options.param]: id } }).then(() => {
            history.replaceState({ ...history.state, fromScroll: true }, '')
          })
        }
      },
      { rootMargin: '-48px 0px -55% 0px' },
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
