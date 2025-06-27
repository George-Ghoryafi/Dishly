import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Animated, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Header, FlipBookPreview, PopularDishes, QuickWins, RecipeRoulette, KitchenStreak, SearchModal, RecipeDetailModal, CookingTimerModal } from '../components';
import { todaysRecipes, monthlyRecipes, quickWinRecipes } from '../data/dummyRecipes';
import { Recipe } from '../types/Recipe';
import { favoritesService } from '../services';
import { BottomTabParamList } from '../navigation/BottomTabNavigator';

type MainHomeScreenNavigationProp = BottomTabNavigationProp<BottomTabParamList, 'Home'>;

interface MainHomeScreenProps {
  favorites?: Set<string>;
  onFavoriteToggle?: (recipeId: string) => void;
  onBackToFlipBook?: () => void;
}

const MainHomeScreen: React.FC<MainHomeScreenProps> = ({ favorites: propFavorites, onFavoriteToggle: propOnFavoriteToggle, onBackToFlipBook }) => {
  const [localFavorites, setLocalFavorites] = useState<Set<string>>(new Set());
  
  // Use prop favorites if provided, otherwise use local favorites
  const favorites = propFavorites || localFavorites;
  
  // Load favorites if not provided as props
  useEffect(() => {
    if (!propFavorites) {
      const loadFavorites = async () => {
        try {
          const favoriteIds = await favoritesService.getFavorites();
          setLocalFavorites(favoriteIds);
        } catch (error) {
          console.error('Error loading favorites:', error);
        }
      };
      
      loadFavorites();
    }
  }, [propFavorites]);

  // Handle favorite toggle
  const handleFavoriteToggle = async (recipeId: string) => {
    if (propOnFavoriteToggle) {
      // Use prop handler if provided
      propOnFavoriteToggle(recipeId);
    } else {
      // Use local favorites service
      try {
        const newStatus = await favoritesService.toggleFavorite(recipeId);
        
        setLocalFavorites(prev => {
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
    }
  };
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

  // Streak state management
  const [streakData, setStreakData] = useState({
    todayCompleted: false,
    weekProgress: [false, true, true, true, false, false, false] // S, M, T, W, T, F, S
    // This shows: Monday(1), Tuesday(2), Wednesday(3) cooked = 3-day streak broken on Thursday
    // Today is Friday(5) - not cooked yet, opportunity to start new streak
  });

  // Calculate the actual current streak based on weekProgress (same logic as KitchenStreak)
  const calculateCurrentStreak = (): number => {
    const today = new Date().getDay(); // 0 = Sunday, 6 = Saturday
    let streak = 0;
    
    // Start from today and work backwards
    for (let i = 0; i <= 6; i++) {
      const dayIndex = (today - i + 7) % 7;
      const isCompleted = streakData.weekProgress[dayIndex];
      
      if (isCompleted) {
        streak++;
      } else {
        // If we hit an incomplete day, stop counting
        break;
      }
    }
    
    return streak;
  };

  const currentCalculatedStreak = calculateCurrentStreak();

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
    
    // Update streak data - mark today as completed
    const today = new Date().getDay(); // 0 = Sunday, 6 = Saturday
    setStreakData(prevStreakData => {
      const newWeekProgress = [...prevStreakData.weekProgress];
      newWeekProgress[today] = true; // Mark today as completed
      
      return {
        ...prevStreakData,
        todayCompleted: true,
        weekProgress: newWeekProgress
      };
    });
    
    console.log('Cooking completed! Streak updated for day', today);
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
            onFavoriteToggle={handleFavoriteToggle}
          />
          
          <QuickWins 
            recipes={quickWinRecipes}
            onRecipePress={handleDishPress}
            favorites={favorites}
            onFavoriteToggle={handleFavoriteToggle}
          />

          <RecipeRoulette 
            recipes={allRecipes}
            onRecipeSelect={handleRecipeSelect}
            favorites={favorites}
            onFavoriteToggle={handleFavoriteToggle}
          />

          <KitchenStreak
            currentStreak={currentCalculatedStreak}
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
        currentStreak={currentCalculatedStreak}
        todayCompleted={streakData.todayCompleted}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    backgroundColor: 'none',

  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 10,
    backgroundColor: 'none',
  },
});

export default MainHomeScreen; 