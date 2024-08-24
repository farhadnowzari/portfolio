import {
  Typography,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Grid,
} from "@mui/material";
import PropsBase from "./PropsBase";
import { Box } from "@mui/system";

interface Experience {
  title: string;
  dateFrom: string;
  dateUntil?: string;
  skills: Record<string, string[]>[];
}

const experiences: Experience[] = [
  {
    title:
      "Senior Software Architect - gis-consulting GmbH, Stuttgart, Germany",
    dateFrom: "June 2020",
    skills: [
      {
        Backend: [
          "C# (dotnet)",
          "nodejs",
          "GraphQL",
          "neo4j",
          "PostgreSQL",
          "Elasticsearch",
          "redis",
          "xUnit Tests",
          "Camunda",
          "Kafka",
          "Keycloak",
        ],
      },
      {
        Frontend: [
          "vue2",
          "vue3",
          "Vuetify",
          "Quasar",
          "single-spa",
          "typescript",
          "SCSS",
        ],
      },
      {
        Others: [
          "Kubernetes",
          "Docker",
          "Helm",
          "GitLab CI/CD",
          "Azure",
          "OTC",
          "On-Premise Kubernetes instances",
        ],
      },
    ],
  },
  {
    title: "Web Developer - NavaTec GmbH, Heilbronn, Germany",
    dateFrom: "March 2019",
    dateUntil: "May 2020",
    skills: [
      {
        Backend: [
          "PHP (Laravel)",
          "REST APIs",
          "PostgreSQL",
          "Elasticsearch",
          "redis",
        ],
      },
      {
        Frontend: ["vue2", "JQuery", "ElementUI", "Javascript", "SCSS"],
      },
      {
        Others: ["Docker"],
      },
    ],
  },
  {
    title: "Web Developer - NavaTec GmbH, HomeOffice, Iran",
    dateFrom: "August 2016",
    dateUntil: "March 2019",
    skills: [
      {
        Backend: ["C# (ASP.NET MVC)", "PHP (Laravel)", "REST APIs", "MariaDB"],
      },
      {
        Frontend: ["JQuery", "Bootstrap", "Javascript"],
      },
      {
        Others: ["IIS"],
      },
    ],
  },
  {
    title: "FullStack Developer - Freelancer, Iran",
    dateFrom: "August 2012",
    dateUntil: "September 2016",
    skills: [
      {
        Backend: ["C#", "VB.Net", "REST APIs", "SQL Server", "SQLite", "MySQL"],
      },
      {
        Frontend: ["JQuery", "Bootstrap", "Javascript", "WPF (XAML)"],
      },
      {
        Others: ["IIS"],
      },
    ],
  },
];

const ExperiencesComponent = (props: PropsBase) => {
  return (
    <div id="experiences" style={props.style} className="container">
      <Typography variant="h2">Experiences</Typography>
      <br />
      <Grid container spacing={2}>
        {experiences.map((experience, index) => (
          <Grid item xs={12} key={index}>
            <Card>
              <CardHeader
                title={experience.title}
                subheader={`${experience.dateFrom} - ${
                  experience.dateUntil || "Present"
                }`}
              ></CardHeader>
              <CardContent>
                {experience.skills.map((skillSet, index) => (
                  <div key={index}>
                    {Object.keys(skillSet).map((key, index) => (
                      <div key={index} style={{ margin: "5px 0px" }}>
                        <Box
                          display="flex"
                          flexWrap="wrap"
                          alignItems="center"
                          gap="5px"
                        >
                          {key}:
                          {skillSet[key].map((skill, index) => (
                            <Chip
                              label={skill}
                              key={index}
                              size="small"
                              sx={{ fontSize: "15px" }}
                            ></Chip>
                          ))}
                        </Box>
                      </div>
                    ))}
                  </div>
                ))}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default ExperiencesComponent;
