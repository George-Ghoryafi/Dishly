import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SaveStatusProps {
  visible: boolean;
  onComplete: () => void;
  message?: string;
}

const SaveStatus: React.FC<SaveStatusProps> = ({ 
  visible, 
  onComplete, 
  message = "Profile Updated!" 
}) => {
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const checkmarkScale = useRef(new Animated.Value(0)).current;
  const checkmarkOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Reset animations
      overlayOpacity.setValue(0);
      checkmarkScale.setValue(0);
      checkmarkOpacity.setValue(0);

      // Animate overlay fade in
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Animate checkmark with delay
      Animated.sequence([
        Animated.delay(200),
        Animated.parallel([
          Animated.timing(checkmarkOpacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.spring(checkmarkScale, {
            toValue: 1,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
          })
        ])
      ]).start();

      // Call onComplete after animation
      setTimeout(() => {
        onComplete();
      }, 1500);
    }
  }, [visible, onComplete]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
      <View style={styles.content}>
        <Animated.View 
          style={[
            styles.checkmarkContainer,
            { 
              opacity: checkmarkOpacity,
              transform: [{ scale: checkmarkScale }] 
            }
          ]}
        >
          <Ionicons name="checkmark-circle" size={80} color="#007AFF" />
        </Animated.View>
        <Text style={styles.message}>{message}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  content: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  checkmarkContainer: {
    marginBottom: 20,
  },
  message: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
});

export default SaveStatus; 