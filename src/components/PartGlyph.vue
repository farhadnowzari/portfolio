<script setup lang="ts">
// PartGlyph.vue: the eight radio parts as bare SVG shapes, one source for ExplodedRadio (Home, 1×)
// and PartArt (the /story and /work panel graphic, 4×). Design v8 §2c: "nothing new is drawn". Renders a
// fragment of shapes centred on (0, 0), ~34 units wide, stroked by the parent `<g>`'s `stroke`/`color`.
import type { PartId } from '../data/story'

defineProps<{ name: PartId }>()
</script>

<template>
  <template v-if="name === 'radio'">
    <!-- speaker: cone housing + driver -->
    <rect
      x="-16"
      y="-15"
      width="32"
      height="30"
      rx="2"
    />
    <circle r="9" />
    <circle
      r="2.5"
      fill="currentColor"
      stroke="none"
    />
  </template>
  <template v-else-if="name === 'friend'">
    <!-- dial: rim with 4 frequency ticks -->
    <circle r="15" />
    <path d="M0 -15 V -10" />
    <path d="M0 15 V 10" />
    <path d="M-15 0 H -10" />
    <path d="M15 0 H 10" />
    <circle
      r="2"
      fill="currentColor"
      stroke="none"
    />
  </template>
  <template v-else-if="name === 'old-stuff'">
    <!-- coil: wound wire -->
    <path d="M-18 4 A5 8 0 0 1 -8 4 A5 8 0 0 1 2 4 A5 8 0 0 1 12 4" />
    <path d="M-18 4 V -6" />
    <path d="M12 4 V -6" />
  </template>
  <template v-else-if="name === 'prove-it'">
    <!-- board: PCB with solder pads -->
    <rect
      x="-17"
      y="-12"
      width="34"
      height="24"
    />
    <path d="M-9 -12 V 12" />
    <path d="M5 -12 V 4" />
    <circle
      cx="-9"
      cy="-6"
      r="1.4"
      fill="currentColor"
      stroke="none"
    />
    <circle
      cx="5"
      cy="8"
      r="1.4"
      fill="currentColor"
      stroke="none"
    />
    <circle
      cx="12"
      cy="-6"
      r="1.4"
      fill="currentColor"
      stroke="none"
    />
  </template>
  <template v-else-if="name === 'forty'">
    <!-- battery: long + short plate -->
    <path d="M-10 -14 V 14" />
    <rect
      x="0"
      y="-7"
      width="5"
      height="14"
      fill="currentColor"
      stroke="none"
    />
  </template>
  <template v-else-if="name === 'millions'">
    <!-- antenna: rod, ball tip, radiating ticks -->
    <path d="M-16 16 L14 -14" />
    <circle
      cx="16"
      cy="-16"
      r="2.2"
    />
    <path d="M8 -19 L11 -22" />
    <path d="M13 -13 L17 -9" />
  </template>
  <template v-else-if="name === 'quiet'">
    <!-- knob: rim with single pointer -->
    <circle r="13" />
    <path d="M0 -13 V -6" />
  </template>
  <template v-else-if="name === 'together'">
    <!-- case: the outer box -->
    <rect
      x="-17"
      y="-12"
      width="34"
      height="24"
      rx="4"
    />
  </template>
</template>
