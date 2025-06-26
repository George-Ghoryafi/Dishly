import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Header, PopularDishes, SearchModal } from '../components';
import { todaysRecipes, monthlyRecipes } from '../data/dummyRecipes';
import { Recipe } from '../types/Recipe';

const MainHomeScreen: React.FC = () => {
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

  // Combine and shuffle recipes for popular dishes
  const popularDishes = [...todaysRecipes, ...monthlyRecipes.slice(0, 3)];

  return (
    <View style={styles.container}>
      <Header 
        onProfilePress={handleProfilePress}
        onSearchPress={handleSearchPress}
        searchPlaceholder="Search for recipes and dishes..."
      />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <PopularDishes 
          dishes={popularDishes} 
          onDishPress={handleDishPress}
        />
        
        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionIcon}>🍳</Text>
            <Text style={styles.sectionTitle}>Discover Recipes</Text>
            <Text style={styles.sectionDescription}>
              Explore thousands of delicious recipes from around the world
            </Text>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionIcon}>📱</Text>
            <Text style={styles.sectionTitle}>Cook with Confidence</Text>
            <Text style={styles.sectionDescription}>
              Step-by-step instructions and cooking tips for every skill level
            </Text>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionIcon}>❤️</Text>
            <Text style={styles.sectionTitle}>Save Favorites</Text>
            <Text style={styles.sectionDescription}>
              Keep track of your favorite recipes and create custom collections
            </Text>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionIcon}>🎯</Text>
            <Text style={styles.sectionTitle}>Personalized Recommendations</Text>
            <Text style={styles.sectionDescription}>
              Get recipe suggestions based on your preferences and dietary needs
            </Text>
          </View>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            This is the main Dishly homepage.{'\n'}
            More features coming soon!
          </Text>
        </View>
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
  },
  content: {
    flex: 1,
    gap: 24,
    paddingHorizontal: 20,
  },
  section: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  footer: {
    marginTop: 40,
    margin: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default MainHomeScreen; 