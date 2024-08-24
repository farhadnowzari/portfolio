import ContributionCardComponent from "./ContributionCardComponent";
import GitlabOnKubernetesThumbnail from '../assets/gitlab_on_kubernetes.png';

import PropsBase from "./PropsBase";
import { Typography } from "@mui/material";
import { Masonry } from "@mui/lab";
const ContributionsComponent = (props: PropsBase) => {
  return (
    <div id="contributions" style={props.style} className="container">
      <Typography variant="h2">Contributions</Typography>
      <br />
      <Masonry columns={2} spacing={2}>
        <ContributionCardComponent
          link="https://github.com/berrybeat/Neo4j.Berries.OGM"
          type="github"
          title="Neo4j.Berries.OGM"
          description="An object-graph-mapper for neo4j written in C# and dotnet 8"
          meta={["C#", "Neo4j"]}
        />
        <ContributionCardComponent
          link="https://github.com/farhadnowzari/easy-ts-camera/tree/dev"
          type="github"
          title="easy-ts-camera"
          description="A typescript based wrapper for native mediaDevices to simplify using the camera"
          meta={["typescript"]}
        />
        <ContributionCardComponent
          link="https://github.com/farhadnowzari/easy-vue-camera"
          type="github"
          title="easy-vue-camera"
          description="A vue component to expose the camera if exists"
          meta={["vue", "javascript"]}
        />
        <ContributionCardComponent
          link="https://www.youtube.com/watch?v=4yIIqQczAXY"
          image={GitlabOnKubernetesThumbnail}
          type="youtube"
          title="Install gitlab on kubernetes"
          description="Gitlab installation on bare metal kubernetes tutorial"
        />
        <ContributionCardComponent
          link="https://medium.com/c-sharp-progarmming/how-to-have-more-fun-with-unittests-in-dotnet-core-365f7a02f8a1"
          image="https://miro.medium.com/v2/resize:fit:720/format:webp/0*RakztQFcIIjuZ2nt"
          type="medium"
          title="Have fun with unit tests!"
          description="Gamify unit testing concept with TDD"
        />
      </Masonry>
    </div>
  );
};

export default ContributionsComponent;
