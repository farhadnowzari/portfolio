<script setup lang="ts">
// CommunityView.vue — the ledger (plot v4 §5). Stretched-link rows (design v4 §4.4, tech-spec a11y
// checklist): a real `<a>` covers the row via `::after { inset: 0 }`, never `<a>` nested in `<a>`.
import { ledger, counters, atHome } from '../data/community'
import { externalAttrs, getLink } from '../data/links'
import { parts } from '../data/story'
import Glyph from '../components/Glyph.vue'

function partIndex(id: string): string {
  const n = parts.find((p) => p.id === id)?.index ?? 0
  return String(n).padStart(2, '0')
}
</script>

<template>
  <div class="community">
    <ul class="community__counters">
      <li
        v-for="c in counters"
        :key="c.label"
      >
        <span class="t-name">{{ c.value }}</span>
        <span class="t-mono-sm">{{ c.label }}</span>
      </li>
    </ul>

    <ul class="ledger">
      <li
        v-for="row in ledger"
        :key="row.id"
        class="ledger__row"
      >
        <a
          class="ledger__link t-mono"
          :href="getLink(row.link).href"
          :download="getLink(row.link).download"
          :title="getLink(row.link).title"
          v-bind="externalAttrs(getLink(row.link))"
        >
          {{ row.label }} · {{ row.source }}<Glyph
            char="→"
            side="trail"
            copper
          />
        </a>
        <p class="ledger__why t-location">
          {{ row.why }}
        </p>
        <RouterLink
          :to="`/story/${row.part}`"
          class="ledger__back t-mono-sm"
        >
          ↳ Part {{ partIndex(row.part) }}
        </RouterLink>
      </li>
    </ul>

    <section class="community__home">
      <h2 class="t-mono-sm">
        {{ atHome.heading }}
      </h2>
      <p class="t-promise">
        {{ atHome.items.join(' · ') }}
      </p>
    </section>
  </div>
</template>

<style scoped lang="scss">
.community {
  padding: 24px 16px calc(24px + var(--bottom-h));
  max-width: 720px;
  margin-inline: auto;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.community__counters {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}

.community__counters li {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.ledger {
  display: flex;
  flex-direction: column;
}

.ledger__row {
  position: relative;
  padding-block: 12px;
  border-top: 1px dashed var(--trace);
  min-height: 44px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.ledger__link {
  // No `position: relative` here (Omar's review #1) — that made the anchor its own positioning
  // context, so `::after { inset: 0 }` stretched to the *link's own text box*, not the row, and
  // never reached `.ledger__why`/`.ledger__back` or filled the 44px min-height. `z-index: 1` alone
  // is enough to keep the visible link above the stretched-hit-area pseudo-element.
  z-index: 1;
  color: var(--ink);
}

.ledger__link::after {
  content: '';
  position: absolute;
  inset: 0;
}

.ledger__link:hover {
  color: var(--copper);
}

.ledger__why {
  margin: 0;
}

.ledger__back {
  position: relative;
  z-index: 1;
  align-self: flex-start;
  color: var(--copper);
  min-height: 44px;
  display: flex;
  align-items: center;
}

.ledger__back:hover {
  color: var(--solder);
}

.community__home {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.community__home h2 {
  text-transform: uppercase;
}

@media (min-width: 769px) {
  .community { padding-bottom: 48px; }
}
</style>
