import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Animated, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Header, FlipBookPreview, PopularDishes, QuickWins, RecipeRoulette, KitchenStreak, SearchModal, RecipeDetailModal, CookingTimerModal } from '../components';
import { todaysRecipes, monthlyRecipes, quickWinRecipes } from '../data/dummyRecipes';
import { Recipe } from '../types/Recipe';
import { BottomTabParamList } from '../navigation/BottomTabNavigator';

type MainHomeScreenNavigationProp = BottomTabNavigationProp<BottomTabParamList, 'Home'>;

interface MainHomeScreenProps {
  favorites?: Set<string>;
  onFavoriteToggle?: (recipeId: string) => void;
  onBackToFlipBook?: () => void;
}

const MainHomeScreen: React.FC<MainHomeScreenProps> = ({ favorites = new Set(), onFavoriteToggle, onBackToFlipBook }) => {
  const navigation = useNavigation<MainHomeScreenNavigationProp>();
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [searchButtonLayout, setSearchButtonLayout] = useState<{ x: number; y: number; width: number; height: number } | undefined>();
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [recipeModalVisible, setRecipeModalVisible] = useState(false);
  const [cookingTimerVisible, setCookingTimerVisible] = useState(false);
  const [cookingRecipe, setCookingRecipe] = useState<Recipe | null>(null);
  const insets = useSafeAreaInsets();
  
  // Header animation
  const headerTranslateY = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);
  const scrollDirection = useRef<'up' | 'down'>('up');
  const [headerHeight, setHeaderHeight] = useState(0);

  const handleProfilePress = () => {
    // TODO: Navigate to profile screen
    console.log('Profile pressed');
  };

  const handleDishPress = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setRecipeModalVisible(true);
  };

  const handleSearchPress = (layout: { x: number; y: number; width: number; height: number }) => {
    setSearchButtonLayout(layout);
    setSearchModalVisible(true);
  };

  const handleSearch = (query: string) => {
    // TODO: Implement search functionality
    console.log('Search query:', query);
  };

  const handleCategoryPress = (category: any) => {
    // TODO: Navigate to category results
    console.log('Category pressed:', category.name);
  };

  const handleRecipeSelect = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setRecipeModalVisible(true);
  };

  const handleFlipBookPress = () => {
    console.log('FlipBook pressed - navigating to flipbook');
    onBackToFlipBook?.();
  };

  const handleCloseRecipeModal = () => {
    setRecipeModalVisible(false);
    setSelectedRecipe(null);
  };

  const handleRecipeFavoriteToggle = () => {
    if (selectedRecipe) {
      onFavoriteToggle?.(selectedRecipe.id);
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
    // TODO: Update cooking streak or other completion logic
    console.log('Cooking completed!');
  };

  const handleScroll = (event: any) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    const scrollDifference = currentScrollY - lastScrollY.current;
    
    // Only trigger animation if we've scrolled a reasonable amount
    if (Math.abs(scrollDifference) > 5) {
      if (scrollDifference > 0 && scrollDirection.current !== 'down' && currentScrollY > 0) {
        // Scrolling down - hide header (but only if we're not in the bounce area)
        scrollDirection.current = 'down';
        Animated.timing(headerTranslateY, {
          toValue: -(headerHeight + insets.top), // Dynamic height calculation
          duration: 200,
          useNativeDriver: true,
        }).start();
      } else if (scrollDifference < 0 && scrollDirection.current !== 'up') {
        // Scrolling up - show header
        scrollDirection.current = 'up';
        Animated.timing(headerTranslateY, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }
    }
    
    lastScrollY.current = currentScrollY;
  };

  const handleHeaderLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    setHeaderHeight(height);
  };



  // Combine and shuffle recipes for popular dishes
  const popularDishes = [...todaysRecipes, ...monthlyRecipes.slice(0, 3)];

  // All recipes for the roulette
  const allRecipes = [...todaysRecipes, ...monthlyRecipes, ...quickWinRecipes];

  // Mock streak data - this would come from user preferences/storage
  // Assuming today is Thursday (index 4), let's create a proper 3-day streak
  const streakData = {
    currentStreak: 3,
    todayCompleted: false,
    weekProgress: [false, true, true, true, false, false, false] // S, M, T, W, T, F, S
    // This shows: Monday(1), Tuesday(2), Wednesday(3) cooked = 3-day streak
    // Today is Thursday(4) - not cooked yet, opportunity to extend to 4 days
  };

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.headerContainer,
          {
            transform: [{ translateY: headerTranslateY }],
          }
        ]}
        onLayout={handleHeaderLayout}
      >
        <Header 
          onProfilePress={handleProfilePress}
          onSearchPress={handleSearchPress}
          searchPlaceholder="Search for recipes and dishes..."
        />
      </Animated.View>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          contentContainerStyle={[
            styles.scrollContent,
            { 
              paddingTop: headerHeight + (Platform.OS === 'ios' ? -15 : 5)
            }
          ]}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          <FlipBookPreview onFlipBookPress={handleFlipBookPress} />
          
          <PopularDishes 
            dishes={popularDishes} 
            onDishPress={handleDishPress}
            favorites={favorites}
            onFavoriteToggle={onFavoriteToggle}
          />
          
          <QuickWins 
            recipes={quickWinRecipes}
            onRecipePress={handleDishPress}
            favorites={favorites}
            onFavoriteToggle={onFavoriteToggle}
          />

          <RecipeRoulette 
            recipes={allRecipes}
            onRecipeSelect={handleRecipeSelect}
            favorites={favorites}
            onFavoriteToggle={onFavoriteToggle}
          />

          <KitchenStreak
            currentStreak={streakData.currentStreak}
            todayCompleted={streakData.todayCompleted}
            weekProgress={streakData.weekProgress}
          />
        </ScrollView>
      </SafeAreaView>
      
      <SearchModal
        visible={searchModalVisible}
        onClose={() => setSearchModalVisible(false)}
        onSearch={handleSearch}
        onCategoryPress={handleCategoryPress}
        searchButtonLayout={searchButtonLayout}
      />
      
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: '#fff',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
});

export default MainHomeScreen; 