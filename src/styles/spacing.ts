// Base spacing unit
export const BASE_UNIT = 8;

// Spacing scale
export const spacing = {
  xs: BASE_UNIT * 0.5,    // 4px
  s: BASE_UNIT,           // 8px
  m: BASE_UNIT * 2,       // 16px
  l: BASE_UNIT * 3,       // 24px
  xl: BASE_UNIT * 4,      // 32px
  xxl: BASE_UNIT * 6,     // 48px
  xxxl: BASE_UNIT * 8,    // 64px
} as const;

// Layout spacing
export const layout = {
  containerPadding: 20,
  cardSpacing: spacing.m,
  sectionSpacing: spacing.xl,
  screenPadding: spacing.l,
} as const;

// Component-specific spacing
export const componentSpacing = {
  // Button padding
  buttonPadding: {
    horizontal: spacing.l,
    vertical: spacing.m,
  },
  
  // Input padding
  inputPadding: {
    horizontal: spacing.m,
    vertical: spacing.m,
  },
  
  // Card padding
  cardPadding: {
    horizontal: spacing.m,
    vertical: spacing.m,
  },
  
  // Header padding
  headerPadding: {
    horizontal: spacing.l,
    vertical: spacing.m,
  },
  
  // Modal padding
  modalPadding: {
    horizontal: spacing.l,
    vertical: spacing.l,
  },
} as const;

// Border radius values
export const borderRadius = {
  xs: 4,
  s: 8,
  m: 12,
  l: 16,
  xl: 20,
  xxl: 24,
  round: 50, // For circular elements
} as const;

// Component-specific border radius
export const componentBorderRadius = {
  button: borderRadius.m,
  input: borderRadius.m,
  card: borderRadius.l,
  recipeCard: borderRadius.l,
  modal: borderRadius.xxl,
  badge: borderRadius.round,
} as const;

// Touch target sizes
export const touchTargets = {
  minimum: 44,
  small: 32,
  medium: 48,
  large: 56,
} as const;

// Spacing utility functions
export const getSpacing = (size: keyof typeof spacing): number => spacing[size];

export const getLayoutSpacing = (key: keyof typeof layout): number => layout[key];

export const getComponentSpacing = (
  component: keyof typeof componentSpacing,
  direction: 'horizontal' | 'vertical'
): number => componentSpacing[component][direction];

export const getBorderRadius = (size: keyof typeof borderRadius): number => borderRadius[size];

export const getComponentBorderRadius = (component: keyof typeof componentBorderRadius): number => 
  componentBorderRadius[component];

// Responsive spacing (for different screen sizes)
export const responsiveSpacing = {
  small: {
    containerPadding: 16,
    cardSpacing: 12,
    sectionSpacing: 24,
  },
  medium: {
    containerPadding: 20,
    cardSpacing: 16,
    sectionSpacing: 32,
  },
  large: {
    containerPadding: 24,
    cardSpacing: 20,
    sectionSpacing: 40,
  },
} as const;

// Spacing presets for common use cases
export const spacingPresets = {
  // Stack spacing (vertical)
  stack: {
    xs: spacing.xs,
    s: spacing.s,
    m: spacing.m,
    l: spacing.l,
    xl: spacing.xl,
  },
  
  // Inline spacing (horizontal)
  inline: {
    xs: spacing.xs,
    s: spacing.s,
    m: spacing.m,
    l: spacing.l,
    xl: spacing.xl,
  },
  
  // Section spacing
  section: {
    xs: spacing.m,
    s: spacing.l,
    m: spacing.xl,
    l: spacing.xxl,
    xl: spacing.xxxl,
  },
} as const;

export type SpacingSize = keyof typeof spacing;
export type LayoutSpacing = keyof typeof layout;
export type BorderRadiusSize = keyof typeof borderRadius;
export type ComponentSpacing = keyof typeof componentSpacing; 