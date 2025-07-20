import React, { useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, Animated, Dimensions } from 'react-native';
import { Recipe } from '../types/Recipe';
import RecipeCard from './RecipeCard';
import { 
  colors, 
  typography, 
  spacing, 
  componentShadows,
  componentBorderRadius,
  lightTheme
} from '../styles';

const { width: screenWidth } = Dimensions.get('window');

interface QuickWinsProps {
  recipes: Recipe[];
  onRecipePress?: (recipe: Recipe) => void;
  favorites?: Set<string>;
  onFavoriteToggle?: (recipeId: string) => void;
}

const QuickWins: React.FC<QuickWinsProps> = ({ recipes, onRecipePress, favorites = new Set(), onFavoriteToggle }) => {
  // Filter recipes that are 15 minutes or less
  const quickRecipes = recipes.filter(recipe => recipe.cookTime <= 15);
  const scrollX = useRef(new Animated.Value(0)).current;
  const cardWidth = 160 + 16; // Card width + margin

  const renderQuickCard = (recipe: Recipe, index: number) => {
    const inputRange = [
      (index - 1) * cardWidth,
      index * cardWidth,
      (index + 1) * cardWidth,
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.95, 1, 0.95],
      extrapolate: 'clamp',
    });

    const blurOpacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.6, 0, 0.6],
      extrapolate: 'clamp',
    });

    return (
      <View key={recipe.id} style={styles.cardContainer}>
        <Animated.View
          style={[
            styles.cardWrapper,
            {
              transform: [{ scale }],
            },
          ]}
        >
          <RecipeCard
            recipe={recipe}
            variant="quick"
            onPress={() => onRecipePress?.(recipe)}
            isFavorite={favorites.has(recipe.id)}
            onFavoritePress={() => onFavoriteToggle?.(recipe.id)}
          />
          
          <Animated.View 
            style={[
              styles.blurOverlay,
              {
                opacity: blurOpacity,
              }
            ]}
            pointerEvents="none"
          />
        </Animated.View>
      </View>
    );
  };

  if (quickRecipes.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Quick Wins</Text>
          <Text style={styles.subtitle}>Ready in 15 minutes or less</Text>
        </View>
      </View>

      <Animated.ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {quickRecipes.map((recipe, index) => renderQuickCard(recipe, index))}
      </Animated.ScrollView>
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
  scrollView: {
    paddingLeft: spacing.l, // Using design system spacing (24px)
  },
  scrollContent: {
    paddingRight: spacing.l, // Using design system spacing (24px)
  },
  cardContainer: {
    marginRight: spacing.m, // Using design system spacing (16px)
  },
  cardWrapper: {
    position: 'relative',
  },
  blurOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.warmCreamLight + '66', // Using warm cream light with opacity
    borderRadius: componentBorderRadius.recipeCard, // Using design system border radius (16px)
  },
});

export default QuickWins; 