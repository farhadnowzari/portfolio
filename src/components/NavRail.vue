<script setup lang="ts">
// NavRail.vue — the desktop rail (design v4 §3, §6 #1/#2; v7 §3 generalised it; v8 §1e/§5 made it the
// deck's index). One component for both `/story` (chapter callouts + captions, R75) and `/work` (year
// ranges + employer, R69/R77): same spine, tick, active-copper language, fed `{ id, to, label,
// caption?, sr }[]` and `current`.
//
// v8 §1e: active = the route param (the deck owns `current`, no scroll-spy on desktop), and the
// 2px spine fills copper from the top down to the active tick (`--fill`, a registered custom
// property so it animates with the push). `current` not in `items` (the /story ending panel) =
// "past the last chapter": the spine fills to 100%, no item is current.
//
// Desktop-only (Greta + Noor): hidden by default, `display: flex` only at ≥769px, styled in this
// component's OWN scoped block — Vue only stamps a scope attribute on a component's own template
// elements, so a parent's scoped rules never reach this DOM (Noor #6, round 9).
import { nextTick, onMounted, ref, watch } from 'vue'

export interface RailItem {
  id: string
  to: string
  /** The number/range shown on the tick. R81/R87: Ch 7 passes `·` (no value), never an empty slot. */
  label: string
  /** R75: caption inline beside the number, mono ink-2. */
  caption?: string
  /** Screen-reader text for the whole item. */
  sr: string
}

const props = defineProps<{ items: RailItem[]; current: string; label: string }>()
// R91: the views prefetch a hovered item's panel chunk so a rail jump pushes without a network wait.
const emit = defineEmits<{ hover: [id: string] }>()

const railEl = ref<HTMLElement | null>(null)
const fill = ref('0px')
// R98 (v9 §5.5): the spine starts at the first tick's y, not the rail's top edge, so the ch1 fill has
// length 0 (no copper hook above the first tick) and grows from ch2. Measured, like the fill.
const spineTop = ref('22px')
// First paint: the fill is set instantly (a deep link lands without animation, §1a); the 480ms
// transition only applies to later changes.
const instant = ref(true)

function measure() {
  const rail = railEl.value
  if (!rail) return
  const first = rail.querySelector<HTMLElement>('.rail__item')
  const top = first ? first.offsetTop + first.offsetHeight / 2 : 0
  spineTop.value = `${top}px`
  const active = rail.querySelector<HTMLElement>('[aria-current="true"]')
  if (active) {
    fill.value = `${active.offsetTop + active.offsetHeight / 2 - top}px`
  } else if (props.current && !props.items.some((i) => i.id === props.current)) {
    fill.value = '100%'
  } else {
    fill.value = '0px'
  }
}

onMounted(() => {
  measure()
  requestAnimationFrame(() => requestAnimationFrame(() => (instant.value = false)))
})
watch(() => props.current, () => nextTick(measure))
</script>

<template>
  <nav
    ref="railEl"
    class="rail"
    :class="{ 'rail--instant': instant }"
    :aria-label="label"
    :style="{ '--fill': fill, '--spine-top': spineTop }"
  >
    <RouterLink
      v-for="item in items"
      :key="item.id"
      class="rail__item"
      :to="item.to"
      :aria-current="current === item.id ? 'true' : undefined"
      @mouseenter="emit('hover', item.id)"
      @focus="emit('hover', item.id)"
    >
      <!-- inner inline-flex so number + caption share a BASELINE while the outer item still
           centres the pair on the 44px row (and on the tick at top: 50%). -->
      <span
        class="rail__text"
        aria-hidden="true"
      >
        <span class="rail__num t-mono">{{ item.label }}</span>
        <span
          v-if="item.caption"
          class="rail__caption t-mono-sm"
        >{{ item.caption }}</span>
      </span>
      <!-- R102: the active number is 16px, so an item is wider while it is current. This zero-height
           ghost is the row at its active size: every item's BOX is its active width, the rail (and the
           centred block it belongs to) stays the same width whichever chapter is on stage, and the
           visible text is untouched. -->
      <span
        class="rail__text rail__ghost"
        aria-hidden="true"
      >
        <span class="rail__ghost-num t-mono">{{ item.label }}</span>
        <span
          v-if="item.caption"
          class="t-mono-sm"
        >{{ item.caption }}</span>
      </span>
      <span class="sr-only">{{ item.sr }}</span>
    </RouterLink>
  </nav>
