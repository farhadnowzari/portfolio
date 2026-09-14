<script setup lang="ts">
// PeekList.vue — the two peek parts under the hook (design v4 §4.1). Peek "min 0, max 2" is a
// CSS crop (overflow: hidden on the wrapper), not a JS count — both rows are always in the DOM.
import { parts } from '../data/story'

const peek = parts.slice(0, 2)
</script>

<template>
  <ul class="peek">
    <li
      v-for="part in peek"
      :key="part.id"
      class="peek__item"
    >
      <RouterLink :to="`/story/${part.id}`">
        <span
          class="peek__num t-mono"
          aria-hidden="true"
        >{{ part.callout?.display }}</span>
        <span class="peek__title">{{ part.title }}</span>
        <!-- R70 mobile: on the phone the peek IS the diagram, so the row carries the dimension note,
             right-aligned like a note at the end of a leader line. -->
        <span
          v-if="part.callout?.caption"
          class="peek__caption"
          aria-hidden="true"
        >{{ part.callout.caption }}</span>
        <span class="sr-only">{{ part.callout?.aria }}</span>
      </RouterLink>
    </li>
  </ul>
</template>
