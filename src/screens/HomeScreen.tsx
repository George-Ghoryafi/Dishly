import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Animated } from 'react-native';
import { FlipBook, TabSelector } from '../components';
import { todaysRecipes, monthlyRecipes } from '../data/dummyRecipes';

const HomeScreen: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'today' | 'month'>('today');
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const titleFadeAnim = useRef(new Animated.Value(1)).current;
  
  const currentRecipes = selectedTab === 'today' ? todaysRecipes : monthlyRecipes;
  const headerTitle = selectedTab === 'today' ? "Today's Top Picks" : "This Month's Favorites";

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
          recipes={currentRecipes}
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
    paddingTop: 20,
    paddingBottom: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
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