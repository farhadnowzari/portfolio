// story/together.ts — Ch 8 "Push the limits together", the panel's content (R91: one chunk per panel, fetched when the
// panel is about to be shown). Strings verbatim from plot v4 §2; the index row (id, title, callout, meta,
// nextLabel) stays in ../story.ts so Home / the rail never load a body.
import type { PartContent } from '../story'

export default {
  body:
    'I think best out loud. So I record it. 47 videos, 126k views: bare-metal Kubernetes, GitLab runners, Flux, Keycloak, micro-frontends. An OGM with 41 stars. Camera libraries with 21k downloads a year. Not for a job. Because someone, somewhere, is stuck where I was stuck.',
  stack: ['Kubernetes', 'GitLab', 'Flux', 'Keycloak', 'Micro-frontends'],
  links: [
    { label: 'Enjoy being a Devops with Flux CI/CD', source: 'YouTube', to: { link: 'fluxVideo' } },
    { label: 'How to install Gitlab on Kubernetes? here is how!', source: 'YouTube', to: { link: 'gitlabVideo' } },
    { label: 'easy-vue-camera', source: 'GitHub', to: { link: 'cameraRepo' } },
    { label: 'The whole channel', source: 'YouTube', to: { link: 'channel' } },
    { label: 'All repos', source: 'GitHub', to: { link: 'github' } },
    { label: 'Everything I share', source: '/community', to: { route: 'community' } },
  ],
} satisfies PartContent
