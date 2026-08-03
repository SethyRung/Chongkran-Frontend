import { eq, inArray, sql } from "drizzle-orm";
import { db } from "@nuxthub/db";
import { categories, recipeLikes, recipes, user } from "hub:db:schema";

const DEMO_ADMIN = {
  email: "admin@chongkran.com",
  password: "Password123!",
  firstName: "Admin",
  lastName: "User",
  role: "admin" as const,
};

const DEMO_AUTHOR = {
  email: "demo@chongkran.com",
  password: "Password123!",
  firstName: "Demo",
  lastName: "Author",
  role: "author" as const,
};

const CATEGORY_SEEDS = [
  { id: "cat-pasta", name: "Pasta", description: "Italian pasta dishes" },
  { id: "cat-asian", name: "Asian", description: "Pan-Asian favorites" },
  { id: "cat-american", name: "American", description: "American classics" },
  { id: "cat-indian", name: "Indian", description: "Curries, dals, and biryanis" },
  { id: "cat-desserts", name: "Desserts", description: "Sweet treats" },
  { id: "cat-salads", name: "Salads", description: "Fresh and healthy" },
  { id: "cat-soup", name: "Soup", description: "Comforting bowls" },
  { id: "cat-breakfast", name: "Breakfast", description: "Start the day right" },
] as const;

type RecipeSeed = {
  slug: string;
  title: string;
  description: string;
  ingredients: { name: string; quantity: string }[];
  steps: string[];
  tags: string[];
  image: string;
  cookTime: number;
  difficulty: "easy" | "medium" | "hard";
  categoryName: string;
  views: number;
};

