<script setup lang="ts">
// StoryPanel.vue — one chapter of `/story` on the `/work` skeleton (design v10, R113/R117). Used by both
// deck modes: on desktop the one mounted panel inside the deck's <Transition>, on mobile one of nine
// stacked snap areas. R91: the renderer; `part` is the index row (story.ts), `content` the chapter's
// own chunk (data/story/<id>.ts), bound by panels/story.ts.
//
// v10: RolePanel's grid. Row 1 = the 640 column; row 2 = the foot row (`↓ Next chapter` left, `01 / 08`
// right on the column's edge, one 44px row, R97). Inside the column the numeral row is the first
// ledger row: numeral + caption left, the part drawn at 128px right on the column's edge (where /work
// prints the location); the title on its own full-width row under it, so every chapter's title starts
// at the same y. No art column, no spine, no tick (R105's skeleton on both routes).
// The numeral's size is `min(--num-max, W / len / 0.6)` (Plex Mono is 0.6em per glyph), W = the row
// minus the art and the gap, so the word `millions` fills the row instead of reading as a subtitle.
// Top register: numeral cap (line-height 0.72) = art box top = the rail's first tick = 22.
import { computed } from 'vue'
import { nextLabels, type Part, type PartContent } from '../data/story'
import StackChips from './StackChips.vue'
import LinkRow from './LinkRow.vue'
import Glyph from './Glyph.vue'
import PartArt from './PartArt.vue'

const props = defineProps<{
  part: Part
  content: PartContent
  total: number
  /** Route of the next panel; absent on the last panel of the deck. */
  nextTo?: string
}>()

const nextLabel = computed(() => props.part.nextLabel ?? nextLabels.chapter)
const len = computed(() => props.part.callout?.display.length ?? 1)

function pad(n: number): string {
  return String(n).padStart(2, '0')
}
</script>

<template>
  <section
    :id="part.id"
    class="panel part"
    tabindex="-1"
    :aria-label="`Part ${part.index} of ${total}`"
  >
    <div class="panel__col">
      <div class="part__head">
        <!-- Ch 7: the cell stays, blank. The row's min-height (the art's box) holds the register. -->
        <div
          class="part__num"
          :class="{ 'part__num--empty': !part.callout }"
        >
          <template v-if="part.callout">
            <p
              class="part__callout t-mono"
              :style="{ '--len': len }"
            >
              {{ part.callout.display }}
              <span class="sr-only">{{ part.callout.aria }}</span>
            </p>
            <p
              v-if="part.callout.caption"
              class="part__caption t-mono"
              aria-hidden="true"
            >
              {{ part.callout.caption }}
            </p>
          </template>
        </div>
        <PartArt
          class="part__art"
          :name="part.id"
        />
      </div>
      <h2 class="t-name part__title">
        {{ part.title }}
      </h2>
      <p
        v-if="part.meta"
        class="part__meta t-mono"
      >
        {{ part.meta }}
      </p>
      <p class="part__body t-promise">
        {{ content.body }}
      </p>
      <p
        v-if="content.sidebar"
        class="part__sidebar t-location"
      >
        {{ content.sidebar }}
      </p>
      <StackChips :stack="content.stack" />
      <p
        v-if="content.leadIn"
        class="part__leadin t-mono-sm"
      >
        {{ content.leadIn }}
      </p>
      <ul
        v-if="content.links.length"
        class="part__links"
      >
        <li
          v-for="(row, i) in content.links"
          :key="i"
        >
          <LinkRow :row="row" />
        </li>
      </ul>
    </div>

    <div class="panel__foot">
      <RouterLink
        v-if="nextTo"
        class="panel__next"
        :to="nextTo"
      >
        <Glyph
          char="↓"
          side="lead"
          copper
        />{{ nextLabel }}
      </RouterLink>
      <!-- R120/R121: the counter is a reading, not a link (ink-2); hidden on mobile, where the sticky
           PART header already counts. -->
      <p class="part__index t-mono-sm">
        {{ pad(part.index) }} / {{ pad(total) }}
      </p>
    </div>
  </section>
</template>

<style scoped lang="scss">
// mobile (§4): numeral row [numeral + caption | art 80] → title 32 → meta → body → … → Next (pinned)
.panel__col {
  display: flex;
  flex-direction: column;
  gap: 10px;
  container-type: inline-size;
}

