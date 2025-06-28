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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CustomFolderModalProps {
  visible: boolean;
  onClose: () => void;
  onCreateFolder: (name: string) => Promise<void>;
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
  const [itemName, setItemName] = useState('');
  const [amount, setAmount] = useState('1');
  const [unit, setUnit] = useState('item');
  const [isLoading, setIsLoading] = useState(false);

  const resetForm = () => {
    setFolderName('');
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
      await onCreateFolder(folderName.trim());
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

  const commonUnits = ['item', 'kg', 'g', 'l', 'ml', 'cup', 'tbsp', 'tsp', 'piece'];

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
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
              {mode === 'createFolder' ? 'Create Custom Folder' : 'Add Item'}
            </Text>
            <View style={styles.placeholder} />
          </View>

          {/* Content */}
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.content}>
            {mode === 'createFolder' ? (
              <>
                <View style={styles.iconContainer}>
                  <Ionicons name="folder-outline" size={60} color="#007AFF" />
                </View>
                
                <Text style={styles.description}>
                  Create a custom folder to organize your shopping items
                </Text>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Folder Name</Text>
                  <TextInput
                    style={styles.textInput}
                    value={folderName}
                    onChangeText={setFolderName}
                    placeholder="e.g., Weekly Groceries, Pantry Items"
                    placeholderTextColor="#999"
                    autoFocus
                    maxLength={50}
                  />
                </View>

                <TouchableOpacity
                  style={[styles.createButton, !folderName.trim() && styles.disabledButton]}
                  onPress={handleCreateFolder}
                  disabled={!folderName.trim() || isLoading}
                >
                  <Ionicons name="add" size={20} color="#fff" />
                  <Text style={styles.createButtonText}>
                    {isLoading ? 'Creating...' : 'Create Folder'}
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <View style={styles.iconContainer}>
                  <Ionicons name="add-circle-outline" size={60} color="#34C759" />
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
                    placeholderTextColor="#999"
                    autoFocus
                    maxLength={50}
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
                      placeholderTextColor="#999"
                      keyboardType="numeric"
                    />
                  </View>

                  <View style={[styles.inputContainer, styles.halfWidth]}>
                    <Text style={styles.inputLabel}>Unit</Text>
                    <View style={styles.unitContainer}>
                      <TextInput
                        style={styles.textInput}
                        value={unit}
                        onChangeText={setUnit}
                        placeholder="item"
                        placeholderTextColor="#999"
                      />
                    </View>
                  </View>
                </View>

                {/* Common Units */}
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

                <TouchableOpacity
                  style={[styles.createButton, !itemName.trim() && styles.disabledButton]}
                  onPress={handleAddItem}
                  disabled={!itemName.trim() || isLoading}
                >
                  <Ionicons name="add" size={20} color="#fff" />
                  <Text style={styles.createButtonText}>
                    {isLoading ? 'Adding...' : 'Add Item'}
                  </Text>
                </TouchableOpacity>
              </>
            )}
            </View>
          </TouchableWithoutFeedback>
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
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#f8f9fa',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  unitContainer: {
    flex: 1,
  },
  unitsSection: {
    marginBottom: 32,
  },
  unitsLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  unitsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  unitChip: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedUnitChip: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  unitChipText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  selectedUnitChipText: {
    color: '#fff',
  },
  createButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    marginTop: 'auto',
    marginBottom: 32,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  createButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});

export default CustomFolderModal; 