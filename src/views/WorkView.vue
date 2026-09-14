<script setup lang="ts">
// WorkView.vue — CV mirrored (plot v4 §4), rebuilt as a deck per design v8 §3 (R76/R80): a compact
// header above the deck (R105 / r16 note: in the deck's own 640 column, not across the rail; R84: no
// CV button, the topbar has one), then one role per screen. Desktop: useDeck + the year-range rail (R77 spaced form, employer as
// caption). Mobile: the header is its own snap area above the five role panels; no rail, no progress
// bar. The BOM grid left for `/skills`: no bars, no since-years, no role counts anywhere on this page.
// R91: every role panel is a lazy chunk (panels/work.ts), the next one prefetched on arrival.
import { computed, onMounted, onUnmounted, ref, watch, type ComponentPublicInstance } from 'vue'
import { profile } from '../data/profile'
import { roles, type Role, type RoleId } from '../data/roles'
import { useDeck } from '../composables/useDeck'
import { useCurrentSection } from '../composables/useCurrentSection'
import { workPanel } from '../panels/work'
import NavRail, { type RailItem } from '../components/NavRail.vue'

const roleIds: readonly RoleId[] = roles.map((r) => r.id)

const deck = useDeck(roleIds, { routeName: 'work', param: 'section' })
const mobileActive = computed(() => !deck.isDesktop.value)
const ready = ref(false)
const io = useCurrentSection(roleIds, { routeName: 'work', param: 'section', active: mobileActive, ready })

const current = computed(() => (deck.isDesktop.value ? deck.current.value : io.current.value))
const currentRole = computed(() => roles.find((r) => r.id === current.value) ?? roles[0]!)

/** R77: one spaced grammar for the rail: `2025 – present` · `2023 – 2025`. */
function yearRange(role: Role): string {
  return `${role.from.slice(0, 4)} – ${role.to ? role.to.slice(0, 4) : 'present'}`
}

const railItems: RailItem[] = roles.map((role) => ({
  id: role.id,
  to: `/work/${role.id}`,
  label: yearRange(role),
  caption: role.employer,
  sr: `${role.title} · ${role.employer}`,
}))

function indexOf(id: string): number {
  return roleIds.indexOf(id as RoleId)
}

function nextId(id: string): RoleId | undefined {
  const i = indexOf(id)
  return i >= 0 && i + 1 < roleIds.length ? roleIds[i + 1] : undefined
}

function nextTo(id: string): string | undefined {
  const next = nextId(id)
  return next ? `/work/${next}` : undefined
}

// R91: see StoryView. The deck renders once the landing role's chunk is in (mobile: all five).
void Promise.all((deck.isDesktop.value ? [currentRole.value.id] : roleIds).map((id) => workPanel(id).prefetch())).then(() => {
  ready.value = true
})

watch(current, (id) => {
  const next = nextId(id)
  if (next) void workPanel(next).prefetch()
}, { immediate: true })

function prefetchRail(id: string) {
  if (indexOf(id) >= 0) void workPanel(id as RoleId).prefetch()
}

// `authorization · languages`: a presentation join like the card's stackLine split; no new copy.
const authLine = `${profile.workHeader.authorization} · ${profile.workHeader.languages}`

// see StoryView.setPanel: skip the async wrapper's placeholder and the outgoing sheet's null.
function setPanel(el: Element | ComponentPublicInstance | null) {
  const node = el && '$el' in el ? (el.$el as Node | null) : (el as Node | null)
  if (node instanceof HTMLElement) deck.panelEl.value = node
}

function guardClick(event: MouseEvent) {
  if (deck.isDesktop.value && deck.locked()) event.preventDefault()
}

onMounted(() => {
  document.documentElement.classList.add('deck-snap')
})
onUnmounted(() => {
  document.documentElement.classList.remove('deck-snap')
})
</script>

