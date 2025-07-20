import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { 
  colors, 
  typography, 
  spacing, 
  componentShadows,
  componentBorderRadius,
  lightTheme
} from '../styles';

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

  // Calculate the actual current streak based on weekProgress
  const calculateActualStreak = (): number => {
    let streak = 0;
    
    // Start from today and work backwards
    for (let i = 0; i <= 6; i++) {
      const dayIndex = (today - i + 7) % 7;
      const isCompleted = weekProgress[dayIndex];
      
      if (isCompleted) {
        streak++;
      } else {
        // If we hit an incomplete day, stop counting
        break;
      }
    }
    
    return streak;
  };

  const actualStreak = calculateActualStreak();

  const getStreakEmoji = () => {
    if (actualStreak === 0) return '🍳';
    if (actualStreak < 3) return '🔥';
    if (actualStreak < 7) return '🚀';
    if (actualStreak < 14) return '⭐';
    if (actualStreak < 30) return '👑';
    return '🏆';
  };

  const getMotivationalMessage = () => {
    if (actualStreak === 0) {
      return "Start your cooking journey today!";
    }
    if (todayCompleted) {
      return `Amazing! ${actualStreak} days strong 💪`;
    }
    if (actualStreak === 1) {
      return "Keep the momentum going!";
    }
    if (actualStreak < 7) {
      return `${7 - actualStreak} more days to reach a week!`;
    }
    if (actualStreak < 30) {
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
              <Text style={styles.streakNumber}>{actualStreak}</Text>
              <Text style={styles.streakEmoji}>{getStreakEmoji()}</Text>
            </View>
            <Text style={styles.streakLabel}>
              day{actualStreak !== 1 ? 's' : ''} streak
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
    marginBottom: spacing.xl, // Using design system spacing (32px)
    marginHorizontal: spacing.l, // Using design system spacing (24px)
    backgroundColor: colors.legacy.white, // White background for contrast
    borderRadius: componentBorderRadius.recipeCard, // Using design system border radius (16px)
    padding: spacing.l, // Using design system spacing (24px)
    ...componentShadows.recipeCard, // Using new shadow system
  },
  header: {
    marginBottom: spacing.l, // Using design system spacing (24px)
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    ...typography.h3, // Using H3 typography (24px, SemiBold)
    color: colors.deepNavy, // Changed from #333 to Deep Navy
    marginBottom: spacing.xs, // Using design system spacing (4px)
  },
  subtitle: {
    ...typography.bodySmall, // Using bodySmall typography (14px, Regular)
    color: colors.warmGray, // Changed from #666 to Warm Gray
  },
  content: {
    gap: spacing.l, // Using design system spacing (24px)
  },
  streakDisplay: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.m, // Using design system spacing (16px)
    backgroundColor: colors.info.background, // Changed from #f8f9fa to info background
    borderRadius: componentBorderRadius.card, // Using design system border radius (12px)
    borderWidth: 2,
    borderColor: colors.spiceOrange, // Changed from #FF6B35 to Spice Orange
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
    fontWeight: typography.h1.fontWeight, // Bold weight
    color: colors.spiceOrange, // Changed from #FF6B35 to Spice Orange
    lineHeight: 40,
  },
  streakEmoji: {
    fontSize: 24,
    marginLeft: spacing.s, // Using design system spacing (8px)
  },
  streakLabel: {
    ...typography.bodySmall, // Using bodySmall typography (14px, Regular)
    color: colors.warmGray, // Changed from #666 to Warm Gray
    fontWeight: typography.h4.fontWeight, // SemiBold weight
  },
  weeklyProgress: {
    alignItems: 'center',
  },
  weekLabel: {
    ...typography.bodyMedium, // Using bodyMedium typography (16px, Regular)
    fontWeight: typography.h4.fontWeight, // SemiBold weight
    color: colors.deepNavy, // Changed from #333 to Deep Navy
    marginBottom: spacing.m, // Using design system spacing (16px)
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: spacing.s, // Using design system spacing (8px)
  },
  dayContainer: {
    alignItems: 'center',
    flex: 1,
  },
  dayLabel: {
    fontSize: 12,
    color: colors.warmGrayLight, // Changed from #999 to Warm Gray Light
    marginBottom: spacing.s, // Using design system spacing (8px)
    fontWeight: typography.link.fontWeight, // Medium weight
  },
  todayLabel: {
    color: colors.spiceOrange, // Changed from #007AFF to Spice Orange
    fontWeight: typography.h4.fontWeight, // SemiBold weight
  },
  progressDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.warmCreamDark, // Changed from #f0f0f0 to Warm Cream Dark
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: lightTheme.borders, // Changed from #e0e0e0 to design system border
  },
  completedDot: {
    backgroundColor: colors.spiceOrange, // Changed from #FF6B35 to Spice Orange
    borderColor: colors.spiceOrange, // Changed from #FF6B35 to Spice Orange
  },
  todayDot: {
    borderColor: colors.spiceOrange, // Changed from #007AFF to Spice Orange
    backgroundColor: colors.legacy.white, // White background
  },
  futureDot: {
    backgroundColor: colors.warmCreamLight, // Changed from #f8f8f8 to Warm Cream Light
    borderColor: colors.warmCreamDark, // Changed from #f0f0f0 to Warm Cream Dark
  },
  incompleteDot: {
    backgroundColor: colors.warmCreamLight, // Changed from #f8f8f8 to Warm Cream Light
    borderColor: colors.warmCreamDark, // Changed from #f0f0f0 to Warm Cream Dark
  },
  checkmark: {
    fontSize: 16,
    fontWeight: typography.h4.fontWeight, // SemiBold weight
    color: colors.legacy.white, // White text
  },
  todayIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.spiceOrange, // Changed from #007AFF to Spice Orange
  },
  goalContainer: {
    alignItems: 'center',
  },
  callToAction: {
    backgroundColor: colors.warning.background, // Changed from #FFF3E0 to warning background
    paddingVertical: spacing.m, // Using design system spacing (16px)
    paddingHorizontal: spacing.m, // Using design system spacing (16px)
    borderRadius: componentBorderRadius.input, // Using design system border radius (8px)
    borderWidth: 1,
    borderColor: colors.warning.border, // Changed from #FFE0B2 to warning border
  },
  goalText: {
    ...typography.bodySmall, // Using bodySmall typography (14px, Regular)
    color: colors.warning.primary, // Changed from #F57C00 to warning primary
    textAlign: 'center',
    fontWeight: typography.link.fontWeight, // Medium weight
  },
  completedMessage: {
    backgroundColor: colors.success.background, // Changed from #E8F5E8 to success background
    paddingVertical: spacing.m, // Using design system spacing (16px)
    paddingHorizontal: spacing.m, // Using design system spacing (16px)
    borderRadius: componentBorderRadius.input, // Using design system border radius (8px)
    borderWidth: 1,
    borderColor: colors.success.border, // Changed from #C8E6C9 to success border
  },
  completedText: {
    ...typography.bodySmall, // Using bodySmall typography (14px, Regular)
    color: colors.success.primary, // Changed from #2E7D32 to success primary
    textAlign: 'center',
    fontWeight: typography.link.fontWeight, // Medium weight
  },
});

export default KitchenStreak; 