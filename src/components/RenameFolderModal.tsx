import React, { useState, useEffect } from 'react';
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

interface RenameFolderModalProps {
  visible: boolean;
  onClose: () => void;
  onRename: (newName: string, color: string, icon?: string) => Promise<void>;
  currentName: string;
  currentColor: string;
  currentIcon?: string;
  itemCount: number;
  isCustomFolder: boolean;
}

const RenameFolderModal: React.FC<RenameFolderModalProps> = ({
  visible,
  onClose,
  onRename,
  currentName,
  currentColor,
  currentIcon,
  itemCount,
  isCustomFolder,
}) => {
  const [newName, setNewName] = useState('');
  const [selectedColor, setSelectedColor] = useState(currentColor);
  const [selectedIcon, setSelectedIcon] = useState<string | undefined>(currentIcon);
  const [isLoading, setIsLoading] = useState(false);

  // Reset values when modal opens
  useEffect(() => {
    if (visible) {
      setNewName(currentName);
      setSelectedColor(currentColor);
      setSelectedIcon(currentIcon);
    }
  }, [visible, currentName, currentColor, currentIcon]);

  const handleClose = () => {
    if (!isLoading) {
      setNewName('');
      setSelectedColor(currentColor);
      setSelectedIcon(currentIcon);
      onClose();
    }
  };

  const handleRename = async () => {
    const trimmedName = newName.trim();
    
    if (!trimmedName) {
      Alert.alert('Error', 'Please enter a folder name.');
      return;
    }

    // Check if anything actually changed
    if (trimmedName === currentName && selectedColor === currentColor && selectedIcon === currentIcon) {
      handleClose();
      return;
    }

    setIsLoading(true);
    try {
      await onRename(trimmedName, selectedColor, selectedIcon);
      handleClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to update folder. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    Keyboard.dismiss();
    handleRename();
  };

  const getDisplayIcon = () => {
    if (selectedIcon) return selectedIcon;
    return isCustomFolder ? "folder" : "restaurant";
  };

  const hasChanges = newName.trim() !== currentName || 
                   selectedColor !== currentColor || 
                   selectedIcon !== currentIcon;

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
            <TouchableOpacity 
              onPress={handleClose} 
              style={styles.cancelButton}
              disabled={isLoading}
            >
              <Text style={[styles.cancelText, isLoading && styles.disabledText]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Customize Folder</Text>
            <TouchableOpacity 
              onPress={handleSave} 
              style={[styles.saveButton, (!newName.trim() || isLoading) && styles.disabledButton]}
              disabled={!newName.trim() || isLoading}
            >
              <Text style={[
                styles.saveText, 
                (!newName.trim() || isLoading) && styles.disabledText,
                hasChanges && styles.saveTextActive
              ]}>
                {isLoading ? 'Saving...' : 'Save'}
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
                    {newName.trim() || 'Folder Name'}
                  </Text>
                  <Text style={styles.previewDetails}>
                    {itemCount} {itemCount === 1 ? 'item' : 'items'} • {isCustomFolder ? 'Custom' : 'Recipe'} folder
                  </Text>
                </View>
              </View>
            </View>

            {/* Name Input Section */}
            <View style={styles.inputSection}>
              <Text style={styles.sectionTitle}>Name</Text>
                              <TextInput
                  style={styles.textInput}
                  value={newName}
                  onChangeText={setNewName}
                  placeholder="Enter folder name"
                  placeholderTextColor="#999"
                  autoFocus
                  selectTextOnFocus
                  maxLength={50}
                  returnKeyType="done"
                  onSubmitEditing={handleSave}
                  editable={!isLoading}
                />
              <Text style={styles.characterCount}>
                {newName.length}/50 characters
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
                    name={isCustomFolder ? "folder" : "restaurant"} 
                    size={24} 
                    color={selectedColor} 
                  />
                  {!selectedIcon && (
                    <View style={styles.iconCheckmark}>
                      <Ionicons name="checkmark" size={12} color="#007AFF" />
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
                        <Ionicons name="checkmark" size={12} color="#007AFF" />
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Tips Section */}
            <View style={styles.tipsSection}>
              <View style={styles.tip}>
                <Ionicons name="bulb-outline" size={16} color="#666" />
                <Text style={styles.tipText}>
                  Choose colors and icons that help you quickly find your items
                </Text>
              </View>
              <View style={styles.tip}>
                <Ionicons name="checkmark-circle-outline" size={16} color="#666" />
                <Text style={styles.tipText}>
                  Examples: "🥕 Weekly Groceries", "🍕 Dinner Party", "❄️ Frozen Items"
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
    backgroundColor: '#fff',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  cancelButton: {
    padding: 4,
  },
  cancelText: {
    fontSize: 17,
    color: '#007AFF',
    fontWeight: '400',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
  },
  saveButton: {
    padding: 4,
  },
  saveText: {
    fontSize: 17,
    color: '#007AFF',
    fontWeight: '400',
  },
  saveTextActive: {
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.5,
  },
  disabledText: {
    color: '#999',
  },
  scrollView: {
    flex: 1,
  },
  previewSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  previewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
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
    color: '#333',
    marginBottom: 4,
  },
  previewDetails: {
    fontSize: 14,
    color: '#666',
  },
  inputSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  textInput: {
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#f8f9fa',
  },
  characterCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 8,
  },
  colorSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
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
    borderColor: '#007AFF',
    transform: [{ scale: 1.1 }],
  },
  iconSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
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
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  selectedIcon: {
    borderColor: '#007AFF',
    backgroundColor: '#f0f8ff',
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
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
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
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default RenameFolderModal; 