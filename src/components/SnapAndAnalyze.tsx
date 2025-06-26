import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');

interface SnapAndAnalyzeProps {
  onSnapPress: () => void;
}

const SnapAndAnalyze: React.FC<SnapAndAnalyzeProps> = ({ onSnapPress }) => {
  return (
    <View style={styles.container}>
      <View style={styles.ctaCard}>
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <View style={styles.cameraIcon}>
                <Ionicons name="camera" size={40} color="#fff" />
              </View>
              <View style={styles.aiIndicator}>
                <Ionicons name="sparkles" size={20} color="#fff" />
              </View>
            </View>
            
            <View style={styles.textContainer}>
              <Text style={styles.title}>AI Food Analysis</Text>
              <Text style={styles.subtitle}>
                Point your camera at any dish to get instant nutritional info, ingredients, and cooking suggestions
              </Text>
            </View>
            
            <View style={styles.actionContainer}>
              <TouchableOpacity 
                style={styles.ctaButton}
                onPress={onSnapPress}
                activeOpacity={0.8}
              >
                <Text style={styles.ctaText}>Analyze Food</Text>
                <Ionicons name="chevron-forward" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Decorative elements */}
          <View style={styles.decorativeCircle1} />
          <View style={styles.decorativeCircle2} />
          <View style={styles.decorativeCircle3} />
        </LinearGradient>
      </View>
      
      <View style={styles.featureRow}>
        <View style={styles.featureItem}>
          <Ionicons name="restaurant" size={24} color="#007AFF" />
          <Text style={styles.featureText}>Dish ID</Text>
        </View>
        <View style={styles.featureItem}>
          <Ionicons name="nutrition" size={24} color="#007AFF" />
          <Text style={styles.featureText}>Nutrition</Text>
        </View>
        <View style={styles.featureItem}>
          <Ionicons name="warning" size={24} color="#007AFF" />
          <Text style={styles.featureText}>Allergens</Text>
        </View>
        <View style={styles.featureItem}>
          <Ionicons name="book" size={24} color="#007AFF" />
          <Text style={styles.featureText}>Recipes</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  ctaCard: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#667eea',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  gradient: {
    padding: 28,
    minHeight: 200,
    position: 'relative',
  },
  content: {
    flexDirection: 'column',
    alignItems: 'center',
    zIndex: 2,
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  cameraIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  aiIndicator: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ff6b35',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 24,
    textAlign: 'center',
    maxWidth: '90%',
  },
  actionContainer: {
    alignItems: 'center',
  },
  ctaButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  ctaText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginRight: 8,
  },
  decorativeCircle1: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    zIndex: 1,
  },
  decorativeCircle2: {
    position: 'absolute',
    bottom: -40,
    left: -40,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    zIndex: 1,
  },
  decorativeCircle3: {
    position: 'absolute',
    top: '50%',
    right: -20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    zIndex: 1,
  },
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 4,
    gap: 8,
  },
  featureItem: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: 8,
    gap: 6,
  },
  featureText: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    fontWeight: '600',
    lineHeight: 16,
  },
});

export default SnapAndAnalyze; 