import React, { useState, useRef, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Animated, Platform } from 'react-native';
import { FlipBook, TabSelector, RecipeDetailModal, CookingTimerModal } from '../components';
import { todaysCards, monthlyCards } from '../data/dummyRecipes';
import { Recipe } from '../types/Recipe';
import { favoritesService } from '../services';
import MainHomeScreen from './MainHomeScreen';

const HomeScreen: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'today' | 'month'>('today');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showMainHomepage, setShowMainHomepage] = useState(true);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [recipeModalVisible, setRecipeModalVisible] = useState(false);
  const [cookingTimerVisible, setCookingTimerVisible] = useState(false);
  const [cookingRecipe, setCookingRecipe] = useState<Recipe | null>(null);
  
  // Load favorites on component mount
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const favoriteIds = await favoritesService.getFavorites();
        setFavorites(favoriteIds);
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    };
    
    loadFavorites();
  }, []);
  
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const titleFadeAnim = useRef(new Animated.Value(1)).current;
  
  const currentCards = selectedTab === 'today' ? todaysCards : monthlyCards;
  const headerTitle = selectedTab === 'today' ? "Today's Top Picks" : "This Month's Favorites";

  const handleNavigateToHomepage = () => {
    setShowMainHomepage(true);
  };

  const handleFavoriteToggle = async (recipeId: string) => {
    try {
      const newStatus = await favoritesService.toggleFavorite(recipeId);
      
      // Update local state
      setFavorites(prev => {
        const newFavorites = new Set(prev);
        if (newStatus) {
          newFavorites.add(recipeId);
        } else {
          newFavorites.delete(recipeId);
        }
        return newFavorites;
      });
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleBackToFlipBook = () => {
    setShowMainHomepage(false);
  };

  const handleNavigateToFlipBook = () => {
    setShowMainHomepage(false);
  };

  const handleRecipePress = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setRecipeModalVisible(true);
  };

  const handleCloseRecipeModal = () => {
    setRecipeModalVisible(false);
    setSelectedRecipe(null);
  };

  const handleRecipeFavoriteToggle = () => {
    if (selectedRecipe) {
      handleFavoriteToggle(selectedRecipe.id);
    }
  };

  const handleStartCooking = (recipe: Recipe) => {
    setCookingRecipe(recipe);
    setRecipeModalVisible(false);
    setSelectedRecipe(null);
    setCookingTimerVisible(true);
  };

  const handleCookingTimerClose = () => {
    setCookingTimerVisible(false);
    setCookingRecipe(null);
  };

  const handleCookingComplete = () => {
    setCookingTimerVisible(false);
    setCookingRecipe(null);
    console.log('Cooking completed!');
  };

  const handleTabChange = (newTab: 'today' | 'month') => {
    if (newTab === selectedTab || isTransitioning) return;
    
    setIsTransitioning(true);
    
    // Start exit animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: newTab === 'today' ? 50 : -50,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(titleFadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Change the tab after exit animation
      setSelectedTab(newTab);
      
      // Reset position for entrance
      slideAnim.setValue(newTab === 'today' ? -50 : 50);
      
      // Start entrance animations
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(titleFadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsTransitioning(false);
      });
    });
  };

  const animatedStyle = {
    opacity: fadeAnim,
    transform: [{ translateX: slideAnim }],
  };

  const titleAnimatedStyle = {
    opacity: titleFadeAnim,
  };

  if (showMainHomepage) {
    return (
      <MainHomeScreen 
        favorites={favorites} 
        onFavoriteToggle={handleFavoriteToggle}
        onBackToFlipBook={handleNavigateToFlipBook}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Animated.View style={titleAnimatedStyle}>
          <Text style={styles.title}>{headerTitle}</Text>
        </Animated.View>
        <Text style={styles.subtitle}>Swipe to discover amazing recipes</Text>
      </View>
      
      <TabSelector 
        selectedTab={selectedTab} 
        onTabChange={handleTabChange} 
      />
      
      <Animated.View style={[styles.flipBookContainer, animatedStyle]}>
        <FlipBook 
          cards={currentCards}
          onNavigateToHomepage={handleNavigateToHomepage}
          favorites={favorites}
          onFavoriteToggle={handleFavoriteToggle}
          onRecipePress={handleRecipePress}
          key={selectedTab} // Force re-render when tab changes
        />
      </Animated.View>

      <RecipeDetailModal
        visible={recipeModalVisible}
        recipe={selectedRecipe}
        onClose={handleCloseRecipeModal}
        isFavorite={selectedRecipe ? favorites.has(selectedRecipe.id) : false}
        onFavoriteToggle={handleRecipeFavoriteToggle}
        onStartCooking={handleStartCooking}
      />

      <CookingTimerModal
        visible={cookingTimerVisible}
        recipe={cookingRecipe}
        onClose={handleCookingTimerClose}
        onComplete={handleCookingComplete}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 50 : 20,
    paddingBottom: Platform.OS === 'android' ? 20 : 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: Platform.OS === 'android' ? 12 : 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  flipBookContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default HomeScreen; 