.part__head {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 80px;
  column-gap: 16px;
  align-items: start;
  min-height: 80px;
}

.part__num {
  grid-column: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: flex-start;
  margin-bottom: 4px;
}

// §4: the numeral's budget is the row minus the art (80) and the gap (16): `millions` no longer
// needs the whole column (56px at 400, 48 at 360); every other numeral stays at 72.
.part__callout {
  font-size: min(var(--num-max, 72px), calc((100cqw - 96px) / var(--len, 1) / 0.6));
  font-weight: 700;
  color: var(--copper);
  line-height: 1;
}

// §5b (R74): the note under the numeral — the diagram's dimension-line grammar.
.part__caption {
  font-size: 12px;
  color: var(--ink-2);
  line-height: 1;
}

.part__art {
  grid-column: 2;
  width: 80px;
  height: 80px;
  justify-self: end;
}

.part__meta {
  color: var(--ink-2);
}

.part__links {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

// the foot row (RolePanel's): Next left, the counter right on the column's edge
.panel__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-height: 44px;
}

.part__index {
  display: none;
  align-items: center;
  min-height: 44px;
  color: var(--ink-2);
  white-space: nowrap;
}

// §5.4: "Forty services. One me." breaks as "Forty services. / One me." at every size, never a widow.
.part__title {
  text-wrap: balance;
}

@media (min-width: 769px) {
  // v10 §1b: RolePanel's grid. The deck is sized to its content (StoryView's column), so the grid is
  // the one 640 column, no gutter; it only gives on desktops narrower than the rail + column.
  .part {
    --col: 640px;
    display: grid;
    grid-template-columns: minmax(0, var(--col));
    // two rows, no `1fr` void row: an empty third row still costs a row-gap (R102). The sheet is as
    // tall as its content; the stage is the panel.
    grid-template-rows: auto auto;
    // the sheet hangs from the top register; `auto` rows must not stretch into the stage's slack
    align-content: start;
    row-gap: 40px;
    // 22 = the rail's first tick (NavRail: 44px row, tick at 50%), the rail flush with the deck row.
    padding: 22px 0 24px;
  }

  .panel__col {
    grid-row: 1;
    grid-column: 1;
  }

  // R97: the foot row directly under the content, never pinned to the stage floor.
  .panel__foot {
    grid-row: 2;
    grid-column: 1;
    align-self: center;
  }

  .part__index {
    display: flex;
  }

  // §2b: the head row is always 128 (the art's box), ch7 included, so the title's y never depends on
  // which chapter is up. Numeral cap top = art box top = register.
  .part__head {
    grid-template-columns: minmax(0, 1fr) 128px;
    column-gap: 32px;
    min-height: 128px;
  }

  .part__num {
    margin-bottom: 0;
  }

  // §2c: W = 640 − 128 − 32 = 480 → `7` … `47` at the 104 cap, `millions` at 100. §1b: the cap, not
  // the line box, is the block's top (Plex Mono cap ≈ 0.70em).
  .part__callout {
    font-size: min(var(--num-max, 104px), calc(480px / var(--len, 1) / 0.6));
    line-height: 0.72;
  }

  .part__caption {
    font-size: 13px;
  }

  .part__art {
    width: 128px;
    height: 128px;
  }
}

// §1h compact scale: short desktop stages (1280×720) so nothing scrolls inside a panel. The art is
// 80 (the mobile box), the numeral capped at 72: `min(72, 400/len/0.6)` → all 72.
@media (min-width: 769px) and (max-height: 799px) {
  .part {
    --num-max: 72px;
    row-gap: 24px;
    padding-bottom: 12px;
  }

  .part__head {
    grid-template-columns: minmax(0, 1fr) 80px;
    column-gap: 24px;
    min-height: 80px;
  }

  .part__callout {
    font-size: min(var(--num-max, 72px), calc(400px / var(--len, 1) / 0.6));
  }

  .part__art {
    width: 80px;
    height: 80px;
  }

  .panel__foot,
  .panel__foot .panel__next,
  .part__index {
    min-height: 36px;
  }

  .part__title {
    font-size: 40px;
  }

  .part__body {
    font-size: 20px;
  }
}
</style>
