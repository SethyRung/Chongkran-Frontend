<script lang="ts" setup>
const route = useRoute();
const router = useRouter();

const categoryId = route.params.id as string;

const searchQuery = ref((route.query.search as string) || "");
const selectedDifficulty = ref((route.query.difficulty as string) || "");
const currentPage = ref(Number(route.query.page) || 1);

const difficultyOptions = [
  { value: "all", label: "All Difficulties" },
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "popular", label: "Most Viewed" },
  { value: "liked", label: "Most Liked" },
];

const selectedSort = ref((route.query.sort as string) || "newest");

const category = ref<CategoryResponse | null>({
  id: categoryId,
  name: "Pasta",
  description:
    "Italian pasta dishes from classic spaghetti to creative modern recipes. Explore traditional recipes from various regions of Italy as well as modern fusion dishes.",
  createdAt: "2024-01-01",
  updatedAt: "2024-01-01",
});

const categoriesWithNames: Record<string, { name: string; description: string; image: string }> = {
  c1: {
    name: "Pasta",
    description:
      "Italian pasta dishes from classic spaghetti to creative modern recipes. Explore traditional recipes from various regions of Italy as well as modern fusion dishes.",
    image: "https://images.unsplash.com/photo-1593423325289-3728834164c4?w=1200",
  },
  c2: {
    name: "Asian",
    description:
      "Flavors from across Asia including Thai, Chinese, Japanese, and Khmer cuisine. Discover aromatic curries, stir-fries, noodles, and more.",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=1200",
  },
  c3: {
    name: "American",
    description:
      "Classic American comfort food and modern favorites. From burgers and BBQ to hearty casseroles and Southern classics.",
    image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=1200",
  },
  c4: {
    name: "Indian",
    description:
      "Rich and aromatic Indian curries, biryanis, and traditional dishes. Explore the diverse regional cuisines of India.",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=1200",
  },
  c5: {
    name: "Desserts",
    description:
      "Sweet treats from cakes and cookies to puddings and pastries. Indulge in delicious desserts from around the world.",
    image: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=1200",
  },
  c6: {
    name: "Healthy",
    description:
      "Nutritious recipes for a balanced lifestyle without sacrificing flavor. Fresh ingredients and wholesome meals.",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1200",
  },
  c7: {
    name: "Quick & Easy",
    description:
      "Simple recipes ready in 30 minutes or less for busy days. Great flavors without the time commitment.",
    image: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=1200",
  },
  c8: {
    name: "Vegetarian",
    description:
      "Plant-based recipes full of flavor and creativity. Delicious meat-free options for every meal.",
    image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=1200",
  },
};

const categoryInfo = computed(() => categoriesWithNames[categoryId] || categoriesWithNames.c1);

const allRecipes = ref<RecipeResponse[]>([
  {
    id: "1",
    title: "Classic Spaghetti Carbonara",
    description: "A traditional Italian pasta dish made with eggs, cheese, pancetta, and pepper.",
    ingredients: [],
    steps: [],
    author: {
      id: "a1",
      firstName: "Marco",
      lastName: "Rossi",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marco",
    },
    tags: ["Italian", "Pasta"],
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
    id: "7",
    title: "Creamy Fettuccine Alfredo",
    description: "Rich and creamy pasta with parmesan cheese and butter.",
    ingredients: [],
    steps: [],
    author: {
      id: "a1",
      firstName: "Marco",
      lastName: "Rossi",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marco",
    },
    tags: ["Italian", "Creamy"],
    image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=600",
    cookTime: 25,
    likes: 2,
    views: 980,
    difficulty: "easy",
    status: "approved",
    category: { id: "c1", name: "Pasta", createdAt: "", updatedAt: "" },
    createdAt: "2024-01-10",
    updatedAt: "2024-01-10",
  },
  {
    id: "8",
    title: "Penne Arrabbiata",
    description: "Spicy pasta with garlic, tomatoes, and red chili peppers.",
    ingredients: [],
    steps: [],
    author: {
      id: "a5",
      firstName: "Giulia",
      lastName: "Bianchi",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Giulia",
    },
    tags: ["Italian", "Spicy"],
    image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=600",
    cookTime: 20,
    likes: 3,
    views: 1450,
    difficulty: "easy",
    status: "approved",
    category: { id: "c1", name: "Pasta", createdAt: "", updatedAt: "" },
    createdAt: "2024-01-20",
    updatedAt: "2024-01-20",
  },
  {
    id: "9",
    title: "Lasagna Bolognese",
    description: "Layered pasta with rich meat ragù, béchamel, and parmesan.",
    ingredients: [],
    steps: [],
    author: {
      id: "a1",
      firstName: "Marco",
      lastName: "Rossi",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marco",
    },
    tags: ["Italian", "Bake"],
    image: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=600",
    cookTime: 90,
    likes: 7,
    views: 2800,
    difficulty: "hard",
    status: "approved",
    category: { id: "c1", name: "Pasta", createdAt: "", updatedAt: "" },
    createdAt: "2024-01-05",
    updatedAt: "2024-01-05",
  },
  {
    id: "10",
    title: "Gnocchi with Pesto",
    description: "Soft potato dumplings with fresh basil pesto and pine nuts.",
    ingredients: [],
    steps: [],
    author: {
      id: "a5",
      firstName: "Giulia",
      lastName: "Bianchi",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Giulia",
    },
    tags: ["Italian", "Vegetarian"],
    image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600",
    cookTime: 35,
    likes: 3,
    views: 1100,
    difficulty: "medium",
    status: "approved",
    category: { id: "c1", name: "Pasta", createdAt: "", updatedAt: "" },
    createdAt: "2024-01-25",
    updatedAt: "2024-01-25",
  },
  {
    id: "11",
    title: "Ravioli with Ricotta and Spinach",
    description: "Handmade pasta filled with ricotta cheese and fresh spinach.",
    ingredients: [],
    steps: [],
    author: {
      id: "a6",
      firstName: "Elena",
      lastName: "Romano",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena",
    },
    tags: ["Italian", "Handmade"],
    image: "https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=600",
    cookTime: 60,
    likes: 5,
    views: 1650,
    difficulty: "hard",
    status: "approved",
    category: { id: "c1", name: "Pasta", createdAt: "", updatedAt: "" },
    createdAt: "2024-01-18",
    updatedAt: "2024-01-18",
  },
]);