const RECIPE_SEEDS: RecipeSeed[] = [
  {
    slug: "spaghetti-carbonara",
    title: "Classic Spaghetti Carbonara",
    description:
      "A traditional Roman pasta — eggs, pecorino, guanciale, and black pepper. No cream, ever.",
    ingredients: [
      { name: "Spaghetti", quantity: "400g" },
      { name: "Guanciale", quantity: "150g" },
      { name: "Egg yolks", quantity: "4" },
      { name: "Pecorino Romano", quantity: "100g" },
      { name: "Black pepper", quantity: "to taste" },
    ],
    steps: [
      "Boil pasta in well-salted water until al dente.",
      "Render guanciale in a cold pan over medium heat until crisp.",
      "Whisk yolks with pecorino and a heavy grind of pepper.",
      "Toss hot pasta with guanciale off heat, then with the yolk mixture.",
      "Plate immediately — residual heat cooks the sauce into a silky glaze.",
    ],
    tags: ["Italian", "Pasta", "Quick", "Comfort Food"],
    image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=600",
    cookTime: 30,
    difficulty: "medium",
    categoryName: "Pasta",
    views: 4250,
  },
  {
    slug: "khmer-green-curry",
    title: "Khmer Green Curry",
    description:
      "Aromatic Cambodian curry with coconut milk, lemongrass, and makrut lime. Lighter than its Thai cousin.",
    ingredients: [
      { name: "Coconut milk", quantity: "400ml" },
      { name: "Green curry paste", quantity: "3 tbsp" },
      { name: "Chicken thigh", quantity: "500g" },
      { name: "Eggplant (Thai)", quantity: "200g" },
      { name: "Fish sauce", quantity: "2 tbsp" },
      { name: "Palm sugar", quantity: "1 tbsp" },
    ],
    steps: [
      "Fry curry paste in a splash of coconut cream until fragrant.",
      "Add chicken and brown lightly.",
      "Pour in remaining coconut milk and bring to a simmer.",
      "Add eggplant and cook until tender.",
      "Season with fish sauce and palm sugar. Serve with jasmine rice.",
    ],
    tags: ["Khmer", "Curry", "Spicy", "Coconut"],
    image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=600",
    cookTime: 45,
    difficulty: "medium",
    categoryName: "Asian",
    views: 3120,
  },
  {
    slug: "classic-beef-burger",
    title: "Classic Beef Burger",
    description:
      "Juicy smashed patties on a toasted brioche bun with all the fixings. Cooked on a screaming-hot cast iron.",
    ingredients: [
      { name: "Ground beef (80/20)", quantity: "500g" },
      { name: "Burger buns", quantity: "4" },
      { name: "American cheese", quantity: "4 slices" },
      { name: "Onion", quantity: "1, sliced" },
      { name: "Lettuce", quantity: "4 leaves" },
      { name: "Tomato", quantity: "1, sliced" },
    ],
    steps: [
      "Form loose patties — don't compact the meat.",
      "Heat cast iron until smoking. Smash patties flat and season with salt.",
      "Cook 2 minutes, flip, add cheese, cover to melt.",
      "Toast buns in beef fat.",
      "Assemble: bottom bun, sauce, lettuce, patty, tomato, onion, top bun.",
    ],
    tags: ["American", "Grill", "Quick", "Comfort Food"],
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600",
    cookTime: 25,
    difficulty: "easy",
    categoryName: "American",
    views: 2890,
  },
  {
    slug: "chicken-tikka-masala",
    title: "Chicken Tikka Masala",
    description:
      "Tandoori-marinated chicken in a creamy tomato sauce. National dish of the UK, soul food of the diaspora.",
    ingredients: [
      { name: "Chicken breast", quantity: "500g" },
      { name: "Greek yogurt", quantity: "200g" },
      { name: "Tomato passata", quantity: "400ml" },
      { name: "Heavy cream", quantity: "150ml" },
      { name: "Garam masala", quantity: "2 tbsp" },
      { name: "Ginger", quantity: "thumb-sized" },
    ],
    steps: [
      "Marinate chicken in yogurt, garam masala, and salt for at least 1 hour.",
      "Grill or broil chicken until charred at the edges.",
      "Bloom spices in oil, add ginger and garlic.",
      "Pour in tomato passata and simmer 10 minutes.",
      "Stir in cream and grilled chicken. Finish with kasuri methi.",
    ],
    tags: ["Indian", "Curry", "Spicy", "Popular"],
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600",
    cookTime: 60,
    difficulty: "hard",
    categoryName: "Indian",
    views: 5640,
  },
  {
    slug: "creamy-tomato-bisque",
    title: "Creamy Tomato Bisque",
    description: "Roasted tomatoes blended with cream and basil. The grilled cheese's best friend.",
    ingredients: [
      { name: "Roma tomatoes", quantity: "1.5kg" },
      { name: "Heavy cream", quantity: "200ml" },
      { name: "Onion", quantity: "1" },
      { name: "Garlic", quantity: "4 cloves" },
      { name: "Fresh basil", quantity: "1 handful" },
    ],
    steps: [
      "Halve tomatoes, drizzle with olive oil, roast at 200°C for 40 minutes.",
      "Sauté onion and garlic until soft.",
      "Add roasted tomatoes (with their juices) and any fresh basil stems.",
      "Simmer 15 minutes, then blend smooth.",
      "Stir in cream, season aggressively with salt and sugar to balance acidity.",
    ],
    tags: ["Comfort Food", "Vegetarian", "Quick"],
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=600",
    cookTime: 60,
    difficulty: "easy",
    categoryName: "Soup",
    views: 1820,
  },
  {
    slug: "caesar-salad",
    title: "Proper Caesar Salad",
    description:
      "Crisp romaine, garlicky croutons, real anchovies, and a dressing you whisk by hand. None of that bottled stuff.",
    ingredients: [
      { name: "Romaine hearts", quantity: "3" },
      { name: "Sourdough bread", quantity: "200g, cubed" },
      { name: "Anchovy fillets", quantity: "6" },
      { name: "Parmigiano Reggiano", quantity: "80g" },
      { name: "Lemon", quantity: "1" },
      { name: "Egg yolk", quantity: "1" },
    ],
    steps: [
      "Toss bread cubes with oil and garlic, bake at 200°C until crisp.",
      "Mash anchovies with garlic into a paste.",
      "Whisk in egg yolk, lemon juice, and a glug of olive oil until emulsified.",
      "Tear romaine, toss with dressing, croutons, and shaved parmesan.",
    ],
    tags: ["Salad", "Quick", "Classic"],
    image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=600",
    cookTime: 25,
    difficulty: "easy",
    categoryName: "Salads",
    views: 1490,
  },
  {
    slug: "chocolate-chip-cookies",
    title: "Brown-Butter Chocolate Chip Cookies",
    description:
      "Crispy edges, gooey centers. The brown butter does the heavy lifting — nutty, deep, and complex.",
    ingredients: [
      { name: "Butter", quantity: "230g" },
      { name: "Brown sugar", quantity: "200g" },
      { name: "White sugar", quantity: "100g" },
      { name: "Eggs", quantity: "2" },
      { name: "Flour", quantity: "280g" },
      { name: "Dark chocolate", quantity: "200g, chopped" },
      { name: "Flaky sea salt", quantity: "to taste" },
    ],
    steps: [
      "Brown the butter until it smells like hazelnuts. Cool slightly.",
      "Whisk in both sugars, then eggs one at a time.",
      "Fold in flour and a pinch of salt. Rest 30 minutes.",
      "Scoop onto trays, press in chocolate chunks.",
      "Bake at 180°C for 11 minutes. Sprinkle with flaky salt. Underbake on purpose.",
    ],
    tags: ["Dessert", "Baking", "Comfort Food"],
    image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600",
    cookTime: 45,
    difficulty: "easy",
    categoryName: "Desserts",
    views: 3970,
  },
  {
    slug: "shakshuka",
    title: "Shakshuka",
    description:
      "Eggs poached in spiced tomato sauce. Brunch, dinner, midnight snack — any time, really.",
    ingredients: [
      { name: "Crushed tomatoes", quantity: "800g" },
      { name: "Eggs", quantity: "6" },
      { name: "Red bell pepper", quantity: "2" },
      { name: "Onion", quantity: "1" },
      { name: "Cumin", quantity: "1 tsp" },
      { name: "Smoked paprika", quantity: "1 tsp" },
      { name: "Feta", quantity: "100g" },
    ],
    steps: [
      "Sauté onion and pepper until soft and a bit charred at edges.",
      "Add garlic, cumin, and paprika. Toast 30 seconds.",
      "Pour in tomatoes, simmer until thick.",
      "Make wells, crack eggs in. Cover and cook until whites set, yolks runny.",
      "Crumble feta on top. Serve with crusty bread.",
    ],
    tags: ["Middle Eastern", "Brunch", "Vegetarian", "Spicy"],
    image: "https://images.unsplash.com/photo-1590412200988-a436970781fa?w=600",
    cookTime: 35,
    difficulty: "easy",
    categoryName: "Breakfast",
    views: 2210,
  },
  {
    slug: "pho-bo",
    title: "Beef Pho",
    description:
      "Vietnamese rice noodle soup with star anise, cinnamon, and charred ginger. A 24-hour commitment, easily.",
    ingredients: [
      { name: "Beef bones", quantity: "2kg" },
      { name: "Rice noodles", quantity: "300g" },
      { name: "Onion", quantity: "1, charred" },
      { name: "Ginger", quantity: "thumb, charred" },
      { name: "Star anise", quantity: "4" },
      { name: "Cinnamon stick", quantity: "1" },
      { name: "Thinly sliced beef", quantity: "200g" },
    ],
    steps: [
      "Roast bones at 220°C for 45 minutes until deeply browned.",
      "Simmer bones with charred aromatics and spices for at least 6 hours.",
      "Strain and season broth with fish sauce and rock sugar.",
      "Cook noodles, assemble in bowls with raw sliced beef on top.",
      "Ladle boiling broth over beef — the heat cooks it instantly. Garnish with herbs.",
    ],
    tags: ["Vietnamese", "Soup", "Comfort Food"],
    image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=600",
    cookTime: 360,
    difficulty: "hard",
    categoryName: "Soup",
    views: 1340,
  },
  {
    slug: "miso-glazed-salmon",
    title: "Miso-Glazed Salmon",
    description:
      "Sweet-savory glaze caramelizes under the broiler. Ready in 20 minutes, looks like restaurant food.",
    ingredients: [
      { name: "Salmon fillets", quantity: "4" },
      { name: "White miso", quantity: "3 tbsp" },
      { name: "Mirin", quantity: "2 tbsp" },
      { name: "Sake", quantity: "2 tbsp" },
      { name: "Brown sugar", quantity: "1 tbsp" },
    ],
    steps: [
      "Whisk miso, mirin, sake, and sugar into a paste.",
      "Coat salmon, rest 15 minutes (or up to overnight).",
      "Broil 6 inches from heat for 8-10 minutes.",
      "Watch closely — sugar burns fast. Brush with extra glaze mid-way.",
    ],
    tags: ["Japanese", "Seafood", "Quick", "Healthy"],
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600",
    cookTime: 25,
    difficulty: "easy",
    categoryName: "Asian",
    views: 980,
  },
  {
    slug: "avocado-toast",
    title: "Smashed Avocado Toast",
    description: "Sourdough, ripe avocado, lemon, flaky salt. Sometimes the simplest thing is the right thing.",
    ingredients: [
      { name: "Sourdough bread", quantity: "2 thick slices" },
      { name: "Ripe avocado", quantity: "1" },
      { name: "Lemon", quantity: "1/2" },
      { name: "Chili flakes", quantity: "pinch" },
      { name: "Flaky sea salt", quantity: "to taste" },
      { name: "Olive oil", quantity: "drizzle" },
    ],
    steps: [
      "Toast bread until deeply golden.",
      "Smash avocado with lemon juice and salt — leave it chunky.",
      "Pile on toast.",
      "Drizzle olive oil, hit with chili flakes and more flaky salt.",
    ],
    tags: ["Breakfast", "Quick", "Healthy", "Vegetarian"],
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600",
    cookTime: 10,
    difficulty: "easy",
    categoryName: "Breakfast",
    views: 720,
  },
];

