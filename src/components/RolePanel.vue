<script setup lang="ts">
// RolePanel.vue — one role of `/work` (design v8 §3, grid per design v9 §3, re-cut R105/r16 note).
// Employer + location print on EACH panel (both gis panels carry them), then title + dates, bullets,
// chips. R105: no art cell on /work; the role→chapter cross-link survives as the `↳ Part 0N` text
// link on the right of the one 44px foot row, `↓ Next role` (or, on the last panel, the /skills row)
// on its left. R91: `role` is the index row (roles.ts), `content` the role's own chunk
// (data/roles/<id>.ts), bound by panels/work.ts.
import { computed } from 'vue'
import type { Role, RoleContent } from '../data/roles'
import { parts, nextLabels } from '../data/story'
import { skillChip } from '../data/skills'
import { skillsCopy } from '../data/skills-copy'
import { routes } from '../data/links'
import Glyph from './Glyph.vue'

const props = defineProps<{
  role: Role
  content: RoleContent
  index: number
  total: number
  /** Route of the next panel; absent on the last panel of the deck. */
  nextTo?: string
}>()

function formatMonth(ym: string): string {
  const [yearStr, monthStr] = ym.split('-')
  return new Date(Number(yearStr), Number(monthStr) - 1).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  })
}

const chapter = computed(() => parts.find((p) => p.id === props.role.parts[0]))

// Storyteller's string carries its own `→` (skills-copy.ts); the row appends the copper Glyph
// like every other `label · source →` row, so strip the literal here rather than render two arrows.
const toSkillsLabel = skillsCopy.toSkills.replace(/\s*→\s*$/, '')

function pad(n: number): string {
  return String(n).padStart(2, '0')
}
</script>

<template>
  <article
    :id="role.id"
    class="panel role"
    tabindex="-1"
    :aria-label="`Role ${index} of ${total}`"
  >
    <div class="panel__col">
      <div class="role__row">
        <h2 class="role__employer t-employer">
          {{ role.employer }}
        </h2>
        <p class="role__loc t-location">
          {{ role.location }}
        </p>
      </div>
      <div class="role__row">
        <h3 class="role__title t-title">
          {{ role.title }}
        </h3>
        <p class="role__dates t-mono">
          {{ formatMonth(role.from) }} – {{ role.to ? formatMonth(role.to) : 'present' }}
        </p>
      </div>
      <ul class="role__bullets">
        <li
          v-for="bullet in content.bullets"
          :key="bullet"
        >
          {{ bullet }}
        </li>
      </ul>
      <div
        v-if="content.stack.length"
        class="role__chips chip-row"
      >
        <span
          v-for="id in content.stack"
          :key="id"
          class="chip"
        >{{ skillChip(id) }}</span>
      </div>
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
        />{{ nextLabels.workRole }}
      </RouterLink>
      <RouterLink
        v-else
        class="panel__next work__foot"
        :to="routes.skills"
      >
        {{ toSkillsLabel }}<Glyph
          char="→"
          side="trail"
          copper
        />
      </RouterLink>
      <RouterLink
        v-if="chapter"
        class="role__chapter t-mono-sm"
        :to="`/story/${chapter.id}`"
      >
        ↳ Part {{ pad(chapter.index) }}
      </RouterLink>
    </div>
  </article>
</template>

<style scoped lang="scss">
.panel__col {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.role__row {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.role__employer {
  color: var(--ink);
}

.role__dates {
  color: var(--ink-2);
}

// a scan page, not a promise line: 16 / 1.5 Fraunces (r16 note), ~70ch on the 580 measure, not
// .t-promise's 20 / 24. The disc is the ledger's ink-2, the text the page's ink.
.role__bullets {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 580px;
  padding-inline-start: 18px;
  list-style: disc;
}

.role__bullets li {
  font-family: var(--font-fraunces-text);
  font-size: 16px;
  line-height: 1.5;
  color: var(--ink);
}

.role__bullets li::marker {
  color: var(--ink-2);
}

// R105: one 44px row, `↓ Next role` (or the /skills row) left, `↳ Part 0N` right on the column's edge.
.panel__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-height: 44px;
}

.role__chapter {
  display: flex;
  align-items: center;
  min-height: 44px;
  color: var(--copper);
  white-space: nowrap;
}

.role__chapter:hover {
  color: var(--solder);
}

@media (min-width: 769px) {
  // v9 §3 re-cut (r16 note): the same 640 column as /story, one x, one measure, one grid. R102: the
  // deck is sized to its content (WorkView's column), so the grid is the one column, no gutter.
  .role {
    --col: 640px;
    display: grid;
    grid-template-columns: minmax(0, var(--col));
    // two rows, no `1fr` void row: an empty third row still costs a row-gap, which made ch5 scroll 39px
    // of nothing inside its fixed stage (R102). The sheet is as tall as its content; the stage is the panel.
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
    gap: 12px;
  }

  // R97: the foot row directly under the content, never pinned to the stage floor.
  .panel__foot {
    grid-row: 2;
    grid-column: 1;
    align-self: center;
  }

  // ledger rows: location / dates move to the right edge of their line (same eye-path as the
  // community ledger).
  .role__row {
    flex-direction: row;
    align-items: baseline;
    justify-content: space-between;
    gap: 16px;
  }

  // r16 note: the head rows keep their distance from the bullet wall (20), the chips from the bullets (20).
  .role__row:last-of-type {
    margin-bottom: 8px;
  }

  .role__chips {
    margin-top: 8px;
  }

  .role__dates,
  .role__loc {
    white-space: nowrap;
    text-align: end;
  }
}

// compact stage (1280×720): 15 / 1.45 bullets, gap 6, foot row 36, 24 under the content; chips 12
// over the bullets and 12 under the foot row (see WorkView: the 664 budget closes by 3px).
@media (min-width: 769px) and (max-height: 799px) {
  .role {
    row-gap: 24px;
    padding-bottom: 12px;
  }

  .role__chips {
    margin-top: 0;
  }

  .role__bullets {
    gap: 6px;
  }

  .role__bullets li {
    font-size: 15px;
    line-height: 1.45;
  }

  .panel__foot,
  .panel__foot .panel__next,
  .role__chapter {
    min-height: 36px;
  }
}
</style>
