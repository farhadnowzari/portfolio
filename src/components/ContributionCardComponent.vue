<script setup lang="ts">
// Port of react/src/components/ContributionCardComponent.tsx.
// MUI CardActionArea href → whole card is an <a target="_blank"> (v-card `href`).
import type { Contribution } from '../data/contributions';

defineProps<Contribution>();
</script>

<template>
  <v-card
    :href="link"
    target="_blank"
    class="mui-card"
  >
    <v-img
      v-if="image"
      :src="image"
      height="180"
      cover
    />
    <v-card-text>
      <!-- ⚠ as-is: block <div> inside the h5, like the React Box inside Typography h5 -->
      <h5 class="text-h5 contribution-card__title">
        <div class="d-flex align-center contribution-card__heading">
          <v-icon
            v-if="type === 'github'"
            icon="mdi-github"
            size="24"
          />
          <v-icon
            v-else-if="type === 'youtube'"
            icon="mdi-youtube"
            size="24"
            class="contribution-card__youtube"
          />
          <v-icon
            v-else-if="type === 'medium'"
            icon="mdi-text-box"
            size="24"
          />
          {{ title }}
        </div>
      </h5>
      <p class="text-body-2 contribution-card__description">
        {{ description }}
      </p>
    </v-card-text>
    <v-card-actions
      v-if="meta"
      class="contribution-card__actions"
    >
      <!-- MUI Chip size="small" color="primary" sx={fontSize 15px, color #fff} -->
      <v-chip
        v-for="(item, index) in meta"
        :key="index"
        size="small"
        variant="flat"
        color="#A2A096"
        class="mui-chip contribution-card__chip"
      >
        {{ item }}
      </v-chip>
    </v-card-actions>
  </v-card>
</template>

<style scoped lang="scss">
.contribution-card__title {
  margin-top: 0;
}

.contribution-card__heading {
  gap: 5px;
}

.contribution-card__youtube {
  color: red;
}

.contribution-card__description {
  margin-top: 15px;
}

// MUI CardActions: padding 8px; children margin-left 8px except the first.
.contribution-card__actions {
  padding: 8px;
  min-height: 0;

  .v-chip + .v-chip {
    margin-inline-start: 8px;
  }
}

.contribution-card__chip {
  color: #fff !important;
}
</style>
