<script setup lang="ts">
// Port of react/src/components/ExperiencesComponent.tsx — id="experiences".
import { experiences } from '../data/experiences';
</script>

<template>
  <div
    id="experiences"
    class="container"
  >
    <h2 class="text-h2">
      Experiences
    </h2>
    <br>
    <v-row>
      <v-col
        v-for="experience in experiences"
        :key="experience.title"
        cols="12"
      >
        <v-card class="mui-card">
          <v-card-item>
            <v-card-title class="text-h5">
              {{ experience.title }}
            </v-card-title>
            <!-- MUI CardHeader subheader: body2 (20px), color rgba(0,0,0,0.6) -->
            <v-card-subtitle class="text-body-2 experience-card__subheader">
              {{ experience.dateFrom }} - {{ experience.dateUntil || 'Present' }}
            </v-card-subtitle>
          </v-card-item>
          <v-card-text>
            <div
              v-for="(skillSet, setIndex) in experience.skills"
              :key="setIndex"
            >
              <div
                v-for="(skillList, key) in skillSet"
                :key="key"
                class="experience-card__skill-row"
              >
                <div class="d-flex flex-wrap align-center experience-card__skills">
                  <p class="text-body-1">
                    {{ key }}:
                  </p>
                  <!-- MUI Chip size="small" (default colour): bg rgba(0,0,0,0.08), text rgba(0,0,0,0.87), 15px -->
                  <v-chip
                    v-for="skill in skillList"
                    :key="skill"
                    size="small"
                    variant="flat"
                    color="rgba(0, 0, 0, 0.08)"
                    class="mui-chip experience-card__chip"
                  >
                    {{ skill }}
                  </v-chip>
                </div>
              </div>
            </div>
          </v-card-text>
          <v-card-text v-if="experience.description">
            <p class="text-body-2">
              What I did?
            </p>
            <p class="text-body-1 mui-paragraph">
              {{ experience.description }}
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped lang="scss">
.experience-card__subheader {
  color: rgba(0, 0, 0, 0.6);
  opacity: 1;
}

.experience-card__skill-row {
  margin: 5px 0px;
}

.experience-card__skills {
  gap: 5px;
}

.experience-card__chip {
  color: rgba(0, 0, 0, 0.87) !important;
}
</style>
