<script setup lang="ts">
const { data, pending } = await useFetch("/api/recipes/my", {
  query: {
    status: "all",
  },
  lazy: true,
});

const recipes = computed(() => data.value?.data ?? []);
</script>

<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h2 class="text-xl font-semibold">My Recipes</h2>
        <p class="text-sm text-muted">Manage and view your submitted recipes</p>
      </div>

      <CreateRecipeModal>
        <UButton label="Create Recipe" icon="i-lucide-plus" />
      </CreateRecipeModal>
    </div>

    <div v-if="pending" class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <UCard v-for="i in 6" :key="i">
        <USkeleton class="mb-4 h-40 w-full rounded-lg" />
        <USkeleton class="mb-2 h-5 w-3/4" />
        <USkeleton class="h-4 w-1/2" />
      </UCard>
    </div>

    <div
      v-else-if="recipes.length > 0"
      class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      <RecipeCard v-for="recipe in recipes" :key="recipe.id" :recipe="recipe" />
    </div>

    <div v-else class="py-16 text-center">
      <UIcon name="i-lucide-book-open" class="mx-auto mb-4 size-12 text-muted" />
      <h3 class="mb-2 text-lg font-medium">No recipes yet</h3>
      <p class="mb-4 text-muted">Share your first recipe with the community</p>
      <UButton label="Create Your First Recipe" icon="i-lucide-plus" to="/recipes/create" />
    </div>
  </div>
</template>
