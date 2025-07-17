// Shopping List Folder interface matching the database schema
export interface ShoppingListFolder {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  color: string;
  is_favorite: boolean;
  item_count: number;
  created_at: string;
  updated_at: string;
}

// Shopping List Item interface matching the database schema
export interface ShoppingListItem {
  id: string;
  folder_id: string;
  name: string;
  quantity?: string;
  category?: string;
  notes?: string;
  is_completed: boolean;
  priority: number; // -1 = low, 0 = normal, 1 = high
  created_at: string;
  updated_at: string;
}

// Extended folder interface with computed properties from the view
export interface ShoppingListFolderSummary extends ShoppingListFolder {
  completed_items: number;
  completion_percentage: number;
}

// Input interfaces for creating/updating
export interface CreateShoppingListFolderInput {
  name: string;
  description?: string;
  color?: string;
  is_favorite?: boolean;
}

export interface UpdateShoppingListFolderInput {
  name?: string;
  description?: string;
  color?: string;
  is_favorite?: boolean;
}

export interface CreateShoppingListItemInput {
  folder_id: string;
  name: string;
  quantity?: string;
  category?: string;
  notes?: string;
  priority?: number;
}

export interface UpdateShoppingListItemInput {
  name?: string;
  quantity?: string;
  category?: string;
  notes?: string;
  is_completed?: boolean;
  priority?: number;
}

// Common shopping list categories
export const SHOPPING_LIST_CATEGORIES = [
  'produce',
  'dairy',
  'meat',
  'seafood',
  'bakery',
  'pantry',
  'frozen',
  'beverages',
  'snacks',
  'household',
  'other'
] as const;

export type ShoppingListCategory = typeof SHOPPING_LIST_CATEGORIES[number];

// Priority levels
export const PRIORITY_LEVELS = {
  LOW: -1,
  NORMAL: 0,
  HIGH: 1
} as const;

// Default folder colors
export const FOLDER_COLORS = [
  '#3B82F6', // blue
  '#10B981', // emerald
  '#F59E0B', // amber
  '#EF4444', // red
  '#8B5CF6', // violet
  '#06B6D4', // cyan
  '#84CC16', // lime
  '#F97316', // orange
  '#EC4899', // pink
  '#6B7280', // gray
] as const; 