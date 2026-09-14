<script setup lang="ts">
// ExplodedRadio.vue — desktop-only exploded diagram for the `/` card (tech-spec §3 "ExplodedRadio.vue
// (inline SVG, desktop only)"; design v4 §4/§7 engineering-drawing language: stroke 1.5, square caps,
// miter joins — same tell as icons/Icon.vue — copper accents, Plex Mono callouts, dashed leader lines).
//
// Static v1 (motion/draw-in is build-plan step 10, not this pass). Each of the 8 story parts is a
// real hotspot (`<a href="#/story/<id>">`), not a decorative image — same navigation contract as
// PeekList, just laid out along a vertical "exploded" spine instead of a list.
//
// Part shapes resolved (Noor confirmed design.md §7, referenced unchanged by v3's "Ships:" line):
// "one hand-drawn line SVG, 8 numbered parts (speaker, dial, coil, board, battery, antenna, knob,
// case)" — the shapes themselves live in PartGlyph.vue (design v8 §2c: one source for this diagram
// and the 4× panel graphic on /story and /work). Mapped in story order (radio→together = index 1→8, same order §7 lists them). Callout
// numbers are the real content callouts (`story.ts`'s `callout.display`), not the sequential index
// — Ch 7 ("The quiet part") shows no callout on purpose, same as everywhere else it appears.
import { parts } from '../data/story'
import PartGlyph from './PartGlyph.vue'

const spineX = 220
const rowHeight = 70
const startY = 56
// Own coordinate math, not layout luck: label text must stay inside the viewBox (0..440) at every
// rendered width, not just fit by accident at whatever viewport happened to be tested. `charW` is a
// deliberately generous per-glyph estimate for the label's mono font (real IBM Plex Mono renders
// narrower) — overestimating means `wrapLabel` wraps a hair earlier than strictly necessary rather
// than risk an actual overflow the estimate didn't catch.
const charW = 7
const lineHeight = 12
const baseFontSize = 10.5
const minFontSize = 8.5
// caption: the same generous glyph ratio as the title, scaled to its 7.5px size (7 × 7.5 / 10.5 = 5).
const captionFontSize = 7.5
const captionCharW = (charW * captionFontSize) / baseFontSize
const captionLineHeight = 9
// the leader is 68 units long; the number sits on it, the caption hangs under it (design v7 §4).
const leaderLength = 68

function wrapLabel(title: string, maxWidth: number, glyphW = charW): string[] {
  const words = title.split(' ')
  const lines: string[] = []
  let current = ''
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word
    // `!current`: a single word wider than maxWidth still goes on its own line rather than
    // looping forever trying to shrink it further — `fontScale` below is what actually keeps
    // that lone-word case inside the viewBox, by shrinking the whole label to fit.
    if (candidate.length * glyphW <= maxWidth || !current) {
      current = candidate
    } else {
      lines.push(current)
      current = word
    }
  }
  if (current) lines.push(current)
  return lines
}

// Captions are a note on a dimension line: two lines at most. Greedy width-wrap first; if that
// needs a third line, fall back to the most balanced two-line split instead. The one caption that
// takes this path, "services, before → after", puts its 14-ch second line at 70 estimated units on a
// 68-unit leader — 2 units of the overestimate (real Plex Mono renders it at ~63), not an overflow.
function wrapCaption(caption: string): string[] {
  const greedy = wrapLabel(caption, leaderLength, captionCharW)
  if (greedy.length <= 2) return greedy
  const words = caption.split(' ')
  let best: string[] = [caption]
  let bestWidth = Infinity
  for (let i = 1; i < words.length; i++) {
    const lines = [words.slice(0, i).join(' '), words.slice(i).join(' ')]
    const width = Math.max(...lines.map((l) => l.length))
    if (width < bestWidth) {
      bestWidth = width
      best = lines
    }
  }
  return best
}

