import React, { useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, Animated, Dimensions } from 'react-native';
import { Recipe } from '../types/Recipe';
import RecipeCard from './RecipeCard';

const { width: screenWidth } = Dimensions.get('window');

interface QuickWinsProps {
  recipes: Recipe[];
  onRecipePress?: (recipe: Recipe) => void;
}

const QuickWins: React.FC<QuickWinsProps> = ({ recipes, onRecipePress }) => {
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
    marginBottom: 32,
  },
  header: {
    paddingHorizontal: 20,
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
});

export default QuickWins; 