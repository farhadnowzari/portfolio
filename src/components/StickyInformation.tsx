import {
  Box,
  Button,
  createTheme,
  ThemeProvider,
  Tooltip,
  Typography,
  Link,
} from "@mui/material";
import {
  YouTube,
  GitHub,
  LinkedIn,
  DownloadOutlined,
} from "@mui/icons-material";

import { deepmerge } from "@mui/utils";
import { stickyInformationTheme, themeBase } from "./themes";
import PortfolioBarComponent from "./PortfolioBarComponent";

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
        <PortfolioBarComponent />
        <Typography style={{ marginTop: "auto" }}>My name is</Typography>
        <Typography variant="h1" fontSize="60px" margin="0" padding="0">
          Farhad Nowzari
        </Typography>
        <Typography marginTop="30px">
          I’m an enthusiastic full-stack developer with a strong foundation in
          software architecture. I thrive in team environments and bring a
          positive, energetic boost to any group I’m a part of!
        </Typography>
        <span style={{ marginTop: "20px" }}>
          <Button
            variant="outlined"
            href="/assets/CV - Farhad Nowzari.pdf"
            target="_blank"
            download="CV - Farhad Nowzari.pdf"
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
