<script lang="ts" setup>
const categories = ref<CategoryResponse[]>([
  {
    id: "c1",
    name: "Pasta",
    description: "Italian pasta dishes from classic spaghetti to creative modern recipes",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "c2",
    name: "Asian",
    description: "Flavors from across Asia including Thai, Chinese, Japanese, and Khmer cuisine",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "c3",
    name: "American",
    description: "Classic American comfort food and modern favorites",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "c4",
    name: "Indian",
    description: "Rich and aromatic Indian curries, biryanis, and traditional dishes",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "c5",
    name: "Desserts",
    description: "Sweet treats from cakes and cookies to puddings and pastries",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "c6",
    name: "Healthy",
    description: "Nutritious recipes for a balanced lifestyle without sacrificing flavor",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "c7",
    name: "Quick & Easy",
    description: "Simple recipes ready in 30 minutes or less for busy days",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "c8",
    name: "Vegetarian",
    description: "Plant-based recipes full of flavor and creativity",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
]);

const categoryImages: Record<string, string> = {
  c1: "https://images.unsplash.com/photo-1593423325289-3728834164c4?w=600",
  c2: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600",
  c3: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600",
  c4: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600",
  c5: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=600",
  c6: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600",
  c7: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=600",
  c8: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600",
};

const categoryStats: Record<string, { recipes: number; authors: number }> = {
  c1: { recipes: 124, authors: 32 },
  c2: { recipes: 98, authors: 28 },
  c3: { recipes: 87, authors: 25 },
  c4: { recipes: 76, authors: 22 },
  c5: { recipes: 145, authors: 41 },
  c6: { recipes: 112, authors: 35 },
  c7: { recipes: 203, authors: 48 },
  c8: { recipes: 89, authors: 27 },
};
</script>

<template>
  <UPage>
    <UContainer class="py-8">
      <div class="mb-10">
        <h1 class="text-3xl font-bold mb-2">Browse Categories</h1>
        <p class="text-muted">Find recipes by cuisine type, dietary preference, or cooking style</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <NuxtLink
          v-for="category in categories"
          :key="category.id"
          :to="`/categories/${category.id}`"
          class="group h-full"
        >
          <UCard
            :ui="{
              root: 'group cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 flex flex-col h-full',
              body: 'p-0 flex-1 flex flex-col',
            }"
          >
            <div class="relative aspect-4/3 overflow-hidden rounded-t-lg">
              <img
                :src="
                  categoryImages[category.id] ||
                  'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=600'
                "
                :alt="category.name"
                class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />

              <div
                class="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent"
              />

              <div class="absolute bottom-0 left-0 right-0 p-4">
                <h3 class="text-xl font-semibold text-white mb-1">
                  {{ category.name }}
                </h3>
                <div class="flex items-center gap-3 text-sm text-white/80">
                  <span class="flex items-center gap-1">
                    <UIcon name="i-lucide-book-open" class="size-3.5" />
                    {{ categoryStats[category.id]?.recipes || 0 }} recipes
                  </span>
                  <span class="flex items-center gap-1">
                    <UIcon name="i-lucide-users" class="size-3.5" />
                    {{ categoryStats[category.id]?.authors || 0 }} authors
                  </span>
                </div>
              </div>
            </div>

            <div class="p-4 flex-1">
              <p class="text-sm text-muted line-clamp-2">
                {{ category.description }}
              </p>
            </div>
          </UCard>
        </NuxtLink>
      </div>
    </UContainer>
  </UPage>
</template>
