import { ThemeProvider } from "@emotion/react";
import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  createTheme,
  Fab,
  Grow,
  Menu,
  MenuItem,
  useMediaQuery,
} from "@mui/material";
import { navyBlue, themeBase } from "./components/themes";
import StickyInformation from "./components/StickyInformation";
import FarhadComponent from "./components/FarhadComponent";
import AboutMeComponent from "./components/AboutMeComponent";
import SkillsComponent from "./components/SkillsComponent";
import ContributionsComponent from "./components/ContributionsComponent";
import ExperiencesComponent from "./components/ExperiencesComponent";
import BurgerIcon from "./assets/burger.svg";
import {
  ConstructionOutlined,
  HomeOutlined,
  InfoOutlined,
  VolunteerActivismOutlined,
  WorkHistoryOutlined,
} from "@mui/icons-material";
import { HashLink } from "react-router-hash-link";
import React from "react";

const appTheme = createTheme(themeBase);
function App() {
  const [value, setValue] = React.useState(0);

  const isSmallScreen = useMediaQuery(appTheme.breakpoints.down("lg"));
  return (
    <ThemeProvider theme={appTheme}>
      <Box display="flex">
        {!isSmallScreen && (
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
      {isSmallScreen && (
        <BottomNavigation
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
          sx={{
            position: "fixed",
            left: "0",
            right: "0",
            padding: "10px 5px",
          }}
        >
          <BottomNavigationAction
            component={HashLink}
            to="/#"
            smooth
            label="Home"
            icon={<HomeOutlined />}
          />
          <BottomNavigationAction
            component={HashLink}
            to="/#skills"
            smooth
            label="Skills"
            icon={<ConstructionOutlined />}
          />
          <BottomNavigationAction
            component={HashLink}
            to="/#contributions"
            smooth
            label="Contributions"
            icon={<VolunteerActivismOutlined />}
          />
          <BottomNavigationAction
            component={HashLink}
            to="/#experiences"
            smooth
            label="Experiences"
            icon={<WorkHistoryOutlined />}
          />
          <BottomNavigationAction
            component={HashLink}
            to="/#about-me"
            smooth
            label="About"
            icon={<InfoOutlined />}
          />
        </BottomNavigation>
      )}
    </ThemeProvider>
  );
}

export default App;
