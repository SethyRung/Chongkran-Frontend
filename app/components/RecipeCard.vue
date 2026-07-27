<script lang="ts">
interface RecipeCardProps {
  recipe: RecipeResponse;
}
</script>
<script setup lang="ts">
const props = defineProps<RecipeCardProps>();

const router = useRouter();

function navigateToRecipe() {
  router.push(`/recipes/${props.recipe.id}`);
}

const authorName = computed(() => {
  return props.recipe.authorName ?? "Unknown Author";
});

const authorAvatar = computed(() => {
  return props.recipe.authorAvatar;
});

const categoryName = computed(() => {
  if (typeof props.recipe.category === "string") {
    return props.recipe.category;
  }
  return props.recipe.category?.name || "Uncategorized";
});

const difficultyColor = computed(() => {
  switch (props.recipe.difficulty) {
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

const formatCookTime = (minutes: number) => {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};
</script>

<template>
  <UCard
    @click="navigateToRecipe"
    :ui="{
      root: 'group cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 flex flex-col',
      body: 'flex-1',
      footer: 'flex items-center justify-between',
    }"
  >
    <div class="relative aspect-4/3 overflow-hidden bg-muted">
      <img
        :src="recipe.image"
        :alt="recipe.title"
        class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />

      <UBadge
        :color="difficultyColor"
        variant="solid"
        class="absolute left-3 top-3 capitalize"
        size="xs"
      >
        {{ recipe.difficulty }}
      </UBadge>

      <div
        v-if="recipe.likes && recipe.likes > 0"
        class="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/50 px-2 py-1 text-xs text-white backdrop-blur-sm"
      >
        <UIcon name="i-lucide-heart" class="size-3 fill-current" />
        <span>{{ recipe.likes }}</span>
      </div>
    </div>

    <div class="py-4">
      <UBadge color="primary" variant="soft" size="xs" class="mb-2">
        {{ categoryName }}
      </UBadge>

      <h3 class="mb-2 line-clamp-2 text-lg font-semibold text-default group-hover:text-primary">
        {{ recipe.title }}
      </h3>

      <p class="mb-3 line-clamp-2 text-sm text-muted">
        {{ recipe.description }}
      </p>

      <div v-if="recipe.tags.length > 0" class="mb-3 flex flex-wrap gap-1">
        <UBadge
          v-for="tag in recipe.tags.slice(0, 3)"
          :key="tag"
          variant="outline"
          size="xs"
          color="neutral"
        >
          {{ tag }}
        </UBadge>
        <UBadge v-if="recipe.tags.length > 3" variant="outline" size="xs" color="neutral">
          +{{ recipe.tags.length - 3 }}
        </UBadge>
      </div>
    </div>

    <template #footer>
      <div class="flex items-center gap-2">
        <UAvatar :src="authorAvatar" :alt="authorName" size="xs" />
        <span class="text-xs text-muted">{{ authorName }}</span>
      </div>

      <div class="flex items-center gap-3 text-xs text-muted">
        <div class="flex items-center gap-1">
          <UIcon name="i-lucide-clock" class="size-3.5" />
          <span>{{ formatCookTime(recipe.cookTime) }}</span>
        </div>
        <div class="flex items-center gap-1">
          <UIcon name="i-lucide-eye" class="size-3.5" />
          <span>{{ recipe.views }}</span>
        </div>
      </div>
    </template>
  </UCard>
</template>
