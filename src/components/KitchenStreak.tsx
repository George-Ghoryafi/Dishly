import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';

interface KitchenStreakProps {
  currentStreak: number;
  todayCompleted: boolean;
  weekProgress: boolean[]; // Array of 7 booleans for the current week
}

const KitchenStreak: React.FC<KitchenStreakProps> = ({
  currentStreak,
  todayCompleted,
  weekProgress
}) => {
  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const today = new Date().getDay(); // 0 = Sunday, 6 = Saturday

  const getStreakEmoji = () => {
    if (currentStreak === 0) return '🍳';
    if (currentStreak < 3) return '🔥';
    if (currentStreak < 7) return '🚀';
    if (currentStreak < 14) return '⭐';
    if (currentStreak < 30) return '👑';
    return '🏆';
  };

  const getMotivationalMessage = () => {
    if (currentStreak === 0) {
      return "Start your cooking journey today!";
    }
    if (todayCompleted) {
      return `Amazing! ${currentStreak} days strong 💪`;
    }
    if (currentStreak === 1) {
      return "Keep the momentum going!";
    }
    if (currentStreak < 7) {
      return `${7 - currentStreak} more days to reach a week!`;
    }
    if (currentStreak < 30) {
      return "You're on fire! Keep cooking!";
    }
    return "Cooking legend in the making!";
  };

  const renderProgressDots = () => {
    // Create a 7-day sliding window with today as the rightmost day
    const displayDays = [];
    for (let i = 6; i >= 0; i--) {
      const dayIndex = (today - i + 7) % 7;
      const dayOffset = i; // 0 = today, 1 = yesterday, etc.
      displayDays.push({ dayIndex, dayOffset });
    }

    return displayDays.map((day, displayIndex) => {
      const isCompleted = weekProgress[day.dayIndex];
      const isToday = day.dayOffset === 0;

      return (
        <View key={displayIndex} style={styles.dayContainer}>
          <Text style={[
            styles.dayLabel,
            isToday && styles.todayLabel
          ]}>
            {weekDays[day.dayIndex]}
          </Text>
          <View style={[
            styles.progressDot,
            isCompleted && styles.completedDot,
            isToday && !isCompleted && styles.todayDot,
            (!isCompleted && !isToday) && styles.incompleteDot
          ]}>
            {isCompleted && (
              <Text style={styles.checkmark}>✓</Text>
            )}
            {isToday && !isCompleted && (
              <View style={styles.todayIndicator} />
            )}
          </View>
        </View>
      );
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Kitchen Streak</Text>
          <Text style={styles.subtitle}>{getMotivationalMessage()}</Text>
        </View>
      </View>

      <View style={styles.content}>
        {/* Main Streak Display */}
        <View style={styles.streakDisplay}>
          <View style={styles.streakInfo}>
            <View style={styles.streakNumberContainer}>
              <Text style={styles.streakNumber}>{currentStreak}</Text>
              <Text style={styles.streakEmoji}>{getStreakEmoji()}</Text>
            </View>
            <Text style={styles.streakLabel}>
              day{currentStreak !== 1 ? 's' : ''} streak
            </Text>
          </View>
        </View>

        {/* Weekly Progress */}
        <View style={styles.weeklyProgress}>
          <Text style={styles.weekLabel}>This Week</Text>
          <View style={styles.progressContainer}>
            {renderProgressDots()}
          </View>
        </View>

        {/* Next Goal */}
        <View style={styles.goalContainer}>
          {!todayCompleted ? (
            <View style={styles.callToAction}>
              <Text style={styles.goalText}>
                Cook something today to continue your streak! 🍽️
              </Text>
            </View>
          ) : (
            <View style={styles.completedMessage}>
              <Text style={styles.completedText}>
                Great job today! Come back tomorrow 🌟
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
    marginHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  header: {
    marginBottom: 20,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  content: {
    gap: 24,
  },
  streakDisplay: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FF6B35',
  },
  streakInfo: {
    alignItems: 'center',
  },
  streakNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FF6B35',
    lineHeight: 40,
  },
  streakEmoji: {
    fontSize: 24,
    marginLeft: 8,
  },
  streakLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  weeklyProgress: {
    alignItems: 'center',
  },
  weekLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 8,
  },
  dayContainer: {
    alignItems: 'center',
    flex: 1,
  },
  dayLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
    fontWeight: '500',
  },
  todayLabel: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  progressDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  completedDot: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  todayDot: {
    borderColor: '#007AFF',
    backgroundColor: '#fff',
  },
  futureDot: {
    backgroundColor: '#f8f8f8',
    borderColor: '#f0f0f0',
  },
  incompleteDot: {
    backgroundColor: '#f8f8f8',
    borderColor: '#f0f0f0',
  },
  checkmark: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  todayIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#007AFF',
  },
  goalContainer: {
    alignItems: 'center',
  },
  callToAction: {
    backgroundColor: '#FFF3E0',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  goalText: {
    fontSize: 14,
    color: '#F57C00',
    textAlign: 'center',
    fontWeight: '500',
  },
  completedMessage: {
    backgroundColor: '#E8F5E8',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  completedText: {
    fontSize: 14,
    color: '#2E7D32',
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default KitchenStreak; 