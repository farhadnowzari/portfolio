<script setup lang="ts">
// Port of react/src/components/StickyInformation.tsx — desktop sidebar content (≥lg only).
// Wrapped in the `stickyInformation` theme: all text #A2A096, body1 = 25px (see app.scss).
import PortfolioBarComponent from './PortfolioBarComponent.vue';

const socialLinks = [
  { href: 'https://www.linkedin.com/in/farhad-nowzari-94060699/', tooltip: 'LinkedIn', icon: 'mdi-linkedin' },
  { href: 'https://github.com/farhadnowzari', tooltip: 'Github', icon: 'mdi-github' },
  { href: 'https://www.youtube.com/@nowzarifarhad', tooltip: 'Youtube', icon: 'mdi-youtube' },
];
</script>

<template>
  <!--
    with-background is required: without it VThemeProvider renders no element, so the theme class
    only lands on child Vuetify components and plain <p>/<h1> inherit the portfolio theme's navy.
    With it the wrapper paints background (#101B3E) + on-background (#A2A096) from the theme.
  -->
  <v-theme-provider
    theme="stickyInformation"
    with-background
    class="h-100"
  >
    <div class="sticky-information d-flex flex-column">
      <PortfolioBarComponent />
      <p class="text-body-1 mt-auto">
        My name is
      </p>
      <h1 class="text-h1 sticky-information__name">
        Farhad Nowzari
      </h1>
      <p class="text-body-1 sticky-information__intro">
        I’m an enthusiastic full-stack developer with a strong foundation in software architecture. I thrive in team environments and bring a positive, energetic boost to any group I’m a part of!
      </p>
      <span class="sticky-information__cv">
        <!-- ⚠ as-is (ruling 9): this href does not exist in public/assets (404). -->
        <v-btn
          variant="outlined"
          color="primary"
          href="/assets/CV - Farhad Nowzari.pdf"
          target="_blank"
          download="CV - Farhad Nowzari.pdf"
          class="mui-outlined-button"
        >
          <v-icon
            icon="mdi-download-outline"
            size="24"
          /> Download my CV
        </v-btn>
      </span>
      <div class="mt-auto">
        <p class="text-body-1">
          You can find me on:
        </p>
        <div class="d-flex sticky-information__social">
          <a
            v-for="link in socialLinks"
            :key="link.href"
            :href="link.href"
            target="_blank"
            class="mui-link"
          >
            <v-icon
              :icon="link.icon"
              size="24"
            />
            <v-tooltip
              activator="parent"
              location="bottom"
              :text="link.tooltip"
            />
          </a>
        </div>
      </div>
    </div>
  </v-theme-provider>
</template>

<style scoped lang="scss">
.sticky-information {
  height: 100%;
  padding: 5%;
  box-sizing: border-box;
}

.sticky-information__name {
  margin: 0;
  padding: 0;
}

.sticky-information__intro {
  margin-top: 30px;
}

.sticky-information__cv {
  margin-top: 20px;
}

.sticky-information__social {
  gap: 15px;
}
</style>
