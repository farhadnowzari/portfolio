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
