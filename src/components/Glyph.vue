<script setup lang="ts">
// Glyph.vue — Plex Mono arrow span (design v4 §7.1). Arrows are characters, not icons.
withDefaults(
  defineProps<{
    char: string
    side?: 'lead' | 'trail' | 'none'
    copper?: boolean
  }>(),
  { side: 'none', copper: false },
)
</script>

<template>
  <span
    class="glyph"
    :class="[side === 'lead' && 'glyph--lead', side === 'trail' && 'glyph--trail', copper && 'glyph--copper']"
    aria-hidden="true"
  >{{ char }}</span>
</template>
