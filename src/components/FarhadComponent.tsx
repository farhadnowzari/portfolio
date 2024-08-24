import farhadImage from "../assets/Farhad.png";
import { navyBlue, stickyInformationTheme, themeBase } from "./themes";
import { deepmerge } from "@mui/utils";
import {
  createTheme,
  useMediaQuery,
  useTheme,
  ThemeProvider,
  Box,
  Avatar,
  Typography,
  Link,
  Tooltip,
  Button,
} from "@mui/material";
import {
  DownloadOutlined,
  GitHub,
  LinkedIn,
  YouTube,
} from "@mui/icons-material";

const introTheme = createTheme(deepmerge(themeBase, stickyInformationTheme));

const FarhadComponent = () => {
  const imageAlt = "Farhad Nowzari, FullStack Developer. Stuttgart Germany";
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("lg"));
  const isSmallerScreen = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <div>
      {!isSmallScreen && (
        <div
          id="home"
          className="h-100"
          style={{ maxHeight: "100vh", overflow: "hidden" }}
        >
          <img
            alt={imageAlt}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            src={farhadImage}
          />
        </div>
      )}
      {isSmallScreen && (
        <ThemeProvider theme={introTheme}>
          <Box
            minHeight="100vh"
            display="flex"
            alignItems="center"
            justifyContent="center"
            sx={{ background: navyBlue }}
          >
            <Box
              padding="5%"
              boxSizing="border-box"
              display="flex"
              flexWrap="wrap"
              alignItems="start"
              justifyContent="center"
              gap="20px"
            >
              <Box display="flex" flexDirection="column">
                <Avatar
                  sx={{ width: 256, height: 256 }}
                  alt={imageAlt}
                  src={farhadImage}
                ></Avatar>
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  gap="15px"
                  marginTop="10px"
                >
                  <Link
                    href="https://www.linkedin.com/in/farhad-nowzari-94060699/"
                    target="_blank"
                  >
                    <Tooltip title="LinkedIn">
                      <LinkedIn sx={{ fontSize: "25px" }} />
                    </Tooltip>
                  </Link>
                  <Link href="https://github.com/farhadnowzari" target="_blank">
                    <Tooltip title="Github">
                      <GitHub sx={{ fontSize: "25px" }} />
                    </Tooltip>
                  </Link>
                  <Link
                    href="https://www.youtube.com/@nowzarifarhad"
                    target="_blank"
                  >
                    <Tooltip title="Youtube">
                      <YouTube sx={{ fontSize: "25px" }} />
                    </Tooltip>
                  </Link>
                </Box>
              </Box>
              <Box
                display="flex"
                flexDirection="column"
                flexWrap="wrap"
                whiteSpace="wrap"
                alignItems={isSmallerScreen ? "center" : undefined}
              >
                <Typography>My name is</Typography>
                <Typography
                  variant="h1"
                  fontSize={isSmallerScreen ? "40px" : "60px"}
                >
                  Farhad Nowzari
                </Typography>
                <Typography
                  textAlign={isSmallerScreen ? "center" : undefined}
                  marginTop="10px"
                  maxWidth="500px"
                >
                  I am an enthusiastic full stack developer with some software
                  architecture background. I am a team player and a boost of
                  energy when added to any teams!
                </Typography>
                <Button
                  href="/assets/Farhad Nowzari CV.pdf"
                  target="_blank"
                  download="Farhad Nowzari CV.pdf"
                  variant="outlined"
                  sx={{ marginTop: "20px" }}
                >
                  <DownloadOutlined /> Download My CV
                </Button>
              </Box>
            </Box>
          </Box>
        </ThemeProvider>
      )}
    </div>
  );
};

export default FarhadComponent;
