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
    Typography} from "@mui/material";
import PortfolioBarComponent from "./PortfolioBarComponent";

const introTheme = createTheme(deepmerge(themeBase, stickyInformationTheme));

const FarhadComponent = () => {
  const imageAlt = "Farhad Nowzari, FullStack Developer. Stuttgart Germany";
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("xl"));
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
      {isSmallScreen && <ThemeProvider theme={introTheme}>
        <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" sx={{ background: navyBlue }}>
            <Box padding="5%" boxSizing="border-box" display="flex" flexWrap="wrap" alignItems="start" justifyContent="center" gap="20px">
                <Avatar sx={{ width: 256, height: 256 }} alt={imageAlt} src={farhadImage}></Avatar>
                <Box display="flex" flexDirection="column" flexWrap="wrap" whiteSpace="wrap" alignItems={ isSmallerScreen ? "center" : undefined }>
                    <Typography>My name is</Typography>
                    <Typography variant="h1" fontSize={ isSmallerScreen ? "40px" : "60px" }>Farhad Nowzari</Typography>
                    <Typography textAlign={ isSmallerScreen ? "center" : undefined } marginTop="10px" maxWidth="500px">
                        I am an enthusiastic full stack developer with some software
                        architecture background. I am a team player and a boost of energy when
                        added to any teams!
                    </Typography>
                </Box>
            </Box>
        </Box>
    </ThemeProvider>}
    </div>
  );
};

export default FarhadComponent;
