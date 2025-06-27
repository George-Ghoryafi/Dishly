import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Animated,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Recipe } from '../types/Recipe';

interface CookingTimerScreenProps {
  recipe: Recipe;
  onBack: () => void;
  onComplete: () => void;
}

const CookingTimerScreen: React.FC<CookingTimerScreenProps> = ({
  recipe,
  onBack,
  onComplete,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [totalElapsedTime, setTotalElapsedTime] = useState(0);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const progressAnim = useRef(new Animated.Value(0)).current;
  
  const currentStep = recipe.preparationSteps?.[currentStepIndex];
  const totalSteps = recipe.preparationSteps?.length || 0;
  const isLastStep = currentStepIndex === totalSteps - 1;
  
  // Calculate total recipe duration and time-based progress
  const totalRecipeDuration = recipe.preparationSteps?.reduce((total, step) => total + step.duration, 0) || 0;
  const completedDuration = recipe.preparationSteps?.slice(0, currentStepIndex).reduce((total, step) => total + step.duration, 0) || 0;
  const currentStepProgress = currentStep ? ((currentStep.duration * 60 - timeRemaining) / (currentStep.duration * 60)) : 0;
  const currentStepDurationCompleted = currentStep ? (currentStep.duration * currentStepProgress) : 0;
  const totalTimeProgress = totalRecipeDuration > 0 ? ((completedDuration + currentStepDurationCompleted) / totalRecipeDuration) : 0;
  
  // Initialize timer when step changes
  useEffect(() => {
    if (currentStep) {
      const stepDuration = currentStep.duration * 60; // Convert minutes to seconds
      setTimeRemaining(stepDuration);
      setIsTimerRunning(false);
      
      // Reset progress animation
      progressAnim.setValue(0);
    }
  }, [currentStepIndex, currentStep]);
  
  // Timer logic
  useEffect(() => {
    if (isTimerRunning && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          const newTime = prev - 1;
          setTotalElapsedTime(elapsed => elapsed + 1);
          
          // Update progress animation
          if (currentStep) {
            const stepDuration = currentStep.duration * 60;
            const progress = (stepDuration - newTime) / stepDuration;
            Animated.timing(progressAnim, {
              toValue: progress,
              duration: 100,
              useNativeDriver: false,
            }).start();
          }
          
          // Auto-advance when timer reaches 0
          if (newTime <= 0) {
            handleStepComplete();
            return 0;
          }
          
          return newTime;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isTimerRunning, timeRemaining]);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const formatTotalTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return mins > 0 ? `${mins}m` : `${seconds}s`;
  };
  
  const handlePlayPause = () => {
    setIsTimerRunning(!isTimerRunning);
  };
  
  const handleSkipStep = () => {
    if (isLastStep) {
      handleCookingComplete();
    } else {
      setCurrentStepIndex(prev => prev + 1);
    }
  };
  
  const handleStepComplete = () => {
    setIsTimerRunning(false);
    
    if (isLastStep) {
      handleCookingComplete();
    } else {
      // Show completion feedback and auto-advance
      Alert.alert(
        'Step Complete!',
        `Step ${currentStepIndex + 1} is finished. Ready for the next step?`,
        [
          {
            text: 'Next Step',
            onPress: () => setCurrentStepIndex(prev => prev + 1),
          }
        ]
      );
    }
  };
  
  const handleCookingComplete = () => {
    Alert.alert(
      'Cooking Complete! 🎉',
      `Congratulations! You've finished cooking ${recipe.name}. Total time: ${formatTotalTime(totalElapsedTime)}`,
      [
        {
          text: 'Done',
          onPress: onComplete,
        }
      ]
    );
  };
  
  const handlePreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };
  
  const handleExit = () => {
    Alert.alert(
      'Exit Cooking?',
      'Are you sure you want to exit? Your progress will be lost.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Exit', style: 'destructive', onPress: onBack },
      ]
    );
  };
  
  if (!currentStep) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No cooking steps available</Text>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleExit} style={styles.headerButton}>
          <Ionicons name="close" size={24} color="#333" />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.recipeName}>{recipe.name}</Text>
          <Text style={styles.stepProgress}>
            Step {currentStepIndex + 1} of {totalSteps}
          </Text>
        </View>
        
        <View style={styles.totalTimeContainer}>
          <Ionicons name="time" size={16} color="#666" />
          <Text style={styles.totalTimeText}>{formatTotalTime(totalElapsedTime)}</Text>
        </View>
      </View>
      
      {/* Step Navigation */}
      <View style={styles.stepNavigationContainer}>
        <TouchableOpacity 
          style={[styles.stepNavButton, currentStepIndex === 0 && styles.stepNavButtonDisabled]}
          onPress={handlePreviousStep}
          disabled={currentStepIndex === 0}
        >
          <Ionicons 
            name="chevron-back" 
            size={20} 
            color={currentStepIndex === 0 ? '#ccc' : '#007AFF'} 
          />
          <Text style={[styles.stepNavButtonText, currentStepIndex === 0 && styles.stepNavButtonTextDisabled]}>
            Previous
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.stepNavButton} onPress={handleSkipStep}>
          <Text style={styles.stepNavButtonText}>
            {isLastStep ? 'Finish' : 'Skip'}
          </Text>
          <Ionicons 
            name={isLastStep ? "checkmark" : "chevron-forward"} 
            size={20} 
            color="#007AFF" 
          />
        </TouchableOpacity>
      </View>
      
      {/* Main Content */}
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {/* Step Header */}
        <View style={styles.stepHeader}>
          <View style={styles.stepNumberContainer}>
            <Text style={styles.stepNumber}>{currentStep.stepNumber}</Text>
          </View>
          <View style={styles.stepTitleContainer}>
            <Text style={styles.stepTitle}>{currentStep.title}</Text>
            <View style={styles.stepDurationContainer}>
              <Ionicons name="timer" size={16} color="#007AFF" />
              <Text style={styles.stepDuration}>{currentStep.duration} minutes</Text>
            </View>
          </View>
        </View>
        
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <View 
              style={[
                styles.progressFill,
                {
                  width: `${Math.min(totalTimeProgress * 100, 100)}%`
                }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {Math.round(totalTimeProgress * 100)}% of cooking time completed
          </Text>
        </View>
        
        {/* Timer Display */}
        <View style={styles.timerContainer}>
          <Text style={styles.timerDisplay}>{formatTime(timeRemaining)}</Text>
          <Text style={styles.timerLabel}>
            {timeRemaining === 0 ? 'Time\'s up!' : 'Remaining'}
          </Text>
        </View>
        
        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>Instructions</Text>
          <Text style={styles.instructionsText}>{currentStep.instruction}</Text>
          
          {currentStep.tips && (
            <View style={styles.tipContainer}>
              <Ionicons name="bulb" size={18} color="#FF9500" />
              <Text style={styles.tipText}>{currentStep.tips}</Text>
            </View>
          )}
        </View>
      </ScrollView>
      
      {/* Timer Control */}
      <View style={styles.timerControlContainer}>
        <TouchableOpacity 
          style={styles.timerButton}
          onPress={handlePlayPause}
        >
          <Ionicons 
            name={isTimerRunning ? "pause" : "play"} 
            size={24} 
            color="#fff" 
          />
          <Text style={styles.timerButtonText}>
            {isTimerRunning ? 'Pause Timer' : 'Start Timer'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerButton: {
    padding: 4,
  },
  stepNavigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 4,
    backgroundColor: '#fafafa',
  },
  stepNavButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  stepNavButtonDisabled: {
    opacity: 0.4,
  },
  stepNavButtonText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  stepNavButtonTextDisabled: {
    color: '#bbb',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 20,
  },
  recipeName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
  },
  stepProgress: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  totalTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  totalTimeText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressTrack: {
    height: 6,
    backgroundColor: '#e9ecef',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  stepNumberContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  stepNumber: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '700',
  },
  stepTitleContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 24,
    color: '#333',
    fontWeight: '700',
    marginBottom: 4,
  },
  stepDurationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stepDuration: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  timerDisplay: {
    fontSize: 48,
    color: '#007AFF',
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  timerLabel: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
    fontWeight: '500',
  },
  instructionsContainer: {
    marginBottom: 20,
  },
  instructionsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  instructionsText: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
    marginBottom: 16,
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF9E6',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9500',
  },
  tipText: {
    fontSize: 14,
    color: '#B8860B',
    fontWeight: '500',
    flex: 1,
    lineHeight: 20,
  },
  timerControlContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    alignItems: 'center',
  },
  timerButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    gap: 8,
    minWidth: 140,
  },
  timerButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CookingTimerScreen; 