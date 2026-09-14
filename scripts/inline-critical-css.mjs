// inline-critical-css.mjs — tech-spec §5: "inline the critical CSS (shell + card, ≤ 8 KB gz
// estimate) directly in <head> instead of a <link rel="stylesheet">... a render-blocking external
// stylesheet is a real, avoidable round trip before LCP."
//
// The only render-blocking `<link rel="stylesheet">` Vite emits into dist/index.html is the main
// entry chunk — tokens/reset/fonts/type/utilities/shell (everything main.ts imports directly).
// Route-specific styles (StoryView/WorkView/CommunityView/ExplodedRadio's scoped CSS) are already
// separate, code-split, non-blocking chunks that load alongside their lazy JS — nothing further to
// split out here, so "inline the critical part" is exactly "inline this one file, drop the link".
//
// Runs after `vite build` (see package.json's `build` script) — dist/ already has final,
// content-hashed filenames at this point, which is why this is a postbuild step and not a Vite
// plugin hook: transformIndexHtml runs before asset filenames/URLs are final for a build this small
// to bother with the bundle-inspection API.
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

const distDir = resolve(process.cwd(), 'dist')
const htmlPath = resolve(distDir, 'index.html')

const html = readFileSync(htmlPath, 'utf-8')

const linkRe = /<link rel="stylesheet" crossorigin href="(\/assets\/[^"]+\.css)">/
const match = html.match(linkRe)

if (!match) {
  console.warn('[inline-critical-css] no <link rel="stylesheet"> found in dist/index.html — nothing to inline (already inlined, or the build shape changed).')
  process.exit(0)
}

const cssPath = resolve(distDir, match[1].replace(/^\//, ''))
if (!existsSync(cssPath)) {
  console.error(`[inline-critical-css] index.html references ${match[1]} but the file doesn't exist in dist/.`)
  process.exit(1)
}

const css = readFileSync(cssPath, 'utf-8')
const inlined = html.replace(linkRe, `<style>${css}</style>`)
writeFileSync(htmlPath, inlined)

const kb = (css.length / 1024).toFixed(2)
console.log(`[inline-critical-css] inlined ${match[1]} (${kb} KB) into dist/index.html; render-blocking <link> removed.`)
