import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Animated, Dimensions } from 'react-native';
import { Recipe } from '../types/Recipe';
import RecipeCard from './RecipeCard';
import { 
  colors, 
  typography, 
  spacing, 
  shadows,
  componentShadows,
  componentBorderRadius,
  componentSpacing,
  lightTheme
} from '../styles';

const { width: screenWidth } = Dimensions.get('window');

interface RecipeRouletteProps {
  recipes: Recipe[];
  onRecipeSelect?: (recipe: Recipe) => void;
  favorites?: Set<string>;
  onFavoriteToggle?: (recipeId: string) => void;
}

const RecipeRoulette: React.FC<RecipeRouletteProps> = ({ recipes, onRecipeSelect, favorites = new Set(), onFavoriteToggle }) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const cardWidth = 160 + 16; // Card width + margin

  // Create infinite loop by duplicating recipes multiple times
  const infiniteRecipes = React.useMemo(() => {
    if (recipes.length === 0) return [];
    
    // Duplicate recipes 5 times to create seamless loop effect
    const duplications = 5;
    const infinite: Recipe[] = [];
    
    for (let i = 0; i < duplications; i++) {
      infinite.push(...recipes.map(recipe => ({
        ...recipe,
        id: `${recipe.id}-${i}` // Ensure unique IDs
      })));
    }
    
    return infinite;
  }, [recipes]);

  const handleSpin = () => {
    if (isSpinning || recipes.length === 0) return;

    setIsSpinning(true);
    setSelectedRecipe(null);

    // Generate random selection from original recipes
    const randomIndex = Math.floor(Math.random() * recipes.length);
    const selectedRecipe = recipes[randomIndex];
    
    // Calculate multiple full rotations (4-7 full cycles)
    const fullRotations = 4 + Math.random() * 3;
    const totalSpinDistance = fullRotations * recipes.length * cardWidth;
    
    // Add the final position (middle duplication set + random offset)
    const middleDuplicationStart = Math.floor(infiniteRecipes.length / 2 / recipes.length) * recipes.length;
    const finalCardIndex = middleDuplicationStart + randomIndex;
    const finalPosition = finalCardIndex * cardWidth - (screenWidth / 2) + (cardWidth / 2);
    
    const finalScrollX = totalSpinDistance + finalPosition;

    // Longer animation with better easing
    Animated.timing(scrollX, {
      toValue: finalScrollX,
      duration: 4500 + Math.random() * 1500, // 4.5-6 seconds
      useNativeDriver: false,
    }).start(() => {
      // Snap to the exact final position
      scrollViewRef.current?.scrollTo({
        x: finalPosition,
        animated: true,
      });
      
      setTimeout(() => {
        setSelectedRecipe(selectedRecipe);
        setIsSpinning(false);
        onRecipeSelect?.(selectedRecipe);
      }, 300);
    });

    // Scroll the ScrollView for visual effect
    scrollViewRef.current?.scrollTo({
      x: finalScrollX,
      animated: true,
    });
  };

  const renderCard = (recipe: Recipe, index: number) => {
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

    // Check if this is the selected recipe (compare original IDs)
    const originalId = recipe.id.split('-')[0];
    const isSelected = selectedRecipe ? selectedRecipe.id === originalId : false;

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
            variant="roulette"
            isSelected={isSelected}
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Recipe Roulette</Text>
            <Text style={styles.subtitle}>Spin to discover your next dish</Text>
          </View>
          <TouchableOpacity
            style={[styles.spinButton, isSpinning && styles.spinButtonDisabled]}
            onPress={handleSpin}
            disabled={isSpinning}
            activeOpacity={0.7}
          >
            <Text style={styles.spinButtonText}>
              {isSpinning ? '🌀' : '🎲'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Selection pointer - positioned above the carousel */}
      <View style={styles.selectionPointer}>
        <View style={styles.pointerTriangle} />
      </View>

      <Animated.ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        scrollEnabled={!isSpinning}
      >
        {infiniteRecipes.map((recipe, index) => renderCard(recipe, index))}
      </Animated.ScrollView>

      {selectedRecipe && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>
            🎉 <Text style={styles.resultRecipeName}>{selectedRecipe.name}</Text>
          </Text>
          <Text style={styles.resultSubtext}>
            Ready in {selectedRecipe.cookTime} minutes • {selectedRecipe.difficulty}
          </Text>
        </View>
      )}
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
  spinButton: {
    backgroundColor: colors.spiceOrange, // Changed from #007AFF to Spice Orange
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.s, // Using design system spacing (8px)
    ...componentShadows.button, // Using new shadow system
  },
  spinButtonDisabled: {
    backgroundColor: colors.warmGrayLight, // Changed from #ccc to Warm Gray Light
    ...shadows.light, // Using lighter shadow for disabled state
  },
  spinButtonText: {
    fontSize: 20,
  },
  selectionPointer: {
    alignItems: 'center',
    marginBottom: spacing.s, // Using design system spacing (8px)
    zIndex: 10,
  },
  pointerTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: colors.spiceOrange, // Changed from #007AFF to Spice Orange
    marginBottom: 2,
  },
  pointerEmoji: {
    fontSize: 16,
    marginTop: -2,
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
  resultContainer: {
    marginTop: spacing.m, // Using design system spacing (16px)
    paddingHorizontal: spacing.l, // Using design system spacing (24px)
    paddingVertical: spacing.m, // Using design system spacing (16px)
    backgroundColor: colors.info.background, // Changed from #f8f9fa to info background
    marginHorizontal: spacing.l, // Using design system spacing (24px)
    borderRadius: componentBorderRadius.card, // Using design system border radius (12px)
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.info.border, // Changed from #e9ecef to info border
  },
  resultText: {
    ...typography.bodyLarge, // Using bodyLarge typography (18px, Regular)
    color: colors.deepNavy, // Changed from #333 to Deep Navy
    textAlign: 'center',
    marginBottom: spacing.xs, // Using design system spacing (4px)
  },
  resultRecipeName: {
    fontWeight: typography.h4.fontWeight, // SemiBold weight
    color: colors.spiceOrange, // Changed from #007AFF to Spice Orange
  },
  resultSubtext: {
    ...typography.bodySmall, // Using bodySmall typography (14px, Regular)
    color: colors.warmGray, // Changed from #666 to Warm Gray
    textAlign: 'center',
  },
});

export default RecipeRoulette; 