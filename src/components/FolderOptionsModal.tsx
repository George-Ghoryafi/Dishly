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
import { 
  colors, 
  typography, 
  spacing, 
  componentShadows,
  componentBorderRadius,
  lightTheme
} from '../styles';

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
  itemCount: number;
}

const FolderOptionsModal: React.FC<FolderOptionsModalProps> = ({
  visible,
  onClose,
  folderName,
  isCustomFolder,
  onOptionSelect,
  itemCount,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;
  const [isModalReady, setIsModalReady] = useState(false);

  const options: FolderOption[] = [
    {
      id: 'addItem',
      title: 'Add Custom Item',
      subtitle: 'Add your own items to this list',
      icon: 'add-circle',
      color: colors.success.primary,
    },
    {
      id: 'clearCompleted',
      title: 'Clear Completed',
      subtitle: 'Remove all checked items',
      icon: 'checkmark-done-circle',
      color: colors.warning.primary,
    },
    {
      id: 'rename',
      title: 'Rename Folder',
      subtitle: 'Change the folder name',
      icon: 'create',
      color: colors.spiceOrange,
    },
    {
      id: 'delete',
      title: isCustomFolder ? 'Delete Folder' : 'Remove All Items',
      subtitle: isCustomFolder 
        ? 'Permanently delete this folder and all items'
        : 'Remove all items from this recipe list',
      icon: isCustomFolder ? 'trash-bin' : 'trash',
      color: colors.error.primary,
      destructive: true,
    },
  ];

  useEffect(() => {
    if (visible) {
      setIsModalReady(false);
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
    
    onOptionSelect(optionId);
    onClose();
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
                    color={isCustomFolder ? colors.warning.primary : colors.spiceOrange} 
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
                <Ionicons name="close" size={24} color={colors.warmGray} />
              </TouchableOpacity>
            </View>

            {/* Options */}
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
<<<<<<< Updated upstream
<<<<<<< Updated upstream
=======
<<<<<<< Updated upstream
=======
>>>>>>> Stashed changes
                    <Ionicons 
                      name="chevron-forward" 
                      size={18} 
                      color={option.destructive ? "#FF3B30" : "#ccc"} 
                    />
                  </TouchableOpacity>
                ))}
              </View>
            )}
=======
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
                  </View>
                  <Ionicons 
                    name="chevron-forward" 
                    size={18} 
<<<<<<< Updated upstream
<<<<<<< Updated upstream
                    color={option.destructive ? "#FF3B30" : "#ccc"} 
                  />
=======
=======
>>>>>>> Stashed changes
                    color={option.destructive ? colors.error.primary : colors.warmGrayLight} 
                  />
                </TouchableOpacity>
              ))}
            </View>
>>>>>>> Stashed changes

            {/* Footer - only show when not in rename mode */}
            {!showRenameInput && (
              <View style={styles.footer}>
                <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
>>>>>>> Stashed changes
                </TouchableOpacity>
              ))}
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
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
    backgroundColor: colors.warmCream, // Changed from #ffffff to Warm Cream
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    ...componentShadows.button, // Using new shadow system
    maxHeight: screenHeight * 0.8,
  },
  safeArea: {
    paddingBottom: 0,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: spacing.m, // Using design system spacing (12px)
  },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: lightTheme.borders, // Changed from #e0e0e0 to design system border
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl, // Using design system spacing (24px)
    paddingVertical: spacing.l, // Using design system spacing (20px)
    borderBottomWidth: 1,
    borderBottomColor: lightTheme.borders, // Changed from #f0f0f0 to design system border
  },
  folderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing.m, // Using design system spacing (16px)
  },
  folderIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.warmCreamLight, // Changed from #f8f9fa to Warm Cream Light
    alignItems: 'center',
    justifyContent: 'center',
  },
  folderDetails: {
    flex: 1,
  },
  folderName: {
    ...typography.h4, // Using H4 typography (20px, SemiBold)
    color: colors.deepNavy, // Changed from #1a1a1a to Deep Navy
    marginBottom: spacing.xs, // Using design system spacing (2px)
  },
  folderSubtitle: {
    ...typography.bodyMedium, // Using bodyMedium typography (16px, Regular)
    color: colors.warmGray, // Changed from #666 to Warm Gray
    fontWeight: '500',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.warmCreamDark, // Changed from #f5f5f5 to Warm Cream Dark
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionsContainer: {
    paddingHorizontal: spacing.xl, // Using design system spacing (24px)
    paddingVertical: spacing.m, // Using design system spacing (16px)
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.m, // Using design system spacing (16px)
    paddingHorizontal: spacing.m, // Using design system spacing (16px)
    marginBottom: spacing.s, // Using design system spacing (8px)
    backgroundColor: colors.warmCreamLight, // Changed from #f8f9fa to Warm Cream Light
    borderRadius: componentBorderRadius.card, // Using design system border radius (12px)
  },
  destructiveOption: {
    backgroundColor: colors.error.background, // Changed from #fff5f5 to error background
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing.m, // Using design system spacing (16px)
  },
  optionIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  destructiveIconContainer: {
    backgroundColor: colors.error.background, // Changed from #ffebee to error background
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    ...typography.bodyLarge, // Using bodyLarge typography (18px, Regular)
    fontWeight: typography.h4.fontWeight, // SemiBold weight
    color: colors.deepNavy, // Changed from #1a1a1a to Deep Navy
    marginBottom: spacing.xs, // Using design system spacing (2px)
  },
  optionSubtitle: {
    ...typography.bodyMedium, // Using bodyMedium typography (16px, Regular)
    color: colors.warmGray, // Changed from #666 to Warm Gray
    fontWeight: '400',
    lineHeight: 18,
  },
  destructiveText: {
    color: colors.error.primary, // Changed from #FF3B30 to error primary
  },
  destructiveSubtitle: {
    color: colors.error.primary, // Changed from #ff8a80 to error primary
  },
  footer: {
    paddingHorizontal: spacing.xl, // Using design system spacing (24px)
    paddingVertical: spacing.l, // Using design system spacing (20px)
    borderTopWidth: 1,
    borderTopColor: lightTheme.borders, // Changed from #f0f0f0 to design system border
  },
  cancelButton: {
    backgroundColor: colors.warmCreamDark, // Changed from #f5f5f5 to Warm Cream Dark
    paddingVertical: spacing.m, // Using design system spacing (16px)
    paddingHorizontal: spacing.xl, // Using design system spacing (24px)
    borderRadius: componentBorderRadius.card, // Using design system border radius (12px)
    alignItems: 'center',
  },
  cancelButtonText: {
    ...typography.bodyLarge, // Using bodyLarge typography (18px, Regular)
    fontWeight: typography.h4.fontWeight, // SemiBold weight
    color: colors.warmGray, // Changed from #666 to Warm Gray
  },
<<<<<<< Updated upstream
<<<<<<< Updated upstream

=======
<<<<<<< Updated upstream
=======
>>>>>>> Stashed changes
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
=======
>>>>>>> Stashed changes
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
});

export default FolderOptionsModal; 