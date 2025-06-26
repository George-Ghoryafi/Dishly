import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  SafeAreaView, 
  TouchableOpacity, 
  TextInput,
  ScrollView,
  Platform,
  Animated,
  Dimensions,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
}

interface SearchModalProps {
  visible: boolean;
  onClose: () => void;
  onSearch?: (query: string) => void;
  onCategoryPress?: (category: Category) => void;
  searchButtonLayout?: { x: number; y: number; width: number; height: number };
}

const categories: Category[] = [
  { id: '1', name: 'Quick & Easy', icon: '⚡', description: 'Ready in 30 minutes or less' },
  { id: '2', name: 'Healthy', icon: '🥗', description: 'Nutritious and balanced meals' },
  { id: '3', name: 'Comfort Food', icon: '🍲', description: 'Hearty and satisfying dishes' },
  { id: '4', name: 'Vegetarian', icon: '🌱', description: 'Plant-based recipes' },
  { id: '5', name: 'Desserts', icon: '🍰', description: 'Sweet treats and baked goods' },
  { id: '6', name: 'Breakfast', icon: '🍳', description: 'Start your day right' },
  { id: '7', name: 'Dinner', icon: '🍽️', description: 'Main course meals' },
  { id: '8', name: 'International', icon: '🌍', description: 'Cuisines from around the world' },
];

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const SearchModal: React.FC<SearchModalProps> = ({ 
  visible, 
  onClose, 
  onSearch, 
  onCategoryPress,
  searchButtonLayout 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [animationComplete, setAnimationComplete] = useState(false);
  const searchInputRef = useRef<TextInput>(null);
  
  // Animation values
  const animatedValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(0)).current;
  const opacityValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setAnimationComplete(false);
      // Start the expansion animation
      Animated.parallel([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(opacityValue, {
          toValue: 1,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start(() => {
        setAnimationComplete(true);
        // No auto-focus - let user tap to focus
      });
    } else {
      // Reset animation values when closing
      animatedValue.setValue(0);
      scaleValue.setValue(0);
      opacityValue.setValue(0);
      setAnimationComplete(false);
      setSearchQuery('');
    }
  }, [visible]);

  const handleClose = () => {
    // Dismiss keyboard first
    Keyboard.dismiss();
    // Animate out before closing
    Animated.parallel([
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 250,
        useNativeDriver: false,
      }),
      Animated.timing(scaleValue, {
        toValue: 0,
        duration: 250,
        useNativeDriver: false,
      }),
      Animated.timing(opacityValue, {
        toValue: 0,
        duration: 150,
        useNativeDriver: false,
      }),
    ]).start(() => {
      onClose();
    });
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleSearch = () => {
    if (searchQuery.trim() && onSearch) {
      onSearch(searchQuery.trim());
      handleClose();
    }
  };

  const handleCategoryPress = (category: Category) => {
    onCategoryPress?.(category);
    handleClose();
  };

  // Calculate animation interpolations
  const initialTop = searchButtonLayout ? searchButtonLayout.y : 100;
  const initialLeft = searchButtonLayout ? searchButtonLayout.x : 20;
  const initialWidth = searchButtonLayout ? searchButtonLayout.width : screenWidth - 40;
  const initialHeight = searchButtonLayout ? searchButtonLayout.height : 50;

  const animatedTop = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [initialTop, 0],
  });

  const animatedLeft = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [initialLeft, 0],
  });

  const animatedWidth = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [initialWidth, screenWidth],
  });

  const animatedHeight = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [initialHeight, screenHeight],
  });

  const borderRadius = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [25, 0],
  });

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <Animated.View 
          style={[
            styles.animatedContainer,
            {
              top: animatedTop,
              left: animatedLeft,
              width: animatedWidth,
              height: animatedHeight,
              borderRadius: borderRadius,
              transform: [{ scale: scaleValue }],
            }
          ]}
        >
          <SafeAreaView style={styles.container}>
            <Animated.View style={[styles.header, { opacity: opacityValue }]}>
              <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Search Recipes</Text>
              <View style={styles.placeholder} />
            </Animated.View>

            <View style={styles.searchSection}>
              <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
                <TextInput
                  ref={searchInputRef}
                  style={styles.searchInput}
                  placeholder="Search for recipes and dishes..."
                  placeholderTextColor="#999"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  onSubmitEditing={handleSearch}
                  returnKeyType="search"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity 
                    onPress={() => setSearchQuery('')} 
                    style={styles.clearButton}
                  >
                    <Ionicons name="close-circle" size={20} color="#999" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {animationComplete && (
              <Animated.ScrollView 
                style={[styles.content, { opacity: opacityValue }]} 
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                <TouchableWithoutFeedback onPress={dismissKeyboard}>
                  <View>
                    <View style={styles.section}>
                      <Text style={styles.sectionTitle}>Browse Categories</Text>
                      <Text style={styles.sectionSubtitle}>Find recipes by type</Text>
                    </View>

                    <View style={styles.categoriesGrid}>
                      {categories.map((category) => (
                        <TouchableOpacity
                          key={category.id}
                          style={styles.categoryCard}
                          onPress={() => handleCategoryPress(category)}
                          activeOpacity={0.7}
                        >
                          <Text style={styles.categoryIcon}>{category.icon}</Text>
                          <Text style={styles.categoryName}>{category.name}</Text>
                          <Text style={styles.categoryDescription}>{category.description}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </Animated.ScrollView>
            )}
          </SafeAreaView>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  animatedContainer: {
    position: 'absolute',
    backgroundColor: '#f5f5f5',
    overflow: 'hidden',
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  closeButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  placeholder: {
    width: 32,
  },
  searchSection: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  clearButton: {
    marginLeft: 8,
    padding: 4,
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  categoriesGrid: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  categoryCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
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
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default SearchModal; 