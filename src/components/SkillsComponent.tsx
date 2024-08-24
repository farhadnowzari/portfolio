import { Typography, Card, Grid, Rating, CardHeader, CardContent } from "@mui/material";
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
  new Skill("C# (dotnet)", 5),
  new Skill("nodejs (ts/js)", 3),
  new Skill("Node-RED", 3),
  new Skill("Camunda (BPMN engine)", 3),
  new Skill("PHP (Laravel)", 3),
];

const frontendTechnologies = [
  new Skill("vuejs (ts/js)", 5),
  new Skill("vuetify (ts/js)", 5),
  new Skill("Quasar (ts/js)", 4),
  new Skill("react (ts/js)", 3),
  new Skill("SCSS (ts/js)", 3),
];

const patternsAndPractices = [
  new Skill("Microservices", 5),
  new Skill("Microfrontends", 4),
  new Skill("CQRS", 5),
  new Skill("DDD", 5),
  new Skill("TDD", 5),
  new Skill("Clean code", 4),
  new Skill("Infrastructure as code", 4),
  new Skill("Low-Code Principles", 5),
  new Skill("GraphQL", 4),
  new Skill("REST API", 5),
];

const databasesAndStreamingPlatforms = [
  new Skill("Neo4j", 4),
  new Skill("ElasticSearch (7.x)", 4),
  new Skill("PostgreSQL", 4),
  new Skill("SQL Server", 3),
  new Skill("Redis", 3),
  new Skill("Kafka", 3),
  new Skill("Mosquitto (MQTT)", 3),
];

const devOpsAndServerTechnologies = [
  new Skill("Kubernetes", 4),
  new Skill("Containerization (docker)", 5),
  new Skill("Helm charts", 5),
  new Skill("Azure", 3),
  new Skill("Open-Telekom-Cloud (OTC)", 3),
  new Skill("Flux", 3),
  new Skill("Gitlab CI/CD", 4),
  new Skill("Github Actions", 3),
];

const languages = [
  new Skill("Persian (Native)", 5),
  new Skill("English", 4),
  new Skill("German (B1, Working on it)", 2),
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
    title: "Patterns and Practices",
    skills: patternsAndPractices,
  },
  {
    title: "Databases and Streaming Platforms",
    skills: databasesAndStreamingPlatforms,
  },
  {
    title: "DevOps and Server Technologies",
    skills: devOpsAndServerTechnologies,
  },
  {
    title: "Languages",
    skills: languages,
  },
];

const SkillsComponent = (props: PropsBase) => {
  return (
    <div id="skills" style={props.style} className="container">
      <Typography variant="h2">Skills</Typography>
      <br />
      <Masonry columns={2} spacing={2}>
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
