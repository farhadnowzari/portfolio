<script setup lang="ts">
// Cursor.vue — the ending's blinking block (design v4 §6 #4, §7.2). CSS box, not the `▮` glyph
// (neither font has it). Never stops blinking; solid under prefers-reduced-motion (utilities.scss).
</script>

<template>
  <span
    class="cursor"
    aria-hidden="true"
  />
</template>
