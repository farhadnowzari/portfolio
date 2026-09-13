<script setup lang="ts">
// Port of react/src/components/PortfolioBarComponent.tsx — burger menu inside the desktop sidebar.
import burger from '../assets/burger.svg';

const menuItems = [
  { label: 'Home', href: '#', icon: 'mdi-home-outline' },
  { label: 'Skills', href: '#skills', icon: 'mdi-hammer-wrench' },
  { label: 'Contributions', href: '#contributions', icon: 'mdi-hand-heart-outline' },
  { label: 'Experiences', href: '#experiences', icon: 'mdi-briefcase-clock-outline' },
  { label: 'About Me', href: '#about-me', icon: 'mdi-information-outline' },
];
</script>

<template>
  <!-- MUI <Toolbar disableGutters>: flex, align-items center, min-height 64px, no horizontal padding -->
  <div class="portfolio-toolbar">
    <div class="d-flex align-center portfolio-toolbar__actions">
      <v-menu
        id="portfolio-menu"
        transition="scale-transition"
        location="bottom start"
      >
        <template #activator="{ props: activatorProps }">
          <v-btn
            id="portfolio-menu-button"
            v-bind="activatorProps"
            icon
            variant="text"
            color="primary"
            size="60"
            class="portfolio-menu-button"
            aria-controls="portfolio-menu"
            aria-haspopup="true"
          >
            <img
              :src="burger"
              width="50"
              alt="Farhad Nowzari burger menu"
            >
          </v-btn>
        </template>
        <v-list
          class="portfolio-menu-list"
          aria-labelledby="portfolio-menu-button"
        >
          <v-list-item
            v-for="item in menuItems"
            :key="item.href"
            :href="item.href"
            class="portfolio-menu-item"
          >
            <div class="d-flex align-center portfolio-menu-item__content">
              <v-icon
                :icon="item.icon"
                size="30"
              />
              {{ item.label }}
            </div>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </div>
</template>

<style scoped lang="scss">
.portfolio-toolbar {
  display: flex;
  align-items: center;
  min-height: 64px;
}

.portfolio-toolbar__actions {
  gap: 5px;
}

// MUI IconButton size="small": padding 5px, border-radius 50%; 50px img → 60px square.
.portfolio-menu-button {
  padding: 5px;
}

// MUI Menu paper: elevation 8, radius 4px, list padding 8px 0.
.portfolio-menu-list {
  padding: 8px 0;
  border-radius: 4px;
}

// MuiMenuItem styleOverrides: color #101B3E, gap 10px, font-size 20px, min-width 250px;
// MUI defaults: padding 6px 16px, min-height 48px.
.portfolio-menu-item {
  color: #101B3E;
  font-size: 20px;
  min-width: 250px;
  min-height: 48px;
  padding: 6px 16px;
}

.portfolio-menu-item__content {
  gap: 10px;
}
</style>