</template>

<style scoped lang="scss">
// design v4: "Axis ┃ ... on the desktop story rail. Never a character" + "sticky left rail of 8
// callouts" (§3) — mono callout numbers on a leader-tick axis, not pill circles (host feedback,
// round 9). R65/§3: spine is `--trace` so copper stays the one scarce "you are here" signal; the
// active item gets real size + a square dot — the same numeral language as ExplodedRadio's caps.
// v8 §1e: the spine is a 2px gradient, copper 0 → --fill, trace after; --fill is registered so the
// fill animates with the push (browsers without @property get the same fill, instant).
@property --fill {
  syntax: '<length-percentage>';
  inherits: false;
  initial-value: 0px;
}

.rail {
  display: none;
}

@media (min-width: 769px) {
  .rail {
    // positioned: `--fill` is measured from the active item's offsetTop, which must be rail-relative
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-self: flex-start;
    flex-shrink: 0;
    padding-inline-start: 2px;
    background: linear-gradient(var(--copper) 0 var(--fill), var(--trace) var(--fill) 100%) 0 var(--spine-top, 0px) / 2px calc(100% - var(--spine-top, 0px)) no-repeat;
    transition: --fill 480ms cubic-bezier(0.22, 1, 0.36, 1);
  }

  .rail--instant {
    transition: none;
  }
}

.rail__item {
  position: relative;
  color: var(--ink-2);
  min-height: 44px;
  min-width: 44px;
  // one cell: the text and its ghost stack, the box is as wide as the wider (the ghost)
  display: grid;
  grid-template-columns: 1fr;
  align-items: center;
  justify-items: start;
  padding-inline-start: 16px;
  white-space: nowrap;
  transition: color 160ms;
}

.rail__text {
  grid-area: 1 / 1;
  display: inline-flex;
  align-items: baseline;
  gap: 8px;
}

.rail__ghost {
  align-self: start;
  height: 0;
  overflow: hidden;
  visibility: hidden;
}

.rail__ghost-num {
  font-weight: 700;
  font-size: 16px;
}

// the leader tick: a short line from the axis to the number
.rail__item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  width: 10px;
  height: 1px;
  background: var(--trace);
  transition: background-color 160ms, width 160ms, height 160ms;
}

.rail__num {
  font-weight: 700;
  transition: font-size 160ms;
}

// R75: `number  caption` inline, caption ink-2 at 12px, never a tooltip. Stays ink-2 on hover and
// on the active item — the caption is a note on the number, not a second "here" signal.
.rail__caption {
  color: var(--ink-2);
}

// hover ≠ "here" — hover gets the pressed/hover token (--solder), current-chapter copper stays
// scarce and reserved for the one real "you are here" signal.
.rail__item:hover {
  color: var(--solder);
}

.rail__item:hover::before {
  background: var(--solder);
}

.rail__item[aria-current='true'] {
  color: var(--copper);
}

.rail__item[aria-current='true'] .rail__num {
  font-size: 16px;
}

.rail__item[aria-current='true']::before {
  width: 20px;
  height: 2px;
  background: var(--copper);
}

// square dot, not a circle — the icon/ExplodedRadio "square caps" tell, same language everywhere.
.rail__item[aria-current='true']::after {
  content: '';
  position: absolute;
  left: -4px;
  top: 50%;
  translate: 0 -50%;
  width: 6px;
  height: 6px;
  background: var(--copper);
  border-radius: 1px;
}
</style>
