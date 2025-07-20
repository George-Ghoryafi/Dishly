// Primary Colors
export const colors = {
  // Primary Color Palette
  warmCream: '#FDF8F3',
  warmCreamLight: '#FEFCF9',
  warmCreamDark: '#F5E6D3',
  
  spiceOrange: '#FF6B35',
  spiceOrangeLight: '#FF8A65',
  spiceOrangeDark: '#E55A2B',
  
  sageGreen: '#4A7C59',
  sageGreenLight: '#6B8E7A',
  sageGreenDark: '#3A5F47',
  
  deepNavy: '#2C3E50',
  deepNavyLight: '#34495E',
  deepNavyDark: '#1B2631',
  
  warmGray: '#8B7355',
  warmGrayLight: '#A69B8B',
  warmGrayDark: '#6B5B47',
  
  coralPink: '#E67E22',
  coralPinkLight: '#F39C12',
  coralPinkDark: '#D35400',
  
  // Semantic Colors
  success: {
    primary: '#4A7C59',
    background: '#F0F7F2',
    border: '#C8E6C9',
  },
  
  warning: {
    primary: '#E67E22',
    background: '#FFF8E1',
    border: '#FFE082',
  },
  
  error: {
    primary: '#E74C3C',
    background: '#FFEBEE',
    border: '#FFCDD2',
  },
  
  info: {
    primary: '#2C3E50',
    background: '#F5F7FA',
    border: '#E3E8F0',
  },
  
  // Legacy colors for migration (to be removed after full migration)
  legacy: {
    blue: '#007AFF',
    white: '#FFFFFF',
    gray: '#666666',
    lightGray: '#F5F5F5',
    borderGray: '#E0E0E0',
  },
} as const;

// Theme-specific color mappings
export const lightTheme = {
  primaryBackground: colors.warmCream,
  secondaryBackground: colors.legacy.white,
  tertiaryBackground: '#F5F0EB',
  primaryText: colors.deepNavy,
  secondaryText: colors.warmGray,
  borders: '#E8E0D8',
} as const;

export const darkTheme = {
  primaryBackground: '#1A1A1A',
  secondaryBackground: '#2D2D2D',
  tertiaryBackground: '#3A3A3A',
  primaryText: colors.legacy.white,
  secondaryText: '#B0B0B0',
  borders: '#404040',
} as const;

// Color utility functions
export const getColorWithOpacity = (color: string, opacity: number): string => {
  // Convert hex to rgba
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// Shadow colors using warm gray
export const shadowColors = {
  light: getColorWithOpacity(colors.warmGray, 0.1),
  medium: getColorWithOpacity(colors.warmGray, 0.15),
  heavy: getColorWithOpacity(colors.warmGray, 0.25),
} as const;

export type ColorKey = keyof typeof colors;
export type ThemeColors = typeof lightTheme; 