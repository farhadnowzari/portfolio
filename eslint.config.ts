import js from '@eslint/js';
import globals from 'globals';
import pluginVue from 'eslint-plugin-vue';
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript';

export default defineConfigWithVueTs(
  { ignores: ['dist', 'node_modules'] },
  {
    files: ['**/*.{ts,mts,vue}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
  {
    // Build/tooling scripts run under Node, not the browser (scripts/inline-critical-css.mjs).
    files: ['scripts/**/*.{js,mjs,cjs}', 'playwright.config.ts'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.node,
    },
  },
  js.configs.recommended,
  pluginVue.configs['flat/recommended'],
  vueTsConfigs.recommended,
  {
    rules: {
      // Single-word, intentional per tech-spec's file tree (Glyph.vue, Cursor.vue, icons/Icon.vue).
      'vue/multi-word-component-names': ['error', { ignores: ['Glyph', 'Cursor', 'Icon'] }],
    },
  },
);
