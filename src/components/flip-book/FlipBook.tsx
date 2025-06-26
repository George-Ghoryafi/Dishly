import React, { useState, useRef } from 'react';
import { View, StyleSheet, Dimensions, PanResponder, Animated } from 'react-native';
import { Recipe } from '../../types/Recipe';
import RecipeCard from './RecipeCard';

interface FlipBookProps {
  recipes: Recipe[];
}

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = screenWidth * 0.85;
const CARD_HEIGHT = CARD_WIDTH * 1.4;
const SWIPE_THRESHOLD = 50;

const FlipBook: React.FC<FlipBookProps> = ({ recipes }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const slideAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return Math.abs(gestureState.dx) > 10 && !isAnimating;
    },
    onPanResponderMove: (_, gestureState) => {
      const { dx } = gestureState;
      const progress = Math.min(Math.abs(dx) / (CARD_WIDTH * 0.5), 1);
      
      // Live preview of the swipe
      slideAnim.setValue(dx);
      scaleAnim.setValue(1 - (progress * 0.05));
      rotateAnim.setValue(dx / CARD_WIDTH * 15); // Max 15 degrees rotation
    },
    onPanResponderRelease: (_, gestureState) => {
      const { dx, vx } = gestureState;
      const shouldSwipe = Math.abs(dx) > SWIPE_THRESHOLD || Math.abs(vx) > 0.3;
      
      if (shouldSwipe && !isAnimating) {
        if (dx > 0 || vx > 0) {
          // Swipe right - go to previous card
          animateTransition(() => goToPrevious(), 'right');
        } else {
          // Swipe left - go to next card
          animateTransition(() => goToNext(), 'left');
        }
      } else {
        // Return to center
        resetAnimation();
      }
    },
  });

  const animateTransition = (callback: () => void, direction: 'left' | 'right') => {
    setIsAnimating(true);
    
    const targetSlide = direction === 'left' ? -CARD_WIDTH : CARD_WIDTH;
    
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: targetSlide,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(rotateAnim, {
        toValue: direction === 'left' ? -20 : 20,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start(() => {
      callback();
      
      // Reset animations for the new card
      slideAnim.setValue(direction === 'left' ? CARD_WIDTH : -CARD_WIDTH);
      scaleAnim.setValue(0.9);
      rotateAnim.setValue(direction === 'left' ? 20 : -20);
      
      // Animate new card into position
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: false,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: false,
        }),
        Animated.spring(rotateAnim, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: false,
        }),
      ]).start(() => {
        setIsAnimating(false);
      });
    });
  };

  const resetAnimation = () => {
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 100,
        friction: 8,
        useNativeDriver: false,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: false,
      }),
      Animated.spring(rotateAnim, {
        toValue: 0,
        tension: 100,
        friction: 8,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const goToNext = () => {
    const nextIndex = currentIndex === recipes.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(nextIndex);
  };

  const goToPrevious = () => {
    const prevIndex = currentIndex === 0 ? recipes.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
  };

  const currentRecipe = recipes[currentIndex];

  const getAnimatedStyle = () => {
    const rotateInterpolate = rotateAnim.interpolate({
      inputRange: [-30, 0, 30],
      outputRange: ['-30deg', '0deg', '30deg'],
    });

    return {
      transform: [
        { translateX: slideAnim },
        { scale: scaleAnim },
        { rotate: rotateInterpolate },
      ],
    };
  };

  return (
    <View style={styles.container}>
      <View style={styles.flipBookContainer}>
        <Animated.View
          style={[styles.cardWrapper, getAnimatedStyle()]}
          {...panResponder.panHandlers}
        >
          <RecipeCard recipe={currentRecipe} />
        </Animated.View>
      </View>
      
      {/* Page indicator */}
      <View style={styles.indicatorContainer}>
        {recipes.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              currentIndex === index && styles.activeIndicator,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flipBookContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardWrapper: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  },
  indicatorContainer: {
    flexDirection: 'row',
    marginTop: 30,
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
  },
  activeIndicator: {
    backgroundColor: '#007AFF',
    width: 24,
  },
});

export default FlipBook; 