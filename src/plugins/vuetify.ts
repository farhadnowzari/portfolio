import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';
import { createVuetify, type ThemeDefinition } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi';

const navyBlue = '#101B3E';
const primary = '#A2A096';

// MUI themeBase → Vuetify default theme.
const portfolioTheme: ThemeDefinition = {
  dark: false,
  colors: {
    primary,
    navy: navyBlue,
    background: '#fafafa',
    surface: '#fafafa',
    'on-primary': primary, // MUI palette.primary.contrastText
    'on-background': navyBlue, // MUI typography.allVariants.color
    'on-surface': navyBlue,
  },
};

// MUI stickyInformationTheme → second theme, applied via <v-theme-provider theme="stickyInformation">.
const stickyInformationTheme: ThemeDefinition = {
  dark: false,
  colors: {
    primary,
    navy: navyBlue,
    background: navyBlue,
    surface: '#f0f0f0', // MuiMenu paper
    'on-background': primary,
    'on-surface': navyBlue, // MuiMenuItem color
  },
};

export default createVuetify({
  theme: {
    defaultTheme: 'portfolio',
    themes: {
      portfolio: portfolioTheme,
      stickyInformation: stickyInformationTheme,
    },
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi },
  },
  defaults: {
    // MuiBottomNavigation / MuiBottomNavigationAction styleOverrides
    VBottomNavigation: {
      bgColor: 'navy',
      color: 'primary',
      // MuiBottomNavigationAction color: primary in every state (items have no router → never
      // "active", so without this Vuetify falls back to on-navy).
      baseColor: 'primary',
    },
    // MuiMenuItem styleOverrides (stickyInformationTheme)
    VList: {
      bgColor: 'surface',
    },
    VListItem: {
      minWidth: 250,
    },
  },
});

export { navyBlue, primary };
