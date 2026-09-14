// useDeck.ts: the one-panel-at-a-time deck for `/story` and `/work` on desktop (design v8 §1, R76/R80).
//
// Contract (§1a/§1d): the ROUTE drives the panel. Wheel / keys / swipe are gestures → `router.replace`;
// rail click / Next are navigation → `router.push` (the view's RouterLinks). Popstate is just another
// route change. This composable owns: which panel is `current`, the push `dir` (+1 forward / −1 back),
// the 560ms gesture lock (200ms in reduced motion), and the three gesture layers on the stage.
//
// Wheel (§1d): one step per *gesture*, never per event. A gesture begins after a ≥120ms quiet gap;
// deltas accumulate to a 40-unit threshold; after a step the rest of that gesture is swallowed even
// once the lock has expired, which is the line that kills trackpad inertia tails. A wheel event the
// inner panel can consume natively (§1h, a panel taller than the stage) is left alone, and marks the
// gesture consumed, so scrolling to a panel's end never steps in the same motion.
//
// Mobile (<769) does none of this: native document scroll-snap (§1f), `useCurrentSection`'s IO.
import { computed, onMounted, onUnmounted, ref, watch, type Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export interface DeckOptions {
  routeName: string
  param: string
}

export const PUSH_MS = 480
export const LOCK_MS = PUSH_MS + 80
export const LOCK_REDUCED_MS = 200

const QUIET_GAP_MS = 120
const WHEEL_THRESHOLD = 40
const SWIPE_PX = 48
/** R85: velocity gate for the iPad swipe, px/ms (48px in ≤160ms). Slow drags do not step. */
const SWIPE_VELOCITY = 0.3

type FormControl = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | HTMLButtonElement

function isFormControl(target: EventTarget | null): boolean {
  const el = target as FormControl | null
  if (!el || !('tagName' in el)) return false
  const tag = el.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || tag === 'BUTTON' || (el as HTMLElement).isContentEditable
}

/** Can `el` still scroll by its own overflow in `dir` (1 = down, −1 = up)? */
function canScroll(el: HTMLElement, dir: number): boolean {
  if (dir > 0) return el.scrollTop + el.clientHeight < el.scrollHeight - 1
  return el.scrollTop > 0
}

export function useDeck(ids: readonly string[], options: DeckOptions) {
  const router = useRouter()
  const route = useRoute()

  const desktopMq = typeof matchMedia === 'function' ? matchMedia('(min-width: 769px)') : undefined
  const reducedMq = typeof matchMedia === 'function' ? matchMedia('(prefers-reduced-motion: reduce)') : undefined
  const isDesktop = ref(desktopMq?.matches ?? true)
  const reduced = ref(reducedMq?.matches ?? false)

  const deckEl: Ref<HTMLElement | null> = ref(null)
  const panelEl: Ref<HTMLElement | null> = ref(null)

  function indexOf(id: string | undefined): number {
    return id ? ids.indexOf(id) : -1
  }

  const paramId = computed(() => {
    const raw = route.params[options.param]
    return Array.isArray(raw) ? raw[0] : raw
  })

  const current = ref<string>(indexOf(paramId.value) >= 0 ? (paramId.value as string) : ids[0] ?? '')
  const currentIndex = computed(() => Math.max(0, indexOf(current.value)))
  const dir = ref(1)

  let lockUntil = 0
  const lockMs = () => (reduced.value ? LOCK_REDUCED_MS : LOCK_MS)
  const locked = () => performance.now() < lockUntil
  function arm() {
    lockUntil = performance.now() + lockMs()
  }

  // The bare URL is never a state (§1a): no/unknown param → replace with the first panel. `fromScroll`
  // tells scrollBehavior not to scroll: on mobile the page stays at the top (the /work header block
  // sits above panel 1), and the IO takes over from there.
  function normalise() {
    if (route.name !== options.routeName) return
    if (indexOf(paramId.value) < 0) {
      router.replace({ name: options.routeName, params: { [options.param]: ids[0] }, state: { fromScroll: true } })
    }
  }

  // Route → panel. Direction from the index delta (covers rail jumps and popstate alike); the lock is
  // armed by every change, gesture or not, so a double-click on the rail runs one push.
  watch(paramId, (id) => {
    if (route.name !== options.routeName) return
    const next = indexOf(id)
    if (next < 0) {
      normalise()
      return
    }
    if (ids[next] === current.value) return
    dir.value = next > currentIndex.value ? 1 : -1
    current.value = ids[next]!
    arm()
  })

  function go(index: number, mode: 'replace' | 'push' = 'replace') {
    const clamped = Math.min(ids.length - 1, Math.max(0, index))
    if (clamped === currentIndex.value) return false
    arm()
    router[mode]({ name: options.routeName, params: { [options.param]: ids[clamped] } })
    return true
  }

  /** One gesture step. Returns true when a navigation was issued. */
  function step(delta: number): boolean {
    if (!isDesktop.value || locked()) return false
    return go(currentIndex.value + delta)
  }

  // Wheel: quiet-gap gesture detection + threshold + lock (§1d).
  let lastWheelAt = -Infinity
  let wheelAcc = 0
  let gestureConsumed = false

  function onWheel(event: WheelEvent) {
    if (!isDesktop.value || event.deltaY === 0) return
    const sign = event.deltaY > 0 ? 1 : -1
    const now = performance.now()
    const fresh = now - lastWheelAt >= QUIET_GAP_MS
    lastWheelAt = now
    if (fresh) {
      wheelAcc = 0
      gestureConsumed = false
    }
    const panel = panelEl.value
    if (panel && canScroll(panel, sign)) {
      // native inner scroll (§1h); the rest of this gesture must not step
      gestureConsumed = true
      return
    }
    event.preventDefault()
    if (gestureConsumed) return
    if (locked()) {
      // a gesture that begins under the lock is dropped whole, not queued for when the lock ends
      gestureConsumed = true
      return
    }
    const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1
    wheelAcc += event.deltaY * unit
    if (Math.abs(wheelAcc) >= WHEEL_THRESHOLD) {
      const s = wheelAcc > 0 ? 1 : -1
      wheelAcc = 0
      gestureConsumed = true
      step(s)
    }
  }

  // Keys (§1d): window-level while the route is active; form controls excepted.
  function onKeydown(event: KeyboardEvent) {
    if (!isDesktop.value || route.name !== options.routeName) return
    if (event.metaKey || event.ctrlKey || event.altKey) return
    if (isFormControl(event.target)) return
    const panel = panelEl.value
    let delta = 0
    let jump: number | undefined
    switch (event.key) {
      case 'ArrowDown':
      case 'PageDown':
      case 'j':
        delta = 1
        break
      case ' ':
        delta = event.shiftKey ? -1 : 1
        break
      case 'ArrowUp':
      case 'PageUp':
      case 'k':
        delta = -1
        break
      case 'Home':
        jump = 0
        break
      case 'End':
        jump = ids.length - 1
        break
      default:
        return
    }
    // a taller-than-stage panel scrolls itself first (§1h), same as the wheel
    if (delta !== 0 && panel && canScroll(panel, delta)) return
    event.preventDefault()
    if (locked()) return
    if (jump !== undefined) go(jump)
    else step(delta)
  }

  // Touch on a ≥769 device (R85): 48px, velocity-gated, same lock. Decided from the panel's
  // scrollability at touchSTART, so a drag that scrolls the inner panel never also steps.
  let touchY = 0
  let touchAt = 0
  let touchScrollable = false

  function onTouchStart(event: TouchEvent) {
    if (!isDesktop.value || event.touches.length !== 1) return
    const t = event.touches[0]!
    touchY = t.clientY
    touchAt = performance.now()
    const panel = panelEl.value
    touchScrollable = !!panel && (canScroll(panel, 1) || canScroll(panel, -1))
  }

  function onTouchEnd(event: TouchEvent) {
    if (!isDesktop.value || touchScrollable || event.changedTouches.length !== 1) return
    const t = event.changedTouches[0]!
    const dy = touchY - t.clientY // finger up (content forward) = positive
    const dt = Math.max(1, performance.now() - touchAt)
    if (Math.abs(dy) < SWIPE_PX || Math.abs(dy) / dt < SWIPE_VELOCITY) return
    step(dy > 0 ? 1 : -1)
  }

  // Focus the seated panel after the push (§1d), or at once in reduced motion.
  function focusPanel() {
    panelEl.value?.focus({ preventScroll: true })
  }

  const onDesktopChange = (e: MediaQueryListEvent) => {
    isDesktop.value = e.matches
  }
  const onReducedChange = (e: MediaQueryListEvent) => {
    reduced.value = e.matches
  }

  let boundDeck: HTMLElement | null = null
  function bind(el: HTMLElement | null) {
    if (boundDeck === el) return
    if (boundDeck) {
      boundDeck.removeEventListener('wheel', onWheel)
      boundDeck.removeEventListener('touchstart', onTouchStart)
      boundDeck.removeEventListener('touchend', onTouchEnd)
    }
    boundDeck = el
    if (el) {
      el.addEventListener('wheel', onWheel, { passive: false })
      el.addEventListener('touchstart', onTouchStart, { passive: true })
      el.addEventListener('touchend', onTouchEnd, { passive: true })
    }
  }

  watch(deckEl, (el) => bind(el))

  onMounted(() => {
    normalise()
    desktopMq?.addEventListener('change', onDesktopChange)
    reducedMq?.addEventListener('change', onReducedChange)
    window.addEventListener('keydown', onKeydown)
    bind(deckEl.value)
  })

  onUnmounted(() => {
    desktopMq?.removeEventListener('change', onDesktopChange)
    reducedMq?.removeEventListener('change', onReducedChange)
    window.removeEventListener('keydown', onKeydown)
    bind(null)
  })

  return {
    /** Panel id the route says is on stage. */
    current,
    currentIndex,
    /** +1 when the incoming panel enters from the bottom, −1 from the top. Set BEFORE `current` changes. */
    dir,
    isDesktop,
    reduced,
    deckEl,
    panelEl,
    /** `true` while a push is running (+80ms). Views use it to swallow rail / Next clicks. */
    locked,
    step,
    go,
    focusPanel,
  }
}
