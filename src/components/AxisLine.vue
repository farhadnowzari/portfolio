<script setup lang="ts">
// AxisLine.vue — the copper `┃` axis (design v4 §7.3): border-inline-start on the wrapper, not on
// individual rows, so it still draws when peek = 0 (R50). Reused by the desktop story rail later.
//
// Mobile peek crop (tech-spec §4 "Top/bottom bar CSS": "a 10-line ResizeObserver fallback if a
// real device clips wrong"). `.peek`'s CSS `height: round(down, 100%, 44px)` (shell.scss) covers
// browsers that support the `round()` math function; this observer covers everyone else and is
// authoritative once it runs (inline style beats the class rule) — peek is always 0/1/2 *whole*
// 44px rows, never a row sliced mid-glyph (Noor's blocker #1). Design v8 §4 (R79): the same crop
// runs on desktop now that `.home` is height-bounded there too (peek rows are give-order step 3).
import { onMounted, onUnmounted, ref } from 'vue'

const axisEl = ref<HTMLElement | null>(null)
let ro: ResizeObserver | undefined

function cropPeek() {
  const el = axisEl.value
  if (!el) return
  const hook = el.querySelector<HTMLElement>('.hook')
  const peek = el.querySelector<HTMLElement>('.peek')
  if (!hook || !peek) return
  const available = el.clientHeight - hook.offsetHeight
  const rows = Math.max(0, Math.floor(available / 44))
  // max-height, not height — .peek is `flex: 1` (flex-basis: 0%), so flex-grow fills available
  // space and never consults a plain `height`; `max-height` is what flexbox actually clamps against.
  peek.style.maxHeight = `${rows * 44}px`
}

onMounted(() => {
  cropPeek()
  if (typeof ResizeObserver !== 'undefined' && axisEl.value) {
    ro = new ResizeObserver(cropPeek)
    ro.observe(axisEl.value)
  } else {
    window.addEventListener('resize', cropPeek)
  }
})

onUnmounted(() => {
  ro?.disconnect()
  window.removeEventListener('resize', cropPeek)
})
</script>

<template>
  <div
    ref="axisEl"
    class="axis"
  >
    <slot />
  </div>
</template>
