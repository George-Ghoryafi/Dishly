import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { 
  colors, 
  typography, 
  spacing, 
  componentShadows,
  componentBorderRadius,
  componentSpacing,
  lightTheme
} from '../styles';

interface FlipBookPreviewProps {
  onFlipBookPress: () => void;
}

const FlipBookPreview: React.FC<FlipBookPreviewProps> = ({ onFlipBookPress }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Recipe Collections</Text>
          <Text style={styles.subtitle}>Discover curated picks and monthly favorites</Text>
        </View>
      </View>
      
      <View style={styles.content}>
        <TouchableOpacity 
          style={styles.flipBookButton}
          onPress={onFlipBookPress}
          activeOpacity={0.8}
        >
          <View style={styles.iconContainer}>
            <Ionicons name="library" size={24} color={colors.spiceOrange} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.buttonTitle}>Browse Collections</Text>
            <Text style={styles.buttonSubtitle}>Today's picks & monthly favorites</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.warmGray} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xl, // Using design system spacing (32px)
  },
  header: {
    paddingHorizontal: spacing.l, // Using design system spacing (24px)
    marginBottom: spacing.m, // Using design system spacing (16px)
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    ...typography.h3, // Using H3 typography (24px, SemiBold)
    color: colors.deepNavy, // Changed from #333 to Deep Navy
    marginBottom: spacing.xs, // Using design system spacing (4px)
  },
  subtitle: {
    ...typography.bodySmall, // Using bodySmall typography (14px, Regular)
    color: colors.warmGray, // Changed from #666 to Warm Gray
  },
  content: {
    paddingHorizontal: spacing.l, // Using design system spacing (24px)
  },
  flipBookButton: {
    backgroundColor: colors.legacy.white, // White background for contrast
    padding: spacing.l, // Using design system spacing (24px)
    borderRadius: componentBorderRadius.card, // Using design system border radius (12px)
    flexDirection: 'row',
    alignItems: 'center',
    ...componentShadows.card, // Using new shadow system
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.info.background, // Changed from #f0f9ff to info background
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.m, // Using design system spacing (16px)
  },
  textContainer: {
    flex: 1,
  },
  buttonTitle: {
    ...typography.bodyMedium, // Using bodyMedium typography (16px, Regular)
    fontWeight: typography.h4.fontWeight, // SemiBold weight
    color: colors.deepNavy, // Changed from #333 to Deep Navy
    marginBottom: spacing.xs, // Using design system spacing (4px)
  },
  buttonSubtitle: {
    ...typography.bodySmall, // Using bodySmall typography (14px, Regular)
    color: colors.warmGray, // Changed from #666 to Warm Gray
  },
});

export default FlipBookPreview; 