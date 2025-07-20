import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  FlatList, 
  RefreshControl,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Platform,
  TextInput,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { favoritesService } from '../services';
import { findRecipeById } from '../data/dummyRecipes';
import { Recipe } from '../types/Recipe';
import { RecipeCard, RecipeDetailModal, CookingTimerModal, FavoritesSearchModal } from '../components';
import { BottomTabParamList } from '../navigation';
import {
  colors,
  typography,
  spacing,
  componentShadows,
  componentBorderRadius,
  lightTheme
} from '../styles';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const cardWidth = (screenWidth - spacing.l * 2 - spacing.m) / 2; // 2 cards per row with design system margins and gap

type FavoritesScreenNavigationProp = BottomTabNavigationProp<BottomTabParamList, 'Favorites'>;

const FavoritesScreen: React.FC = () => {
  const navigation = useNavigation<FavoritesScreenNavigationProp>();
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [recipeModalVisible, setRecipeModalVisible] = useState(false);
  const [cookingTimerVisible, setCookingTimerVisible] = useState(false);
  const [cookingRecipe, setCookingRecipe] = useState<Recipe | null>(null);
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState<{
    searchQuery: string;
    maxCookTimes: number[];
    difficulties: ('Easy' | 'Medium' | 'Hard')[];
    allergensToAvoid: string[];
    ingredientsToInclude: string[];
  }>({ 
    searchQuery: '', 
    maxCookTimes: [], 
    difficulties: [], 
    allergensToAvoid: [], 
    ingredientsToInclude: [] 
  });

  // Calculate Android-specific top padding
  const androidTopPadding = React.useMemo(() => {
    if (Platform.OS !== 'android') return spacing.m;
    const statusBarHeight = StatusBar.currentHeight || 0;
    const extraPadding = screenHeight > 800 ? spacing.xl : screenHeight > 600 ? spacing.l : spacing.m;
    return statusBarHeight + extraPadding;
  }, []);

  const loadFavorites = async () => {
    try {
      const favoriteIds = await favoritesService.getFavorites();
      const recipes = Array.from(favoriteIds)
        .map(id => findRecipeById(id))
        .filter((recipe): recipe is Recipe => recipe !== undefined);
      setFavoriteRecipes(recipes);
      setFilteredRecipes(recipes);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  useEffect(() => {
    applyFilters();
  }, [favoriteRecipes, activeFilters]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadFavorites();
  };

  const handleRemoveFromFavorites = async (recipeId: string) => {
    try {
      await favoritesService.removeFromFavorites(recipeId);
      setFavoriteRecipes(prev => prev.filter(recipe => recipe.id !== recipeId));
      setFilteredRecipes(prev => prev.filter(recipe => recipe.id !== recipeId));
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  };

  const applyFilters = () => {
    let filtered = favoriteRecipes;
    if (activeFilters.searchQuery.trim()) {
      const query = activeFilters.searchQuery.toLowerCase();
      filtered = filtered.filter(recipe =>
        recipe.name.toLowerCase().includes(query) ||
        recipe.description.toLowerCase().includes(query) ||
        recipe.ingredients.some(ingredient => 
          ingredient.name.toLowerCase().includes(query)
        ) ||
        recipe.difficulty.toLowerCase().includes(query)
      );
    }
    if (activeFilters.maxCookTimes.length > 0) {
      filtered = filtered.filter(recipe => 
        activeFilters.maxCookTimes.some(maxTime => recipe.cookTime <= maxTime)
      );
    }
    if (activeFilters.difficulties.length > 0) {
      filtered = filtered.filter(recipe => 
        activeFilters.difficulties.includes(recipe.difficulty)
      );
    }
    if (activeFilters.allergensToAvoid.length > 0) {
      filtered = filtered.filter(recipe => 
        !recipe.allergens.some(allergen => 
          activeFilters.allergensToAvoid.includes(allergen.type)
        )
      );
    }
    if (activeFilters.ingredientsToInclude.length > 0) {
      filtered = filtered.filter(recipe =>
        activeFilters.ingredientsToInclude.every(selectedIngredient =>
          recipe.ingredients.some(ing => 
            ing.name.toLowerCase().includes(selectedIngredient.toLowerCase())
          )
        )
      );
    }
    filtered.sort((a, b) => a.name.localeCompare(b.name));
    setFilteredRecipes(filtered);
  };

  const handleApplyFilters = (filters: typeof activeFilters) => {
    setActiveFilters(filters);
  };

  const handleRecipePress = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setRecipeModalVisible(true);
  };

  const handleCloseRecipeModal = () => {
    setRecipeModalVisible(false);
    setSelectedRecipe(null);
  };

  const handleRecipeFavoriteToggle = async () => {
    if (selectedRecipe) {
      await handleRemoveFromFavorites(selectedRecipe.id);
      setRecipeModalVisible(false);
      setSelectedRecipe(null);
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
    // TODO: Update streak data if needed
    console.log('Cooking completed from favorites!');
  };

  const renderRecipeCard = ({ item: recipe }: { item: Recipe }) => (
    <View style={styles.cardContainer}>
      <RecipeCard
        recipe={recipe}
        variant="popular"
        isFavorite={true}
        onPress={() => handleRecipePress(recipe)}
        onFavoritePress={() => handleRemoveFromFavorites(recipe.id)}
      />
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <View style={styles.emptyStateIconContainer}>
        <Ionicons name="heart-outline" size={64} color={colors.warmGrayLight} />
      </View>
      <Text style={styles.emptyStateTitle}>No Favorites Yet</Text>
      <Text style={styles.emptyStateMessage}>
        Start exploring recipes and tap the heart icon to save your favorites here!
      </Text>
      <TouchableOpacity 
        style={styles.exploreButton}
        onPress={() => navigation.navigate('Home')}
        activeOpacity={0.8}
      >
        <Text style={styles.exploreButtonText}>Discover Recipes</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => {
    const hasActiveFilters = activeFilters.searchQuery.trim() || 
      activeFilters.maxCookTimes.length > 0 || 
      activeFilters.difficulties.length > 0 || 
      activeFilters.allergensToAvoid.length > 0 || 
      activeFilters.ingredientsToInclude.length > 0;

    const getSubtitleText = () => {
      if (favoriteRecipes.length === 0) {
        return 'Your saved recipes will appear here';
      }
      const totalText = `${favoriteRecipes.length} recipe${favoriteRecipes.length !== 1 ? 's' : ''} saved`;
      if (hasActiveFilters) {
        const filteredText = `${filteredRecipes.length} recipe${filteredRecipes.length !== 1 ? 's' : ''} displayed`;
        return `${totalText} • ${filteredText}`;
      }
      return totalText;
    };

    return (
      <View style={[styles.headerContainer, { paddingTop: androidTopPadding }]}> 
        <Text style={styles.headerTitle}>My Favorites</Text>
        <Text style={styles.headerSubtitle}>
          {getSubtitleText()}
        </Text>
        {favoriteRecipes.length > 3 && (
          <View style={styles.searchContainer}>
            <TouchableOpacity 
              style={styles.searchButton}
              onPress={() => setSearchModalVisible(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="search" size={20} color={colors.warmGray} style={styles.searchIcon} />
              <Text style={styles.searchButtonText}>
                {hasActiveFilters ? 'Filters Applied' : 'Search & Filter'}
              </Text>
              <Ionicons name="options" size={20} color={colors.warmGray} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.spiceOrange} />
          <Text style={styles.loadingText}>Loading your favorites...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={filteredRecipes}
        renderItem={renderRecipeCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContainer,
          refreshing && { paddingTop: 60 }
        ]}
        columnWrapperStyle={filteredRecipes.length > 0 ? styles.row : undefined}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={favoriteRecipes.length === 0 ? renderEmptyState : () => (
          <View style={styles.noResultsContainer}>
            <Ionicons name="search" size={48} color={colors.warmGrayLight} />
            <Text style={styles.noResultsTitle}>No Results Found</Text>
            <Text style={styles.noResultsMessage}>
              Try adjusting your search to find what you're looking for
            </Text>
          </View>
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.spiceOrange]}
            tintColor={colors.spiceOrange}
          />
        }
        ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
      />

      <RecipeDetailModal
        visible={recipeModalVisible}
        recipe={selectedRecipe}
        onClose={handleCloseRecipeModal}
        isFavorite={selectedRecipe ? true : false}
        onFavoriteToggle={handleRecipeFavoriteToggle}
        onStartCooking={handleStartCooking}
      />

      <CookingTimerModal
        visible={cookingTimerVisible}
        recipe={cookingRecipe}
        onClose={handleCookingTimerClose}
        onComplete={handleCookingComplete}
      />

      <FavoritesSearchModal
        visible={searchModalVisible}
        onClose={() => setSearchModalVisible(false)}
        onApplyFilters={handleApplyFilters}
        favoriteRecipes={favoriteRecipes}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.warmCream, // Changed from #f8f9fa to Warm Cream
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.l, // Using design system spacing (20px)
  },
  loadingText: {
    ...typography.bodyMedium, // Using bodyMedium typography (16px, Regular)
    color: colors.warmGray, // Changed from #666 to Warm Gray
    marginTop: spacing.l, // Using design system spacing (20px)
    textAlign: 'center',
  },
  listContainer: {
    flexGrow: 1,
    paddingHorizontal: spacing.l, // Using design system spacing (20px)
    paddingBottom: spacing.l, // Using design system spacing (20px)
  },
  headerContainer: {
    paddingTop: Platform.OS === 'android' ? 0 : spacing.m, // Android padding applied dynamically
    paddingBottom: spacing.xl, // Using design system spacing (32px)
    alignItems: 'center',
    backgroundColor: colors.warmCream, // Ensure background matches container
  },
  headerTitle: {
    ...typography.h1, // Using H1 typography (32px, Bold)
    color: colors.deepNavy, // Changed from #1a1a1a to Deep Navy
    marginBottom: spacing.s, // Using design system spacing (8px)
  },
  headerSubtitle: {
    ...typography.bodyMedium, // Using bodyMedium typography (16px, Regular)
    color: colors.warmGray, // Changed from #666 to Warm Gray
    textAlign: 'center',
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: spacing.s, // Using design system spacing (8px)
  },
  cardContainer: {
    flex: 1,
    maxWidth: cardWidth,
    paddingHorizontal: spacing.s, // Using design system spacing (8px)
  },
  itemSeparator: {
    height: spacing.l, // Using design system spacing (20px)
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl, // Using design system spacing (32px)
    paddingTop: spacing.xxl, // Using design system spacing (48px)
  },
  emptyStateIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.warmCreamLight, // Changed from #f5f5f5 to Warm Cream Light
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl, // Using design system spacing (32px)
    borderWidth: 2,
    borderColor: colors.warmGrayLight, // Changed from #E5E5E7 to Warm Gray Light
    borderStyle: 'dashed',
  },
  emptyStateTitle: {
    ...typography.h3, // Using H3 typography (24px, SemiBold)
    color: colors.deepNavy, // Changed from #1a1a1a to Deep Navy
    marginBottom: spacing.m, // Using design system spacing (12px)
    textAlign: 'center',
  },
  emptyStateMessage: {
    ...typography.bodyMedium, // Using bodyMedium typography (16px, Regular)
    color: colors.warmGray, // Changed from #666 to Warm Gray
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.xl, // Using design system spacing (32px)
  },
  exploreButton: {
    backgroundColor: colors.spiceOrange, // Changed from #007AFF to Spice Orange
    paddingHorizontal: spacing.xxl, // Using design system spacing (48px)
    paddingVertical: spacing.l, // Using design system spacing (20px)
    borderRadius: componentBorderRadius.button, // Using design system border radius (12px)
    ...componentShadows.button, // Using new shadow system
  },
  exploreButtonText: {
    color: colors.legacy.white, // White text
    ...typography.bodyLarge, // Using bodyLarge typography (18px, Regular)
    fontWeight: typography.h4.fontWeight, // SemiBold weight
    textAlign: 'center',
  },
  searchContainer: {
    paddingTop: spacing.xl, // Using design system spacing (32px)
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.legacy.white, // Changed from #fff to White
    borderRadius: componentBorderRadius.button, // Using design system border radius (12px)
    paddingHorizontal: spacing.m, // Using design system spacing (16px)
    paddingVertical: spacing.m, // Using design system spacing (12px)
    borderWidth: 1,
    borderColor: lightTheme.borders, // Changed from #e0e0e0 to design system border
    ...componentShadows.card, // Using new shadow system
  },
  searchIcon: {
    marginRight: spacing.m, // Using design system spacing (12px)
  },
  searchButtonText: {
    flex: 1,
    ...typography.bodyMedium, // Using bodyMedium typography (16px, Regular)
    color: colors.warmGray, // Changed from #666 to Warm Gray
    fontWeight: '500',
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl, // Using design system spacing (32px)
    paddingTop: spacing.xxl, // Using design system spacing (48px)
  },
  noResultsTitle: {
    ...typography.h4, // Using H4 typography (20px, SemiBold)
    color: colors.deepNavy, // Changed from #1a1a1a to Deep Navy
    marginTop: spacing.l, // Using design system spacing (20px)
    marginBottom: spacing.s, // Using design system spacing (8px)
    textAlign: 'center',
  },
  noResultsMessage: {
    ...typography.bodyMedium, // Using bodyMedium typography (16px, Regular)
    color: colors.warmGray, // Changed from #666 to Warm Gray
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default FavoritesScreen; 