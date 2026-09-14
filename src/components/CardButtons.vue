<script setup lang="ts">
// CardButtons.vue — the card's five buttons, CV first and filled everywhere (plot v4 §1, host
// ruling: CV = first filled button everywhere). Labels are profile.ts verbatim.
import { profile } from '../data/profile'
import { externalAttrs, getLink } from '../data/links'
import Icon from './icons/Icon.vue'

const cvButton = profile.buttons[0]!
const rest = profile.buttons.slice(1)
const cvLink = getLink(cvButton.link)
</script>

<template>
  <div class="card__buttons">
    <a
      class="btn btn--primary btn--block"
      :href="cvLink.href"
      :download="cvLink.download"
      :title="cvLink.title"
    >
      <Icon name="download" />{{ cvButton.label }}
    </a>
    <div class="btn-row">
      <a
        v-for="b in rest"
        :key="b.link"
        class="btn"
        :href="getLink(b.link).href"
        :title="getLink(b.link).title"
        v-bind="externalAttrs(getLink(b.link))"
      >{{ b.label }}</a>
    </div>
  </div>
</template>
