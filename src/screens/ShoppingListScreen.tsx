import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { shoppingListService } from '../services/ShoppingListService';
import { ShoppingListFolderSummary, ShoppingListItem } from '../types/ShoppingList';
import { CustomFolderModal, FolderOptionsModal } from '../components';

interface FolderWithItems extends ShoppingListFolderSummary {
  items: ShoppingListItem[];
  isCollapsed: boolean;
}

const ShoppingListScreen: React.FC = () => {
  const [folders, setFolders] = useState<FolderWithItems[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<'createFolder' | 'addItem'>('createFolder');
  const [selectedFolder, setSelectedFolder] = useState<{ id: string; name: string } | undefined>();
  const [optionsModalVisible, setOptionsModalVisible] = useState(false);
  const [selectedFolder2, setSelectedFolder2] = useState<FolderWithItems | null>(null);
  const [collapsedFolders, setCollapsedFolders] = useState<Set<string>>(new Set());
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Helper function to safely update state only if component is mounted
  const safeSetFolders = useCallback((updater: React.SetStateAction<FolderWithItems[]>) => {
    if (isMountedRef.current) {
      setFolders(updater);
    }
  }, []);

  const loadShoppingList = useCallback(async () => {
    try {
      const folderSummaries = await shoppingListService.getFoldersSummary();
      const foldersWithItems: FolderWithItems[] = [];

      for (const folder of folderSummaries) {
        const items = await shoppingListService.getFolderItems(folder.id);
        foldersWithItems.push({
          ...folder,
          items,
          isCollapsed: false,
        });
      }

      setFolders(foldersWithItems);
    } catch (error) {
      console.error('Error loading shopping list:', error);
    }
  }, []);

  // Update folder collapse states when collapsedFolders changes
  useEffect(() => {
    setFolders(prev => 
      prev.map(folder => ({
        ...folder,
        isCollapsed: collapsedFolders.has(folder.id),
      }))
    );
  }, [collapsedFolders]);

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
    // Optimistic update: Update UI immediately
    setFolders(prevFolders => 
      prevFolders.map(folder => ({
        ...folder,
        items: folder.items.map(item => 
          item.id === itemId 
            ? { ...item, is_completed: !item.is_completed }
            : item
        )
      }))
    );

    // Background sync with database
    try {
      await shoppingListService.toggleItemCompleted(itemId);
      // Success - no need to reload, optimistic update was correct
    } catch (error) {
      console.error('Error toggling item:', error);
      
      // Revert the optimistic update on error
      setFolders(prevFolders => 
        prevFolders.map(folder => ({
          ...folder,
          items: folder.items.map(item => 
            item.id === itemId 
              ? { ...item, is_completed: !item.is_completed } // Revert
              : item
          )
        }))
      );
      
      // Show error to user
      Alert.alert('Error', 'Failed to update item. Please try again.');
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    // Store the item for potential restoration
    const itemToRemove = folders
      .flatMap(folder => folder.items)
      .find(item => item.id === itemId);
    
    if (!itemToRemove) return;

    // Optimistic update: Remove from UI immediately
    setFolders(prevFolders => 
      prevFolders.map(folder => ({
        ...folder,
        items: folder.items.filter(item => item.id !== itemId)
      }))
    );

    // Background sync with database
    try {
      await shoppingListService.deleteItem(itemId);
      // Success - item permanently removed
    } catch (error) {
      console.error('Error removing item:', error);
      
      // Revert the optimistic update on error - restore the item
      setFolders(prevFolders => 
        prevFolders.map(folder => 
          folder.id === itemToRemove.folder_id
            ? {
                ...folder,
                items: [...folder.items, itemToRemove].sort((a, b) => 
                  new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
                )
              }
            : folder
        )
      );
      
      // Show error to user
      Alert.alert('Error', 'Failed to remove item. Please try again.');
    }
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
            // Store completed items for potential restoration
            const completedItems: ShoppingListItem[] = [];
            folders.forEach(folder => {
              folder.items.forEach(item => {
                if (item.is_completed) {
                  completedItems.push(item);
                }
              });
            });

            // Optimistic update: Remove completed items immediately
            setFolders(prevFolders => 
              prevFolders.map(folder => ({
                ...folder,
                items: folder.items.filter(item => !item.is_completed)
              }))
            );

            try {
              await shoppingListService.clearCompletedItems();
              // Success - items permanently removed
            } catch (error) {
              console.error('Error clearing checked items:', error);
              
              // Revert optimistic update on error
              setFolders(prevFolders => 
                prevFolders.map(folder => {
                  const folderCompletedItems = completedItems.filter(item => item.folder_id === folder.id);
                  return {
                    ...folder,
                    items: [...folder.items, ...folderCompletedItems].sort((a, b) => 
                      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
                    )
                  };
                })
              );
              
              Alert.alert('Error', 'Failed to clear completed items. Please try again.');
            }
          },
        },
      ]
    );
  };

  const getTotalItemCount = () => {
    if (!folders || !Array.isArray(folders)) return 0;
    return folders.reduce((total, folder) => total + (folder.items?.length || 0), 0);
  };

  const getUncheckedItemCount = () => {
    if (!folders || !Array.isArray(folders)) return 0;
    return folders.reduce(
      (total, folder) => total + (folder.items?.filter(item => !item.is_completed)?.length || 0),
      0
    );
  };

  const handleToggleCollapse = (folderId: string) => {
    setCollapsedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(folderId)) {
        newSet.delete(folderId);
      } else {
        newSet.add(folderId);
      }
      return newSet;
    });
  };

  const handleCreateFolder = async (name: string) => {
    try {
      await shoppingListService.createFolder({ name });
      await loadShoppingList();
    } catch (error) {
      console.error('Error creating custom folder:', error);
      throw error;
    }
  };

  const handleAddCustomItem = async (folderId: string, folderName: string, itemName: string, amount: number, unit: string) => {
    // Create temporary item for optimistic update
    const tempItem: ShoppingListItem = {
      id: `temp_${Date.now()}_${Math.random()}`, // Temporary ID
      folder_id: folderId,
      name: itemName,
      quantity: `${amount} ${unit}`,
      category: null,
      notes: null,
      is_completed: false,
      priority: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Optimistic update: Add to UI immediately
    setFolders(prevFolders => 
      prevFolders.map(folder => 
        folder.id === folderId
          ? {
              ...folder,
              items: [...folder.items, tempItem]
            }
          : folder
      )
    );

    try {
      // Background sync with database
      const realItem = await shoppingListService.addItem({
        folder_id: folderId,
        name: itemName,
        quantity: `${amount} ${unit}`,
      });

      if (realItem) {
        // Replace temp item with real item from database
        setFolders(prevFolders => 
          prevFolders.map(folder => 
            folder.id === folderId
              ? {
                  ...folder,
                  items: folder.items.map(item => 
                    item.id === tempItem.id ? realItem : item
                  )
                }
              : folder
          )
        );
      }
    } catch (error) {
      console.error('Error adding custom item:', error);
      
      // Revert optimistic update on error
      setFolders(prevFolders => 
        prevFolders.map(folder => 
          folder.id === folderId
            ? {
                ...folder,
                items: folder.items.filter(item => item.id !== tempItem.id)
              }
            : folder
        )
      );
      
      throw error; // Re-throw so the modal can handle the error
    }
  };

  const showFolderOptions = (folder: FolderWithItems) => {
    setSelectedFolder2(folder);
    setOptionsModalVisible(true);
  };

  const handleOptionSelect = (optionId: string) => {
    if (!selectedFolder2) return;

    switch (optionId) {
      case 'addItem':
        setSelectedFolder({ id: selectedFolder2.id, name: selectedFolder2.name });
        setModalMode('addItem');
        setModalVisible(true);
        break;

      case 'clearCompleted':
        handleClearCompletedFromFolder(selectedFolder2.id, selectedFolder2.name);
        break;
      case 'delete':
        handleDeleteFolder(selectedFolder2.id, selectedFolder2.name);
        break;
    }
    
    setSelectedFolder2(null);
  };

  const handleRenameFolder = async (folderId: string, newName: string) => {
    try {
      await shoppingListService.updateFolder(folderId, { name: newName });
      await loadShoppingList();
    } catch (error) {
      console.error('Error renaming folder:', error);
      throw error; // Re-throw so the modal can handle the error
    }
  };

  const handleDeleteFolder = (folderId: string, folderName: string) => {
    Alert.alert(
      'Delete Folder',
      `Are you sure you want to permanently delete "${folderName}" and all its items?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await shoppingListService.deleteFolder(folderId);
              await loadShoppingList();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete folder. Please try again.');
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
              await shoppingListService.clearCompletedItems(folderId);
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
        {!folders || folders.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="basket-outline" size={80} color="#ccc" />
            <Text style={styles.emptyTitle}>Your shopping list is empty</Text>
            <Text style={styles.emptySubtitle}>
              Add ingredients from recipes to get started
            </Text>
          </View>
        ) : (
          <View style={styles.itemsList}>
            {(folders || []).map((folder) => (
              <View key={folder.id} style={styles.recipeGroup}>
                {/* Folder Header */}
                <TouchableOpacity 
                  style={styles.recipeHeader}
                  onPress={() => handleToggleCollapse(folder.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.recipeHeaderLeft}>
                    <Ionicons 
                      name="folder" 
                      size={20} 
                      color={folder.color || "#007AFF"} 
                    />
                    <Text style={styles.recipeName}>{folder.name}</Text>
                    <Text style={styles.recipeItemCount}>
                      {(folder.items || []).filter(item => !item.is_completed).length} items
                    </Text>
                  </View>
                  <View style={styles.recipeHeaderRight}>
                    <TouchableOpacity
                      style={styles.moreButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        showFolderOptions(folder);
                      }}
                    >
                      <Ionicons name="ellipsis-horizontal" size={18} color="#666" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.collapseButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        handleToggleCollapse(folder.id);
                      }}
                    >
                      <Ionicons 
                        name={folder.isCollapsed ? "chevron-down" : "chevron-up"} 
                        size={18} 
                        color="#666" 
                      />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>

                {/* Folder Items */}
                {!folder.isCollapsed && (
                  <View style={styles.recipeItems}>
                    {(folder.items || []).map((item) => (
                      <View key={item.id} style={[styles.shoppingItem, item.is_completed && styles.checkedItem]}>
                        <TouchableOpacity
                          style={styles.checkboxContainer}
                          onPress={() => handleToggleItem(item.id)}
                        >
                          <Ionicons
                            name={item.is_completed ? "checkmark-circle" : "ellipse-outline"}
                            size={24}
                            color={item.is_completed ? "#34C759" : "#ccc"}
                          />
                        </TouchableOpacity>
                        
                        <View style={styles.itemInfo}>
                          <Text style={[styles.itemName, item.is_completed && styles.checkedText]}>
                            {item.name}
                          </Text>
                          {item.quantity && (
                            <Text style={[styles.itemAmount, item.is_completed && styles.checkedText]}>
                              {item.quantity}
                            </Text>
                          )}
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
            setSelectedFolder2(null);
          }}
          folderName={selectedFolder2?.name || ''}
          isCustomFolder={true}
          onOptionSelect={handleOptionSelect}
          onRenameFolder={async (newName: string) => {
            if (selectedFolder2) {
              await handleRenameFolder(selectedFolder2.id, newName);
            }
          }}
          itemCount={selectedFolder2?.items.length || 0}
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