import { Typography, Card, Grid, Rating, CardHeader, CardContent, useTheme, useMediaQuery } from "@mui/material";
import { Masonry } from "@mui/lab";
import PropsBase from "./PropsBase";

class Skill {
  title: string;
  value: number;
  constructor(title: string, value: number) {
    this.title = title;
    this.value = value;
  }
}

const backendTechnologies = [
  new Skill("C#", 4),
  new Skill("Go", 3),
  new Skill("nodejs (ts/js)", 3),
  new Skill("Node-RED", 3),
  new Skill("n8n", 3),
  new Skill("PHP", 2),
];

const frontendTechnologies = [
  new Skill("vuejs (ts/js)", 5),
  new Skill("react (ts/js)", 3),
  new Skill("single-spa", 3),
  new Skill("scss", 3),
];

const patternsAndPractices = [
  new Skill("Microservices", 5),
  new Skill("Microfrontends", 4),
  new Skill("CQRS", 4),
  new Skill("DDD", 4),
];

const databasesAndStreamingPlatforms = [
  new Skill("Neo4j", 4),
  new Skill("Elasticsearch", 3),
  new Skill("PostgreSQL", 3),
  new Skill("MySQL", 3),
  new Skill("Redis", 3),
];

const devOpsAndServerTechnologies = [
  new Skill("Kubernetes", 4),
  new Skill("Helm charts", 3),
  new Skill("Gitlab CI/CD", 3),
  new Skill("Github Actions", 2),
  new Skill("Flux", 4),
  new Skill("Datadog", 3),
];

const eventsAndStreams = [
  new Skill("Kafka", 3),
  new Skill("Mosquitto (mqtt)", 4),
];

const testing = [
  new Skill("TDD", 5),
];

const languages = [
  new Skill("Persian (Native)", 5),
  new Skill("English", 4),
  new Skill("German (Intermediate - B1)", 3),
];

const skills = [
  {
    title: "Backend Technologies",
    skills: backendTechnologies,
  },
  {
    title: "Frontend Technologies",
    skills: frontendTechnologies,
  },
  {
    title: "Architecture",
    skills: patternsAndPractices,
  },
  {
    title: "SRE",
    skills: devOpsAndServerTechnologies,
  },
  {
    title: "Databases",
    skills: databasesAndStreamingPlatforms,
  },
  {
    title: "Events and Streams",
    skills: eventsAndStreams,
  },
  {
    title: "Test",
    skills: testing,
  },
  {
    title: "Languages",
    skills: languages,
  },
];

const SkillsComponent = (props: PropsBase) => {
  const theme = useTheme();
  const isSmallerScreen = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <div id="skills" style={props.style} className="container">
      <Typography variant="h2">Skills</Typography>
      <br />
      <Masonry columns={ isSmallerScreen ? 1 : 2 } spacing={2}>
        {skills.map((skillGroup, index) => {
          return (
            <Card key={index}>
              <CardHeader title={skillGroup.title}></CardHeader>
              <CardContent>
                {skillGroup.skills.map((skill, index) => {
                  return (
                    <Grid container spacing={2} key={index}>
                      <Grid item xs={6}>
                        <Typography style={{ fontSize: "15px" }}>{skill.title}</Typography>
                      </Grid>
                      <Grid item xs={6} textAlign="right">
                        <Rating
                          style={{ fontSize: "20px" }}
                          readOnly
                          value={skill.value}
                        ></Rating>
                      </Grid>
                    </Grid>
                  );
                })}
              </CardContent>
            </Card>
          );
        })}
      </Masonry>
    </div>
  );
};

export default SkillsComponent;
