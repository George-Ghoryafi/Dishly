import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchButtonProps {
  placeholder?: string;
  onPress?: (layout: { x: number; y: number; width: number; height: number }) => void;
}

const SearchButton: React.FC<SearchButtonProps> = ({ 
  placeholder = "Search for recipes and dishes...", 
  onPress 
}) => {
  const buttonRef = useRef<TouchableOpacity>(null);

  const handlePress = () => {
    if (buttonRef.current && onPress) {
      buttonRef.current.measure((x, y, width, height, pageX, pageY) => {
        onPress({ x: pageX, y: pageY, width, height });
      });
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        ref={buttonRef}
        style={styles.searchContainer}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <Text style={styles.placeholderText}>{placeholder}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: '#000',
    ...Platform.select({
      ios: {
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  searchIcon: {
    marginRight: 12,
  },
  placeholderText: {
    flex: 1,
    fontSize: 16,
    color: '#999',
  },
});

export default SearchButton; 