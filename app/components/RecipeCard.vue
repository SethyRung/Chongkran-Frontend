<script lang="ts">
interface RecipeCardProps {
  recipe: RecipeResponse;
}
</script>
<script setup lang="ts">
const props = defineProps<RecipeCardProps>();

const authorName = computed(() => props.recipe.authorName ?? "Unknown Author");
const authorAvatar = computed(() => props.recipe.authorAvatar);

const formatCookTime = (minutes: number) => {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

const recipeHref = computed(() => `/recipes/${props.recipe.id}`);
</script>

<template>
  <NuxtLink
    :to="recipeHref"
    class="group flex flex-col rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-default"
    :aria-label="`View recipe: ${recipe.title}`"
  >
    <div class="relative aspect-4/3 overflow-hidden rounded-xl bg-muted">
      <img
        :src="recipe.image"
        :alt="recipe.title"
        loading="lazy"
        class="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
      />

      <div
        class="absolute inset-x-3 bottom-3 flex items-center justify-between gap-2"
        :aria-label="`Difficulty: ${recipe.difficulty}`"
      >
        <span
          class="rounded-full bg-black/40 px-2.5 py-1 text-xs font-medium text-white capitalize backdrop-blur-sm"
        >
          {{ recipe.difficulty }}
        </span>

        <div
          v-if="recipe.likes && recipe.likes > 0"
          class="flex items-center gap-1 rounded-full bg-black/40 px-2 py-1 text-xs text-white backdrop-blur-sm"
        >
          <UIcon name="i-lucide-heart" class="size-3 fill-current" />
          <span>{{ recipe.likes }}</span>
        </div>
      </div>
    </div>

    <div class="flex flex-1 flex-col gap-2 pt-4">
      <h3
        class="line-clamp-2 text-lg font-semibold leading-snug text-highlighted transition-colors group-hover:text-primary"
      >
        {{ recipe.title }}
      </h3>

      <p v-if="recipe.description" class="line-clamp-2 text-sm leading-relaxed text-muted">
        {{ recipe.description }}
      </p>

      <div class="mt-auto flex items-center gap-2 pt-2 text-sm text-muted">
        <UAvatar :src="authorAvatar" :alt="authorName" size="2xs" />
        <span class="truncate">{{ authorName }}</span>
        <span aria-hidden="true" class="text-default/30">·</span>
        <UIcon name="i-lucide-clock" class="size-3.5 shrink-0" />
        <span>{{ formatCookTime(recipe.cookTime) }}</span>
      </div>
    </div>
  </NuxtLink>
</template>
