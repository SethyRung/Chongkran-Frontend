<script lang="ts" setup>
const route = useRoute();
const router = useRouter();
const toast = useToast();

const mealPlanId = computed(() => route.params.id as string);

const { pending, data, refresh } = await useAsyncData(`meal-plan-${mealPlanId.value}`, async () => {
  const mealPlanRes = await $fetch(`/api/meal-plans/${mealPlanId.value}`);
  if (!isSuccessResponse(mealPlanRes)) return;

  const uniqueIds = [...new Set(mealPlanRes.data.recipes.map((r) => r.recipeId))];

  const recipeResults = await Promise.allSettled(
    uniqueIds.map((id) => $fetch<ApiResponse<RecipeResponse>>(`/api/recipes/${id}`)),
  );

  const recipeMap = new Map<string, RecipeResponse>();
  for (const result of recipeResults) {
    if (result.status === "fulfilled" && isSuccessResponse(result.value)) {
      recipeMap.set(result.value.data.id, result.value.data);
    }
  }

  return {
    ...mealPlanRes.data,
    recipes: mealPlanRes.data.recipes.map((entry) => ({
      ...entry,
      recipe: recipeMap.get(entry.recipeId) ?? null,
    })),
  };
});

const enrichedRecipes = computed(() => data.value?.recipes ?? []);

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const mealTypes = ["breakfast", "lunch", "dinner", "snack"] as const;

const mealTypeIcons: Record<string, string> = {
  breakfast: "i-lucide:sunrise",
  lunch: "i-lucide:sun",
  dinner: "i-lucide:moon",
  snack: "i-lucide:cookie",
};

const formattedDate = computed(() => {
  if (!data.value) return "";
  return new Date(data.value.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});

function getEntriesForDay(day: string) {
  return enrichedRecipes.value.filter((r) => r.day === day);
}

function getEntryForMeal(day: string, mealType: string) {
  return enrichedRecipes.value.find((r) => r.day === day && r.mealType === mealType) ?? null;
}

const confirmModal = ref(false);

async function deletePlan() {
  if (!data.value) return;

  try {
    const res = await $fetch<ApiResponse<string>>(`/api/meal-plans/${data.value.id}`, {
      method: "DELETE",
    });

    if (res.status.code === ApiResponseCode.Success) {
      toast.add({
        title: "Meal plan deleted",
        color: "success",
        icon: "i-lucide-check-circle",
      });
      router.push("/meal-plans");
    } else {
      toast.add({
        title: "Delete failed",
        description: res.status.message,
        color: "error",
        icon: "i-lucide-alert-circle",
      });
    }
  } catch {
    toast.add({
      title: "Delete failed",
      description: "Something went wrong.",
      color: "error",
      icon: "i-lucide-alert-circle",
    });
  } finally {
    confirmModal.value = false;
  }
}
</script>

<template>
  <UPage>
    <UContainer class="py-8">
      <div v-if="data">
        <div class="mb-8 flex items-start justify-between">
          <div>
            <div class="flex items-center gap-2 mb-2">
              <UButton
                icon="i-lucide:arrow-left"
                variant="ghost"
                color="neutral"
                to="/meal-plans"
              />
              <h1 class="text-3xl font-bold">{{ data.title }}</h1>
            </div>
            <p class="text-muted">
              {{ data.recipes.length }} recipe{{ data.recipes.length !== 1 ? "s" : "" }} &middot;
              Created {{ formattedDate }}
            </p>
          </div>

          <div class="flex gap-2">
            <MealPlanFormModal :meal-plan="data" @saved="refresh">
              <UButton label="Edit" icon="i-lucide:pencil" variant="subtle" color="neutral" />
            </MealPlanFormModal>
            <UButton
              label="Delete"
              icon="i-lucide:trash"
              variant="subtle"
              color="error"
              @click="confirmModal = true"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <UCard v-for="day in days" :key="day">
            <template #header>
              <div class="flex items-center gap-2">
                <div
                  class="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary"
                >
                  <UIcon name="i-lucide:calendar-days" class="size-4" />
                </div>
                <span class="font-semibold">{{ day }}</span>
              </div>
            </template>

            <div v-if="getEntriesForDay(day).length > 0" class="space-y-3">
              <div v-for="mealType in mealTypes" :key="mealType">
                <div v-if="getEntryForMeal(day, mealType)" class="flex items-start gap-2">
                  <UIcon
                    :name="mealTypeIcons[mealType] ?? 'i-lucide:utensils'"
                    class="size-4 text-muted mt-0.5 shrink-0"
                  />
                  <div class="flex-1 min-w-0">
                    <p class="text-xs text-muted capitalize mb-0.5">{{ mealType }}</p>
                    <NuxtLink
                      :to="`/recipes/${getEntryForMeal(day, mealType)!.recipeId}`"
                      class="text-sm font-medium text-default hover:text-primary transition-colors truncate block"
                    >
                      {{ getEntryForMeal(day, mealType)!.recipe?.title ?? "Loading..." }}
                    </NuxtLink>
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="text-center py-4">
              <p class="text-sm text-muted">No meals planned</p>
            </div>
          </UCard>
        </div>
      </div>

      <div v-else class="text-center py-16">
        <UIcon name="i-lucide:calendar" class="size-12 mx-auto mb-4 text-muted" />
        <h3 class="text-lg font-medium mb-2">Meal plan not found</h3>
        <p class="text-muted mb-4">The meal plan you are looking for does not exist.</p>
        <UButton to="/meal-plans" label="Back to Meal Plans" variant="outline" />
      </div>
    </UContainer>

    <UModal v-model:open="confirmModal">
      <template #content>
        <UCard>
          <template #header>
            <h3 class="font-semibold">Delete Meal Plan</h3>
          </template>

          <p class="text-muted">
            Are you sure you want to delete "{{ data?.title }}"? This action cannot be undone.
          </p>

          <template #footer>
            <div class="flex justify-end gap-3">
              <UButton
                label="Cancel"
                color="neutral"
                variant="ghost"
                @click="confirmModal = false"
              />
              <UButton label="Delete" color="error" @click="deletePlan" />
            </div>
          </template>
        </UCard>
      </template>
    </UModal>
  </UPage>
</template>
