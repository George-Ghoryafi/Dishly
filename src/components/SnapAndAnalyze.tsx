import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FlipBookPreviewProps {
  onFlipBookPress: () => void;
}

const FlipBookPreview: React.FC<FlipBookPreviewProps> = ({ onFlipBookPress }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Recipe Collections</Text>
          <Text style={styles.subtitle}>Discover curated picks and monthly favorites</Text>
        </View>
      </View>
      
      <View style={styles.content}>
        <TouchableOpacity 
          style={styles.flipBookButton}
          onPress={onFlipBookPress}
          activeOpacity={0.8}
        >
          <View style={styles.iconContainer}>
            <Ionicons name="library" size={24} color="#007AFF" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.buttonTitle}>Browse Collections</Text>
            <Text style={styles.buttonSubtitle}>Today's picks & monthly favorites</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 16,
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
    paddingHorizontal: 20,
  },
  flipBookButton: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f9ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  buttonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  buttonSubtitle: {
    fontSize: 14,
    color: '#666',
  },
});

export default FlipBookPreview; 