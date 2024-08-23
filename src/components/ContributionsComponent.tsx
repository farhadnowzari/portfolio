import ContributionCardComponent from "./ContributionCardComponent";
import PropsBase from "./PropsBase";
import { Typography } from "@mui/material";
import { Masonry } from "@mui/lab";
const ContributionsComponent = (props: PropsBase) => {
  return (
    <div style={props.style} className="container position-sticky">
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
          image="https://i9.ytimg.com/vi/4yIIqQczAXY/mqdefault.jpg?v=64bda354&sqp=CPyRorYG&rs=AOn4CLBa7-MLXMwUBE5v5G8l_1HrEFQd1g"
          type="youtube"
          title="Install gitlab on kubernetes"
          description="Gitlab installation on bare metal kubernetes tutorial"
        />
        <ContributionCardComponent
          link="https://youtu.be/-BT_6iurYOs"
          image="https://i9.ytimg.com/vi_webp/-BT_6iurYOs/mqdefault.webp?v=63b6348d&sqp=CNSWorYG&rs=AOn4CLA8svs-Eyj7ZwOrr2m18f1lG5W4Yw"
          type="youtube"
          title="Microfrontends"
          description="Checking out single-spa with vue and react"
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
