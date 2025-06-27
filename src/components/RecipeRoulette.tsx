import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Animated, Dimensions } from 'react-native';
import { Recipe } from '../types/Recipe';
import RecipeCard from './RecipeCard';

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
    marginBottom: 32,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  spinButton: {
    backgroundColor: '#007AFF',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#007AFF',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  spinButtonDisabled: {
    backgroundColor: '#ccc',
    ...Platform.select({
      ios: {
        shadowColor: '#ccc',
        shadowOpacity: 0.1,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  spinButtonText: {
    fontSize: 20,
  },
  selectionPointer: {
    alignItems: 'center',
    marginBottom: 8,
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
    borderTopColor: '#007AFF',
    marginBottom: 2,
  },
  pointerEmoji: {
    fontSize: 16,
    marginTop: -2,
  },
  scrollView: {
    paddingLeft: 20,
  },
  scrollContent: {
    paddingRight: 20,
  },
  cardContainer: {
    marginRight: 16,
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
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 16,
  },
  resultContainer: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#f8f9fa',
    marginHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  resultText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  resultRecipeName: {
    fontWeight: 'bold',
    color: '#007AFF',
  },
  resultSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default RecipeRoulette; 