const filteredRecipes = computed(() => {
  let recipes = [...allRecipes.value];

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    recipes = recipes.filter(
      (r) =>
        r.title.toLowerCase().includes(query) ||
        (r.description ?? "").toLowerCase().includes(query),
    );
  }

  if (selectedDifficulty.value && selectedDifficulty.value !== "all") {
    recipes = recipes.filter((r) => r.difficulty === selectedDifficulty.value);
  }

  switch (selectedSort.value) {
    case "newest":
      recipes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    case "oldest":
      recipes.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      break;
    case "popular":
      recipes.sort((a, b) => (b.views ?? 0) - (a.views ?? 0));
      break;
    case "liked":
      recipes.sort((a, b) => (b.likes || 0) - (a.likes || 0));
      break;
  }

  return recipes;
});

const itemsPerPage = 9;
const totalPages = computed(() => Math.ceil(filteredRecipes.value.length / itemsPerPage));
const paginatedRecipes = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredRecipes.value.slice(start, start + itemsPerPage);
});

function updateFilters() {
  const query: Record<string, string> = {};
  if (searchQuery.value) query.search = searchQuery.value;
  if (selectedDifficulty.value && selectedDifficulty.value !== "all")
    query.difficulty = selectedDifficulty.value;
  if (selectedSort.value !== "newest") query.sort = selectedSort.value;
  if (currentPage.value > 1) query.page = currentPage.value.toString();

  void router.push({ query });
}

function clearFilters() {
  searchQuery.value = "";
  selectedDifficulty.value = "";
  selectedSort.value = "newest";
  currentPage.value = 1;
  updateFilters();
}

watch([searchQuery, selectedDifficulty, selectedSort], () => {
  currentPage.value = 1;
  updateFilters();
});

watch(currentPage, updateFilters);
</script>

<template>
  <UPage>
    <div>
      <div class="relative h-64 md:h-80 overflow-hidden">
        <img :src="categoryInfo?.image" :alt="category?.name" class="h-full w-full object-cover" />
        <div class="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
        <UContainer class="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div class="flex items-center gap-2 mb-3">
            <UButton
              icon="i-lucide-arrow-left"
              label="Back to Categories"
              variant="ghost"
              to="/categories"
            />
          </div>
          <h1 class="text-3xl md:text-4xl font-bold text-white mb-2">
            {{ category?.name }}
          </h1>
          <p class="text-white/80 max-w-2xl">
            {{ category?.description }}
          </p>
        </UContainer>
      </div>
    </div>

    <UContainer class="py-8">
      <div class="flex flex-col md:flex-row gap-4 mb-8">
        <UInput
          v-model="searchQuery"
          icon="i-lucide-search"
          placeholder="Search in this category..."
          class="flex-1"
        />

        <USelectMenu
          v-model="selectedDifficulty"
          :items="difficultyOptions"
          placeholder="Difficulty"
          value-key="value"
          class="w-full md:w-40"
        />

        <USelectMenu
          v-model="selectedSort"
          :items="sortOptions"
          placeholder="Sort by"
          value-key="value"
          class="w-full md:w-48"
        />

        <UButton
          v-if="searchQuery || selectedDifficulty || selectedSort !== 'newest'"
          label="Clear"
          variant="subtle"
          icon="i-lucide-x"
          @click="clearFilters"
        />
      </div>

      <div class="flex items-center justify-between mb-6">
        <p class="text-sm text-muted">
          {{ filteredRecipes.length }} recipe{{ filteredRecipes.length !== 1 ? "s" : "" }} in
          {{ category?.name }}
        </p>

        <USelectMenu
          v-model="selectedSort"
          :items="sortOptions"
          placeholder="Sort"
          value-key="value"
          size="sm"
          variant="ghost"
          class="hidden md:flex"
        />
      </div>

      <div
        v-if="paginatedRecipes.length > 0"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <RecipeCard v-for="recipe in paginatedRecipes" :key="recipe.id" :recipe="recipe" />
      </div>

      <div v-else class="text-center py-16">
        <UIcon name="i-lucide-search" class="size-12 mx-auto mb-4 text-muted" />
        <h3 class="text-lg font-medium mb-2">No recipes found</h3>
        <p class="text-muted mb-4">Try adjusting your search or filters</p>
        <UButton label="Clear Filters" variant="outline" @click="clearFilters" />
      </div>

      <div v-if="totalPages > 1" class="flex justify-center mt-8">
        <UPagination
          v-model="currentPage"
          :total="filteredRecipes.length"
          :page-size="itemsPerPage"
        />
      </div>
    </UContainer>
  </UPage>
</template>