const items = parts.map((part, i) => {
  const side = i % 2 === 0 ? -1 : 1
  const y = startY + i * rowHeight
  const shapeX = spineX + side * 96
  // §4: the leader is a dimension line — number above its midpoint, caption below it. That frees
  // the ~44 units the number used to occupy beside the shape, which go to the title.
  const dimX = spineX + side * (leaderLength / 2)
  const labelX = shapeX + side * 26
  // Available width is whatever's left between labelX and the viewBox edge on that side (0 for the
  // left/`end`-anchored labels, 440 for the right/`start`-anchored ones) — this is what makes the
  // wrap width-aware instead of a fixed guess. Resolves to 98 units both sides.
  const maxLabelWidth = side === -1 ? labelX : 440 - labelX
  const labelLines = wrapLabel(part.title, Math.max(maxLabelWidth, charW))
  // The word-wrap above still lets one unsplittable word overflow `maxLabelWidth` on its own line
  // (splitting a word mid-character isn't an option) — catch that here and shrink the *whole* label
  // uniformly so every line, including that one, actually lands inside `maxLabelWidth`. `charW`
  // already overestimates real glyph width, so sizing off it leaves margin rather than cutting it
  // close.
  const longestLineWidth = Math.max(...labelLines.map((line) => line.length * charW))
  const fontScale = Math.min(1, maxLabelWidth / longestLineWidth)
  const fontSize = Math.max(minFontSize, baseFontSize * fontScale)
  const labelLineY = labelLines.map(
    (text, li) => ({ text, y: y + (li - (labelLines.length - 1) / 2) * lineHeight }),
  )
  // caption: ≤2 lines under the leader (`y + 5` hanging, then +9). Longest single word
  // ("university") is 50 < 68 units, so no fontScale is needed here.
  const captionLines = part.callout?.caption ? wrapCaption(part.callout.caption) : []
  const captionLineY = captionLines.map((text, li) => ({ text, y: y + 5 + li * captionLineHeight }))
  return {
    part,
    side,
    y,
    shapeX,
    leaderStart: spineX,
    leaderEnd: shapeX - side * 28,
    dimX,
    labelX,
    labelLineY,
    captionLineY,
    fontSize,
    // hit rect: the whole half-row on this side, so the wider title is covered too.
    hitX: side === -1 ? 0 : spineX - 8,
  }
})

const spineTop = startY
const spineBottom = startY + (parts.length - 1) * rowHeight
</script>

<template>
  <svg
    class="exploded"
    viewBox="0 0 440 620"
    role="group"
    aria-label="Exploded diagram of a radio, one part per chapter of the story. Select a part to jump to that chapter"
  >
    <!--
      role="group", not "img" — axe's nested-interactive rule (correctly) flags role="img" here:
      it asserts the element is a single atomic image, but it contains 8 real, individually
      focusable <a> hotspots. Tech-spec's a11y checklist suggested tabindex="-1" on these with a
      separate textual list as the real tab stops, but that assumed a full 8-item desktop part
      strip that doesn't exist yet (only the 2-item peek list does) — making the hotspots
      unfocusable would remove keyboard access to 6 of 8 chapters from `/` entirely. role="group"
      keeps every hotspot a real, independent tab stop and is the semantically correct role for an
      SVG container of interactive children.
    -->
    <!-- assembly spine -->
    <line
      class="exploded__spine"
      :x1="spineX"
      :y1="spineTop - 20"
      :x2="spineX"
      :y2="spineBottom + 20"
    />

    <a
      v-for="item in items"
      :key="item.part.id"
      class="exploded__hotspot"
      :href="`#/story/${item.part.id}`"
      :aria-label="`${item.part.title}${item.part.callout ? `${item.part.title.endsWith('.') ? '' : ','} ${item.part.callout.aria}` : ''}`"
    >
      <!-- generous, invisible hit area: the full half-row on this side -->
      <rect
        class="exploded__hit"
        :x="item.hitX"
        :y="item.y - 26"
        width="228"
        height="52"
      />

      <!-- leader line: spine -> part -->
      <line
        class="exploded__leader"
        :x1="item.leaderStart"
        :y1="item.y"
        :x2="item.leaderEnd"
        :y2="item.y"
      />
      <path
        class="exploded__tick"
        :d="`M ${spineX - 4} ${item.y} h 8`"
      />

      <!-- part glyph -->
      <g
        class="exploded__shape"
        :transform="`translate(${item.shapeX}, ${item.y})`"
      >
        <PartGlyph :name="item.part.id" />
      </g>

      <!-- dimension line (design v7 §4): the real content callout sits 4 units ABOVE the leader's
           midpoint, its caption hangs 5 units BELOW it — straight drafting grammar, a dimension
           with its note. Bare mono digits, no enclosing shape (host round-10 ruling). Ch 7 shows
           none on purpose. -->
      <template v-if="item.part.callout">
        <text
          class="exploded__num-text"
          :x="item.dimX"
          :y="item.y - 4"
          text-anchor="middle"
        >{{ item.part.callout.display }}</text>
        <text
          v-if="item.captionLineY.length"
          class="exploded__caption"
          text-anchor="middle"
        >
          <tspan
            v-for="line in item.captionLineY"
            :key="line.y"
            :x="item.dimX"
            :y="line.y"
            dominant-baseline="hanging"
          >{{ line.text }}</tspan>
        </text>
      </template>

      <!-- label: wrapped to as many lines as `labelLineY` needed (script setup) so the title text
           itself never crosses the viewBox edge, at any rendered width — the 640px CSS cap just
           scales this uniformly, it never has to bail the layout out. -->
      <text
        class="exploded__label"
        :text-anchor="item.side === -1 ? 'end' : 'start'"
        :style="{ fontSize: `${item.fontSize}px` }"
      >
        <tspan
          v-for="line in item.labelLineY"
          :key="line.y"
          :x="item.labelX"
          :y="line.y"
          dominant-baseline="central"
        >{{ line.text }}</tspan>
      </text>
    </a>
  </svg>
