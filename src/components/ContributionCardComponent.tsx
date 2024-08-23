import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActionArea,
  CardActions,
  Chip,
} from "@mui/material";
import { GitHub, YouTube, TextSnippet } from "@mui/icons-material";
import { Box } from "@mui/system";

interface ContributionCardProps {
  title: string;
  description: string;
  image?: string;
  link: string;
  type: "github" | "youtube" | "medium";
  meta?: string[];
}

const ContributionCardComponent = (props: ContributionCardProps) => {
  return (
    <Card>
      <CardActionArea href={props.link} target="_blank">
        {props.image && (
          <CardMedia component="img" height="180" image={props.image} />
        )}
        <CardContent>
          <Typography variant="h5" style={{ marginTop: 0 }}>
            <Box display="flex" gap="5px" alignItems="center">
              {props.type === "github" && <GitHub />}
              {props.type === "youtube" && <YouTube style={{ color: "red" }} />}
              {props.type === "medium" && <TextSnippet />}
              {props.title}
            </Box>
          </Typography>
          <Typography sx={{ marginTop: "15px" }} variant="body2">{props.description}</Typography>
        </CardContent>
        { props.meta && <CardActions>
          {props.meta.map((meta, index) => (
            <Chip size="small" sx={{ fontSize: "15px", color: "#fff" }} color="primary" key={index} label={meta}></Chip>
          ))}
        </CardActions> }
      </CardActionArea>
    </Card>
  );
};

export default ContributionCardComponent;
