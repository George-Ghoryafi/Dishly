import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, ActivityIndicator } from 'react-native';
import { Recipe } from '../../types/Recipe';

interface RecipeCardProps {
  recipe: Recipe;
}

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = screenWidth * 0.85;
const CARD_HEIGHT = CARD_WIDTH * 1.4;

// Cache to track loaded images
const imageLoadCache = new Map<string, boolean>();

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
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
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        {imageLoading && !imageError && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
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
            <Text style={styles.placeholderSubtext}>Image not available</Text>
          </View>
        )}
        <View style={styles.difficultyBadge}>
          <Text style={styles.difficultyText}>{recipe.difficulty}</Text>
        </View>
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{recipe.name}</Text>
        <Text style={styles.description}>{recipe.description}</Text>
        
        <View style={styles.infoRow}>
          <View style={styles.timeContainer}>
            <Text style={styles.timeIcon}>⏱️</Text>
            <Text style={styles.timeText}>{recipe.cookTime} min</Text>
          </View>
          
          <View style={styles.allergensContainer}>
            {recipe.allergens.map((allergen, index) => (
              <View key={index} style={styles.allergenChip}>
                <Text style={styles.allergenIcon}>{allergen.icon}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
  },
  imageContainer: {
    height: '60%',
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
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  placeholderText: {
    fontSize: 48,
    marginBottom: 8,
  },
  placeholderSubtext: {
    fontSize: 14,
    color: '#666',
  },
  difficultyBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  difficultyText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    flex: 1,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  allergensContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  allergenChip: {
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  allergenIcon: {
    fontSize: 16,
  },
});

export default RecipeCard; 