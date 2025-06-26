import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';

interface HeaderProps {
  onProfilePress?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onProfilePress }) => {
  return (
    <View style={styles.container}>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 45 : 70,
    paddingBottom: 15,
    backgroundColor: '#fff',
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
});

export default Header; 