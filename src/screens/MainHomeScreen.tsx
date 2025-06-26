import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Header, FlipBookPreview, PopularDishes, QuickWins, RecipeRoulette, KitchenStreak, SearchModal } from '../components';
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

  const handleProfilePress = () => {
    // TODO: Navigate to profile screen
    console.log('Profile pressed');
  };

  const handleDishPress = (recipe: Recipe) => {
    // TODO: Navigate to recipe detail screen
    console.log('Dish pressed:', recipe.name);
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
    // TODO: Navigate to recipe detail screen or show recipe preview
    console.log('Recipe selected from roulette:', recipe.name);
  };

  const handleFlipBookPress = () => {
    console.log('FlipBook pressed - navigating to flipbook');
    onBackToFlipBook?.();
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
      <Header 
        onProfilePress={handleProfilePress}
        onSearchPress={handleSearchPress}
        searchPlaceholder="Search for recipes and dishes..."
      />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 20,
    paddingBottom: 40,
  },
});

export default MainHomeScreen; 