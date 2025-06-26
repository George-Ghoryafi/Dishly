export interface Recipe {
  id: string;
  name: string;
  cookTime: number; // in minutes
  difficulty: 'Easy' | 'Medium' | 'Hard';
  allergens: Allergen[];
  image: string;
  description: string;
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