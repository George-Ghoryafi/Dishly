import { supabase } from '../config/supabase';
import { Ingredient } from '../types/Recipe';
import {
  ShoppingListFolder,
  ShoppingListItem,
  ShoppingListFolderSummary,
  CreateShoppingListFolderInput,
  UpdateShoppingListFolderInput,
  CreateShoppingListItemInput,
  UpdateShoppingListItemInput,
  FOLDER_COLORS,
  PRIORITY_LEVELS
} from '../types/ShoppingList';

// Legacy interfaces for backward compatibility
export interface LegacyShoppingListItem {
  id: string;
  recipeName: string;
  recipeId: string;
  ingredient: Ingredient;
  portionSize: number;
  addedAt: Date;
  isChecked: boolean;
  isCustom?: boolean;
}

export interface ShoppingListGroup {
  recipeName: string;
  recipeId: string;
  items: LegacyShoppingListItem[];
  isCustomFolder?: boolean;
  isCollapsed?: boolean;
}

class ShoppingListService {
  // =============================================
  // FOLDER MANAGEMENT METHODS
  // =============================================

  async getFolders(): Promise<ShoppingListFolder[]> {
    try {
      const { data, error } = await supabase
        .from('shopping_list_folders')
        .select('*')
        .order('is_favorite', { ascending: false })
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting shopping list folders:', error);
      return [];
    }
  }

  async getFoldersSummary(): Promise<ShoppingListFolderSummary[]> {
    try {
      const { data, error } = await supabase
        .from('shopping_list_folder_summary')
        .select('*')
        .order('is_favorite', { ascending: false })
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting shopping list folders summary:', error);
      return [];
    }
  }

  async createFolder(input: CreateShoppingListFolderInput): Promise<ShoppingListFolder | null> {
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error('User not authenticated:', userError);
        return null;
      }

      const color = input.color || FOLDER_COLORS[Math.floor(Math.random() * FOLDER_COLORS.length)];
      
      const { data, error } = await supabase
        .from('shopping_list_folders')
        .insert({
          user_id: user.id,
          name: input.name,
          description: input.description,
          color,
          is_favorite: input.is_favorite || false,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating shopping list folder:', error);
      return null;
    }
  }

