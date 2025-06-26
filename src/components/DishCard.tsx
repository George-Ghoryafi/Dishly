import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, Platform } from 'react-native';
import { Recipe } from '../types/Recipe';

interface DishCardProps {
  recipe: Recipe;
  onPress?: () => void;
}

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = screenWidth * 0.4;
const CARD_HEIGHT = CARD_WIDTH * 1.3;

// Cache to track loaded images
const imageLoadCache = new Map<string, boolean>();

const DishCard: React.FC<DishCardProps> = ({ recipe, onPress }) => {
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

  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
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
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
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
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  imageContainer: {
    height: '65%',
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
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
  },
  difficultyText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
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
    color: '#333',
  },
  allergensContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  allergenIcon: {
    fontSize: 12,
  },
  moreAllergens: {
    fontSize: 10,
    color: '#666',
    fontWeight: '500',
  },
});

export default DishCard; 