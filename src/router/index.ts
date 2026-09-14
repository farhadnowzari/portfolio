// router/index.ts — hash history, 5 routes, 4 lazy chunks, scrollBehavior (tech-spec §3, §4; R68 adds /skills).
import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import { meta } from '../data/meta'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
    meta: { title: meta.title },
  },
  {
    path: '/story/:part?',
    name: 'story',
    component: () => import('../views/StoryView.vue'),
    meta: { title: `Story · ${meta.og.siteName}` },
  },
  {
    path: '/work/:section?',
    name: 'work',
    component: () => import('../views/WorkView.vue'),
    meta: { title: `Work · ${meta.og.siteName}` },
  },
  {
    path: '/skills',
    name: 'skills',
    component: () => import('../views/SkillsView.vue'),
    meta: { title: `Skills · ${meta.og.siteName}` },
  },
  {
    path: '/community',
    name: 'community',
    component: () => import('../views/CommunityView.vue'),
    meta: { title: `Community · ${meta.og.siteName}` },
  },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, _from, savedPosition) {
    // The scroll-sync IO on /story and /work (mobile) replaces the route with `state.fromScroll` on
    // every panel change — never fight that scroll with the router's own.
    if (to.fullPath === _from.fullPath) return false
    // `fromScroll` only guards the navigation that set it; a popstate (savedPosition present) back
    // onto such an entry must still land on its panel.
    if (window.history.state?.fromScroll && !savedPosition) return false
    const id = (to.params.part ?? to.params.section) as string | undefined
    if ((to.name === 'story' || to.name === 'work') && id) {
      // Desktop (design v8 §1): the deck owns the panel and the page never scrolls; nothing to do.
      if (window.matchMedia('(min-width: 769px)').matches) return false
      // Mobile (R123, plain document scroll): land on the panel; `top` = sticky chrome above it
      // (topbar 48 + the 40px PART header on /story) = the panel's `scroll-margin-top`. R91: the
      // panels are lazy chunks, so the panel may not exist yet when this runs; wait for it (≤ 3 s).
      const position = { el: `#${id}`, top: to.name === 'story' ? 88 : 48 }
      return new Promise((resolve) => {
        const deadline = performance.now() + 3000
        const poll = () => {
          if (document.querySelector(position.el) || performance.now() > deadline) resolve(position)
          else requestAnimationFrame(poll)
        }
        poll()
      })
    }
    if (savedPosition) return savedPosition
    return { top: 0 }
  },
})

router.afterEach((to) => {
  document.title = (to.meta.title as string | undefined) ?? meta.title
})
