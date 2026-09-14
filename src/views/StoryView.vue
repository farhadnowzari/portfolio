<script setup lang="ts">
// StoryView.vue — the eight parts + ending as a deck (design v8, R76/R80: one chapter per screen).
// Desktop (≥769): useDeck owns `current`; wheel / keys / swipe → router.replace, rail / Next →
// router.push; the route drives the one mounted panel inside <Transition name="push">. Mobile
// (<769, R123): a plain document scroll, `useCurrentSection`'s IO drives the PART header + ProgressBar
// and replaces the route. The URL is always a panel: `/story/radio` … `/story/together`, `/story/ending`.
// R91: every panel is a lazy chunk (panels/story.ts); the next one is prefetched on arrival, a rail
// item's on hover, so the push never waits on the network.
import { computed, onMounted, onUnmounted, ref, watch, type ComponentPublicInstance } from 'vue'
import { parts } from '../data/story'
import { useDeck } from '../composables/useDeck'
import { useCurrentSection } from '../composables/useCurrentSection'
import { ENDING, storyPanel, type StoryPanelId } from '../panels/story'
import NavRail, { type RailItem } from '../components/NavRail.vue'
import ProgressBar from '../components/ProgressBar.vue'
import Icon from '../components/icons/Icon.vue'

const deckIds: readonly StoryPanelId[] = [...parts.map((p) => p.id), ENDING]

const deck = useDeck(deckIds, { routeName: 'story', param: 'part' })
const mobileActive = computed(() => !deck.isDesktop.value)
const ready = ref(false)
const io = useCurrentSection(deckIds, { routeName: 'story', param: 'part', active: mobileActive, ready })

const current = computed(() => (deck.isDesktop.value ? deck.current.value : io.current.value))
const currentPart = computed(() => parts.find((p) => p.id === current.value))
const currentIndex = computed(() =>
  current.value === ENDING ? parts.length : (currentPart.value?.index ?? 1),
)

// R81/R87: Ch 7 keeps its row in the same register: `·` in the number slot (drafting's "no value"),
// the chapter title as the caption. Uniform 54px pitch, tick like the others.
const railItems: RailItem[] = parts.map((part) => ({
  id: part.id,
  to: `/story/${part.id}`,
  label: part.callout?.display ?? '·',
  caption: part.callout?.caption ?? part.title,
  sr: `${part.title}${part.callout ? `${part.title.endsWith('.') ? '' : ','} ${part.callout.aria}` : ''}`,
}))

function nextId(id: string): StoryPanelId | undefined {
  const i = deckIds.indexOf(id as StoryPanelId)
  return i >= 0 && i + 1 < deckIds.length ? deckIds[i + 1] : undefined
}

function nextTo(id: string): string | undefined {
  const next = nextId(id)
  return next ? `/story/${next}` : undefined
}

// R91: the deck renders once the landing panel's chunk is in (desktop: one panel; mobile: all nine
// are on the page, so all nine), so the first render is synchronous: a deep link lands with no push,
// the mobile scroll finds its panel. Then the NEXT panel's chunk is fetched the moment a panel
// arrives, so a step never waits on the network; a hovered rail item warms its chapter for the jump.
void Promise.all((deck.isDesktop.value ? [current.value as StoryPanelId] : deckIds).map((id) => storyPanel(id).prefetch())).then(() => {
  ready.value = true
})

watch(current, (id) => {
  const next = nextId(id)
  if (next) void storyPanel(next).prefetch()
}, { immediate: true })

function prefetchRail(id: string) {
  if (deckIds.includes(id as StoryPanelId)) void storyPanel(id as StoryPanelId).prefetch()
}

// the ending takes no props; anything passed would land on its <section> as attributes.
function panelProps(id: string): Record<string, unknown> {
  return id === ENDING ? {} : { total: parts.length, nextTo: nextTo(id) }
}

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

// Template ref on a component gives the instance; the deck wants the panel's root element. The async
// wrapper reports first with a placeholder comment (skipped), the seated panel with its <section>;
// the outgoing sheet's unmount reports null after the incoming one seated, so null is ignored.
function setPanel(el: Element | ComponentPublicInstance | null) {
  const node = el && '$el' in el ? (el.$el as Node | null) : (el as Node | null)
  if (node instanceof HTMLElement) deck.panelEl.value = node
}

// Rail click / Next while a push is running: swallowed (same lock as the gestures, §1d).
function guardClick(event: MouseEvent) {
  if (deck.isDesktop.value && deck.locked()) event.preventDefault()
}

