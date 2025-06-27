import { Recipe, CompletionCard, CardData } from '../types/Recipe';

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
    description: 'This stunning grilled salmon dish showcases the natural flavors of fresh Atlantic salmon, expertly seasoned with a carefully curated blend of Mediterranean herbs including rosemary, thyme, and oregano. The fish is grilled over medium-high heat to achieve those perfect char marks while maintaining a tender, flaky interior. Finished with a bright lemon herb butter that melts beautifully over the warm salmon, creating an aromatic and visually appealing presentation. The dish is complemented by roasted seasonal vegetables and served alongside garlic-infused quinoa, making it a complete, nutritious meal that\'s both elegant enough for entertaining and simple enough for a weeknight dinner. Rich in omega-3 fatty acids and high-quality protein, this recipe delivers exceptional flavor while supporting a healthy lifestyle.',
    ingredients: [
      { name: 'Salmon fillets', amount: 4, unit: 'pieces' },
      { name: 'Olive oil', amount: 2, unit: 'tbsp' },
      { name: 'Lemon', amount: 1, unit: 'whole' },
      { name: 'Fresh rosemary', amount: 2, unit: 'sprigs' },
      { name: 'Fresh thyme', amount: 2, unit: 'sprigs' },
      { name: 'Garlic cloves', amount: 3, unit: 'cloves' },
      { name: 'Salt', amount: 1, unit: 'tsp' },
      { name: 'Black pepper', amount: 0.5, unit: 'tsp' },
      { name: 'Butter', amount: 2, unit: 'tbsp' },
      { name: 'Quinoa', amount: 1, unit: 'cup' },
      { name: 'Seasonal vegetables', amount: 2, unit: 'cups' }
    ],
    nutrition: {
      calories: 485,
      carbs: 32,
      protein: 38,
      fat: 22
    },
    preparationSteps: [
      {
        stepNumber: 1,
        title: "Prep & Marinate",
        instruction: "Pat salmon fillets dry and season with salt and pepper. Mince garlic, chop herbs, and zest lemon. Marinate salmon with olive oil, herbs, and garlic for 15 minutes.",
        duration: 15,
        tips: "Room temperature fish cooks more evenly"
      },
      {
        stepNumber: 2,
        title: "Prepare Sides",
        instruction: "Rinse quinoa and cook according to package directions with minced garlic. Cut vegetables into uniform pieces and toss with olive oil, salt, and pepper.",
        duration: 5,
        tips: "Start quinoa first as it takes longest"
      },
      {
        stepNumber: 3,
        title: "Grill Salmon",
        instruction: "Preheat grill to medium-high heat. Grill salmon for 4-5 minutes per side, creating nice char marks. Fish should flake easily when done.",
        duration: 10,
        tips: "Don't flip too early - let it release naturally"
      },
      {
        stepNumber: 4,
        title: "Roast Vegetables",
        instruction: "Roast seasoned vegetables at 425°F for 15-20 minutes until tender and slightly caramelized. Toss halfway through cooking.",
        duration: 20
      },
      {
        stepNumber: 5,
        title: "Finish & Serve",
        instruction: "Make herb butter by mixing softened butter with remaining herbs and lemon juice. Serve salmon over quinoa with roasted vegetables, topped with herb butter.",
        duration: 5,
        tips: "Let salmon rest 2-3 minutes before serving"
      }
    ]
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
    description: 'Indulge in this luxuriously creamy pasta dish that combines the earthy richness of mixed wild mushrooms with perfectly al dente fettuccine. The sauce begins with a foundation of sautéed shallots and garlic, to which we add a medley of crimini, shiitake, and oyster mushrooms, each contributing their unique texture and umami depth. Heavy cream is slowly incorporated to create a velvety sauce that coats each strand of pasta beautifully. Freshly grated Parmigiano-Reggiano cheese adds a sharp, nutty complexity while fresh herbs like parsley and chives provide a bright finish. The dish is elevated with a touch of white wine that\'s reduced to concentrate the flavors, and finished with cracked black pepper and a drizzle of truffle oil for an extra layer of sophistication. This comfort food classic transforms simple ingredients into an restaurant-quality experience that will satisfy even the most discerning palates.',
    ingredients: [
      { name: 'Fettuccine pasta', amount: 400, unit: 'g' },
      { name: 'Mixed mushrooms', amount: 300, unit: 'g' },
      { name: 'Shallots', amount: 2, unit: 'whole' },
      { name: 'Garlic cloves', amount: 3, unit: 'cloves' },
      { name: 'Heavy cream', amount: 1, unit: 'cup' },
      { name: 'Parmesan cheese', amount: 0.5, unit: 'cup' },
      { name: 'Parsley', amount: 2, unit: 'tbsp' },
      { name: 'Chives', amount: 2, unit: 'tbsp' },
      { name: 'White wine', amount: 0.25, unit: 'cup' },
      { name: 'Truffle oil', amount: 1, unit: 'tsp' },
      { name: 'Salt', amount: 1, unit: 'tsp' },
      { name: 'Black pepper', amount: 0.5, unit: 'tsp' }
    ],
    nutrition: {
      calories: 520,
      carbs: 58,
      protein: 18,
      fat: 24
    },
    preparationSteps: [
      {
        stepNumber: 1,
        title: "Prep Ingredients",
        instruction: "Slice mushrooms, mince shallots and garlic. Chop herbs and grate Parmesan cheese. Bring a large pot of salted water to boil for pasta.",
        duration: 10,
        tips: "Slice mushrooms evenly for consistent cooking"
      },
      {
        stepNumber: 2,
        title: "Cook Mushrooms",
        instruction: "Heat olive oil in a large skillet over medium-high heat. Add mushrooms and cook without stirring for 3-4 minutes until golden, then stir and cook 2 more minutes.",
        duration: 7,
        tips: "Don't overcrowd the pan or mushrooms will steam"
      },
      {
        stepNumber: 3,
        title: "Build the Sauce",
        instruction: "Add shallots and garlic to mushrooms, cook 1 minute. Add white wine and let it reduce by half. Pour in cream and simmer until slightly thickened.",
        duration: 8,
        tips: "Let wine cook out completely to avoid harsh flavor"
      },
      {
        stepNumber: 4,
        title: "Cook Pasta",
        instruction: "Cook fettuccine according to package directions until al dente. Reserve 1 cup pasta water before draining.",
        duration: 10
      },
      {
        stepNumber: 5,
        title: "Combine & Finish",
        instruction: "Toss hot pasta with mushroom cream sauce, adding pasta water if needed. Remove from heat, add Parmesan, herbs, and truffle oil. Season and serve immediately.",
        duration: 3,
        tips: "Add cheese off heat to prevent clumping"
      }
    ]
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
    description: 'Experience the vibrant flavors of Southeast Asia with this authentic Thai-inspired chicken dish that perfectly balances sweet, spicy, and savory elements. Tender chicken thighs are marinated in a aromatic blend of lemongrass, ginger, and garlic before being stir-fried to golden perfection. The star of the dish is the rich peanut sauce, made from scratch using natural peanut butter, coconut milk, fish sauce, and palm sugar, creating a complex flavor profile that\'s both familiar and exotic. Fresh vegetables including bell peppers, snap peas, carrots, and bean sprouts add vibrant colors and satisfying crunch, while maintaining their nutrients through quick, high-heat cooking. The dish is finished with fresh cilantro, crushed peanuts, and a squeeze of lime juice that brightens the entire dish. Served over fragrant jasmine rice, this meal transports you to the bustling street markets of Bangkok while providing a complete, balanced dinner that\'s both satisfying and nutritious.',
    ingredients: [
      { name: 'Chicken thighs', amount: 600, unit: 'g' },
      { name: 'Lemongrass', amount: 1, unit: 'stalk' },
      { name: 'Ginger', amount: 2, unit: 'tbsp' },
      { name: 'Garlic cloves', amount: 3, unit: 'cloves' },
      { name: 'Peanut butter', amount: 0.5, unit: 'cup' },
      { name: 'Coconut milk', amount: 1, unit: 'cup' },
      { name: 'Fish sauce', amount: 2, unit: 'tbsp' },
      { name: 'Palm sugar', amount: 1, unit: 'tbsp' },
      { name: 'Bell pepper', amount: 1, unit: 'whole' },
      { name: 'Snap peas', amount: 1, unit: 'cup' },
      { name: 'Carrots', amount: 2, unit: 'whole' },
      { name: 'Bean sprouts', amount: 1, unit: 'cup' },
      { name: 'Cilantro', amount: 0.25, unit: 'cup' },
      { name: 'Peanuts', amount: 0.25, unit: 'cup' },
      { name: 'Lime', amount: 1, unit: 'whole' },
      { name: 'Jasmine rice', amount: 2, unit: 'cups' }
    ],
    nutrition: {
      calories: 445,
      carbs: 28,
      protein: 35,
      fat: 24
    },
    preparationSteps: [
      {
        stepNumber: 1,
        title: "Prep Aromatics",
        instruction: "Mince lemongrass, ginger, and garlic. Cut chicken into bite-sized pieces and marinate with half the aromatics for 15 minutes.",
        duration: 15,
        tips: "Use only the tender inner part of lemongrass"
      },
      {
        stepNumber: 2,
        title: "Make Peanut Sauce",
        instruction: "Whisk together peanut butter, coconut milk, fish sauce, and palm sugar until smooth. Set aside.",
        duration: 5,
        tips: "Warm the sauce gently if it's too thick"
      },
      {
        stepNumber: 3,
        title: "Prep Vegetables",
        instruction: "Cut bell pepper into strips, slice carrots, and prepare snap peas. Keep vegetables separate for stir-frying.",
        duration: 8,
        tips: "Cut vegetables similar sizes for even cooking"
      },
      {
        stepNumber: 4,
        title: "Cook Chicken",
        instruction: "Heat oil in a wok over high heat. Stir-fry marinated chicken until golden and cooked through, about 5-6 minutes.",
        duration: 6,
        tips: "Don't overcrowd the wok - cook in batches if needed"
      },
      {
        stepNumber: 5,
        title: "Stir-Fry & Finish",
        instruction: "Add vegetables to wok and stir-fry for 2-3 minutes. Add peanut sauce and toss to coat. Garnish with cilantro, peanuts, and lime juice. Serve over jasmine rice.",
        duration: 5,
        tips: "Vegetables should remain crisp-tender"
      }
    ]
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
    description: 'This timeless Caesar salad represents the pinnacle of what a simple salad can achieve when executed with attention to detail and quality ingredients. Fresh romaine lettuce hearts are carefully selected for their crisp texture and sweet flavor, then washed and chilled to ensure maximum freshness. The dressing is prepared traditionally, starting with anchovy fillets that are mashed into a paste with garlic, creating the umami foundation that makes this salad so addictive. Raw egg yolk is slowly whisked in along with Dijon mustard, fresh lemon juice, and Worcestershire sauce, creating an emulsion that\'s both creamy and tangy. Extra virgin olive oil is drizzled in slowly while whisking to create the perfect consistency. The salad is finished with house-made croutons that are golden brown and perfectly seasoned, and generous shavings of aged Parmigiano-Reggiano cheese. Each bite delivers the perfect balance of textures and flavors that has made this salad a restaurant staple for decades.',
    ingredients: [
      { name: 'Romaine lettuce', amount: 2, unit: 'heads' },
      { name: 'Anchovy fillets', amount: 4, unit: 'fillets' },
      { name: 'Garlic cloves', amount: 2, unit: 'cloves' },
      { name: 'Egg yolk', amount: 1, unit: 'whole' },
      { name: 'Dijon mustard', amount: 1, unit: 'tsp' },
      { name: 'Lemon juice', amount: 2, unit: 'tbsp' },
      { name: 'Worcestershire sauce', amount: 1, unit: 'tsp' },
      { name: 'Olive oil', amount: 0.5, unit: 'cup' },
      { name: 'Croutons', amount: 1, unit: 'cup' },
      { name: 'Parmesan cheese', amount: 0.5, unit: 'cup' },
      { name: 'Black pepper', amount: 0.25, unit: 'tsp' }
    ],
    nutrition: {
      calories: 320,
      carbs: 12,
      protein: 8,
      fat: 28
    },
    preparationSteps: [
      {
        stepNumber: 1,
        title: "Prep Lettuce",
        instruction: "Wash romaine lettuce thoroughly and dry completely. Tear into bite-sized pieces and chill in refrigerator.",
        duration: 5,
        tips: "Dry lettuce is crucial for dressing adherence"
      },
      {
        stepNumber: 2,
        title: "Make Dressing Base",
        instruction: "Mash anchovy fillets and garlic into a paste using the flat side of a knife. Transfer to a large bowl.",
        duration: 3,
        tips: "A mortar and pestle works great for this step"
      },
      {
        stepNumber: 3,
        title: "Build Emulsion",
        instruction: "Whisk egg yolk, Dijon mustard, lemon juice, and Worcestershire into anchovy paste. Slowly drizzle in olive oil while whisking constantly.",
        duration: 5,
        tips: "Add oil very slowly to prevent breaking"
      },
      {
        stepNumber: 4,
        title: "Assemble Salad",
        instruction: "Add chilled lettuce to dressing bowl and toss gently to coat each leaf. Add croutons and half the Parmesan.",
        duration: 2,
        tips: "Use your hands for the best tossing technique"
      }
    ]
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
    description: 'This elegant Italian-American classic showcases large, succulent shrimp in a luxurious garlic and white wine butter sauce that exemplifies the beauty of simple, high-quality ingredients. Fresh jumbo shrimp are quickly sautéed until just pink and tender, then bathed in a fragrant sauce made from generous amounts of minced garlic, dry white wine, fresh lemon juice, and butter. The sauce is carefully balanced to highlight the natural sweetness of the shrimp while providing rich, aromatic flavors that complement rather than overpower the delicate seafood. Fresh linguine pasta is cooked to perfect al dente texture and tossed with the shrimp and sauce, allowing each strand to be coated in the flavorful butter mixture. The dish is finished with fresh Italian parsley, red pepper flakes for a subtle heat, and a generous squeeze of fresh lemon juice that brightens the entire dish. Served immediately while hot, this restaurant-quality meal brings the sophistication of coastal Italian dining to your home kitchen with surprising ease and consistently impressive results.',
    ingredients: [
      { name: 'Jumbo shrimp', amount: 500, unit: 'g' },
      { name: 'Linguine pasta', amount: 400, unit: 'g' },
      { name: 'Garlic cloves', amount: 4, unit: 'cloves' },
      { name: 'Butter', amount: 4, unit: 'tbsp' },
      { name: 'Olive oil', amount: 2, unit: 'tbsp' },
      { name: 'White wine', amount: 0.5, unit: 'cup' },
      { name: 'Lemon juice', amount: 2, unit: 'tbsp' },
      { name: 'Red pepper flakes', amount: 0.5, unit: 'tsp' },
      { name: 'Parsley', amount: 2, unit: 'tbsp' },
      { name: 'Salt', amount: 1, unit: 'tsp' },
      { name: 'Black pepper', amount: 0.5, unit: 'tsp' }
    ],
    nutrition: {
      calories: 380,
      carbs: 45,
      protein: 28,
      fat: 12
    }
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
    description: 'This legendary British masterpiece represents the pinnacle of culinary achievement, combining a perfectly seared beef tenderloin with layers of rich mushroom duxelles and delicate pâté, all wrapped in golden, buttery puff pastry. The preparation begins with a premium center-cut beef tenderloin that\'s seared to develop a beautiful crust while keeping the interior perfectly rare. The mushroom duxelles is prepared by finely chopping a mixture of wild mushrooms, shallots, and herbs, then cooking them slowly until all moisture has evaporated, creating an intensely flavored mixture that acts as both a flavor enhancer and moisture barrier. The beef is then coated with a layer of pâté de foie gras and wrapped in the mushroom mixture before being encased in buttery puff pastry that\'s been rolled to the perfect thickness. The entire wellington is then egg-washed for a golden finish and baked until the pastry is crispy and the beef reaches the ideal medium-rare temperature. This show-stopping centerpiece requires patience and technique but rewards the ambitious cook with a dish that\'s both visually stunning and incredibly delicious.',
    ingredients: [
      { name: 'Beef tenderloin', amount: 1, unit: 'kg' },
      { name: 'Puff pastry', amount: 500, unit: 'g' },
      { name: 'Mushrooms', amount: 400, unit: 'g' },
      { name: 'Shallots', amount: 2, unit: 'whole' },
      { name: 'Garlic cloves', amount: 3, unit: 'cloves' },
      { name: 'Prosciutto', amount: 8, unit: 'slices' },
      { name: 'Egg yolks', amount: 2, unit: 'whole' },
      { name: 'Dijon mustard', amount: 2, unit: 'tbsp' },
      { name: 'Butter', amount: 2, unit: 'tbsp' },
      { name: 'Olive oil', amount: 2, unit: 'tbsp' },
      { name: 'Salt', amount: 1, unit: 'tsp' },
      { name: 'Black pepper', amount: 1, unit: 'tsp' },
      { name: 'Thyme', amount: 1, unit: 'tbsp' }
    ],
    nutrition: {
      calories: 650,
      carbs: 35,
      protein: 42,
      fat: 38
    }
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
    description: 'This quintessentially French dish represents the height of culinary elegance, featuring succulent lobster meat bathed in a luxurious cognac-infused cream sauce and served in the lobster\'s own shell. The preparation begins with live lobsters that are quickly boiled and then carefully extracted from their shells, ensuring the meat remains tender and sweet. The iconic sauce is a masterful combination of butter, flour, cream, egg yolks, and a generous splash of cognac, creating a rich, velvety base that perfectly complements the delicate lobster meat. The sauce is further enhanced with Dijon mustard, fresh tarragon, and a touch of cayenne pepper for complexity and depth. The lobster meat is gently folded into the sauce along with sautéed mushrooms and shallots, then spooned back into the reserved shells. The dish is topped with a mixture of breadcrumbs and Gruyère cheese, then broiled until golden and bubbling. This restaurant-quality dish transforms simple ingredients into an unforgettable dining experience that embodies the sophistication and technique of classical French cuisine.',
    ingredients: [
      { name: 'Lobster', amount: 2, unit: 'whole' },
      { name: 'Butter', amount: 3, unit: 'tbsp' },
      { name: 'Flour', amount: 2, unit: 'tbsp' },
      { name: 'Heavy cream', amount: 0.5, unit: 'cup' },
      { name: 'Egg yolks', amount: 2, unit: 'whole' },
      { name: 'Cognac', amount: 2, unit: 'tbsp' },
      { name: 'Dijon mustard', amount: 1, unit: 'tsp' },
      { name: 'Tarragon', amount: 1, unit: 'tbsp' },
      { name: 'Cayenne pepper', amount: 0.25, unit: 'tsp' },
      { name: 'Mushrooms', amount: 100, unit: 'g' },
      { name: 'Shallots', amount: 1, unit: 'whole' },
      { name: 'Breadcrumbs', amount: 0.25, unit: 'cup' },
      { name: 'Gruyère cheese', amount: 0.25, unit: 'cup' },
      { name: 'Salt', amount: 0.5, unit: 'tsp' },
      { name: 'Black pepper', amount: 0.25, unit: 'tsp' }
    ],
    nutrition: {
      calories: 420,
      carbs: 8,
      protein: 35,
      fat: 28
    }
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
    description: 'This luxurious Northern Italian classic showcases the prized truffle in all its aromatic glory, combined with perfectly creamy Arborio rice to create a dish that\'s both rustic and refined. The risotto begins with high-quality Arborio rice that\'s gently toasted in butter until translucent, developing a nutty flavor that forms the foundation of the dish. Warm vegetable or mushroom stock is added one ladle at a time, with each addition being stirred constantly until absorbed, a process that releases the rice\'s natural starches and creates the signature creamy texture without any cream. Dry white wine is incorporated early in the cooking process, adding acidity and depth that balances the richness of the finished dish. As the rice nears completion, butter and freshly grated Parmigiano-Reggiano cheese are stirred in to create the mantecatura, the final creamy binding that makes risotto so irresistible. The dish is finished with generous shavings of fresh black truffle or a drizzle of premium truffle oil, whose earthy, intoxicating aroma elevates this simple grain into something truly extraordinary. Each spoonful delivers the perfect balance of creamy texture and intense, earthy flavors that make this dish a favorite among food enthusiasts worldwide.',
    ingredients: [
      { name: 'Arborio rice', amount: 1.5, unit: 'cups' },
      { name: 'Butter', amount: 3, unit: 'tbsp' },
      { name: 'Onion', amount: 1, unit: 'whole' },
      { name: 'Vegetable stock', amount: 4, unit: 'cups' },
      { name: 'White wine', amount: 0.5, unit: 'cup' },
      { name: 'Parmesan cheese', amount: 0.5, unit: 'cup' },
      { name: 'Black truffle', amount: 1, unit: 'whole' },
      { name: 'Truffle oil', amount: 1, unit: 'tbsp' },
      { name: 'Salt', amount: 1, unit: 'tsp' },
      { name: 'Black pepper', amount: 0.5, unit: 'tsp' }
    ],
    nutrition: {
      calories: 385,
      carbs: 52,
      protein: 12,
      fat: 14
    }
  },
  {
    id: '9',
    name: 'Duck Confit',
    cookTime: 180,
    difficulty: 'Hard',
    allergens: [],
    image: 'https://picsum.photos/400/300?random=9',
    description: 'Traditional French preparation of duck leg slow-cooked in its own fat.',
    ingredients: [
      { name: 'Duck legs', amount: 4, unit: 'whole' },
      { name: 'Duck fat', amount: 4, unit: 'cups' },
      { name: 'Garlic cloves', amount: 6, unit: 'cloves' },
      { name: 'Thyme', amount: 2, unit: 'tbsp' },
      { name: 'Salt', amount: 2, unit: 'tbsp' },
      { name: 'Black pepper', amount: 1, unit: 'tsp' },
      { name: 'Bay leaves', amount: 3, unit: 'whole' },
      { name: 'Shallots', amount: 2, unit: 'whole' },
      { name: 'Rosemary', amount: 1, unit: 'tbsp' }
    ],
    nutrition: {
      calories: 485,
      carbs: 2,
      protein: 32,
      fat: 38
    }
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
    description: 'Light and airy French dessert that rises majestically in the oven.',
    ingredients: [
      { name: 'Dark chocolate', amount: 150, unit: 'g' },
      { name: 'Butter', amount: 3, unit: 'tbsp' },
      { name: 'Eggs', amount: 4, unit: 'whole' },
      { name: 'Sugar', amount: 0.5, unit: 'cup' },
      { name: 'Flour', amount: 2, unit: 'tbsp' },
      { name: 'Milk', amount: 0.25, unit: 'cup' },
      { name: 'Salt', amount: 0.25, unit: 'tsp' },
      { name: 'Vanilla extract', amount: 1, unit: 'tsp' }
    ],
    nutrition: {
      calories: 285,
      carbs: 28,
      protein: 8,
      fat: 16
    }
  }
];

