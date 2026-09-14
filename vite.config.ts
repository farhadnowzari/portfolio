/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    // fit.spec.ts / a11y.spec.ts / deck.spec.ts / links.spec.ts are Playwright suites (playwright.config.ts), not vitest —
    // excluded here so `yarn test` (vitest) doesn't try to run them under jsdom.
    include: ['tests/**/*.spec.ts'],
    exclude: ['tests/fit.spec.ts', 'tests/a11y.spec.ts', 'tests/deck.spec.ts', 'tests/links.spec.ts', '**/node_modules/**'],
  },
});