const AUTHOR_SEEDS = [
  {
    email: "author1@chongkran.com",
    firstName: "Suki",
    lastName: "Tanaka",
    bio: "Half-Japanese, half-Khmer. I cook the food I grew up eating.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Suki",
  },
  {
    email: "author2@chongkran.com",
    firstName: "Marco",
    lastName: "Rossi",
    bio: "Roman by birth, opinionated about pasta.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marco",
  },
  {
    email: "author3@chongkran.com",
    firstName: "Priya",
    lastName: "Patel",
    bio: "Home cook, recipe developer, forever testing daals.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
  },
] as const;

/**
 * Seed task for database initialization.
 *
 * Creates demo accounts, then seeds a curated set of categories and recipes
 * so the public surfaces (home page, recipes listing, etc.) have meaningful
 * data on first run. Idempotent: re-running skips rows that already exist.
 */
export default defineTask({
  meta: {
    name: "db:seed",
    description: "Seed demo users, categories, and recipes",
  },
  async run() {
    console.log("🌱 Starting database seed...");

    try {
      await seedUser(DEMO_ADMIN);
      await seedUser({ ...DEMO_AUTHOR, role: "author" });

      const authors = await Promise.all(
        AUTHOR_SEEDS.map(async (a) => seedAuthorAccount(a)),
      );
      const allAuthors = [DEMO_AUTHOR, ...authors].filter(Boolean);

      await seedCategories();
      const categoryIds = await resolveCategoryIds();
      await seedRecipes(allAuthors, categoryIds);

      console.log("Seed completed successfully!");
      return { result: "Seed completed successfully" };
    } catch (error) {
      console.error("Seed failed:", error);
      return { result: "Seed failed", error: String(error) };
    }
  },
});

