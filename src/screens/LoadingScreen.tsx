import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Animated, Platform } from 'react-native';
import LottieView from 'lottie-react-native';

const LoadingScreen: React.FC = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Start entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const animatedStyle = {
    opacity: fadeAnim,
    transform: [{ scale: scaleAnim }],
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Animated.View style={[styles.logoContainer, animatedStyle]}>
          <View style={styles.logoWrapper}>
            <LottieView
              source={require('../../assets/animations/cooking-professional.json')}
              autoPlay
              loop
              style={styles.lottieAnimation}
            />
          </View>
          <Text style={styles.appName}>Dishly</Text>
        </Animated.View>
        
        <Animated.View style={[styles.taglineContainer, animatedStyle]}>
          <Text style={styles.tagline}>AI-Powered Cooking Companion</Text>
          <Text style={styles.subtitle}>Discover • Cook • Enjoy</Text>
        </Animated.View>
        
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Preparing your kitchen...</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  lottieAnimation: {
    width: 100,
    height: 100,
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#007AFF',
    letterSpacing: 1,
  },
  taglineContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  tagline: {
    fontSize: 18,
    color: '#333',
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    fontWeight: '400',
    textAlign: 'center',
  },
  loadingContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'android' ? 80 : 100,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#999',
    fontWeight: '500',
  },
});

export default LoadingScreen; 