import { Recipe } from '../types/Recipe';

export const todaysRecipes: Recipe[] = [
  {
    id: '1',
    name: 'Grilled Salmon with Herbs',
    cookTime: 25,
    difficulty: 'Medium',
    allergens: [
      { type: 'fish', icon: '🐟' }
    ],
    image: 'https://picsum.photos/400/300?random=1',
    description: 'Fresh Atlantic salmon grilled to perfection with aromatic herbs and lemon.'
  },
  {
    id: '2',
    name: 'Creamy Mushroom Pasta',
    cookTime: 20,
    difficulty: 'Easy',
    allergens: [
      { type: 'gluten', icon: '🌾' },
      { type: 'dairy', icon: '🥛' }
    ],
    image: 'https://picsum.photos/400/300?random=2',
    description: 'Rich and creamy pasta with wild mushrooms and parmesan cheese.'
  },
  {
    id: '3',
    name: 'Thai Peanut Chicken',
    cookTime: 30,
    difficulty: 'Medium',
    allergens: [
      { type: 'nuts', icon: '🥜' },
      { type: 'soy', icon: '🫘' }
    ],
    image: 'https://picsum.photos/400/300?random=3',
    description: 'Tender chicken in a spicy peanut sauce with fresh vegetables.'
  },
  {
    id: '4',
    name: 'Classic Caesar Salad',
    cookTime: 15,
    difficulty: 'Easy',
    allergens: [
      { type: 'eggs', icon: '🥚' },
      { type: 'dairy', icon: '🥛' }
    ],
    image: 'https://picsum.photos/400/300?random=4',
    description: 'Crisp romaine lettuce with homemade caesar dressing and croutons.'
  },
  {
    id: '5',
    name: 'Shrimp Scampi',
    cookTime: 18,
    difficulty: 'Medium',
    allergens: [
      { type: 'shellfish', icon: '🦐' },
      { type: 'gluten', icon: '🌾' },
      { type: 'dairy', icon: '🥛' }
    ],
    image: 'https://picsum.photos/400/300?random=5',
    description: 'Succulent shrimp in garlic butter sauce over linguine pasta.'
  }
];

export const monthlyRecipes: Recipe[] = [
  {
    id: '6',
    name: 'Beef Wellington',
    cookTime: 90,
    difficulty: 'Hard',
    allergens: [
      { type: 'gluten', icon: '🌾' },
      { type: 'eggs', icon: '🥚' }
    ],
    image: 'https://picsum.photos/400/300?random=6',
    description: 'Classic British dish with tender beef wrapped in puff pastry with mushroom duxelles.'
  },
  {
    id: '7',
    name: 'Lobster Thermidor',
    cookTime: 45,
    difficulty: 'Hard',
    allergens: [
      { type: 'shellfish', icon: '🦐' },
      { type: 'dairy', icon: '🥛' },
      { type: 'eggs', icon: '🥚' }
    ],
    image: 'https://picsum.photos/400/300?random=7',
    description: 'Luxurious French dish with lobster in a rich, creamy sauce.'
  },
  {
    id: '8',
    name: 'Truffle Risotto',
    cookTime: 35,
    difficulty: 'Medium',
    allergens: [
      { type: 'dairy', icon: '🥛' }
    ],
    image: 'https://picsum.photos/400/300?random=8',
    description: 'Creamy Arborio rice cooked with white wine and finished with truffle oil.'
  },
  {
    id: '9',
    name: 'Duck Confit',
    cookTime: 180,
    difficulty: 'Hard',
    allergens: [],
    image: 'https://picsum.photos/400/300?random=9',
    description: 'Traditional French preparation of duck leg slow-cooked in its own fat.'
  },
  {
    id: '10',
    name: 'Chocolate Soufflé',
    cookTime: 25,
    difficulty: 'Hard',
    allergens: [
      { type: 'eggs', icon: '🥚' },
      { type: 'dairy', icon: '🥛' },
      { type: 'gluten', icon: '🌾' }
    ],
    image: 'https://picsum.photos/400/300?random=10',
    description: 'Light and airy French dessert that rises majestically in the oven.'
  }
];

// Keep the old export for backward compatibility
export const dummyRecipes = todaysRecipes; 