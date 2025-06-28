import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ingredient } from '../types/Recipe';

export interface ShoppingListItem {
  id: string;
  recipeName: string;
  recipeId: string;
  ingredient: Ingredient;
  portionSize: number;
  addedAt: Date;
  isChecked: boolean;
  isCustom?: boolean; // Flag to indicate if this is a custom item
}

export interface ShoppingListGroup {
  recipeName: string;
  recipeId: string;
  items: ShoppingListItem[];
  isCustomFolder?: boolean; // Flag to indicate if this is a custom folder
  isCollapsed?: boolean; // Flag to track collapse state
}

const SHOPPING_LIST_KEY = '@dishly_shopping_list';
const FOLDER_STATES_KEY = '@dishly_folder_states';
const CUSTOM_FOLDERS_KEY = '@dishly_custom_folders';

interface FolderState {
  [folderId: string]: boolean; // true = collapsed, false = expanded
}

interface CustomFolder {
  id: string;
  name: string;
  createdAt: Date;
}

class ShoppingListService {
  private async getShoppingList(): Promise<ShoppingListItem[]> {
    try {
      const data = await AsyncStorage.getItem(SHOPPING_LIST_KEY);
      if (data) {
        const items = JSON.parse(data);
        // Convert date strings back to Date objects
        return items.map((item: any) => ({
          ...item,
          addedAt: new Date(item.addedAt),
        }));
      }
      return [];
    } catch (error) {
      console.error('Error getting shopping list:', error);
      return [];
    }
  }

