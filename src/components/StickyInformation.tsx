import {
  Box,
  Button,
  createTheme,
  ThemeProvider,
  Tooltip,
  Typography,
  Link
} from "@mui/material";
import {
  YouTube,
  GitHub,
  LinkedIn,
  DownloadOutlined,
} from "@mui/icons-material";

import { deepmerge } from "@mui/utils";
import { stickyInformationTheme, themeBase } from "./themes";

const theme = createTheme(deepmerge(themeBase, stickyInformationTheme));

const StickyInformation = () => {
  return (
    <ThemeProvider theme={theme}>
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        padding="5%"
        boxSizing="border-box"
      >
        <Typography style={{ marginTop: "auto" }}>My name is</Typography>
        <Typography variant="h1" fontSize="60px" margin="0" padding="0">
          Farhad Nowzari
        </Typography>
        <Typography marginTop="30px">
          I am an enthusiastic full stack developer with some software
          architecture background. I am a team player and a boost of energy when
          added to any teams!
        </Typography>
        <span style={{ marginTop: "20px" }}>
          <Button
            variant="outlined"
            href="assets/Farhad Nowzari CV.pdf"
            target="_blank"
            download="Farhad Nowzari CV.pdf"
          >
            <DownloadOutlined /> Download my CV
          </Button>
        </span>
        <div style={{ marginTop: "auto" }}>
          <Typography>You can find me on:</Typography>
          <Box display="flex" gap="15px">
            <Link
              href="https://www.linkedin.com/in/farhad-nowzari-94060699/"
              target="_blank"
            >
              <Tooltip title="LinkedIn">
                <LinkedIn />
              </Tooltip>
            </Link>
            <Link href="https://github.com/farhadnowzari" target="_blank">
              <Tooltip title="Github">
                <GitHub />
              </Tooltip>
            </Link>
            <Link href="https://www.youtube.com/@nowzarifarhad" target="_blank">
              <Tooltip title="Youtube">
                <YouTube />
              </Tooltip>
            </Link>
          </Box>
        </div>
      </Box>
    </ThemeProvider>
  );
};

export default StickyInformation;
