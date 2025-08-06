import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FOLDER_COLORS, FOLDER_ICONS } from '../types/ShoppingList';
import { 
  colors, 
  typography, 
  spacing, 
  componentShadows,
  componentBorderRadius,
  lightTheme
} from '../styles';

interface CustomFolderModalProps {
  visible: boolean;
  onClose: () => void;
  onCreateFolder: (name: string, color?: string, icon?: string) => Promise<void>;
  onAddItem?: (folderId: string, folderName: string, itemName: string, amount: number, unit: string) => Promise<void>;
  existingFolder?: {
    id: string;
    name: string;
  };
  mode: 'createFolder' | 'addItem';
}

const CustomFolderModal: React.FC<CustomFolderModalProps> = ({
  visible,
  onClose,
  onCreateFolder,
  onAddItem,
  existingFolder,
  mode,
}) => {
  const [folderName, setFolderName] = useState('');
  const [selectedColor, setSelectedColor] = useState(FOLDER_COLORS[0]); // Default to first color (blue)
  const [selectedIcon, setSelectedIcon] = useState<string | undefined>(undefined);
  const [itemName, setItemName] = useState('');
  const [amount, setAmount] = useState('1');
  const [unit, setUnit] = useState('item');
  const [isLoading, setIsLoading] = useState(false);

  const resetForm = () => {
    setFolderName('');
    setSelectedColor(FOLDER_COLORS[0]);
    setSelectedIcon(undefined);
    setItemName('');
    setAmount('1');
    setUnit('item');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleCreateFolder = async () => {
    if (!folderName.trim()) {
      Alert.alert('Error', 'Please enter a folder name');
      return;
    }

    setIsLoading(true);
    try {
      await onCreateFolder(folderName.trim(), selectedColor, selectedIcon);
      handleClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to create folder. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddItem = async () => {
    if (!itemName.trim()) {
      Alert.alert('Error', 'Please enter an item name');
      return;
    }

    if (!existingFolder || !onAddItem) {
      Alert.alert('Error', 'No folder selected');
      return;
    }

    const amountNumber = parseFloat(amount) || 1;

    setIsLoading(true);
    try {
      await onAddItem(existingFolder.id, existingFolder.name, itemName.trim(), amountNumber, unit);
      handleClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to add item. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    Keyboard.dismiss();
    if (mode === 'createFolder') {
      handleCreateFolder();
    } else {
      handleAddItem();
    }
  };

  const getDisplayIcon = () => {
    if (selectedIcon) return selectedIcon;
    return "folder";
  };

  const commonUnits = ['item', 'kg', 'g', 'l', 'ml', 'cup', 'tbsp', 'tsp', 'piece'];

  if (mode === 'addItem') {
    // Keep the existing add item modal design for now
    return (
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleClose}
      >
        <SafeAreaView style={styles.container}>
          <KeyboardAvoidingView 
            style={styles.keyboardView}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                <Text style={styles.closeText}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Add Item</Text>
              <TouchableOpacity 
                onPress={handleSave}
                style={[styles.saveButton, !itemName.trim() && styles.disabledButton]}
                disabled={!itemName.trim() || isLoading}
              >
                <Text style={[styles.saveText, !itemName.trim() && styles.disabledText]}>
                  {isLoading ? 'Adding...' : 'Add'}
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
              <View style={styles.simpleContent}>
                <View style={styles.iconContainer}>
                  <Ionicons name="add-circle-outline" size={60} color={colors.success.primary} />
                </View>
                
                <Text style={styles.description}>
                  Add a custom item to "{existingFolder?.name}"
                </Text>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Item Name</Text>
                  <TextInput
                    style={styles.textInput}
                    value={itemName}
                    onChangeText={setItemName}
                    placeholder="e.g., Milk, Bread, Bananas"
                    placeholderTextColor={colors.warmGrayLight}
                    autoFocus
                    maxLength={50}
                    returnKeyType="done"
                    onSubmitEditing={handleSave}
                  />
                </View>

                <View style={styles.row}>
                  <View style={[styles.inputContainer, styles.halfWidth]}>
                    <Text style={styles.inputLabel}>Amount</Text>
                    <TextInput
                      style={styles.textInput}
                      value={amount}
                      onChangeText={setAmount}
                      placeholder="1"
                      placeholderTextColor={colors.warmGrayLight}
                      keyboardType="numeric"
                    />
                  </View>

                  <View style={[styles.inputContainer, styles.halfWidth]}>
                    <Text style={styles.inputLabel}>Unit</Text>
                    <TextInput
                      style={styles.textInput}
                      value={unit}
                      onChangeText={setUnit}
                      placeholder="item"
                      placeholderTextColor={colors.warmGrayLight}
                    />
                  </View>
                </View>

                <View style={styles.unitsSection}>
                  <Text style={styles.unitsLabel}>Common units:</Text>
                  <View style={styles.unitsContainer}>
                    {commonUnits.map((unitOption) => (
                      <TouchableOpacity
                        key={unitOption}
                        style={[
                          styles.unitChip,
                          unit === unitOption && styles.selectedUnitChip,
                        ]}
                        onPress={() => setUnit(unitOption)}
                      >
                        <Text
                          style={[
                            styles.unitChipText,
                            unit === unitOption && styles.selectedUnitChipText,
                          ]}
                        >
                          {unitOption}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    );
  }

  // Enhanced create folder modal
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView 
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Text style={styles.closeText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Create Folder</Text>
            <TouchableOpacity 
              onPress={handleSave}
              style={[styles.saveButton, !folderName.trim() && styles.disabledButton]}
              disabled={!folderName.trim() || isLoading}
            >
              <Text style={[styles.saveText, !folderName.trim() && styles.disabledText]}>
                {isLoading ? 'Creating...' : 'Create'}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {/* Live Preview Section */}
            <View style={styles.previewSection}>
              <Text style={styles.sectionTitle}>Preview</Text>
              <View style={styles.previewCard}>
                <View style={[styles.previewIconContainer, { backgroundColor: selectedColor + '20' }]}>
                  {selectedIcon ? (
                    <Text style={styles.previewEmoji}>{selectedIcon}</Text>
                  ) : (
                    <Ionicons 
                      name={getDisplayIcon() as any} 
                      size={32} 
                      color={selectedColor} 
                    />
                  )}
                </View>
                <View style={styles.previewInfo}>
                  <Text style={styles.previewName} numberOfLines={1}>
                    {folderName.trim() || 'New Folder'}
                  </Text>
                  <Text style={styles.previewDetails}>
                    0 items • Custom folder
                  </Text>
                </View>
              </View>
            </View>


            {/* Name Input Section */}
            <View style={styles.inputSection}>
              <Text style={styles.sectionTitle}>Name</Text>
              <TextInput
                style={styles.textInput}
                value={folderName}
                onChangeText={setFolderName}
                placeholder="e.g., Weekly Groceries, Dinner Party"
                placeholderTextColor={colors.warmGrayLight}
                autoFocus
                maxLength={50}
                returnKeyType="done"
                onSubmitEditing={handleSave}
                editable={!isLoading}
              />
              <Text style={styles.characterCount}>
                {folderName.length}/50 characters
              </Text>
            </View>

            {/* Color Selection Section */}
            <View style={styles.colorSection}>
              <Text style={styles.sectionTitle}>Color</Text>
              <View style={styles.colorGrid}>
                {FOLDER_COLORS.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorOption,
                      { backgroundColor: color },
                      selectedColor === color && styles.selectedColor,
                    ]}
                    onPress={() => setSelectedColor(color)}
                    disabled={isLoading}
                  >
                    {selectedColor === color && (
                      <Ionicons name="checkmark" size={16} color="#fff" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            {/* Icon Selection Section */}
            <View style={styles.iconSection}>
              <Text style={styles.sectionTitle}>Icon</Text>
              <View style={styles.iconGrid}>
                {/* Default Icon Option */}
                <TouchableOpacity
                  style={[
                    styles.iconOption,
                    !selectedIcon && styles.selectedIcon,
                  ]}
                  onPress={() => setSelectedIcon(undefined)}
                  disabled={isLoading}
                >
                  <Ionicons 
                    name="folder" 
                    size={24} 
                    color={selectedColor} 
                  />
                  {!selectedIcon && (
                    <View style={styles.iconCheckmark}>
                      <Ionicons name="checkmark" size={12} color={colors.spiceOrange} />
                    </View>
                  )}
                </TouchableOpacity>

                {/* Emoji Options */}
                {FOLDER_ICONS.map((icon) => (
                  <TouchableOpacity
                    key={icon}
                    style={[
                      styles.iconOption,
                      selectedIcon === icon && styles.selectedIcon,
                    ]}
                    onPress={() => setSelectedIcon(icon)}
                    disabled={isLoading}
                  >
                    <Text style={styles.iconEmoji}>{icon}</Text>
                    {selectedIcon === icon && (
                      <View style={styles.iconCheckmark}>
                        <Ionicons name="checkmark" size={12} color={colors.spiceOrange} />
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Tips Section */}
            <View style={styles.tipsSection}>
              <View style={styles.tip}>
                <Ionicons name="bulb-outline" size={16} color={colors.warmGray} />
                <Text style={styles.tipText}>
                  Choose colors and icons that match your shopping categories
                </Text>
              </View>
              <View style={styles.tip}>
                <Ionicons name="sparkles-outline" size={16} color={colors.warmGray} />
                <Text style={styles.tipText}>
                  Try: "🥕 Fresh Produce", "🥛 Dairy Items", "🧴 Household Supplies"
                </Text>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.warmCream, // Changed from #fff to Warm Cream
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.l, // Using design system spacing (20px)
    paddingVertical: spacing.m, // Using design system spacing (16px)
    borderBottomWidth: 1,
    borderBottomColor: lightTheme.borders, // Changed from #e0e0e0 to design system border
  },
  closeButton: {
    padding: spacing.xs, // Using design system spacing (4px)
  },
  closeText: {
    fontSize: 17,
    color: colors.spiceOrange,
    fontWeight: '400',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.deepNavy,
  },
  saveButton: {
    padding: 4,
  },
  saveText: {
    fontSize: 17,
    color: colors.spiceOrange,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.5,
  },
  disabledText: {
    color: colors.warmGray,
  },
  scrollView: {
    flex: 1,
  },
  simpleContent: {
    padding: 20,
  },
  previewSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.deepNavy,
    marginBottom: 12,
  },
  previewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warmCreamLight,
    borderRadius: 16,
    padding: 16,
    gap: 16,
  },
  previewIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  previewEmoji: {
    fontSize: 28,
  },
  previewInfo: {
    flex: 1,
  },
  previewName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.deepNavy,
    marginBottom: 4,
  },
  previewDetails: {
    fontSize: 14,
    color: colors.warmGray,
  },
  inputSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: lightTheme.borders,
  },
  colorSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: lightTheme.borders,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorOption: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  selectedColor: {
    borderColor: colors.spiceOrange,
    transform: [{ scale: 1.1 }],
  },
  iconSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: lightTheme.borders,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  iconOption: {
    width: 52,
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.warmCreamLight,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  selectedIcon: {
    borderColor: colors.spiceOrange,
    backgroundColor: colors.warmCreamLight,
  },
  iconEmoji: {
    fontSize: 24,
  },
  iconCheckmark: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.legacy.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  characterCount: {
    fontSize: 12,
    color: colors.warmGray,
    textAlign: 'right',
    marginTop: 8,
  },
  tipsSection: {
    padding: 20,
    gap: 12,
  },
  tip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  tipText: {
    flex: 1,
    ...typography.bodyMedium, // Using bodyMedium typography (16px, Regular)
    color: colors.warmGray, // Changed from #666 to Warm Gray
    lineHeight: 20,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl, // Using design system spacing (24px)
  },
  description: {
    ...typography.bodyLarge, // Using bodyLarge typography (18px, Regular)
    color: colors.warmGray, // Changed from #666 to Warm Gray
    textAlign: 'center',
    marginBottom: spacing.xl, // Using design system spacing (32px)
    lineHeight: 22,
  },
  inputContainer: {
    marginBottom: spacing.l, // Using design system spacing (20px)
  },
  inputLabel: {
    ...typography.bodyLarge, // Using bodyLarge typography (18px, Regular)
    fontWeight: typography.h4.fontWeight, // SemiBold weight
    color: colors.deepNavy, // Changed from #333 to Deep Navy
    marginBottom: spacing.s, // Using design system spacing (8px)
  },
  textInput: {
    borderWidth: 1,
    borderColor: lightTheme.borders, // Changed from #e0e0e0 to design system border
    borderRadius: componentBorderRadius.input, // Using design system border radius (12px)
    paddingHorizontal: spacing.m, // Using design system spacing (16px)
    paddingVertical: spacing.m, // Using design system spacing (14px)
    ...typography.bodyLarge, // Using bodyLarge typography (18px, Regular)
    color: colors.deepNavy, // Changed from #333 to Deep Navy
    backgroundColor: colors.warmCreamLight, // Changed from #f8f9fa to Warm Cream Light
  },
  row: {
    flexDirection: 'row',
    gap: spacing.m, // Using design system spacing (12px)
  },
  halfWidth: {
    flex: 1,
  },
  unitsSection: {
    marginBottom: spacing.xl, // Using design system spacing (32px)
  },
  unitsLabel: {
    ...typography.bodyMedium, // Using bodyMedium typography (16px, Regular)
    color: colors.warmGray, // Changed from #666 to Warm Gray
    marginBottom: spacing.m, // Using design system spacing (12px)
  },
  unitsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.s, // Using design system spacing (8px)
  },
  unitChip: {
    backgroundColor: colors.warmCreamDark, // Changed from #f0f0f0 to Warm Cream Dark
    paddingHorizontal: spacing.m, // Using design system spacing (12px)
    paddingVertical: spacing.xs, // Using design system spacing (6px)
    borderRadius: componentBorderRadius.button, // Using design system border radius (16px)
    borderWidth: 1,
    borderColor: lightTheme.borders, // Changed from #e0e0e0 to design system border
  },
  selectedUnitChip: {
    backgroundColor: colors.spiceOrange, // Changed from #007AFF to Spice Orange
    borderColor: colors.spiceOrange, // Changed from #007AFF to Spice Orange
  },
  unitChipText: {
    ...typography.bodyMedium, // Using bodyMedium typography (16px, Regular)
    color: colors.warmGray, // Changed from #666 to Warm Gray
    fontWeight: '500',
  },
  selectedUnitChipText: {
    color: colors.legacy.white, // White text

  },
});

export default CustomFolderModal;