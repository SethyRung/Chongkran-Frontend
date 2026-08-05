<script lang="ts" setup>
import { isSuccessResponse } from "#shared/utils";
import type { CategoryResponse, RecipeResponse } from "#shared/types";
import type { StatsResponse } from "~~/server/api/stats.get";

useHead({
  title: "Chongkran — Find a recipe worth cooking",
  meta: [
    {
      name: "description",
      content:
        "Discover real recipes from a community of home cooks. Search by ingredient, browse by cuisine, save what you'll actually cook.",
    },
  ],
});

const search = ref("");

const [{ data: statsRes }, { data: categoriesRes }, { data: popularRes }] = await Promise.all([
  useFetch("/api/stats"),
  useFetch("/api/categories", { query: { limit: 12 } }),
  useFetch("/api/recipes/popular", { query: { limit: 8 } }),
]);

const stats = computed<StatsResponse | null>(() =>
  isSuccessResponse(statsRes.value) ? statsRes.value.data : null,
);

const categories = computed<CategoryResponse[]>(() =>
  isSuccessResponse(categoriesRes.value) ? categoriesRes.value.data : [],
);

const popularRecipes = computed<RecipeResponse[]>(() =>
  isSuccessResponse(popularRes.value) ? popularRes.value.data : [],
);

const trendingTags = computed<string[]>(() => {
  const counts = new Map<string, number>();
  for (const recipe of popularRecipes.value) {
    for (const tag of recipe.tags ?? []) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 8)
    .map(([tag]) => tag);
});

const hasStats = computed(() => {
  if (!stats.value) return false;
  return stats.value.recipes > 0 || stats.value.categories > 0 || stats.value.authors > 0;
});

const categoryIcons: Record<string, string> = {
  Pasta: "i-lucide-utensils",
  Asian: "i-lucide-utensils",
  American: "i-lucide-beef",
  Indian: "i-lucide-utensils",
  Desserts: "i-lucide-cake",
  Salads: "i-lucide-leaf",
};

function submitSearch() {
  const q = search.value.trim();
  navigateTo({ path: "/recipes", query: q ? { search: q } : {} });
}

function categoryIcon(name: string) {
  return categoryIcons[name] ?? "i-lucide-utensils";
}
</script>

<template>
  <div class="font-sans">
    <section class="border-b border-default">
      <UContainer class="py-16 sm:py-24 lg:py-32">
        <div class="mx-auto max-w-3xl text-center space-y-8">
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-highlighted">
            What are you cooking today?
          </h1>
          <p class="text-lg sm:text-xl text-muted">
            Real recipes from people who actually cook them. Search an ingredient, pick a cuisine,
            or browse what's popular.
          </p>

          <form
            class="mx-auto flex w-full max-w-2xl items-center gap-2"
            role="search"
            @submit.prevent="submitSearch"
          >
            <UInput
              v-model="search"
              name="search"
              placeholder="Search recipes, ingredients, cuisines…"
              icon="i-lucide-search"
              size="xl"
              class="flex-1"
              :ui="{ base: 'w-full' }"
            />
            <UButton type="submit" size="xl" icon="i-lucide-arrow-right" label="Search" />
          </form>

          <div v-if="trendingTags.length" class="flex flex-wrap items-center justify-center gap-2">
            <span class="text-sm text-muted">Popular:</span>
            <UButton
              v-for="tag in trendingTags"
              :key="tag"
              :to="{ path: '/recipes', query: { search: tag } }"
              variant="subtle"
              color="neutral"
              size="sm"
              :label="tag"
            />
          </div>

          <div class="flex flex-wrap items-center justify-center gap-3 pt-2">
            <UButton
              to="/recipes"
              variant="ghost"
              color="neutral"
              trailing-icon="i-lucide-chevron-right"
              label="Browse all recipes"
            />
          </div>
        </div>
      </UContainer>
    </section>

    <section v-if="categories.length" class="border-b border-default">
      <UContainer class="py-12 sm:py-16">
        <div class="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 class="text-2xl sm:text-3xl font-bold text-highlighted">Browse by cuisine</h2>
            <p class="mt-1 text-muted">Pick a category to see what's cooking.</p>
          </div>
          <UButton
            to="/categories"
            variant="ghost"
            color="neutral"
            trailing-icon="i-lucide-chevron-right"
            label="All categories"
          />
        </div>

        <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          <NuxtLink
            v-for="category in categories"
            :key="category.id"
            :to="`/recipes?category=${category.id}`"
            class="block"
          >
            <UCard
              :ui="{
                root: 'group cursor-pointer transition-all hover:ring-2 hover:ring-primary h-full',
                body: 'p-5',
              }"
            >
              <div class="flex flex-col items-center gap-3 text-center">
                <div
                  class="flex size-12 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20"
                >
                  <UIcon :name="categoryIcon(category.name)" class="size-6 text-primary" />
                </div>
                <h3 class="font-semibold group-hover:text-primary transition-colors">
                  {{ category.name }}
                </h3>
                <p v-if="typeof category.recipeCount === 'number'" class="text-xs text-muted">
                  {{ category.recipeCount }}
                  {{ category.recipeCount === 1 ? "recipe" : "recipes" }}
                </p>
              </div>
            </UCard>
          </NuxtLink>
        </div>
      </UContainer>
    </section>

    <section v-if="popularRecipes.length" class="border-b border-default">
      <UContainer class="py-12 sm:py-16">
        <div class="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 class="text-2xl sm:text-3xl font-bold text-highlighted">Popular right now</h2>
            <p class="mt-1 text-muted">The recipes people are cooking the most.</p>
          </div>
          <UButton
            to="/recipes"
            variant="ghost"
            color="neutral"
            trailing-icon="i-lucide-chevron-right"
            label="See all"
          />
        </div>

        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <RecipeCard v-for="recipe in popularRecipes" :key="recipe.id" :recipe="recipe" />
        </div>
      </UContainer>
    </section>

    <section v-if="hasStats">
      <UContainer class="py-12 sm:py-16">
        <div class="grid grid-cols-3 gap-4">
          <div class="text-center">
            <p class="text-2xl sm:text-3xl font-bold text-highlighted">{{ stats?.recipes }}</p>
            <p class="mt-1 text-sm text-muted">Recipes</p>
          </div>
          <div class="text-center">
            <p class="text-2xl sm:text-3xl font-bold text-highlighted">{{ stats?.categories }}</p>
            <p class="mt-1 text-sm text-muted">Categories</p>
          </div>
          <div class="text-center">
            <p class="text-2xl sm:text-3xl font-bold text-highlighted">{{ stats?.authors }}</p>
            <p class="mt-1 text-sm text-muted">Authors</p>
          </div>
        </div>
      </UContainer>
    </section>
  </div>
</template>
