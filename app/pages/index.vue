<script lang="ts" setup>
const categoryIcons = {
  Pasta: "i-lucide-utensils",
  Asian: "i-lucide-utensils",
  American: "i-lucide-beef",
  Indian: "i-lucide-utensils",
  Desserts: "i-lucide-cake",
  Salads: "i-lucide-leaf",
};

const featuredRecipes = ref<RecipeResponse[]>([
  {
    id: "1",
    title: "Classic Spaghetti Carbonara",
    description: "A traditional Italian pasta dish made with eggs, cheese, pancetta, and pepper.",
    ingredients: [
      { name: "Spaghetti", quantity: "400g" },
      { name: "Eggs", quantity: "4" },
      { name: "Pecorino Romano", quantity: "100g" },
    ],
    steps: ["Cook pasta", "Prepare sauce", "Combine"],
    author: {
      id: "a1",
      firstName: "Marco",
      lastName: "Rossi",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marco",
    },
    tags: ["Italian", "Pasta", "Quick"],
    image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=600",
    cookTime: 30,
    likes: 3,
    views: 1250,
    difficulty: "medium",
    status: "approved",
    category: { id: "c1", name: "Pasta", createdAt: "", updatedAt: "" },
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: "2",
    title: "Khmer Green Curry",
    description: "Aromatic and creamy Khmer curry with vegetables and your choice of protein.",
    ingredients: [
      { name: "Coconut Milk", quantity: "400ml" },
      { name: "Green Curry Paste", quantity: "3 tbsp" },
    ],
    steps: ["Prepare curry paste", "Cook protein", "Add vegetables"],
    author: {
      id: "a2",
      firstName: "Suki",
      lastName: "Tanaka",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Suki",
    },
    tags: ["Khmer", "Curry", "Spicy"],
    image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=600",
    cookTime: 45,
    likes: 2,
    views: 890,
    difficulty: "medium",
    status: "approved",
    category: { id: "c2", name: "Asian", createdAt: "", updatedAt: "" },
    createdAt: "2024-01-10",
    updatedAt: "2024-01-10",
  },
  {
    id: "3",
    title: "Classic Beef Burger",
    description: "Juicy homemade beef burger with all the classic toppings.",
    ingredients: [
      { name: "Ground Beef", quantity: "500g" },
      { name: "Burger Buns", quantity: "4" },
    ],
    steps: ["Form patties", "Grill burgers", "Assemble"],
    author: {
      id: "a3",
      firstName: "John",
      lastName: "Smith",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    },
    tags: ["American", "Grill", "Comfort Food"],
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600",
    cookTime: 25,
    likes: 4,
    views: 2100,
    difficulty: "easy",
    status: "approved",
    category: { id: "c3", name: "American", createdAt: "", updatedAt: "" },
    createdAt: "2024-01-20",
    updatedAt: "2024-01-20",
  },
  {
    id: "4",
    title: "Chicken Tikka Masala",
    description: "Creamy tomato-based curry with tender pieces of marinated chicken.",
    ingredients: [
      { name: "Chicken Breast", quantity: "500g" },
      { name: "Yogurt", quantity: "200g" },
    ],
    steps: ["Marinate chicken", "Grill chicken", "Prepare sauce"],
    author: {
      id: "a4",
      firstName: "Priya",
      lastName: "Patel",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
    },
    tags: ["Indian", "Curry", "Popular"],
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600",
    cookTime: 60,
    likes: 6,
    views: 3200,
    difficulty: "hard",
    status: "approved",
    category: { id: "c4", name: "Indian", createdAt: "", updatedAt: "" },
    createdAt: "2024-01-18",
    updatedAt: "2024-01-18",
  },
]);

const categories = ref<CategoryResponse[]>([
  { id: "c1", name: "Pasta", description: "Italian pasta dishes", createdAt: "", updatedAt: "" },
  { id: "c2", name: "Asian", description: "Asian cuisine", createdAt: "", updatedAt: "" },
  { id: "c3", name: "American", description: "American classics", createdAt: "", updatedAt: "" },
  { id: "c4", name: "Indian", description: "Indian dishes", createdAt: "", updatedAt: "" },
  { id: "c5", name: "Desserts", description: "Sweet treats", createdAt: "", updatedAt: "" },
  { id: "c6", name: "Salads", description: "Fresh and healthy", createdAt: "", updatedAt: "" },
]);

