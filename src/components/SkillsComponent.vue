<script setup lang="ts">
// Port of react/src/components/SkillsComponent.tsx — id="skills".
// MUI Masonry columns={isSmallerScreen ? 1 : 2} → v-row/v-col (ruling 4), cols=12 md=6.
import { skills } from '../data/skills';
</script>

<template>
  <div
    id="skills"
    class="container"
  >
    <h2 class="text-h2">
      Skills
    </h2>
    <br>
    <v-row>
      <v-col
        v-for="group in skills"
        :key="group.title"
        cols="12"
        md="6"
      >
        <v-card class="mui-card">
          <v-card-item>
            <v-card-title class="text-h5">
              {{ group.title }}
            </v-card-title>
          </v-card-item>
          <v-card-text>
            <v-row
              v-for="skill in group.skills"
              :key="skill.title"
            >
              <v-col cols="6">
                <p class="text-body-1">
                  {{ skill.title }}
                </p>
              </v-col>
              <v-col
                cols="6"
                class="text-right"
              >
                <!-- MUI Rating readOnly: max 5, filled #faaf00, empty rgba(0,0,0,0.26), icon size 20px -->
                <v-rating
                  :model-value="skill.value"
                  readonly
                  :length="5"
                  size="20"
                  density="compact"
                  active-color="#faaf00"
                  color="rgba(0, 0, 0, 0.26)"
                  full-icon="mdi-star"
                  empty-icon="mdi-star-outline"
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
