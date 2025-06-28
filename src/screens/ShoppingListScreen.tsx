import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { shoppingListService, type ShoppingListGroup, type ShoppingListItem } from '../services/ShoppingListService';
import { CustomFolderModal, FolderOptionsModal } from '../components';

const ShoppingListScreen: React.FC = () => {
  const [shoppingGroups, setShoppingGroups] = useState<ShoppingListGroup[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<'createFolder' | 'addItem'>('createFolder');
  const [selectedFolder, setSelectedFolder] = useState<{ id: string; name: string } | undefined>();
  const [optionsModalVisible, setOptionsModalVisible] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<ShoppingListGroup | null>(null);

  const loadShoppingList = useCallback(async () => {
    try {
      const groups = await shoppingListService.getGroupedItems();
      setShoppingGroups(groups);
    } catch (error) {
      console.error('Error loading shopping list:', error);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadShoppingList();
    setRefreshing(false);
  }, [loadShoppingList]);

  useFocusEffect(
    useCallback(() => {
      loadShoppingList();
    }, [loadShoppingList])
  );

  const handleToggleItem = async (itemId: string) => {
    try {
      await shoppingListService.toggleItemChecked(itemId);
      await loadShoppingList();
    } catch (error) {
      console.error('Error toggling item:', error);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      await shoppingListService.removeItem(itemId);
      await loadShoppingList();
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const handleRemoveRecipe = async (recipeId: string, recipeName: string) => {
    Alert.alert(
      'Remove Recipe Items',
      `Remove all ingredients from "${recipeName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await shoppingListService.removeRecipeItems(recipeId);
              await loadShoppingList();
            } catch (error) {
              console.error('Error removing recipe items:', error);
            }
          },
        },
      ]
    );
  };

  const handleClearChecked = async () => {
    Alert.alert(
      'Clear Checked Items',
      'Remove all checked items from your shopping list?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await shoppingListService.clearCheckedItems();
              await loadShoppingList();
            } catch (error) {
              console.error('Error clearing checked items:', error);
            }
          },
        },
      ]
    );
  };

  const getTotalItemCount = () => {
    return shoppingGroups.reduce((total, group) => total + group.items.length, 0);
  };

  const getUncheckedItemCount = () => {
    return shoppingGroups.reduce(
      (total, group) => total + group.items.filter(item => !item.isChecked).length,
      0
    );
  };

  const handleToggleCollapse = async (folderId: string) => {
    try {
      await shoppingListService.toggleFolderCollapse(folderId);
      await loadShoppingList();
    } catch (error) {
      console.error('Error toggling folder collapse:', error);
    }
  };

  const handleCreateFolder = async (name: string) => {
    try {
      await shoppingListService.createCustomFolder(name);
      await loadShoppingList();
    } catch (error) {
      console.error('Error creating custom folder:', error);
      throw error;
    }
  };

  const handleAddCustomItem = async (folderId: string, folderName: string, itemName: string, amount: number, unit: string) => {
    try {
      await shoppingListService.addCustomItem(folderId, folderName, itemName, amount, unit);
      await loadShoppingList();
    } catch (error) {
      console.error('Error adding custom item:', error);
      throw error;
    }
  };

  const showFolderOptions = (group: ShoppingListGroup) => {
    setSelectedGroup(group);
    setOptionsModalVisible(true);
  };

  const handleOptionSelect = (optionId: string) => {
    if (!selectedGroup) return;

    switch (optionId) {
      case 'addItem':
        setSelectedFolder({ id: selectedGroup.recipeId, name: selectedGroup.recipeName });
        setModalMode('addItem');
        setModalVisible(true);
        break;

      case 'clearCompleted':
        handleClearCompletedFromFolder(selectedGroup.recipeId, selectedGroup.recipeName);
        break;
      case 'delete':
        handleDeleteFolder(selectedGroup.recipeId, selectedGroup.recipeName, selectedGroup.isCustomFolder);
        break;
    }
    
    setSelectedGroup(null);
  };

  const handleRenameFolder = async (folderId: string, newName: string, isCustomFolder?: boolean) => {
    try {
      if (isCustomFolder) {
        await shoppingListService.renameCustomFolder(folderId, newName);
      } else {
        await shoppingListService.renameRecipeFolder(folderId, newName);
      }
      await loadShoppingList();
    } catch (error) {
      console.error('Error renaming folder:', error);
      throw error; // Re-throw so the modal can handle the error
    }
  };

  const handleDeleteFolder = (folderId: string, folderName: string, isCustomFolder?: boolean) => {
    const title = isCustomFolder ? 'Delete Folder' : 'Remove All Items';
    const message = isCustomFolder 
      ? `Are you sure you want to permanently delete "${folderName}" and all its items?`
      : `Are you sure you want to remove all items from "${folderName}"?`;
    const buttonText = isCustomFolder ? 'Delete' : 'Remove';

    Alert.alert(
      title,
      message,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: buttonText,
          style: 'destructive',
          onPress: async () => {
            try {
              if (isCustomFolder) {
                await shoppingListService.deleteCustomFolder(folderId);
              } else {
                await shoppingListService.deleteRecipeFolder(folderId);
              }
              await loadShoppingList();
            } catch (error) {
              Alert.alert('Error', `Failed to ${buttonText.toLowerCase()} folder. Please try again.`);
            }
          },
        },
      ]
    );
  };

  const handleClearCompletedFromFolder = (folderId: string, folderName: string) => {
    Alert.alert(
      'Clear Completed Items',
      `Remove all checked items from "${folderName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await shoppingListService.clearCompletedFromFolder(folderId);
              await loadShoppingList();
            } catch (error) {
              Alert.alert('Error', 'Failed to clear completed items. Please try again.');
            }
          },
        },
      ]
    );
  };



  const openCreateFolderModal = () => {
    setModalMode('createFolder');
    setSelectedFolder(undefined);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Shopping List</Text>
          {getTotalItemCount() > 0 && (
            <Text style={styles.itemCount}>
              {getUncheckedItemCount()} of {getTotalItemCount()} items
            </Text>
          )}
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.addFolderButton} onPress={openCreateFolderModal}>
            <Ionicons name="folder-outline" size={20} color="#007AFF" />
          </TouchableOpacity>
          {getTotalItemCount() > 0 && (
            <TouchableOpacity style={styles.clearButton} onPress={handleClearChecked}>
              <Ionicons name="checkmark-done" size={20} color="#007AFF" />
              <Text style={styles.clearButtonText}>Clear Done</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {shoppingGroups.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="basket-outline" size={80} color="#ccc" />
            <Text style={styles.emptyTitle}>Your shopping list is empty</Text>
            <Text style={styles.emptySubtitle}>
              Add ingredients from recipes to get started
            </Text>
          </View>
        ) : (
          <View style={styles.itemsList}>
            {shoppingGroups.map((group) => (
              <View key={group.recipeId} style={styles.recipeGroup}>
                {/* Recipe Header */}
                <TouchableOpacity 
                  style={styles.recipeHeader}
                  onPress={() => handleToggleCollapse(group.recipeId)}
                  activeOpacity={0.7}
                >
                  <View style={styles.recipeHeaderLeft}>
                    <Ionicons 
                      name={group.isCustomFolder ? "folder" : "restaurant"} 
                      size={20} 
                      color={group.isCustomFolder ? "#FF9500" : "#007AFF"} 
                    />
                    <Text style={styles.recipeName}>{group.recipeName}</Text>
                    <Text style={styles.recipeItemCount}>
                      {group.items.filter(item => !item.isChecked).length} items
                    </Text>
                  </View>
                                     <View style={styles.recipeHeaderRight}>
                     <TouchableOpacity
                       style={styles.moreButton}
                       onPress={(e) => {
                         e.stopPropagation();
                         showFolderOptions(group);
                       }}
                     >
                       <Ionicons name="ellipsis-horizontal" size={18} color="#666" />
                     </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.collapseButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        handleToggleCollapse(group.recipeId);
                      }}
                    >
                      <Ionicons 
                        name={group.isCollapsed ? "chevron-down" : "chevron-up"} 
                        size={18} 
                        color="#666" 
                      />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>

                {/* Recipe Items */}
                {!group.isCollapsed && (
                  <View style={styles.recipeItems}>
                    {group.items.map((item) => (
                    <View key={item.id} style={[styles.shoppingItem, item.isChecked && styles.checkedItem]}>
                      <TouchableOpacity
                        style={styles.checkboxContainer}
                        onPress={() => handleToggleItem(item.id)}
                      >
                        <Ionicons
                          name={item.isChecked ? "checkmark-circle" : "ellipse-outline"}
                          size={24}
                          color={item.isChecked ? "#34C759" : "#ccc"}
                        />
                      </TouchableOpacity>
                      
                      <View style={styles.itemInfo}>
                        <Text style={[styles.itemName, item.isChecked && styles.checkedText]}>
                          {item.ingredient.name}
                        </Text>
                        <Text style={[styles.itemAmount, item.isChecked && styles.checkedText]}>
                          {item.ingredient.amount} {item.ingredient.unit}
                        </Text>
                      </View>

                      <TouchableOpacity
                        style={styles.removeItemButton}
                        onPress={() => handleRemoveItem(item.id)}
                      >
                        <Ionicons name="close" size={20} color="#999" />
                      </TouchableOpacity>
                    </View>
                                      ))}
                  </View>
                )}
                </View>
              ))}
            </View>
          )}
        </ScrollView>

        {/* Custom Folder Modal */}
        <CustomFolderModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onCreateFolder={handleCreateFolder}
          onAddItem={handleAddCustomItem}
          existingFolder={selectedFolder}
          mode={modalMode}
        />

        {/* Folder Options Modal */}
        <FolderOptionsModal
          visible={optionsModalVisible}
          onClose={() => {
            setOptionsModalVisible(false);
            setSelectedGroup(null);
          }}
          folderName={selectedGroup?.recipeName || ''}
          isCustomFolder={selectedGroup?.isCustomFolder || false}
          onOptionSelect={handleOptionSelect}
          onRenameFolder={async (newName: string) => {
            if (selectedGroup) {
              await handleRenameFolder(selectedGroup.recipeId, newName, selectedGroup.isCustomFolder);
            }
          }}
          itemCount={selectedGroup?.items.length || 0}
        />
      </View>
    );
  };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  itemCount: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  clearButtonText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  itemsList: {
    paddingVertical: 20,
  },
  recipeGroup: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  recipeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  recipeHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  recipeName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  recipeItemCount: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  removeRecipeButton: {
    padding: 8,
  },
  recipeItems: {
    padding: 16,
    gap: 12,
  },
  shoppingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 12,
  },
  checkedItem: {
    opacity: 0.6,
  },
  checkboxContainer: {
    padding: 4,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  itemAmount: {
    fontSize: 14,
    color: '#666',
  },
  checkedText: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  removeItemButton: {
    padding: 4,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addFolderButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f0f8ff',
  },
  recipeHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  moreButton: {
    padding: 8,
  },
  collapseButton: {
    padding: 8,
  },
});

export default ShoppingListScreen; 