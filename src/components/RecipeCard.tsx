import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, Platform } from 'react-native';
import { Recipe } from '../types/Recipe';

interface RecipeCardProps {
  recipe: Recipe;
  onPress?: () => void;
  variant?: 'popular' | 'quick' | 'roulette';
  isSelected?: boolean;
}

const { width: screenWidth } = Dimensions.get('window');

// Cache to track loaded images
const imageLoadCache = new Map<string, boolean>();

const RecipeCard: React.FC<RecipeCardProps> = ({ 
  recipe, 
  onPress, 
  variant = 'popular',
  isSelected = false 
}) => {
  const [imageLoading, setImageLoading] = useState(!imageLoadCache.has(recipe.image));
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    // Reset states when recipe changes
    if (imageLoadCache.has(recipe.image)) {
      setImageLoading(false);
      setImageError(false);
    } else {
      setImageLoading(true);
      setImageError(false);
    }
  }, [recipe.image]);

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
        {imageLoading && !imageError && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>📷</Text>
          </View>
        )}
        {!imageError ? (
          <Image 
            source={{ uri: recipe.image }} 
            style={styles.image}
            onLoad={() => {
              setImageLoading(false);
              imageLoadCache.set(recipe.image, true);
            }}
            onError={() => {
              setImageLoading(false);
              setImageError(true);
            }}
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.placeholderText}>🍽️</Text>
          </View>
        )}
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
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.12,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  rouletteCard: {
    borderRadius: 16,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: '#007AFF',
    ...Platform.select({
      ios: {
        shadowColor: '#007AFF',
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  loadingContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    zIndex: 1,
  },
  loadingText: {
    fontSize: 24,
    opacity: 0.5,
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  placeholderText: {
    fontSize: 24,
  },
  difficultyBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    lineHeight: 18,
    marginBottom: 8,
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
    marginRight: 4,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  allergensContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  allergenIcon: {
    fontSize: 12,
    marginLeft: 2,
  },
  moreAllergens: {
    fontSize: 10,
    color: '#999',
    marginLeft: 4,
  },
  selectedCardHighlight: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#007AFF',
    opacity: 0.6,
  },
});

export default RecipeCard; 