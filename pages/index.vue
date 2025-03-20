<template>
  <div class="p-4 md:px-12 lg:px-20 space-y-8">
    <div class="relative h-40 overflow-hidden">
      <div
        class="absolute -z-10 w-full h-full rounded-2xl bg-gradient-to-r from-gray-100 to-orange-100"
      ></div>
      <div class="h-full pl-4 md:pl-12 flex justify-between items-center gap-4">
        <h2 class="font-semibold text-xl md:text-2xl text-black">
          Explore <br /><span class="text-orange-400">Culinary</span> Insights
        </h2>
        <NuxtImg src="/images/banner.png" />
      </div>
    </div>
    <div class="max-w-[800px] mx-auto space-y-4">
      <h3 class="text-xl font-semibold text-center">
        What to <span class="text-orange-400">Cook</span>?
      </h3>
      <div class="flex flex-wrap justify-center gap-2">
        <UBadge
          v-for="type in foodTypes"
          :key="type"
          :label="type"
          variant="soft"
          :color="selectedFoodType === type ? 'primary' : 'neutral'"
          class="rounded-full hover:cursor-pointer"
          @click="
            () => {
              selectedFoodType = type;
            }
          "
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
  </div>
</template>
<script setup lang="ts">
import type { Recipe } from "~/types/Recipe";

const foodTypes = ref<string[]>([
  "All Types",
  "Appetizers",
  "Main Courses",
  "Salads & Sides",
  "Vegetarian Delights",
  "International Flavors",
  "Desserts & Sweets",
  "Healthy Eats",
  "Quick & Easy Supper",
]);
const selectedFoodType = ref<string>("All Types");

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
</script>
