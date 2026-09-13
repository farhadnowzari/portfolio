// Ported 1:1 from react/src/components/ContributionsComponent.tsx (lines 15-49)
// and the props interface in ContributionCardComponent.tsx (lines 13-20).
// Ruling 9: content is as-is. No framework imports.
//
// `image` for the YouTube entry was `import GitlabOnKubernetesThumbnail from
// '../assets/gitlab_on_kubernetes.png'` in React. Kept as a Vite asset import so
// the bundler hashes it; the Vue side must copy the PNG to the same relative path
// (src/assets/gitlab_on_kubernetes.png) or adjust the import.
import GitlabOnKubernetesThumbnail from "../assets/gitlab_on_kubernetes.png";

export type ContributionType = "github" | "youtube" | "medium";

export interface Contribution {
  title: string;
  description: string;
  /** Optional card media. Either a bundled asset URL or an absolute remote URL. */
  image?: string;
  /** Opens in a new tab (target="_blank"). */
  link: string;
  type: ContributionType;
  /** Chip labels shown in the card footer; footer is omitted entirely when undefined. */
  meta?: string[];
}

/** Render order is significant (masonry / grid order). */
export const contributions: Contribution[] = [
  {
    link: "https://github.com/berrybeat/Neo4j.Berries.OGM",
    type: "github",
    title: "Neo4j.Berries.OGM",
    description: "An object-graph-mapper for neo4j written in C# and dotnet 8",
    meta: ["C#", "Neo4j"],
  },
  {
    link: "https://github.com/farhadnowzari/easy-ts-camera/tree/dev",
    type: "github",
    title: "easy-ts-camera",
    description:
      "A typescript based wrapper for native mediaDevices to simplify using the camera",
    meta: ["typescript"],
  },
  {
    link: "https://github.com/farhadnowzari/easy-vue-camera",
    type: "github",
    title: "easy-vue-camera",
    description: "A vue component to expose the camera if exists",
    meta: ["vue", "javascript"],
  },
  {
    link: "https://www.youtube.com/watch?v=4yIIqQczAXY",
    image: GitlabOnKubernetesThumbnail,
    type: "youtube",
    title: "Install gitlab on kubernetes",
    description: "Gitlab installation on bare metal kubernetes tutorial",
  },
  {
    link: "https://medium.com/c-sharp-progarmming/how-to-have-more-fun-with-unittests-in-dotnet-core-365f7a02f8a1",
    image:
      "https://miro.medium.com/v2/resize:fit:720/format:webp/0*RakztQFcIIjuZ2nt",
    type: "medium",
    title: "Have fun with unit tests!",
    description: "Gamify unit testing concept with TDD",
  },
];
