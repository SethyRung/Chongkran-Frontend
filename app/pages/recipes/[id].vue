<script lang="ts" setup>
import type { RecipeResponse } from "#server/types";

const route = useRoute();
const recipeId = computed(() => route.params.id as string);
const { user, fetchSession } = useUserSession();
const toast = useToast();

const { data: recipeRes, refresh } = await useFetchApi<ApiResponse<RecipeResponse>>(
  `/api/recipes/${recipeId.value}`,
  {
    lazy: true,
  },
);

const recipe = computed<Recipe | null>(() => {
  if (recipeRes.value?.status.code === ApiResponseCode.Success) {
    return recipeRes.value.data;
  }
  return null;
});

async function refreshUser() {
  try {
    await fetchSession({ force: true });
  } catch {}
}

const category = computed(() => {
  if (!recipe.value) return null;
  if (typeof recipe.value.category === "string") return null;
  return recipe.value.category;
});

const difficultyColor = computed(() => {
  switch (recipe.value?.difficulty) {
    case "easy":
      return "success";
    case "medium":
      return "warning";
    case "hard":
      return "error";
    default:
      return "neutral";
  }
});

const formattedCookTime = computed(() => {
  if (!recipe.value) return "";
  const time = recipe.value.cookTime;
  if (time < 60) return `${time} minutes`;
  const hours = Math.floor(time / 60);
  const mins = time % 60;
  return mins > 0
    ? `${hours} hour${hours > 1 ? "s" : ""} ${mins} min`
    : `${hours} hour${hours > 1 ? "s" : ""}`;
});

const formattedDate = computed(() => {
  if (!recipe.value) return "";
  return new Date(recipe.value.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});

const isLiked = computed(() => {
  if (!user.value || !recipe.value) return false;
  return recipe.value.likedUserIds?.includes(user.value.id) ?? false;
});
// TODO: replace with GET /api/favorites/:recipeId/check once Phase 3 lands.
// `favoriteRecipes` was denormalized on User; now lives in the `favorites` join table.
const isSaved = ref(false);

const likeLoading = ref(false);
const saveLoading = ref(false);

async function toggleLike() {
  if (!recipe.value || !user.value) {
    toast.add({
      title: "Please log in to like this recipe",
      color: "warning",
      icon: "i-lucide-log-in",
    });
    return;
  }

  try {
    likeLoading.value = true;

    const willUnlike = isLiked.value;

    const res = await useApi<ApiResponse<string>>(`/api/recipes/${recipe.value.id}/like`, {
      method: "PUT",
    });

    if (res.status.code === ApiResponseCode.Success) {
      await refresh();
      toast.add({
        title: willUnlike ? "Recipe unliked" : "Recipe liked",
        color: "success",
        icon: "i-lucide-heart",
      });
    }
  } catch {
    toast.add({
      title: "Failed to update like",
      color: "error",
      icon: "i-lucide-alert-circle",
    });
  } finally {
    likeLoading.value = false;
  }
}

async function toggleSave() {
  if (!recipe.value || !user.value) {
    toast.add({
      title: "Please log in to save this recipe",
      color: "warning",
      icon: "i-lucide-log-in",
    });
    return;
  }

  try {
    saveLoading.value = true;

    if (isSaved.value) {
      await useApi<ApiResponse<string>>(`/api/favorites/${recipe.value.id}`, {
        method: "DELETE",
      });
    } else {
      await useApi<ApiResponse<string>>(`/api/favorites/${recipe.value.id}`, {
        method: "POST",
      });
    }

    await refreshUser();
    toast.add({
      title: isSaved.value ? "Recipe saved" : "Recipe removed from favorites",
      color: "success",
      icon: "i-lucide-bookmark",
    });
  } catch {
    toast.add({
      title: "Failed to update favorite",
      color: "error",
      icon: "i-lucide-alert-circle",
    });
  } finally {
    saveLoading.value = false;
  }
}

async function shareRecipe() {
  if (!recipe.value) return;

  const url = `${window.location.origin}/recipes/${recipe.value.id}`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: recipe.value.title,
        text: recipe.value.description ?? undefined,
        url,
      });
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        await copyToClipboard(url);
      }
    }
  } else {
    await copyToClipboard(url);
  }
}

async function copyToClipboard(url: string) {
  try {
    await navigator.clipboard.writeText(url);
    toast.add({
      title: "Link copied to clipboard",
      color: "success",
      icon: "i-lucide-link",
    });
  } catch {
    toast.add({
      title: "Failed to copy link",
      color: "error",
      icon: "i-lucide-alert-circle",
    });
  }
}
</script>

