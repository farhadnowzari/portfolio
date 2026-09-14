<script setup lang="ts">
// HomeView.vue — the card (tech-spec §2, §6 step 6). Mounts over the hand-typed static card in
// index.html with identical markup/classes/data (profile.ts) so the replace is a no-op paint —
// no visible change at 400×667 or 1280×720.
import { profile } from '../data/profile'
import CardButtons from '../components/CardButtons.vue'
import ContactLine from '../components/ContactLine.vue'
import PeekList from '../components/PeekList.vue'
import AxisLine from '../components/AxisLine.vue'
import Glyph from '../components/Glyph.vue'
import ExplodedRadio from '../components/ExplodedRadio.vue'
import StackChips from '../components/StackChips.vue'

// Noor #7: the card's stack line reused plain mono text instead of the bordered chip component
// StackChips already builds for /story. profile.stackLine stays the one source of truth (content
// authority) — split on the same ' · ' the wireframe/mono line always used, chip-ified for display.
const stackItems = profile.stackLine.split(' · ')
</script>

<template>
  <div class="home">
    <div class="card static-card">
      <div class="card__head">
        <h1 class="t-name">
          {{ profile.name }}
        </h1>
        <p class="t-title">
          {{ profile.title }}
        </p>
        <p class="t-employer">
          {{ profile.employerLine }}
        </p>
      </div>
      <p class="t-promise">
        {{ profile.promise }}
      </p>
      <div class="card__head">
        <p class="t-location">
          {{ profile.location }}
        </p>
        <StackChips :stack="stackItems" />
      </div>
      <CardButtons />
      <ContactLine />
    </div>
    <hr
      class="rule"
      aria-hidden="true"
    >
    <div class="below-card">
      <AxisLine>
        <RouterLink
          class="hook t-hook"
          to="/story"
        >
          <Glyph
            :char="profile.hook.arrow"
            side="lead"
            copper
          /><span class="hook__text">{{ profile.hook.pre }}<span class="hook__num">{{ profile.hook.num }}</span>{{ profile.hook.post }}</span>
        </RouterLink>
        <PeekList />
      </AxisLine>
    </div>
    <div class="home__diagram">
      <ExplodedRadio />
    </div>
  </div>
</template>
