<script setup lang="ts">
// BottomBar.vue — mobile (≤768px) tab bar, fixed, safe-area aware (design v4 §3).
import { useRoute } from 'vue-router'
import { navItems } from '../data/nav'
import { routes } from '../data/links'
import Icon from './icons/Icon.vue'

const route = useRoute()
</script>

<template>
  <nav
    class="bottombar"
    aria-label="Primary"
  >
    <RouterLink
      v-for="item in navItems"
      :key="item.route"
      class="bottombar__item"
      :to="routes[item.route]"
      :aria-current="route.name === item.icon ? 'page' : undefined"
    >
      <Icon :name="item.icon" />
      <span>{{ item.label }}</span>
    </RouterLink>
  </nav>
</template>