<template>
  <UPage class="pb-16">
    <div v-if="recipe" class="relative h-64 md:h-96 w-full mb-8">
      <img :src="recipe.image" :alt="recipe.title" class="w-full h-full object-cover" />
      <div class="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
      <UContainer class="absolute bottom-0 left-0 right-0 pb-6">
        <UBadge :color="difficultyColor" class="capitalize mb-3">
          {{ recipe.difficulty }}
        </UBadge>
        <h1 class="text-3xl md:text-4xl font-bold text-white mb-2">
          {{ recipe.title }}
        </h1>
        <div class="flex flex-wrap items-center gap-4 text-white/90">
          <span class="flex items-center gap-1">
            <UIcon name="i-lucide-clock" class="size-5" />
            {{ formattedCookTime }}
          </span>
          <span class="flex items-center gap-1">
            <UIcon name="i-lucide-heart" class="size-5" />
            {{ recipe.likes || 0 }} likes
          </span>
          <span class="flex items-center gap-1">
            <UIcon name="i-lucide-eye" class="size-5" />
            {{ recipe.views }} views
          </span>
        </div>
      </UContainer>
    </div>

    <UContainer>
      <div v-if="recipe" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-8">
          <UCard>
            <p class="text-default leading-relaxed">
              {{ recipe.description }}
            </p>
          </UCard>

          <UCard>
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-clipboard-list" class="size-5 text-primary" />
                <h2 class="text-xl font-semibold">Ingredients</h2>
              </div>
            </template>
            <ul class="space-y-3">
              <li
                v-for="(ingredient, index) in recipe.ingredients"
                :key="index"
                class="flex items-start gap-3"
              >
                <UCheckbox :id="`ingredient-${index}`" />
                <label :for="`ingredient-${index}`" class="flex-1 cursor-pointer">
                  <span class="font-medium">{{ ingredient.name }}</span>
                  <span class="text-muted ml-2">{{ ingredient.quantity }}</span>
                </label>
              </li>
            </ul>
          </UCard>

          <UCard>
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-list" class="size-5 text-primary" />
                <h2 class="text-xl font-semibold">Instructions</h2>
              </div>
            </template>
            <ol class="space-y-6">
              <li v-for="(step, index) in recipe.steps" :key="index" class="flex gap-4">
                <span
                  class="shrink-0 w-8 h-8 rounded-full bg-elevated text-primary flex items-center justify-center font-semibold"
                >
                  {{ index + 1 }}
                </span>
                <p class="flex-1 pt-1 text-default leading-relaxed">
                  {{ step }}
                </p>
              </li>
            </ol>
          </UCard>

          <div class="flex flex-wrap gap-2">
            <UBadge v-for="tag in recipe.tags" :key="tag" variant="soft" size="lg">
              {{ tag }}
            </UBadge>
          </div>
        </div>

        <div class="space-y-6">
          <UCard>
            <div class="flex gap-3">
              <UButton
                icon="i-lucide-heart"
                :label="isLiked ? 'Liked' : 'Like'"
                :color="isLiked ? 'error' : 'neutral'"
                variant="soft"
                :loading="likeLoading"
                @click="toggleLike"
              />

              <UButton
                :icon="isSaved ? 'i-lucide-bookmark-check' : 'i-lucide-bookmark'"
                :label="isSaved ? 'Saved' : 'Save'"
                :color="isSaved ? 'primary' : 'neutral'"
                variant="soft"
                :loading="saveLoading"
                @click="toggleSave"
              />

              <UButton icon="i-lucide-share" label="Share" variant="soft" @click="shareRecipe" />
            </div>
          </UCard>

          <UCard>
            <template #header>
              <span class="text-sm text-muted">Recipe by</span>
            </template>
            <div class="flex items-center gap-4">
              <UAvatar :src="recipe.authorAvatar" :alt="recipe.authorName" size="xl" />
              <div>
                <NuxtLink to="#" class="font-semibold hover:text-primary transition-colors">
                  {{ recipe.authorName }}
                </NuxtLink>
                <p class="text-sm text-muted">
                  {{ recipe.authorBio }}
                </p>
              </div>
            </div>
            <template #footer>
              <UButton label="Follow" variant="outline" block />
            </template>
          </UCard>

          <UCard>
            <template #header>
              <span class="text-sm text-muted">Recipe Details</span>
            </template>
            <dl class="space-y-3">
              <div class="flex justify-between">
                <dt class="text-muted">Category</dt>
                <dd>
                  <NuxtLink
                    v-if="category"
                    :to="`/recipes?category=${category.id}`"
                    class="text-primary hover:underline"
                  >
                    {{ category.name }}
                  </NuxtLink>
                  <span v-else class="text-muted">—</span>
                </dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-muted">Difficulty</dt>
                <dd class="capitalize">{{ recipe.difficulty }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-muted">Cook Time</dt>
                <dd>{{ formattedCookTime }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-muted">Published</dt>
                <dd>{{ formattedDate }}</dd>
              </div>
            </dl>
          </UCard>
        </div>
      </div>

      <div v-else class="text-center py-16">
        <UIcon name="i-lucide-circle-alert" class="size-12 mx-auto mb-4 text-muted" />
        <h3 class="text-lg font-medium mb-2">Recipe not found</h3>
        <p class="text-muted mb-4">The recipe you are looking for does not exist.</p>
        <UButton to="/recipes" label="Browse Recipes" variant="outline" />
      </div>
    </UContainer>
  </UPage>
</template>
