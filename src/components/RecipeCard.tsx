import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Recipe } from '../types/Recipe';
import { 
  colors, 
  typography, 
  spacing, 
  componentShadows,
  componentBorderRadius,
  lightTheme
} from '../styles';

interface RecipeCardProps {
  recipe: Recipe;
  onPress?: () => void;
  variant?: 'popular' | 'quick' | 'roulette';
  isSelected?: boolean;
  isFavorite?: boolean;
  onFavoritePress?: () => void;
}

const { width: screenWidth } = Dimensions.get('window');

const RecipeCard: React.FC<RecipeCardProps> = ({ 
  recipe, 
  onPress, 
  variant = 'popular',
  isSelected = false,
  isFavorite = false,
  onFavoritePress 
}) => {
  const [imageError, setImageError] = useState(false);

  // Get card dimensions based on variant
  const getCardDimensions = () => {
    switch (variant) {
      case 'popular':
        return {
          width: screenWidth * 0.4,
          height: (screenWidth * 0.4) * 1.3,
        };
      case 'quick':
      case 'roulette':
        return {
          width: 160,
          height: 200,
        };
      default:
        return {
          width: screenWidth * 0.4,
          height: (screenWidth * 0.4) * 1.3,
        };
    }
  };

  // Get image height based on variant
  const getImageHeight = () => {
    const { height } = getCardDimensions();
    switch (variant) {
      case 'popular':
        return height * 0.65; // 65% of card height
      case 'quick':
      case 'roulette':
        return 120; // Fixed height
      default:
        return height * 0.65;
    }
  };

  const cardDimensions = getCardDimensions();
  const imageHeight = getImageHeight();

  return (
    <TouchableOpacity 
      style={[
        styles.card,
        {
          width: cardDimensions.width,
          height: cardDimensions.height,
        },
        variant === 'roulette' && styles.rouletteCard,
        isSelected && styles.selectedCard,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.imageContainer, { height: imageHeight }]}>
        {!imageError ? (
          <Image 
            source={{ uri: recipe.image }} 
            style={styles.image}
            onError={() => {
              setImageError(true);
            }}
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.placeholderText}>🍽️</Text>
          </View>
        )}
        <TouchableOpacity 
          style={styles.favoriteButton}
          onPress={onFavoritePress}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <View style={styles.favoriteIconContainer}>
            <Ionicons 
              name={isFavorite ? "heart" : "heart-outline"} 
              size={18} 
              color={isFavorite ? colors.error.primary : colors.legacy.white} 
            />
          </View>
        </TouchableOpacity>
        <View style={styles.difficultyBadge}>
          <Text style={styles.difficultyText}>{recipe.difficulty}</Text>
        </View>
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.title} numberOfLines={2}>{recipe.name}</Text>
        
        <View style={styles.infoRow}>
          <View style={styles.timeContainer}>
            <Text style={styles.timeIcon}>⏱️</Text>
            <Text style={styles.timeText}>{recipe.cookTime}m</Text>
          </View>
          
          <View style={styles.allergensContainer}>
            {recipe.allergens.slice(0, 2).map((allergen, index) => (
              <Text key={index} style={styles.allergenIcon}>{allergen.icon}</Text>
            ))}
            {recipe.allergens.length > 2 && (
              <Text style={styles.moreAllergens}>+{recipe.allergens.length - 2}</Text>
            )}
          </View>
        </View>
      </View>

      {/* Selected card highlight for roulette */}
      {isSelected && variant === 'roulette' && (
        <View style={styles.selectedCardHighlight} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.legacy.white, // White background for contrast
    borderRadius: componentBorderRadius.card, // Using design system border radius (12px)
    overflow: 'hidden',
    ...componentShadows.card, // Using new shadow system
  },
  rouletteCard: {
    borderRadius: componentBorderRadius.recipeCard, // Using design system border radius (16px)
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: colors.spiceOrange, // Changed from #007AFF to Spice Orange
    ...componentShadows.button, // Using button shadow for selected state
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.warmCreamDark, // Changed from #f0f0f0 to Warm Cream Dark
  },
  placeholderText: {
    fontSize: 24,
  },
  favoriteButton: {
    position: 'absolute',
    top: spacing.s, // Using design system spacing (8px)
    left: spacing.s, // Using design system spacing (8px)
    zIndex: 2,
  },
  favoriteIconContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: componentBorderRadius.input, // Using design system border radius (8px)
    padding: spacing.xs, // Using design system spacing (4px)
    justifyContent: 'center',
    alignItems: 'center',
  },
  difficultyBadge: {
    position: 'absolute',
    top: spacing.s, // Using design system spacing (8px)
    right: spacing.s, // Using design system spacing (8px)
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: spacing.s, // Using design system spacing (8px)
    paddingVertical: spacing.xs, // Using design system spacing (4px)
    borderRadius: componentBorderRadius.input, // Using design system border radius (8px)
  },
  difficultyText: {
    color: colors.legacy.white, // White text
    fontSize: 10,
    fontWeight: typography.h4.fontWeight, // SemiBold weight
  },
  contentContainer: {
    flex: 1,
    padding: spacing.m, // Using design system spacing (16px)
    justifyContent: 'space-between',
  },
  title: {
    ...typography.bodySmall, // Using bodySmall typography (14px, Regular)
    fontWeight: typography.h4.fontWeight, // SemiBold weight
    color: colors.deepNavy, // Changed from #333 to Deep Navy
    lineHeight: 18,
    marginBottom: spacing.s, // Using design system spacing (8px)
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeIcon: {
    fontSize: 12,
    marginRight: spacing.xs, // Using design system spacing (4px)
  },
  timeText: {
    fontSize: 12,
    fontWeight: typography.h4.fontWeight, // SemiBold weight
    color: colors.warmGray, // Changed from #666 to Warm Gray
  },
  allergensContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  allergenIcon: {
    fontSize: 12,
    marginLeft: spacing.xs, // Using design system spacing (4px)
  },
  moreAllergens: {
    fontSize: 10,
    color: colors.warmGrayLight, // Changed from #999 to Warm Gray Light
    marginLeft: spacing.xs, // Using design system spacing (4px)
  },
  selectedCardHighlight: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: colors.spiceOrange, // Changed from #007AFF to Spice Orange
    opacity: 0.6,
  },
});

export default RecipeCard; 