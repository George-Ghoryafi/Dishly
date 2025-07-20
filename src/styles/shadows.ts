import { Platform, ShadowStyleIOS, ViewStyle } from 'react-native';
import { shadowColors } from './colors';

// Shadow intensity levels
export const shadowIntensity = {
  light: 0.1,
  medium: 0.15,
  heavy: 0.25,
} as const;

// Shadow configurations
export const shadows = {
  // Light shadows for subtle elevation
  light: Platform.select({
    ios: {
      shadowColor: shadowColors.light,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: shadowIntensity.light,
      shadowRadius: 4,
    } as ShadowStyleIOS,
    android: {
      elevation: 2,
    },
  }),
  
  // Medium shadows for cards and content
  medium: Platform.select({
    ios: {
      shadowColor: shadowColors.medium,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: shadowIntensity.medium,
      shadowRadius: 8,
    } as ShadowStyleIOS,
    android: {
      elevation: 4,
    },
  }),
  
  // Heavy shadows for modals and overlays
  heavy: Platform.select({
    ios: {
      shadowColor: shadowColors.heavy,
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: shadowIntensity.heavy,
      shadowRadius: 16,
    } as ShadowStyleIOS,
    android: {
      elevation: 8,
    },
  }),
  
  // Recipe card shadows
  recipeCard: Platform.select({
    ios: {
      shadowColor: shadowColors.medium,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: shadowIntensity.medium,
      shadowRadius: 12,
    } as ShadowStyleIOS,
    android: {
      elevation: 4,
    },
  }),
  
  // Button shadows
  button: Platform.select({
    ios: {
      shadowColor: shadowColors.medium,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: shadowIntensity.medium,
      shadowRadius: 4,
    } as ShadowStyleIOS,
    android: {
      elevation: 3,
    },
  }),
  
  // Modal shadows
  modal: Platform.select({
    ios: {
      shadowColor: shadowColors.heavy,
      shadowOffset: {
        width: 0,
        height: 10,
      },
      shadowOpacity: shadowIntensity.heavy,
      shadowRadius: 20,
    } as ShadowStyleIOS,
    android: {
      elevation: 10,
    },
  }),
  
  // Input field shadows
  input: Platform.select({
    ios: {
      shadowColor: shadowColors.light,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: shadowIntensity.light,
      shadowRadius: 2,
    } as ShadowStyleIOS,
    android: {
      elevation: 1,
    },
  }),
  
  // Focus state shadows
  focus: Platform.select({
    ios: {
      shadowColor: shadowColors.medium,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: shadowIntensity.medium,
      shadowRadius: 6,
    } as ShadowStyleIOS,
    android: {
      elevation: 4,
    },
  }),
} as const;

// Component-specific shadow styles
export const componentShadows = {
  // Card shadows
  card: shadows.medium,
  recipeCard: shadows.recipeCard,
  contentCard: shadows.light,
  
  // Interactive element shadows
  button: shadows.button,
  buttonPressed: shadows.light,
  input: shadows.input,
  inputFocus: shadows.focus,
  
  // Overlay shadows
  modal: shadows.modal,
  dropdown: shadows.heavy,
  tooltip: shadows.medium,
  
  // Navigation shadows
  header: shadows.light,
  tabBar: shadows.medium,
  
  // Special shadows
  floating: shadows.heavy,
  badge: shadows.light,
} as const;

// Shadow utility functions
export const getShadow = (level: keyof typeof shadows): ViewStyle => shadows[level];

export const getComponentShadow = (component: keyof typeof componentShadows): ViewStyle => 
  componentShadows[component];

export const createCustomShadow = (
  color: string,
  offset: { width: number; height: number },
  opacity: number,
  radius: number
): ViewStyle => Platform.select({
  ios: {
    shadowColor: color,
    shadowOffset: offset,
    shadowOpacity: opacity,
    shadowRadius: radius,
  } as ShadowStyleIOS,
  android: {
    elevation: Math.ceil(radius / 2),
  },
});

// Shadow presets for common use cases
export const shadowPresets = {
  // Elevation levels
  elevation: {
    1: shadows.light,
    2: shadows.medium,
    3: shadows.heavy,
  },
  
  // Interactive states
  interactive: {
    default: shadows.medium,
    hover: shadows.heavy,
    pressed: shadows.light,
    focus: shadows.focus,
  },
  
  // Content hierarchy
  hierarchy: {
    background: null,
    surface: shadows.light,
    card: shadows.medium,
    modal: shadows.heavy,
  },
} as const;

// Shadow animation values for transitions
export const shadowAnimations = {
  // Transition from light to medium shadow
  lightToMedium: {
    from: shadows.light,
    to: shadows.medium,
  },
  
  // Transition from medium to heavy shadow
  mediumToHeavy: {
    from: shadows.medium,
    to: shadows.heavy,
  },
  
  // Focus animation
  focusAnimation: {
    from: shadows.input,
    to: shadows.focus,
  },
} as const;

export type ShadowLevel = keyof typeof shadows;
export type ComponentShadow = keyof typeof componentShadows;
export type ShadowIntensity = keyof typeof shadowIntensity; 