<script setup lang="ts">
// SkillsView.vue — `/skills`, the parts list (design v7 §1, R66/R68). A definition-list table:
// CV skill groups in a fixed left column, the group's chips on the right, one hairline per row.
// No bars, no since-years, no role counts, no tooltips (R66). Chips are not links — 6 of 36 skills
// appear in no role's stack, so a sometimes-link chip would be a worse pattern than a plain sheet;
// the one way back to /work is the foot row.
import { routes } from '../data/links'
import { skills, skillGroups } from '../data/skills'
import { skillsCopy, skillShort } from '../data/skills-copy'
import Glyph from '../components/Glyph.vue'

const rows = skillGroups.map((group) => ({
  group,
  skills: skills.filter((s) => s.group === group),
}))

// R73: chip-only short labels for the four chip-hostile CV labels; the long label stays the truth
// in the title attribute. Everything else renders skills.ts verbatim.
function chipLabel(label: string): string {
  return skillShort[label] ?? label
}

// Storyteller's string carries its own `→`; the row appends the copper Glyph like every other
// `label · source →` row, so strip the literal rather than render two arrows.
const toWorkLabel = skillsCopy.toWork.replace(/\s*→\s*$/, '')
</script>

<template>
  <div class="skills">
    <header class="skills__header">
      <h1 class="skills__title t-title">
        Skills
      </h1>
      <p class="skills__line t-location">
        {{ skillsCopy.header }}
      </p>
    </header>

    <dl class="skills__table">
      <div
        v-for="row in rows"
        :key="row.group"
        class="skills__row"
      >
        <dt class="skills__group t-mono-sm">
          {{ row.group }}
        </dt>
        <dd class="skills__chips chip-row">
          <span
            v-for="skill in row.skills"
            :key="skill.id"
            class="chip"
            :title="chipLabel(skill.label) !== skill.label ? skill.label : undefined"
          >{{ chipLabel(skill.label) }}</span>
        </dd>
      </div>
    </dl>

    <RouterLink
      class="skills__foot t-mono-sm"
      :to="routes.work"
    >
      {{ toWorkLabel }}<Glyph
        char="→"
        side="trail"
        copper
      />
    </RouterLink>
  </div>
</template>

<style scoped lang="scss">
.skills {
  max-width: 720px;
  margin-inline: auto;
  padding: 24px 16px calc(24px + var(--bottom-h));
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.skills__header {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.skills__table {
  display: flex;
  flex-direction: column;
  margin: 0;
}

// mobile: one column — group label above its chips, rule stays.
.skills__row {
  display: grid;
  grid-template-columns: 1fr;
  padding-block: 14px;
  border-top: 1px solid var(--trace);
}

.skills__row:first-child {
  border-top: 0;
  padding-top: 4px;
}

.skills__group {
  color: var(--ink-2);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 8px;
}

.skills__chips {
  margin: 0;
  // 8px row-gap so two rows of chips read as rows, not a blob.
  gap: 8px 6px;
}

// long labels wrap INSIDE the chip rather than overflowing the column.
.skills__chips .chip {
  white-space: normal;
  text-align: left;
  line-height: 1.3;
  max-width: 100%;
}

.skills__foot {
  display: flex;
  align-items: center;
  min-height: 44px;
  color: var(--copper);
}

.skills__foot:hover {
  color: var(--solder);
}

@media (min-width: 769px) {
  // 176 / 24 / 520 inside the 720 column — the group label sits on the first chip row's text line.
  .skills__row {
    grid-template-columns: 176px 1fr;
    column-gap: 24px;
    padding-block: 16px;
  }

  .skills__group {
    padding-top: 4px;
    margin-bottom: 0;
  }
}
</style>
