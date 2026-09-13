// Ported 1:1 from react/src/components/ExperiencesComponent.tsx (lines 12-119).
// Ruling 9: content is as-is. No framework imports.
//
// Shape note: `skills` is an ARRAY of single-key records, e.g. [{ Backend: [...] }, { Frontend: [...] }].
// React iterates skills[] then Object.keys(record) for each. Preserve this shape and order.

export interface Experience {
  title: string;
  dateFrom: string;
  /** When undefined, UI renders "Present". */
  dateUntil?: string;
  /** When undefined, the "What I did?" CardContent block is omitted. */
  description?: string;
  skills: Record<string, string[]>[];
}

/** Render order is significant (newest first). */
export const experiences: Experience[] = [
  {
    title: "Senior FullStack Engineer - Kaufland e-commerce, Remote, Germany",
    dateFrom: "March 2025",
    description:
      "I lead complex initiatives that require strong technical judgment and cross-team communication skills. I support my team across both frontend and backend development tasks, and I am responsible for driving design and architectural decisions within our team.",
    skills: [
      {
        Backend: ["Go", "nodejs", "PHP", "MySQL", "Redis", "Kafka"],
      },
      {
        Frontend: ["vue@2", "vue@3", "single-spa", "typescript", "scss"],
      },
      {
        Others: [
          "Kubernetes",
          "Helm",
          "GitLab CI/CD",
          "Google Cloud",
          "Claude Code",
        ],
      },
    ],
  },
  {
    title:
      "Senior FullStack Engineer - gis-consulting GmbH, Hybrid, Trossingen, Germany",
    dateFrom: "June 2020",
    dateUntil: "February 2025",
    description:
      "This is where I grew the most as a developer and team lead. I led the migration of a monolithic application to microservices, overseeing the architecture, development, and deployment of the new services, as well as managing the CI/CD pipeline and Kubernetes deployment. I was also responsible for the development of the new frontend and mentored my teammates throughout the process.",
    skills: [
      {
        Backend: [
          "C# (dotnet)",
          "nodejs",
          "GraphQL",
          "neo4j",
          "PostgreSQL",
          "SQL Server",
          "Elasticsearch",
          "Redis",
          "xUnit Tests",
          "Kafka",
        ],
      },
      {
        Frontend: ["vue@2", "vue@3", "single-spa", "typescript", "scss"],
      },
      {
        Others: [
          "Kubernetes",
          "Helm",
          "GitLab CI/CD",
          "Azure",
          "Open-Telekom-Cloud",
          "On-Premise Kubernetes instances",
        ],
      },
    ],
  },
  {
    title:
      "Web Developer - NavaTec GmbH, Remote Iran / On-Site Heilbronn, Germany",
    dateFrom: "August 2016",
    dateUntil: "May 2020",
    description:
      "Here is where I started the journey of working with an international team. I was responsible for the development of a new SaaS, from the backend to the frontend, and the deployment of the application to the cloud.",
    skills: [
      {
        Backend: [
          "C# (ASP.NET MVC)",
          "PHP (Laravel)",
          "MySQL",
          "PostgreSQL",
          "Elasticsearch",
        ],
      },
      {
        Frontend: ["jQuery", "bootstrap", "vue@2"],
      },
    ],
  },
  {
    title: "FullStack Developer - Freelancer, Iran",
    dateFrom: "August 2012",
    dateUntil: "September 2016",
    description:
      "During university, I started taking projects as a freelancer to learn by doing. I worked across a wide range of technologies and eventually found my path in web development.",
    skills: [
      {
        Focus: [
          "Freelance client projects",
          "Full-stack delivery",
          "Web development",
        ],
      },
    ],
  },
];
