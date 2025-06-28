import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface FolderOption {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  color?: string;
  destructive?: boolean;
}

interface FolderOptionsModalProps {
  visible: boolean;
  onClose: () => void;
  folderName: string;
  isCustomFolder: boolean;
  onOptionSelect: (optionId: string) => void;
  onRenameFolder: (newName: string) => void;
  itemCount: number;
}

const FolderOptionsModal: React.FC<FolderOptionsModalProps> = ({
  visible,
  onClose,
  folderName,
  isCustomFolder,
  onOptionSelect,
  onRenameFolder,
  itemCount,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;
  const [showRenameInput, setShowRenameInput] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [isRenaming, setIsRenaming] = useState(false);
  const [isModalReady, setIsModalReady] = useState(false);

  const options: FolderOption[] = [
    {
      id: 'addItem',
      title: 'Add Custom Item',
      subtitle: 'Add your own items to this list',
      icon: 'add-circle',
      color: '#34C759',
    },
    {
      id: 'clearCompleted',
      title: 'Clear Completed',
      subtitle: 'Remove all checked items',
      icon: 'checkmark-done-circle',
      color: '#FF9500',
    },
    {
      id: 'rename',
      title: 'Rename Folder',
      subtitle: 'Change the folder name',
      icon: 'create',
      color: '#007AFF',
    },
    {
      id: 'delete',
      title: isCustomFolder ? 'Delete Folder' : 'Remove All Items',
      subtitle: isCustomFolder 
        ? 'Permanently delete this folder and all items'
        : 'Remove all items from this recipe list',
      icon: isCustomFolder ? 'trash-bin' : 'trash',
      color: '#FF3B30',
      destructive: true,
    },
  ];

  useEffect(() => {
    if (visible) {
      setIsModalReady(false);
      setShowRenameInput(false); // Reset rename input when modal opens
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 80,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsModalReady(true); // Modal is ready for interactions
      });
    } else {
      setIsModalReady(false);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
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

  const handleOptionPress = (optionId: string) => {
    if (!isModalReady) return; // Prevent interactions until modal is fully visible
    
    if (optionId === 'rename') {
      setNewFolderName(folderName);
      setShowRenameInput(true);
    } else {
      onOptionSelect(optionId);
      onClose();
    }
  };

  const handleRename = async () => {
    if (!newFolderName.trim()) {
      Alert.alert('Error', 'Please enter a folder name.');
      return;
    }

    if (newFolderName.trim() === folderName) {
      setShowRenameInput(false);
      return;
    }

    setIsRenaming(true);
    try {
      await onRenameFolder(newFolderName.trim());
      setShowRenameInput(false);
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to rename folder. Please try again.');
    } finally {
      setIsRenaming(false);
    }
  };

  const handleCancelRename = () => {
    setShowRenameInput(false);
    setNewFolderName('');
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>
        
        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <SafeAreaView style={styles.safeArea}>
            {/* Handle Bar */}
            <View style={styles.handleContainer}>
              <View style={styles.handle} />
            </View>

            {/* Header */}
            <View style={styles.header}>
              <View style={styles.folderInfo}>
                <View style={styles.folderIconContainer}>
                  <Ionicons 
                    name={isCustomFolder ? "folder" : "restaurant"} 
                    size={24} 
                    color={isCustomFolder ? "#FF9500" : "#007AFF"} 
                  />
                </View>
                <View style={styles.folderDetails}>
                  <Text style={styles.folderName} numberOfLines={1}>
                    {folderName}
                  </Text>
                  <Text style={styles.folderSubtitle}>
                    {itemCount} {itemCount === 1 ? 'item' : 'items'} • {isCustomFolder ? 'Custom folder' : 'Recipe folder'}
                  </Text>
                </View>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Options or Rename Input */}
            {showRenameInput ? (
              <View style={styles.renameContainer}>
                <Text style={styles.renameTitle}>Rename Folder</Text>
                <View style={styles.renameInputContainer}>
                  <TextInput
                    style={styles.renameInput}
                    value={newFolderName}
                    onChangeText={setNewFolderName}
                    placeholder="Enter folder name"
                    autoFocus
                    selectTextOnFocus
                    maxLength={50}
                  />
                </View>
                <View style={styles.renameButtons}>
                  <TouchableOpacity 
                    style={styles.renameCancelButton} 
                    onPress={handleCancelRename}
                    disabled={isRenaming}
                  >
                    <Text style={styles.renameCancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.renameConfirmButton, isRenaming && styles.renameButtonDisabled]} 
                    onPress={handleRename}
                    disabled={isRenaming}
                  >
                    {isRenaming ? (
                      <Text style={styles.renameConfirmText}>Renaming...</Text>
                    ) : (
                      <Text style={styles.renameConfirmText}>Rename</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.optionsContainer}>
                {options.map((option, index) => (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.optionItem,
                      option.destructive && styles.destructiveOption,
                    ]}
                    onPress={() => handleOptionPress(option.id)}
                    activeOpacity={0.6}
                  >
                    <View style={styles.optionContent}>
                      <View style={[
                        styles.optionIconContainer, 
                        { backgroundColor: `${option.color}15` },
                        option.destructive && styles.destructiveIconContainer,
                      ]}>
                        <Ionicons 
                          name={option.icon as any} 
                          size={22} 
                          color={option.color} 
                        />
                      </View>
                      <View style={styles.optionTextContainer}>
                        <Text style={[
                          styles.optionTitle,
                          option.destructive && styles.destructiveText,
                        ]}>
                          {option.title}
                        </Text>
                        {option.subtitle && (
                          <Text style={[
                            styles.optionSubtitle,
                            option.destructive && styles.destructiveSubtitle,
                          ]}>
                            {option.subtitle}
                          </Text>
                        )}
                      </View>
                    </View>
                    <Ionicons 
                      name="chevron-forward" 
                      size={18} 
                      color={option.destructive ? "#FF3B30" : "#ccc"} 
                    />
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Footer - only show when not in rename mode */}
            {!showRenameInput && (
              <View style={styles.footer}>
                <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            )}
          </SafeAreaView>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 16,
    maxHeight: screenHeight * 0.8,
  },
  safeArea: {
    paddingBottom: 0,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  folderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 16,
  },
  folderIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  folderDetails: {
    flex: 1,
  },
  folderName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  folderSubtitle: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionsContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
  },
  destructiveOption: {
    backgroundColor: '#fff5f5',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 16,
  },
  optionIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  destructiveIconContainer: {
    backgroundColor: '#ffebee',
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: 14,
    color: '#666',
    fontWeight: '400',
    lineHeight: 18,
  },
  destructiveText: {
    color: '#FF3B30',
  },
  destructiveSubtitle: {
    color: '#ff8a80',
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#666',
  },
  renameContainer: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  renameTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
    textAlign: 'center',
  },
  renameInputContainer: {
    marginBottom: 20,
  },
  renameInput: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1a1a1a',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  renameButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  renameCancelButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  renameCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  renameConfirmButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  renameConfirmText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  renameButtonDisabled: {
    backgroundColor: '#cccccc',
  },
});

export default FolderOptionsModal; 