<script lang="ts" setup>
const route = useRoute();
const router = useRouter();
const { user } = useUserSession();

const searchQuery = ref((route.query.search as string) || "");
const selectedCategory = ref((route.query.category as string) || "");
const selectedDifficulty = ref((route.query.difficulty as string) || "");
const currentPage = ref(Number(route.query.page) || 1);

const { data: categoriesRes } = await useFetchApi<ApiResponse<Category[]>>("/api/categories", {
  query: { offset: 0, limit: 100 },
});
const categories = computed(() => categoriesRes.value?.data ?? []);

const {
  data: recipesRes,
  pending: recipesPending,
  refresh: refreshRecipes,
} = await useFetchApi<ApiResponse<Recipe[]>>("/api/recipes", {
  query: { offset: 0, limit: 100 },
});

const allRecipes = computed(() => {
  const data = recipesRes.value?.data ?? [];
  return data.filter((r) => r.status === "approved");
});

const difficultyOptions = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];

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

  if (selectedCategory.value) {
    recipes = recipes.filter((r) => {
      const catId = typeof r.category === "string" ? r.category : r.category.id;
      return catId === selectedCategory.value;
    });
  }

  if (selectedDifficulty.value) {
    recipes = recipes.filter((r) => r.difficulty === selectedDifficulty.value);
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
  if (selectedCategory.value) query.category = selectedCategory.value;
  if (selectedDifficulty.value) query.difficulty = selectedDifficulty.value;
  if (currentPage.value > 1) query.page = currentPage.value.toString();

  void router.push({ query });
}

function clearFilters() {
  searchQuery.value = "";
  selectedCategory.value = "";
  selectedDifficulty.value = "";
  currentPage.value = 1;
  updateFilters();
}

watch([searchQuery, selectedCategory, selectedDifficulty], () => {
  currentPage.value = 1;
  updateFilters();
});

watch(currentPage, updateFilters);
</script>

<template>
  <UPage>
    <UContainer class="py-8">
      <div class="mb-8 flex items-start justify-between">
        <div>
          <h1 class="text-3xl font-bold mb-2">All Recipes</h1>
          <p class="text-muted">Discover delicious recipes from our community</p>
        </div>

        <CreateRecipeModal>
          <UButton
            v-if="user?.role === 'admin' || user?.role === 'author'"
            label="Create Recipe"
            icon="i-lucide-plus"
          />
        </CreateRecipeModal>
      </div>

      <div class="flex flex-col md:flex-row gap-4 mb-8">
        <UInput
          v-model="searchQuery"
          icon="i-lucide-search"
          placeholder="Search recipes..."
          class="flex-1"
        />

        <USelectMenu
          v-model="selectedCategory"
          :items="categories"
          placeholder="Category"
          label-key="name"
          value-key="id"
          class="w-full md:w-48"
        />

        <USelectMenu
          v-model="selectedDifficulty"
          :items="difficultyOptions"
          placeholder="Difficulty"
          value-key="value"
          class="w-full md:w-40"
        />

        <UButton
          v-if="searchQuery || selectedCategory || selectedDifficulty"
          label="Clear"
          variant="subtle"
          icon="i-lucide-x"
          @click="clearFilters"
        />
      </div>

      <p class="text-sm text-muted mb-6">
        {{ filteredRecipes.length }} recipe{{ filteredRecipes.length !== 1 ? "s" : "" }} found
      </p>

      <div v-if="recipesPending" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <USkeleton v-for="i in 6" :key="i" class="h-72 rounded-xl" />
      </div>

      <div
        v-else-if="paginatedRecipes.length > 0"
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
