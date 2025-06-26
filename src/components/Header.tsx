import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface HeaderProps {
  onProfilePress?: () => void;
  onSearchPress?: (layout: { x: number; y: number; width: number; height: number }) => void;
  searchPlaceholder?: string;
}

const Header: React.FC<HeaderProps> = ({ 
  onProfilePress, 
  onSearchPress, 
  searchPlaceholder = "Search for recipes and dishes..." 
}) => {
  const searchButtonRef = useRef<any>(null);

  const handleSearchPress = () => {
    if (searchButtonRef.current && onSearchPress) {
      searchButtonRef.current.measure((x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
        onSearchPress({ x: pageX, y: pageY, width, height });
      });
    }
  };

  return (
    <View style={styles.outerContainer}>
      <View style={styles.topRow}>
        {/* Left spacer to help center the title */}
        <View style={styles.leftSpacer} />
        
        {/* Centered app name */}
        <Text style={styles.appName}>Dishly</Text>
        
        {/* Right side profile icon */}
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={onProfilePress}
          activeOpacity={0.7}
        >
          <View style={styles.profileIcon}>
            <Text style={styles.profileText}>👤</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Search Button Row */}
      <View style={styles.searchRow}>
        <TouchableOpacity 
          ref={searchButtonRef}
          style={styles.searchButton}
          onPress={handleSearchPress}
          activeOpacity={0.7}
        >
          <Ionicons name="search" size={18} color="#666" style={styles.searchIcon} />
          <Text style={styles.searchPlaceholder}>{searchPlaceholder}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? 45 : 70,
    paddingBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginTop: Platform.OS === 'ios' ? -30 : 0,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  searchRow: {
    paddingHorizontal: 20,
  },
  leftSpacer: {
    width: 44, // Same width as profile button to center the title
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    textAlign: 'center',
    flex: 1,
  },
  profileButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  profileText: {
    fontSize: 18,
    color: '#666',
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 15,
    color: '#999',
  },
});

export default Header; 