  private async saveShoppingList(items: ShoppingListItem[]): Promise<void> {
    try {
      await AsyncStorage.setItem(SHOPPING_LIST_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Error saving shopping list:', error);
    }
  }

  private async getFolderStates(): Promise<FolderState> {
    try {
      const data = await AsyncStorage.getItem(FOLDER_STATES_KEY);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error getting folder states:', error);
      return {};
    }
  }

  private async saveFolderStates(states: FolderState): Promise<void> {
    try {
      await AsyncStorage.setItem(FOLDER_STATES_KEY, JSON.stringify(states));
    } catch (error) {
      console.error('Error saving folder states:', error);
    }
  }

  private async getCustomFolders(): Promise<CustomFolder[]> {
    try {
      const data = await AsyncStorage.getItem(CUSTOM_FOLDERS_KEY);
      if (data) {
        const folders = JSON.parse(data);
        return folders.map((folder: any) => ({
          ...folder,
          createdAt: new Date(folder.createdAt),
        }));
      }
      return [];
    } catch (error) {
      console.error('Error getting custom folders:', error);
      return [];
    }
  }

  private async saveCustomFolders(folders: CustomFolder[]): Promise<void> {
    try {
      await AsyncStorage.setItem(CUSTOM_FOLDERS_KEY, JSON.stringify(folders));
    } catch (error) {
      console.error('Error saving custom folders:', error);
    }
  }

  async addIngredients(
    recipeId: string,
    recipeName: string,
    ingredients: Ingredient[],
    portionSize: number = 1
  ): Promise<void> {
    try {
      const currentList = await this.getShoppingList();
      
      const newItems: ShoppingListItem[] = ingredients.map((ingredient) => ({
        id: `${recipeId}_${ingredient.name}_${Date.now()}_${Math.random()}`,
        recipeName,
        recipeId,
        ingredient: {
          ...ingredient,
          amount: ingredient.amount * portionSize,
        },
        portionSize,
        addedAt: new Date(),
        isChecked: false,
      }));

      const updatedList = [...currentList, ...newItems];
      await this.saveShoppingList(updatedList);
    } catch (error) {
      console.error('Error adding ingredients to shopping list:', error);
    }
  }

  async removeItem(itemId: string): Promise<void> {
    try {
      const currentList = await this.getShoppingList();
      const updatedList = currentList.filter(item => item.id !== itemId);
      await this.saveShoppingList(updatedList);
    } catch (error) {
      console.error('Error removing item from shopping list:', error);
    }
  }

  async toggleItemChecked(itemId: string): Promise<void> {
    try {
      const currentList = await this.getShoppingList();
      const updatedList = currentList.map(item =>
        item.id === itemId ? { ...item, isChecked: !item.isChecked } : item
      );
      await this.saveShoppingList(updatedList);
    } catch (error) {
      console.error('Error toggling item checked status:', error);
    }
  }

  async removeRecipeItems(recipeId: string): Promise<void> {
    try {
      const currentList = await this.getShoppingList();
      const updatedList = currentList.filter(item => item.recipeId !== recipeId);
      await this.saveShoppingList(updatedList);
    } catch (error) {
      console.error('Error removing recipe items from shopping list:', error);
    }
  }

  async getGroupedItems(): Promise<ShoppingListGroup[]> {
    try {
      const [items, folderStates, customFolders] = await Promise.all([
        this.getShoppingList(),
        this.getFolderStates(),
        this.getCustomFolders(),
      ]);
      
      // Group items by recipe
      const grouped = items.reduce((acc, item) => {
        const existingGroup = acc.find(group => group.recipeId === item.recipeId);
        
        if (existingGroup) {
          existingGroup.items.push(item);
        } else {
          acc.push({
            recipeName: item.recipeName,
            recipeId: item.recipeId,
            items: [item],
            isCustomFolder: item.isCustom || false,
            isCollapsed: folderStates[item.recipeId] || false,
          });
        }
        
        return acc;
      }, [] as ShoppingListGroup[]);

      // Add empty custom folders that don't have items yet
      customFolders.forEach(folder => {
        const existingGroup = grouped.find(group => group.recipeId === folder.id);
        if (!existingGroup) {
          grouped.push({
            recipeName: folder.name,
            recipeId: folder.id,
            items: [],
            isCustomFolder: true,
            isCollapsed: folderStates[folder.id] || false,
          });
        }
      });

      // Sort groups by most recent addition, but keep custom folders at the end
      return grouped.sort((a, b) => {
        // Custom folders go to the end
        if (a.isCustomFolder && !b.isCustomFolder) return 1;
        if (!a.isCustomFolder && b.isCustomFolder) return -1;
        if (a.isCustomFolder && b.isCustomFolder) {
          // Sort custom folders alphabetically
          return a.recipeName.localeCompare(b.recipeName);
        }
        
        // Regular recipe folders sorted by most recent addition
        const aLatest = a.items.length > 0 ? Math.max(...a.items.map(item => item.addedAt.getTime())) : 0;
        const bLatest = b.items.length > 0 ? Math.max(...b.items.map(item => item.addedAt.getTime())) : 0;
        return bLatest - aLatest;
      });
    } catch (error) {
      console.error('Error getting grouped shopping list items:', error);
      return [];
    }
  }

  async clearCheckedItems(): Promise<void> {
    try {
      const currentList = await this.getShoppingList();
      const updatedList = currentList.filter(item => !item.isChecked);
      await this.saveShoppingList(updatedList);
    } catch (error) {
      console.error('Error clearing checked items:', error);
    }
  }

  async clearAllItems(): Promise<void> {
    try {
      await AsyncStorage.removeItem(SHOPPING_LIST_KEY);
    } catch (error) {
      console.error('Error clearing all items:', error);
    }
  }

  async getItemCount(): Promise<number> {
    try {
      const items = await this.getShoppingList();
      return items.filter(item => !item.isChecked).length;
    } catch (error) {
      console.error('Error getting item count:', error);
      return 0;
    }
  }

  async toggleFolderCollapse(folderId: string): Promise<void> {
    try {
      const folderStates = await this.getFolderStates();
      folderStates[folderId] = !folderStates[folderId];
      await this.saveFolderStates(folderStates);
    } catch (error) {
      console.error('Error toggling folder collapse:', error);
    }
  }

  async createCustomFolder(name: string): Promise<string> {
    try {
      const customFolders = await this.getCustomFolders();
      const newFolder: CustomFolder = {
        id: `custom_${Date.now()}_${Math.random()}`,
        name,
        createdAt: new Date(),
      };
      
      customFolders.push(newFolder);
      await this.saveCustomFolders(customFolders);
      return newFolder.id;
    } catch (error) {
      console.error('Error creating custom folder:', error);
      throw error;
    }
  }

  async deleteCustomFolder(folderId: string): Promise<void> {
    try {
      // Remove all items in the folder
      await this.removeRecipeItems(folderId);
      
      // Remove the folder itself
      const customFolders = await this.getCustomFolders();
      const updatedFolders = customFolders.filter(folder => folder.id !== folderId);
      await this.saveCustomFolders(updatedFolders);
      
      // Remove folder state
      const folderStates = await this.getFolderStates();
      delete folderStates[folderId];
      await this.saveFolderStates(folderStates);
    } catch (error) {
      console.error('Error deleting custom folder:', error);
    }
  }

  async addCustomItem(folderId: string, folderName: string, itemName: string, amount: number = 1, unit: string = 'item'): Promise<void> {
    try {
      const currentList = await this.getShoppingList();
      
      const newItem: ShoppingListItem = {
        id: `custom_${folderId}_${itemName}_${Date.now()}_${Math.random()}`,
        recipeName: folderName,
        recipeId: folderId,
        ingredient: {
          name: itemName,
          amount,
          unit,
        },
        portionSize: 1,
        addedAt: new Date(),
        isChecked: false,
        isCustom: true,
      };

      const updatedList = [...currentList, newItem];
      await this.saveShoppingList(updatedList);
    } catch (error) {
      console.error('Error adding custom item:', error);
    }
  }

  async renameCustomFolder(folderId: string, newName: string): Promise<void> {
    try {
      // Update custom folder name
      const customFolders = await this.getCustomFolders();
      const updatedFolders = customFolders.map(folder =>
        folder.id === folderId ? { ...folder, name: newName } : folder
      );
      await this.saveCustomFolders(updatedFolders);
      
      // Update all items in the folder
      const currentList = await this.getShoppingList();
      const updatedList = currentList.map(item =>
        item.recipeId === folderId ? { ...item, recipeName: newName } : item
      );
      await this.saveShoppingList(updatedList);
    } catch (error) {
      console.error('Error renaming custom folder:', error);
    }
  }

  async clearCompletedFromFolder(folderId: string): Promise<void> {
    try {
      const currentList = await this.getShoppingList();
      const updatedList = currentList.filter(item => 
        item.recipeId !== folderId || !item.isChecked
      );
      await this.saveShoppingList(updatedList);
    } catch (error) {
      console.error('Error clearing completed items from folder:', error);
    }
  }

  async clearAllFromFolder(folderId: string): Promise<void> {
    try {
      const currentList = await this.getShoppingList();
      const updatedList = currentList.filter(item => item.recipeId !== folderId);
      await this.saveShoppingList(updatedList);
    } catch (error) {
      console.error('Error clearing all items from folder:', error);
    }
  }

  async renameRecipeFolder(folderId: string, newName: string): Promise<void> {
    try {
      // Update all items in the recipe folder
      const currentList = await this.getShoppingList();
      const updatedList = currentList.map(item =>
        item.recipeId === folderId ? { ...item, recipeName: newName } : item
      );
      await this.saveShoppingList(updatedList);
    } catch (error) {
      console.error('Error renaming recipe folder:', error);
    }
  }

  async deleteRecipeFolder(folderId: string): Promise<void> {
    try {
      // Remove all items in the recipe folder
      await this.removeRecipeItems(folderId);
      
      // Remove folder state
      const folderStates = await this.getFolderStates();
      delete folderStates[folderId];
      await this.saveFolderStates(folderStates);
    } catch (error) {
      console.error('Error deleting recipe folder:', error);
    }
  }
}

export const shoppingListService = new ShoppingListService();
export type { ShoppingListService }; 