onMounted(() => {
  document.documentElement.classList.add('deck-snap', 'deck-snap--story')
})
onUnmounted(() => {
  document.documentElement.classList.remove('deck-snap', 'deck-snap--story')
})
</script>

<template>
  <div class="story">
    <div
      class="story__header"
      :style="{ '--part': currentIndex }"
    >
      <RouterLink
        to="/"
        class="story__back"
        aria-label="Back to home"
      >
        <Icon name="chevron-left" />
      </RouterLink>
      <span class="t-mono-sm">PART {{ pad(currentIndex) }} / {{ pad(parts.length) }}</span>
      <ProgressBar
        :index="currentIndex"
        :total="parts.length"
      />
    </div>

    <!-- R102: rail + deck are one block, centred in the stage below the top bar (desktop). -->
    <div class="story__stage">
      <NavRail
        class="story__rail"
        :items="railItems"
        :current="current"
        label="Chapters"
        @click.capture="guardClick"
        @hover="prefetchRail"
      />

      <!-- desktop: the deck, one panel on stage -->
      <div
        v-if="deck.isDesktop.value && ready"
        :ref="(el) => (deck.deckEl.value = el as HTMLElement | null)"
        class="deck story__deck"
        :style="{ '--dir': deck.dir.value }"
        @click.capture="guardClick"
      >
        <Transition
          :name="deck.reduced.value ? 'swap' : 'push'"
          @after-enter="deck.focusPanel"
        >
          <component
            :is="storyPanel(current as StoryPanelId).component"
            :key="current"
            :ref="setPanel"
            v-bind="panelProps(current)"
          />
        </Transition>
      </div>

      <!-- mobile: nine panels on the document scroller (R123: plain scroll, no snap) -->
      <div
        v-else-if="ready"
        class="story__parts"
      >
        <component
          :is="storyPanel(id).component"
          v-for="id in deckIds"
          :key="id"
          v-bind="panelProps(id)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.story {
  display: flex;
  flex-direction: column;
  padding-bottom: var(--bottom-h);
}

.story__header {
  position: sticky;
  top: var(--top-h);
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 12px;
  height: 40px;
  padding-inline: 16px;
  background: var(--board);
  border-bottom: 1px solid var(--trace);
}

.story__back {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  min-height: 44px;
  margin-inline-start: -12px;
}

.story__progress {
  flex: 1;
  height: 2px;
  background: var(--trace);
}

.story__progress-bar {
  height: 100%;
  background: var(--copper);
  transition: width 240ms;
}

.story__parts {
  display: flex;
  flex-direction: column;
  max-width: 640px;
  margin-inline: auto;
  width: 100%;
}

@media (min-width: 769px) {
  .story__header { display: none; }

  // R102: the composition (rail + deck, the foot row included) is ONE block, centred vertically and
  // horizontally in the stage below the top bar, at every desktop size. v10 (R113/R120): WorkView's
  // grid minus its header row. The rail track is `minmax(300px, max-content)` on BOTH views, so the
  // 640 column sits at the same x on /story and /work (1860 → 792, 1400 → 562, 1280 → 502): flipping
  // Story ↔ Work in the top bar, the text edge does not move. /work's rail measures 299, /story's 238
  // sits left in the 300 track. The deck is a fixed-height sheet: `--stage-h` = the tallest chapter
  // (ch5, measured r18: 743 regular / 618 compact, +1 for sub-pixel rounding) so the block never jumps
  // between chapters; shorter chapters hang from its top register. Budget: 744 of 844 at 1400×900,
  // 619 of 664 at 1280×720. The page never scrolls.
  .story {
    --stage-h: 744px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-inline: 48px;
    padding-bottom: 0;
    height: calc(100svh - var(--top-h));
    overflow: hidden;
  }

  .story__stage {
    display: grid;
    grid-template-columns: minmax(300px, max-content) minmax(0, 640px);
    grid-template-rows: var(--stage-h);
    column-gap: 64px;
    min-width: 0;
    max-width: 100%;
    max-height: 100%;
  }

  // the rail hangs from the deck row's top: its first tick (22) is the panel's register (StoryPanel
  // padding-top 22), as on /work.
  .story__rail {
    grid-column: 1;
    grid-row: 1;
    margin-top: 0;
  }

  // the panels inside are absolute, so the deck's own content is 0 wide: the track (640) sizes it.
  .story__deck {
    grid-column: 2;
    grid-row: 1;
    min-width: 0;
    height: 100%;
  }
}

// §1h compact stage (1280×720, 664 tall): ch5 measured at the compact scale (StoryPanel), 618 + 1.
@media (min-width: 769px) and (max-height: 799px) {
  .story {
    --stage-h: 619px;
  }
}
</style>
