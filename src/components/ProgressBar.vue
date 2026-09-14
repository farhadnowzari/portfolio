<script setup lang="ts">
// ProgressBar.vue — mobile story progress, stepped (design v4 §6 "+", tech-spec §4 motion table).
// One code path, no `animation-timeline: scroll()` engine, no @supports branch: the IO in
// useCurrentSection already knows the current part on every fire, so this is a plain width transition.
defineProps<{ index: number; total: number }>()
</script>

<template>
  <div
    class="story__progress"
    role="progressbar"
    :aria-valuenow="index"
    :aria-valuemin="1"
    :aria-valuemax="total"
    aria-label="Story progress"
  >
    <div
      class="story__progress-bar"
      :style="{ width: `${(index / total) * 100}%` }"
    />
  </div>
</template>
