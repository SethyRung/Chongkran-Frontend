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

    <div class="flex flex-wrap justify-center gap-4">
      <div
        v-for="recipe in allRecipes"
        :key="recipe.id"
        class="group relative w-full max-w-2xs p-6 flex flex-col gap-3 justify-between bg-white border border-gray-200 rounded-lg shadow-sm hover:border-orange-400 transition-all"
      >
        <div class="space-y-3">
          <NuxtImg
            :src="recipe.img"
            class="w-full h-60 object-cover rounded group-hover:scale-105 transition-all"
          />
          <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900">
            {{ recipe.name }}
          </h5>
          <UBadge :label="recipe.type" variant="soft" color="primary" />
        </div>
        <div class="flex gap-1">
          <UButton
            icon="i-lucide-eye"
            label="See Complete Recipe"
            block
            :to="`recipes/${recipe.id}`"
          />
          <UButton
            icon="i-lucide-heart"
            variant="subtle"
            :color="recipe.isFavorite ? 'primary' : 'neutral'"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
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

const allRecipes = ref<
  { id: string; img: string; name: string; type: string; isFavorite: boolean }[]
>([
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
