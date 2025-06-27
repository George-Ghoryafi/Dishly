import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = 'dishly_favorites';

export interface FavoritesService {
  getFavorites(): Promise<Set<string>>;
  addToFavorites(recipeId: string): Promise<void>;
  removeFromFavorites(recipeId: string): Promise<void>;
  isFavorite(recipeId: string): Promise<boolean>;
  toggleFavorite(recipeId: string): Promise<boolean>; // Returns new favorite status
}

class FavoritesServiceImpl implements FavoritesService {
  async getFavorites(): Promise<Set<string>> {
    try {
      const favoritesJson = await AsyncStorage.getItem(FAVORITES_KEY);
      if (favoritesJson) {
        const favoritesArray = JSON.parse(favoritesJson);
        return new Set(favoritesArray);
      }
      return new Set();
    } catch (error) {
      console.error('Error getting favorites:', error);
      return new Set();
    }
  }

  async addToFavorites(recipeId: string): Promise<void> {
    try {
      const favorites = await this.getFavorites();
      favorites.add(recipeId);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify([...favorites]));
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
  }

  async removeFromFavorites(recipeId: string): Promise<void> {
    try {
      const favorites = await this.getFavorites();
      favorites.delete(recipeId);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify([...favorites]));
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  }

  async isFavorite(recipeId: string): Promise<boolean> {
    try {
      const favorites = await this.getFavorites();
      return favorites.has(recipeId);
    } catch (error) {
      console.error('Error checking favorite status:', error);
      return false;
    }
  }

  async toggleFavorite(recipeId: string): Promise<boolean> {
    try {
      const favorites = await this.getFavorites();
      const isFavorite = favorites.has(recipeId);
      
      if (isFavorite) {
        favorites.delete(recipeId);
      } else {
        favorites.add(recipeId);
      }
      
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify([...favorites]));
      return !isFavorite; // Return new status
    } catch (error) {
      console.error('Error toggling favorite:', error);
      return false;
    }
  }
}

export const favoritesService = new FavoritesServiceImpl(); 