<script setup lang="ts">
import TopBar from './components/TopBar.vue'
import BottomBar from './components/BottomBar.vue'
</script>

<template>
  <a
    class="skip-link"
    href="#main"
  >Skip to content</a>
  <TopBar />
  <main
    id="main"
    tabindex="-1"
  >
    <RouterView />
  </main>
  <BottomBar />
</template>
