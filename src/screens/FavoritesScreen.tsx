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

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const cardWidth = (screenWidth - 48) / 2; // 2 cards per row with 16px margins and 16px gap

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
    if (Platform.OS !== 'android') return 10;
    
    const statusBarHeight = StatusBar.currentHeight || 0;
    // Add extra padding based on screen height for different device sizes
    const extraPadding = screenHeight > 800 ? 20 : screenHeight > 600 ? 15 : 10;
    
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

  // Load favorites when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  // Update filtered recipes when favorites or filters change
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
      // Remove from local state immediately for better UX
      setFavoriteRecipes(prev => prev.filter(recipe => recipe.id !== recipeId));
      setFilteredRecipes(prev => prev.filter(recipe => recipe.id !== recipeId));
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  };

  // Apply all filters to recipes
  const applyFilters = () => {
    let filtered = favoriteRecipes;

    // Text search
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

    // Cook time filter - recipe must match at least one selected time
    if (activeFilters.maxCookTimes.length > 0) {
      filtered = filtered.filter(recipe => 
        activeFilters.maxCookTimes.some(maxTime => recipe.cookTime <= maxTime)
      );
    }

    // Difficulty filter - recipe must match at least one selected difficulty
    if (activeFilters.difficulties.length > 0) {
      filtered = filtered.filter(recipe => 
        activeFilters.difficulties.includes(recipe.difficulty)
      );
    }

    // Allergen filter (avoid) - recipe must not contain any selected allergens
    if (activeFilters.allergensToAvoid.length > 0) {
      filtered = filtered.filter(recipe => 
        !recipe.allergens.some(allergen => 
          activeFilters.allergensToAvoid.includes(allergen.type)
        )
      );
    }

    // Ingredient filter (must include) - recipe must contain all selected ingredients
    if (activeFilters.ingredientsToInclude.length > 0) {
      filtered = filtered.filter(recipe =>
        activeFilters.ingredientsToInclude.every(selectedIngredient =>
          recipe.ingredients.some(ing => 
            ing.name.toLowerCase().includes(selectedIngredient.toLowerCase())
          )
        )
      );
    }

    // Sort by name by default
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
        <Ionicons name="heart-outline" size={64} color="#E5E5E7" />
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
              <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
              <Text style={styles.searchButtonText}>
                {hasActiveFilters ? 'Filters Applied' : 'Search & Filter'}
              </Text>
              <Ionicons name="options" size={20} color="#666" />
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
          <ActivityIndicator size="large" color="#007AFF" />
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
          refreshing && { paddingTop: 60 } // Push content down when refreshing
        ]}
        columnWrapperStyle={filteredRecipes.length > 0 ? styles.row : undefined}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={favoriteRecipes.length === 0 ? renderEmptyState : () => (
          <View style={styles.noResultsContainer}>
            <Ionicons name="search" size={48} color="#E5E5E7" />
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
            colors={['#007AFF']}
            tintColor="#007AFF"
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
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  },
  listContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  headerContainer: {
    paddingTop: Platform.OS === 'android' ? 0 : 10, // Android padding applied dynamically
    paddingBottom: 24,
    alignItems: 'center',
    backgroundColor: '#f8f9fa', // Ensure background matches container
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  cardContainer: {
    flex: 1,
    maxWidth: cardWidth,
    paddingHorizontal: 8,
  },
  itemSeparator: {
    height: 16,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 60,
  },
  emptyStateIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#E5E5E7',
    borderStyle: 'dashed',
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyStateMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  exploreButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#007AFF',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  exploreButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  searchContainer: {
    paddingTop: 20,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  searchIcon: {
    marginRight: 12,
  },
  searchButtonText: {
    flex: 1,
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 60,
  },
  noResultsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  noResultsMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default FavoritesScreen; 