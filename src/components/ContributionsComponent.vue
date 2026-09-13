<script setup lang="ts">
// Port of react/src/components/ContributionsComponent.tsx — id="contributions".
// MUI Masonry columns={isSmallerScreen ? 1 : 2} → v-row/v-col (ruling 4), cols=12 md=6.
import { contributions } from '../data/contributions';
import ContributionCardComponent from './ContributionCardComponent.vue';
</script>

<template>
  <div
    id="contributions"
    class="container"
  >
    <h2 class="text-h2">
      Contributions
    </h2>
    <br>
    <v-row>
      <v-col
        v-for="contribution in contributions"
        :key="contribution.link"
        cols="12"
        md="6"
      >
        <ContributionCardComponent v-bind="contribution" />
      </v-col>
    </v-row>
  </div>
</template>