</template>

<style scoped>
.exploded {
  width: 100%;
  max-width: 640px;
  height: auto;
  overflow: visible;
  stroke: var(--trace);
  fill: none;
  stroke-width: 1.5;
  stroke-linecap: square;
  stroke-linejoin: miter;
}

.exploded__spine {
  stroke: var(--trace);
  stroke-dasharray: 2 4;
}

.exploded__leader {
  stroke: var(--trace);
  stroke-dasharray: 3 3;
}

.exploded__tick {
  stroke: var(--trace);
}

.exploded__shape {
  color: var(--ink-2);
  stroke: currentColor;
  transition: color 160ms;
}

.exploded__hit {
  fill: transparent;
  stroke: none;
}

.exploded__num-text {
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: 10px;
  fill: var(--copper);
  stroke: none;
  transition: fill 160ms;
}

.exploded__label {
  font-family: var(--font-mono);
  font-size: 10.5px;
  fill: var(--ink-2);
  stroke: none;
  transition: fill 160ms;
}

/* the note under the dimension line — 7.5 units = 10.9px at the 640px cap, read after the number;
   the <a aria-label> carries the full sentence for AT. */
.exploded__caption {
  font-family: var(--font-mono);
  font-size: 7.5px;
  fill: var(--ink-2);
  stroke: none;
  transition: fill 160ms;
}

.exploded__hotspot {
  cursor: pointer;
}

.exploded__hotspot:hover .exploded__shape,
.exploded__hotspot:focus-visible .exploded__shape {
  color: var(--copper);
}

.exploded__hotspot:hover .exploded__leader,
.exploded__hotspot:focus-visible .exploded__leader {
  stroke: var(--copper);
}

.exploded__hotspot:hover .exploded__label,
.exploded__hotspot:focus-visible .exploded__label,
.exploded__hotspot:hover .exploded__caption,
.exploded__hotspot:focus-visible .exploded__caption {
  fill: var(--ink);
}

/* Fix, no pill behind it any more: hover used to flip to cream-on-copper-pill contrast — with the
   pill gone that made the number invisible against the board. `--solder` is the token literally
   reserved for hover/pressed copper. */
.exploded__hotspot:hover .exploded__num-text,
.exploded__hotspot:focus-visible .exploded__num-text {
  fill: var(--solder);
}

.exploded__hotspot:focus-visible {
  outline: none;
}

.exploded__hotspot:focus-visible .exploded__hit {
  stroke: var(--copper);
  stroke-width: 1.5;
  stroke-dasharray: 2 2;
}

@media (prefers-reduced-motion: no-preference) {
  .exploded__shape,
  .exploded__leader,
  .exploded__label,
  .exploded__caption,
  .exploded__num-text {
    transition-duration: 160ms;
  }
}
</style>
