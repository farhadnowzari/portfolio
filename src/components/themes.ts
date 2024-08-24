import { ThemeOptions } from "@mui/material";

const navyBlue = "#101B3E";
const primary = "#A2A096";
const themeBase: ThemeOptions = {
  components: {
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          backgroundColor: navyBlue,
          bottom: "-5px"
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          color: primary,
        },
      },
    },
  },
  typography: {
    fontSize: 20,
    h1: {
      fontSize: "60px",
    },
    h2: {
      fontSize: "40px",
    },
    h5: {
      fontSize: "20px",
    },
    body1: {
      fontSize: "15px",
    },
    allVariants: {
      color: navyBlue,
    },
  },
  palette: {
    primary: {
      main: "#A2A096",
      contrastText: "#A2A096",
    },
  },
};

const stickyInformationTheme: ThemeOptions = {
  components: {
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: "#f0f0f0",
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: navyBlue,
          gap: "10px",
          fontSize: "20px",
          minWidth: "250px",
        },
      },
    },
  },
  typography: {
    body1: {
      fontSize: "25px",
    },
    allVariants: {
      color: "#A2A096",
    },
  },
};

export { themeBase, stickyInformationTheme, navyBlue };
