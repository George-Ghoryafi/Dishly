import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

interface CookingCompletionScreenProps {
  recipeName: string;
  recipeImage: string;
  totalElapsedTime: number;
  currentStreak: number;
  streakUpdated: boolean;
  onComplete: () => void;
}

const CookingCompletionScreen: React.FC<CookingCompletionScreenProps> = ({
  recipeName,
  recipeImage,
  totalElapsedTime,
  currentStreak,
  streakUpdated,
  onComplete,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const celebrationAnim = useRef(new Animated.Value(0)).current;
  const [showStreakNumber, setShowStreakNumber] = useState(false);
  const { width, height } = Dimensions.get('window');

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(celebrationAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(celebrationAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // If streak was updated, show "Updated!" for 2 seconds, then show current streak
    if (streakUpdated) {
      const timer = setTimeout(() => {
        setShowStreakNumber(true);
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      // If streak wasn't updated, show current streak immediately
      setShowStreakNumber(true);
    }
  }, [streakUpdated]);

  const formatTotalTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
      return `${mins}m ${secs}s`;
    }
    return `${secs}s`;
  };

  const getRandomCelebrationEmoji = () => {
    const emojis = ['🎉', '🎊', '✨', '🌟', '💫', '🎈', '🏆', '👏'];
    return emojis[Math.floor(Math.random() * emojis.length)];
  };

  // Create floating celebration elements centered around the main icon
  const renderFloatingCelebrations = () => {
    const celebrations = [];
    const centerX = width / 2 - 10; // Shifted slightly to the left
    const centerY = height * 0.25; // Moved higher to better align with the food image
    
    for (let i = 0; i < 8; i++) {
      // Create a circle around the center point
      const angle = (i / 8) * 2 * Math.PI;
      const radius = 80 + Math.random() * 30; // Slightly larger radius to ensure they surround the image
      const randomX = centerX + Math.cos(angle) * radius;
      const randomY = centerY + Math.sin(angle) * radius;
      
      celebrations.push(
        <Animated.View
          key={i}
          style={[
            styles.floatingCelebration,
            {
              left: randomX,
              top: randomY,
              opacity: celebrationAnim,
              transform: [
                {
                  translateY: celebrationAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -80],
                  }),
                },
                {
                  rotate: celebrationAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg'],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.celebrationEmoji}>
            {getRandomCelebrationEmoji()}
          </Text>
        </Animated.View>
      );
    }
    return celebrations;
  };

  const getStreakDisplay = () => {
    if (streakUpdated && !showStreakNumber) {
      return 'Updated!';
    }
    return `${currentStreak} ${currentStreak === 1 ? 'day' : 'days'}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Floating celebrations */}
      {renderFloatingCelebrations()}
      
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Main celebration icon with recipe image */}
        <View style={styles.celebrationIconContainer}>
          <View style={styles.celebrationIcon}>
            <Image 
              source={{ uri: recipeImage }} 
              style={styles.recipeImage}
              resizeMode="cover"
            />
          </View>
          <View style={styles.secondaryIcon}>
            <Ionicons name="checkmark-circle" size={40} color="#4CAF50" />
          </View>
        </View>

        {/* Success message */}
        <View style={styles.messageContainer}>
          <Text style={styles.congratsText}>Cooking Complete!</Text>
          <Text style={styles.recipeNameText}>{recipeName}</Text>
          <Text style={styles.motivationalText}>
            You've successfully completed this recipe! 👨‍🍳
          </Text>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <View style={styles.statIconContainer}>
              <Ionicons name="time" size={24} color="#007AFF" />
            </View>
            <Text style={styles.statLabel}>Total Time</Text>
            <Text style={styles.statValue}>{formatTotalTime(totalElapsedTime)}</Text>
          </View>
          
          <View style={styles.statItem}>
            <View style={styles.statIconContainer}>
              <Ionicons name="flame" size={24} color="#FF6B35" />
            </View>
            <Text style={styles.statLabel}>Streak</Text>
            <Animated.View style={styles.streakValueContainer}>
              <Text style={[
                styles.statValue,
                streakUpdated && !showStreakNumber && styles.streakUpdatedText
              ]}>
                {getStreakDisplay()}
              </Text>
            </Animated.View>
          </View>
          
          <View style={styles.statItem}>
            <View style={styles.statIconContainer}>
              <Ionicons name="trophy" size={24} color="#FFD700" />
            </View>
            <Text style={styles.statLabel}>Achievement</Text>
            <Text style={styles.statValue}>Unlocked</Text>
          </View>
        </View>

        {/* Achievement badge */}
        <View style={styles.achievementBadge}>
          <Ionicons name="medal" size={20} color="#FFD700" />
          <Text style={styles.achievementText}>Kitchen Master</Text>
        </View>

        {/* Action button */}
        <TouchableOpacity style={styles.doneButton} onPress={onComplete}>
          <Text style={styles.doneButtonText}>Continue to Kitchen</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>

        {/* Additional encouragement */}
        <Text style={styles.encouragementText}>
          Keep up the great work! Your cooking journey continues... 🌟
        </Text>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fffe',
    position: 'relative',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  floatingCelebration: {
    position: 'absolute',
  },
  celebrationEmoji: {
    fontSize: 24,
  },
  celebrationIconContainer: {
    position: 'relative',
    marginBottom: 32,
  },
  celebrationIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    overflow: 'hidden',
  },
  recipeImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  mainEmoji: {
    fontSize: 60,
  },
  secondaryIcon: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  messageContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  congratsText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
    textAlign: 'center',
  },
  recipeNameText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FF6B35',
    marginBottom: 12,
    textAlign: 'center',
  },
  motivationalText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f8ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  streakValueContainer: {
    minHeight: 20,
    justifyContent: 'center',
  },
  streakUpdatedText: {
    color: '#4CAF50',
  },
  achievementBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  achievementText: {
    fontSize: 14,
    color: '#F57C00',
    fontWeight: '600',
    marginLeft: 8,
  },
  doneButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginRight: 8,
  },
  encouragementText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 20,
  },
});

export default CookingCompletionScreen; 