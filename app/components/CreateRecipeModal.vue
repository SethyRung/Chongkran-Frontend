<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import { z } from "zod";

const open = ref(false);

const toast = useToast();

const schema = z.object({
  title: z.string("Title is required").trim().min(1, "Title is required"),
  description: z.string().optional(),
  image: z
    .instanceof(File, {
      message: "Please select an image file.",
    })
    .refine((file) => file.size <= 2 * 1024 * 1024, {
      message: `The image is too large. Please choose an image smaller than 2MB.`,
    }),
  category: z.string("Category is required").trim().min(1, "Category is required"),
  difficulty: z.enum(["easy", "medium", "hard"], {
    error: "Difficulty is required",
  }),
  cookTime: z
    .number("Cook time must be at least 1 minute")
    .min(1, "Cook time must be at least 1 minute"),
  tags: z.array(z.string()),
});

type Schema = z.output<typeof schema>;

const ingredientSchema = z.object({
  name: z.string("Name is required").trim().min(1, "Name is required"),
  quantity: z.string("Quantity is required").trim().min(1, "Quantity is required"),
});

const stepSchema = z.object({
  text: z.string("Step cannot be empty").trim().min(1, "Step cannot be empty"),
});

const state = reactive<
  Partial<
    Schema & {
      ingredients: Partial<z.output<typeof ingredientSchema>>[];
      steps: Partial<z.output<typeof stepSchema>>[];
    }
  >
>({
  ingredients: [{}],
  steps: [{}],
});

const difficultyOptions = [
  { label: "Easy", value: "easy" },
  { label: "Medium", value: "medium" },
  { label: "Hard", value: "hard" },
];

const { data: categories, execute } = await useFetch("/api/categories", {
  lazy: true,
  immediate: false,
  default: () => [],
  transform: (res) => (res.status.code === ApiResponseCode.Success ? res.data : []),
});

watch(open, () => {
  if (open.value) {
    execute();
  }
});

function addIngredient() {
  if (state.ingredients) {
    state.ingredients.push({});
  } else {
    state.ingredients = [];
  }
}

function removeIngredient(index: number) {
  if (state.ingredients && state.ingredients.length > 1) {
    state.ingredients.splice(index, 1);
  }
}

function addStep() {
  if (state.steps) {
    state.steps.push({});
  } else {
    state.steps = [];
  }
}

function removeStep(index: number) {
  if (state.steps && state.steps.length > 1) {
    state.steps.splice(index, 1);
  }
}

const loading = ref(false);

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    loading.value = true;
    const { data } = event;

    const formData = new FormData();
    formData.append("file", data.image);

    const uploadRes = await $fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (uploadRes.status.code !== ApiResponseCode.Success) {
      toast.add({
        title: "Upload failed",
        description: uploadRes.status.message || "Failed to upload image.",
        color: "error",
        icon: "i-lucide-alert-circle",
      });
      return;
    }

    const res = await $fetch("/api/recipes", {
      method: "POST",
      body: {
        ...data,
        ingredients: state.ingredients,
        steps: (state.steps ?? []).map((s) => s.text),
        image: uploadRes.data?.url,
      },
    });

    if (res.status.code === ApiResponseCode.Success) {
      toast.add({
        title: "Recipe created",
        description: "Your recipe has been submitted for review.",
        color: "success",
        icon: "i-lucide-check-circle",
      });
      open.value = false;
      resetForm();
    } else {
      toast.add({
        title: "Failed to create recipe",
        description: res.status.message || "Please try again.",
        color: "error",
        icon: "i-lucide-alert-circle",
      });
    }
  } catch {
    toast.add({
      title: "Failed to create recipe",
      description: "Something went wrong.",
      color: "error",
      icon: "i-lucide-alert-circle",
    });
  } finally {
    loading.value = false;
  }
}

function resetForm() {
  Object.assign(state, {
    title: undefined,
    description: undefined,
    image: undefined,
    category: undefined,
    difficulty: undefined,
    cookTime: undefined,
    ingredients: [{}],
    steps: [{}],
    tags: [],
  });
}
</script>

