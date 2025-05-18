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
      <RecipeCard
        v-for="recipe in allRecipes"
        :key="recipe.id"
        :recipe="recipe"
      />
    </div>
    <div class="flex justify-center">
      <UPagination
        v-model:page="page"
        :show-controls="false"
        show-edges
        :items-per-page="8"
        :total="40"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import type { CommandPaletteItem, TabsItem } from "@nuxt/ui";
import type { Recipe } from "~/types/Recipe";

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

const filterOptions = ref<CommandPaletteItem[]>([
  { label: "Vegetarian Delights", suffix: "870" },
  { label: "Main Courses", suffix: '300' },
]);

const allRecipes = ref<Recipe[]>([
  {
    id: "1",
    img: "/images/aubergine-and-sesame-noodles.jpg",
    name: "Aubergine and Sesame Noodles",
    type: "Vegetarian Delights",
    isFavorite: true,
  },
  {
    id: "2",
    img: "/images/aubergine-and-sesame-noodles.jpg",
    name: "Spaghetti Carbonara",
    type: "Main Courses",
    isFavorite: false,
  },
  {
    id: "3",
    img: "/images/aubergine-and-sesame-noodles.jpg",
    name: "Caesar Salad",
    type: "Salads & Sides",
    isFavorite: false,
  },
  {
    id: "4",
    img: "/images/aubergine-and-sesame-noodles.jpg",
    name: "Chocolate Cake",
    type: "Desserts & Sweets",
    isFavorite: false,
  },
  {
    id: "5",
    img: "/images/aubergine-and-sesame-noodles.jpg",
    name: "Sushi",
    type: "International Flavors",
    isFavorite: false,
  },
  {
    id: "6",
    img: "/images/aubergine-and-sesame-noodles.jpg",
    name: "Grilled Chicken",
    type: "Healthy Eats",
    isFavorite: false,
  },
  {
    id: "7",
    img: "/images/aubergine-and-sesame-noodles.jpg",
    name: "Tacos",
    type: "Quick & Easy Supper",
    isFavorite: false,
  },
  {
    id: "8",
    img: "/images/aubergine-and-sesame-noodles.jpg",
    name: "Bruschetta",
    type: "Appetizers",
    isFavorite: false,
  },
]);
const page = ref(1);
</script>