async function seedUser(seed: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: "admin" | "author" | "user";
}): Promise<void> {
  const existing = await db.query.user.findFirst({
    where: eq(user.email, seed.email),
  });

  if (existing) {
    const updates: Partial<typeof existing> = {};
    if (existing.role !== seed.role) updates.role = seed.role;
    if (existing.firstName !== seed.firstName) updates.firstName = seed.firstName;
    if (existing.lastName !== seed.lastName) updates.lastName = seed.lastName;
    if (!existing.emailVerified) updates.emailVerified = true;

    if (Object.keys(updates).length > 0) {
      await db.update(user).set(updates).where(eq(user.id, existing.id));
      console.log(`Updated ${seed.email}: ${Object.keys(updates).join(", ")}`);
    } else {
      console.log(`User already exists: ${seed.email}`);
    }
    return;
  }

  const auth = serverAuth();
  const result = await auth.api.signUpEmail({
    body: {
      email: seed.email,
      password: seed.password,
      name: `${seed.firstName} ${seed.lastName}`.trim(),
    },
  });

  await db
    .update(user)
    .set({
      role: seed.role,
      firstName: seed.firstName,
      lastName: seed.lastName,
      emailVerified: true,
    })
    .where(eq(user.id, result.user.id));

  console.log(`Created ${seed.role} user: ${seed.email} (password: ${seed.password})`);
}

