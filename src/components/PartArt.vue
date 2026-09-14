<script setup lang="ts">
// PartArt.vue: design v10 §2d, the chapter's own part as a bare figure in the panel's numeral row, like
// a package drawing on a datasheet. Same PartGlyph the Home diagram draws; `--trace`, non-scaling
// strokes, so beside the copper numeral it stays the quiet partner. No spine, no tick, no slot: the
// root IS the <svg>, sized by the parent (`.part__art`: 128 on the desktop row, 80 compact and mobile).
//
// Scale 3.5 × fit in a 128 box: the 34-unit extent draws 119 of 128 (4.5px inset), so the ink's right
// edge is ~5px inside the column's right edge, where "Remote, Germany" ends its glyphs on /work. `fit`
// scales each part's larger extent to the 34-unit box so the battery is not a toothpick next to the
// case; the coil (ch3) and the antenna (ch6) are lines, not areas, so they draw at 2.5px.
import type { PartId } from '../data/story'
import PartGlyph from './PartGlyph.vue'

const props = defineProps<{ name: PartId }>()

// 34 / the glyph's larger extent: 32, 30, 30, 34, 28, 34, 26, 34 (antenna 0.8: a diagonal line).
const fit: Record<PartId, number> = {
  radio: 1.06,
  friend: 1.13,
  'old-stuff': 1,
  'prove-it': 1,
  forty: 1.21,
  millions: 0.8,
  quiet: 1.31,
  together: 1,
}

// §2d: two glyphs are drawn off their own centre in PartGlyph (coil −18…12 → centre −3; battery
// −10…5 → centre −2.5). Beside a spine that was the point; right-aligned in a box it leaves the coil
// 10px short of the edge. Glyph units, applied before the scale.
const dx: Partial<Record<PartId, number>> = {
  'old-stuff': 3,
  forty: 2.5,
}

const LINE_PARTS: readonly PartId[] = ['old-stuff', 'millions']

const k = 3.5 * fit[props.name]
const scale = k.toFixed(2)
const tx = (64 + (dx[props.name] ?? 0) * k).toFixed(2)
const line = LINE_PARTS.includes(props.name)
</script>

<template>
  <svg
    class="part-art"
    viewBox="0 0 128 128"
    aria-hidden="true"
  >
    <g
      :transform="`translate(${tx} 64) scale(${scale})`"
      class="part-art__glyph"
      :class="{ 'part-art__glyph--line': line }"
    >
      <PartGlyph :name="name" />
    </g>
  </svg>
</template>

<style scoped lang="scss">
.part-art {
  // the box (128 / 80) is the parent's (`.part__art`): one owner for the size, no two rules on one element
  display: block;
  overflow: visible;
  fill: none;
}

// `color` = `--trace` so PartGlyph's `fill="currentColor"` solder dots follow the stroke colour.
.part-art__glyph {
  color: var(--trace);
  stroke: var(--trace);
  fill: none;
  stroke-width: 2;
  stroke-linecap: square;
  stroke-linejoin: miter;
}

.part-art__glyph--line {
  stroke-width: 2.5;
}

.part-art__glyph :deep(*) {
  vector-effect: non-scaling-stroke;
}
</style>
