import { ThemeOptions } from "@mui/material";

const themeBase: ThemeOptions = {
  typography: {
    fontSize: 20,
    h1: {
        fontSize: "60px"
    },
    h2: {
        fontSize: "40px"
    },
    h5: {
        fontSize: "20px"
    },
    allVariants: {
        color: "#101B3E"
    }
  },
  palette: {
    primary: {
      main: "#A2A096",
      contrastText: "#A2A096",
    },
  },
};

const stickyInformationTheme: ThemeOptions = {
  typography: {
    allVariants: {
      color: "#A2A096",
    },
  },
};

export { themeBase, stickyInformationTheme };