async function seedAuthorAccount(seed: {
  email: string;
  firstName: string;
  lastName: string;
  bio: string;
  avatar: string;
}): Promise<{ email: string; id: string } | null> {
  const existing = await db.query.user.findFirst({
    where: eq(user.email, seed.email),
  });
  if (existing) {
    await db
      .update(user)
      .set({
        role: "author",
        firstName: seed.firstName,
        lastName: seed.lastName,
        bio: seed.bio,
        image: seed.avatar,
        emailVerified: true,
      })
      .where(eq(user.id, existing.id));
    console.log(`Author already exists, refreshed: ${seed.email}`);
    return { email: seed.email, id: existing.id };
  }

  const auth = serverAuth();
  const result = await auth.api.signUpEmail({
    body: {
      email: seed.email,
      password: "Password123!",
      name: `${seed.firstName} ${seed.lastName}`.trim(),
    },
  });

  await db
    .update(user)
    .set({
      role: "author",
      firstName: seed.firstName,
      lastName: seed.lastName,
      bio: seed.bio,
      image: seed.avatar,
      emailVerified: true,
    })
    .where(eq(user.id, result.user.id));

  console.log(`Created author: ${seed.email} (password: Password123!)`);
  return { email: seed.email, id: result.user.id };
}

async function seedCategories(): Promise<Map<string, string>> {
  const idByName = new Map<string, string>();
  for (const cat of CATEGORY_SEEDS) {
    const existing = await db.query.categories.findFirst({
      where: eq(categories.name, cat.name),
    });
    if (existing) {
      idByName.set(cat.name, existing.id);
      continue;
    }
    await db.insert(categories).values({
      id: cat.id,
      name: cat.name,
      description: cat.description,
    });
    idByName.set(cat.name, cat.id);
    console.log(`Created category: ${cat.name}`);
  }
  return idByName;
}

async function seedRecipes(
  authors: { email: string; firstName?: string; lastName?: string; id?: string }[],
  categoryIds: Map<string, string>,
): Promise<void> {
  const authorRecords = await db.query.user.findMany({
    where: (u, { inArray: inOp }) => inOp(u.role, ["admin", "author"]),
  });
  if (authorRecords.length === 0) {
    console.warn("No authors available — skipping recipe seed.");
    return;
  }

  await cleanupRetiredRecipes();

  for (let i = 0; i < RECIPE_SEEDS.length; i++) {
    const seed = RECIPE_SEEDS[i];
    const existing = await db.query.recipes.findFirst({
      where: eq(recipes.id, `recipe-${seed.slug}`),
    });
    if (existing) continue;

    const author = authorRecords[i % authorRecords.length]!;
    const categoryId = categoryIds.get(seed.categoryName);
    if (!categoryId) {
      console.warn(`Category "${seed.categoryName}" not found — skipping ${seed.slug}`);
      continue;
    }

    await db.insert(recipes).values({
      id: `recipe-${seed.slug}`,
      title: seed.title,
      description: seed.description,
      ingredients: seed.ingredients,
      steps: seed.steps,
      author: author.id,
      authorName: `${author.firstName} ${author.lastName}`.trim(),
      authorAvatar: author.image ?? undefined,
      authorBio: author.bio ?? undefined,
      tags: [...seed.tags],
      image: seed.image,
      cookTime: seed.cookTime,
      views: seed.views,
      difficulty: seed.difficulty,
      status: "approved",
      category: categoryId,
    });

    const likeCount = Math.min(Math.floor(seed.views / 1500), authorRecords.length - 1);
    for (let j = 0; j < likeCount; j++) {
      const liker = authorRecords[(i + j + 1) % authorRecords.length]!;
      if (liker.id === author.id) continue;
      await db
        .insert(recipeLikes)
        .values({ recipeId: `recipe-${seed.slug}`, userId: liker.id })
        .onConflictDoNothing();
    }

    console.log(
      `Created recipe: ${seed.title} (views=${seed.views}, likes=${likeCount})`,
    );
  }

  void authors;
}

async function cleanupRetiredRecipes(): Promise<void> {
  const activeSlugs = new Set(RECIPE_SEEDS.map((s) => `recipe-${s.slug}`));
  const seeded = await db
    .select({ id: recipes.id })
    .from(recipes)
    .where(sql`${recipes.id} LIKE 'recipe-%'`);
  const retired = seeded
    .map((r) => r.id)
    .filter((id) => !activeSlugs.has(id));
  if (retired.length === 0) return;

  await db.delete(recipeLikes).where(inArray(recipeLikes.recipeId, retired));
  await db.delete(recipes).where(inArray(recipes.id, retired));
  console.log(`Removed retired recipes: ${retired.join(", ")}`);
}

async function resolveCategoryIds(): Promise<Map<string, string>> {
  const all = await db.query.categories.findMany({
    where: eq(categories.isDeleted, false),
  });
  const map = new Map<string, string>();
  for (const row of all) map.set(row.name, row.id);
  return map;
}
