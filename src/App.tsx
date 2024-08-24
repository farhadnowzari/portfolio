import { ThemeProvider } from "@emotion/react";
import { Box, createTheme, useMediaQuery } from "@mui/material";
import { themeBase } from "./components/themes";
import StickyInformation from "./components/StickyInformation";
import FarhadComponent from "./components/FarhadComponent";
import AboutMeComponent from "./components/AboutMeComponent";
import SkillsComponent from "./components/SkillsComponent";
import ContributionsComponent from "./components/ContributionsComponent";
import ExperiencesComponent from "./components/ExperiencesComponent";

const appTheme = createTheme(themeBase);
function App() {
  const isSmallScreen = useMediaQuery(appTheme.breakpoints.down("xl"));
  return (
    <ThemeProvider theme={appTheme}>
      <Box display="flex">
        {
          !isSmallScreen && (
          <Box
            style={{ background: "#101B3E", maxWidth: "40%" }}
            className="position-fixed vh-100"
          >
            <StickyInformation />
          </Box>
        )}
        <Box sx={{ marginInlineStart: isSmallScreen ? "0" : "40%" }}>
          <FarhadComponent />
          <SkillsComponent
            style={{ background: "#E8E6DC", minHeight: "calc(100vh - 80px)" }}
          />
          <ContributionsComponent
            style={{ background: "#E8E6DC", minHeight: "calc(100vh - 80px)" }}
          />
          <ExperiencesComponent
            style={{ background: "#E8E6DC", minHeight: "calc(100vh - 80px)" }}
          />
          <AboutMeComponent
            style={{ background: "#E8E6DC", minHeight: "calc(100vh - 80px)" }}
          />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
