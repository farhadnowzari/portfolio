<script setup lang="ts">
import { ref } from 'vue';
import { useDisplay } from 'vuetify';
import StickyInformation from './components/StickyInformation.vue';
import FarhadComponent from './components/FarhadComponent.vue';
import SkillsComponent from './components/SkillsComponent.vue';
import ContributionsComponent from './components/ContributionsComponent.vue';
import ExperiencesComponent from './components/ExperiencesComponent.vue';
import AboutMeComponent from './components/AboutMeComponent.vue';

// MUI breakpoints.down("lg") → Vuetify mdAndDown (< 1280).
const { mdAndDown: isSmallScreen } = useDisplay();
const value = ref(0);

const sectionStyle = { background: '#E8E6DC', minHeight: 'calc(100vh - 80px)' };

const navItems = [
  { label: 'Home', href: '#', icon: 'mdi-home-outline' },
  { label: 'Skills', href: '#skills', icon: 'mdi-hammer-wrench' },
  { label: 'Contributions', href: '#contributions', icon: 'mdi-hand-heart-outline' },
  { label: 'Experiences', href: '#experiences', icon: 'mdi-briefcase-clock-outline' },
  { label: 'About', href: '#about-me', icon: 'mdi-information-outline' },
];
</script>

<template>
  <v-app>
    <div class="d-flex">
      <div
        v-if="!isSmallScreen"
        class="position-fixed vh-100"
        :style="{ background: '#101B3E', maxWidth: '40%' }"
      >
        <StickyInformation />
      </div>
      <div :style="{ marginInlineStart: isSmallScreen ? '0' : '40%' }">
        <FarhadComponent />
        <SkillsComponent :style="sectionStyle" />
        <ContributionsComponent :style="sectionStyle" />
        <ExperiencesComponent :style="sectionStyle" />
        <AboutMeComponent :style="sectionStyle" />
      </div>
    </div>
    <!--
      MUI BottomNavigation: 56px content + padding 10px 5px = 76px, bottom -5px. Vuetify's layout
      system writes position/bottom/height inline, so height goes through the prop and the offset
      through an inline style; the padding is applied to the inner .v-bottom-navigation__content.
    -->
    <v-bottom-navigation
      v-if="isSmallScreen"
      v-model="value"
      class="portfolio-bottom-nav"
      :height="76"
      style="bottom: -5px"
    >
      <v-btn
        v-for="item in navItems"
        :key="item.href"
        :href="item.href"
      >
        <v-icon :icon="item.icon" />
        <span>{{ item.label }}</span>
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>

<style scoped lang="scss">
.portfolio-bottom-nav {
  // MUI BottomNavigation sx padding "10px 5px" (root bottom/height are Vuetify props above).
  :deep(.v-bottom-navigation__content) {
    padding: 10px 5px;
  }

  // MUI BottomNavigationAction labels: 12px unselected / 14px selected, × 20/14 base scaling.
  // All labels stay visible (ruling 15); only the size is reproduced.
  :deep(.v-btn) {
    font-size: 17px;
  }

  :deep(.v-btn--selected) {
    font-size: 20px;
  }
}
</style>
