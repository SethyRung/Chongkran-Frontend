<script lang="ts">
import type { AdminRecentPendingRecipe } from "#shared/types";

interface AdminPendingRecipesProps {
  recipes?: AdminRecentPendingRecipe[];
}

interface AdminPendingRecipesEmits {
  (e: "update-status", id: string, status: "approved" | "rejected"): void;
}
</script>

<script setup lang="ts">
const props = withDefaults(defineProps<AdminPendingRecipesProps>(), {
  recipes: undefined,
});

const emit = defineEmits<AdminPendingRecipesEmits>();
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <div>
          <h3 class="font-semibold">Pending Recipes</h3>
          <p class="text-sm text-muted">Recipes awaiting review</p>
        </div>

        <UButton
          to="/admin/recipes"
          label="View All"
          variant="subtle"
          trailing-icon="i-lucide:arrow-right"
          size="sm"
        />
      </div>
    </template>

    <div v-if="recipes?.length" class="space-y-3">
      <div
        v-for="recipe in recipes"
        :key="recipe.id"
        class="flex items-center gap-3 p-3 rounded-lg bg-elevated/50"
      >
        <UAvatar :src="recipe.image" :alt="recipe.title" size="sm" icon="i-lucide:image" />

        <div class="flex-1 min-w-0">
          <p class="truncate text-sm font-medium">{{ recipe.title }}</p>
          <p class="text-xs text-muted">
            {{ recipe.authorName }} &middot;
            {{ formatDate(recipe.createdAt) }}
          </p>
        </div>

        <div class="flex gap-1 shrink-0">
          <UButton
            label="Approve"
            size="xs"
            color="success"
            variant="subtle"
            @click="emit('update-status', recipe.id, 'approved')"
          />
          <UButton
            label="Reject"
            size="xs"
            color="error"
            variant="subtle"
            @click="emit('update-status', recipe.id, 'rejected')"
          />
        </div>
      </div>
    </div>

    <UAlert
      v-else
      icon="i-lucide-check-circle"
      title="All caught up!"
      description="No pending recipes to review."
      color="success"
      variant="subtle"
    />
  </UCard>
</template>
