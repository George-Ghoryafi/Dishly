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
import { Recipe } from '../types/Recipe';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface FilterOptions {
  searchQuery: string;
  maxCookTimes: number[];
  difficulties: ('Easy' | 'Medium' | 'Hard')[];
  allergensToAvoid: string[];
  ingredientsToInclude: string[];
}

interface FavoritesSearchModalProps {
  visible: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterOptions) => void;
  favoriteRecipes: Recipe[];
}

const FavoritesSearchModal: React.FC<FavoritesSearchModalProps> = ({
  visible,
  onClose,
  onApplyFilters,
  favoriteRecipes
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCookTimes, setSelectedCookTimes] = useState<number[]>([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<('Easy' | 'Medium' | 'Hard')[]>([]);
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  // Get unique allergens from favorite recipes
  const availableAllergens = React.useMemo(() => {
    const allergenSet = new Set<string>();
    favoriteRecipes.forEach(recipe => {
      recipe.allergens.forEach(allergen => {
        allergenSet.add(allergen.type);
      });
    });
    return Array.from(allergenSet);
  }, [favoriteRecipes]);

  // Get common ingredients from favorite recipes
  const commonIngredients = React.useMemo(() => {
    const ingredientCount = new Map<string, number>();
    favoriteRecipes.forEach(recipe => {
      recipe.ingredients.forEach(ingredient => {
        const name = ingredient.name.toLowerCase();
        ingredientCount.set(name, (ingredientCount.get(name) || 0) + 1);
      });
    });
    
    // Return ingredients that appear in at least 2 recipes, sorted by frequency
    return Array.from(ingredientCount.entries())
      .filter(([_, count]) => count >= 2)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, _]) => name);
  }, [favoriteRecipes]);

  const cookTimeOptions = [15, 30, 45, 60, 90];
  const difficultyOptions: ('Easy' | 'Medium' | 'Hard')[] = ['Easy', 'Medium', 'Hard'];

  useEffect(() => {
    if (visible) {
      Keyboard.dismiss();
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: screenHeight,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleClose = () => {
    Keyboard.dismiss();
    // Animate slide down before closing
    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: screenHeight,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  const handleApplyFilters = () => {
    const filters: FilterOptions = {
      searchQuery: searchQuery.trim(),
      maxCookTimes: selectedCookTimes,
      difficulties: selectedDifficulties,
      allergensToAvoid: selectedAllergens,
      ingredientsToInclude: selectedIngredients,
    };
    
    onApplyFilters(filters);
    handleClose();
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCookTimes([]);
    setSelectedDifficulties([]);
    setSelectedAllergens([]);
    setSelectedIngredients([]);
  };

  const hasActiveFilters = searchQuery.trim() || selectedCookTimes.length > 0 || selectedDifficulties.length > 0 || selectedAllergens.length > 0 || selectedIngredients.length > 0;

  // Helper functions for multiselect
  const toggleCookTime = (time: number) => {
    setSelectedCookTimes(prev => 
      prev.includes(time) ? prev.filter(t => t !== time) : [...prev, time]
    );
  };

  const toggleDifficulty = (difficulty: 'Easy' | 'Medium' | 'Hard') => {
    setSelectedDifficulties(prev => 
      prev.includes(difficulty) ? prev.filter(d => d !== difficulty) : [...prev, difficulty]
    );
  };

  const toggleAllergen = (allergen: string) => {
    setSelectedAllergens(prev => 
      prev.includes(allergen) ? prev.filter(a => a !== allergen) : [...prev, allergen]
    );
  };

  const toggleIngredient = (ingredient: string) => {
    setSelectedIngredients(prev => 
      prev.includes(ingredient) ? prev.filter(i => i !== ingredient) : [...prev, ingredient]
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.modalContainer}>
          <Animated.View 
            style={[
              styles.backdrop,
              {
                opacity: backdropOpacity,
              }
            ]}
          />
          
          <TouchableWithoutFeedback onPress={() => {}}>
            <Animated.View 
              style={[
                styles.modalContent,
                {
                  transform: [{ translateY: slideAnim }],
                }
              ]}
            >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Search & Filter</Text>
            <TouchableOpacity 
              onPress={handleClearFilters} 
              style={styles.clearButton}
              disabled={!hasActiveFilters}
            >
              <Text style={[
                styles.clearButtonText,
                !hasActiveFilters && styles.clearButtonTextDisabled
              ]}>
                Clear
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Search Input */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Search</Text>
              <View style={styles.searchInputContainer}>
                <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search recipes by name or description..."
                  placeholderTextColor="#999"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  returnKeyType="search"
                />
              </View>
            </View>

            {/* Cook Time Filter */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Max Cook Time</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                <View style={styles.optionsRow}>
                  {cookTimeOptions.map((time) => (
                    <TouchableOpacity
                      key={time}
                      style={[
                        styles.optionChip,
                        selectedCookTimes.includes(time) && styles.optionChipSelected
                      ]}
                      onPress={() => toggleCookTime(time)}
                    >
                      <Text style={[
                        styles.optionChipText,
                        selectedCookTimes.includes(time) && styles.optionChipTextSelected
                      ]}>
                        ≤ {time}m
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            {/* Difficulty Filter */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Difficulty</Text>
              <View style={styles.optionsRow}>
                {difficultyOptions.map((difficulty) => (
                  <TouchableOpacity
                    key={difficulty}
                    style={[
                      styles.optionChip,
                      selectedDifficulties.includes(difficulty) && styles.optionChipSelected
                    ]}
                    onPress={() => toggleDifficulty(difficulty)}
                  >
                    <Text style={[
                      styles.optionChipText,
                      selectedDifficulties.includes(difficulty) && styles.optionChipTextSelected
                    ]}>
                      {difficulty}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Allergen Filter */}
            {availableAllergens.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Avoid Allergens</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                  <View style={styles.optionsRow}>
                    {availableAllergens.map((allergen) => (
                      <TouchableOpacity
                        key={allergen}
                        style={[
                          styles.optionChip,
                          selectedAllergens.includes(allergen) && styles.optionChipSelected
                        ]}
                        onPress={() => toggleAllergen(allergen)}
                      >
                        <Text style={[
                          styles.optionChipText,
                          selectedAllergens.includes(allergen) && styles.optionChipTextSelected
                        ]}>
                          {allergen}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>
            )}

            {/* Ingredient Filter */}
            {commonIngredients.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Must Include Ingredients</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                  <View style={styles.optionsRow}>
                    {commonIngredients.map((ingredient) => (
                      <TouchableOpacity
                        key={ingredient}
                        style={[
                          styles.optionChip,
                          styles.smallChip,
                          selectedIngredients.includes(ingredient) && styles.optionChipSelected
                        ]}
                        onPress={() => toggleIngredient(ingredient)}
                      >
                        <Text style={[
                          styles.optionChipText,
                          styles.smallChipText,
                          selectedIngredients.includes(ingredient) && styles.optionChipTextSelected
                        ]}>
                          {ingredient}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>
            )}
          </ScrollView>

          {/* Apply Button */}
          <View style={styles.footer}>
            <TouchableOpacity 
              style={styles.applyButton}
              onPress={handleApplyFilters}
              activeOpacity={0.8}
            >
              <Text style={styles.applyButtonText}>
                Apply Filters {hasActiveFilters ? '✓' : ''}
              </Text>
            </TouchableOpacity>
          </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: screenHeight * 0.85,
    minHeight: screenHeight * 0.6,
    paddingBottom: Platform.OS === 'ios' ? 34 : 0, // Account for safe area on iOS
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  closeButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  clearButton: {
    padding: 4,
  },
  clearButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  clearButtonTextDisabled: {
    color: '#ccc',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 0,
  },
  horizontalScroll: {
    marginHorizontal: -20,
  },
  optionsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
  },
  optionChip: {
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  optionChipSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  optionChipText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  optionChipTextSelected: {
    color: '#fff',
  },
  smallChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  smallChipText: {
    fontSize: 12,
  },

  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  applyButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#007AFF',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FavoritesSearchModal; 