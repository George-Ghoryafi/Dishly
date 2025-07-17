import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
  Dimensions,
  Animated,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Recipe } from '../types/Recipe';
import { shoppingListService } from '../services';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface RecipeDetailModalProps {
  visible: boolean;
  recipe: Recipe | null;
  onClose: () => void;
  isFavorite?: boolean;
  onFavoriteToggle?: () => void;
  onStartCooking?: (recipe: Recipe) => void;
}

const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({
  visible,
  recipe,
  onClose,
  isFavorite = false,
  onFavoriteToggle,
  onStartCooking,
}) => {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(true);
  const [portionSize, setPortionSize] = useState(1);
  const [selectedIngredients, setSelectedIngredients] = useState<Set<number>>(new Set());
  const [isButtonFloating, setIsButtonFloating] = useState(true);
  const [ingredientsInCurrentList, setIngredientsInCurrentList] = useState<Set<string>>(new Set());
  const [ingredientsInOtherLists, setIngredientsInOtherLists] = useState<Map<string, string[]>>(new Map());
  const [existingFolderId, setExistingFolderId] = useState<string | null>(null);
  const [isLoadingShoppingList, setIsLoadingShoppingList] = useState(false);
  
  // Animation values
  const buttonTranslateY = useRef(new Animated.Value(0)).current;
  const buttonOpacity = useRef(new Animated.Value(1)).current;

  // Load shopping list information when recipe changes
  useEffect(() => {
    if (recipe && visible) {
      loadShoppingListInfo();
    }
  }, [recipe?.id, visible]);

  const loadShoppingListInfo = async () => {
    if (!recipe) return;
    
    setIsLoadingShoppingList(true);
    try {
      // Check if folder exists
      const folder = await shoppingListService.findFolderByRecipeName(recipe.name);
      setExistingFolderId(folder?.id || null);
      
      // Get comprehensive ingredient status
      const ingredientNames = recipe.ingredients.map(ingredient => ingredient.name);
      const status = await shoppingListService.getIngredientStatus(recipe.name, ingredientNames);
      
      setIngredientsInCurrentList(status.inCurrentRecipe);
      setIngredientsInOtherLists(status.inOtherRecipes);
    } catch (error) {
      console.error('Error loading shopping list info:', error);
    } finally {
      setIsLoadingShoppingList(false);
    }
  };

  if (!recipe) return null;

  // Animation functions
  const animateButtonShow = () => {
    Animated.parallel([
      Animated.spring(buttonTranslateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
      Animated.timing(buttonOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateButtonHide = () => {
    Animated.parallel([
      Animated.spring(buttonTranslateY, {
        toValue: 120, // Move down below screen
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
      Animated.timing(buttonOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Handle scroll behavior for button positioning
  const handleScroll = (event: any) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const scrollY = contentOffset.y;
    const contentHeight = contentSize.height;
    const screenHeight = layoutMeasurement.height;
    
    // Button should be floating (sticky) only when at the very top of the page
    const shouldFloat = scrollY < 50;
    
    if (shouldFloat && !isButtonFloating) {
      // Move to floating position
      setIsButtonFloating(true);
      animateButtonShow();
    } else if (!shouldFloat && isButtonFloating) {
      // Move to inline position (hide the floating button)
      setIsButtonFloating(false);
      animateButtonHide();
    }
  };

  // Function to handle start cooking
  const handleStartCooking = () => {
    if (recipe && onStartCooking) {
      onStartCooking(recipe);
    } else {
      console.log('Starting cooking timer for recipe:', recipe?.name);
    }
  };

  // Function to add selected ingredients to shopping list
  const addSelectedToShoppingList = async () => {
    if (!recipe || selectedIngredients.size === 0) return;

    try {
      const selectedIngredientsList = Array.from(selectedIngredients).map(
        index => recipe.ingredients[index]
      );

      const result = await shoppingListService.smartAddIngredientsFromRecipe(
        recipe.name,
        selectedIngredientsList,
        portionSize
      );

      // Clear selected ingredients
      setSelectedIngredients(new Set());

      // Reload shopping list info to update indicators
      await loadShoppingListInfo();

      // Show success message based on result
      const actionText = result.isNewFolder ? 'Created new shopping list' : 'Added to existing shopping list';
      const countText = result.addedCount === 0 
        ? 'All selected ingredients were already in your list' 
        : `${result.addedCount} ingredient${result.addedCount > 1 ? 's' : ''} added`;

      Alert.alert(
        actionText,
        `${countText} for "${recipe.name}".`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error adding ingredients to shopping list:', error);
      Alert.alert(
        'Error',
        'Failed to add ingredients to shopping list. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  // Function to split description into paragraphs
  const formatDescription = (description: string) => {
    // Split by periods followed by space and capital letter, or by double spaces
    const sentences = description.split(/\.\s+(?=[A-Z])|\.{2,}\s*/).filter(sentence => sentence.trim());
    
    // Group sentences into paragraphs (2-3 sentences each)
    const paragraphs = [];
    for (let i = 0; i < sentences.length; i += 2) {
      const paragraph = sentences.slice(i, i + 2).join('. ');
      if (paragraph.trim()) {
        // Add period if it doesn't end with one
        paragraphs.push(paragraph.endsWith('.') ? paragraph : paragraph + '.');
      }
    }
    
    return paragraphs;
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Recipe Details</Text>
          <TouchableOpacity 
            onPress={onFavoriteToggle} 
            style={styles.favoriteButton}
          >
            <Ionicons 
              name={isFavorite ? "heart" : "heart-outline"} 
              size={24} 
              color={isFavorite ? "#FF3B30" : "#333"} 
            />
          </TouchableOpacity>
        </View>

        <View style={styles.contentContainer}>
          <ScrollView 
            style={styles.content} 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
          {/* Recipe Image */}
          <View style={styles.imageContainer}>
            <Image source={{ uri: recipe.image }} style={styles.image} />
            <View style={styles.difficultyBadge}>
              <Text style={styles.difficultyText}>{recipe.difficulty}</Text>
            </View>
              {/* Overlay with recipe name and cook time */}
              <View style={styles.nameOverlay}>
                <Text style={styles.overlayRecipeName}>{recipe.name}</Text>
                <View style={styles.overlayCookTimeContainer}>
                  <Ionicons name="time" size={16} color="#fff" />
                  <Text style={styles.overlayCookTimeText}>{recipe.cookTime} minutes</Text>
                </View>
              </View>
          </View>

          {/* Recipe Info */}
          <View style={styles.infoContainer}>
            {/* Description Section */}
            <View style={styles.descriptionSection}>
              <TouchableOpacity 
                style={styles.descriptionHeader}
                onPress={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              >
                <Text style={styles.descriptionTitle}>About This Dish</Text>
                <Ionicons 
                  name={isDescriptionExpanded ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  color="#666" 
                />
              </TouchableOpacity>
              
              {isDescriptionExpanded && (
                <View style={styles.descriptionContent}>
                  {formatDescription(recipe.description).map((paragraph, index) => (
                    <Text key={index} style={styles.descriptionParagraph}>
                      {paragraph}
                    </Text>
                  ))}
                </View>
              )}
            </View>

            {/* Allergens */}
            {recipe.allergens.length > 0 && (
              <View style={styles.allergensSection}>
                <Text style={styles.sectionTitle}>Allergens</Text>
                <View style={styles.allergensContainer}>
                  {recipe.allergens.map((allergen, index) => (
                    <View key={index} style={styles.allergenChip}>
                      <Text style={styles.allergenIcon}>{allergen.icon}</Text>
                      <Text style={styles.allergenText}>{allergen.type}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Ingredients Section */}
            {recipe.ingredients && recipe.ingredients.length > 0 && (
              <View style={styles.ingredientsSection}>
                <View style={styles.ingredientsHeader}>
                  <View style={styles.ingredientsTitleContainer}>
              <Text style={styles.sectionTitle}>Ingredients</Text>
                    <Text style={styles.ingredientsSubtitle}>
                      {recipe.ingredients.length} ingredients • Tap to add to shopping list
                    </Text>
                  </View>
                  
                  <View style={styles.portionSelector}>
                    <TouchableOpacity 
                      style={styles.portionButton}
                      onPress={() => setPortionSize(Math.max(0.5, portionSize - 0.5))}
                    >
                      <Ionicons name="remove" size={16} color="#007AFF" />
                    </TouchableOpacity>
                    
                    <Text style={styles.portionText}>
                      {portionSize === 1 ? '1 serving' : `${portionSize} servings`}
                    </Text>
                    
                    <TouchableOpacity 
                      style={styles.portionButton}
                      onPress={() => setPortionSize(portionSize + 0.5)}
                    >
                      <Ionicons name="add" size={16} color="#007AFF" />
                    </TouchableOpacity>
                  </View>
                </View>
                
                <View style={styles.ingredientsGrid}>
                  {recipe.ingredients.map((ingredient, idx) => {
                    const isSelected = selectedIngredients.has(idx);
                    const ingredientKey = ingredient.name.toLowerCase().trim();
                    const isInCurrentList = ingredientsInCurrentList.has(ingredientKey);
                    const otherLists = ingredientsInOtherLists.get(ingredientKey) || [];
                    const isInOtherLists = otherLists.length > 0;
                    const isDisabled = isInCurrentList && !isSelected;
                    
                    return (
                      <TouchableOpacity 
                        key={idx} 
                        style={[
                          styles.ingredientCard,
                          isSelected && styles.ingredientCardSelected,
                          isInCurrentList && !isSelected && styles.ingredientCardInList,
                          isInOtherLists && !isInCurrentList && !isSelected && styles.ingredientCardInOtherList
                        ]}
                        onPress={() => {
                          if (isInCurrentList && !isSelected) return; // Don't allow selecting items already in current list
                          
                          const newSelected = new Set(selectedIngredients);
                          if (isSelected) {
                            newSelected.delete(idx);
                          } else {
                            newSelected.add(idx);
                          }
                          setSelectedIngredients(newSelected);
                        }}
                        activeOpacity={isDisabled ? 0.3 : 0.8}
                      >
                        <View style={styles.ingredientIconContainer}>
                          {isSelected ? (
                            <Ionicons name="checkmark-circle" size={20} color="#fff" />
                          ) : isInCurrentList ? (
                            <Ionicons name="checkmark-circle" size={20} color="#34C759" />
                          ) : isInOtherLists ? (
                            <Ionicons name="duplicate-outline" size={20} color="#FF9500" />
                          ) : (
                            <Ionicons name="add-circle-outline" size={20} color="#007AFF" />
                          )}
                        </View>
                        
                        <Text style={[
                          styles.ingredientAmount,
                          isSelected && styles.ingredientAmountSelected,
                          isInCurrentList && !isSelected && styles.ingredientAmountInList,
                          isInOtherLists && !isInCurrentList && !isSelected && styles.ingredientAmountInOtherList
                        ]}>
                          {(ingredient.amount * portionSize).toFixed(ingredient.amount * portionSize % 1 === 0 ? 0 : 1)} {ingredient.unit}
                        </Text>
                        <Text style={[
                          styles.ingredientName,
                          isSelected && styles.ingredientNameSelected,
                          isInCurrentList && !isSelected && styles.ingredientNameInList,
                          isInOtherLists && !isInCurrentList && !isSelected && styles.ingredientNameInOtherList
                        ]} numberOfLines={2}>
                          {ingredient.name}
                        </Text>
                        
                        {isInCurrentList && !isSelected && (
                          <View style={styles.alreadyInListBadge}>
                            <Text style={styles.alreadyInListText}>In List</Text>
                          </View>
                        )}
                        
                        {isInOtherLists && !isInCurrentList && !isSelected && (
                          <View style={styles.inOtherListBadge}>
                            <Text style={styles.inOtherListText}>
                              {otherLists.length === 1 ? 'Other List' : `${otherLists.length} Lists`}
                            </Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
                
                {/* Add to Shopping List Button */}
                {selectedIngredients.size > 0 && (
                  <TouchableOpacity 
                    style={styles.addToShoppingListButton}
                    onPress={addSelectedToShoppingList}
                    activeOpacity={0.8}
                  >
                    <View style={styles.addToShoppingListContent}>
                      <Ionicons name="basket" size={20} color="#fff" />
                      <Text style={styles.addToShoppingListText}>
                        {existingFolderId 
                          ? `Add ${selectedIngredients.size} ingredient${selectedIngredients.size > 1 ? 's' : ''} to Existing List`
                          : `Add ${selectedIngredients.size} ingredient${selectedIngredients.size > 1 ? 's' : ''} to Shopping List`
                        }
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
                
                {/* Shopping List Status */}
                {!isLoadingShoppingList && (ingredientsInCurrentList.size > 0 || ingredientsInOtherLists.size > 0) && (
                  <View style={styles.shoppingListStatusContainer}>
                    {ingredientsInCurrentList.size > 0 && (
                      <View style={styles.shoppingListStatus}>
                        <Ionicons name="checkmark-circle" size={16} color="#34C759" />
                        <Text style={styles.shoppingListStatusText}>
                          {ingredientsInCurrentList.size} ingredient{ingredientsInCurrentList.size > 1 ? 's' : ''} already in this recipe's list
                        </Text>
                      </View>
                    )}
                    
                    {ingredientsInOtherLists.size > 0 && (
                      <View style={styles.shoppingListStatusOther}>
                        <Ionicons name="duplicate-outline" size={16} color="#FF9500" />
                        <Text style={styles.shoppingListStatusOtherText}>
                          {ingredientsInOtherLists.size} ingredient{ingredientsInOtherLists.size > 1 ? 's' : ''} in other lists (can still add to this recipe)
                        </Text>
                      </View>
                    )}
                  </View>
                )}
              </View>
            )}

            {/* Nutritional Information Section */}
            {recipe.nutrition && (
              <View style={styles.nutritionSection}>
                <Text style={styles.sectionTitle}>Nutritional Information</Text>
                <Text style={styles.nutritionSubtitle}>
                  Per serving (estimates)
                </Text>
                
                <View style={styles.nutritionGrid}>
                  <View style={styles.nutritionCard}>
                    <View style={styles.nutritionIconContainer}>
                      <Ionicons name="flame" size={20} color="#007AFF" />
                    </View>
                    <Text style={styles.nutritionValue}>{recipe.nutrition.calories} kcal</Text>
                    <Text style={styles.nutritionLabel}>Calories</Text>
                  </View>
                  
                  <View style={styles.nutritionCard}>
                    <View style={styles.nutritionIconContainer}>
                      <Ionicons name="flash" size={20} color="#007AFF" />
                    </View>
                    <Text style={styles.nutritionValue}>{recipe.nutrition.carbs}g</Text>
                    <Text style={styles.nutritionLabel}>Carbs</Text>
                  </View>
                  
                  <View style={styles.nutritionCard}>
                    <View style={styles.nutritionIconContainer}>
                      <Ionicons name="barbell" size={20} color="#007AFF" />
                    </View>
                    <Text style={styles.nutritionValue}>{recipe.nutrition.protein}g</Text>
                    <Text style={styles.nutritionLabel}>Protein</Text>
                  </View>
                  
                  <View style={styles.nutritionCard}>
                    <View style={styles.nutritionIconContainer}>
                      <Ionicons name="water" size={20} color="#007AFF" />
                    </View>
                    <Text style={styles.nutritionValue}>{recipe.nutrition.fat}g</Text>
                    <Text style={styles.nutritionLabel}>Fat</Text>
                  </View>
                </View>
              </View>
            )}

            {/* Preparation Section */}
            {recipe.preparationSteps && recipe.preparationSteps.length > 0 && (
              <View style={styles.preparationSection}>
                <Text style={styles.sectionTitle}>Preparation</Text>
                <Text style={styles.preparationSubtitle}>
                  {recipe.preparationSteps.length} steps • {recipe.cookTime} minutes total
                </Text>
                
                <View style={styles.stepsContainer}>
                  {recipe.preparationSteps.map((step, index) => (
                    <View key={index} style={styles.stepCard}>
                      {/* Step Header */}
                      <View style={styles.stepHeader}>
                        <View style={styles.stepNumberContainer}>
                          <Text style={styles.stepNumber}>{step.stepNumber}</Text>
                        </View>
                        <View style={styles.stepTitleContainer}>
                          <Text style={styles.stepTitle}>{step.title}</Text>
                          <View style={styles.stepDurationContainer}>
                            <Ionicons name="time-outline" size={14} color="#888" />
                            <Text style={styles.stepDuration}>{step.duration} min</Text>
                          </View>
                        </View>
            </View>

                      {/* Step Content */}
                      <View style={styles.stepContent}>
                        <Text style={styles.stepInstruction}>{step.instruction}</Text>
                        {step.tips && (
                          <View style={styles.tipContainer}>
                            <Ionicons name="bulb-outline" size={16} color="#FF9500" />
                            <Text style={styles.tipText}>{step.tips}</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  ))}
                  
                  {/* Inline Start Cooking Button (shows when not floating) */}
                  {!isButtonFloating && (
                    <TouchableOpacity 
                      style={styles.contextualCookingButton}
                      onPress={handleStartCooking}
                      activeOpacity={0.8}
                    >
                      <View style={styles.startCookingButtonContent}>
                        <Ionicons name="play-circle" size={24} color="#fff" />
                        <Text style={styles.startCookingButtonText}>Start Cooking</Text>
                        <View style={styles.totalTimeContainer}>
                          <Ionicons name="time" size={16} color="rgba(255, 255, 255, 0.8)" />
                          <Text style={styles.totalTimeText}>{recipe.cookTime} min</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  )}

                </View>
              </View>
            )}
            </View>
          </ScrollView>

          {/* Sticky Start Cooking Button */}
          {recipe.preparationSteps && recipe.preparationSteps.length > 0 && isButtonFloating && (
            <Animated.View 
              style={[
                styles.stickyButtonContainer,
                {
                  transform: [{ translateY: buttonTranslateY }],
                  opacity: buttonOpacity,
                }
              ]}
            >
              <TouchableOpacity 
                style={styles.startCookingButton}
                onPress={handleStartCooking}
                activeOpacity={0.8}
              >
                <View style={styles.startCookingButtonContent}>
                  <Ionicons name="play-circle" size={24} color="#fff" />
                  <Text style={styles.startCookingButtonText}>Start Cooking</Text>
                  <View style={styles.totalTimeContainer}>
                    <Ionicons name="time" size={16} color="rgba(255, 255, 255, 0.8)" />
                    <Text style={styles.totalTimeText}>{recipe.cookTime} min</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </Animated.View>
          )}
          </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Add padding to prevent content from being hidden behind sticky button
  },
  stickyButtonContainer: {
    position: 'absolute',
    bottom: 32, // Float above the bottom edge
    left: 20,
    right: 20,
    paddingVertical: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
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
  favoriteButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    height: 250,
    position: 'relative',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  difficultyBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  difficultyText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  nameOverlay: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    width: '67%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  overlayRecipeName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    marginBottom: 6,
  },
  overlayCookTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  overlayCookTimeText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  infoContainer: {
    padding: 20,
  },
  descriptionSection: {
    marginBottom: 24,
  },
  descriptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  descriptionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  descriptionContent: {
    paddingTop: 16,
  },
  descriptionParagraph: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 16,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 8,
  },
  timeText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  allergensSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  allergensContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  allergenChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  allergenIcon: {
    fontSize: 16,
  },
  allergenText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  placeholderSection: {
    marginBottom: 24,
  },
  placeholderText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  ingredientsSection: {
    marginBottom: 24,
  },
  ingredientsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  ingredientsTitleContainer: {
    flex: 1,
  },
  ingredientsSubtitle: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
    fontWeight: '500',
  },
  portionSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  portionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  portionText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    marginHorizontal: 12,
    minWidth: 80,
    textAlign: 'center',
  },
  ingredientsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  ingredientCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    width: '47%',
    minHeight: 85,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1.5,
    borderColor: '#e8e8e8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ingredientCardSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
    shadowColor: '#007AFF',
    shadowOpacity: 0.15,
  },
  ingredientIconContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  ingredientAmount: {
    fontSize: 15,
    color: '#007AFF',
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'center',
  },
  ingredientAmountSelected: {
    color: '#fff',
  },
  ingredientName: {
    fontSize: 13,
    color: '#333',
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 16,
  },
  ingredientNameSelected: {
    color: '#fff',
  },
  ingredientCardInList: {
    backgroundColor: '#f0f9ff',
    borderColor: '#34C759',
    opacity: 0.7,
  },
  ingredientCardInOtherList: {
    backgroundColor: '#fff8ed',
    borderColor: '#FF9500',
    borderWidth: 1.5,
  },
  ingredientAmountInList: {
    color: '#34C759',
  },
  ingredientNameInList: {
    color: '#34C759',
  },
  ingredientAmountInOtherList: {
    color: '#FF9500',
  },
  ingredientNameInOtherList: {
    color: '#FF9500',
  },
  alreadyInListBadge: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    backgroundColor: '#34C759',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  alreadyInListText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
  },
  inOtherListBadge: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    backgroundColor: '#FF9500',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  inOtherListText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
  },
  shoppingListStatusContainer: {
    marginTop: 12,
    gap: 8,
  },
  shoppingListStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  shoppingListStatusText: {
    fontSize: 14,
    color: '#34C759',
    fontWeight: '500',
    flex: 1,
  },
  shoppingListStatusOther: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff8ed',
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  shoppingListStatusOtherText: {
    fontSize: 14,
    color: '#FF9500',
    fontWeight: '500',
    flex: 1,
  },
  nutritionSection: {
    marginBottom: 24,
  },
  nutritionSubtitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 16,
    fontWeight: '500',
  },
  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  nutritionCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 20,
    width: '47%',
    minHeight: 110,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#e9ecef',
  },
  nutritionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  nutritionValue: {
    fontSize: 18,
    color: '#007AFF',
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'center',
  },
  nutritionLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  preparationSection: {
    marginBottom: 24,
  },
  preparationSubtitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 20,
    fontWeight: '500',
  },
  stepsContainer: {
    gap: 16,
  },
  stepCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  stepNumberContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  stepNumber: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '700',
  },
  stepTitleContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  stepTitle: {
    fontSize: 18,
    color: '#333',
    fontWeight: '700',
    marginBottom: 4,
  },
  stepDurationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stepDuration: {
    fontSize: 12,
    color: '#888',
    fontWeight: '600',
  },
  stepContent: {
    paddingLeft: 48,
  },
  stepInstruction: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
    marginBottom: 12,
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF9E6',
    borderRadius: 12,
    padding: 12,
    gap: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#FF9500',
  },
  tipText: {
    fontSize: 14,
    color: '#B8860B',
    fontWeight: '500',
    flex: 1,
    lineHeight: 20,
  },
  startCookingButton: {
    backgroundColor: '#007AFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
  startCookingButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
    gap: 12,
  },
  startCookingButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  totalTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  totalTimeText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
  },
  contextualCookingButton: {
    backgroundColor: '#007AFF',
    borderRadius: 16,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  addToShoppingListButton: {
    backgroundColor: '#34C759',
    borderRadius: 12,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  addToShoppingListContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 8,
  },
  addToShoppingListText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});

export default RecipeDetailModal; 