const stats = ref([
  { label: "Recipes", value: "10,000+", icon: "i-lucide-book-open" },
  { label: "Authors", value: "500+", icon: "i-lucide-users" },
  { label: "Categories", value: "50+", icon: "i-lucide-layout-grid" },
  { label: "Happy Cooks", value: "25,000+", icon: "i-lucide-smile" },
]);
</script>

<template>
  <UPage>
    <UPageSection
      title="Discover Delicious Recipes"
      description="Explore thousands of recipes from talented home cooks and professional chefs. Find your
          next favorite dish today."
      :links="[
        {
          label: 'Browse Recipes',
          to: '/recipes',
          trailingIcon: 'i-lucide-search',
        },
        {
          label: 'Start Cooking',
          to: '/auth',
          color: 'neutral',
          variant: 'subtle',
          trailingIcon: 'i-lucide-chef-hat',
        },
      ]"
    />

    <UContainer class="py-16 sm:py-24 lg:py-32 grid grid-cols-2 md:grid-cols-4 gap-6">
      <UCard v-for="stat in stats" :key="stat.label" class="text-center">
        <div class="flex flex-col items-center gap-2">
          <div class="size-12 bg-primary/10 rounded-full flex items-center justify-center">
            <UIcon :name="stat.icon" class="size-6 text-primary" />
          </div>

          <h3 class="text-2xl font-bold">{{ stat.value }}</h3>
          <p class="text-sm text-muted">{{ stat.label }}</p>
        </div>
      </UCard>
    </UContainer>

    <USeparator />

    <UPageSection
      title="Browse Categories"
      description="Find recipes by cuisine type, dietary preferences, and meal categories"
      :links="[
        {
          label: 'View All Categories',
          to: '/categories',
          variant: 'ghost',
          trailingIcon: 'i-lucide-chevron-right',
        },
      ]"
    >
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <NuxtLink
          v-for="category in categories"
          :key="category.id"
          :to="`/recipes?category=${category.id}`"
          class="size-full"
        >
          <UCard
            class="size-full group cursor-pointer hover:ring-2 hover:ring-primary transition-all"
          >
            <div class="flex flex-col items-center gap-3">
              <div
                class="size-12 bg-primary/10 p-3 rounded-full group-hover:bg-primary/20 transition-colors flex items-center justify-center"
              >
                <UIcon
                  :name="
                    categoryIcons[category.name as keyof typeof categoryIcons] ||
                    'i-lucide-utensils'
                  "
                  class="size-6 text-primary"
                />
              </div>

              <h3 class="font-semibold group-hover:text-primary transition-colors">
                {{ category.name }}
              </h3>
              <p class="text-xs text-muted mt-1">{{ category.description }}</p>
            </div>
          </UCard>
        </NuxtLink>
      </div>
    </UPageSection>

    <USeparator />

    <UPageSection
      title="Featured Recipes"
      description="Hand-picked recipes from our community of talented cooks"
      :links="[
        {
          label: 'Explore All Recipes',
          to: '/recipes',
          variant: 'ghost',
          trailingIcon: 'i-lucide-chevron-right',
        },
      ]"
    >
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <RecipeCard v-for="recipe in featuredRecipes" :key="recipe.id" :recipe="recipe" />
      </div>
    </UPageSection>

    <UContainer class="py-16 sm:py-24 lg:py-32">
      <UCard :ui="{ body: 'p-8 md:p-12' }">
        <div class="text-center space-y-6">
          <div class="size-16 mx-auto bg-white/20 rounded-full flex justify-center items-center">
            <UIcon name="i-lucide-chef-hat" class="size-8" />
          </div>
          <div>
            <h2 class="text-3xl font-bold mb-3">Share Your Culinary Creations</h2>
            <p class="text-lg opacity-90 max-w-2xl mx-auto">
              Join our community of food lovers and share your favorite recipes with the world.
              Become an author and inspire others with your culinary creations.
            </p>
          </div>
          <div class="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <UButton to="/auth" color="neutral" variant="solid" size="lg" icon="i-lucide-user-plus">
              Become an Author
            </UButton>
            <UButton to="/recipes" variant="soft" size="lg" trailing-icon="i-lucide-arrow-right">
              Browse Recipes First
            </UButton>
          </div>
        </div>
      </UCard>
    </UContainer>
  </UPage>
</template>
