<script setup lang="ts">
// Icon.vue — every "thing" glyph in one place (design v4 §7.2, §7.4). 16-grid, stroke 1.5,
// square caps/miter joins — the engineering-drawing tell. Decorative: aria-hidden + not focusable.
defineProps<{
  name: 'story' | 'work' | 'skills' | 'community' | 'download' | 'chevron-left' | 'chevron-right' | 'video' | 'star' | 'pen'
}>()
</script>

<template>
  <svg
    class="icon"
    viewBox="0 0 16 16"
    aria-hidden="true"
    focusable="false"
  >
    <template v-if="name === 'story'">
      <path d="M3 4 H13" />
      <path d="M5 8 H15" />
      <path d="M3 12 H13" />
    </template>
    <template v-else-if="name === 'work'">
      <path d="M2 3 V13" />
      <path d="M3 5 H11" />
      <path d="M3 11 H14" />
    </template>
    <template v-else-if="name === 'skills'">
      <!-- IC package: body 8×10 + two pins a side (design v7 §2). Square caps make each 2-unit pin
           bite into the body stroke, same as Work's bars meeting their axis. -->
      <path d="M4 3 H12 V13 H4 Z" />
      <path d="M2 6 H4" />
      <path d="M2 10 H4" />
      <path d="M12 6 H14" />
      <path d="M12 10 H14" />
    </template>
    <path
      v-else-if="name === 'community'"
      d="M4 3 L13 8 L4 13 Z"
    />
    <template v-else-if="name === 'download'">
      <path d="M8 2 V10" />
      <path d="M4 6.5 L8 10.5 L12 6.5" />
      <path d="M3 14 H13" />
    </template>
    <path
      v-else-if="name === 'chevron-left'"
      d="M10 3 L5 8 L10 13"
    />
    <path
      v-else-if="name === 'chevron-right'"
      d="M6 3 L11 8 L6 13"
    />
    <path
      v-else-if="name === 'video'"
      d="M4 3 L13 8 L4 13 Z"
    />
    <path
      v-else-if="name === 'star'"
      d="M8 1.5 L9.5 5.9 L14.2 5.9 L10.35 8.7 L11.85 13.1 L8 10.3 L4.15 13.1 L5.65 8.7 L1.8 5.9 L6.5 5.9 Z"
    />
    <template v-else-if="name === 'pen'">
      <path d="M3 13 L4 10 L11 3 L13 5 L6 12 Z" />
      <path d="M4 10 L6 12" />
    </template>
  </svg>
</template>
