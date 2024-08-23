import StickyInformation from "./components/StickyInformation";
import FarhadComponent from "./components/FarhadComponent";
import AboutMeComponent from "./components/AboutMeComponent";
import { ThemeProvider } from "@emotion/react";
import { Box, createTheme } from "@mui/material";
import { themeBase } from "./components/themes";
import SkillsComponent from "./components/SkillsComponent";
import ContributionsComponent from "./components/ContributionsComponent";

const theme = createTheme(themeBase);
function App() {
  return (
    <ThemeProvider theme={theme}>
      <Box display="flex">
        <Box style={{ background: "#101B3E", maxWidth: "40%" }} className="position-fixed vh-100">
          <StickyInformation />
        </Box>
        <Box sx={{ marginInlineStart: "40%" }}>
          <FarhadComponent />
          <SkillsComponent style={{ background: "#E8E6DC", minHeight: "calc(100vh - 80px)" }} />
          <ContributionsComponent style={{ background: "#E8E6DC", minHeight: "calc(100vh - 80px)" }} />
          {/* 
            <ContributionsComponent style={{ background: "#E8E6DC" }} />
            <ExperiencesComponent style={{ background: "white" }} /> */}
          <AboutMeComponent
            style={{ background: "#E8E6DC", minHeight: "calc(100vh - 80px)" }}
          />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
