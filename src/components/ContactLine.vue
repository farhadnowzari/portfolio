<script setup lang="ts">
// ContactLine.vue — email + LinkedIn as plain mono copper text (card + ending, design v4 §2).
import { externalAttrs, links } from '../data/links'
</script>

<template>
  <p class="card__contact">
    <a
      :href="links.email.href"
      :title="links.email.title"
    >{{ links.email.label }}</a>
    <a
      :href="links.linkedin.href"
      :title="links.linkedin.title"
      v-bind="externalAttrs(links.linkedin)"
    >{{ links.linkedin.label }}</a>
  </p>
</template>
