<script setup lang="ts">
// TopBar.vue — sticky, 48px (design v4 §3, §4.0). Left = name (→ /), middle = desktop tabs,
// right = CV (filled, first-filled-button-everywhere) + Say hi (outline, mailto).
import { useRoute } from 'vue-router'
import { navItems } from '../data/nav'
import { links, routes } from '../data/links'
import { profile } from '../data/profile'
import Icon from './icons/Icon.vue'

const route = useRoute()
const cv = links.cv
const email = links.email
</script>

<template>
  <header class="topbar">
    <RouterLink
      class="topbar__name t-mono"
      to="/"
      :aria-current="route.name === 'home' ? 'page' : undefined"
    >
      {{ profile.name }}
    </RouterLink>
    <nav
      class="topbar__tabs"
      aria-label="Primary"
    >
      <RouterLink
        v-for="item in navItems"
        :key="item.route"
        :to="routes[item.route]"
        :aria-current="route.name === item.icon ? 'page' : undefined"
      >
        {{ item.label }}
      </RouterLink>
    </nav>
    <div class="topbar__actions">
      <a
        class="btn btn--primary"
        :href="cv.href"
        :download="cv.download"
        :title="cv.title"
      >
        <Icon name="download" />CV
      </a>
      <a
        class="btn"
        :href="email.href"
        :title="email.title"
      >Say hi</a>
    </div>
  </header>
</template>
