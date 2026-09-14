<script setup lang="ts">
// EndingPanel.vue — the block after Ch 8 (plot v4 §3), now the deck's ninth panel `/story/ending`
// (design v8 §1a/§2c): no rail row, no art, no index, no Next. The field goes empty where the story ends.
import { ending } from '../data/ending'
import { externalAttrs, getLink } from '../data/links'
import Cursor from './Cursor.vue'

// Registry spread must go FIRST: getLink(...) also carries a `label` (the destination's real
// title), which would silently overwrite ending.ts's own `label` if spread second. href/download/
// title come from the registry; label stays ending.ts's copy (Ravi's #2 — 4 of 5 buttons were
// rendering the registry's label instead of "Email"/"LinkedIn"/"GitHub"/"YouTube"/"CV").
const endingButtons = ending.buttons.map((b) => ({ ...getLink(b.link), ...b }))
const endingContact = ending.contact.map((c) => ({ ...getLink(c.link), ...c }))
</script>

<template>
  <section
    id="ending"
    class="panel ending"
    tabindex="-1"
    aria-label="Get in touch"
  >
    <div class="panel__col">
      <p class="ending__sentence t-name">
        {{ ending.sentence }}<Cursor /><span class="sr-only">{{ ending.sentenceAria }}</span>
      </p>
      <p class="ending__subline t-promise">
        {{ ending.subline }}
      </p>
      <p class="ending__contact t-mono">
        <a
          v-for="c in endingContact"
          :key="c.link"
          :href="c.href"
          :title="c.title"
          v-bind="externalAttrs(c)"
        >{{ c.label }}</a>
      </p>
      <div class="btn-row">
        <a
          v-for="b in endingButtons"
          :key="b.link"
          class="btn"
          :class="{ 'btn--primary': b.link === 'email' }"
          :href="b.href"
          :download="b.download"
          :title="b.title"
          v-bind="externalAttrs(b)"
        >{{ b.label }}</a>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.panel__col {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ending__contact {
  display: flex;
  flex-direction: column;
  gap: 4px;
  color: var(--copper);
}

.ending__contact a {
  min-height: 44px;
  display: flex;
  align-items: center;
}

@media (min-width: 769px) {
  // same left-registered 640px column as the chapters (§2a). R102: the deck is content-sized (640 wide
  // below 1360), so the column is the grid's only track: a second `1fr` cell plus its gap would take
  // 48px off the column.
  .ending {
    display: grid;
    grid-template-columns: minmax(0, 640px);
    align-content: start;
    padding: 40px 0 24px;
  }
}

@media (min-width: 769px) and (max-height: 799px) {
  .ending {
    padding-top: 24px;
  }
}
</style>
