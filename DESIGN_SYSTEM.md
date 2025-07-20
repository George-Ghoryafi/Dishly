# Recipic App Design System

## Overview

This document outlines the comprehensive design system for the Recipic app - an AI-powered food recipe companion. The design philosophy focuses on creating a warm, inviting, and appetizing experience that feels more like a culinary companion than a sterile learning app.

## Design Philosophy

### Core Principles
1. **Warm & Inviting**: Use warm, food-inspired colors that evoke hunger and culinary creativity
2. **Appetizing**: Create visual hierarchy that makes food content the hero
3. **Modern & Clean**: Maintain clean design while avoiding sterile white backgrounds
4. **Accessible**: Ensure all color combinations meet WCAG AA standards
5. **Consistent**: Establish a unified visual language across all components

### Brand Personality
- **Friendly**: Approachable and encouraging
- **Passionate**: Celebrating the joy of cooking
- **Innovative**: Embracing AI and modern technology
- **Reliable**: Trustworthy and dependable

## Color Palette

### Primary Colors (6 colors)

#### 1. **Warm Cream** - `#FDF8F3`
- **Usage**: Primary background color, replacing sterile white
- **Purpose**: Creates warm, inviting base that feels like a kitchen
- **Accessibility**: High contrast with dark text
- **Variants**: 
  - Light: `#FEFCF9` (subtle variations)
  - Dark: `#F5E6D3` (for depth)

#### 2. **Spice Orange** - `#FF6B35`
- **Usage**: Primary accent color, call-to-action buttons, highlights
- **Purpose**: Evokes warmth, energy, and culinary passion
- **Accessibility**: Excellent contrast with light backgrounds
- **Variants**:
  - Light: `#FF8A65` (hover states)
  - Dark: `#E55A2B` (pressed states)

#### 3. **Sage Green** - `#4A7C59`
- **Usage**: Secondary accent, success states, organic/natural elements
- **Purpose**: Represents fresh ingredients and healthy cooking
- **Accessibility**: Good contrast with light backgrounds
- **Variants**:
  - Light: `#6B8E7A` (subtle accents)
  - Dark: `#3A5F47` (emphasis)

#### 4. **Deep Navy** - `#2C3E50`
- **Usage**: Primary text, headers, navigation elements
- **Purpose**: Provides strong contrast and professional feel
- **Accessibility**: Excellent readability
- **Variants**:
  - Light: `#34495E` (secondary text)
  - Dark: `#1B2631` (emphasis)

#### 5. **Warm Gray** - `#8B7355`
- **Usage**: Secondary text, borders, subtle elements
- **Purpose**: Neutral tone that complements the warm palette
- **Accessibility**: Good contrast with light backgrounds
- **Variants**:
  - Light: `#A69B8B` (disabled states)
  - Dark: `#6B5B47` (emphasis)

#### 6. **Coral Pink** - `#E67E22`
- **Usage**: Tertiary accent, special features, premium elements
- **Purpose**: Adds vibrancy and excitement to the palette
- **Accessibility**: Good contrast with light backgrounds
- **Variants**:
  - Light: `#F39C12` (subtle accents)
  - Dark: `#D35400` (emphasis)

### Semantic Colors

#### Success
- **Primary**: `#4A7C59` (Sage Green)
- **Background**: `#F0F7F2`
- **Border**: `#C8E6C9`

#### Warning
- **Primary**: `#E67E22` (Coral Pink)
- **Background**: `#FFF8E1`
- **Border**: `#FFE082`

#### Error
- **Primary**: `#E74C3C`
- **Background**: `#FFEBEE`
- **Border**: `#FFCDD2`

#### Info
- **Primary**: `#2C3E50` (Deep Navy)
- **Background**: `#F5F7FA`
- **Border**: `#E3E8F0`

## Typography

### Font Hierarchy

#### Headers
- **H1**: 32px, Bold, `#2C3E50`
- **H2**: 28px, Bold, `#2C3E50`
- **H3**: 24px, SemiBold, `#2C3E50`
- **H4**: 20px, SemiBold, `#2C3E50`

#### Body Text
- **Large**: 18px, Regular, `#2C3E50`
- **Medium**: 16px, Regular, `#2C3E50`
- **Small**: 14px, Regular, `#8B7355`
- **Caption**: 12px, Regular, `#8B7355`

#### Special Text
- **Recipe Titles**: 22px, Bold, `#2C3E50`
- **Button Text**: 16px, SemiBold, `#FFFFFF`
- **Navigation**: 17px, SemiBold, `#2C3E50`

## Component Design

### Cards & Containers

#### Recipe Cards
- **Background**: `#FFFFFF`
- **Border**: `1px solid #E8E0D8`
- **Border Radius**: 16px
- **Shadow**: 
  - iOS: `0 4px 12px rgba(139, 115, 85, 0.15)`
  - Android: `elevation: 4`

#### Content Cards
- **Background**: `#FDF8F3`
- **Border**: `1px solid #E8E0D8`
- **Border Radius**: 12px
- **Shadow**: 
  - iOS: `0 2px 8px rgba(139, 115, 85, 0.1)`
  - Android: `elevation: 2`

### Buttons

#### Primary Button
- **Background**: `#FF6B35`
- **Text**: `#FFFFFF`
- **Border Radius**: 12px
- **Padding**: 16px 24px
- **States**:
  - Pressed: `#E55A2B`
  - Disabled: `#A69B8B`

