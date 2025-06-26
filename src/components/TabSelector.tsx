import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, LayoutChangeEvent, Platform } from 'react-native';

interface TabSelectorProps {
  selectedTab: 'today' | 'month';
  onTabChange: (tab: 'today' | 'month') => void;
}

const TabSelector: React.FC<TabSelectorProps> = ({ selectedTab, onTabChange }) => {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const [leftTabWidth, setLeftTabWidth] = useState(0);
  const [rightTabWidth, setRightTabWidth] = useState(0);

  useEffect(() => {
    const targetValue = selectedTab === 'today' ? 0 : 1;
    
    Animated.spring(slideAnim, {
      toValue: targetValue,
      tension: 120,
      friction: 7,
      useNativeDriver: false,
    }).start();
  }, [selectedTab, slideAnim]);

  const handleLeftTabLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    if (leftTabWidth === 0) {
      setLeftTabWidth(width);
    }
  };

  const handleRightTabLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    if (rightTabWidth === 0) {
      setRightTabWidth(width);
    }
  };

  const getSliderStyle = () => {
    if (leftTabWidth === 0 || rightTabWidth === 0) return { transform: [{ translateX: 0 }] };
    
    const translateX = slideAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, leftTabWidth + 4], // Left tab width + margin between tabs
    });

    return {
      transform: [{ translateX }],
    };
  };

  const getSliderWidth = () => {
    if (selectedTab === 'today') {
      return leftTabWidth > 0 ? leftTabWidth : 120;
    } else {
      return rightTabWidth > 0 ? rightTabWidth : 120;
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        {/* Animated slider background */}
        <Animated.View 
          style={[
            styles.slider, 
            getSliderStyle(),
            { width: getSliderWidth() }
          ]} 
        />
        
        <TouchableOpacity
          style={[styles.tab, styles.leftTab]}
          onPress={() => onTabChange('today')}
          activeOpacity={0.7}
          onLayout={handleLeftTabLayout}
        >
          <Text style={[
            styles.tabText,
            selectedTab === 'today' && styles.activeTabText
          ]}>
            Today's Picks
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, styles.rightTab]}
          onPress={() => onTabChange('month')}
          activeOpacity={0.7}
          onLayout={handleRightTabLayout}
        >
          <Text style={[
            styles.tabText,
            selectedTab === 'month' && styles.activeTabText
          ]}>
            This Month
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: Platform.OS === 'android' ? 30 : 20,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
    padding: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  slider: {
    position: 'absolute',
    top: 4,
    left: 4,
    height: 41, // Match exact tab height: paddingVertical (12) * 2 + line height
    backgroundColor: '#007AFF',
    borderRadius: 21,
    elevation: 4,
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  leftTab: {
    marginRight: 2,
  },
  rightTab: {
    marginLeft: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
  },
});

export default TabSelector; 