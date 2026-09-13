<script setup lang="ts">
// Port of react/src/components/FarhadComponent.tsx — hero (id="home").
// ≥lg: full-height cover photo. <lg: intro card in the `stickyInformation` theme (text #A2A096, body1 25px).
import { useDisplay } from 'vuetify';
import farhadImage from '../assets/Farhad.png';

const imageAlt = 'Farhad Nowzari, FullStack Developer. Stuttgart Germany';

// MUI breakpoints.down("lg") → < 1280 (mdAndDown); breakpoints.down("md") → < 960 (smAndDown).
const { mdAndDown: isSmallScreen, smAndDown: isSmallerScreen } = useDisplay();

const socialLinks = [
  { href: 'https://www.linkedin.com/in/farhad-nowzari-94060699/', tooltip: 'LinkedIn', icon: 'mdi-linkedin' },
  { href: 'https://github.com/farhadnowzari', tooltip: 'Github', icon: 'mdi-github' },
  { href: 'https://www.youtube.com/@nowzarifarhad', tooltip: 'Youtube', icon: 'mdi-youtube' },
];
</script>

<template>
  <div>
    <div
      v-if="!isSmallScreen"
      id="home"
      class="hero-cover"
    >
      <img
        :alt="imageAlt"
        :src="farhadImage"
        class="hero-cover__image"
      >
    </div>
    <!-- with-background: renders the themed wrapper (see StickyInformation.vue); text = on-background #A2A096 -->
    <v-theme-provider
      v-else
      theme="stickyInformation"
      with-background
    >
      <div class="hero-intro d-flex align-center justify-center">
        <div class="hero-intro__body d-flex flex-wrap align-start justify-center">
          <div class="d-flex flex-column">
            <v-avatar size="256">
              <v-img
                :src="farhadImage"
                :alt="imageAlt"
                cover
              />
            </v-avatar>
            <div class="hero-intro__social d-flex justify-center align-center">
              <a
                v-for="link in socialLinks"
                :key="link.href"
                :href="link.href"
                target="_blank"
                class="mui-link"
              >
                <v-icon
                  :icon="link.icon"
                  size="25"
                />
                <v-tooltip
                  activator="parent"
                  location="bottom"
                  :text="link.tooltip"
                />
              </a>
            </div>
          </div>
          <div
            class="hero-intro__text d-flex flex-column flex-wrap"
            :class="{ 'align-center': isSmallerScreen }"
          >
            <p class="text-body-1">
              My name is
            </p>
            <h1
              class="text-h1"
              :class="{ 'hero-intro__name--small': isSmallerScreen }"
            >
              Farhad Nowzari
            </h1>
            <p
              class="text-body-1 hero-intro__description"
              :class="{ 'text-center': isSmallerScreen }"
            >
              I am an enthusiastic full stack developer with some software architecture background. I am a team player and a boost of energy when added to any teams!
            </p>
            <v-btn
              variant="outlined"
              color="primary"
              href="/assets/Farhad Nowzari CV - 2026.pdf"
              target="_blank"
              download="CV - Farhad Nowzari.pdf"
              class="mui-outlined-button hero-intro__cv"
            >
              <v-icon
                icon="mdi-download-outline"
                size="24"
              /> Download My CV
            </v-btn>
          </div>
        </div>
      </div>
    </v-theme-provider>
  </div>
</template>

<style scoped lang="scss">
.hero-cover {
  height: 100vh;
  overflow: hidden;
}

.hero-cover__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-intro {
  min-height: 100vh;
  background: #101B3E;
}

.hero-intro__body {
  padding: 5%;
  box-sizing: border-box;
  gap: 20px;
}

.hero-intro__social {
  gap: 15px;
  margin-top: 10px;
}

.hero-intro__text {
  white-space: wrap; // ⚠ as-is from React (`whiteSpace="wrap"`), no effect
}

.hero-intro__name--small {
  font-size: 40px !important; // MUI fontSize={isSmallerScreen ? "40px" : "60px"}
}

.hero-intro__description {
  margin-top: 10px;
  max-width: 500px;
}

.hero-intro__cv {
  margin-top: 20px;
}
</style>
