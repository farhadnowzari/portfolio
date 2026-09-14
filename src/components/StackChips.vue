<script setup lang="ts">
// StackChips.vue — "stack of this part" (design v4 §5). Ruling 55: story.ts's `stack: string[]`
// per part IS the data. Render the strings verbatim — never derive/replace from skills.ts.
defineProps<{ stack: string[] }>()
</script>

<template>
  <div
    v-if="stack.length"
    class="chip-row"
    aria-label="Stack of this part"
  >
    <span
      v-for="item in stack"
      :key="item"
      class="chip"
    >{{ item }}</span>
  </div>
</template>
