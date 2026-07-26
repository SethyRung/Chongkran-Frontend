<script lang="ts" setup>
const toast = useToast();

const page = ref(1);
const limit = ref(9);

const offset = computed(() => (page.value - 1) * limit.value);

const { data, pending, refresh } = await useFetchApi("/api/meal-plans", {
  query: { offset, limit },
});

const total = computed(() =>
  isSuccessResponse(data.value) && data.value.meta ? data.value.meta.total : 0,
);
const mealPlans = computed(() =>
  isSuccessResponse(data.value) && data.value.meta ? data.value.data : [],
);

const confirmModal = ref(false);
const confirmTarget = ref<{ id: string; title: string } | null>(null);

function openDeleteConfirm(id: string, title: string) {
  confirmTarget.value = { id, title };
  confirmModal.value = true;
}

async function executeDelete() {
  if (!confirmTarget.value) return;

  try {
    const res = await useApi<ApiResponse<string>>(`/api/meal-plans/${confirmTarget.value.id}`, {
      method: "DELETE",
    });

    if (res.status.code === ApiResponseCode.Success) {
      toast.add({
        title: "Meal plan deleted",
        color: "success",
        icon: "i-lucide-check-circle",
      });
      await refresh();
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
    confirmTarget.value = null;
  }
}
</script>

<template>
  <UPage>
    <UContainer class="py-8">
      <div class="mb-8 flex items-start justify-between">
        <div>
          <h1 class="text-3xl font-bold mb-2">My Meal Plans</h1>
          <p class="text-muted">Organize your weekly meals with personalized plans</p>
        </div>

        <MealPlanFormModal @saved="refresh">
          <UButton label="Create Meal Plan" icon="i-lucide-plus" />
        </MealPlanFormModal>
      </div>

      <div v-if="pending" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <USkeleton v-for="i in 6" :key="i" class="h-56 rounded-xl" />
      </div>

      <div
        v-else-if="mealPlans.length > 0"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <div v-for="plan in mealPlans" :key="plan.id" class="relative group">
          <MealPlanCard :meal-plan="plan" />
          <div
            class="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1"
          >
            <MealPlanFormModal :meal-plan="plan" @saved="refresh">
              <UButton icon="i-lucide:pencil" size="xs" variant="soft" color="neutral" />
            </MealPlanFormModal>
            <UButton
              icon="i-lucide:trash"
              size="xs"
              variant="soft"
              color="error"
              @click.stop="openDeleteConfirm(plan.id, plan.title)"
            />
          </div>
        </div>
      </div>

      <div v-else class="text-center py-16">
        <UIcon name="i-lucide:calendar" class="size-12 mx-auto mb-4 text-muted" />
        <h3 class="text-lg font-medium mb-2">No meal plans yet</h3>
        <p class="text-muted mb-4">Start planning your meals for the week</p>
        <MealPlanFormModal @saved="refresh">
          <UButton label="Create Your First Meal Plan" icon="i-lucide:plus" />
        </MealPlanFormModal>
      </div>

      <div v-if="total > limit" class="flex justify-center mt-8">
        <UPagination v-model:page="page" :total="total" :items-per-page="limit" />
      </div>

      <UModal v-model:open="confirmModal">
        <template #content>
          <UCard>
            <template #header>
              <h3 class="font-semibold">Delete Meal Plan</h3>
            </template>

            <p class="text-muted">
              Are you sure you want to delete "{{ confirmTarget?.title }}"? This action cannot be
              undone.
            </p>

            <template #footer>
              <div class="flex justify-end gap-3">
                <UButton
                  label="Cancel"
                  color="neutral"
                  variant="ghost"
                  @click="confirmModal = false"
                />
                <UButton label="Delete" color="error" @click="executeDelete" />
              </div>
            </template>
          </UCard>
        </template>
      </UModal>
    </UContainer>
  </UPage>
</template>
