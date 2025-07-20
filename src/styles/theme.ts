import { colors, lightTheme, darkTheme, shadowColors } from './colors';
import { typography } from './typography';
import { spacing, layout, componentSpacing, borderRadius, componentBorderRadius } from './spacing';
import { shadows, componentShadows } from './shadows';

// Theme type definitions
export type ThemeMode = 'light' | 'dark';

export interface Theme {
  mode: ThemeMode;
  colors: typeof colors & {
    theme: typeof lightTheme | typeof darkTheme;
  };
  typography: typeof typography;
  spacing: typeof spacing;
  layout: typeof layout;
  componentSpacing: typeof componentSpacing;
  borderRadius: typeof borderRadius;
  componentBorderRadius: typeof componentBorderRadius;
  shadows: typeof shadows;
  componentShadows: typeof componentShadows;
  shadowColors: typeof shadowColors;
}

// Light theme configuration
export const lightThemeConfig: Theme = {
  mode: 'light',
  colors: {
    ...colors,
    theme: lightTheme,
  },
  typography,
  spacing,
  layout,
  componentSpacing,
  borderRadius,
  componentBorderRadius,
  shadows,
  componentShadows,
  shadowColors,
};

// Dark theme configuration (for future implementation)
export const darkThemeConfig: Theme = {
  mode: 'dark',
  colors: {
    ...colors,
    theme: darkTheme,
  },
  typography,
  spacing,
  layout,
  componentSpacing,
  borderRadius,
  componentBorderRadius,
  shadows,
  componentShadows,
  shadowColors,
};

// Default theme (currently light only)
export const defaultTheme: Theme = lightThemeConfig;

// Theme utility functions
export const getTheme = (mode: ThemeMode = 'light'): Theme => {
  switch (mode) {
    case 'dark':
      return darkThemeConfig;
    case 'light':
    default:
      return lightThemeConfig;
  }
};

export const getThemeColor = (theme: Theme, colorKey: keyof typeof colors): string => {
  return theme.colors[colorKey] as string;
};

export const getThemeColors = (theme: Theme) => theme.colors;

export const getThemeTypography = (theme: Theme) => theme.typography;

export const getThemeSpacing = (theme: Theme) => theme.spacing;

export const getThemeShadows = (theme: Theme) => theme.shadows;

// Component style generators
export const createComponentStyles = (theme: Theme) => ({
  // Button styles
  button: {
    primary: {
      backgroundColor: theme.colors.spiceOrange,
      borderRadius: theme.componentBorderRadius.button,
      paddingHorizontal: theme.componentSpacing.buttonPadding.horizontal,
      paddingVertical: theme.componentSpacing.buttonPadding.vertical,
      ...theme.componentShadows.button,
    },
    secondary: {
      backgroundColor: theme.colors.theme.primaryBackground,
      borderWidth: 2,
      borderColor: theme.colors.spiceOrange,
      borderRadius: theme.componentBorderRadius.button,
      paddingHorizontal: theme.componentSpacing.buttonPadding.horizontal,
      paddingVertical: theme.componentSpacing.buttonPadding.vertical,
    },
    tertiary: {
      backgroundColor: 'transparent',
      paddingHorizontal: theme.componentSpacing.buttonPadding.horizontal,
      paddingVertical: theme.componentSpacing.buttonPadding.vertical,
    },
  },
  
  // Card styles
  card: {
    recipe: {
      backgroundColor: theme.colors.theme.secondaryBackground,
      borderRadius: theme.componentBorderRadius.recipeCard,
      borderWidth: 1,
      borderColor: theme.colors.theme.borders,
      ...theme.componentShadows.recipeCard,
    },
    content: {
      backgroundColor: theme.colors.theme.primaryBackground,
      borderRadius: theme.componentBorderRadius.card,
      borderWidth: 1,
      borderColor: theme.colors.theme.borders,
      ...theme.componentShadows.card,
    },
  },
  
  // Input styles
  input: {
    text: {
      backgroundColor: theme.colors.theme.secondaryBackground,
      borderWidth: 2,
      borderColor: theme.colors.theme.borders,
      borderRadius: theme.componentBorderRadius.input,
      paddingHorizontal: theme.componentSpacing.inputPadding.horizontal,
      paddingVertical: theme.componentSpacing.inputPadding.vertical,
      ...theme.componentShadows.input,
    },
    search: {
      backgroundColor: theme.colors.theme.tertiaryBackground,
      borderWidth: 1,
      borderColor: theme.colors.theme.borders,
      borderRadius: theme.componentBorderRadius.input,
      paddingHorizontal: theme.componentSpacing.inputPadding.horizontal,
      paddingVertical: theme.componentSpacing.inputPadding.vertical,
    },
  },
  
  // Container styles
  container: {
    screen: {
      flex: 1,
      backgroundColor: theme.colors.theme.primaryBackground,
    },
    content: {
      flex: 1,
      paddingHorizontal: theme.layout.containerPadding,
    },
    section: {
      marginBottom: theme.layout.sectionSpacing,
    },
  },
  
  // Header styles
  header: {
    container: {
      backgroundColor: theme.colors.theme.primaryBackground,
      paddingHorizontal: theme.componentSpacing.headerPadding.horizontal,
      paddingVertical: theme.componentSpacing.headerPadding.vertical,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.theme.borders,
      ...theme.componentShadows.header,
    },
  },
  
  // Modal styles
  modal: {
    container: {
      backgroundColor: theme.colors.theme.secondaryBackground,
      borderRadius: theme.componentBorderRadius.modal,
      paddingHorizontal: theme.componentSpacing.modalPadding.horizontal,
      paddingVertical: theme.componentSpacing.modalPadding.vertical,
      ...theme.componentShadows.modal,
    },
  },
});

// Theme context type (for React Context)
export interface ThemeContextType {
  theme: Theme;
  setTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

// Animation configurations
export const themeAnimations = {
  duration: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
  easing: {
    easeOut: 'ease-out',
    easeIn: 'ease-in',
    easeInOut: 'ease-in-out',
  },
  spring: {
    tension: 100,
    friction: 8,
  },
} as const;

// Responsive breakpoints (for future responsive design)
export const breakpoints = {
  small: 375,
  medium: 768,
  large: 1024,
  xlarge: 1440,
} as const;

// Export all theme-related types
export type {
  Theme,
  ThemeMode,
  ThemeContextType,
};

// Export theme utilities
export {
  getTheme,
  getThemeColor,
  getThemeColors,
  getThemeTypography,
  getThemeSpacing,
  getThemeShadows,
  createComponentStyles,
  themeAnimations,
  breakpoints,
}; 