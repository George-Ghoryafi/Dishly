import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Animated, Platform } from 'react-native';
import { FlipBook, TabSelector } from '../components';
import { todaysCards, monthlyCards } from '../data/dummyRecipes';
import MainHomeScreen from './MainHomeScreen';

const HomeScreen: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'today' | 'month'>('today');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showMainHomepage, setShowMainHomepage] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const titleFadeAnim = useRef(new Animated.Value(1)).current;
  
  const currentCards = selectedTab === 'today' ? todaysCards : monthlyCards;
  const headerTitle = selectedTab === 'today' ? "Today's Top Picks" : "This Month's Favorites";

  const handleNavigateToHomepage = () => {
    setShowMainHomepage(true);
  };

  const handleFavoriteToggle = (recipeId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(recipeId)) {
        newFavorites.delete(recipeId);
      } else {
        newFavorites.add(recipeId);
      }
      return newFavorites;
    });
  };

  if (showMainHomepage) {
    return <MainHomeScreen favorites={favorites} onFavoriteToggle={handleFavoriteToggle} />;
  }

  const handleTabChange = (newTab: 'today' | 'month') => {
    if (newTab === selectedTab || isTransitioning) return;
    
    setIsTransitioning(true);
    
    // Start exit animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(slideAnim, {
        toValue: newTab === 'today' ? 50 : -50,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(titleFadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: false,
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
          useNativeDriver: false,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: false,
        }),
        Animated.timing(titleFadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: false,
        }),
      ]).start(() => {
        setIsTransitioning(false);
      });
    });
  };

  const getAnimatedStyle = () => ({
    opacity: fadeAnim,
    transform: [{ translateX: slideAnim }],
  });

  const getTitleAnimatedStyle = () => ({
    opacity: titleFadeAnim,
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Animated.View style={getTitleAnimatedStyle()}>
          <Text style={styles.title}>{headerTitle}</Text>
        </Animated.View>
        <Text style={styles.subtitle}>Swipe to discover amazing recipes</Text>
      </View>
      
      <TabSelector 
        selectedTab={selectedTab} 
        onTabChange={handleTabChange} 
      />
      
      <Animated.View style={[styles.flipBookContainer, getAnimatedStyle()]}>
        <FlipBook 
          cards={currentCards}
          onNavigateToHomepage={handleNavigateToHomepage}
          favorites={favorites}
          onFavoriteToggle={handleFavoriteToggle}
          key={selectedTab} // Force re-render when tab changes
        />
      </Animated.View>
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