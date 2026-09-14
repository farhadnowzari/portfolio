<script setup lang="ts">
// LinkRow.vue — one outbound / cross-route click row (plot v4 §2: "label · source →").
import type { LinkRow as LinkRowType } from '../data/story'
import type { RouteKey } from '../data/links'
import { externalAttrs, getLink, routes } from '../data/links'
import Glyph from './Glyph.vue'

const props = defineProps<{ row: LinkRowType }>()

function isRoute(row: LinkRowType): row is { label: string; source: string; to: { route: RouteKey } } {
  return 'route' in row.to
}

const routeTo = isRoute(props.row) ? routes[props.row.to.route] : undefined
const link = !isRoute(props.row) ? getLink(props.row.to.link) : undefined
</script>

<template>
  <RouterLink
    v-if="routeTo"
    class="link-row t-mono"
    :to="routeTo"
  >
    {{ row.label }} · {{ row.source }}<Glyph
      char="→"
      side="trail"
      copper
    />
  </RouterLink>
  <a
    v-else-if="link"
    class="link-row t-mono"
    :href="link.href"
    :download="link.download"
    :title="link.title"
    v-bind="externalAttrs(link)"
  >
    {{ row.label }} · {{ row.source }}<Glyph
      char="→"
      side="trail"
      copper
    />
  </a>
</template>
