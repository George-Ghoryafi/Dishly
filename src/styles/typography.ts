import { Platform, TextStyle } from 'react-native';
import { colors } from './colors';

// Font weights
export const fontWeights = {
  regular: '400' as const,
  medium: '500' as const,
  semiBold: '600' as const,
  bold: '700' as const,
} as const;

// Font sizes
export const fontSizes = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 22,
  '3xl': 24,
  '4xl': 28,
  '5xl': 32,
} as const;

// Line heights
export const lineHeights = {
  tight: 1.2,
  normal: 1.4,
  relaxed: 1.6,
  loose: 1.8,
} as const;

// Typography styles
export const typography = {
  // Headers
  h1: {
    fontSize: fontSizes['5xl'],
    fontWeight: fontWeights.bold,
    color: colors.deepNavy,
    lineHeight: fontSizes['5xl'] * lineHeights.tight,
  } as TextStyle,
  
  h2: {
    fontSize: fontSizes['4xl'],
    fontWeight: fontWeights.bold,
    color: colors.deepNavy,
    lineHeight: fontSizes['4xl'] * lineHeights.tight,
  } as TextStyle,
  
  h3: {
    fontSize: fontSizes['3xl'],
    fontWeight: fontWeights.semiBold,
    color: colors.deepNavy,
    lineHeight: fontSizes['3xl'] * lineHeights.tight,
  } as TextStyle,
  
  h4: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.semiBold,
    color: colors.deepNavy,
    lineHeight: fontSizes.xl * lineHeights.tight,
  } as TextStyle,
  
  // Body Text
  bodyLarge: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.regular,
    color: colors.deepNavy,
    lineHeight: fontSizes.lg * lineHeights.normal,
  } as TextStyle,
  
  bodyMedium: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.regular,
    color: colors.deepNavy,
    lineHeight: fontSizes.base * lineHeights.normal,
  } as TextStyle,
  
  bodySmall: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.regular,
    color: colors.warmGray,
    lineHeight: fontSizes.sm * lineHeights.normal,
  } as TextStyle,
  
  caption: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.regular,
    color: colors.warmGray,
    lineHeight: fontSizes.xs * lineHeights.normal,
  } as TextStyle,
  
  // Special Text
  recipeTitle: {
    fontSize: fontSizes['2xl'],
    fontWeight: fontWeights.bold,
    color: colors.deepNavy,
    lineHeight: fontSizes['2xl'] * lineHeights.tight,
  } as TextStyle,
  
  buttonText: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semiBold,
    color: colors.legacy.white,
    lineHeight: fontSizes.base * lineHeights.tight,
  } as TextStyle,
  
  navigationText: {
    fontSize: 17, // iOS standard
    fontWeight: fontWeights.semiBold,
    color: colors.deepNavy,
    lineHeight: 17 * lineHeights.tight,
  } as TextStyle,
  
  // Interactive Text
  link: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.medium,
    color: colors.spiceOrange,
    lineHeight: fontSizes.base * lineHeights.normal,
  } as TextStyle,
  
  // Status Text
  success: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    color: colors.success.primary,
    lineHeight: fontSizes.sm * lineHeights.normal,
  } as TextStyle,
  
  warning: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    color: colors.warning.primary,
    lineHeight: fontSizes.sm * lineHeights.normal,
  } as TextStyle,
  
  error: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    color: colors.error.primary,
    lineHeight: fontSizes.sm * lineHeights.normal,
  } as TextStyle,
  
  info: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    color: colors.info.primary,
    lineHeight: fontSizes.sm * lineHeights.normal,
  } as TextStyle,
} as const;

// Typography utility functions
export const getTextStyle = (
  variant: keyof typeof typography,
  overrides?: Partial<TextStyle>
): TextStyle => ({
  ...typography[variant],
  ...overrides,
});

export const getFontSize = (size: keyof typeof fontSizes): number => fontSizes[size];

export const getFontWeight = (weight: keyof typeof fontWeights): string => fontWeights[weight];

// Platform-specific adjustments
export const getPlatformTextStyle = (baseStyle: TextStyle): TextStyle => ({
  ...baseStyle,
  ...Platform.select({
    ios: {
      fontFamily: 'System',
    },
    android: {
      fontFamily: 'Roboto',
    },
  }),
});

export type TypographyVariant = keyof typeof typography;
export type FontSize = keyof typeof fontSizes;
export type FontWeight = keyof typeof fontWeights; 