// Quick recipes (15 minutes or less) for the Quick Wins section
export const quickWinRecipes: Recipe[] = [
  {
    id: 'q1',
    name: 'Avocado Toast Supreme',
    cookTime: 5,
    difficulty: 'Easy',
    allergens: [
      { type: 'gluten', icon: '🌾' },
      { type: 'nuts', icon: '🥜' }
    ],
    image: 'https://picsum.photos/400/300?random=11',
    description: 'Perfectly ripe avocado on sourdough with everything seasoning and hemp hearts.',
    ingredients: [
      { name: 'Sourdough bread', amount: 2, unit: 'slices' },
      { name: 'Avocado', amount: 1, unit: 'whole' },
      { name: 'Everything seasoning', amount: 1, unit: 'tsp' },
      { name: 'Hemp hearts', amount: 1, unit: 'tbsp' },
      { name: 'Lemon juice', amount: 1, unit: 'tsp' },
      { name: 'Salt', amount: 0.25, unit: 'tsp' },
      { name: 'Black pepper', amount: 0.25, unit: 'tsp' }
    ],
    nutrition: {
      calories: 285,
      carbs: 28,
      protein: 8,
      fat: 18
    }
  },
  {
    id: 'q2',
    name: 'Lightning Stir-Fry',
    cookTime: 12,
    difficulty: 'Easy',
    allergens: [
      { type: 'soy', icon: '🫘' }
    ],
    image: 'https://picsum.photos/400/300?random=12',
    description: 'Quick and colorful vegetable stir-fry with ginger and soy sauce.',
    ingredients: [
      { name: 'Mixed vegetables', amount: 2, unit: 'cups' },
      { name: 'Soy sauce', amount: 2, unit: 'tbsp' },
      { name: 'Ginger', amount: 1, unit: 'tbsp' },
      { name: 'Garlic cloves', amount: 2, unit: 'cloves' },
      { name: 'Vegetable oil', amount: 1, unit: 'tbsp' },
      { name: 'Green onions', amount: 2, unit: 'whole' }
    ],
    nutrition: {
      calories: 125,
      carbs: 18,
      protein: 4,
      fat: 4
    }
  },
  {
    id: 'q3',
    name: 'Microwave Mug Cake',
    cookTime: 3,
    difficulty: 'Easy',
    allergens: [
      { type: 'dairy', icon: '🥛' },
      { type: 'gluten', icon: '🌾' },
      { type: 'eggs', icon: '🥚' }
    ],
    image: 'https://picsum.photos/400/300?random=13',
    description: 'Fluffy chocolate cake made in minutes in your microwave.',
    ingredients: [
      { name: 'Flour', amount: 4, unit: 'tbsp' },
      { name: 'Sugar', amount: 2, unit: 'tbsp' },
      { name: 'Cocoa powder', amount: 1, unit: 'tbsp' },
      { name: 'Milk', amount: 3, unit: 'tbsp' },
      { name: 'Vegetable oil', amount: 1, unit: 'tbsp' },
      { name: 'Egg', amount: 1, unit: 'whole' },
      { name: 'Baking powder', amount: 0.25, unit: 'tsp' }
    ],
    nutrition: {
      calories: 220,
      carbs: 32,
      protein: 6,
      fat: 8
    }
  },
  {
    id: 'q4',
    name: 'Protein Power Smoothie',
    cookTime: 2,
    difficulty: 'Easy',
    allergens: [
      { type: 'dairy', icon: '🥛' },
      { type: 'nuts', icon: '🥜' }
    ],
    image: 'https://picsum.photos/400/300?random=14',
    description: 'Energizing smoothie with banana, protein powder, and almond butter.',
    ingredients: [
      { name: 'Banana', amount: 1, unit: 'whole' },
      { name: 'Protein powder', amount: 1, unit: 'scoop' },
      { name: 'Almond butter', amount: 1, unit: 'tbsp' },
      { name: 'Milk', amount: 1, unit: 'cup' },
      { name: 'Honey', amount: 1, unit: 'tsp' },
      { name: 'Ice cubes', amount: 4, unit: 'pieces' }
    ],
    nutrition: {
      calories: 285,
      carbs: 24,
      protein: 28,
      fat: 8
    }
  },
  {
    id: 'q5',
    name: 'Quick Quesadilla',
    cookTime: 8,
    difficulty: 'Easy',
    allergens: [
      { type: 'dairy', icon: '🥛' },
      { type: 'gluten', icon: '🌾' }
    ],
    image: 'https://picsum.photos/400/300?random=15',
    description: 'Crispy tortilla filled with melted cheese and your favorite fillings.',
    ingredients: [
      { name: 'Flour tortilla', amount: 2, unit: 'whole' },
      { name: 'Cheddar cheese', amount: 0.5, unit: 'cup' },
      { name: 'Salsa', amount: 2, unit: 'tbsp' },
      { name: 'Butter', amount: 1, unit: 'tbsp' },
      { name: 'Black beans', amount: 0.25, unit: 'cup' },
      { name: 'Green onions', amount: 2, unit: 'whole' }
    ],
    nutrition: {
      calories: 385,
      carbs: 32,
      protein: 18,
      fat: 22
    }
  },
  {
    id: 'q6',
    name: 'Instant Ramen Upgrade',
    cookTime: 10,
    difficulty: 'Easy',
    allergens: [
      { type: 'gluten', icon: '🌾' },
      { type: 'soy', icon: '🫘' },
      { type: 'eggs', icon: '🥚' }
    ],
    image: 'https://picsum.photos/400/300?random=16',
    description: 'Transform instant ramen with fresh vegetables, egg, and sriracha.',
    ingredients: [
      { name: 'Instant ramen noodles', amount: 1, unit: 'pack' },
      { name: 'Egg', amount: 1, unit: 'whole' },
      { name: 'Carrot', amount: 0.5, unit: 'cup' },
      { name: 'Spinach', amount: 1, unit: 'cup' },
      { name: 'Sriracha', amount: 1, unit: 'tsp' },
      { name: 'Green onions', amount: 2, unit: 'whole' }
    ],
    nutrition: {
      calories: 245,
      carbs: 38,
      protein: 12,
      fat: 6
    }
  }
];

const todayCompletionCard: CompletionCard = {
  id: 'today-complete',
  type: 'completion',
  title: "You've seen all of today's picks! 🎉",
  message: "Great job exploring today's recommended recipes. Ready to discover more in the full app?",
  buttonText: "Go to Homepage",
  period: 'today'
};

const monthCompletionCard: CompletionCard = {
  id: 'month-complete',
  type: 'completion',
  title: "You've explored this month's favorites! 🌟",
  message: "Amazing! You've seen all our top monthly picks. Let's head to the main app for more culinary adventures.",
  buttonText: "Go to Homepage",
  period: 'month'
};

export const todaysCards: CardData[] = [...todaysRecipes, todayCompletionCard];
export const monthlyCards: CardData[] = [...monthlyRecipes, monthCompletionCard];

// Keep the old export for backward compatibility
export const dummyRecipes = todaysRecipes; 