  async updateFolder(folderId: string, input: UpdateShoppingListFolderInput): Promise<ShoppingListFolder | null> {
    try {
      const { data, error } = await supabase
        .from('shopping_list_folders')
        .update(input)
        .eq('id', folderId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating shopping list folder:', error);
      return null;
    }
  }

  async deleteFolder(folderId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('shopping_list_folders')
        .delete()
        .eq('id', folderId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting shopping list folder:', error);
      return false;
    }
  }

  // =============================================
  // ITEM MANAGEMENT METHODS
  // =============================================

  async getFolderItems(folderId: string): Promise<ShoppingListItem[]> {
    try {
      const { data, error } = await supabase
        .from('shopping_list_items')
        .select('*')
        .eq('folder_id', folderId)
        .order('priority', { ascending: false })
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting shopping list items:', error);
      return [];
    }
  }

  async addItem(input: CreateShoppingListItemInput): Promise<ShoppingListItem | null> {
    try {
      const { data, error } = await supabase
        .from('shopping_list_items')
        .insert({
          folder_id: input.folder_id,
          name: input.name,
          quantity: input.quantity,
          category: input.category,
          notes: input.notes,
          priority: input.priority || PRIORITY_LEVELS.NORMAL,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding shopping list item:', error);
      return null;
    }
  }

  async updateItem(itemId: string, input: UpdateShoppingListItemInput): Promise<ShoppingListItem | null> {
    try {
      const { data, error } = await supabase
        .from('shopping_list_items')
        .update(input)
        .eq('id', itemId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating shopping list item:', error);
      return null;
    }
  }

  async deleteItem(itemId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('shopping_list_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting shopping list item:', error);
      return false;
    }
  }

  async toggleItemCompleted(itemId: string): Promise<boolean> {
    try {
      // First get the current state
      const { data: currentItem, error: fetchError } = await supabase
        .from('shopping_list_items')
        .select('is_completed')
        .eq('id', itemId)
        .single();

      if (fetchError) throw fetchError;

      // Toggle the completion state
      const { error: updateError } = await supabase
        .from('shopping_list_items')
        .update({ is_completed: !currentItem.is_completed })
        .eq('id', itemId);

      if (updateError) throw updateError;
      return true;
    } catch (error) {
      console.error('Error toggling item completion:', error);
      return false;
    }
  }

  // =============================================
  // BULK OPERATIONS
  // =============================================

  async clearCompletedItems(folderId?: string): Promise<boolean> {
    try {
      let query = supabase
        .from('shopping_list_items')
        .delete()
        .eq('is_completed', true);

      if (folderId) {
        query = query.eq('folder_id', folderId);
      }

      const { error } = await query;
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error clearing completed items:', error);
      return false;
    }
  }

  async clearAllItems(folderId?: string): Promise<boolean> {
    try {
      let query = supabase.from('shopping_list_items').delete();

      if (folderId) {
        query = query.eq('folder_id', folderId);
      } else {
        // Clear all items for the current user's folders
        query = query.in('folder_id', 
          supabase
            .from('shopping_list_folders')
            .select('id')
        );
      }

      const { error } = await query;
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error clearing all items:', error);
      return false;
    }
  }

  // =============================================
  // RECIPE INTEGRATION METHODS
  // =============================================

  async addIngredientsToFolder(
    folderId: string,
    ingredients: Ingredient[],
    portionSize: number = 1
  ): Promise<boolean> {
    try {
      const itemsToAdd = ingredients.map(ingredient => ({
        folder_id: folderId,
        name: ingredient.name,
        quantity: `${(ingredient.amount * portionSize)} ${ingredient.unit}`,
        category: this.categorizeIngredient(ingredient.name),
        priority: PRIORITY_LEVELS.NORMAL,
      }));

      const { error } = await supabase
        .from('shopping_list_items')
        .insert(itemsToAdd);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error adding ingredients to shopping list:', error);
      return false;
    }
  }

  async createFolderFromRecipe(
    recipeName: string,
    ingredients: Ingredient[],
    portionSize: number = 1
  ): Promise<string | null> {
    try {
      // Create folder first
      const folder = await this.createFolder({
        name: recipeName,
        description: `Shopping list for ${recipeName}`,
      });

      if (!folder) return null;

      // Add ingredients to the folder
      const success = await this.addIngredientsToFolder(folder.id, ingredients, portionSize);
      
      if (!success) {
        // Cleanup folder if adding ingredients failed
        await this.deleteFolder(folder.id);
        return null;
      }

      return folder.id;
    } catch (error) {
      console.error('Error creating folder from recipe:', error);
      return null;
    }
  }

  private categorizeIngredient(ingredientName: string): string {
    const name = ingredientName.toLowerCase();
    
    // Produce
    if (name.includes('tomato') || name.includes('lettuce') || name.includes('onion') || 
        name.includes('carrot') || name.includes('pepper') || name.includes('fruit') ||
        name.includes('vegetable') || name.includes('herb') || name.includes('garlic')) {
      return 'produce';
    }
    
    // Dairy
    if (name.includes('milk') || name.includes('cheese') || name.includes('butter') || 
        name.includes('cream') || name.includes('yogurt') || name.includes('egg')) {
      return 'dairy';
    }
    
    // Meat
    if (name.includes('chicken') || name.includes('beef') || name.includes('pork') || 
        name.includes('meat') || name.includes('bacon') || name.includes('sausage')) {
      return 'meat';
    }
    
    // Seafood
    if (name.includes('fish') || name.includes('salmon') || name.includes('tuna') || 
        name.includes('shrimp') || name.includes('crab')) {
      return 'seafood';
    }
    
    // Pantry
    if (name.includes('flour') || name.includes('sugar') || name.includes('salt') || 
        name.includes('oil') || name.includes('vinegar') || name.includes('spice') ||
        name.includes('pasta') || name.includes('rice')) {
      return 'pantry';
    }
    
    // Bakery
    if (name.includes('bread') || name.includes('bun') || name.includes('roll')) {
      return 'bakery';
    }
    
    return 'other';
  }

  // =============================================
  // RECIPE INTEGRATION SMART METHODS
  // =============================================

  async findFolderByRecipeName(recipeName: string): Promise<ShoppingListFolder | null> {
    try {
      const { data, error } = await supabase
        .from('shopping_list_folders')
        .select('*')
        .ilike('name', recipeName.trim())
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
      return data || null;
    } catch (error) {
      console.error('Error finding folder by recipe name:', error);
      return null;
    }
  }

  async getRecipeIngredientsInList(recipeName: string): Promise<string[]> {
    try {
      const folder = await this.findFolderByRecipeName(recipeName);
      if (!folder) return [];

      const items = await this.getFolderItems(folder.id);
      return items.map(item => item.name.toLowerCase().trim());
    } catch (error) {
      console.error('Error getting recipe ingredients in list:', error);
      return [];
    }
  }

  async getIngredientStatus(recipeName: string, ingredientNames: string[]): Promise<{
    inCurrentRecipe: Set<string>;
    inOtherRecipes: Map<string, string[]>; // ingredient -> folder names
  }> {
    try {
      // Get current recipe's folder and ingredients
      const currentFolder = await this.findFolderByRecipeName(recipeName);
      const currentIngredients = new Set<string>();
      
      if (currentFolder) {
        const items = await this.getFolderItems(currentFolder.id);
        items.forEach(item => {
          currentIngredients.add(item.name.toLowerCase().trim());
        });
      }

      // Get all user's folders and check for ingredients in other folders
      const allFolders = await this.getFolders();
      const inOtherRecipes = new Map<string, string[]>();

      for (const folder of allFolders) {
        // Skip the current recipe's folder
        if (folder.id === currentFolder?.id) continue;

        const items = await this.getFolderItems(folder.id);
        
        for (const item of items) {
          const ingredientName = item.name.toLowerCase().trim();
          
          // Check if this ingredient is one we're looking for
          if (ingredientNames.some(name => name.toLowerCase().trim() === ingredientName)) {
            if (!inOtherRecipes.has(ingredientName)) {
              inOtherRecipes.set(ingredientName, []);
            }
            inOtherRecipes.get(ingredientName)!.push(folder.name);
          }
        }
      }

      return {
        inCurrentRecipe: currentIngredients,
        inOtherRecipes
      };
    } catch (error) {
      console.error('Error getting ingredient status:', error);
      return {
        inCurrentRecipe: new Set(),
        inOtherRecipes: new Map()
      };
    }
  }

  async smartAddIngredientsFromRecipe(
    recipeName: string,
    ingredients: Ingredient[],
    portionSize: number = 1
  ): Promise<{ folderId: string; isNewFolder: boolean; addedCount: number }> {
    try {
      let folder = await this.findFolderByRecipeName(recipeName);
      let isNewFolder = false;

      if (!folder) {
        // Create new folder
        folder = await this.createFolder({
          name: recipeName,
          description: `Shopping list for ${recipeName}`,
        });
        isNewFolder = true;
        
        if (!folder) {
          throw new Error('Failed to create folder');
        }
      }

      // Get existing ingredients to avoid duplicates
      const existingItems = await this.getFolderItems(folder.id);
      const existingIngredientNames = new Set(
        existingItems.map(item => item.name.toLowerCase().trim())
      );

      // Filter out ingredients that are already in the list
      const newIngredients = ingredients.filter(ingredient => 
        !existingIngredientNames.has(ingredient.name.toLowerCase().trim())
      );

      if (newIngredients.length > 0) {
        await this.addIngredientsToFolder(folder.id, newIngredients, portionSize);
      }

      return {
        folderId: folder.id,
        isNewFolder,
        addedCount: newIngredients.length
      };
    } catch (error) {
      console.error('Error smart adding ingredients from recipe:', error);
      throw error;
    }
  }

  // =============================================
  // UTILITY METHODS
  // =============================================

  async getTotalItemCount(): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('shopping_list_items')
        .select('id', { count: 'exact', head: true })
        .eq('is_completed', false);

      if (error) throw error;
      return data?.length || 0;
    } catch (error) {
      console.error('Error getting total item count:', error);
      return 0;
    }
  }

  async getFolderItemCount(folderId: string): Promise<{ total: number; completed: number }> {
    try {
      const [totalResult, completedResult] = await Promise.all([
        supabase
          .from('shopping_list_items')
          .select('id', { count: 'exact', head: true })
          .eq('folder_id', folderId),
        supabase
          .from('shopping_list_items')
          .select('id', { count: 'exact', head: true })
          .eq('folder_id', folderId)
          .eq('is_completed', true)
      ]);

      if (totalResult.error) throw totalResult.error;
      if (completedResult.error) throw completedResult.error;

      return {
        total: totalResult.data?.length || 0,
        completed: completedResult.data?.length || 0,
      };
    } catch (error) {
      console.error('Error getting folder item count:', error);
      return { total: 0, completed: 0 };
    }
  }

  // =============================================
  // LEGACY COMPATIBILITY METHODS
  // =============================================

  /**
   * @deprecated Use smartAddIngredientsFromRecipe instead
   */
  async addIngredients(
    recipeId: string,
    recipeName: string,
    ingredients: Ingredient[],
    portionSize: number = 1
  ): Promise<void> {
    console.warn('addIngredients is deprecated. Use smartAddIngredientsFromRecipe instead.');
    await this.smartAddIngredientsFromRecipe(recipeName, ingredients, portionSize);
  }

  /**
   * @deprecated Use deleteItem instead
   */
  async removeItem(itemId: string): Promise<void> {
    console.warn('removeItem is deprecated. Use deleteItem instead.');
    await this.deleteItem(itemId);
  }

  /**
   * @deprecated Use toggleItemCompleted instead
   */
  async toggleItemChecked(itemId: string): Promise<void> {
    console.warn('toggleItemChecked is deprecated. Use toggleItemCompleted instead.');
    await this.toggleItemCompleted(itemId);
  }

  /**
   * @deprecated Use clearAllItems with folderId instead
   */
  async removeRecipeItems(recipeId: string): Promise<void> {
    console.warn('removeRecipeItems is deprecated. Use clearAllItems with folderId instead.');
    await this.clearAllItems(recipeId);
  }

  /**
   * @deprecated Use getFoldersSummary and getFolderItems instead
   */
  async getGroupedItems(): Promise<ShoppingListGroup[]> {
    console.warn('getGroupedItems is deprecated. Use getFoldersSummary and getFolderItems instead.');
    
    try {
      const folders = await this.getFoldersSummary();
      const groups: ShoppingListGroup[] = [];

      for (const folder of folders) {
        const items = await this.getFolderItems(folder.id);
        const legacyItems: LegacyShoppingListItem[] = items.map(item => ({
          id: item.id,
          recipeName: folder.name,
          recipeId: folder.id,
          ingredient: {
            name: item.name,
            amount: parseFloat(item.quantity?.split(' ')[0] || '1'),
            unit: item.quantity?.split(' ').slice(1).join(' ') || 'item',
          },
          portionSize: 1,
          addedAt: new Date(item.created_at),
          isChecked: item.is_completed,
          isCustom: true,
        }));

        groups.push({
          recipeName: folder.name,
          recipeId: folder.id,
          items: legacyItems,
          isCustomFolder: true,
          isCollapsed: false,
        });
      }

      return groups;
    } catch (error) {
      console.error('Error getting grouped items (legacy):', error);
      return [];
    }
  }

  /**
   * @deprecated Use clearCompletedItems instead
   */
  async clearCheckedItems(): Promise<void> {
    console.warn('clearCheckedItems is deprecated. Use clearCompletedItems instead.');
    await this.clearCompletedItems();
  }

  /**
   * @deprecated Use getTotalItemCount instead
   */
  async getItemCount(): Promise<number> {
    console.warn('getItemCount is deprecated. Use getTotalItemCount instead.');
    return await this.getTotalItemCount();
  }

  /**
   * @deprecated Folder collapse state now handled by UI components
   */
  async toggleFolderCollapse(folderId: string): Promise<void> {
    console.warn('toggleFolderCollapse is deprecated. Folder state should be handled by UI components.');
  }

  /**
   * @deprecated Use createFolder instead
   */
  async createCustomFolder(name: string): Promise<string> {
    console.warn('createCustomFolder is deprecated. Use createFolder instead.');
    const folder = await this.createFolder({ name });
    return folder?.id || '';
  }

  /**
   * @deprecated Use deleteFolder instead
   */
  async deleteCustomFolder(folderId: string): Promise<void> {
    console.warn('deleteCustomFolder is deprecated. Use deleteFolder instead.');
    await this.deleteFolder(folderId);
  }

  /**
   * @deprecated Use addItem instead
   */
  async addCustomItem(folderId: string, folderName: string, itemName: string, amount: number = 1, unit: string = 'item'): Promise<void> {
    console.warn('addCustomItem is deprecated. Use addItem instead.');
    await this.addItem({
      folder_id: folderId,
      name: itemName,
      quantity: `${amount} ${unit}`,
    });
  }

  /**
   * @deprecated Use updateFolder instead
   */
  async renameCustomFolder(folderId: string, newName: string): Promise<void> {
    console.warn('renameCustomFolder is deprecated. Use updateFolder instead.');
    await this.updateFolder(folderId, { name: newName });
  }

  /**
   * @deprecated Use clearCompletedItems with folderId instead
   */
  async clearCompletedFromFolder(folderId: string): Promise<void> {
    console.warn('clearCompletedFromFolder is deprecated. Use clearCompletedItems with folderId instead.');
    await this.clearCompletedItems(folderId);
  }

  /**
   * @deprecated Use clearAllItems with folderId instead
   */
  async clearAllFromFolder(folderId: string): Promise<void> {
    console.warn('clearAllFromFolder is deprecated. Use clearAllItems with folderId instead.');
    await this.clearAllItems(folderId);
  }

  /**
   * @deprecated Use updateFolder instead
   */
  async renameRecipeFolder(folderId: string, newName: string): Promise<void> {
    console.warn('renameRecipeFolder is deprecated. Use updateFolder instead.');
    await this.updateFolder(folderId, { name: newName });
  }

  /**
   * @deprecated Use deleteFolder instead
   */
  async deleteRecipeFolder(folderId: string): Promise<void> {
    console.warn('deleteRecipeFolder is deprecated. Use deleteFolder instead.');
    await this.deleteFolder(folderId);
  }
}

export const shoppingListService = new ShoppingListService();
export type { ShoppingListService }; 