// Ported 1:1 from react/src/components/SkillsComponent.tsx (lines 5-102).
// Ruling 9: content is as-is, including casing/typos. No framework imports.

export interface Skill {
  title: string;
  /** Star rating 0-5, rendered read-only. */
  value: number;
}

export interface SkillGroup {
  title: string;
  skills: Skill[];
}

export const backendTechnologies: Skill[] = [
  { title: "C#", value: 4 },
  { title: "Go", value: 3 },
  { title: "nodejs (ts/js)", value: 3 },
  { title: "Node-RED", value: 3 },
  { title: "n8n", value: 3 },
  { title: "PHP", value: 2 },
];

export const frontendTechnologies: Skill[] = [
  { title: "vuejs (ts/js)", value: 5 },
  { title: "react (ts/js)", value: 3 },
  { title: "single-spa", value: 3 },
  { title: "scss", value: 3 },
];

export const patternsAndPractices: Skill[] = [
  { title: "Microservices", value: 5 },
  { title: "Microfrontends", value: 4 },
  { title: "CQRS", value: 4 },
  { title: "DDD", value: 4 },
];

export const databasesAndStreamingPlatforms: Skill[] = [
  { title: "Neo4j", value: 4 },
  { title: "Elasticsearch", value: 3 },
  { title: "PostgreSQL", value: 3 },
  { title: "MySQL", value: 3 },
  { title: "Redis", value: 3 },
];

export const devOpsAndServerTechnologies: Skill[] = [
  { title: "Kubernetes", value: 4 },
  { title: "Helm charts", value: 3 },
  { title: "Gitlab CI/CD", value: 3 },
  { title: "Github Actions", value: 2 },
  { title: "Flux", value: 4 },
  { title: "Datadog", value: 3 },
];

export const eventsAndStreams: Skill[] = [
  { title: "Kafka", value: 3 },
  { title: "Mosquitto (mqtt)", value: 4 },
];

export const testing: Skill[] = [
  { title: "TDD", value: 5 },
];

export const languages: Skill[] = [
  { title: "Persian (Native)", value: 5 },
  { title: "English", value: 4 },
  { title: "German (Intermediate - B1)", value: 3 },
];

/** Render order is significant (masonry / grid order). */
export const skills: SkillGroup[] = [
  { title: "Backend Technologies", skills: backendTechnologies },
  { title: "Frontend Technologies", skills: frontendTechnologies },
  { title: "Architecture", skills: patternsAndPractices },
  { title: "SRE", skills: devOpsAndServerTechnologies },
  { title: "Databases", skills: databasesAndStreamingPlatforms },
  { title: "Events and Streams", skills: eventsAndStreams },
  { title: "Test", skills: testing },
  { title: "Languages", skills: languages },
];
