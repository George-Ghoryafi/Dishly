export interface Ingredient {
  name: string;
  amount: number;
  unit: string; // e.g., 'g', 'ml', 'cup', etc. In the future, this could be an array for multi-unit support.
}

export interface NutritionInfo {
  calories: number;
  carbs: number; // in grams
  protein: number; // in grams
  fat: number; // in grams
}

export interface PreparationStep {
  stepNumber: number;
  title: string;
  instruction: string;
  duration: number; // in minutes
  tips?: string; // Optional cooking tips
}

export interface Recipe {
  id: string;
  name: string;
  cookTime: number; // in minutes
  difficulty: 'Easy' | 'Medium' | 'Hard';
  allergens: Allergen[];
  image: string;
  description: string;
  ingredients: Ingredient[];
  nutrition: NutritionInfo;
  preparationSteps?: PreparationStep[];
}

export interface Allergen {
  type: 'fish' | 'nuts' | 'dairy' | 'gluten' | 'eggs' | 'soy' | 'shellfish';
  icon: string;
}

export interface CompletionCard {
  id: string;
  type: 'completion';
  title: string;
  message: string;
  buttonText: string;
  period: 'today' | 'month';
}

export type CardData = Recipe | CompletionCard; 