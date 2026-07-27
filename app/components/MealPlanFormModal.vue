<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import { z } from "zod";

interface MealPlanFormModalProps {
  mealPlan?: MealPlanResponse;
}

const props = defineProps<MealPlanFormModalProps>();
const emit = defineEmits<{
  saved: [];
}>();

const open = ref(false);
const toast = useToast();

const isEditing = computed(() => !!props.mealPlan?.id);

const schema = z.object({
  title: z.string("Title is required").trim().min(1, "Title is required"),
});

type Schema = z.output<typeof schema>;

const entrySchema = z.object({
  recipeId: z.string("Recipe is required").trim().min(1, "Recipe is required"),
  day: z.string("Day is required").trim().min(1, "Day is required"),
  mealType: z.string("Meal type is required").trim().min(1, "Meal type is required"),
});

const days = [
  { label: "Monday", value: "Monday" },
  { label: "Tuesday", value: "Tuesday" },
  { label: "Wednesday", value: "Wednesday" },
  { label: "Thursday", value: "Thursday" },
  { label: "Friday", value: "Friday" },
  { label: "Saturday", value: "Saturday" },
  { label: "Sunday", value: "Sunday" },
];

const mealTypes = [
  { label: "Breakfast", value: "breakfast" },
  { label: "Lunch", value: "lunch" },
  { label: "Dinner", value: "dinner" },
  { label: "Snack", value: "snack" },
];

const state = reactive<
  Partial<Schema> & {
    recipes: Partial<z.output<typeof entrySchema>>[];
  }
>({
  title: undefined,
  recipes: [{}],
});

const { data: recipesData, execute: fetchRecipes } = await useFetch<ApiResponse<RecipeResponse[]>>(
  "/api/recipes",
  {
    lazy: true,
    immediate: false,
    query: { offset: 0, limit: 100 },
  },
);

const recipeOptions = computed(() => {
  const recipes = recipesData.value?.data ?? [];
  return recipes
    .filter((r) => r.status === "approved")
    .map((r) => ({ label: r.title, value: r.id }));
});

watch(open, (val) => {
  if (val) {
    fetchRecipes();
    if (props.mealPlan) {
      state.title = props.mealPlan.title;
      state.recipes.splice(
        0,
        state.recipes.length,
        ...props.mealPlan.recipes.map((r) => ({ ...r })),
      );
    } else {
      resetForm();
    }
  }
});

function addEntry() {
  state.recipes.push({});
}

function removeEntry(index: number) {
  state.recipes.splice(index, 1);
}

const loading = ref(false);

async function onSubmit(_event: FormSubmitEvent<Schema>) {
  const validEntries = state.recipes.filter((e) => e.recipeId && e.day && e.mealType);

  if (validEntries.length === 0) {
    toast.add({
      title: "Add at least one recipe",
      description: "Your meal plan needs at least one recipe entry.",
      color: "error",
      icon: "i-lucide-alert-circle",
    });
    return;
  }

  try {
    loading.value = true;

    const body = {
      title: state.title!,
      recipes: validEntries.map((e) => ({
        recipeId: e.recipeId!,
        day: e.day!,
        mealType: e.mealType!,
      })),
    };

    let res: ApiResponse<unknown>;

    if (isEditing.value) {
      res = await $fetch(`/api/meal-plans/${props.mealPlan!.id}`, {
        method: "PATCH",
        body,
      });
    } else {
      res = await $fetch("/api/meal-plans", {
        method: "POST",
        body,
      });
    }

    if (isSuccessResponse(res)) {
      toast.add({
        title: isEditing.value ? "Meal plan updated" : "Meal plan created",
        color: "success",
        icon: "i-lucide-check-circle",
      });
      open.value = false;
      emit("saved");
    } else {
      toast.add({
        title: isEditing.value ? "Update failed" : "Creation failed",
        description: res.status.message,
        color: "error",
        icon: "i-lucide-alert-circle",
      });
    }
  } catch {
    toast.add({
      title: "Something went wrong",
      color: "error",
      icon: "i-lucide-alert-circle",
    });
  } finally {
    loading.value = false;
  }
}

function resetForm() {
  state.title = undefined;
  state.recipes.splice(0, state.recipes.length, {});
}
</script>

<template>
  <UModal
    v-model:open="open"
    :title="isEditing ? 'Edit Meal Plan' : 'Create Meal Plan'"
    :description="isEditing ? 'Update your meal plan details' : 'Plan your meals for the week'"
    scrollable
    :ui="{ content: 'sm:max-w-3xl' }"
  >
    <slot />

    <template #body="{ close }">
      <UForm :schema="schema" :state="state" class="space-y-6" @submit="onSubmit">
        <UFormField name="title" label="Meal Plan Title" required>
          <UInput v-model="state.title" placeholder="e.g., This Week's Meal Plan" class="w-full" />
        </UFormField>

        <USeparator />

        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-xs font-semibold uppercase tracking-wider text-muted">Recipes</h3>

            <UButton
              label="Add Entry"
              icon="i-lucide-plus"
              variant="ghost"
              size="sm"
              @click="addEntry"
            />
          </div>

          <div class="space-y-3">
            <UForm
              v-for="(entry, index) in state.recipes"
              :key="index"
              :name="`recipes.${index}`"
              :schema="entrySchema"
              nested
            >
              <div class="grid grid-cols-[1fr_140px_140px_auto] items-start gap-2">
                <UFormField name="recipeId" class="flex-1">
                  <USelectMenu
                    v-model="entry.recipeId"
                    :items="recipeOptions"
                    placeholder="Select recipe"
                    value-key="value"
                    class="w-full"
                  />
                </UFormField>

                <UFormField name="day">
                  <USelectMenu
                    v-model="entry.day"
                    :items="days"
                    placeholder="Day"
                    value-key="value"
                    class="w-full"
                  />
                </UFormField>

                <UFormField name="mealType">
                  <USelectMenu
                    v-model="entry.mealType"
                    :items="mealTypes"
                    placeholder="Meal"
                    value-key="value"
                    class="w-full"
                  />
                </UFormField>

                <UButton
                  icon="i-lucide:trash"
                  variant="ghost"
                  color="error"
                  @click="removeEntry(index)"
                />
              </div>
            </UForm>
          </div>
        </div>

        <USeparator />

        <div class="flex justify-between gap-3">
          <UButton label="Cancel" color="neutral" variant="subtle" @click="close" />

          <UButton
            type="submit"
            :label="isEditing ? 'Save Changes' : 'Create Meal Plan'"
            icon="i-lucide:calendar"
            :loading="loading"
          />
        </div>
      </UForm>
    </template>
  </UModal>
</template>
