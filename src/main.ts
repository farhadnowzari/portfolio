import { createApp } from 'vue'
import { router } from './router'
import './styles/reset.scss'
import './styles/fonts.scss'
import './styles/tokens.scss'
import './styles/type.scss'
import './styles/utilities.scss'
import './styles/shell.scss'
import './styles/deck.scss'
import App from './App.vue'

createApp(App).use(router).mount('#app')

// R103: index.html's deep-link guard adds `html.deep` (`.deep .home { display: none }`) so a cold
// non-home hash never flashes the static card. Its job ends the moment the app mounts: `mount`
// replaced the static markup, and from here on `.home` is HomeView's — which the same rule hid
// whenever a session that started on `#/story/…` navigated back to `/` (blank page, only the bar).
document.documentElement.classList.remove('deep')
