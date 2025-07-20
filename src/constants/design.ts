// Re-export all design system modules for easy access
export * from '../styles/colors';
export * from '../styles/typography';
export * from '../styles/spacing';
export * from '../styles/shadows';
export * from '../styles/theme';

// Design system constants
export const DESIGN_SYSTEM = {
  // App branding
  appName: 'Recipic',
  version: '1.0.0',
  
  // Design tokens
  colors: {
    primary: '#FF6B35', // Spice Orange
    secondary: '#4A7C59', // Sage Green
    accent: '#E67E22', // Coral Pink
    background: '#FDF8F3', // Warm Cream
    text: '#2C3E50', // Deep Navy
    textSecondary: '#8B7355', // Warm Gray
  },
  
  // Component constants
  components: {
    // Button sizes
    buttonSizes: {
      small: { height: 36, paddingHorizontal: 16 },
      medium: { height: 44, paddingHorizontal: 24 },
      large: { height: 56, paddingHorizontal: 32 },
    },
    
    // Card dimensions
    cardSizes: {
      small: { width: 160, height: 200 },
      medium: { width: 200, height: 250 },
      large: { width: 280, height: 350 },
    },
    
    // Input dimensions
    inputSizes: {
      small: { height: 36 },
      medium: { height: 44 },
      large: { height: 56 },
    },
    
    // Icon sizes
    iconSizes: {
      xs: 12,
      sm: 16,
      md: 20,
      lg: 24,
      xl: 32,
      xxl: 48,
    },
  },
  
  // Animation constants
  animations: {
    duration: {
      fast: 150,
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
  },
  
  // Layout constants
  layout: {
    maxWidth: 1200,
    containerPadding: 20,
    sectionSpacing: 32,
    cardSpacing: 16,
  },
  
  // Accessibility constants
  accessibility: {
    minimumTouchTarget: 44,
    minimumContrastRatio: 4.5,
    focusIndicatorWidth: 2,
  },
} as const;

// Utility functions for design system usage
export const designUtils = {
  // Color utilities
  getColorWithOpacity: (color: string, opacity: number): string => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  },
  
  // Spacing utilities
  getSpacing: (multiplier: number): number => multiplier * 8,
  
  // Border radius utilities
  getBorderRadius: (size: 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl'): number => {
    const radiusMap = { xs: 4, s: 8, m: 12, l: 16, xl: 20, xxl: 24 };
    return radiusMap[size];
  },
  
  // Shadow utilities
  getShadow: (level: 'light' | 'medium' | 'heavy') => {
    const shadows = {
      light: { elevation: 2, shadowOpacity: 0.1, shadowRadius: 4 },
      medium: { elevation: 4, shadowOpacity: 0.15, shadowRadius: 8 },
      heavy: { elevation: 8, shadowOpacity: 0.25, shadowRadius: 16 },
    };
    return shadows[level];
  },
  
  // Typography utilities
  getFontSize: (size: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl'): number => {
    const sizeMap = {
      xs: 12, sm: 14, base: 16, lg: 18, xl: 20,
      '2xl': 22, '3xl': 24, '4xl': 28, '5xl': 32,
    };
    return sizeMap[size];
  },
  
  // Responsive utilities
  getResponsiveValue: (small: any, medium: any, large: any) => {
    // This would be implemented with actual screen size detection
    return medium; // Default to medium for now
  },
} as const;

// Component style presets
export const stylePresets = {
  // Button presets
  buttons: {
    primary: {
      backgroundColor: DESIGN_SYSTEM.colors.primary,
      borderRadius: 12,
      paddingHorizontal: 24,
      paddingVertical: 16,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
    secondary: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: DESIGN_SYSTEM.colors.primary,
      borderRadius: 12,
      paddingHorizontal: 24,
      paddingVertical: 16,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
    tertiary: {
      backgroundColor: 'transparent',
      paddingHorizontal: 16,
      paddingVertical: 12,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
  },
  
  // Card presets
  cards: {
    recipe: {
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      borderWidth: 1,
      borderColor: '#E8E0D8',
      overflow: 'hidden' as const,
    },
    content: {
      backgroundColor: DESIGN_SYSTEM.colors.background,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: '#E8E0D8',
      padding: 16,
    },
  },
  
  // Input presets
  inputs: {
    text: {
      backgroundColor: '#FFFFFF',
      borderWidth: 2,
      borderColor: '#E8E0D8',
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 16,
      fontSize: 16,
      color: DESIGN_SYSTEM.colors.text,
    },
    search: {
      backgroundColor: '#F5F0EB',
      borderWidth: 1,
      borderColor: '#E8E0D8',
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 16,
      color: DESIGN_SYSTEM.colors.text,
    },
  },
  
  // Container presets
  containers: {
    screen: {
      flex: 1,
      backgroundColor: DESIGN_SYSTEM.colors.background,
    },
    content: {
      flex: 1,
      paddingHorizontal: DESIGN_SYSTEM.layout.containerPadding,
    },
    section: {
      marginBottom: DESIGN_SYSTEM.layout.sectionSpacing,
    },
  },
} as const;

// Export types for design system usage
export type DesignSystemColors = typeof DESIGN_SYSTEM.colors;
export type ComponentSizes = typeof DESIGN_SYSTEM.components;
export type AnimationConfig = typeof DESIGN_SYSTEM.animations;
export type LayoutConfig = typeof DESIGN_SYSTEM.layout;
export type StylePresets = typeof stylePresets; 