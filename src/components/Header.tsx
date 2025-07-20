import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { 
  colors, 
  typography, 
  spacing, 
  componentShadows,
  componentBorderRadius,
  lightTheme
} from '../styles';

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
        {/* Left side search icon */}
        <TouchableOpacity 
          ref={searchButtonRef}
          style={styles.searchIconButton}
          onPress={handleSearchPress}
          activeOpacity={0.7}
        >
          <Ionicons name="search" size={24} color={colors.spiceOrange} />
        </TouchableOpacity>
        
        {/* Centered app name */}
        <Text style={styles.appName}>Recipic</Text>
        
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
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    backgroundColor: colors.warmCream, // Changed from #fff to Warm Cream
    paddingTop: Platform.OS === 'android' ? 45 : 70,
    paddingBottom: spacing.m, // Using design system spacing (16px)
    ...componentShadows.header, // Using new shadow system
    marginTop: Platform.OS === 'ios' ? -30 : 0,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.l, // Using design system spacing (24px)
  },
  searchIconButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appName: {
    ...typography.h2, // Using H2 typography (28px, Bold)
    color: colors.spiceOrange, // Changed from #007AFF to Spice Orange
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
    backgroundColor: colors.warmCreamDark, // Changed from #f0f0f0 to Warm Cream Dark
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: lightTheme.borders, // Changed from #e0e0e0 to design system border
  },
  profileText: {
    fontSize: 18,
    color: colors.warmGray, // Changed from #666 to Warm Gray
  },
});

export default Header; 