<template>
  <div class="p-4 md:px-12 lg:px-20 space-y-8">
    <div class="relative h-40 overflow-hidden">
      <div
        class="absolute -z-10 w-full h-full rounded-2xl bg-gradient-to-r from-gray-100 to-primary-200"
      ></div>
      <div class="h-full pl-4 md:pl-12 flex justify-between items-center gap-4">
        <h2 class="font-semibold text-xl md:text-2xl text-black">
          Explore <br /><span class="text-primary-500">Culinary</span> Insights
        </h2>
        <NuxtImg src="/images/banner.png" />
      </div>
    </div>
    <div class="space-y-4">
      <h3 class="text-xl font-semibold text-center">
        What to <span class="text-primary-500">Cook</span>?
      </h3>
      <div class="flex flex-col xs:flex-row-reverse justify-between gap-2">
        <UInput
          v-model="search"
          placeholder="Search"
          size="lg"
          :ui="{ trailing: 'pr-0.5', root: 'w-full xs:max-w-72' }"
        >
          <template #trailing>
            <UButton color="neutral" variant="ghost" icon="i-lucide-search" />
          </template>
        </UInput>
        <UTabs
          v-model="selectedTab"
          :content="false"
          :items="tabOptions"
          variant="link"
          size="xl"
          :ui="{ list: 'border-none', trigger: 'text-black' }"
        />
      </div>
      <div class="flex items-center justify-between gap-3 text-xs">
        <UPopover :content="{ side: 'right', align: 'start' }">
          <UButton
            label="Filters"
            icon="i-lucide-list-filter"
            size="sm"
            variant="ghost"
            color="neutral"
          />
          <template #content>
            <UCommandPalette
              multiple
              placeholder="Search category..."
              :groups="[{ id: 'labels', items: filterOptions }]"
              :ui="{ input: '[&>input]:h-8 [&>input]:text-sm' }"
            />
          </template>
        </UPopover>
        <USelect
          :items="sortOptions"
          default-value="Date"
          variant="ghost"
          size="sm"
          class="w-20"
        />
      </div>
    </div>

    <div class="grid grid-cols-[repeat(auto-fit,_minmax(288px,_1fr))] gap-4">
      <template
        v-if="categoriesStatus === 'success' && recipesStatus === 'success'"
      >
        <RecipeCard
          v-for="recipe in recipes"
          :key="recipe.id"
          :recipe="recipe"
        />
      </template>
      <template v-else>
        <div
          v-for="i in Array(4)"
          :key="i"
          class="group w-full p-6 space-y-3 bg-white border border-gray-200 rounded-lg shadow-sm"
        >
          <div class="space-y-3">
            <USkeleton
              class="w-full h-60 group-hover:scale-105 transition-all"
            />
            <USkeleton class="w-3/4 h-8 mb-2" />
            <USkeleton class="w-24 h-6" />
          </div>
          <div class="flex gap-1">
            <USkeleton class="grow h-8" />
            <USkeleton class="size-8" />
          </div>
        </div>
      </template>
    </div>
    <div class="flex justify-center">
      <UPagination
        v-model:page="page"
        :show-controls="false"
        show-edges
        :items-per-page="8"
        :total="totalPage"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import type { CommandPaletteItem, TabsItem } from "@nuxt/ui";
import type { Category, Paginated, Recipe } from "~/types";

const search = ref<string>();

const tabOptions = ref<TabsItem[]>([
  {
    label: "All",
    value: "all",
  },
  {
    label: "Favorites",
    value: "favorites",
  },
]);

const selectedTab = ref<string>("all");

const sortOptions = ref(["Date", "Name"]);

// const filterOptions = ref<CommandPaletteItem[]>([
//   { label: "Vegetarian Delights", suffix: "870" },
//   { label: "Main Courses", suffix: "300" },
// ]);

const filterOptions = computed<CommandPaletteItem[]>(() =>
  categories.value.map((category) => ({
    labeL: category.name,
    suffix: recipes.value
      .filter((recipe) => recipe.category === category.id)
      .length.toString(),
  }))
);

const page = ref(1);
const itemPerPage = ref<number>(8);

const {
  status: categoriesStatus,
  data: categoriesRes,
  execute: categoriesExecute,
} = await useAsyncData(
  () => useApi<Paginated<Category>>("/categories", { method: "GET" }),
  {
    lazy: true,
    immediate: false,
  }
);

const {
  status: recipesStatus,
  data: recipesRes,
  execute: recipesExecute,
} = await useAsyncData(
  () =>
    useApi<Paginated<Recipe>>("/recipes", {
      method: "GET",
      query: { limit: itemPerPage.value, page: page.value },
    }),
  {
    lazy: true,
    immediate: false,
  }
);

const categories = computed<Category[]>(
  () => categoriesRes.value?.data.content ?? []
);

const recipes = computed<Recipe[]>(
  () =>
    recipesRes.value?.data.content.map((recipe) => ({
      ...recipe,
      category:
        categories.value.find((category) => category.id === recipe.id)?.name ??
        "",
    })) ?? []
);

const totalPage = computed<number>(() => recipesRes.value?.data.total ?? 0);

onMounted(() => {
  categoriesExecute();
  recipesExecute();
});
</script>
