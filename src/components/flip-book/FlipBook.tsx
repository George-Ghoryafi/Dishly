import React, { useState, useRef, useMemo } from 'react';
import { View, StyleSheet, Dimensions, PanResponder, Animated } from 'react-native';
import { CardData, Recipe } from '../../types/Recipe';
import RecipeCard from './RecipeCard';
import CompletionCard from './CompletionCard';

interface FlipBookProps {
  cards: CardData[];
  onNavigateToHomepage?: () => void;
  favorites?: Set<string>;
  onFavoriteToggle?: (recipeId: string) => void;
  onRecipePress?: (recipe: Recipe) => void;
}

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = screenWidth * 0.85;
const CARD_HEIGHT = CARD_WIDTH * 1.4;
const SWIPE_THRESHOLD = 50;

const FlipBook: React.FC<FlipBookProps> = ({ cards, onNavigateToHomepage, favorites = new Set(), onFavoriteToggle, onRecipePress }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const slideAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return Math.abs(gestureState.dx) > 10;
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
      
      if (shouldSwipe) {
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
        duration: 150,
        useNativeDriver: false,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 150,
        useNativeDriver: false,
      }),
      Animated.timing(rotateAnim, {
        toValue: direction === 'left' ? -20 : 20,
        duration: 150,
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
          tension: 150,
          friction: 7,
          useNativeDriver: false,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 150,
          friction: 7,
          useNativeDriver: false,
        }),
        Animated.spring(rotateAnim, {
          toValue: 0,
          tension: 150,
          friction: 7,
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
        tension: 150,
        friction: 7,
        useNativeDriver: false,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 150,
        friction: 7,
        useNativeDriver: false,
      }),
      Animated.spring(rotateAnim, {
        toValue: 0,
        tension: 150,
        friction: 7,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const goToNext = () => {
    const nextIndex = currentIndex === cards.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(nextIndex);
  };

  const goToPrevious = () => {
    const prevIndex = currentIndex === 0 ? cards.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
  };

  const currentCard = cards[currentIndex];

  const renderCard = () => {
    if ('type' in currentCard && currentCard.type === 'completion') {
      return (
        <CompletionCard 
          card={currentCard} 
          onNavigateToHomepage={onNavigateToHomepage || (() => {})}
        />
      );
    } else {
      return (
        <RecipeCard 
          recipe={currentCard as Recipe} 
          isFavorite={favorites.has(currentCard.id)}
          onFavoritePress={() => onFavoriteToggle?.(currentCard.id)}
          onPress={() => onRecipePress?.(currentCard as Recipe)}
        />
      );
    }
  };

  const rotateInterpolate = useMemo(() => {
    return rotateAnim.interpolate({
      inputRange: [-30, 0, 30],
      outputRange: ['-30deg', '0deg', '30deg'],
    });
  }, [rotateAnim]);

  const getAnimatedStyle = () => {
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
          {renderCard()}
        </Animated.View>
      </View>
      
      {/* Page indicator */}
      <View style={styles.indicatorContainer}>
        {cards.map((_, index) => (
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