<template>
  <UModal
    v-model:open="open"
    title="Create Recipe"
    description="Share your culinary creation with the community"
    scrollable
    :ui="{ content: 'sm:max-w-3xl' }"
  >
    <slot />

    <template #body="{ close }">
      <UForm :schema="schema" :state="state" class="space-y-6" @submit="onSubmit">
        <div class="space-y-4">
          <h3 class="text-xs font-semibold uppercase tracking-wider text-muted">
            Basic Information
          </h3>

          <UFormField name="title" label="Recipe Title" required>
            <UInput v-model="state.title" placeholder="e.g., Classic Carbonara" class="w-full" />
          </UFormField>

          <UFormField name="description" label="Description">
            <UTextarea
              v-model="state.description"
              placeholder="Describe your recipe..."
              :rows="5"
              autoresize
              class="w-full"
            />
          </UFormField>

          <div class="grid grid-cols-2 gap-4">
            <UFormField name="category" label="Category" required>
              <USelectMenu
                v-model="state.category"
                :items="categories ?? []"
                placeholder="Select category"
                label-key="name"
                value-key="id"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Tags" name="tags">
              <UInputTags
                v-model="state.tags"
                placeholder="Add tags (press Enter)"
                class="w-full"
              />
            </UFormField>

            <UFormField name="difficulty" label="Difficulty" required>
              <USelectMenu
                v-model="state.difficulty"
                :items="difficultyOptions"
                placeholder="Select difficulty"
                value-key="value"
                class="w-full"
              />
            </UFormField>

            <UFormField name="cookTime" label="Cook Time (minutes)" required>
              <UInputNumber
                v-model="state.cookTime"
                :min="1"
                orientation="vertical"
                class="w-full"
              />
            </UFormField>
          </div>
        </div>

        <USeparator />

        <div class="space-y-4">
          <h3 class="text-xs font-semibold uppercase tracking-wider text-muted">Recipe Image</h3>

          <UFormField name="image">
            <UFileUpload
              v-model="state.image"
              label="Drop your image here"
              description="SVG, PNG, JPG or GIF (max. 2MB)"
              layout="list"
              accept="image/*"
              class="w-full min-h-48"
            />
          </UFormField>
        </div>

        <USeparator />

        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-xs font-semibold uppercase tracking-wider text-muted">Ingredients</h3>
            <UButton
              label="Add Ingredient"
              icon="i-lucide-plus"
              variant="ghost"
              size="sm"
              @click="addIngredient"
            />
          </div>

          <div class="grid grid-cols-[1fr_128px_auto] items-start gap-2">
            <UForm
              v-for="(ingredient, index) in state.ingredients"
              :key="index"
              :name="`ingredients.${index}`"
              :schema="ingredientSchema"
              nested
              class="contents"
            >
              <UFormField name="name" class="flex-1">
                <UInput v-model="ingredient.name" placeholder="Ingredient name" class="w-full" />
              </UFormField>

              <UFormField name="quantity" class="w-32">
                <UInput v-model="ingredient.quantity" placeholder="Qty" />
              </UFormField>

              <UButton
                v-if="index > 0"
                icon="i-lucide-trash"
                variant="ghost"
                color="error"
                @click="removeIngredient(index)"
              />
              <div v-else></div>
            </UForm>
          </div>
        </div>

        <USeparator />

        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-xs font-semibold uppercase tracking-wider text-muted">Steps</h3>
            <UButton
              label="Add Step"
              icon="i-lucide-plus"
              variant="ghost"
              size="sm"
              @click="addStep"
            />
          </div>

          <div class="grid grid-cols-[auto_1fr_auto] items-start gap-2">
            <UForm
              v-for="(step, index) in state.steps"
              :key="index"
              :name="`steps.${index}`"
              :schema="stepSchema"
              nested
              class="contents"
            >
              <div
                class="mt-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium"
              >
                {{ index + 1 }}
              </div>

              <UFormField name="text" class="flex-1">
                <UTextarea
                  v-model="step.text"
                  :placeholder="`Step ${index + 1}`"
                  :rows="2"
                  autoresize
                  class="w-full"
                />
              </UFormField>

              <UButton
                v-if="index > 0"
                icon="i-lucide-trash"
                variant="ghost"
                color="error"
                class="mt-1"
                @click="removeStep(index)"
              />
              <div v-else></div>
            </UForm>
          </div>
        </div>

        <USeparator />

        <div class="flex justify-between gap-3">
          <UButton label="Cancel" color="neutral" variant="subtle" @click="close" />

          <UButton
            type="submit"
            label="Create Recipe"
            icon="i-lucide-chef-hat"
            :loading="loading"
          />
        </div>
      </UForm>
    </template>
  </UModal>
</template>
