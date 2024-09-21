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
  description?: string;
  skills: Record<string, string[]>[];
}

const experiences: Experience[] = [
  {
    title:
      "Senior FullStack Engineer - gis-consulting GmbH, Stuttgart, Germany",
    dateFrom: "June 2020",
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
    description: "Here I continued my Germany to work with an international team in Germany. I was responsible for the development of a new SaaS, from the backend to the frontend, and the deployment of the application to the cloud.",
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
    description: "Here is where I started the journey of working with an international team. I was responsible for the development of a new SaaS, from the backend to the frontend, and the deployment of the application to the cloud.",
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
                          <Typography>{key}:</Typography>
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
              {experience.description && (
                <CardContent>
                  <Typography variant="body2">What I did?</Typography>
                  <Typography paragraph variant="body1">
                    {experience.description}
                  </Typography>
                </CardContent>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default ExperiencesComponent;