#### Secondary Button
- **Background**: `#FDF8F3`
- **Text**: `#FF6B35`
- **Border**: `2px solid #FF6B35`
- **Border Radius**: 12px
- **Padding**: 16px 24px

#### Tertiary Button
- **Background**: Transparent
- **Text**: `#8B7355`
- **Border**: None
- **Padding**: 12px 16px

### Input Fields

#### Text Input
- **Background**: `#FFFFFF`
- **Border**: `2px solid #E8E0D8`
- **Border Radius**: 12px
- **Text**: `#2C3E50`
- **Placeholder**: `#A69B8B`
- **Focus State**: `2px solid #FF6B35`

#### Search Input
- **Background**: `#F5F0EB`
- **Border**: `1px solid #E8E0D8`
- **Border Radius**: 12px
- **Icon**: `#8B7355`

### Navigation

#### Tab Bar
- **Background**: `#FFFFFF`
- **Active Tab**: `#FF6B35`
- **Inactive Tab**: `#8B7355`
- **Border**: `1px solid #E8E0D8`

#### Header
- **Background**: `#FDF8F3`
- **Title**: `#2C3E50`
- **Back Button**: `#FF6B35`

## Layout & Spacing

### Grid System
- **Base Unit**: 8px
- **Container Padding**: 20px
- **Card Spacing**: 16px
- **Section Spacing**: 32px

### Margins & Padding
- **XS**: 4px
- **S**: 8px
- **M**: 16px
- **L**: 24px
- **XL**: 32px
- **XXL**: 48px

## Theme Support

### Light Theme (Default)
- **Primary Background**: `#FDF8F3`
- **Secondary Background**: `#FFFFFF`
- **Tertiary Background**: `#F5F0EB`
- **Primary Text**: `#2C3E50`
- **Secondary Text**: `#8B7355`
- **Borders**: `#E8E0D8`

### Dark Theme (Future Implementation)
- **Primary Background**: `#1A1A1A`
- **Secondary Background**: `#2D2D2D`
- **Tertiary Background**: `#3A3A3A`
- **Primary Text**: `#FFFFFF`
- **Secondary Text**: `#B0B0B0`
- **Borders**: `#404040`
- **Accent Colors**: Adjusted for dark theme visibility

## Implementation Guidelines

### File Structure
```
src/
├── styles/
│   ├── colors.ts          # Color definitions
│   ├── typography.ts      # Typography styles
│   ├── spacing.ts         # Spacing utilities
│   ├── shadows.ts         # Shadow definitions
│   └── theme.ts           # Theme configuration
├── constants/
│   └── design.ts          # Design constants
```

### Color Usage Rules
1. **Never use pure white (#FFFFFF)** as a primary background
2. **Always use semantic colors** for status indicators
3. **Maintain contrast ratios** of at least 4.5:1 for text
4. **Use color variants** for different states (hover, pressed, disabled)
5. **Apply consistent shadows** across similar components

### Component Guidelines
1. **Use the defined color palette** exclusively
2. **Apply consistent border radius** (12px for cards, 16px for recipe cards)
3. **Use defined spacing values** from the spacing system
4. **Implement proper shadow hierarchy** based on component importance
5. **Ensure accessibility** with proper contrast ratios

### Migration Strategy
1. **Phase 1**: Update color constants and theme files
2. **Phase 2**: Update core components (buttons, inputs, cards)
3. **Phase 3**: Update screens and navigation
4. **Phase 4**: Update modals and overlays
5. **Phase 5**: Final polish and accessibility testing

## Accessibility Standards

### Color Contrast
- **Normal Text**: Minimum 4.5:1 ratio
- **Large Text**: Minimum 3:1 ratio
- **UI Components**: Minimum 3:1 ratio

### Touch Targets
- **Minimum Size**: 44px x 44px
- **Spacing**: At least 8px between interactive elements

### Focus Indicators
- **Visible Focus**: Clear focus indicators for keyboard navigation
- **Color**: Use `#FF6B35` for focus states

## Animation & Interaction

### Transitions
- **Duration**: 200ms for micro-interactions, 300ms for page transitions
- **Easing**: `ease-out` for most interactions
- **Spring**: Use spring animations for bouncy, playful interactions

### Hover & Press States
- **Scale**: 1.02 for subtle hover effects
- **Shadow**: Increase shadow depth for pressed states
- **Color**: Use color variants for state changes

## Iconography

### Style Guidelines
- **Weight**: Medium weight for consistency
- **Size**: 24px for standard icons, 20px for small icons
- **Color**: Use semantic colors from the palette
- **Padding**: 8px minimum around icons

### Icon Categories
- **Navigation**: `#2C3E50`
- **Actions**: `#FF6B35`
- **Status**: Semantic colors (success, warning, error)
- **Decorative**: `#8B7355`

## Future Considerations

### Dark Mode
- All colors have dark theme variants defined
- Implementation should follow system preferences
- Maintain accessibility standards in both themes

### Customization
- Consider user preference for accent colors
- Maintain brand consistency while allowing personalization
- Ensure accessibility with any custom color choices

### Performance
- Use CSS custom properties for theme switching
- Optimize color calculations for smooth transitions
- Consider reduced motion preferences

---

This design system provides a comprehensive foundation for creating a warm, inviting, and professional food app experience that moves away from the sterile white aesthetic while maintaining usability and accessibility. 