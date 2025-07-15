<template>
  <div
    class="group relative w-full p-6 flex flex-col gap-3 justify-between bg-white border border-gray-200 rounded-lg shadow-sm hover:border-primary-500 transition-all"
  >
    <div class="space-y-3">
      <NuxtImg
        :src="recipe.image"
        class="w-full h-60 object-cover rounded group-hover:scale-105 transition-all"
      />
      <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900">
        {{ recipe.title }}
      </h5>
      <UBadge :label="recipe.category" variant="soft" color="primary" />
    </div>
    <div class="flex gap-1">
      <UButton
        icon="i-lucide-eye"
        label="See Complete Recipe"
        block
        :to="`recipes/${recipe.id}`"
      />
      <UButton icon="i-lucide-heart" variant="subtle" color="neutral" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Recipe } from "~/types";

type Props = {
  recipe: Recipe;
};

defineProps<Props>();
</script>