<template>
  <div class="work">
    <!-- R102: header + rail + deck are one block, centred in the stage below the top bar (desktop).
         R105: a two-column grid, the header in the deck's column, the rail beside the deck. -->
    <div class="work__stage">
      <header class="work__head">
        <p class="work__lead t-title">
          {{ profile.workHeader.lead }}
        </p>
        <p class="t-location">
          {{ profile.workHeader.location }}
        </p>
        <p
          id="languages"
          class="work__auth t-mono"
        >
          {{ authLine }}
        </p>
      </header>

      <NavRail
        class="work__rail"
        :items="railItems"
        :current="current"
        label="Roles"
        @click.capture="guardClick"
        @hover="prefetchRail"
      />

      <!-- desktop: the deck, one role on stage -->
      <div
        v-if="deck.isDesktop.value && ready"
        :ref="(el) => (deck.deckEl.value = el as HTMLElement | null)"
        class="deck work__deck"
        :style="{ '--dir': deck.dir.value }"
        @click.capture="guardClick"
      >
        <Transition
          :name="deck.reduced.value ? 'swap' : 'push'"
          @after-enter="deck.focusPanel"
        >
          <component
            :is="workPanel(currentRole.id).component"
            :key="currentRole.id"
            :ref="setPanel"
            :index="indexOf(currentRole.id) + 1"
            :total="roles.length"
            :next-to="nextTo(currentRole.id)"
          />
        </Transition>
      </div>

      <!-- mobile: header + five snap areas on the document scroller -->
      <div
        v-else-if="ready"
        class="work__main"
      >
        <component
          :is="workPanel(role.id).component"
          v-for="(role, i) in roles"
          :key="role.id"
          :index="i + 1"
          :total="roles.length"
          :next-to="nextTo(role.id)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.work {
  padding-bottom: var(--bottom-h);
}

// mobile: the header block is the first snap area (natural height) above the role panels.
.work__head {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 24px 16px 16px;
  border-bottom: 1px dashed var(--trace);
  scroll-snap-align: start;
}

// r16 note: the lead balances to two lines ("… Engineer." / "I build …") instead of a widow.
.work__lead {
  text-wrap: balance;
}

.work__auth {
  color: var(--ink-2);
}

.work__main {
  max-width: 720px;
  margin-inline: auto;
  width: 100%;
  display: flex;
  flex-direction: column;
}

@media (min-width: 769px) {
  // R102: the whole ledger (header + rail + deck) is one block, centred vertically and horizontally
  // in the stage below the top bar. R105 (r16 note): the block is a two-column grid, `auto` (the rail)
  // + `minmax(0, 640px)` (the header, row 1, and the deck, row 2), gap 64: the header sits in the
  // deck's own column over a dashed rule, the rail hangs from the deck row's top so its first tick is
  // the employer register (RolePanel: 22px top padding = the tick). No art column on /work. The deck is
  // a fixed-height sheet, `--stage-h` = the tallest role (gis, measured r18 with its 16 chips = 3 chip
  // rows: 649 regular / 542 compact, +1 rounding) so the block never jumps. Budget: 1400×900 =
  // 144 + 40 + 650 = 834 of 844. See StoryView.
  .work {
    --stage-h: 650px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-inline: 48px;
    padding-bottom: 0;
    height: calc(100svh - var(--top-h));
    overflow: hidden;
  }

  .work__stage {
    display: grid;
    // R120: the rail track is the same `minmax(300px, max-content)` as StoryView's, so the column is at
    // one x on both routes (the /work rail measures 299, /story's 238).
    grid-template-columns: minmax(300px, max-content) minmax(0, 640px);
    grid-template-rows: auto var(--stage-h);
    column-gap: 64px;
    min-width: 0;
    max-width: 100%;
    max-height: 100%;
  }

  .work__head {
    grid-column: 2;
    grid-row: 1;
    max-width: 640px;
    padding: 0 0 24px;
    margin-bottom: 40px;
  }

  .work__rail {
    grid-column: 1;
    grid-row: 2;
    margin-top: 0;
  }

  // the panels inside are absolute, so the deck's own content is 0 wide: the track (640) sizes it.
  .work__deck {
    grid-column: 2;
    grid-row: 2;
    min-width: 0;
    height: 100%;
  }
}

// compact stage (1280×720, 664 tall): header 132 + 16 + the compact kaufland sheet 514 = 662.
// The r16 note's recoveries (bullets 15/1.45 gap 6, header padding 12 / 16 to the deck, foot 36) left
// kaufland and gis 5px over (measured); the chips' 20 → 12 and the sheet's bottom 24 → 12 close it.
// r18: gis's third chip row (R114 override: +Microservices, +Security, +xUnit) measures 542 here, 28
// over the 514 that fits the 664 budget; the sheet stays 514 (kaufland's) and gis takes the §1h
// fallback (inner scroll, 28px) at this one size, pending a ruling on the compact chip scale.
@media (min-width: 769px) and (max-height: 799px) {
  .work {
    --stage-h: 514px;
  }

  .work__head {
    padding-bottom: 12px;
    margin-bottom: 16px;
  }
}
</style>
