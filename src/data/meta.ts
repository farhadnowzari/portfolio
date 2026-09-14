// meta.ts — `<head>` copy for index.html. Written fresh in the site's voice (tech review PB14).
// No Twitter/X tags (ruling 51). Description ≤ 155 chars.
// Copied from content/meta.ts unchanged.

export interface Meta {
  /** `<title>` */
  title: string
  /** `<meta name="description">` — ≤ 155 chars. */
  description: string
  og: {
    title: string
    description: string
    type: 'website'
    siteName: string
  }
}

export const meta: Meta = {
  title: 'Farhad Nowzari · Senior Backend / Full-Stack Engineer',
  description:
    'Senior Backend / Full-Stack Engineer at Kaufland e-commerce. I build systems that survive traffic and pen tests. Go · NestJS · C# · Kafka · Kubernetes.',
  og: {
    title: 'Farhad Nowzari · Senior Backend / Full-Stack Engineer',
    description: 'I build systems that survive traffic and pen tests. How I got here. It started with a radio.',
    type: 'website',
    siteName: 'Farhad Nowzari',
  },
}
